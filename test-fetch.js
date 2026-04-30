const fs = require("fs");
const code = fs.readFileSync("js/projects-service.js", "utf-8");
const mockFetch = async () => ({
  ok: true,
  json: async () => ({
    projects: [
      {
        "id": "1",
        "title": "SwitchFloor",
        "description": "...",
        "url": "https://sprig.hackclub.com/~/dtJQAbmd0THxsU1RpT6H",
        "imageUrl": "https://sprig.hackclub.com/logo4.png",
        "badge": "Game Project",
        "ctaText": "Play Game",
        "createdAt": 1775606742290
      }
    ]
  })
});
global.fetch = mockFetch;
const m = require("module");
// Quick hack to evaluate ES module in CJS
import('./js/projects-service.js').then(m => {
  m.fetchProjects().then(p => console.log(JSON.stringify(p, null, 2)));
});
