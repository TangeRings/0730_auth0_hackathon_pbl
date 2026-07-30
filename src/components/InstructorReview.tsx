import React, { useState } from "react";
import { StudentProject, SessionUser, EnrolledStudent } from "../types";
import { ArtifactPreview } from "./ArtifactPreview";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  User,
  Users,
  ArrowRight,
  Link as LinkIcon,
  BookOpen,
  ExternalLink,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface Props {
  studentProject: StudentProject;
  enrolledStudents: EnrolledStudent[];
  currentUser: SessionUser;
  onApprove: () => void;
  onRequestRevision: () => void;
  onGeneratePortfolio: () => void;
}

export const InstructorReview: React.FC<Props> = ({
  studentProject,
  enrolledStudents,
  currentUser,
  onApprove,
  onRequestRevision,
  onGeneratePortfolio,
}) => {
  // Local state for active student being reviewed
  const defaultStudentId = enrolledStudents[0]?.id || "std-1";
  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId);

  // List of students to display in sidebar (use enrolled list or fallback candidates if empty)
  const studentList = enrolledStudents.length > 0 ? enrolledStudents : [
    { id: "std-1", name: "Maya Chen", email: "maya@example.com", projectStatus: "submitted" },
    { id: "std-2", name: "Alex Rivera", email: "alex@example.com", projectStatus: "not_started" },
    { id: "std-3", name: "Jordan Lee", email: "jordan@example.com", projectStatus: "not_started" },
    { id: "std-4", name: "Sofia Martinez", email: "sofia@example.com", projectStatus: "not_started" },
  ];

  const currentStudent = studentList.find((s) => s.id === selectedStudentId) || studentList[0];
  const isMaya = currentStudent.id === "std-1" || currentStudent.name.includes("Maya");

  // Determine evidence based on whether Maya (who has submitted the Canva deliverable) is selected
  const hasSubmitted = isMaya && studentProject.evidence.length > 0;
  const artifact = hasSubmitted ? studentProject.evidence[0] : null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span className="flex items-center gap-1 text-indigo-600 font-bold">
                <BookOpen className="w-3.5 h-3.5" /> Product Management Foundations
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Cohort Roster ({studentList.length} Learners)
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Instructor Review Workspace
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a student from the cohort roster on the left to evaluate project deliverables and synthesize executive portfolios.
            </p>
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
              disabled={!hasSubmitted}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors shadow-xs flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Approve & Generate Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid with Left Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Enrolled Student List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Enrolled Cohort Roster</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {studentList.length} Students
              </span>
            </div>

            <div className="space-y-2.5">
              {studentList.map((student) => {
                const isSelected = student.id === currentStudent.id;
                const studentSubmitted = student.id === "std-1" || student.name.includes("Maya");

                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-indigo-50/80 border-indigo-500 shadow-2xs ring-1 ring-indigo-500/30"
                        : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-900 text-white"
                        }`}
                      >
                        {getInitials(student.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-xs truncate">{student.name}</h3>
                        <p className="text-[11px] text-slate-500 truncate">{student.email}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {studentSubmitted ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Submitted
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-medium">
                          Pending
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Main Content: Student Review Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Student Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                  {getInitials(currentStudent.name)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{currentStudent.name}</h2>
                  <p className="text-xs text-slate-500">{currentStudent.email}</p>
                </div>
              </div>

              {hasSubmitted ? (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ready for Review
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600 animate-pulse" /> Pending Submission
                </span>
              )}
            </div>

            {/* AI Synthesis Summary */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-1">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Evidence Assessment</span>
              </div>
              <p className="text-xs text-indigo-950 leading-relaxed">
                {hasSubmitted && artifact
                  ? `${currentStudent.name} submitted an interactive deliverable artifact (${artifact.content}) demonstrating research synthesis, user interface design, and empirical problem definition.`
                  : `${currentStudent.name} has not submitted their primary project deliverable yet.`}
              </p>
            </div>

            {/* Artifact Preview or Pending Placeholder */}
            {hasSubmitted && artifact ? (
              <div className="space-y-4">
                <ArtifactPreview
                  url={artifact.content}
                  title={studentProject.projectTrackTitle}
                  studentName={currentStudent.name}
                  submittedAt={artifact.submittedAt}
                />

                {studentProject.submittedReflection && (
                  <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Student Short Reflection:</span>
                    <p className="italic bg-white p-3 rounded-xl border border-slate-200">
                      "{studentProject.submittedReflection}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Format verified & ready for executive portfolio synthesis</span>
                  </div>

                  <button
                    onClick={onGeneratePortfolio}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Generate Executive Portfolio</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3 animate-pulse" />
                <h3 className="font-bold text-slate-800 text-sm mb-1">Awaiting {currentStudent.name}'s Submission</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-4">
                  This learner has not submitted their deliverable link yet. You can review Maya Chen's submission or send a reminder.
                </p>
                <button
                  onClick={() => {
                    const maya = studentList.find((s) => s.id === "std-1" || s.name.includes("Maya"));
                    if (maya) setSelectedStudentId(maya.id);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Switch to Maya Chen's Submission
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
