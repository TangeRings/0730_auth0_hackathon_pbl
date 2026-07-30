import React, { useState } from "react";
import { Check, ShieldCheck, CreditCard, X, Users, AlertCircle } from "lucide-react";
import { startStripeCheckout } from "../services/billingService";
import type { CheckoutReason } from "../services/billingService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  reason?: CheckoutReason;
  /** Pass the Auth0 org ID so the server can attach it to the Stripe session. */
  organizationId?: string;
  /** When true, skip the real Stripe endpoint and use the demo mock path instead. */
  useMockCheckout?: boolean;
}

export const UpgradeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
  reason = "seat_limit",
  organizationId = "org-acme",
  useMockCheckout = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    setCheckoutError(null);

    if (useMockCheckout) {
      // Demo mode: simulate a short delay then call the mock success path
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsProcessing(false);
      onUpgradeSuccess();
      return;
    }

    try {
      // Real mode: redirects the browser to Stripe; never returns on success
      await startStripeCheckout(reason as CheckoutReason, organizationId);
    } catch (err: unknown) {
      setIsProcessing(false);
      setCheckoutError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  };

  const isSeatReason = reason === "seat_limit";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-200 relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-2xl flex items-center justify-center font-bold shadow-xs">
            {isSeatReason ? <Users className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            {isSeatReason ? "Your Free Pilot supports 3 active students" : "Publish an Instructor-Verified Portfolio"}
          </h2>

          <p className="text-slate-600 text-xs leading-relaxed max-w-md mx-auto">
            {isSeatReason
              ? "You selected more than 3 learners. Upgrade to Cohort Pro to enroll up to 30 students and publish verified portfolios for your cohort."
              : "Your Free Pilot includes portfolio previews. Upgrade to Cohort Pro to publish verified portfolios, generate public links, and manage student rosters."}
          </p>
        </div>

        {/* Plan Comparison Box */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl mb-6 text-xs">
          {/* Free Pilot */}
          <div className="p-3 bg-white border border-slate-200/80 rounded-xl">
            <div className="font-bold text-slate-900 mb-1">Free Pilot</div>
            <div className="text-xs font-bold text-slate-500 mb-2">$0 / month</div>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5 font-bold text-amber-700">
                <Check className="w-3.5 h-3.5 text-amber-600" /> 3 Active Seats Limit
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-slate-400" /> 1 Course Project Track
              </li>
              <li className="flex items-center gap-1.5 text-slate-400 line-through">
                No Extra Student Invites
              </li>
              <li className="flex items-center gap-1.5 text-slate-400 line-through">
                No Verified Publishing
              </li>
            </ul>
          </div>

          {/* Cohort Pro */}
          <div className="p-3 bg-indigo-50/90 border-2 border-indigo-600 rounded-xl relative shadow-xs">
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-indigo-600 text-white font-bold text-[10px] rounded-full uppercase tracking-wider">
              Cohort Pro
            </span>
            <div className="font-bold text-indigo-950 mb-1">Cohort Pro Plan</div>
            <div className="text-xs font-extrabold text-indigo-600 mb-2">$29 / month</div>
            <ul className="space-y-1.5 text-[11px] text-indigo-950 font-medium">
              <li className="flex items-center gap-1.5 font-bold text-indigo-700">
                <Check className="w-3.5 h-3.5 text-indigo-600" /> 30 Active Seats
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" /> Enroll Up to 30 Students
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" /> Instructor-Verified Portfolios
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" /> Public Share Links
              </li>
            </ul>
          </div>
        </div>

        {/* Error message */}
        {checkoutError && (
          <div className="flex items-start gap-2.5 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{checkoutError}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-40"
          >
            Go Back
          </button>

          <button
            onClick={handleStripeCheckout}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{useMockCheckout ? "Simulating Checkout…" : "Redirecting to Stripe…"}</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 text-indigo-200" />
                <span>Upgrade with Stripe</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
