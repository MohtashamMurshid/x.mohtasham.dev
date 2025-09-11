"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import Tweet from "../../components/Tweet";

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    router.replace("/signin");
  }

  const profile = useQuery(api.myFunctions.getProfile);

  // Load tweets by this user once profile is loaded
  const tweets = useQuery(
    api.myFunctions.getTweets,
    profile ? { authorId: profile.userId, limit: 50 } : "skip",
  );

  return (
    <main className="min-h-screen bg-black text-white font-mono">
      <header className="sticky top-0 z-10 bg-black text-white p-4 border-b border-gray-800">
        <div className="max-w-3xl mx-auto flex flex-col">
          <h1 className="text-xl font-bold tracking-tight">
            {profile?.displayName || "Profile"}
          </h1>
          {typeof tweets === "object" && tweets && (
            <span className="text-sm text-gray-400">
              {tweets.length} Tweets
            </span>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto">
        {/* Cover */}
        <div className="h-40 bg-gray-900" />

        {/* Avatar row */}
        <div className="px-4 -mt-8 flex items-end justify-between">
          <div className="w-24 h-24 bg-gray-800 rounded-full border-4 border-black" />
          <button className="border border-gray-700 text-white px-4 py-2 rounded-full hover:bg-white/10">
            Edit profile
          </button>
        </div>

        {/* User info */}
        <section className="px-4 mt-4">
          <h2 className="text-xl font-bold">
            {profile?.displayName || "User"}
          </h2>
          <p className="text-gray-400">@{profile?.username || "username"}</p>
          {profile?.bio && (
            <p className="mt-3 text-gray-200 whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}
        </section>

        {/* Tabs placeholder */}
        <div className="mt-6 border-b border-gray-800 flex">
          <button className="px-4 py-3 text-white border-b-2 border-white">
            Posts
          </button>
          {/* Future: Replies, Media, Likes */}
        </div>

        {/* Tweets */}
        <section className="border-x border-gray-800">
          {tweets === undefined && (
            <div className="p-8 text-center text-gray-400">Loading…</div>
          )}
          {Array.isArray(tweets) && tweets.length === 0 && (
            <div className="p-8 text-center text-gray-400">No posts yet</div>
          )}
          {Array.isArray(tweets) &&
            tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)}
        </section>
      </div>
    </main>
  );
}
