// pages/api/chatbot.ts
export const config = { runtime: "nodejs" };
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai"; // Correct import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.choices[0].message?.content.trim();
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}