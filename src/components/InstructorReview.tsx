import React from "react";
import { StudentProject, SessionUser } from "../types";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  User,
  ArrowRight,
  Award,
  Link as LinkIcon,
  BookOpen,
} from "lucide-react";

interface Props {
  studentProject: StudentProject;
  currentUser: SessionUser;
  onApprove: () => void;
  onRequestRevision: () => void;
  onGeneratePortfolio: () => void;
}

export const InstructorReview: React.FC<Props> = ({
  studentProject,
  currentUser,
  onApprove,
  onRequestRevision,
  onGeneratePortfolio,
}) => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span className="flex items-center gap-1 text-indigo-600 font-bold">
                <BookOpen className="w-3.5 h-3.5" /> Product Management Foundations
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Student: {studentProject.studentName}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Instructor Review: {studentProject.studentName}'s Portfolio Evidence
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRequestRevision}
              className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Request Revision</span>
            </button>

            <button
              onClick={onGeneratePortfolio}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Generate Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Synthesis Box */}
        <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Evidence Summary for Instructor</span>
          </div>
          <p className="text-xs text-indigo-950 leading-relaxed">
            Maya conducted 3 qualitative freelancer interviews, identified chronic invoice payment delay pain points, built an interactive Figma prototype featuring real-time read receipts, and pivoted her research focus from scheduling to payment transparency based on field data.
          </p>
        </div>
      </div>

      {/* Submitted Evidence Details */}
      <div className="space-y-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>Detailed Evidence Artifacts ({studentProject.evidence.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentProject.evidence.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 border border-slate-200/90 rounded-2xl shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                  {item.type === "link" ? (
                    <LinkIcon className="w-3.5 h-3.5" />
                  ) : (
                    <FileText className="w-3.5 h-3.5" />
                  )}
                  {item.title}
                </span>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Milestone {item.milestoneNumber}
                </span>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-3 p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                {item.content}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Submitted by {studentProject.studentName}</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Format
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Reflection */}
      {studentProject.submittedReflection && (
        <div className="bg-white p-6 border border-slate-200/90 rounded-2xl shadow-xs mb-8">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Student Final Reflection</h3>
          <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-4 border border-slate-200/60 rounded-xl">
            "{studentProject.submittedReflection}"
          </p>
        </div>
      )}
    </div>
  );
};
