// جلب id المنحة من الرابط
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// جلب بيانات المنح
fetch('data/scholarships.json')
  .then(res => res.json())
  .then(scholarships => {
    const s = scholarships.find(s => s.id === id);
    const container = document.getElementById('scholarship-details');

    if (!s) {
      container.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:100px;">المنحة غير موجودة 😔</p>';
      return;
    }

    // تغيير عنوان الصفحة
    document.title = `مُلم | ${s.name}`;

    container.innerHTML = `
      <div class="details-hero">
        <img src="${s.flag}" alt="flag" class="details-flag"/>
        <h1>${s.name}</h1>
        <p>${s.name_en}</p>
        <span class="status ${s.open ? 'open' : 'closed'}">
          ${s.open ? '✅ التقديم مفتوح' : '🔴 التقديم مغلق'}
        </span>
      </div>

      <div class="details-body">

        <div class="details-card">
          <h2>📋 معلومات عامة</h2>
          <p><strong>الدولة:</strong> ${s.country}</p>
          <p><strong>المراحل الدراسية:</strong> ${s.degree}</p>
          <p><strong>آخر موعد للتقديم:</strong> ${s.deadline}</p>
        </div>

        <div class="details-card">
          <h2>🎁 المميزات</h2>
          <ul>
            ${s.benefits.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>

        <div class="details-card">
          <h2>📌 الشروط والمتطلبات</h2>
          <ul>
            ${s.requirements.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
        ${s.documents ? `
        <div class="details-card">
        <h2>📎 الملفات المطلوبة</h2>
        ${s.documents.required ? `
        <p><strong>🔴 إجباري:</strong></p>
        <ul>${s.documents.required.map(d => `<li>${d}</li>`).join('')}</ul>
        ` : ''}
        ${s.documents.optional ? `
        <p style="margin-top:15px"><strong>🟡 اختياري / يقوي ملفك:</strong></p>
        <ul>${s.documents.optional.map(d => `<li>${d}</li>`).join('')}</ul>
          ` : ''}
        </div>
        ` : ''}

        <div class="details-card">
          <h2>📝 تفاصيل إضافية</h2>
          <p>${s.description}</p>
        </div>

        <a href="${s.link}" target="_blank" class="btn-main" style="display:block; text-align:center; margin-top:20px;">
          🌐 زيارة الموقع الرسمي للتقديم
        </a>

        <a href="scholarships.html" class="btn-details" style="display:block; text-align:center; margin-top:10px;">
          ← العودة لجميع المنح
        </a>

      </div>
    `;
  });