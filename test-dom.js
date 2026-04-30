const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

const dom = new JSDOM(fs.readFileSync("index.html", "utf-8"), { runScripts: "dangerously", resources: "usable" });
dom.window.fetch = async (url) => {
  if (url === "/api/projects") {
    return {
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
    };
  }
  return { ok: false };
};

setTimeout(() => {
  console.log(dom.window.document.getElementById("projectsGrid").innerHTML);
}, 2000);
