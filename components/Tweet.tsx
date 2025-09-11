"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface TweetProps {
  tweet: {
    _id: Id<"tweets">;
    content: string;
    author?: {
      displayName: string;
      username: string;
    } | null;
    _creationTime: number;
    stats?: { likes: number; retweets: number; replies: number };
    viewer?: { liked: boolean; retweeted: boolean };
  };
}

export default function Tweet({ tweet }: TweetProps) {
  const likeTweet = useMutation(api.myFunctions.likeTweet);
  const unlikeTweet = useMutation(api.myFunctions.unlikeTweet);
  const retweetTweet = useMutation(api.myFunctions.retweetTweet);
  const unretweetTweet = useMutation(api.myFunctions.unretweetTweet);

  const handleLike = async () => {
    try {
      await likeTweet({ tweetId: tweet._id });
    } catch {
      // Already liked, try unlike
      await unlikeTweet({ tweetId: tweet._id });
    }
  };

  const handleRetweet = async () => {
    try {
      await retweetTweet({ tweetId: tweet._id });
    } catch {
      await unretweetTweet({ tweetId: tweet._id });
    }
  };

  return (
    <div className="border-b border-gray-900/50 p-4 hover:bg-black/40 cursor-pointer text-white">
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold">
              {tweet.author?.displayName || "User"}
            </span>
            <span className="text-gray-400">
              @{tweet.author?.username || "user"}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-400">
              {new Date(tweet._creationTime).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-100 mb-3 whitespace-pre-wrap">
            {tweet.content}
          </p>
          <div className="flex gap-8 text-gray-400">
            <button className="flex items-center gap-2 hover:text-gray-200">
              💬 {tweet.stats?.replies ?? 0}
            </button>
            <button
              onClick={handleRetweet}
              className={`flex items-center gap-2 hover:text-gray-200 ${
                tweet.viewer?.retweeted ? "text-white" : ""
              }`}
            >
              🔄 {tweet.stats?.retweets ?? 0}
            </button>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 hover:text-gray-200 ${
                tweet.viewer?.liked ? "text-white" : ""
              }`}
            >
              ❤️ {tweet.stats?.likes ?? 0}
            </button>
            <button className="flex items-center gap-2 hover:text-gray-200">
              📊
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
