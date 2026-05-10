const params = new URLSearchParams(window.location.search);
let id = params.get('id');

if (!id) {
  const pathParts = window.location.pathname.split('/');
  id = pathParts[pathParts.length - 1];
}
console.log('pathname:', window.location.pathname);
console.log('search:', window.location.search);
console.log('id:', id);

fetch('/data/scholarships.json?v=' + Date.now())
  .then(res => res.json())
  .then(scholarships => {
    const s = scholarships.find(s => s.id === id);
    const container = document.getElementById('scholarship-details');

    if (!s) {
      container.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:100px;">المنحة غير موجودة 😔</p>';
      return;
    }

    document.title = `مُلم | ${s.name}`;

    const flagHtml = s.flag && s.flag.startsWith('http')
      ? `<img src="${s.flag}" alt="flag" class="details-flag"/>`
      : `<span class="details-flag" style="font-size:60px; line-height:1;">${s.flag || ''}</span>`;

    container.innerHTML = `
      <div class="details-hero">
        ${flagHtml}
        <h1>${s.name}</h1>
        <p>${s.name_en || ''}</p>
        <span class="status ${s.open ? 'open' : 'closed'}">
          ${s.open ? '✅ التقديم مفتوح' : '🔴 التقديم مغلق'}
        </span>
      </div>

      <div class="details-body">

        <div class="details-card">
          <h2>📋 معلومات عامة</h2>
          <p><strong>الدولة:</strong> ${s.country}</p>
          <p><strong>المراحل الدراسية:</strong> ${s.degree}</p>
          ${s.language ? `<p><strong>لغة الدراسة:</strong> ${s.language}</p>` : ''}
          ${s.open_date ? `<p><strong>موعد فتح التقديم:</strong> ${s.open_date}</p>` : ''}
          <p><strong>آخر موعد للتقديم:</strong> ${s.deadline}</p>
        </div>

        ${s.majors && s.majors.length ? `
        <div class="details-card">
          <h2>📚 التخصصات المتاحة</h2>
          <ul>
         ${s.majors.map(m => `<li>${m}</li>`).join('')}
         </ul>
        </div>
        ` : ''}

        <div class="details-card">
          <h2>🎁 المميزات</h2>
          <ul>
            ${s.benefits.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>

       ${s.requirements && s.requirements.length ? `
      <div class="details-card">
        <h2>📌 الشروط والمتطلبات</h2>
        <ul>
          ${s.requirements.map(r => `<li>${r}</li>`).join('')}
       </ul>
      </div>
      ` : ''}

        ${s.documents ? `
        <div class="details-card">
          <h2>📎 الملفات المطلوبة</h2>
          ${s.documents.required ? `
            <p><strong>🔴 إجباري:</strong></p>
            <ul>${s.documents.required.map(d => `<li>${d}</li>`).join('')}</ul>
          ` : ''}
          ${s.documents.optional && s.documents.optional.length ? `
            <p style="margin-top:15px"><strong>🟡 اختياري / يقوي ملفك:</strong></p>
            <ul>${s.documents.optional.map(d => `<li>${d}</li>`).join('')}</ul>
          ` : ''}
        </div>
        ` : ''}

        ${s.notes ? `
        <div class="details-card">
         <h2>📝 تفاصيل إضافية</h2>
        <p>${s.notes}</p>
        </div>
        ` : ''}

        <a href="${s.link}" target="_blank" class="btn-main" style="display:block; text-align:center; margin-top:20px;">
          🌐 زيارة الموقع الرسمي للتقديم
        </a>

        <a href="scholarships.html" class="btn-main" style="display:block; text-align:center; margin-top:10px;">
          ← العودة لجميع المنح
        </a>

      </div>
    `;
  });