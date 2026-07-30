import { GeneratedProject } from "../types";

/**
 * Fallback project definition used when offline or as standard mock AI output.
 */
export const mockFallbackProject: GeneratedProject = {
  title: "Validate a Real Product Opportunity",
  objective:
    "Students identify a real user problem, gather evidence from potential users, create a lightweight prototype, and test whether the proposed solution addresses the problem.",
  durationWeeks: 4,
  milestones: [
    {
      number: 1,
      title: "Discover a real problem",
      description: "Identify target user pain points through qualitative field research.",
      tasks: [
        "Choose a target user group",
        "Conduct three user interviews",
        "Submit interview notes",
        "Identify recurring problems",
      ],
    },
    {
      number: 2,
      title: "Define the opportunity",
      description: "Synthesize field notes into an actionable, user-centric problem statement.",
      tasks: [
        "Select one evidence-backed problem",
        "Write a clear problem statement",
        "Explain why the problem matters",
      ],
    },
    {
      number: 3,
      title: "Prototype and test",
      description: "Build a low-fidelity solution concept and gather early user feedback.",
      tasks: [
        "Create a lightweight prototype",
        "Test it with two target users",
        "Submit feedback and observations",
      ],
    },
    {
      number: 4,
      title: "Reflect and communicate",
      description: "Document learning iterations and generate an executive project portfolio.",
      tasks: [
        "Document what changed during research",
        "Explain key design decisions",
        "Generate a final project portfolio",
      ],
    },
  ],
  requiredEvidence: [
    "Interview notes",
    "Problem statement",
    "Prototype screenshot or link",
    "User feedback",
    "Final reflection",
  ],
  evaluationCriteria: [
    "Quality of evidence",
    "Problem clarity",
    "Response to feedback",
    "Iteration quality",
    "Reflection quality",
  ],
};
