// pages/api/chatbot.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Dynamically import the OpenAI module
    const OpenAI = await import("openai");

    // Create the configuration and client
    const configuration = new OpenAI.Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAI.OpenAIApi(configuration);

    // Call the OpenAI ChatCompletion endpoint
    const completion = await openai.createChatCompletion({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.data.choices[0].message?.content.trim();
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
