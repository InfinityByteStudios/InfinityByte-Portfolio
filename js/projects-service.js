const fallbackProjects = [
  {
    title: "Glitchrealm Games",
    description:
      "Creative game development studio showcasing innovative game designs and interactive experiences.",
    url: "https://glitchrealm.ca",
    imageUrl: "Assests/Project Logos/GlitchRealm Games FULL LOGO.png",
    badge: "Game Development",
    ctaText: "Visit Site",
    createdAt: 1
  },
  {
    title: "Glitchrealm Foundation",
    description:
      "A community-driven initiative focused on supporting and uplifting game developers and creators.",
    url: "https://foundation.glitchrealm.ca",
    imageUrl: "Assests/Project Logos/The GlitchRealm Foundation FULL LOGO.png",
    badge: "Community",
    ctaText: "Visit Site",
    createdAt: 2
  },
  {
    title: "Space Shooter Master",
    description:
      "An engaging space shooter game featuring fast-paced gameplay and interactive mechanics.",
    url: "https://spaceshooter-master.netlify.app/",
    imageUrl: "Assests/Project Logos/SpaceShooter Master.png",
    badge: "Game Project",
    ctaText: "Play Game",
    createdAt: 3
  },
  {
    title: "QuestForge",
    description:
      "An immersive quest-based game adventure with dynamic storytelling and exploration.",
    url: "https://questforge-game.netlify.app/",
    imageUrl: "Assests/Project Logos/QuestForge FULL LOGO.png",
    badge: "Game Project",
    ctaText: "Play Game",
    createdAt: 4
  }
];

export async function fetchProjects() {
  let dbProjects = [];
  try {
    const response = await fetch("/api/projects", {
      headers: { Accept: "application/json" }
    });

    if (response.ok) {
      const payload = await response.json();
      dbProjects = Array.isArray(payload.projects) ? payload.projects : [];
    } else {
      console.warn("Projects API returned " + response.status + "; using fallback list.");
    }
  } catch (error) {
    console.warn("Projects API request failed; using fallback list.", error);
  }

  const normalized = dbProjects.map((project) => ({
    id: project.id,
    title: project.title || "Untitled Project",
    description: project.description || "",
    url: project.url || "#",
    imageUrl: project.imageUrl || "",
    badge: project.badge || "Project",
    ctaText: project.ctaText || "Open",
    createdAt: Number(project.createdAt) || 0
  }));

  const existingKeys = new Set(
    normalized.map((project) => (project.title + "|" + project.url).trim().toLowerCase())
  );

  const missingFallbacks = fallbackProjects.filter((project) => {
    const key = (project.title + "|" + project.url).trim().toLowerCase();
    return !existingKeys.has(key);
  });

  const projects = [...normalized, ...missingFallbacks];
  projects.sort((a, b) => b.createdAt - a.createdAt);
  return projects;
}

export async function addProject(projectData, idToken) {
  if (!idToken) {
    throw new Error("Sign-in token is required to save a project.");
  }

  const payload = {
    title: projectData.title.trim(),
    description: projectData.description.trim(),
    url: projectData.url.trim(),
    imageUrl: projectData.imageUrl.trim(),
    badge: (projectData.badge || "").trim() || "Project",
    ctaText: (projectData.ctaText || "").trim() || "Open"
  };

  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + idToken
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = "Could not save project.";
    try {
      const data = await response.json();
      if (data && data.error) {
        message = data.error;
      }
    } catch (error) {
      // Ignore parse error and use default message.
    }
    throw new Error(message);
  }

  const data = await response.json();
  return data.project;
}
