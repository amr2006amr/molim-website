// جلب بيانات المنح وعرضها
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

  fetch('data/scholarships.json?v=' + Date.now())
  .then(res => res.json())
  .then(scholarships => {
    const grid = document.getElementById('open-scholarships-grid');
    if (!grid) return;

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
        <p class="deadline">📅 آخر موعد للتقديم: ${s.deadline}</p>
        <a href="scholarship.html?id=${s.id}" class="btn-details" style="background:white; color:#ff4500; border:none;">تفاصيل المنحة كاملة ←</a>
        <a href="${s.link}" target="_blank" class="btn-details" style="background:white; color:#ff4500; border:none;">زيارة الموقع الرسمي ↗</a>
        <a class="btn-details" style="background:white; color:#ff4500; border:none; cursor:pointer;" onclick="shareScholarship('${s.id}', '${s.name}', '${s.country}')">📤 شارك المنحة</a>
      `;
      grid.appendChild(card);
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
  const url = `${window.location.origin}/scholarship.html?id=${id}`;
  const text = `🎓 اكتشف منحة ${name} في ${country} على منصة مُلم!`;

  if (navigator.share) {
    navigator.share({ title: `منحة ${name}`, text, url });
  } else {
    navigator.clipboard.writeText(text + '\n' + url);
    alert('✅ تم نسخ رابط المنحة!');
  }
}