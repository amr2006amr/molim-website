export default async function handler(req, res) {
  // هذا السطر يحل مشكلة الـ 405 ويسمح فقط بطلبات POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        system: "أنت مساعد ذكي اسمك لمام في منصة ملم. ردودك ودودة وباللهجة البيضاء وتهتم بالمنح الدراسية.",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في السيرفر' });
  }
}