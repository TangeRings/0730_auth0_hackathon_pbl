import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const VALID_REASONS = ["seat_limit", "portfolio_publish"] as const;
type CheckoutReason = (typeof VALID_REASONS)[number];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  // Prefer explicit APP_URL; fall back to the Vercel deployment URL
  const APP_URL =
    process.env.APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  if (!stripeKey) {
    return res.status(500).json({ error: "Server misconfiguration: STRIPE_SECRET_KEY is not set." });
  }
  if (!priceId) {
    return res.status(500).json({ error: "Server misconfiguration: STRIPE_PRICE_ID is not set." });
  }

  const { reason, organizationId } = req.body as { reason?: string; organizationId?: string };

  if (!reason || !VALID_REASONS.includes(reason as CheckoutReason)) {
    return res.status(400).json({
      error: `Invalid reason. Must be one of: ${VALID_REASONS.join(", ")}.`,
    });
  }
  if (!organizationId || typeof organizationId !== "string" || organizationId.trim() === "") {
    return res.status(400).json({ error: "organizationId is required and must be a non-empty string." });
  }

  try {
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/?checkout=cancelled`,
      metadata: { organizationId, reason },
      subscription_data: { metadata: { organizationId, reason } },
    });

    if (!session.url) {
      return res.status(500).json({ error: "Stripe did not return a checkout URL. Please try again." });
    }

    return res.json({ url: session.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Stripe checkout session error:", msg);
    return res.status(500).json({ error: `Stripe error: ${msg}` });
  }
}
