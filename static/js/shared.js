// ============================================
// Dark Mode
// ============================================
const darkModeToggle = document.getElementById('darkModeToggle');

function toggleDarkMode() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateToggleIcon(newTheme);
}

function updateToggleIcon(theme) {
  if (darkModeToggle) {
    darkModeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }
}

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', toggleDarkMode);
}

// ============================================
// Hamburger Menu (مشترك بين كل الصفحات)
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    // إغلاق القائمة عند الضغط على أي رابط
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }
});