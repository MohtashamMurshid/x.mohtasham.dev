"use client";

import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import ProfileSetup from "@/components/ProfileSetup";
import UsersList from "@/components/UsersList";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-black text-white font-mono">
      <Header />
      <div className="mx-auto p-4 py-6 grid grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)_320px] gap-6">
        <Sidebar />
        {children}
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
