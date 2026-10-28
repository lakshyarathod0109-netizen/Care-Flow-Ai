import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const knowledge = JSON.parse(fs.readFileSync(path.join(__dirname, "server", "knowledge-base.json"), "utf8"));
app.use(express.json({ limit: "30kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(process.env.GEMINI_API_KEY), service: "CareFlow AI" });
});

app.post("/api/chat", async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const language = req.body?.language === "hi" ? "hi" : "en";
  if (!message) return res.status(400).json({ error: "Please enter a message." });
  if (message.length > 4000) return res.status(413).json({ error: "Message is too long. Please shorten it." });
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: "Gemini is not configured. Add GEMINI_API_KEY to your .env file and restart the server." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const systemInstruction = `You are CareFlow AI, a friendly hospital operations and customer-support assistant for a hackathon prototype.
Respond in ${language === "hi" ? "natural Hindi (Devanagari)" : "English"}.
Use the supplied knowledge base as the only source for hospital-specific facts. Be helpful, specific, concise but not robotic. Avoid repetitive greetings and do not simply repeat a list of capabilities.
You may explain administrative processes, departments, sample OPD hours, appointment workflow, billing support process, and the supplied directory links.
Do not diagnose, triage, interpret test results, recommend treatment, or prescribe medicine. If the user describes an emergency, tell them not to wait for this chatbot and to contact local emergency services or go to the nearest emergency department.
This is a demo: never claim you created a booking, ticket, callback, notification, or contacted staff. The frontend's confirmed workflow messages are the only source of truth for actions.
Do not request real patient identifiers or sensitive health records. If a fact is not in the knowledge base, say you cannot verify it and advise checking directly with the facility.
If the user asks about cancer hospitals in Indore, provide balanced directory options and their official links; do not rank one as universally best.`;
    const prompt = `KNOWLEDGE BASE (sample/demo data):\n${JSON.stringify(knowledge, null, 2)}\n\nUSER MESSAGE:\n${message}\n\nReply directly to the user's actual question.`;
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.45,
        maxOutputTokens: 700
      }
    });
    const reply = result.text?.trim();
    if (!reply) throw new Error("Gemini returned an empty response.");
    res.json({ reply });
  } catch (error) {
    console.error("Gemini request failed:", error?.message || error);
    res.status(502).json({ error: "Gemini could not answer right now. Check the API key, model name, and server terminal." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CareFlow AI API server running at http://localhost:${PORT}`);
  console.log(`Gemini API key configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
});
