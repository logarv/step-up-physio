export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ useLocalEngine: true });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are the official AI Physiotherapy Assistant for StepUp Physiotherapy & Rehabilitation Center (Consultant: Dr. Mubeen Riaz, DPT). Directly answer the patient's specific question in simple Roman Urdu or English with 3 numbered practical exercises, sets/reps, and posture precautions. Never give a generic one-line answer. Patient question: ${prompt}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(200).json({ useLocalEngine: true });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(200).json({ useLocalEngine: true });
  }
}
