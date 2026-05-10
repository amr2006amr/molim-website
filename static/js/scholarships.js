let allScholarships = [];

fetch('data/scholarships.json?v=' + Date.now())
  .then(res => res.json())
  .then(data => {
    allScholarships = data;
    renderCards(allScholarships);
  })
  .catch(err => console.error('خطأ:', err));

function renderCards(list) {
  const grid = document.getElementById('scholarships-grid');
  const noResults = document.getElementById('no-results');
  grid.innerHTML = '';

  if (list.length === 0) {
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  list.forEach(s => {
    const flagHtml = s.flag && s.flag.startsWith('http')
      ? `<img class="card-flag" src="${s.flag}" alt="flag"/>`
      : `<span class="card-flag" style="font-size:40px; line-height:1; display:block; margin-bottom:10px;">${s.flag || ''}</span>`;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      ${flagHtml}
      <h3>${s.name}</h3>
      <p class="country">📍 ${s.country}</p>
      <p class="degree">🎓 ${s.degree}</p>
      <span class="status ${s.open ? 'open' : 'closed'}">
        ${s.open ? '✅ التقديم مفتوح' : '🔴 التقديم مغلق'}
      </span>
      <p class="desc">${s.description || ''}</p>
      ${s.open_date ? `<p class="deadline">📅 موعد فتح التقديم: ${s.open_date}</p>` : ''}
      <p class="deadline">📅  آخر موعد للتقديم: ${s.deadline}</p>
      <a href="scholarship.html?id=${s.id}" class="btn-details">تفاصيل المنحة كاملة ←</a>
      <a href="${s.link}" target="_blank">زيارة الموقع الرسمي ↗</a>
      <a class="btn-details" onclick="shareScholarship('${s.id}', '${s.name}', '${s.country}')" style="cursor:pointer;">
      📤 شارك المنحة
      </a>
    `;
    grid.appendChild(card);

    observeCards();
  });
}

function filterCards() {
  const search = document.getElementById('search').value.toLowerCase();
  const status = document.getElementById('filter-status').value;
  const degree = document.getElementById('filter-degree').value;

  const filtered = allScholarships.filter(s => {
    const matchSearch = s.name.includes(search) || s.country.includes(search);
    const matchStatus = status === 'all' || (status === 'open' ? s.open : !s.open);
    const matchDegree = degree === 'all' || s.degree.includes(degree);
    return matchSearch && matchStatus && matchDegree;
  });

  renderCards(filtered);
}

document.getElementById('search').addEventListener('input', filterCards);
document.getElementById('filter-status').addEventListener('change', filterCards);
document.getElementById('filter-degree').addEventListener('change', filterCards);

function shareScholarship(id, name, country) {
  const url = `${window.location.origin}/scholarship/${id}`;
  if (navigator.share) {
    navigator.share({
      title: `منحة ${name}`,
      text: `🎓 اكتشف منحة ${name} في ${country} على منصة مُلم!`,
      url: url
    });
  } else {
    // للمتصفحات اللي ما تدعم Web Share API
    navigator.clipboard.writeText(url);
    alert('✅ تم نسخ رابط المنحة!');
  }
}

//اضهار الكروت في خانة المنح
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

function observeCards() {
  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
}

// زر العودة للأعلى
const btn = document.createElement('button');
btn.id = 'back-to-top';
btn.innerHTML = '↑';
document.body.appendChild(btn);

btn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  btn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

// قائمة الهامبرغر
function toggleMenu() {
  const nav = document.getElementById('main-nav');
  nav.classList.toggle('open');
}

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  if (window.scrollY > 80) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
});