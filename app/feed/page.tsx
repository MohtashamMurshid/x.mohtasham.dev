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
import {
  Home,
  Search,
  Bell,
  MessageSquare,
  Bookmark,
  List,
  User as UserIcon,
  Plus,
} from "lucide-react";

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
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center">
          <Link href="/" className="text-sm text-gray-300 hover:text-white">
            ← Home
          </Link>
          <h1 className="text-xl font-bold tracking-tight">[X]•clone</h1>
          <SignOutButton />
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)_320px] gap-6">
        {/* Left Navigation Sidebar */}
        <aside className="hidden md:block border border-gray-800 rounded p-4 h-max sticky top-[72px] self-start">
          <nav className="space-y-2">
            <Link
              href="/feed"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-900/60"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-900/60"
            >
              <Search className="h-5 w-5" />
              <span>Explore</span>
            </Link>
            <Link
              href="/notifications"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-900/60"
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </Link>
            <Link
              href="/messages"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-900/60"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            <Link
              href="/bookmarks"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-900/60"
            >
              <Bookmark className="h-5 w-5" />
              <span>Bookmarks</span>
            </Link>
            <Link
              href="/lists"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-900/60"
            >
              <List className="h-5 w-5" />
              <span>Lists</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-900/60"
            >
              <UserIcon className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <button className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              <span>Post</span>
            </button>
          </nav>
        </aside>

        {/* Center Timeline */}
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

        {/* Right Rail */}
        <aside className="hidden md:block space-y-4 h-max sticky top-[72px] self-start">
          {/* Search */}
          <div className="border border-gray-800 rounded p-3">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent outline-none placeholder:text-gray-500 px-3 py-2 border border-gray-800 rounded focus:border-gray-600"
            />
          </div>

          {/* Profile setup */}
          <div className="border border-gray-800 rounded p-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-200">
              Complete your profile
            </h3>
            <ProfileSetup />
          </div>

          {/* Who to follow */}
          <div className="border border-gray-800 rounded p-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-200">
              Who to follow
            </h3>
            <UsersList />
          </div>
        </aside>
      </div>
    </main>
  );
}
