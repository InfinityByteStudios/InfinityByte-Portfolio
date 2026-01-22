document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
      
  function toggleMenu() {
    menu.classList.toggle('show');
  }
  
  window.toggleMenu = toggleMenu;
  
  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => { menu.classList.remove('show');
    });
  });
});