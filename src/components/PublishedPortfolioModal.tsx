import React, { useState } from "react";
import { Portfolio } from "../types";
import { ShieldCheck, Share2, ExternalLink, X, Check, Award } from "lucide-react";

interface Props {
  portfolio: Portfolio;
  isOpen: boolean;
  onClose: () => void;
}

export const PublishedPortfolioModal: React.FC<Props> = ({ portfolio, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${portfolio.publicUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Banner */}
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Workspace Upgraded to Cohort Pro</h3>
              <p className="text-xs text-emerald-800 font-medium">
                Portfolio is now Instructor Verified and publicly available.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? "Copied Link!" : "Copy Public Link"}</span>
          </button>
        </div>

        {/* Live Link Box */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 flex items-center justify-between text-xs font-mono text-slate-700">
          <span>https://{portfolio.publicUrl || "blueq.app/portfolio/maya-paytrack"}</span>
          <a
            href={`https://${portfolio.publicUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-sans font-semibold flex items-center gap-1 hover:underline"
          >
            Open in new tab <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Portfolio Content Preview */}
        <div className="border border-slate-200 rounded-2xl p-6 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="font-extrabold text-slate-900 text-lg">{portfolio.title}</h2>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified by {portfolio.verifiedBy}
            </span>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            {portfolio.sections.map((sec) => (
              <div key={sec.id} className="p-3 bg-slate-50/50 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-1">{sec.title}</h4>
                <p>{sec.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
