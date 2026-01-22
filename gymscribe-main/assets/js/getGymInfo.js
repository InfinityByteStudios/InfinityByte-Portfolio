import { getGymInfo, logout, EMAIL_KEY } from './handler.js';

function getDate() {
  const now = new Date();
  
  const formattedDate = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  return formattedDate;
}

function account() {
  const email = document.getElementById('accountEmail');
  const logoutBtn = document.getElementById('logout');
  
  if (email) {
    const userEmail = localStorage.getItem(EMAIL_KEY);
    
    if (userEmail) {
      email.textContent = userEmail.split('@')[0].slice(0, 16);
    }
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
      logout();
    });
  }
}

async function initGymInfo() {
  const gymName = document.getElementById('gymInfoName');
  const gymId = document.getElementById('gymInfoId');
  const date = document.getElementById('gymInfoDate');
  
  try {
    date.textContent = getDate();
    gymName.textContent = 'Fetching gym data...';
    gymId.textContent = 'Fetching gym data...';
    
    const gym = await getGymInfo();
    
    if (gym.name === 'none' || gym.name === '') {
      gymName.textContent = 'Untitled, rename your gym on the "gym" page!';
    } else {
      gymName.textContent = gym.name;
    }
    gymId.textContent = `ID: ${gym.id}`;
  } catch (error) {
    console.error(`Error fetching gym info: ${error.message}`);
  }
}

account();
initGymInfo();

export { initGymInfo };