import React, { useState } from "react";
import { Course } from "../types";
import { sampleCourse } from "../data/mockData";
import { Upload, Sparkles, BookOpen, CheckCircle2, FileText, ArrowRight } from "lucide-react";

interface Props {
  onGenerateProject: (courseData: {
    title: string;
    description: string;
    modules: string[];
    level: string;
    duration: string;
  }) => void;
  isGenerating: boolean;
}

export const CourseInput: React.FC<Props> = ({ onGenerateProject, isGenerating }) => {
  const [selectedMode, setSelectedMode] = useState<"sample" | "custom">("sample");

  // Form states for Option A (Custom Upload)
  const [customTitle, setCustomTitle] = useState("Enterprise AI Strategy");
  const [customLevel, setCustomLevel] = useState("Intermediate / Graduate");
  const [customDuration, setCustomDuration] = useState("4 Weeks");
  const [customOutline, setCustomOutline] = useState(
    "Module 1: AI Opportunity Identification\nModule 2: Technical Feasibility & ROI\nModule 3: Prototyping & Security\nModule 4: Stakeholder Pitch"
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleAction = () => {
    if (selectedMode === "sample") {
      onGenerateProject({
        title: sampleCourse.title,
        description: sampleCourse.description,
        modules: sampleCourse.modules,
        level: "Undergraduate / Professional",
        duration: "4 Weeks",
      });
    } else {
      onGenerateProject({
        title: customTitle,
        description: "Custom uploaded syllabus and course outline.",
        modules: customOutline.split("\n").filter(Boolean),
        level: customLevel,
        duration: customDuration,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 5 • Course Import</span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-3">
          Add a project layer to your course
        </h1>

        <p className="text-slate-600 text-base leading-relaxed">
          Upload a syllabus or select an existing course. BlueQ will identify the practical skills
          students should demonstrate and generate a real-world project aligned with the course.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Option B: Sample Course (Highlighted default) */}
        <div
          onClick={() => setSelectedMode("sample")}
          className={`cursor-pointer p-6 rounded-2xl border transition-all ${
            selectedMode === "sample"
              ? "bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-md"
              : "bg-slate-50 border-slate-200/90 hover:bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Recommended Demo
                </span>
                <h3 className="text-lg font-bold text-slate-900">Sample Course</h3>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedMode === "sample"
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-slate-300"
              }`}
            >
              {selectedMode === "sample" && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl mb-4">
            <h4 className="font-bold text-slate-900 text-sm mb-1">{sampleCourse.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {sampleCourse.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sampleCourse.modules.map((mod, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Option A: Custom Upload */}
        <div
          onClick={() => setSelectedMode("custom")}
          className={`cursor-pointer p-6 rounded-2xl border transition-all ${
            selectedMode === "custom"
              ? "bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-md"
              : "bg-slate-50 border-slate-200/90 hover:bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-200/80 text-slate-700 flex items-center justify-center font-bold">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Option A
                </span>
                <h3 className="text-lg font-bold text-slate-900">Upload Your Syllabus</h3>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedMode === "custom"
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-slate-300"
              }`}
            >
              {selectedMode === "custom" && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </div>

          {selectedMode === "custom" ? (
            <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Learner Level
                  </label>
                  <input
                    type="text"
                    value={customLevel}
                    onChange={(e) => setCustomLevel(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Syllabus PDF / File Upload
                </label>
                <label className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors text-xs text-slate-600">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>{uploadedFileName || "Click to upload syllabus.pdf"}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 leading-relaxed py-4">
              Select this option if you want to upload a custom PDF syllabus or paste an existing course outline to test custom project generation.
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAction}
          disabled={isGenerating}
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-xl shadow-md transition-all flex items-center gap-3 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Course Materials...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Generate Real-World Project</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
