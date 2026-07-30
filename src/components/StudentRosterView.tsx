import React, { useState } from "react";
import { EnrolledStudent, Subscription, SessionUser } from "../types";
import {
  Users,
  UserPlus,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckSquare,
  Square,
  Mail,
  Send,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

interface Props {
  candidateStudents: EnrolledStudent[];
  selectedStudentIds: string[];
  subscription: Subscription;
  currentUser: SessionUser;
  onToggleSelectStudent: (studentId: string) => void;
  onEnrollSelectedStudents: () => void;
  onBackToProject: () => void;
  onInviteByEmail: (name: string, email: string) => void;
}

export const StudentRosterView: React.FC<Props> = ({
  candidateStudents,
  selectedStudentIds,
  subscription,
  currentUser,
  onToggleSelectStudent,
  onEnrollSelectedStudents,
  onBackToProject,
  onInviteByEmail,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const isCohortPro = subscription.plan === "cohort_pro";
  const maxSeats = isCohortPro ? 30 : 3;
  const selectedCount = selectedStudentIds.length;

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    onInviteByEmail(inviteName, inviteEmail);
    setShowInviteModal(false);
    setInviteName("");
    setInviteEmail("");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Cohort Enrollment
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold transition-all ${
                  isCohortPro
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : selectedCount >= 3
                    ? "bg-amber-50 border border-amber-200 text-amber-800"
                    : "bg-slate-100 border border-slate-200 text-slate-700"
                }`}
              >
                Selected: {selectedCount} / {maxSeats} {isCohortPro ? "Pro seats" : "free seats"}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Select Students for This Project Cohort
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Choose which learners should receive the newly generated project track. The Free Pilot supports up to 3 active students.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>Invite by Email</span>
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Students List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Available Learners ({candidateStudents.length})</span>
          </h2>

          <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            Selected: {selectedCount} / {maxSeats} {isCohortPro ? "Pro seats" : "free seats"}
          </div>
        </div>

        <div className="space-y-3">
          {candidateStudents.map((student) => {
            const isSelected = selectedStudentIds.includes(student.id);

            return (
              <div
                key={student.id}
                onClick={() => onToggleSelectStudent(student.id)}
                className={`p-4 border rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-indigo-50/60 border-indigo-500 shadow-2xs ring-1 ring-indigo-500/30"
                    : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                    {getInitials(student.name)}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{student.name}</h3>
                    <p className="text-xs text-slate-500">{student.email}</p>
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold shadow-2xs">
                      Selected
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
                      Select
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBackToProject}
          className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project</span>
        </button>

        <button
          onClick={onEnrollSelectedStudents}
          disabled={selectedCount === 0}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.01]"
        >
          <span>Enroll Selected Students ({selectedCount})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Email Invite Modal (Secondary Action) */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Invite Learner by Email</h3>
            <p className="text-xs text-slate-500 mb-4">
              Send a direct email invitation link to join Product Management Foundations.
            </p>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Taylor Kim"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. taylor@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
