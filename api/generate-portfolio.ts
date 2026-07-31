import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { studentName } = req.body as { studentName?: string };
    return res.json({
      success: true,
      portfolioTitle: "PayTrack: Invoice Transparency for Freelance Creators",
      studentName: studentName || "Maya Chen",
    });
  } catch {
    return res.status(500).json({ error: "Failed to generate portfolio" });
  }
}
