import React from "react";
import { Lock, ArrowLeft, ShieldAlert } from "lucide-react";
import { SessionUser } from "../types";
import { instructorSession, studentSession } from "../services/sessionService";

interface Props {
  currentUser: SessionUser;
  requiredRole: "instructor" | "student";
  onSwitchRole: (user: SessionUser) => void;
  onGoBack?: () => void;
}

export const UnauthorizedState: React.FC<Props> = ({
  currentUser,
  requiredRole,
  onSwitchRole,
  onGoBack,
}) => {
  const targetUser = requiredRole === "instructor" ? instructorSession : studentSession;

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs text-center">
      <div className="w-14 h-14 mx-auto mb-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-center text-amber-600">
        <Lock className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
        Access Restricted
      </h3>

      <p className="text-slate-600 text-sm leading-relaxed mb-6">
        You do not have permission to access this {requiredRole} workspace as{" "}
        <span className="font-semibold text-slate-800">{currentUser.name}</span> ({currentUser.role}).
      </p>

      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl mb-6 text-left text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <ShieldAlert className="w-4 h-4 text-indigo-600" />
          <span>Role Permission Rule:</span>
        </div>
        <p>
          {requiredRole === "instructor"
            ? "Only instructors can edit projects, review student evidence, manage billing, or publish verified portfolios."
            : "Students submit evidence and view assigned project milestones."}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        )}

        <button
          onClick={() => onSwitchRole(targetUser)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
        >
          Switch Demo Mode to {targetUser.name} ({targetUser.role})
        </button>
      </div>
    </div>
  );
};
