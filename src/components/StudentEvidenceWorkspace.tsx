import React, { useState } from "react";
import { StudentProject, EvidenceItem, SessionUser } from "../types";
import {
  FileText,
  Link as LinkIcon,
  Upload,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  User,
  Plus,
  BookOpen,
  ArrowRight,
  Bot,
} from "lucide-react";

interface Props {
  studentProject: StudentProject;
  currentUser: SessionUser;
  onAddEvidence: (item: EvidenceItem) => void;
  onRequestReview: () => void;
}

export const StudentEvidenceWorkspace: React.FC<Props> = ({
  studentProject,
  currentUser,
  onAddEvidence,
  onRequestReview,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [evidenceType, setEvidenceType] = useState<"note" | "link" | "file" | "reflection">("note");
  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceContent, setEvidenceContent] = useState("");

  // BlueQ Coach interactive message states
  const [coachResponse, setCoachResponse] = useState(
    "Delayed invoice payments and missing read receipts came up in all three interviews."
  );
  const [isCoachSubmitted, setIsCoachSubmitted] = useState(true);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle || !evidenceContent) return;

    const newItem: EvidenceItem = {
      id: `ev-${Date.now()}`,
      type: evidenceType,
      title: evidenceTitle,
      content: evidenceContent,
      submittedAt: new Date().toISOString(),
      milestoneNumber: studentProject.currentMilestone,
    };

    onAddEvidence(newItem);
    setEvidenceTitle("");
    setEvidenceContent("");
    setShowAddModal(false);
  };

  const stages = [
    { num: 1, title: "1. Discover Problem", status: "completed" },
    { num: 2, title: "2. Define Opportunity", status: "current" },
    { num: 3, title: "3. Prototype & Test", status: "upcoming" },
    { num: 4, title: "4. Reflect & Publish", status: "upcoming" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Student Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span className="flex items-center gap-1 text-indigo-600 font-bold">
                <BookOpen className="w-3.5 h-3.5" /> Product Management Foundations
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Instructor: Dr. Nicole Wang
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Validate a Real Product Opportunity
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Student Workspace for <span className="font-semibold text-slate-800">{studentProject.studentName}</span> ({currentUser.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Add Evidence</span>
            </button>

            <button
              onClick={onRequestReview}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Request Instructor Review</span>
            </button>
          </div>
        </div>

        {/* 4-Stage Project Timeline */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Project Progression Timeline</span>
            <span className="text-indigo-600">Overall Progress: {studentProject.progress}%</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stages.map((stg) => {
              const isComp = stg.num < studentProject.currentMilestone;
              const isCurr = stg.num === studentProject.currentMilestone;

              return (
                <div
                  key={stg.num}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isComp
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : isCurr
                      ? "bg-indigo-50 border-indigo-300 text-indigo-900 ring-2 ring-indigo-600/10"
                      : "bg-slate-50 border-slate-200/80 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold">
                      Stage {stg.num}
                    </span>
                    {isComp && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {isCurr && <Clock className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />}
                  </div>
                  <div className="truncate">{stg.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submitted Evidence List (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Submitted Project Evidence ({studentProject.evidence.length})</span>
            </h2>

            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              New Submission
            </button>
          </div>

          <div className="space-y-4">
            {studentProject.evidence.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 border border-slate-200/90 rounded-2xl shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                      {item.type === "link" ? (
                        <LinkIcon className="w-4 h-4" />
                      ) : item.type === "file" ? (
                        <Upload className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Milestone {item.milestoneNumber}
                  </span>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pl-8 border-l-2 border-indigo-100">
                  {item.content.startsWith("http") ? (
                    <a
                      href={item.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline font-medium hover:text-indigo-800"
                    >
                      {item.content}
                    </a>
                  ) : (
                    item.content
                  )}
                </div>

                <div className="mt-3 text-[11px] text-slate-400 pl-8">
                  Submitted {new Date(item.submittedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BlueQ Coach Guidance Panel (1 Col) */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-indigo-800">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">BlueQ Coach</h3>
                <p className="text-[11px] text-indigo-200/80">Contextual Project Assistant</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              {/* Coach Initial Prompt */}
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-indigo-50">
                <p className="font-semibold text-indigo-200 mb-1 text-[11px] uppercase tracking-wider">
                  AI Research Prompt
                </p>
                "Your interviews mention delayed invoice payments and missing payment visibility several times. Which problem appeared consistently across at least two interviews?"
              </div>

              {/* Maya's Response */}
              <div className="p-3 bg-indigo-600/40 rounded-xl border border-indigo-400/30 text-white">
                <p className="font-semibold text-indigo-200 mb-1 text-[11px] uppercase tracking-wider">
                  Maya's Response
                </p>
                <p className="italic">"{coachResponse}"</p>
              </div>

              {/* Coach Feedback */}
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-100">
                <p className="font-semibold text-emerald-300 mb-1 text-[11px] uppercase tracking-wider">
                  Coach Guidance
                </p>
                "Good. Convert that observation into one problem statement focused on the user, not the proposed feature."
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Evidence Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Project Evidence</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Evidence Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEvidenceType("note")}
                    className={`py-1.5 px-2 rounded-lg font-medium border text-center ${
                      evidenceType === "note" ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvidenceType("link")}
                    className={`py-1.5 px-2 rounded-lg font-medium border text-center ${
                      evidenceType === "link" ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Link / Prototype
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvidenceType("reflection")}
                    className={`py-1.5 px-2 rounded-lg font-medium border text-center ${
                      evidenceType === "reflection" ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Reflection
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  placeholder="e.g. User Testing Video Observation"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Content / URL / Notes</label>
                <textarea
                  value={evidenceContent}
                  onChange={(e) => setEvidenceContent(e.target.value)}
                  rows={4}
                  placeholder="Paste research notes or prototype links here..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Save Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
