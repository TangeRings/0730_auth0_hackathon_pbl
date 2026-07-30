import React, { useState } from "react";
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  Globe,
  Github,
  Layout,
  FileText,
  Sparkles,
  CheckCircle2,
  Eye,
  RefreshCw,
  Monitor,
} from "lucide-react";

interface Props {
  url: string;
  title?: string;
  studentName?: string;
  submittedAt?: string;
}

export const ArtifactPreview: React.FC<Props> = ({
  url,
  title = "Primary Project Artifact",
  studentName = "Maya Chen",
  submittedAt,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "details">("preview");

  // Detect platform type
  const isCanva = url.includes("canva.com");
  const isFigma = url.includes("figma.com");
  const isGithub = url.includes("github.com");

  // Format Canva Embed URL if applicable
  const getEmbedUrl = () => {
    if (isCanva) {
      // Convert edit URL to view?embed if needed
      if (url.includes("/edit")) {
        return url.replace(/\/edit.*$/, "/view?embed");
      }
      if (!url.includes("embed")) {
        return url.includes("?") ? `${url}&embed` : `${url}?embed`;
      }
      return url;
    }

    if (isFigma) {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl();

  const getPlatformInfo = () => {
    if (isCanva) {
      return {
        name: "Canva Presentation",
        color: "bg-cyan-50 border-cyan-200 text-cyan-800",
        badgeColor: "bg-cyan-600 text-white",
        icon: Globe,
        accent: "border-cyan-500",
      };
    }
    if (isFigma) {
      return {
        name: "Figma Prototype",
        color: "bg-purple-50 border-purple-200 text-purple-800",
        badgeColor: "bg-purple-600 text-white",
        icon: Layout,
        accent: "border-purple-500",
      };
    }
    if (isGithub) {
      return {
        name: "GitHub Repository",
        color: "bg-slate-100 border-slate-300 text-slate-800",
        badgeColor: "bg-slate-900 text-white",
        icon: Github,
        accent: "border-slate-800",
      };
    }
    return {
      name: "Live Web Deliverable",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800",
      badgeColor: "bg-indigo-600 text-white",
      icon: Globe,
      accent: "border-indigo-600",
    };
  };

  const platform = getPlatformInfo();
  const PlatformIcon = platform.icon;

  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden shadow-xs transition-all duration-200 ${
        isExpanded ? "fixed inset-4 z-50 shadow-2xl border-indigo-500 flex flex-col" : "border-slate-200/90"
      }`}
    >
      {/* Header Bar */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
            <PlatformIcon className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${platform.badgeColor}`}>
                {platform.name}
              </span>
              <span className="text-xs text-slate-300 truncate font-semibold">{title}</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{url}</p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            title="Open in new window"
          >
            <span>Open Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            title={isExpanded ? "Exit full view" : "Maximize preview"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Browser Bar Sub-header */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>

          <div className="bg-white border border-slate-200/80 rounded-lg px-3 py-1 text-slate-600 text-[11px] font-mono truncate flex-1 flex items-center gap-2">
            <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{url}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 font-medium text-[11px]">
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live Preview Ready
          </span>
        </div>
      </div>

      {/* Embedded Viewport */}
      <div className={`relative bg-slate-950 ${isExpanded ? "flex-1 min-h-0" : "h-[480px]"}`}>
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full border-0 bg-white"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onError={() => setIframeError(true)}
        />

        {/* Fallback Overlay if needed */}
        {iframeError && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <Globe className="w-12 h-12 text-indigo-400 mb-3 animate-bounce" />
            <h3 className="text-lg font-bold mb-1">Preview Available Directly</h3>
            <p className="text-xs text-slate-300 max-w-md mb-4">
              This deliverable is hosted securely on {platform.name}. You can view the complete interactive presentation in a new browser tab.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Open Deliverable on {platform.name}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800">
            Student: <span className="text-indigo-600">{studentName}</span>
          </span>
          {submittedAt && (
            <span className="text-slate-400">
              • Submitted {new Date(submittedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
        >
          <span>Open Full Interactive View</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
