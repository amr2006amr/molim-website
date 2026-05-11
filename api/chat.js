export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;

    const messages = [];
    if (history && history.length > 0) {
      history.forEach(m => {
        if (m.role === 'user') {
          const textContent = Array.isArray(m.content)
            ? m.content.find(c => c.type === 'text')?.text || ''
            : m.content;
          if (textContent) messages.push({ role: 'user', content: textContent });
        } else if (m.role === 'assistant') {
          messages.push({ role: 'assistant', content: m.content });
        }
      });
    } else {
      messages.push({ role: 'user', content: message });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: 'أنت مساعد ذكي اسمك لمام في منصة مُلم. ردودك ودودة وباللهجة البيضاء وتهتم بالمنح الدراسية.',
        messages: messages,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
}