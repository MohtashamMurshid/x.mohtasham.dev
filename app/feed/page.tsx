"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import TweetComposer from "../../components/TweetComposer";
import Tweet from "../../components/Tweet";
import UsersList from "../../components/UsersList";
import ProfileSetup from "../../components/ProfileSetup";

export default function FeedPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    router.replace("/signin");
  }

  const tweets = useQuery(api.myFunctions.getTimeline, { limit: 20 }) ?? [];

  return (
    <main className="min-h-screen bg-black text-white font-mono">
      <header className="sticky top-0 z-10 bg-black text-white p-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-row justify-between items-center">
          <Link href="/" className="text-sm text-gray-300 hover:text-white">
            ← Home
          </Link>
          <h1 className="text-xl font-bold tracking-tight">[X]•clone</h1>
          <SignOutButton />
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
        <section className="border border-gray-800 rounded">
          <TweetComposer />
          <div className="divide-y divide-gray-900/50">
            {tweets.map((tweet) => (
              <Tweet key={tweet._id} tweet={tweet} />
            ))}
            {tweets.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                No tweets yet. Be the first to tweet something!
              </div>
            )}
          </div>
        </section>

        <aside className="hidden md:block border border-gray-800 rounded p-4">
          <ProfileSetup />
          <div className="h-4" />
          <UsersList />
        </aside>
      </div>
    </main>
  );
}
