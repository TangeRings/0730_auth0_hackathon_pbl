import { Subscription, Portfolio } from "../types";
import { getSubscription, saveSubscription, getPortfolio, savePortfolio } from "./dataService";

export type CheckoutReason = "seat_limit" | "portfolio_publish";

const PENDING_CHECKOUT_KEY = "blueq_pending_checkout";

export interface PendingCheckout {
  reason: CheckoutReason;
  pendingStudentId?: string | null;
}

export function savePendingCheckout(data: PendingCheckout): void {
  localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(data));
}

export function getPendingCheckout(): PendingCheckout | null {
  try {
    const raw = localStorage.getItem(PENDING_CHECKOUT_KEY);
    return raw ? (JSON.parse(raw) as PendingCheckout) : null;
  } catch {
    return null;
  }
}

export function clearPendingCheckout(): void {
  localStorage.removeItem(PENDING_CHECKOUT_KEY);
}

/**
 * Real Stripe Checkout: POSTs to the Express server, then redirects the browser
 * to the Stripe-hosted payment page. Returns only if the request itself fails
 * (in which case it throws so the caller can surface an error).
 */
export async function startStripeCheckout(
  reason: CheckoutReason,
  organizationId: string
): Promise<never> {
  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason, organizationId }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Server error ${res.status}`);
  }

  const { url } = await res.json() as { url: string };
  window.location.href = url;
  // The browser is now redirecting — this promise never resolves normally.
  await new Promise(() => {});
  throw new Error("unreachable");
}

/**
 * Demo-only mock: simulates a successful checkout without hitting Stripe.
 * Only used when ?demo=true is in the URL.
 *
 * reason === "seat_limit"        → upgrades subscription only; portfolio is unchanged.
 * reason === "portfolio_publish" → upgrades subscription AND publishes the portfolio.
 */
export async function startMockCheckout(
  reason: CheckoutReason
): Promise<{ success: boolean; subscription: Subscription; portfolio: Portfolio }> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const updatedSub: Subscription = {
    organizationId: "org-acme",
    plan: "cohort_pro",
    status: "active",
    stripeCustomerId: "cus_mock_99218",
    stripeSubscriptionId: "sub_mock_44812",
  };
  saveSubscription(updatedSub);

  const currentPortfolio = getPortfolio();

  if (reason === "portfolio_publish") {
    const updatedPortfolio = publishPortfolio();
    return { success: true, subscription: updatedSub, portfolio: updatedPortfolio };
  }

  // seat_limit: subscription upgraded, portfolio left as-is
  return { success: true, subscription: updatedSub, portfolio: currentPortfolio };
}

/**
 * Publish the portfolio without touching the subscription.
 * Called when the workspace is already on Cohort Pro.
 */
export function publishPortfolio(): Portfolio {
  const current = getPortfolio();
  const updated: Portfolio = {
    ...current,
    status: "published",
    verifiedBy: "Dr. Nicole Wang",
    publicUrl: "blueq.app/portfolio/maya-paytrack",
  };
  savePortfolio(updated);
  return updated;
}

export function canPublishVerifiedPortfolio(subscription: Subscription): boolean {
  return subscription.plan === "cohort_pro" && subscription.status === "active";
}

export { getSubscription };
