document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const filename = currentPath.split('/').pop() || 'index.html';

  const menuLinks = document.querySelectorAll('.menu a');
  menuLinks.forEach(link => {
    if (link.getAttribute('href') === filename) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const profileIcon = document.querySelector('.profile-icon circle');
  if (profileIcon) {
    profileIcon.setAttribute('fill', 'url(your-profile-photo.jpg)');
  }

  document.body.style.backgroundImage = 'url(your-background-image.jpg)';
});