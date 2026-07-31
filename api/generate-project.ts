import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";
import { mockFallbackProject } from "../src/data/mockFallbackProject";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { courseTitle, description, modules } = req.body as {
      courseTitle?: string;
      description?: string;
      modules?: string[];
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.json({ success: true, project: mockFallbackProject, source: "fallback" });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });

    const prompt = `You are an expert instructional designer at BlueQ.
Transform this online course into a high-impact, real-world applied student project track.

Course Title: ${courseTitle || "Product Management Foundations"}
Course Description: ${description || "Learn user research, problem definition, prototyping, testing, and product storytelling."}
Modules: ${Array.isArray(modules) ? modules.join(", ") : "User Problems, Research, Prototyping, Testing"}

Generate a detailed 4-milestone project where students produce real verifiable evidence.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Generate structured real-world project specifications for higher education and professional training. Output clean JSON following the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            objective: { type: Type.STRING },
            durationWeeks: { type: Type.NUMBER },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["number", "title", "description", "tasks"],
              },
            },
            requiredEvidence: { type: Type.ARRAY, items: { type: Type.STRING } },
            evaluationCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "objective", "durationWeeks", "milestones", "requiredEvidence", "evaluationCriteria"],
        },
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json({ success: true, project: parsed, source: "gemini" });
    }
    return res.json({ success: true, project: mockFallbackProject, source: "fallback" });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Gemini API error:", errorMessage);
    return res.json({ success: true, project: mockFallbackProject, source: "fallback", errorNote: errorMessage });
  }
}
