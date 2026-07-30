import React from "react";
import { Subscription, SessionUser } from "../types";
import { Check, ShieldCheck, CreditCard, Sparkles, UserCheck } from "lucide-react";

interface Props {
  subscription: Subscription;
  currentUser: SessionUser;
  onOpenUpgradeModal: () => void;
}

export const PlanManagementView: React.FC<Props> = ({
  subscription,
  currentUser,
  onOpenUpgradeModal,
}) => {
  const isCohortPro = subscription.plan === "cohort_pro";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Workspace Plan & Subscription
        </h1>
        <p className="text-slate-600 text-sm">
          Acme Academy Organization Plan Settings
        </p>
      </div>

      {/* Current Plan Badge */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Current Active Plan
          </span>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isCohortPro ? "Cohort Pro Plan" : "Free Pilot Plan"}
            </h2>
            {isCohortPro ? (
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                Active $29/mo
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-xs font-bold">
                Free Preview
              </span>
            )}
          </div>
        </div>

        {currentUser.role === "instructor" && !isCohortPro && (
          <button
            onClick={onOpenUpgradeModal}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4 text-indigo-200" />
            <span>Upgrade to Cohort Pro</span>
          </button>
        )}
      </div>

      {/* Pricing Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Pilot Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs relative">
          <h3 className="font-bold text-slate-900 text-lg mb-1">Free Pilot</h3>
          <p className="text-xs text-slate-500 mb-4">
            For individual instructors testing project-based learning.
          </p>
          <div className="text-3xl font-extrabold text-slate-900 mb-6">
            $0 <span className="text-xs font-normal text-slate-500">/ forever</span>
          </div>

          <ul className="space-y-3 text-xs text-slate-700 mb-6">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1 Instructor account</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1 Course & 1 generated project</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Up to 5 student submissions</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Portfolio preview mode</span>
            </li>
            <li className="flex items-center gap-2 text-slate-400 line-through">
              <span>No public verified portfolio publishing</span>
            </li>
          </ul>
        </div>

        {/* Cohort Pro Card */}
        <div className="bg-white border-2 border-indigo-600 rounded-2xl p-6 shadow-md relative">
          <span className="absolute -top-3 right-4 px-3 py-0.5 bg-indigo-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
            Verified Publishing
          </span>

          <h3 className="font-bold text-indigo-950 text-lg mb-1">Cohort Pro</h3>
          <p className="text-xs text-slate-500 mb-4">
            For courses, bootcamps, and departments scaling real projects.
          </p>
          <div className="text-3xl font-extrabold text-indigo-600 mb-6">
            $29 <span className="text-xs font-normal text-slate-500">/ month</span>
          </div>

          <ul className="space-y-3 text-xs text-indigo-950 font-medium mb-6">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Up to 30 students per cohort</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Multiple courses & customizable AI projects</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Student evidence tracking & BlueQ Coach</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Instructor-verified portfolio publishing</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Public portfolio links & cohort analytics</span>
            </li>
          </ul>

          {!isCohortPro && currentUser.role === "instructor" && (
            <button
              onClick={onOpenUpgradeModal}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors text-center"
            >
              Upgrade to Cohort Pro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
