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

// ============================================
// ===== لمام AI =====
// ============================================
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
    addLlamamMessage('مرحباً! أنا لمام، مساعدك الذكي في منصة مُلم 🎓\nيمكنني مساعدتك في:\n• كتابة وتقييم خطاب الحافز\n• نصائح للـ CV\n• تحليل الصور والملفات\n• توجيهك لأفضل منحة تناسبك\n\n⚠️ الحد الأقصى 15 رسالة لكل محادثة، انتقِ أسئلتك بعناية.', 'ai');

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

// ============================================
// State
// ============================================
let llamamHistory = [];
let llamamFile = null;
const MAX_MESSAGES = 15;

// ============================================
// Preview attached file
// ============================================
function previewLlamamFile(input) {
  const file = input.files[0];
  if (!file) return;
  llamamFile = file;
  const preview = document.getElementById('llamam-file-preview');
  preview.style.display = 'block';
  preview.textContent = `📎 ${file.name}`;
}

// ============================================
// Add message bubble to chat
// Returns the inner text element (msg) for streaming updates
// ============================================
function addLlamamMessage(text, sender) {
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

  // Return msg element so streaming can update its text directly
  return msg;
}

// ============================================
// Rating buttons — FIX: consistent name (rateLlamam)
// ============================================
function rateLlamam(btn, rating) {
  const parent = btn.parentElement;
  parent.innerHTML = `<span style="font-size:12px; color:#aaa;">${rating === '👍' ? '✅ شكراً على تقييمك!' : '🙏 سنحاول التحسين!'}</span>`;
}

// ============================================
// Convert file to base64
// ============================================
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================
// Send message to backend
// ============================================
async function sendToLlamam() {
  const input = document.getElementById('llamam-input');
  const text = input.value.trim();
  if (!text && !llamamFile) return;

  // FIX: Enforce 15-message limit
  const userMsgCount = llamamHistory.filter(m => m.role === 'user').length;
  if (userMsgCount >= MAX_MESSAGES) {
    addLlamamMessage('⚠️ وصلت للحد الأقصى (15 رسالة). يرجى تحديث الصفحة لبدء محادثة جديدة.', 'ai');
    return;
  }

  input.value = '';
  addLlamamMessage(text, 'user');

  // FIX: Build message content — support file attachments
  let userContent;
  if (llamamFile) {
    const base64Data = await fileToBase64(llamamFile);
    const isImage = llamamFile.type.startsWith('image/');
    userContent = [
      isImage
        ? { type: 'image', source: { type: 'base64', media_type: llamamFile.type, data: base64Data } }
        : { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64Data } },
      { type: 'text', text: text || 'حلل هذا الملف' }
    ];
    // Reset file after sending
    llamamFile = null;
    const preview = document.getElementById('llamam-file-preview');
    preview.style.display = 'none';
    preview.textContent = '';
    document.getElementById('llamam-file').value = '';
  } else {
    userContent = text;
  }

  llamamHistory.push({ role: 'user', content: userContent });

  // Show typing indicator
  const typingEl = document.createElement('div');
  typingEl.id = 'llamam-typing';
  typingEl.textContent = '...يكتب';
  typingEl.style.cssText = 'font-size:13px; color:#aaa; align-self:flex-start;';
  document.getElementById('llamam-messages').appendChild(typingEl);

  try {
    const response = await fetch('https://molim.team/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: llamamHistory })
    });

    document.getElementById('llamam-typing')?.remove();

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullReply = '';

    // FIX: addLlamamMessage returns the msg element directly — update it in the stream loop
    const messageElement = addLlamamMessage('', 'ai');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullReply += chunk;
      // Update the text node directly — no querySelector needed
      messageElement.textContent = fullReply;
      document.getElementById('llamam-messages').scrollTop = document.getElementById('llamam-messages').scrollHeight;
    }

    llamamHistory.push({ role: 'assistant', content: fullReply });

  } catch (err) {
    document.getElementById('llamam-typing')?.remove();
    addLlamamMessage('عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.', 'ai');
  }
}