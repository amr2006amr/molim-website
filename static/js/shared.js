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

// ===== لمام AI =====
const llamamBtn = document.createElement('button');
llamamBtn.id = 'llamam-btn';
llamamBtn.innerHTML = '🤖 لمام';
llamamBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  left: 30px;
  background: #ff4500;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 4px 15px rgba(255,69,0,0.4);
`;
document.body.appendChild(llamamBtn);

const llamamBox = document.createElement('div');
llamamBox.id = 'llamam-box';
llamamBox.style.cssText = `
  position: fixed;
  bottom: 90px;
  left: 30px;
  width: 350px;
  height: 520px;
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  display: none;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
  border: 1px solid var(--card-border);
`;
llamamBox.innerHTML = `
  <div style="background:#ff4500; padding:15px; display:flex; justify-content:space-between; align-items:center;">
    <span style="color:white; font-weight:bold; font-size:16px;">🤖 لمام — مساعدك الذكي</span>
    <button onclick="document.getElementById('llamam-box').style.display='none'" 
            style="background:none; border:none; color:white; font-size:20px; cursor:pointer;">✕</button>
  </div>
  <div id="llamam-messages" style="flex:1; overflow-y:auto; padding:15px; display:flex; flex-direction:column; gap:10px;"></div>
  <div id="llamam-quick" style="padding:0 10px 8px; display:flex; gap:6px; flex-wrap:wrap;"></div>
  <div style="padding:10px; border-top:1px solid var(--card-border); display:flex; flex-direction:column; gap:8px;">
    <div style="display:flex; gap:8px; align-items:center;">
      <label for="llamam-file" style="cursor:pointer; font-size:22px;" title="إرفاق صورة أو PDF">📎</label>
      <input id="llamam-file" type="file" accept="image/*,.pdf" style="display:none" onchange="previewLlamamFile(this)"/>
      <input id="llamam-input" type="text" placeholder="اسألني أي شيء..." 
             style="flex:1; padding:10px; border-radius:10px; border:1px solid var(--card-border); 
                    background:var(--card-bg); color:var(--text-color); font-size:14px; outline:none;"
             onkeydown="if(event.key==='Enter') sendToLlamam()"/>
      <button onclick="sendToLlamam()" 
              style="background:#ff4500; color:white; border:none; border-radius:10px; 
                     padding:10px 15px; cursor:pointer; font-size:16px;">إرسال</button>
    </div>
    <div id="llamam-file-preview" style="display:none; font-size:12px; color:#ff4500; padding:0 5px;"></div>
  </div>
`;
document.body.appendChild(llamamBox);

const quickQuestions = [
  'كيف أكتب خطاب حافز قوي 📝',
  'كيف أكتب CV قوي 📄',
  'ساعدني أختار المنحة المناسبة 🎯'
];

llamamBtn.addEventListener('click', () => {
  const box = document.getElementById('llamam-box');
  box.style.display = box.style.display === 'none' ? 'flex' : 'none';
  if (box.style.display === 'flex' && document.getElementById('llamam-messages').children.length === 0) {
    addLamamMessage('مرحباً! أنا لمام، مساعدك الذكي في منصة مُلم 🎓\nيمكنني مساعدتك في:\n• كتابة وتقييم خطاب الحافز\n• نصائح للـ CV\n• تحليل الصور والملفات\n• الإجابة عن اي سؤال يتعلق بموضوع المنح الدراسية\n\n⚠️ الحد الأقصى 15 رسالة لكل محادثة، انتقِ أسئلتك بعناية.', 'ai');

    const quickDiv = document.getElementById('llamam-quick');
    quickDiv.innerHTML = '';
    quickQuestions.forEach(q => {
      const btn = document.createElement('button');
      btn.textContent = q;
      btn.style.cssText = `
        background: var(--card-bg);
        border: 1px solid #ff4500;
        color: #ff4500;
        border-radius: 20px;
        padding: 5px 10px;
        font-size: 12px;
        cursor: pointer;
        white-space: nowrap;
      `;
      btn.onclick = () => {
        document.getElementById('llamam-input').value = q.replace(/[📝📄🎯]/g, '').trim();
        sendToLlamam();
        quickDiv.innerHTML = '';
      };
      quickDiv.appendChild(btn);
    });
  }
});

let llamamHistory = [];
let llamamFile = null;

function previewLlamamFile(input) {
  const file = input.files[0];
  if (!file) return;
  llamamFile = file;
  const preview = document.getElementById('llamam-file-preview');
  preview.style.display = 'block';
  preview.textContent = `📎 ${file.name}`;
}

function addLamamMessage(text, sender) {
  const msgs = document.getElementById('llamam-messages');
  const msg = document.createElement('div');
  msg.style.cssText = `
    padding: 10px 14px;
    border-radius: 12px;
    max-width: 85%;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    ${sender === 'user'
      ? 'background:#ff4500; color:white; align-self:flex-end; border-bottom-right-radius:4px;'
      : 'background:var(--card-border); color:var(--text-color); align-self:flex-start; border-bottom-left-radius:4px;'}
  `;
  msg.textContent = text;

  if (sender === 'ai') {
    const ratingDiv = document.createElement('div');
    ratingDiv.style.cssText = 'display:flex; gap:8px; margin-top:6px;';
    ratingDiv.innerHTML = `
      <button onclick="rateLlamam(this, '👍')" style="background:none; border:none; cursor:pointer; font-size:16px; opacity:0.6;">👍</button>
      <button onclick="rateLlamam(this, '👎')" style="background:none; border:none; cursor:pointer; font-size:16px; opacity:0.6;">👎</button>
    `;
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex; flex-direction:column; align-self:flex-start; max-width:85%;';
    wrapper.appendChild(msg);
    wrapper.appendChild(ratingDiv);
    msgs.appendChild(wrapper);
  } else {
    msgs.appendChild(msg);
  }

  msgs.scrollTop = msgs.scrollHeight;
}

function rateLlamam(btn, rating) {
  const parent = btn.parentElement;
  parent.innerHTML = `<span style="font-size:12px; color:#aaa;">${rating === '👍' ? '✅ شكراً على تقييمك!' : '🙏 سنحاول التحسين!'}</span>`;
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// تعديل الدالة لتعمل مع ملف السيرفر chat.js
async function sendToLlamam() {
  const userMessages = llamamHistory.filter(m => m.role === 'user').length;
  if (userMessages >= 15) {
    addLamamMessage('وصلت للحد الأقصى 15 رسالة. أعد تحميل الصفحة لمحادثة جديدة.', 'ai');
    return;
  }

  const input = document.getElementById('llamam-input');
  const text = input.value.trim();
  if (!text && !llamamFile) return;

  input.value = '';
  document.getElementById('llamam-quick').innerHTML = '';
  const displayText = llamamFile ? `${text || ''} 📎 ${llamamFile.name}` : text;
  addLamamMessage(displayText, 'user');

  // إعداد المحتوى (Text / Files)
  let userContent = [];
  if (llamamFile) {
    const base64 = await fileToBase64(llamamFile);
    const isImage = llamamFile.type.startsWith('image/');
    userContent.push({
      type: isImage ? 'image' : 'document',
      source: { type: 'base64', media_type: llamamFile.type, data: base64 }
    });
    document.getElementById('llamam-file-preview').style.display = 'none';
    llamamFile = null;
    document.getElementById('llamam-file').value = '';
  }
  if (text) userContent.push({ type: 'text', text: text });

  llamamHistory.push({ role: 'user', content: userContent });

  // إضافة علامة "يكتب..."
  const typing = document.createElement('div');
  typing.id = 'llamam-typing';
  typing.style.cssText = 'padding:10px 14px; border-radius:12px; background:var(--card-border); color:var(--text-color); align-self:flex-start; font-size:14px;';
  typing.textContent = '...يكتب';
  document.getElementById('llamam-messages').appendChild(typing);
  document.getElementById('llamam-messages').scrollTop = document.getElementById('llamam-messages').scrollHeight;

  try {
    // الخطوة الثانية: إرسال الطلب لملف السيرفر المحلي بدلاً من Anthropic مباشرة
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          message: text, // إرسال النص الأساسي
          history: llamamHistory // إرسال التاريخ إذا أردت دعمه في السيرفر لاحقاً
      })
    });

    const data = await response.json();
    document.getElementById('llamam-typing')?.remove();

    // استخراج الرد وعرضه
    if (data.content && data.content[0]) {
      const reply = data.content[0].text;
      llamamHistory.push({ role: 'assistant', content: reply });
      addLamamMessage(reply, 'ai');
    } else {
      throw new Error("Invalid response format");
    }
  } catch (err) {
    document.getElementById('llamam-typing')?.remove();
    addLamamMessage('عذراً، حدث خطأ في الاتصال بـ "لمام". تأكد من رفع الموقع على Vercel وإضافة الـ API Key.', 'ai');
  }
}