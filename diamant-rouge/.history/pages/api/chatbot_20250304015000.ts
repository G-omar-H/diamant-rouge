// pages/api/chatbot.ts
export const config = { runtime: "nodejs" }; // Ensure this runs in Node.js

import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai"; // Import the default export

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Instantiate OpenAI client with your API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call the ChatCompletion endpoint (using the new syntax)
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5", // or "gpt-3.5-turbo" if you prefer
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.choices[0].message?.content.trim();
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
