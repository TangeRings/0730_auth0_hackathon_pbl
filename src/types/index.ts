export type SessionUser = {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  role: "instructor" | "student";
};

export type Organization = {
  id: string;
  name: string;
  plan: "free" | "cohort_pro";
};

export type Membership = {
  userId: string;
  organizationId: string;
  role: "organization_admin" | "instructor" | "student";
};

export type Course = {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  modules: string[];
};

export type Milestone = {
  id: string;
  number: number;
  title: string;
  description: string;
  tasks: string[];
};

export type ProjectTrack = {
  id: string;
  courseId: string;
  title: string;
  objective: string;
  durationWeeks: number;
  milestones: Milestone[];
  requiredEvidence: string[];
  evaluationCriteria: string[];
  status: "draft" | "published";
};

export type EvidenceItem = {
  id: string;
  type: "note" | "link" | "file" | "reflection";
  title: string;
  content: string;
  submittedAt: string;
  milestoneNumber: number;
};

export type StudentProject = {
  id: string;
  projectTrackId: string;
  studentId: string;
  studentName: string;
  currentMilestone: number;
  progress: number;
  evidence: EvidenceItem[];
  reviewStatus: "not_requested" | "pending" | "approved" | "revision_requested";
  submittedReflection?: string;
};

export type PortfolioSection = {
  id: string;
  title: string;
  content: string;
  keyInsights?: string[];
  evidenceReference?: string;
};

export type Portfolio = {
  id: string;
  studentProjectId: string;
  studentName: string;
  title: string;
  sections: PortfolioSection[];
  status: "preview" | "published";
  verifiedBy?: string;
  publicUrl?: string;
};

export type Subscription = {
  organizationId: string;
  plan: "free" | "cohort_pro";
  status: "active" | "inactive";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
};

export type GeneratedProject = {
  title: string;
  objective: string;
  durationWeeks: number;
  milestones: {
    number: number;
    title: string;
    description: string;
    tasks: string[];
  }[];
  requiredEvidence: string[];
  evaluationCriteria: string[];
};

export type EnrolledStudent = {
  id: string;
  name: string;
  email: string;
  projectStatus: "not_started" | "pending_review" | "revision_requested" | "approved";
  artifactUrl?: string;
  submittedAt?: string;
};

export type DemoStep = "course" | "project" | "roster" | "evidence" | "review" | "portfolio" | "plan";
