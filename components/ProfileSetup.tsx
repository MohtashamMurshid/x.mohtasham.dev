"use client";

import { useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function ProfileSetup() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const profile = useQuery(api.myFunctions.getCurrentProfile);
  const createProfile = useMutation(api.myFunctions.createProfile);

  // Avoid showing modal while auth/profile are loading
  if (authLoading) return null;
  if (!isAuthenticated) return null;
  if (profile === undefined) return null; // query loading state
  if (profile) return null; // Profile already exists

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !displayName.trim()) return;

    await createProfile({ username, displayName, bio });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-black border border-gray-800 p-8 rounded-lg max-w-md w-full mx-4 text-white font-mono">
        <h2 className="text-2xl font-bold mb-4">Complete your profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-800 bg-transparent rounded-md text-white placeholder-gray-600 focus:outline-none"
              placeholder="@username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-2 border border-gray-800 bg-transparent rounded-md text-white placeholder-gray-600 focus:outline-none"
              placeholder="Your display name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Bio (optional)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border border-gray-800 bg-transparent rounded-md text-white placeholder-gray-600 resize-none focus:outline-none"
              rows={3}
              placeholder="Tell us about yourself"
            />
          </div>
          <button
            type="submit"
            className="w-full border border-white text-black bg-white py-2 rounded-md font-bold hover:bg-black hover:text-white transition-colors"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}
