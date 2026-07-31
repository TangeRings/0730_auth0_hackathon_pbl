import { User } from "@auth0/auth0-react";
import { SessionUser } from "../types";

const INSTRUCTOR_EMAILS = ["niniwang.tange@gmail.com", "nicole@acme.edu", "nicolecheyennew@gmail.com"];

export function mapAuth0UserToSession(user: User): SessionUser {
  const email = user.email ?? "";
  return {
    id: user.sub ?? "unknown",
    name: user.name ?? user.nickname ?? email,
    email,
    organizationId: "org-acme",
    role: INSTRUCTOR_EMAILS.includes(email) ? "instructor" : "student",
  };
}

export const instructorSession: SessionUser = {
  id: "user-nicole",
  name: "Dr. Nicole Wang",
  email: "nicole@acme.edu",
  organizationId: "org-acme",
  role: "instructor",
};

export const studentSession: SessionUser = {
  id: "user-maya",
  name: "Maya Chen",
  email: "maya@example.com",
  organizationId: "org-acme",
  role: "student",
};

/**
 * Reusable permission helpers.
 * These encapsulate all authorization logic so Auth0 can easily integrate later.
 */

export function canCreateProject(user: SessionUser | null): boolean {
  return user?.role === "instructor";
}

export function canSubmitEvidence(user: SessionUser | null): boolean {
  return user?.role === "student";
}

export function canReviewPortfolio(user: SessionUser | null): boolean {
  return user?.role === "instructor";
}

export function canManageBilling(user: SessionUser | null): boolean {
  return user?.role === "instructor";
}

export function canPublishPortfolio(user: SessionUser | null): boolean {
  return user?.role === "instructor";
}
