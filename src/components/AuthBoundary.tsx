import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Layers, AlertCircle, LogIn } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export const AuthBoundary: React.FC<Props> = ({ children }) => {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading BlueQ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-red-200 shadow-md p-8 max-w-sm w-full text-center">
          <div className="w-10 h-10 mx-auto mb-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">Authentication error</h2>
          <p className="text-xs text-slate-500 mb-5">{error.message}</p>
          <button
            onClick={() => loginWithRedirect()}
            className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/40 flex flex-col items-center justify-center p-6">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl max-w-md w-full p-10 flex flex-col items-center text-center">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">BlueQ</span>
                <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-[10px] font-bold rounded">
                  Project Layer
                </span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
            Turn online courses into verified project experience
          </h1>

          <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-xs">
            Instructors and students share the same workspace with different permissions.
            Sign in to access your role.
          </p>

          {/* Login CTA */}
          <button
            onClick={() => loginWithRedirect()}
            className="w-full px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2.5"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Auth0
          </button>

          <p className="mt-5 text-[11px] text-slate-400 leading-relaxed">
            Your role (instructor or student) is determined by your account.<br />
            No separate registration needed.
          </p>
        </div>

        <p className="mt-6 text-[11px] text-slate-400">
          BlueQ Project Layer — Acme Academy Hackathon Demo
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
