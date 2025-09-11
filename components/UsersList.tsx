"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export default function UsersList() {
  const profiles = useQuery(api.myFunctions.getAllProfiles) ?? [];
  const followUser = useMutation(api.myFunctions.followUser);
  const unfollowUser = useMutation(api.myFunctions.unfollowUser);

  const handleFollow = async (userId: Id<"users">) => {
    try {
      await followUser({ followingId: userId });
    } catch {
      // Already following, try unfollow
      await unfollowUser({ followingId: userId });
    }
  };

  return (
    <div className="border border-gray-800 rounded p-4 text-white font-mono">
      <h3 className="font-bold mb-4">Who to follow</h3>
      <div className="space-y-4">
        {profiles.slice(0, 5).map((profile) => (
          <div key={profile._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
              <div>
                <p className="font-bold">{profile.displayName}</p>
                <p className="text-gray-400">@{profile.username}</p>
              </div>
            </div>
            <button
              onClick={() => handleFollow(profile.userId)}
              className="border border-white text-black bg-white px-4 py-1 rounded-full text-sm font-bold hover:bg-black hover:text-white"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
