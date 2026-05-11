const params = new URLSearchParams(window.location.search);
let id = params.get('id');

if (!id) {
  const pathParts = window.location.pathname.split('/');
  id = pathParts[pathParts.length - 1];
}

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

        <button onclick="shareScholarship()" class="btn-main" style="display:block; width:100%; text-align:center; margin-top:10px; cursor:pointer;">
        📤 شارك تفاصيل المنحة
        </button>

        <a href="scholarships.html" class="btn-main" style="display:block; text-align:center; margin-top:10px;">
          ← العودة لجميع المنح
        </a>

      </div>
    `;
  });

 function shareScholarship() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  fetch('/data/scholarships.json?v=' + Date.now())
    .then(res => res.json())
    .then(scholarships => {
      const s = scholarships.find(s => s.id === id);
      if (!s) return;

      let text = `🎓 ${s.name}\n`;
      if (s.name_en) text += `${s.name_en}\n`;
      text += `\n🌍 الدولة: ${s.country}`;
      text += `\n📚 المراحل: ${s.degree}`;
      if (s.language) text += `\n🗣️ لغة الدراسة: ${s.language}`;
      if (s.open_date) text += `\n📅 فتح التقديم: ${s.open_date}`;
      text += `\n⏰ آخر موعد: ${s.deadline}`;

      if (s.majors && s.majors.length) {
        text += `\n\n📚 التخصصات المتاحة:\n` + s.majors.map(m => `• ${m}`).join('\n');
      }

      if (s.benefits && s.benefits.length) {
        text += `\n\n🎁 المميزات:\n` + s.benefits.map(b => `• ${b}`).join('\n');
      }

      if (s.requirements && s.requirements.length) {
        text += `\n\n📌 الشروط:\n` + s.requirements.map(r => `• ${r}`).join('\n');
      }

      if (s.documents) {
        if (s.documents.required && s.documents.required.length) {
          text += `\n\n📎 الملفات الإجبارية:\n` + s.documents.required.map(d => `• ${d}`).join('\n');
        }
        if (s.documents.optional && s.documents.optional.length) {
          text += `\n\n🟡 الملفات الاختيارية:\n` + s.documents.optional.map(d => `• ${d}`).join('\n');
        }
      }

      if (s.notes) text += `\n\n📝 ملاحظات: ${s.notes}`;

      const cleanUrl = `https://molim.team/scholarship/${id}`;
      text += `\n\n🔗 ${cleanUrl}`;
      text += `\n\nعبر منصة مُلم للمنح الدراسية 🎓`;

      if (navigator.share) {
        navigator.share({ text: text });
      } else {
        const encoded = encodeURIComponent(text);
        const modal = document.createElement('div');
        modal.style.cssText = `
          position:fixed; inset:0; background:rgba(0,0,0,0.7);
          display:flex; align-items:center; justify-content:center; z-index:9999;
        `;
        modal.innerHTML = `
          <div style="background:var(--card-bg); padding:30px; border-radius:16px;
                      text-align:center; max-width:340px; width:90%;">
            <h3 style="margin-bottom:20px; color:var(--primary-color)">📤 شارك المنحة</h3>
            <a href="https://wa.me/?text=${encoded}" target="_blank"
               style="display:block; background:#25D366; color:white; padding:12px;
                      border-radius:10px; margin-bottom:10px; text-decoration:none;">
              💬 واتساب
            </a>
            <a href="https://t.me/share/url?url=${encodeURIComponent(cleanUrl)}&text=${encoded}" target="_blank"
               style="display:block; background:#0088cc; color:white; padding:12px;
                      border-radius:10px; margin-bottom:10px; text-decoration:none;">
              ✈️ تيليجرام
            </a>
            <button onclick="navigator.clipboard.writeText(decodeURIComponent('${encoded}')).then(()=>alert('✅ تم النسخ!'))"
               style="display:block; width:100%; background:var(--primary-color); color:white;
                      padding:12px; border-radius:10px; margin-bottom:15px; border:none; cursor:pointer;">
              📋 نسخ النص
            </button>
            <button onclick="this.closest('div').parentElement.remove()"
               style="background:transparent; border:1px solid #aaa; padding:8px 20px;
                      border-radius:8px; cursor:pointer; color:var(--text-color)">
              إغلاق
            </button>
          </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
      }
    });
}