// pages/api/chatbot.ts
import { NextApiRequest, NextApiResponse } from "next";


const { Configuration, OpenAIApi } = require("openai");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
   

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-4", // or use "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
    });

    const reply = completion.data.choices[0].message?.content.trim();
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
