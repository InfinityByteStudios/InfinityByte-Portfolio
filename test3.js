const { getDatabase } = require("@netlify/database");
async function test() {
  const db = getDatabase();
  const rows = await db.sql`SELECT * FROM projects`;
  console.log(Array.isArray(rows));
}
test();
