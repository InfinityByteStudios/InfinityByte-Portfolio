const { getDatabase } = require("@netlify/database");

let dbInstance;
function db() {
  if (!dbInstance) {
    dbInstance = getDatabase();
  }
  return dbInstance;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

function jsonResponse(statusCode, body, extraHeaders) {
  return {
    statusCode,
    headers: { ...JSON_HEADERS, ...(extraHeaders || {}) },
    body: JSON.stringify(body)
  };
}

function rowToProject(row) {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    url: row.url,
    imageUrl: row.image_url,
    badge: row.badge,
    ctaText: row.cta_text,
    createdAt: Number(row.created_at)
  };
}

async function listProjects() {
  try {
    const rows = await db().sql`
      SELECT id, title, description, url, image_url, badge, cta_text, created_at
      FROM projects
      ORDER BY created_at DESC
    `;
    return jsonResponse(
      200,
      { projects: rows.map(rowToProject) },
      { "Cache-Control": "public, max-age=30" }
    );
  } catch (error) {
    console.error("[projects] listProjects failed:", error && (error.stack || error.message));
    if (error && error.cause) {
      console.error("[projects] cause:", error.cause);
    }
    return jsonResponse(500, {
      error: "Failed to load projects."
    });
  }
}

async function verifyFirebaseIdToken(idToken) {
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 500, message: "FIREBASE_API_KEY is not configured." };
  }

  const response = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + apiKey,
    {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ idToken })
    }
  );

  if (!response.ok) {
    return { ok: false, status: 401, message: "Invalid or expired sign-in token." };
  }

  const data = await response.json();
  const user = Array.isArray(data.users) && data.users[0];
  if (!user) {
    return { ok: false, status: 401, message: "Sign-in token does not match a known user." };
  }

  return { ok: true, user };
}

async function createProject(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return jsonResponse(401, { error: "Missing bearer token." });
  }

  const verification = await verifyFirebaseIdToken(match[1]);
  if (!verification.ok) {
    return jsonResponse(verification.status, { error: verification.message });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(400, { error: "Request body must be valid JSON." });
  }

  const title = (payload.title || "").trim();
  const description = (payload.description || "").trim();
  const url = (payload.url || "").trim();
  const imageUrl = (payload.imageUrl || "").trim();
  const badge = (payload.badge || "").trim() || "Project";
  const ctaText = (payload.ctaText || "").trim() || "Open";

  if (!title || !description || !url || !imageUrl) {
    return jsonResponse(400, {
      error: "title, description, url, and imageUrl are required."
    });
  }

  try {
    const createdAt = Date.now();
    const [row] = await db().sql`
      INSERT INTO projects (title, description, url, image_url, badge, cta_text, created_at)
      VALUES (${title}, ${description}, ${url}, ${imageUrl}, ${badge}, ${ctaText}, ${createdAt})
      RETURNING id, title, description, url, image_url, badge, cta_text, created_at
    `;
    return jsonResponse(201, { project: rowToProject(row) });
  } catch (error) {
    console.error("[projects] createProject failed:", error && (error.stack || error.message));
    if (error && error.cause) {
      console.error("[projects] cause:", error.cause);
    }
    return jsonResponse(500, {
      error: "Failed to save project."
    });
  }
}

exports.handler = async function (event) {
  if (event.httpMethod === "GET") {
    return listProjects();
  }
  if (event.httpMethod === "POST") {
    return createProject(event);
  }
  return jsonResponse(405, { error: "Method not allowed." }, { Allow: "GET, POST" });
};
