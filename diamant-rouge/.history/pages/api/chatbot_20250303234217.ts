// pages/api/chatbot.ts
import type { NextApiRequest, NextApiResponse } from "next";

// For example, using the OpenAI API (make sure to install openai package)
// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Call your AI service here
    // Example with OpenAI:
    /*
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    const reply = completion.data.choices[0].message?.content.trim();
    */

    // For this example, we'll just echo the prompt:
    const reply = `Réponse générée pour: "${prompt}"`;
    
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
