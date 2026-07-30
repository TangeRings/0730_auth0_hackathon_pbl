import React, { useState } from "react";
import { Check, ShieldCheck, Zap, Lock, CreditCard, Sparkles, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export const UpgradeModal: React.FC<Props> = ({ isOpen, onClose, onUpgradeSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    // Simulate Stripe Checkout API call boundary
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsProcessing(false);
    onUpgradeSuccess();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-200 relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-2xl flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Publish an instructor-verified portfolio
          </h2>

          <p className="text-slate-600 text-xs leading-relaxed max-w-md mx-auto">
            Your Free Pilot includes portfolio previews. Upgrade to Cohort Pro to publish verified portfolios, create public links, and manage project-based learning across your cohort.
          </p>
        </div>

        {/* Plan Comparison Box */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl mb-6 text-xs">
          {/* Free Pilot */}
          <div className="p-3 bg-white border border-slate-200/80 rounded-xl">
            <div className="font-bold text-slate-900 mb-1">Free Pilot</div>
            <div className="text-xs font-bold text-slate-500 mb-2">$0 / month</div>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-slate-400" /> 1 Instructor & 1 Course
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-slate-400" /> Up to 5 Students
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-slate-400" /> Portfolio Preview Only
              </li>
              <li className="flex items-center gap-1.5 text-slate-400 line-through">
                No Verified Publishing
              </li>
            </ul>
          </div>

          {/* Cohort Pro */}
          <div className="p-3 bg-indigo-50/90 border-2 border-indigo-600 rounded-xl relative shadow-xs">
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-indigo-600 text-white font-bold text-[10px] rounded-full uppercase tracking-wider">
              Recommended
            </span>
            <div className="font-bold text-indigo-950 mb-1">Cohort Pro</div>
            <div className="text-xs font-extrabold text-indigo-600 mb-2">$29 / month</div>
            <ul className="space-y-1.5 text-[11px] text-indigo-950 font-medium">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" /> Up to 30 Students
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" /> Instructor-Verified Portfolios
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" /> Public Portfolio Links
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-indigo-600" /> Student Evidence Tracking
              </li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Continue Editing
          </button>

          <button
            onClick={handleStripeCheckout}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Opening Stripe Checkout...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 text-indigo-200" />
                <span>Upgrade with Stripe ($29/mo)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
