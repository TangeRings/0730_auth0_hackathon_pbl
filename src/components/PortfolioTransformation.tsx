import React from "react";
import { Portfolio, StudentProject, Subscription } from "../types";
import {
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  Edit,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileCode,
  Share2,
} from "lucide-react";

interface Props {
  portfolio: Portfolio;
  studentProject: StudentProject;
  subscription: Subscription;
  onVerifyAndPublish: () => void;
  onEditPortfolio: () => void;
  onRequestRevision: () => void;
}

export const PortfolioTransformation: React.FC<Props> = ({
  portfolio,
  studentProject,
  subscription,
  onVerifyAndPublish,
  onEditPortfolio,
  onRequestRevision,
}) => {
  const isVerified = portfolio.status === "published" && subscription.plan === "cohort_pro";

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-6 border border-slate-200/90 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Instructor Verified • Cohort Pro
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Portfolio Preview • Free Pilot
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Portfolio Transformation & Verification
          </h1>
          <p className="text-xs text-slate-500">
            BlueQ automatically transforms raw student submissions into a polished executive portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEditPortfolio}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Portfolio</span>
          </button>

          <button
            onClick={onRequestRevision}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Request Revision</span>
          </button>

          {isVerified ? (
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Published
              </span>
              {portfolio.publicUrl && (
                <a
                  href={`https://${portfolio.publicUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                  <span>View Public URL</span>
                </a>
              )}
            </div>
          ) : (
            <button
              onClick={onVerifyAndPublish}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.01]"
            >
              <Award className="w-4 h-4 text-indigo-200" />
              <span>Verify and Publish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Raw Student Evidence (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-slate-400" />
              Raw Student Submissions
            </span>
            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-semibold">
              Input Data
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Interview Notes */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
              <h4 className="font-bold text-slate-900 mb-1.5">User Interview Notes</h4>
              <ul className="space-y-1 text-slate-600 leading-relaxed list-disc list-inside">
                <li>Freelancer A spends several hours chasing unpaid invoices.</li>
                <li>Freelancer B does not know whether clients opened invoice PDFs.</li>
                <li>Freelancer C experiences late milestone payments.</li>
              </ul>
            </div>

            {/* Prototype */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
              <h4 className="font-bold text-slate-900 mb-1.5">Prototype Artifact</h4>
              <p className="text-slate-600 leading-relaxed mb-2">
                A lightweight invoice-status dashboard with payment milestones and view receipts.
              </p>
              <a
                href="https://figma.com/file/paytrack-invoice-visibility-prototype"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline font-medium"
              >
                figma.com/file/paytrack-invoice-visibility-prototype
              </a>
            </div>

            {/* User Feedback */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
              <h4 className="font-bold text-slate-900 mb-1.5">User Testing Observations</h4>
              <p className="text-slate-600 leading-relaxed">
                Users valued payment status visibility significantly more than automated calendar payment reminders.
              </p>
            </div>

            {/* Reflection */}
            <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
              <h4 className="font-bold text-slate-900 mb-1.5">Reflection</h4>
              <p className="text-slate-600 italic leading-relaxed">
                "The original concept focused on scheduling. After three interviews, the project shifted toward invoice transparency."
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Generated Portfolio (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          {/* Badge Ribbon */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-xs">
                MC
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{portfolio.studentName}</h3>
                <p className="text-xs text-slate-500">Product Management Foundations</p>
              </div>
            </div>

            {isVerified ? (
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-right">
                <span className="flex items-center gap-1 font-bold text-xs text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Instructor Verified
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  Verified by {portfolio.verifiedBy || "Dr. Nicole Wang"}
                </span>
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs font-semibold">
                Portfolio Preview Mode
              </div>
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">
            {portfolio.title}
          </h2>

          {/* Portfolio Sections */}
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
            {portfolio.sections.map((sec) => (
              <div key={sec.id} className="p-4 bg-slate-50/60 border border-slate-100 rounded-xl">
                <h3 className="font-bold text-slate-900 text-sm mb-2 text-indigo-950">
                  {sec.title}
                </h3>
                <p className="mb-2">{sec.content}</p>

                {sec.keyInsights && (
                  <ul className="pl-4 list-disc space-y-1 text-slate-600 font-medium my-2">
                    {sec.keyInsights.map((ins, idx) => (
                      <li key={idx}>{ins}</li>
                    ))}
                  </ul>
                )}

                {sec.evidenceReference && (
                  <div className="mt-2 text-[11px] font-semibold text-indigo-600">
                    Artifact Link: {sec.evidenceReference}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Public Link Footer if published */}
          {isVerified && portfolio.publicUrl && (
            <div className="mt-8 p-4 bg-indigo-50/80 border border-indigo-200/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block">
                  Public Verified Link
                </span>
                <span className="text-xs font-semibold text-indigo-700">
                  https://{portfolio.publicUrl}
                </span>
              </div>

              <button
                onClick={() => navigator.clipboard.writeText(`https://${portfolio.publicUrl}`)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Public Link</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
