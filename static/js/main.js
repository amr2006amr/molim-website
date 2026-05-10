//عداد الوقت المتبقي لانتهاء المنحة
function getCountdown(deadline) {
  const today = new Date();
  const end = new Date(deadline);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return null;
  if (diff === 0) return { text: '⚠️ آخر يوم للتقديم!', urgent: true };
  if (diff <= 7) return { text: `⚠️ باقي ${diff} أيام فقط!`, urgent: true };
  return { text: `📅 باقي ${diff} يوم على إغلاق التقديم`, urgent: false };
}


//جلب البيانات وعرضها
fetch('data/scholarships.json')
  .then(res => res.json())
  .then(scholarships => {
    const grid = document.getElementById('scholarships-grid');
    if (!grid) return;

    scholarships.forEach(s => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <img class="card-flag" src=${s.flag} alt="flag"/>
        <h3>${s.name}</h3>
        <p class="country">📍 ${s.country}</p>
        <p class="degree">🎓 ${s.degree}</p>
        <span class="status ${s.open ? 'open' : 'closed'}">
          ${s.open ? '✅ التقديم مفتوح' : '🔴 التقديم مغلق'}
        </span>
        <p class="desc">${s.description}</p>
        <a href="scholarship.html?id=${s.id}" class="btn-details">تفاصيل المنحة كاملة ←</a>
        <a href="${s.link}" target="_blank">زيارة الموقع الرسمي ↗</a>
      `;

      grid.appendChild(card);
    });
  })
  .catch(err => console.error('خطأ في تحميل المنح:', err));

const grid = document.getElementById('open-scholarships-grid');
if (grid) {
  for (let i = 0; i < 4; i++) {
    grid.innerHTML += `
      <div class="skeleton-card">
        <div class="skeleton-line skeleton-flag"></div>
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-text"></div>
        <div class="skeleton-line skeleton-text wide"></div>
        <div class="skeleton-line skeleton-btn"></div>
        <div class="skeleton-line skeleton-btn"></div>
      </div>
    `;
  }
}

  fetch('data/scholarships.json?v=' + Date.now())
  .then(res => res.json())
  .then(scholarships => {
    const grid = document.getElementById('open-scholarships-grid');
    if (!grid) return
    grid.innerHTML = '';
   


    const openOnly = scholarships.filter(s => s.open === true);

    if (openOnly.length === 0) {
      grid.innerHTML = '<p style="text-align:center; color:#aaa;">لا توجد منح مفتوحة حالياً</p>';
      return;
    }

    openOnly.forEach(s => {
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
        <span class="status open">✅ التقديم مفتوح</span>
        <p class="desc">${s.description || ''}</p>
        ${s.open_date ? `<p class="deadline">📅 موعد فتح التقديم: ${s.open_date}</p>` : ''}
        ${(() => {
        const cd = getCountdown(s.deadline);
        return cd ? `<div class="countdown ${cd.urgent ? 'urgent' : ''}">${cd.text}</div>` : '';
        })()}
        <p class="deadline">📅 آخر موعد للتقديم: ${s.deadline}</p>
        <a href="scholarship.html?id=${s.id}" class="btn-details" style="background:white; color:#ff4500; border:none;">تفاصيل المنحة كاملة ←</a>
        <a href="${s.link}" target="_blank" class="btn-details" style="background:white; color:#ff4500; border:none;">زيارة الموقع الرسمي ↗</a>
        <a class="btn-details" style="background:white; color:#ff4500; border:none; cursor:pointer;" onclick="shareScholarship('${s.id}', '${s.name}', '${s.country}')">📤 شارك المنحة</a>
      `;
      grid.appendChild(card);
      setTimeout(() => card.classList.add('visible'), 100);
    });
  })
  .catch(err => console.error('خطأ:', err));
  window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

//الدالة التي تشغل زر شارك المنحة في خانة المنح المفتوحة
function shareScholarship(id, name, country) {
  const url = `${window.location.origin}/scholarship/${id}`;
  const text = `🎓 ${name}\n`;

  if (navigator.share) {
    navigator.share({ title: `منحة ${name}`, text, url });
  } else {
    navigator.clipboard.writeText(text + '\n' + url);
    alert('✅ تم نسخ رابط المنحة!');
  }
}

//قائمة المنيو
function toggleMenu() {
  const nav = document.getElementById('main-nav');
  nav.classList.toggle('open');
}

// زر العودة للأعلى
const btn = document.createElement('button');
btn.id = 'back-to-top';
btn.innerHTML = '↑';
document.body.appendChild(btn);

btn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// أنيميشن السكرول
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

window.addEventListener('scroll', () => {
  // زر العودة
  btn.style.display = window.scrollY > 300 ? 'block' : 'none';

  // إخفاء الهيدر
  const header = document.querySelector('header');
  if (window.scrollY > 80) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }

  // أنيميشن الكروت
  document.querySelectorAll('.card, .about-card').forEach(card => {
    observer.observe(card);
  });
});

// ازرار التمرير الافقي
function slideCards(direction) {
  const grid = document.getElementById('open-scholarships-grid');
  const card = grid.querySelector('.card');
  if (!card) return;
  const cardWidth = card.offsetWidth + 20;
  grid.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
}