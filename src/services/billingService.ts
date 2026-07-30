import { Subscription, Portfolio } from "../types";
import { getSubscription, saveSubscription, getPortfolio, savePortfolio } from "./dataService";

/**
 * Service boundary for Stripe Billing & Subscriptions.
 * In the prototype, startCheckout simulates a successful Stripe Checkout session.
 */

export function canPublishVerifiedPortfolio(subscription: Subscription): boolean {
  return subscription.plan === "cohort_pro" && subscription.status === "active";
}

export async function startCheckout(): Promise<{ success: boolean; subscription: Subscription; portfolio: Portfolio }> {
  // Simulate network delay for Stripe Checkout
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
  const updatedPortfolio: Portfolio = {
    ...currentPortfolio,
    status: "published",
    verifiedBy: "Dr. Nicole Wang",
    publicUrl: "blueq.app/portfolio/maya-paytrack",
  };
  savePortfolio(updatedPortfolio);

  return {
    success: true,
    subscription: updatedSub,
    portfolio: updatedPortfolio,
  };
}

export { getSubscription };
