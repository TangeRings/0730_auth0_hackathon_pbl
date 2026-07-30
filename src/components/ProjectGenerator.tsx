import React, { useState } from "react";
import { ProjectTrack } from "../types";
import {
  Sparkles,
  Save,
  Send,
  RefreshCw,
  Clock,
  Target,
  CheckSquare,
  ListOrdered,
  Award,
  Edit2,
  Check,
} from "lucide-react";

interface Props {
  projectTrack: ProjectTrack;
  isAnalyzing: boolean;
  onSaveProject: (updatedProject: ProjectTrack) => void;
  onPublishToStudents: () => void;
  onRegenerate: () => void;
}

export const ProjectGenerator: React.FC<Props> = ({
  projectTrack,
  isAnalyzing,
  onSaveProject,
  onPublishToStudents,
  onRegenerate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(projectTrack.title);
  const [objective, setObjective] = useState(projectTrack.objective);
  const [durationWeeks, setDurationWeeks] = useState(projectTrack.durationWeeks);

  if (isAnalyzing) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-indigo-50 border border-indigo-200/80 rounded-2xl flex items-center justify-center text-indigo-600 shadow-xs">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Generating Real-World Project</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed mb-6">
          Analyzing learning objectives, learner level, and course duration…
        </p>

        <div className="w-64 mx-auto bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full w-2/3 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  const handleSave = () => {
    onSaveProject({
      ...projectTrack,
      title,
      objective,
      durationWeeks,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-5 border border-slate-200/90 rounded-2xl shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Generated Project • Ready for Instructor Review</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Project Track Specification</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerate}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Specification</span>
            </button>
          )}

          <button
            onClick={onPublishToStudents}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish to Students</span>
          </button>
        </div>
      </div>

      {/* Main Spec Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden mb-8">
        {/* Header Block */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-lg font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Objective</label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  {durationWeeks} Weeks Duration
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  4 Core Milestones
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">{title}</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{objective}</p>
            </>
          )}
        </div>

        {/* Milestones Grid */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-4">
            <ListOrdered className="w-4 h-4 text-indigo-600" />
            <span>Project Milestones</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectTrack.milestones.map((m) => (
              <div
                key={m.id || m.number}
                className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {m.number}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{m.title}</h3>
                </div>

                <p className="text-xs text-slate-600 mb-3 pl-8">{m.description}</p>

                <div className="pl-8 space-y-1">
                  {m.tasks.map((task, tidx) => (
                    <div key={tidx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 shrink-0" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence & Evaluation Criteria */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30">
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>Required Student Evidence</span>
            </div>
            <ul className="space-y-2">
              {projectTrack.requiredEvidence.map((ev, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white px-3 py-2 border border-slate-200/80 rounded-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Evaluation Dimensions</span>
            </div>
            <ul className="space-y-2">
              {projectTrack.evaluationCriteria.map((crit, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white px-3 py-2 border border-slate-200/80 rounded-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
