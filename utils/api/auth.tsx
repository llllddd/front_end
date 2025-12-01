import { apiClient } from "./client";

// Check if user is authenticated
export async function validateSession(): Promise<void> {
  await apiClient.post("/auth", {});
}

// Invalidate user session
export async function invalidateSession(): Promise<void> {
  await apiClient.post("/auth/invalidate", {});
}

/**
 * Add email to user profile
 * 
 * @param {string} email The email address to add
 */
export async function addEmailToProfile(email: string): Promise<void> {
  await apiClient.post("/auth/profile", { email });
}

/**
 * Reset user's email
 */
export async function resetEmail(): Promise<void> {
    await apiClient.post("/auth/profile/reset", {});
}

/**
 * Request a new verification token to be sent by email
 */
export async function requestToken(): Promise<void> {
  await apiClient.post("/auth/token/email", {});
}
