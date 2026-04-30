const { handler } = require("./netlify/functions/projects.js");
handler({ httpMethod: "GET" }).then(res => console.log(JSON.stringify(res, null, 2))).catch(console.error);
