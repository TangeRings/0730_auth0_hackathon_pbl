import React, { useState } from "react";
import { StudentProject, SessionUser } from "../types";
import { ArtifactPreview } from "./ArtifactPreview";
import {
  Link as LinkIcon,
  Send,
  CheckCircle2,
  Clock,
  User,
  BookOpen,
  Sparkles,
  ExternalLink,
  Edit3,
  FileCheck2,
  Bot,
  UploadCloud,
  FileCode,
  Globe,
  Layout,
  Github,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

interface Props {
  studentProject: StudentProject;
  currentUser: SessionUser;
  onSubmitArtifact: (artifactUrl: string, reflection?: string) => void;
  onRequestReview: () => void;
}

export const StudentEvidenceWorkspace: React.FC<Props> = ({
  studentProject,
  currentUser,
  onSubmitArtifact,
  onRequestReview,
}) => {
  const existingArtifact = studentProject.evidence[0]; // Primary artifact if submitted
  const [artifactUrl, setArtifactUrl] = useState(existingArtifact?.content || "");
  const [reflection, setReflection] = useState(studentProject.submittedReflection || "");
  const [isEditing, setIsEditing] = useState(!existingArtifact);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = artifactUrl.trim() || (uploadedFileName ? `https://storage.blueq.edu/uploads/${uploadedFileName}` : "");
    if (!finalUrl) return;

    onSubmitArtifact(finalUrl, reflection.trim());
    setIsEditing(false);
  };

  const sampleLinks = [
    { label: "Canva Link (Real)", url: "https://www.canva.com/design/DAGnTT8fNmc/9rqXuemmkJRVXh9L7qrlLw/edit?ui=eyJEIjp7IlAiOnsiQi6ZmFsc2V9fX0", icon: Globe },
    { label: "Figma Link", url: "https://figma.com/file/paytrack-invoice-visibility-prototype", icon: Layout },
    { label: "GitHub Link", url: "https://github.com/mayachen/paytrack-invoice-tracker", icon: Github },
    { label: "Website URL", url: "https://paytrack-prototype.vercel.app", icon: Globe },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      if (!artifactUrl) {
        setArtifactUrl(`https://storage.blueq.edu/uploads/${file.name}`);
      }
    }
  };

  const isSubmitted = studentProject.evidence.length > 0;
  const isWaitingReview = studentProject.reviewStatus === "pending" || isSubmitted;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Student Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span className="flex items-center gap-1 text-indigo-600 font-bold">
                <BookOpen className="w-3.5 h-3.5" /> Product Management Foundations
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Student: Maya Chen
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Validate a Real Product Opportunity
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit your primary project artifact for instructor review and executive portfolio synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isWaitingReview ? (
              <span className="px-3.5 py-2 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Waiting for instructor review</span>
              </span>
            ) : (
              <span className="px-3.5 py-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-semibold">
                No project evidence submitted yet
              </span>
            )}
          </div>
        </div>

        {/* Milestone Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Current Milestone:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold ${
                isSubmitted
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : "bg-indigo-50 border border-indigo-200 text-indigo-700"
              }`}
            >
              {isSubmitted ? "Milestone 1 Complete" : "Milestone 1: Primary Project Artifact"}
            </span>
          </div>

          <div>
            Status:{" "}
            <span className="font-bold text-slate-800">
              {isWaitingReview ? "Waiting for instructor review" : "No project evidence submitted yet"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <span>Primary Project Artifact</span>
              </h2>

              <span className="text-xs font-semibold text-slate-500">
                1 Deliverable Artifact
              </span>
            </div>

            {!isSubmitted || isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isSubmitted && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs text-slate-600">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">No project evidence submitted yet.</span> Paste a URL to your Figma, Canva, GitHub, or live website artifact below to complete Milestone 1.
                    </div>
                  </div>
                )}

                {/* Primary Artifact URL Field */}
                <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-5">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Artifact Link (Figma, Canva, GitHub, or Website URL)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Paste the main link representing your user research prototype, Canva deck, or GitHub repo.
                  </p>

                  <div className="relative mb-3">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      value={artifactUrl}
                      onChange={(e) => setArtifactUrl(e.target.value)}
                      placeholder="https://figma.com/file/... or https://canva.com/design/..."
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium text-slate-900"
                      required
                    />
                  </div>

                  {/* Sample Links Quick Paste */}
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                      Quick sample links for demo:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sampleLinks.map((sample) => (
                        <button
                          key={sample.label}
                          type="button"
                          onClick={() => setArtifactUrl(sample.url)}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <sample.icon className="w-3 h-3 text-indigo-500" />
                          <span>{sample.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional File Upload */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Or attach a local file artifact:</span>
                    <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 hover:border-indigo-400 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors">
                      <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{uploadedFileName || "Choose File"}</span>
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>

                {/* Optional Short Reflection */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Optional Short Reflection
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Summarize key findings or design decisions from user interviews.
                  </p>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={3}
                    placeholder="e.g. Conducted 3 user interviews. Found that freelancer payment status visibility was the primary pain point..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {isSubmitted && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2.5 font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.01]"
                  >
                    <Send className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Submit Project Evidence</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <ArtifactPreview
                  url={existingArtifact?.content || ""}
                  title={studentProject.projectTrackTitle}
                  studentName={studentProject.studentName}
                  submittedAt={existingArtifact?.submittedAt}
                />

                {studentProject.submittedReflection && (
                  <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs text-slate-700 leading-relaxed">
                    <p className="font-bold text-slate-900 mb-1">Student Short Reflection:</p>
                    <p className="italic text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                      "{studentProject.submittedReflection}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-amber-50/80 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Submitted — Waiting for instructor review</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                    >
                      Update Deliverable
                    </button>

                    <button
                      onClick={onRequestReview}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Proceed to Instructor Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coach Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs border border-slate-800">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">BlueQ Project Coach</h3>
                <p className="text-[11px] text-indigo-300">Milestone 1 Guidance</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <p className="font-bold text-indigo-300 mb-1 text-[11px] uppercase tracking-wider">
                  Submission Tip
                </p>
                A single link to a Figma prototype, Canva presentation, or GitHub codebase is all that's required for Milestone 1.
              </div>

              <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl text-indigo-100">
                <p className="font-bold text-indigo-300 mb-1 text-[11px] uppercase tracking-wider">
                  Status
                </p>
                {isSubmitted
                  ? "Milestone 1 Complete. Status: Waiting for instructor review."
                  : "No project evidence submitted yet."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
