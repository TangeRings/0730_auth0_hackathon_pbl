import {
  Course,
  ProjectTrack,
  StudentProject,
  Portfolio,
  Subscription,
  EvidenceItem,
  EnrolledStudent,
} from "../types";
import {
  sampleCourse,
  initialProjectTrack,
  initialStudentProject,
  initialPortfolio,
  initialSubscription,
  initialEnrolledStudents,
} from "../data/mockData";

// In-memory data store backed by localStorage for simple state persistence during demo
const STORAGE_KEYS = {
  PROJECT: "blueq_project_track",
  STUDENT_PROJECT: "blueq_student_project",
  PORTFOLIO: "blueq_portfolio",
  SUBSCRIPTION: "blueq_subscription",
  STUDENTS: "blueq_enrolled_students",
};

export function getCourse(): Course {
  return sampleCourse;
}

export function getEnrolledStudents(): EnrolledStudent[] {
  const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      /* ignore */
    }
  }
  return initialEnrolledStudents;
}

export function saveEnrolledStudents(students: EnrolledStudent[]): EnrolledStudent[] {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  return students;
}

export function addEnrolledStudent(student: EnrolledStudent): EnrolledStudent[] {
  const students = getEnrolledStudents();
  const updated = [...students, student];
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
  return updated;
}

export function getProjectTrack(): ProjectTrack {
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECT);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      /* ignore */
    }
  }
  return initialProjectTrack;
}

export function saveGeneratedProject(project: ProjectTrack): ProjectTrack {
  localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(project));
  return project;
}

export function getStudentProject(): StudentProject {
  const stored = localStorage.getItem(STORAGE_KEYS.STUDENT_PROJECT);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      /* ignore */
    }
  }
  return initialStudentProject;
}

export function saveSingleArtifact(artifactUrl: string, reflection?: string): StudentProject {
  const sp = getStudentProject();
  const singleItem: EvidenceItem = {
    id: `ev-${Date.now()}`,
    type: "link",
    title: "Primary Project Artifact",
    content: artifactUrl,
    submittedAt: new Date().toISOString(),
    milestoneNumber: 1,
  };

  const updatedSp: StudentProject = {
    ...sp,
    evidence: [singleItem],
    submittedReflection: reflection || "",
    currentMilestone: 1,
    progress: 100,
    reviewStatus: "pending",
  };

  // Also update Maya's status in the roster
  const students = getEnrolledStudents();
  const updatedStudents = students.map((std) =>
    std.name === "Maya Chen"
      ? { ...std, projectStatus: "pending_review" as const, artifactUrl, submittedAt: new Date().toISOString() }
      : std
  );
  saveEnrolledStudents(updatedStudents);

  localStorage.setItem(STORAGE_KEYS.STUDENT_PROJECT, JSON.stringify(updatedSp));
  return updatedSp;
}

export function saveEvidence(item: EvidenceItem): StudentProject {
  const sp = getStudentProject();
  const updatedEvidence = [item, ...sp.evidence];
  const updatedSp: StudentProject = {
    ...sp,
    evidence: updatedEvidence,
    progress: Math.min(100, sp.progress + 15),
  };
  localStorage.setItem(STORAGE_KEYS.STUDENT_PROJECT, JSON.stringify(updatedSp));
  return updatedSp;
}

export function updateStudentProject(sp: StudentProject): StudentProject {
  localStorage.setItem(STORAGE_KEYS.STUDENT_PROJECT, JSON.stringify(sp));
  return sp;
}

export function getPortfolio(): Portfolio {
  const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      /* ignore */
    }
  }
  return initialPortfolio;
}

export function savePortfolio(portfolio: Portfolio): Portfolio {
  localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
  return portfolio;
}

export function getSubscription(): Subscription {
  const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      /* ignore */
    }
  }
  return initialSubscription;
}

export function saveSubscription(sub: Subscription): Subscription {
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
  return sub;
}

export function resetDemoData(): void {
  localStorage.removeItem(STORAGE_KEYS.PROJECT);
  localStorage.removeItem(STORAGE_KEYS.STUDENT_PROJECT);
  localStorage.removeItem(STORAGE_KEYS.PORTFOLIO);
  localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem("blueq_pending_checkout");
}
