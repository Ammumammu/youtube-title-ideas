// api/groq.js — Groq proxy for this product
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const KEY = process.env.GROQ_API_KEY;
  if (!KEY) return res.status(500).json({ error: 'GROQ_API_KEY not set' });
  try {
    const { messages, model = 'llama-3.3-70b-versatile', max_tokens = 2000, temperature = 0.7, system } = req.body;
    const msgs = system ? [{ role: 'system', content: system }, ...(messages || [])] : (messages || []);
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({ model, messages: msgs, temperature, max_tokens }),
    });
    const data = await r.json();
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
