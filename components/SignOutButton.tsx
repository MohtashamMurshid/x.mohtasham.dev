"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  if (!isAuthenticated) return null;

  return (
    <button
      className="px-3 py-1 rounded border border-gray-700 text-white hover:bg-white hover:text-black transition-colors"
      onClick={() => void signOut().then(() => router.push("/signin"))}
    >
      Sign out
    </button>
  );
}
