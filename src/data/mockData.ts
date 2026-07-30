import { Course, ProjectTrack, StudentProject, Portfolio, Organization, Subscription } from "../types";
import { mockFallbackProject } from "./mockFallbackProject";

export const initialOrganization: Organization = {
  id: "org-acme",
  name: "Acme Academy",
  plan: "free",
};

export const initialSubscription: Subscription = {
  organizationId: "org-acme",
  plan: "free",
  status: "active",
};

export const sampleCourse: Course = {
  id: "course-pm-101",
  organizationId: "org-acme",
  title: "Product Management Foundations",
  description:
    "Learn user research, problem definition, prototyping, testing, and product storytelling.",
  modules: [
    "Understanding User Problems",
    "Market Research",
    "Value Proposition",
    "Prototype Design",
    "User Testing",
    "Product Storytelling",
  ],
};

export const initialProjectTrack: ProjectTrack = {
  id: "track-pmo-001",
  courseId: sampleCourse.id,
  title: mockFallbackProject.title,
  objective: mockFallbackProject.objective,
  durationWeeks: mockFallbackProject.durationWeeks,
  milestones: mockFallbackProject.milestones.map((m) => ({
    id: `m-${m.number}`,
    ...m,
  })),
  requiredEvidence: mockFallbackProject.requiredEvidence,
  evaluationCriteria: mockFallbackProject.evaluationCriteria,
  status: "published",
};

export const initialStudentProject: StudentProject = {
  id: "sp-maya-001",
  projectTrackId: initialProjectTrack.id,
  studentId: "user-maya",
  studentName: "Maya Chen",
  currentMilestone: 2,
  progress: 50,
  reviewStatus: "pending",
  submittedReflection:
    "The original concept focused on client scheduling. After three user interviews, the evidence clearly indicated that delayed invoice payments and lack of payment status visibility were much more severe pain points for freelance creators.",
  evidence: [
    {
      id: "ev-01",
      type: "note",
      title: "User Interview Summary Notes",
      content:
        "• Freelancer A spends several hours chasing unpaid invoices each month.\n• Freelancer B does not know whether clients opened invoice PDFs.\n• Freelancer C experiences late milestone payments and lacks clear read receipts.",
      submittedAt: "2026-07-28T10:30:00Z",
      milestoneNumber: 1,
    },
    {
      id: "ev-02",
      type: "note",
      title: "Synthesized Problem Statement",
      content:
        "Delayed invoice payments and missing read receipts came up consistently across all three user interviews as the primary source of financial anxiety for independent creators.",
      submittedAt: "2026-07-29T14:15:00Z",
      milestoneNumber: 2,
    },
    {
      id: "ev-03",
      type: "link",
      title: "Interactive Figma Prototype",
      content: "https://figma.com/file/paytrack-invoice-visibility-prototype",
      submittedAt: "2026-07-30T09:00:00Z",
      milestoneNumber: 3,
    },
    {
      id: "ev-04",
      type: "note",
      title: "User Testing Feedback & Observations",
      content:
        "Users valued payment status visibility and automatic read receipts significantly more than automated calendar payment reminders.",
      submittedAt: "2026-07-30T11:20:00Z",
      milestoneNumber: 3,
    },
  ],
};

export const initialPortfolio: Portfolio = {
  id: "port-maya-paytrack",
  studentProjectId: initialStudentProject.id,
  studentName: "Maya Chen",
  title: "PayTrack: Invoice Transparency for Freelance Creators",
  status: "preview",
  sections: [
    {
      id: "sec-1",
      title: "Project Challenge",
      content:
        "Independent creators and digital freelancers face chronic income instability caused by delayed client payments and zero transparency after invoices are sent.",
    },
    {
      id: "sec-2",
      title: "User Research & Discovery",
      content:
        "Conducted structured qualitative research with 3 independent freelancers. Discovered that 100% experienced significant administrative stress and lost working hours chasing invoice updates without knowing if clients received or reviewed them.",
      keyInsights: [
        "Freelancer A spends ~4 hours monthly following up on unacknowledged invoices.",
        "Freelancer B feels uncomfortable sending follow-ups without knowing if the email was opened.",
        "Freelancer C prefers invoice read receipts over calendar reminders.",
      ],
    },
    {
      id: "sec-3",
      title: "Key Insight",
      content:
        "The fundamental issue is not late payments per se, but the informational black hole between sending an invoice and receiving funds.",
    },
    {
      id: "sec-4",
      title: "Prototype & Solution Design",
      content:
        "Designed PayTrack, a lightweight status dashboard featuring real-time invoice open tracking, milestone payment steps, and transparent receipt status.",
      evidenceReference: "https://figma.com/file/paytrack-invoice-visibility-prototype",
    },
    {
      id: "sec-5",
      title: "Testing & Iteration",
      content:
        "Tested the prototype with 2 target creators. Users confirmed that seeing 'Client Opened Invoice' reduced anxiety by 80% and eliminated awkward manual email check-ins.",
    },
    {
      id: "sec-6",
      title: "Final Outcome & Reflection",
      content:
        "The project pivoted from a generic payment scheduling tool to a targeted invoice transparency platform based on raw empirical evidence gathered in the field.",
    },
  ],
};
