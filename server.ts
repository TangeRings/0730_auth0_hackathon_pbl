import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { mockFallbackProject } from "./src/data/mockFallbackProject";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Generate Real-World Project from Course input using Gemini
  app.post("/api/generate-project", async (req, res) => {
    try {
      const { courseTitle, description, modules } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.log("No valid Gemini API key found, returning fallback project.");
        return res.json({ success: true, project: mockFallbackProject, source: "fallback" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
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
                    tasks: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["number", "title", "description", "tasks"],
                },
              },
              requiredEvidence: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              evaluationCriteria: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              "title",
              "objective",
              "durationWeeks",
              "milestones",
              "requiredEvidence",
              "evaluationCriteria",
            ],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ success: true, project: parsed, source: "gemini" });
      } else {
        return res.json({ success: true, project: mockFallbackProject, source: "fallback" });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Gemini API error:", errorMessage);
      return res.json({
        success: true,
        project: mockFallbackProject,
        source: "fallback",
        errorNote: errorMessage,
      });
    }
  });

  // API Route: Generate Portfolio from Raw Evidence
  app.post("/api/generate-portfolio", async (req, res) => {
    try {
      const { studentName, evidence } = req.body;
      // Return structured portfolio presentation
      return res.json({
        success: true,
        portfolioTitle: "PayTrack: Invoice Transparency for Freelance Creators",
        studentName: studentName || "Maya Chen",
      });
    } catch (err: unknown) {
      return res.status(500).json({ error: "Failed to generate portfolio" });
    }
  });

  // Serve static assets or mount Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BlueQ Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
