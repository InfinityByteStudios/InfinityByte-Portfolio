import { fetchProjects } from "./projects-service.js";

function createProjectCard(project) {
  const link = document.createElement("a");
  link.className = "project-card";
  link.href = project.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const icon = document.createElement("img");
  icon.className = "project-icon";
  icon.src = project.imageUrl || "Assests/InfinityByte.png";
  icon.alt = project.title;

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = project.badge;

  const title = document.createElement("div");
  title.className = "project-title";
  title.textContent = project.title;

  const description = document.createElement("p");
  description.className = "project-description";
  description.textContent = project.description;

  const cta = document.createElement("span");
  cta.className = "project-link";
  cta.textContent = project.ctaText;

  link.append(icon, badge, title, description, cta);
  return link;
}

async function renderProjects() {
  const container = document.getElementById("projectsGrid");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  try {
    const projects = await fetchProjects();
    projects.forEach((project) => {
      container.appendChild(createProjectCard(project));
    });
  } catch (error) {
    container.innerHTML =
      "<p style='grid-column:1 / -1;color:#fda4af;'>Could not load projects right now. Please try again later.</p>";
  }
}

window.addEventListener("DOMContentLoaded", renderProjects);
