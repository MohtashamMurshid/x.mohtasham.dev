"use client";

import { useConvexAuth } from "convex/react";
import Link from "next/link";
import Header from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-64px)] bg-black text-white font-mono flex items-center justify-center px-6">
        <section className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-block border border-gray-800 rounded px-3 py-1 text-xs uppercase tracking-widest text-gray-300">
              Monochrome • Monospace
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold leading-tight">
              The simplest [X] clone
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Built with Next.js and Convex. Minimal. Fast. Focused.
            </p>
          </div>

          <Cta />

          <div className="mx-auto max-w-xl text-left border-t border-gray-900/50 pt-8">
            <ul className="grid sm:grid-cols-3 gap-4 text-sm text-gray-300">
              <li className="border border-gray-800 rounded p-3">
                <span className="block text-white">Realtime</span>
                <span className="block text-gray-400">Convex-backed data</span>
              </li>
              <li className="border border-gray-800 rounded p-3">
                <span className="block text-white">Auth</span>
                <span className="block text-gray-400">Sign in to continue</span>
              </li>
              <li className="border border-gray-800 rounded p-3">
                <span className="block text-white">Minimal UI</span>
                <span className="block text-gray-400">
                  Monospace aesthetics
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}

// SignOutButton moved to components/SignOutButton.tsx

function Cta() {
  const { isAuthenticated } = useConvexAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-gray-300">Sign in to access your feed</p>
        <div className="flex flex-row gap-3">
          <Link
            href="/signin"
            className="px-5 py-2 rounded border border-white text-black bg-white hover:bg-black hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <a
            href="https://convex.dev"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 rounded border border-gray-700 text-white hover:bg-white hover:text-black transition-colors"
          >
            Learn more
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-gray-300">You&apos;re signed in.</p>
      <Link
        href="/feed"
        className="px-5 py-2 rounded border border-gray-700 text-white hover:bg-white hover:text-black transition-colors"
      >
        Go to app
      </Link>
    </div>
  );
}
