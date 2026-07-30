import { Subscription, Portfolio } from "../types";
import { getSubscription, saveSubscription, getPortfolio, savePortfolio } from "./dataService";

export type CheckoutReason = "seat_limit" | "portfolio_publish";

/**
 * Service boundary for Stripe Billing & Subscriptions.
 * In the prototype, startCheckout simulates a successful Stripe Checkout session.
 *
 * reason === "seat_limit"        → upgrades subscription only; portfolio is unchanged.
 * reason === "portfolio_publish" → upgrades subscription AND publishes the portfolio.
 */
export async function startCheckout(
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
