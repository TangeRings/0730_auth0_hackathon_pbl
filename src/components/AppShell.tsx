import React from "react";
import { SessionUser, DemoStep } from "../types";
import { DemoRoleSwitcher } from "./DemoRoleSwitcher";
import { DemoProgress } from "./DemoProgress";
import { Layers, RotateCcw, Shield, GraduationCap, LogOut } from "lucide-react";

interface Props {
  currentUser: SessionUser;
  onSwitchUser: (user: SessionUser) => void;
  currentStep: DemoStep;
  onSelectStep: (step: DemoStep) => void;
  isPublished: boolean;
  onResetDemo: () => void;
  onLogout: () => void;
  isDemoMode: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<Props> = ({
  currentUser,
  onSwitchUser,
  currentStep,
  onSelectStep,
  isPublished,
  onResetDemo,
  onLogout,
  isDemoMode,
  children,
}) => {
  const allNavTabs: { key: DemoStep; label: string }[] = [
    { key: "course", label: "Course" },
    { key: "project", label: "Project" },
    { key: "roster", label: "Roster" },
    { key: "evidence", label: "Evidence" },
    { key: "review", label: "Review" },
    { key: "portfolio", label: "Portfolio" },
    { key: "plan", label: "Plan" },
  ];

  const studentOnlyTabs: DemoStep[] = ["evidence", "portfolio"];
  const navTabs = currentUser.role === "student"
    ? allNavTabs.filter((t) => studentOnlyTabs.includes(t.key))
    : allNavTabs;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base tracking-tight">BlueQ</span>
                <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-[10px] font-bold rounded">
                  Project Layer
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Real-world project layer for online courses
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs font-medium">
            {navTabs.map((tab) => {
              const isActive = currentStep === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onSelectStep(tab.key)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-white text-indigo-700 font-bold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Demo Override, Reset & Logout */}
          <div className="flex items-center gap-3">
            {isDemoMode && (
              <DemoRoleSwitcher currentUser={currentUser} onSwitchUser={onSwitchUser} />
            )}

            {currentUser.role === "instructor" && (
              <button
                onClick={onResetDemo}
                title="Reset all demo data"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            )}

            <button
              onClick={onLogout}
              title="Sign out"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Guided Demo Progress Bar */}
      <DemoProgress currentStep={currentStep} onSelectStep={onSelectStep} isPublished={isPublished} role={currentUser.role} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            BlueQ Project Layer Prototype • Acme Academy Hackathon Demo
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              {currentUser.role === "instructor" ? (
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />)}
              Active Identity: {currentUser.name} ({currentUser.email})
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
