"use client";

import Link from "next/link";
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

export default function Sidebar() {
  return (
    <aside className="hidden md:block h-max sticky top-[72px] self-start">
      <nav className="space-y-1">
        <Link
          href="/feed"
          className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-white/5 w-max"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/explore"
          className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-white/5 w-max"
        >
          <Search className="h-5 w-5" />
          <span>Explore</span>
        </Link>
        <Link
          href="/notifications"
          className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-white/5 w-max"
        >
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
        </Link>
        <Link
          href="/messages"
          className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-white/5 w-max"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Messages</span>
        </Link>
        <Link
          href="/bookmarks"
          className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-white/5 w-max"
        >
          <Bookmark className="h-5 w-5" />
          <span>Bookmarks</span>
        </Link>
        <Link
          href="/lists"
          className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-white/5 w-max"
        >
          <List className="h-5 w-5" />
          <span>Lists</span>
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-white/5 w-max"
        >
          <UserIcon className="h-5 w-5" />
          <span>Profile</span>
        </Link>
        <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 w-48">
          <Plus className="h-5 w-5" />
          <span>Post</span>
        </button>
      </nav>
    </aside>
  );
}
