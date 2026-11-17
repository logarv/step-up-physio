export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      reply: "GEMINI_API_KEY Vercel Environment Variables mein set karein. Filhal apne posture ko seedha rakhein aur dard zyada hone par Bookings tab se appointment lein."
    });
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
                  text: `You are the AI Physiotherapy Assistant for StepUp Physiotherapy & Rehabilitation Center. Give safe, concise, step-by-step home rehab exercises and posture advice in simple Roman Urdu or English. Always remind the patient to book an appointment if they have severe pain or numbness. Patient query: ${prompt}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Stay hydrated and maintain gentle movement.";
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Failed to reach Gemini API" });
  }
}