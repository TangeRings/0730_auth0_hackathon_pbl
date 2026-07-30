import React, { useState, useEffect } from "react";
import {
  SessionUser,
  DemoStep,
  ProjectTrack,
  StudentProject,
  Portfolio,
  Subscription,
  EvidenceItem,
} from "./types";
import { instructorSession, studentSession, canCreateProject, canReviewPortfolio, canManageBilling } from "./services/sessionService";
import {
  getCourse,
  getProjectTrack,
  saveGeneratedProject,
  getStudentProject,
  saveEvidence,
  getPortfolio,
  savePortfolio,
  getSubscription,
  saveSubscription,
  resetDemoData,
} from "./services/dataService";
import { startCheckout } from "./services/billingService";

import { AppShell } from "./components/AppShell";
import { CourseInput } from "./components/CourseInput";
import { ProjectGenerator } from "./components/ProjectGenerator";
import { StudentEvidenceWorkspace } from "./components/StudentEvidenceWorkspace";
import { InstructorReview } from "./components/InstructorReview";
import { PortfolioTransformation } from "./components/PortfolioTransformation";
import { PlanManagementView } from "./components/PlanManagementView";
import { UpgradeModal } from "./components/UpgradeModal";
import { PublishedPortfolioModal } from "./components/PublishedPortfolioModal";
import { UnauthorizedState } from "./components/UnauthorizedState";

export default function App() {
  // Current active demo session identity (Default: Dr. Nicole Wang)
  const [currentUser, setCurrentUser] = useState<SessionUser>(instructorSession);

  // Current active step in guided demo flow
  const [currentStep, setCurrentStep] = useState<DemoStep>("course");

  // Domain data states
  const [projectTrack, setProjectTrack] = useState<ProjectTrack>(getProjectTrack());
  const [studentProject, setStudentProject] = useState<StudentProject>(getStudentProject());
  const [portfolio, setPortfolio] = useState<Portfolio>(getPortfolio());
  const [subscription, setSubscription] = useState<Subscription>(getSubscription());

  // UI States
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPublishedModal, setShowPublishedModal] = useState(false);

  // Sync state changes with storage
  useEffect(() => {
    setProjectTrack(getProjectTrack());
    setStudentProject(getStudentProject());
    setPortfolio(getPortfolio());
    setSubscription(getSubscription());
  }, []);

  // Switch identity in Demo Mode
  const handleSwitchUser = (user: SessionUser) => {
    setCurrentUser(user);
  };

  // Reset demo data to clean slate
  const handleResetDemo = () => {
    resetDemoData();
    setProjectTrack(getProjectTrack());
    setStudentProject(getStudentProject());
    setPortfolio(getPortfolio());
    setSubscription(getSubscription());
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
          status: "published",
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

  // Step 2 Action: Publish to Students -> move to Evidence
  const handlePublishToStudents = () => {
    setCurrentStep("evidence");
  };

  // Step 3 Action: Student Submits Evidence
  const handleAddEvidence = (item: EvidenceItem) => {
    const updatedSp = saveEvidence(item);
    setStudentProject(updatedSp);
  };

  // Step 3 Action: Student Requests Review -> move to Instructor Review
  const handleRequestReview = () => {
    setCurrentStep("review" as DemoStep);
  };

  // Step 4 Action: Instructor Approves & Generates Portfolio -> move to Portfolio
  const handleGeneratePortfolio = () => {
    setCurrentStep("portfolio");
  };

  // Step 5 Action: Instructor clicks Verify and Publish -> open Stripe Upgrade Modal
  const handleVerifyAndPublish = () => {
    setShowUpgradeModal(true);
  };

  // Step 6 Action: Stripe Checkout Success Callback
  const handleUpgradeSuccess = async () => {
    setShowUpgradeModal(false);
    const result = await startCheckout();
    setSubscription(result.subscription);
    setPortfolio(result.portfolio);
    setShowPublishedModal(true);
  };

  // Render main content area depending on active step & authorization
  const renderCurrentView = () => {
    switch (currentStep) {
      case "course":
        if (!canCreateProject(currentUser) && currentUser.role !== "student") {
          return (
            <UnauthorizedState
              currentUser={currentUser}
              requiredRole="instructor"
              onSwitchRole={handleSwitchUser}
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
        if (!canCreateProject(currentUser)) {
          return (
            <UnauthorizedState
              currentUser={currentUser}
              requiredRole="instructor"
              onSwitchRole={handleSwitchUser}
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

      case "evidence":
        return (
          <StudentEvidenceWorkspace
            studentProject={studentProject}
            currentUser={currentUser}
            onAddEvidence={handleAddEvidence}
            onRequestReview={handleRequestReview}
          />
        );

      case "review" as DemoStep:
        if (!canReviewPortfolio(currentUser)) {
          return (
            <UnauthorizedState
              currentUser={currentUser}
              requiredRole="instructor"
              onSwitchRole={handleSwitchUser}
            />
          );
        }
        return (
          <InstructorReview
            studentProject={studentProject}
            currentUser={currentUser}
            onApprove={handleGeneratePortfolio}
            onRequestRevision={() => alert("Revision request sent to student.")}
            onGeneratePortfolio={handleGeneratePortfolio}
          />
        );

      case "portfolio":
        return (
          <PortfolioTransformation
            portfolio={portfolio}
            studentProject={studentProject}
            subscription={subscription}
            onVerifyAndPublish={handleVerifyAndPublish}
            onEditPortfolio={() => alert("Portfolio editor opened.")}
            onRequestRevision={() => setCurrentStep("review" as DemoStep)}
          />
        );

      case "plan":
        return (
          <PlanManagementView
            subscription={subscription}
            currentUser={currentUser}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
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
    >
      {renderCurrentView()}

      {/* Stripe Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
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
