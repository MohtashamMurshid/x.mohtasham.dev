import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Profile functions
export const createProfile = mutation({
  args: {
    username: v.string(),
    displayName: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) throw new Error("Profile already exists");

    return await ctx.db.insert("profiles", {
      userId,
      username: args.username,
      displayName: args.displayName,
      bio: args.bio,
    });
  },
});

export const getCurrentProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

export const getProfile = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const userId = args.userId || (await getAuthUserId(ctx));
    if (!userId) return null;

    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

export const getAllProfiles = query({
  handler: async (ctx) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) return [];

    return await ctx.db
      .query("profiles")
      .filter((q) => q.neq(q.field("userId"), currentUserId))
      .collect();
  },
});

// Tweet functions
export const createTweet = mutation({
  args: {
    content: v.string(),
    image: v.optional(v.string()),
    parentId: v.optional(v.id("tweets")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("tweets", {
      authorId: userId,
      content: args.content,
      image: args.image,
      parentId: args.parentId,
    });
  },
});

export const getTweets = query({
  args: { authorId: v.optional(v.id("users")), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const tweets = await ctx.db
      .query("tweets")
      .withIndex("by_author", (q) =>
        args.authorId ? q.eq("authorId", args.authorId) : q,
      )
      .order("desc")
      .take(args.limit || 20);

    return Promise.all(
      tweets.map(async (tweet) => {
        const author = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", tweet.authorId))
          .first();

        const [likesCount, retweetsCount, repliesCount] = await Promise.all([
          ctx.db
            .query("likes")
            .withIndex("by_tweet", (q) => q.eq("tweetId", tweet._id))
            .collect()
            .then((rows) => rows.length),
          ctx.db
            .query("retweets")
            .withIndex("by_tweet", (q) => q.eq("tweetId", tweet._id))
            .collect()
            .then((rows) => rows.length),
          ctx.db
            .query("tweets")
            .withIndex("by_parent", (q) => q.eq("parentId", tweet._id))
            .collect()
            .then((rows) => rows.length),
        ]);

        const currentUserId = await getAuthUserId(ctx);
        let likedByCurrentUser = false;
        let retweetedByCurrentUser = false;
        if (currentUserId) {
          const [likeDoc, retweetDoc] = await Promise.all([
            ctx.db
              .query("likes")
              .withIndex("by_user", (q) => q.eq("userId", currentUserId))
              .filter((q) => q.eq(q.field("tweetId"), tweet._id))
              .first(),
            ctx.db
              .query("retweets")
              .withIndex("by_user", (q) => q.eq("userId", currentUserId))
              .filter((q) => q.eq(q.field("tweetId"), tweet._id))
              .first(),
          ]);
          likedByCurrentUser = !!likeDoc;
          retweetedByCurrentUser = !!retweetDoc;
        }

        return {
          ...tweet,
          author,
          stats: {
            likes: likesCount,
            retweets: retweetsCount,
            replies: repliesCount,
          },
          viewer: {
            liked: likedByCurrentUser,
            retweeted: retweetedByCurrentUser,
          },
        } as const;
      }),
    );
  },
});

export const getTimeline = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", userId))
      .collect();

    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId); // Include own tweets

    // Fetch per-followed user tweets and merge (avoids filter scans)
    const perAuthorTweets = await Promise.all(
      followingIds.map((authorId) =>
        ctx.db
          .query("tweets")
          .withIndex("by_author", (q) => q.eq("authorId", authorId))
          .order("desc")
          .take(args.limit || 20),
      ),
    );

    const tweets = perAuthorTweets.flat();
    // Sort globally by creation time desc and take top N
    tweets.sort((a, b) => b._creationTime - a._creationTime);
    const top = tweets.slice(0, args.limit || 20);

    return Promise.all(
      top.map(async (tweet) => {
        const author = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", tweet.authorId))
          .first();

        const [likesCount, retweetsCount, repliesCount] = await Promise.all([
          ctx.db
            .query("likes")
            .withIndex("by_tweet", (q) => q.eq("tweetId", tweet._id))
            .collect()
            .then((rows) => rows.length),
          ctx.db
            .query("retweets")
            .withIndex("by_tweet", (q) => q.eq("tweetId", tweet._id))
            .collect()
            .then((rows) => rows.length),
          ctx.db
            .query("tweets")
            .withIndex("by_parent", (q) => q.eq("parentId", tweet._id))
            .collect()
            .then((rows) => rows.length),
        ]);

        let likedByCurrentUser = false;
        let retweetedByCurrentUser = false;
        const [likeDoc, retweetDoc] = await Promise.all([
          ctx.db
            .query("likes")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("tweetId"), tweet._id))
            .first(),
          ctx.db
            .query("retweets")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("tweetId"), tweet._id))
            .first(),
        ]);
        likedByCurrentUser = !!likeDoc;
        retweetedByCurrentUser = !!retweetDoc;

        return {
          ...tweet,
          author,
          stats: {
            likes: likesCount,
            retweets: retweetsCount,
            replies: repliesCount,
          },
          viewer: {
            liked: likedByCurrentUser,
            retweeted: retweetedByCurrentUser,
          },
        } as const;
      }),
    );
  },
});

// Follow functions
export const followUser = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", userId))
      .filter((q) => q.eq(q.field("followingId"), args.followingId))
      .first();

    if (existing) throw new Error("Already following");

    return await ctx.db.insert("follows", {
      followerId: userId,
      followingId: args.followingId,
    });
  },
});

export const unfollowUser = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const follow = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", userId))
      .filter((q) => q.eq(q.field("followingId"), args.followingId))
      .first();

    if (!follow) throw new Error("Not following");

    await ctx.db.delete(follow._id);
  },
});

// Like functions
export const likeTweet = mutation({
  args: { tweetId: v.id("tweets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("tweetId"), args.tweetId))
      .first();

    if (existing) throw new Error("Already liked");

    return await ctx.db.insert("likes", {
      userId,
      tweetId: args.tweetId,
    });
  },
});

export const unlikeTweet = mutation({
  args: { tweetId: v.id("tweets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const like = await ctx.db
      .query("likes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("tweetId"), args.tweetId))
      .first();

    if (!like) throw new Error("Not liked");

    await ctx.db.delete(like._id);
  },
});

// Retweet functions
export const retweetTweet = mutation({
  args: { tweetId: v.id("tweets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("retweets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("tweetId"), args.tweetId))
      .first();

    if (existing) throw new Error("Already retweeted");

    return await ctx.db.insert("retweets", {
      userId,
      tweetId: args.tweetId,
    });
  },
});

export const unretweetTweet = mutation({
  args: { tweetId: v.id("tweets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const retweet = await ctx.db
      .query("retweets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("tweetId"), args.tweetId))
      .first();

    if (!retweet) throw new Error("Not retweeted");

    await ctx.db.delete(retweet._id);
  },
});

// Replies
export const getReplies = query({
  args: { tweetId: v.id("tweets"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const replies = await ctx.db
      .query("tweets")
      .withIndex("by_parent", (q) => q.eq("parentId", args.tweetId))
      .order("asc")
      .take(args.limit || 20);

    return Promise.all(
      replies.map(async (tweet) => {
        const author = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", tweet.authorId))
          .first();
        return { ...tweet, author };
      }),
    );
  },
});

export const getTweetDetails = query({
  args: { tweetId: v.id("tweets") },
  handler: async (ctx, args) => {
    const tweet = await ctx.db.get(args.tweetId);
    if (!tweet) return null;

    const author = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", tweet.authorId))
      .first();

    const [likes, retweets, replies] = await Promise.all([
      ctx.db
        .query("likes")
        .withIndex("by_tweet", (q) => q.eq("tweetId", tweet._id))
        .collect()
        .then((rows) => rows.length),
      ctx.db
        .query("retweets")
        .withIndex("by_tweet", (q) => q.eq("tweetId", tweet._id))
        .collect()
        .then((rows) => rows.length),
      ctx.db
        .query("tweets")
        .withIndex("by_parent", (q) => q.eq("parentId", tweet._id))
        .collect()
        .then((rows) => rows.length),
    ]);

    const currentUserId = await getAuthUserId(ctx);
    let liked = false;
    let retweeted = false;
    if (currentUserId) {
      const [likeDoc, retweetDoc] = await Promise.all([
        ctx.db
          .query("likes")
          .withIndex("by_user", (q) => q.eq("userId", currentUserId))
          .filter((q) => q.eq(q.field("tweetId"), tweet._id))
          .first(),
        ctx.db
          .query("retweets")
          .withIndex("by_user", (q) => q.eq("userId", currentUserId))
          .filter((q) => q.eq(q.field("tweetId"), tweet._id))
          .first(),
      ]);
      liked = !!likeDoc;
      retweeted = !!retweetDoc;
    }

    return {
      ...tweet,
      author,
      stats: { likes, retweets, replies },
      viewer: { liked, retweeted },
    } as const;
  },
});
