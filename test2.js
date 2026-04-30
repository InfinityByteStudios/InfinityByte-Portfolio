const { getDatabase } = require("@netlify/database");
async function test() {
  const db = getDatabase();
  const rows = await db.sql`SELECT * FROM projects`;
  console.log(typeof rows[0].created_at);
  console.log(rows[0].created_at);
}
test();
