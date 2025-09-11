"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Image as ImageIcon, BarChart3 } from "lucide-react";

export default function TweetComposer() {
  const [content, setContent] = useState("");
  const createTweet = useMutation(api.myFunctions.createTweet);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createTweet({ content });
    setContent("");
  };

  return (
    <div className="border-b border-gray-900/50 p-4">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="w-12 h-12 bg-gray-800 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full resize-none border-none outline-none text-xl placeholder-gray-600 bg-transparent text-white"
            rows={3}
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-4 text-gray-400">
              <button
                type="button"
                className="p-2 hover:bg-white/5 rounded-full"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-white/5 rounded-full"
              >
                <BarChart3 className="h-5 w-5" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!content.trim()}
              className="border border-white text-black bg-white px-6 py-2 rounded-full font-bold hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tweet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
