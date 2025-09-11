"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-block border border-gray-800 rounded px-3 py-1 text-xs uppercase tracking-widest text-gray-300">
            Monochrome • Monospace
          </div>
          <h1 className="text-3xl font-bold">
            Sign {flow === "signIn" ? "in" : "up"} to [X]•clone
          </h1>
          <p className="text-gray-300 text-sm">
            Minimal auth • Email + password
          </p>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            formData.set("flow", flow);
            void signIn("password", formData)
              .catch((error) => {
                setError(error.message);
              })
              .then(() => {
                router.push("/");
              });
          }}
        >
          <input
            className="w-full rounded px-3 py-2 bg-black text-white placeholder-gray-500 border border-gray-800 focus:outline-none focus:border-white"
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            className="w-full rounded px-3 py-2 bg-black text-white placeholder-gray-500 border border-gray-800 focus:outline-none focus:border-white"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button
            className="w-full px-4 py-2 rounded border border-white text-black bg-white hover:bg-black hover:text-white transition-colors"
            type="submit"
          >
            {flow === "signIn" ? "Sign in" : "Sign up"}
          </button>
          <div className="flex flex-row gap-2">
            <span>
              {flow === "signIn"
                ? "Don\'t have an account?"
                : "Already have an account?"}
            </span>
            <span
              className="text-white underline hover:no-underline cursor-pointer"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            >
              {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
            </span>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 rounded p-2">
              <p className="text-red-200 text-xs">Error signing in: {error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
