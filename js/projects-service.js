import {
  addDoc,
  collection,
  getDocs,
  query
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getDb } from "./firebase-config.js";

async function getProjectsCollection() {
  const db = await getDb();
  return collection(db, "projects");
}

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
  const projectsCollection = await getProjectsCollection();
  const snapshot = await getDocs(query(projectsCollection));

  if (snapshot.empty) {
    return fallbackProjects;
  }

  const projects = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "Untitled Project",
      description: data.description || "",
      url: data.url || "#",
      imageUrl: data.imageUrl || "",
      badge: data.badge || "Project",
      ctaText: data.ctaText || "Open",
      createdAt: Number(data.createdAt) || 0
    };
  });

  projects.sort((a, b) => b.createdAt - a.createdAt);
  return projects;
}

export async function addProject(projectData) {
  const projectsCollection = await getProjectsCollection();

  const payload = {
    title: projectData.title.trim(),
    description: projectData.description.trim(),
    url: projectData.url.trim(),
    imageUrl: projectData.imageUrl.trim(),
    badge: projectData.badge.trim() || "Project",
    ctaText: projectData.ctaText.trim() || "Open",
    createdAt: Date.now()
  };

  return addDoc(projectsCollection, payload);
}
