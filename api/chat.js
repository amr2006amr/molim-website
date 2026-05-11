export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, history } = req.body;

    const contents = [];
    if (history && history.length > 0) {
      history.forEach(m => {
        const text = Array.isArray(m.content)
          ? m.content.find(c => c.type === 'text')?.text || ''
          : m.content;
        if (text) contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text }]
        });
      });
    } else {
      contents.push({ role: 'user', parts: [{ text: message }] });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: 'أنت مساعد ذكي اسمك لمام في منصة مُلم. ردودك ودودة وباللهجة البيضاء وتهتم بالمنح الدراسية.' }]
          },
          contents
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      res.status(200).json({ content: [{ text: reply }] });
    } else {
      throw new Error('no reply');
    }
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
}