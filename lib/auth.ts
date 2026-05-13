import { auth, currentUser } from "@clerk/nextjs/server";
import { env } from "@/lib/env";

type AdminAccess = {
  userId: string;
  email: string;
};

export async function requireAdminAccess(): Promise<AdminAccess> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const primaryEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isVerified = user.primaryEmailAddress?.verification?.status === "verified";
  const role = typeof user.publicMetadata?.role === "string" ? user.publicMetadata.role : "";
  const isAdminEmail = primaryEmail ? env.adminEmails.includes(primaryEmail) : false;
  const isAdmin = role === "admin" || isAdminEmail;

  if (!isVerified) {
    throw new Error("Email verification required");
  }

  if (!isAdmin || !primaryEmail) {
    throw new Error("Forbidden");
  }

  return { userId, email: primaryEmail };
}
