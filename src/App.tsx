import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  SessionUser,
  DemoStep,
  ProjectTrack,
  StudentProject,
  Portfolio,
  Subscription,
  EnrolledStudent,
} from "./types";
import {
  instructorSession,
  studentSession,
  mapAuth0UserToSession,
} from "./services/sessionService";
import {
  getCourse,
  getProjectTrack,
  saveGeneratedProject,
  getStudentProject,
  saveSingleArtifact,
  getPortfolio,
  getSubscription,
  saveSubscription,
  getEnrolledStudents,
  saveEnrolledStudents,
  addEnrolledStudent,
  resetDemoData,
} from "./services/dataService";
import { candidateStudents } from "./data/mockData";
import { startMockCheckout, publishPortfolio } from "./services/billingService";

import { AppShell } from "./components/AppShell";
import { CourseInput } from "./components/CourseInput";
import { ProjectGenerator } from "./components/ProjectGenerator";
import { StudentRosterView } from "./components/StudentRosterView";
import { StudentEvidenceWorkspace } from "./components/StudentEvidenceWorkspace";
import { InstructorReview } from "./components/InstructorReview";
import { PortfolioTransformation } from "./components/PortfolioTransformation";
import { PlanManagementView } from "./components/PlanManagementView";
import { UpgradeModal } from "./components/UpgradeModal";
import { PublishedPortfolioModal } from "./components/PublishedPortfolioModal";
import { UnauthorizedState } from "./components/UnauthorizedState";
import { CheckCircle2, Clock } from "lucide-react";

export default function App() {
  const { user: auth0User, logout } = useAuth0();

  // ?demo=true enables the Guided Demo Override persona switcher
  const isDemoMode = new URLSearchParams(window.location.search).get("demo") === "true";

  // Primary identity comes from Auth0; demo switcher can override only when ?demo=true
  const realUser = auth0User ? mapAuth0UserToSession(auth0User) : instructorSession;
  const [currentUser, setCurrentUser] = useState<SessionUser>(realUser);

  // Active step in guided demo flow
  const [currentStep, setCurrentStep] = useState<DemoStep>("course");

  // Domain data states
  const [candidates, setCandidates] = useState<EnrolledStudent[]>(candidateStudents);
  const [projectTrack, setProjectTrack] = useState<ProjectTrack>(getProjectTrack());
  const [studentProject, setStudentProject] = useState<StudentProject>(getStudentProject());
  const [portfolio, setPortfolio] = useState<Portfolio>(getPortfolio());
  const [subscription, setSubscription] = useState<Subscription>(getSubscription());
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>(getEnrolledStudents());

  // Roster selection state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [pendingAttemptedStudentId, setPendingAttemptedStudentId] = useState<string | null>(null);

  // UI States
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"seat_limit" | "portfolio_publish">("seat_limit");
  const [showPublishedModal, setShowPublishedModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Persistent banner shown after returning from Stripe (no plan change until webhook)
  const [checkoutBanner, setCheckoutBanner] = useState<"success" | "cancelled" | null>(null);

  // Sync state changes with storage
  useEffect(() => {
    setProjectTrack(getProjectTrack());
    setStudentProject(getStudentProject());
    setPortfolio(getPortfolio());
    setSubscription(getSubscription());
    setEnrolledStudents(getEnrolledStudents());
  }, []);

  // In real mode, wipe any mock-checkout subscription left in localStorage so paywalls fire correctly
  useEffect(() => {
    if (!isDemoMode) {
      const sub = getSubscription();
      if (sub.stripeCustomerId?.startsWith("cus_mock")) {
        const fresh = saveSubscription({ organizationId: sub.organizationId, plan: "free", status: "active" });
        setSubscription(fresh);
      }
    }
  }, [isDemoMode]);

  // Keep currentUser in sync with Auth0 unless demo mode is active.
  // Students are routed directly to their workspace (evidence step).
  useEffect(() => {
    if (!isDemoMode && auth0User) {
      const mapped = mapAuth0UserToSession(auth0User);
      setCurrentUser(mapped);
      if (mapped.role === "student") {
        setCurrentStep("evidence");
      }
    }
  }, [auth0User, isDemoMode]);

  // Show auto-dismiss toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle ?checkout=success|cancelled returned from Stripe (runs after triggerToast is defined)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("checkout");
    if (status === "success" || status === "cancelled") {
      setCheckoutBanner(status);
      if (status === "cancelled") {
        triggerToast("Checkout cancelled — your plan is unchanged.");
      }
      // Strip checkout params from the URL without reloading
      params.delete("checkout");
      params.delete("session_id");
      const newSearch = params.toString();
      window.history.replaceState({}, "", newSearch ? `?${newSearch}` : window.location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch identity — only reachable when demo mode is active
  const handleSwitchUser = (user: SessionUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

  // Reset demo data to clean slate
  const handleResetDemo = () => {
    resetDemoData();
    setCandidates(candidateStudents);
    setProjectTrack(getProjectTrack());
    setStudentProject(getStudentProject());
    setPortfolio(getPortfolio());
    setSubscription(getSubscription());
    setEnrolledStudents(getEnrolledStudents());
    setSelectedStudentIds([]);
    setPendingAttemptedStudentId(null);
    setCurrentStep("course");
    setCurrentUser(instructorSession);
  };

  // Step 1 -> Step 2: Generate Real-World Project with Gemini API
  const handleGenerateProject = async (courseData: {
    title: string;
    description: string;
    modules: string[];
    level: string;
    duration: string;
  }) => {
    setIsGeneratingProject(true);
    setCurrentStep("project");

    try {
      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseTitle: courseData.title,
          description: courseData.description,
          modules: courseData.modules,
        }),
      });

      const data = await response.json();
      if (data.success && data.project) {
        const newTrack: ProjectTrack = {
          id: `track-${Date.now()}`,
          courseId: "course-pm-101",
          title: data.project.title,
          objective: data.project.objective,
          durationWeeks: data.project.durationWeeks || 4,
          milestones: data.project.milestones.map((m: any, idx: number) => ({
            id: `m-${idx + 1}`,
            number: m.number || idx + 1,
            title: m.title,
            description: m.description,
            tasks: m.tasks || [],
          })),
          requiredEvidence: data.project.requiredEvidence || [],
          evaluationCriteria: data.project.evaluationCriteria || [],
          status: "draft",
        };

        saveGeneratedProject(newTrack);
        setProjectTrack(newTrack);
      }
    } catch (err) {
      console.error("Failed to generate project via API, using existing project:", err);
    } finally {
      setIsGeneratingProject(false);
    }
  };

  // Step 2 Action: Publish to Students -> mark track published, move to Roster
  const handlePublishToStudents = () => {
    const published: ProjectTrack = { ...projectTrack, status: "published" };
    saveGeneratedProject(published);
    setProjectTrack(published);
    setCurrentStep("roster");
  };

  // Toggle selection on Roster candidate list
  const handleToggleSelectStudent = (studentId: string) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
    } else {
      const isCohortPro = subscription.plan === "cohort_pro";
      const maxSeats = isCohortPro ? 30 : 3;

      if (selectedStudentIds.length >= maxSeats) {
        setPendingAttemptedStudentId(studentId);
        setUpgradeReason("seat_limit");
        setShowUpgradeModal(true);
      } else {
        setSelectedStudentIds((prev) => [...prev, studentId]);
      }
    }
  };

  // Action: Enroll Selected Students from Roster
  const handleEnrollSelectedStudents = () => {
    if (selectedStudentIds.length === 0) return;

    const enrolledList = candidates.filter((std) => selectedStudentIds.includes(std.id));
    saveEnrolledStudents(enrolledList);
    setEnrolledStudents(enrolledList);

    triggerToast(`${selectedStudentIds.length} students enrolled successfully`);

    if (isDemoMode) {
      // Guided demo: auto-switch to Maya's seat so the reviewer can see the evidence step
      setCurrentUser(studentSession);
      setCurrentStep("evidence");
    } else {
      // Real mode: instructor stays instructor and moves to review student work
      setCurrentStep("review");
    }
  };

  // Roster email invite action
  const handleInviteByEmail = (name: string, email: string) => {
    const newStudent: EnrolledStudent = {
      id: `std-${Date.now()}`,
      name,
      email,
      projectStatus: "not_started",
    };

    // Add to available candidates list so it shows up in Available Learners
    setCandidates((prev) => [...prev, newStudent]);

    const isCohortPro = subscription.plan === "cohort_pro";
    const maxSeats = isCohortPro ? 30 : 3;

    if (selectedStudentIds.length < maxSeats) {
      setSelectedStudentIds((prev) => [...prev, newStudent.id]);
      triggerToast(`Added ${name} (${email}) to available learners and selected`);
    } else {
      triggerToast(`Added ${name} (${email}) to available learners`);
    }
  };

  // Step 4 Action: Student Submits Single Primary Artifact
  const handleSubmitArtifact = (artifactUrl: string, reflection?: string) => {
    const updatedSp = saveSingleArtifact(artifactUrl, reflection);
    setStudentProject(updatedSp);
    setEnrolledStudents(getEnrolledStudents());
    triggerToast("Primary artifact submitted successfully! Status: Waiting for instructor review.");
  };

  // Step 4 Action: Request Review -> move to Instructor Review
  const handleRequestReview = () => {
    if (isDemoMode) {
      // Guided demo: auto-switch to Dr. Nicole so the reviewer can approve immediately
      setCurrentUser(instructorSession);
      setCurrentStep("review");
    } else {
      // Real mode: student stays student; just confirm submission was received
      triggerToast("Submitted! Your instructor will review your work.");
    }
  };

  // Step 5 Action: Instructor Approves & Generates Portfolio -> move to Portfolio
  const handleGeneratePortfolio = () => {
    setCurrentStep("portfolio");
  };

  // Step 6 Action: Instructor clicks Verify and Publish
  // If already on an active Cohort Pro subscription, publish directly without opening Stripe modal.
  const handleVerifyAndPublish = () => {
    if (subscription.plan === "cohort_pro" && subscription.status === "active") {
      const updated = publishPortfolio();
      setPortfolio(updated);
      setShowPublishedModal(true);
    } else {
      setUpgradeReason("portfolio_publish");
      setShowUpgradeModal(true);
    }
  };

  // Demo-mode mock checkout success callback (only reachable when useMockCheckout=true)
  const handleUpgradeSuccess = async () => {
    setShowUpgradeModal(false);
    const result = await startMockCheckout(upgradeReason);
    setSubscription(result.subscription);
    setPortfolio(result.portfolio);

    // If there was an attempted 4th student selection, preserve it!
    if (pendingAttemptedStudentId) {
      if (!selectedStudentIds.includes(pendingAttemptedStudentId)) {
        setSelectedStudentIds((prev) => [...prev, pendingAttemptedStudentId]);
      }
      setPendingAttemptedStudentId(null);
      triggerToast("Upgraded to Cohort Pro! 30 seats unlocked.");
    } else {
      setShowPublishedModal(true);
    }
  };

  // Modal Go Back / Close Callback
  const handleModalClose = () => {
    setShowUpgradeModal(false);
    // If user clicked Go Back during seat limit check, discard the 4th student attempt and keep only the first 3
    setPendingAttemptedStudentId(null);
  };

  // Render view depending on step & authorization
  const renderCurrentView = () => {
    switch (currentStep) {
      case "course":
        if (currentUser.role === "student") {
          return (
            <UnauthorizedState
              currentUser={currentUser}
              requiredRole="instructor"
              onSwitchRole={handleSwitchUser}
              isDemoMode={isDemoMode}
            />
          );
        }
        return (
          <CourseInput
            onGenerateProject={handleGenerateProject}
            isGenerating={isGeneratingProject}
          />
        );

      case "project":
        if (currentUser.role === "student") {
          return (
            <UnauthorizedState
              currentUser={currentUser}
              requiredRole="instructor"
              onSwitchRole={handleSwitchUser}
              isDemoMode={isDemoMode}
            />
          );
        }
        return (
          <ProjectGenerator
            projectTrack={projectTrack}
            isAnalyzing={isGeneratingProject}
            onSaveProject={(p) => {
              saveGeneratedProject(p);
              setProjectTrack(p);
            }}
            onPublishToStudents={handlePublishToStudents}
            onRegenerate={() =>
              handleGenerateProject({
                title: getCourse().title,
                description: getCourse().description,
                modules: getCourse().modules,
                level: "Undergraduate / Professional",
                duration: "4 Weeks",
              })
            }
          />
        );

      case "roster":
        if (currentUser.role === "student") {
          return (
            <UnauthorizedState
              currentUser={currentUser}
              requiredRole="instructor"
              onSwitchRole={handleSwitchUser}
              isDemoMode={isDemoMode}
            />
          );
        }
        return (
          <StudentRosterView
            candidateStudents={candidates}
            selectedStudentIds={selectedStudentIds}
            subscription={subscription}
            currentUser={currentUser}
            onToggleSelectStudent={handleToggleSelectStudent}
            onEnrollSelectedStudents={handleEnrollSelectedStudents}
            onBackToProject={() => setCurrentStep("project")}
            onInviteByEmail={handleInviteByEmail}
          />
        );

      case "evidence":
        if (currentUser.role === "instructor") {
          return (
            <UnauthorizedState
              currentUser={currentUser}
              requiredRole="student"
              onSwitchRole={handleSwitchUser}
              isDemoMode={isDemoMode}
            />
          );
        }
        return (
          <StudentEvidenceWorkspace
            studentProject={studentProject}
            currentUser={currentUser}
            onSubmitArtifact={handleSubmitArtifact}
            onRequestReview={handleRequestReview}
          />
        );

      case "review":
        if (currentUser.role === "student") {
          return (
            <UnauthorizedState
              currentUser={currentUser}
              requiredRole="instructor"
              onSwitchRole={handleSwitchUser}
              isDemoMode={isDemoMode}
            />
          );
        }
        return (
          <InstructorReview
            studentProject={studentProject}
            enrolledStudents={enrolledStudents.length > 0 ? enrolledStudents : candidates}
            currentUser={currentUser}
            onApprove={handleGeneratePortfolio}
            onRequestRevision={() => triggerToast("Revision request sent to student.")}
            onGeneratePortfolio={handleGeneratePortfolio}
          />
        );

      case "portfolio":
        return (
          <PortfolioTransformation
            portfolio={portfolio}
            studentProject={studentProject}
            subscription={subscription}
            currentUser={currentUser}
            onVerifyAndPublish={handleVerifyAndPublish}
            onEditPortfolio={() => triggerToast("Portfolio editor opened.")}
            onRequestRevision={() => setCurrentStep("review")}
          />
        );

      case "plan":
        if (currentUser.role === "student") {
          return (
            <UnauthorizedState
              currentUser={currentUser}
              requiredRole="instructor"
              onSwitchRole={handleSwitchUser}
              isDemoMode={isDemoMode}
            />
          );
        }
        return (
          <PlanManagementView
            subscription={subscription}
            currentUser={currentUser}
            onOpenUpgradeModal={() => {
              setUpgradeReason("seat_limit");
              setShowUpgradeModal(true);
            }}
          />
        );

      default:
        return (
          <CourseInput
            onGenerateProject={handleGenerateProject}
            isGenerating={isGeneratingProject}
          />
        );
    }
  };

  return (
    <AppShell
      currentUser={currentUser}
      onSwitchUser={handleSwitchUser}
      currentStep={currentStep}
      onSelectStep={(step) => setCurrentStep(step)}
      isPublished={portfolio.status === "published" && subscription.plan === "cohort_pro"}
      onResetDemo={handleResetDemo}
      onLogout={handleLogout}
      isDemoMode={isDemoMode}
    >
      {/* Post-Stripe-Return Banner (persists until dismissed; no plan change yet) */}
      {checkoutBanner === "success" && (
        <div className="sticky top-16 z-40 w-full bg-indigo-600 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-semibold shadow-md">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Payment received. Confirming your subscription — this may take a moment.</span>
          </div>
          <button
            onClick={() => setCheckoutBanner(null)}
            className="shrink-0 underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {renderCurrentView()}

      {/* Stripe Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={handleModalClose}
        onUpgradeSuccess={handleUpgradeSuccess}
        reason={upgradeReason}
        organizationId={currentUser.organizationId}
        useMockCheckout={isDemoMode}
      />

      {/* Published Portfolio View Modal */}
      <PublishedPortfolioModal
        portfolio={portfolio}
        isOpen={showPublishedModal}
        onClose={() => setShowPublishedModal(false)}
      />
    </AppShell>
  );
}
