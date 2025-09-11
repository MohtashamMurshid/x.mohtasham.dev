import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  profiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    displayName: v.string(),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"]),
  tweets: defineTable({
    authorId: v.id("users"),
    content: v.string(),
    image: v.optional(v.string()),
    parentId: v.optional(v.id("tweets")), // for replies
  })
    .index("by_author", ["authorId"])
    .index("by_parent", ["parentId"]),
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"]),
  likes: defineTable({
    userId: v.id("users"),
    tweetId: v.id("tweets"),
  })
    .index("by_user", ["userId"])
    .index("by_tweet", ["tweetId"]),
  retweets: defineTable({
    userId: v.id("users"),
    tweetId: v.id("tweets"),
  })
    .index("by_user", ["userId"])
    .index("by_tweet", ["tweetId"]),
});
