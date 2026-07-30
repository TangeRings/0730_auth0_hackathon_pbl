import React from "react";
import { SessionUser } from "../types";
import { instructorSession, studentSession } from "../services/sessionService";
import { UserCheck, Shield, GraduationCap, Sparkles } from "lucide-react";

interface Props {
  currentUser: SessionUser;
  onSwitchUser: (user: SessionUser) => void;
}

export const DemoRoleSwitcher: React.FC<Props> = ({ currentUser, onSwitchUser }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/80 rounded-full p-1 shadow-xs">
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span>Guided Demo Override:</span>
      </div>

      <button
        onClick={() => onSwitchUser(instructorSession)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          currentUser.role === "instructor"
            ? "bg-indigo-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
        }`}
      >
        <Shield className="w-3.5 h-3.5" />
        <span>Instructor (Dr. Nicole)</span>
      </button>

      <button
        onClick={() => onSwitchUser(studentSession)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          currentUser.role === "student"
            ? "bg-indigo-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
        }`}
      >
        <GraduationCap className="w-3.5 h-3.5" />
        <span>Student (Maya)</span>
      </button>
    </div>
  );
};
