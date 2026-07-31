import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(500).json({ error: "Server misconfiguration: STRIPE_SECRET_KEY is not set." });
  }

  const sessionId = req.query.session_id as string;
  if (!sessionId) {
    return res.status(400).json({ error: "session_id query parameter is required." });
  }

  try {
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return res.json({
      paid: session.payment_status === "paid",
      reason: session.metadata?.reason ?? null,
      organizationId: session.metadata?.organizationId ?? null,
      stripeCustomerId: session.customer ?? null,
      stripeSubscriptionId: session.subscription ?? null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Stripe session retrieval error:", msg);
    return res.status(500).json({ error: `Stripe error: ${msg}` });
  }
}
