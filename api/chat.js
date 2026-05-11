export default async function handler(req, res) {
  const { message } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY, // المفتاح هنا مخفي تماماً
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      system: "أنت مساعد ذكي اسمك لمام في منصة ملم...",
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}