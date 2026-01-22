import { init, API_URL, getToken } from './handler.js';

const copyToken = document.getElementById('token');
const apiURL = document.getElementById('api-url');

document.addEventListener('DOMContentLoaded', async () => {
  await init();
  
  apiURL.textContent = API_URL;
  copyToken.addEventListener('click', async () => {
    try {
      copyToken.disabled = true;
      copyToken.textContent = 'Loading...';
      
      const userToken = await getToken();
      await navigator.clipboard.writeText(userToken);
      
      copyToken.textContent = 'Copied!';
    } catch (error) {
      copyToken.textContent = 'Failed';
      console.error(`Failed to copy token: ${error.message}`);
    } finally {
      setTimeout(() => {
        copyToken.textContent = 'Copy Token';
        copyToken.disabled = false;
      }, 2000);
    }
  });
});