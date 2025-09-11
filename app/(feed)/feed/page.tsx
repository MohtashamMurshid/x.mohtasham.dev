"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import TweetComposer from "../../../components/TweetComposer";
import Tweet from "../../../components/Tweet";

export default function FeedPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    router.replace("/signin");
  }

  const tweets = useQuery(api.myFunctions.getTimeline, { limit: 20 }) ?? [];

  return (
    <section className="border-x border-gray-800">
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
  );
}
