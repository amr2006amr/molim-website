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