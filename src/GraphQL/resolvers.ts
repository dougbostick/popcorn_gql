import { GraphQLResolveInfo } from 'graphql';
import { User as UserModel } from '../models/User';
import { Post as PostModel } from '../models/Post';
import { Comment as CommentModel } from '../models/Comment';
import { Like as LikeModel } from '../models/Like';
import { Follow as FollowModel } from '../models/Follow';
import { User, Post, Comment, Like, Context, CreateUserInput, UpdateUserInput, CreatePostInput, UpdatePostInput, CreateCommentInput } from '../types/graphql';
import { AuthContext, requireAuth } from '../middleware/auth';
import { createAutoFriendships } from '../utils/autoFriend';
import mongoose from 'mongoose';


export const resolvers = {
  Query: {
    // User queries
    me: async () => {
      // Return first user as mock current user
      return await UserModel.findOne().lean();
    },
    user: async (parent: unknown, args: { _id: string }) => {
      return await UserModel.findById(args._id).lean();
    },
    users: async () => {
      return await UserModel.find().lean();
    },

    // Post queries
    post: async (parent: unknown, args: { _id: string }) => {
      return await PostModel.findById(args._id).lean();
    },
    posts: async () => {
      return await PostModel.find().sort({ createdAt: -1 }).lean();
    },
    userPosts: async (parent: unknown, args: { userId: string }) => {
      return await PostModel.find({ authorId: args.userId }).sort({ createdAt: -1 }).lean();
    },

    // Feed query with pagination
    feed: async (parent: unknown, args: { limit?: number; offset?: number }) => {
      const { limit = 10, offset = 0 } = args;
      return await PostModel.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean();
    },

    // Friends feed - posts from followed users + user's own posts
    friendsFeed: async (parent: unknown, args: { userId: string; limit?: number; offset?: number }) => {
      const { userId, limit = 10, offset = 0 } = args;

      // Get user's following list
      const user = await UserModel.findById(userId).select('following').lean();
      if (!user) throw new Error('User not found');

      // Include user's own posts + posts from users they follow
      const authorIds = [userId, ...user.following];

      return await PostModel.find({ authorId: { $in: authorIds } })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean();
    }
  },

  Mutation: {
    // User mutations
    createUser: async (parent: unknown, args: { input: CreateUserInput }) => {
      const newUser = new UserModel({
        username: args.input.username,
        email: args.input.email,
        displayName: args.input.displayName,
        bio: args.input.bio || null,
        avatar: args.input.avatar || null
      });

      const savedUser = await newUser.save();

      // Create automatic friendships for resume project
      await createAutoFriendships((savedUser._id as any).toString());

      return savedUser;
    },
    
    updateUser: async (parent: unknown, args: { input: UpdateUserInput & { id: string } }) => {
      const updatedUser = await UserModel.findByIdAndUpdate(
        args.input.id,
        { ...args.input },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedUser) throw new Error('User not found');
      return updatedUser;
    },

    // Post mutations
    createPost: async (parent: unknown, args: { input: CreatePostInput }, context: AuthContext) => {
      const { userId } = requireAuth(context);

      const newPost = new PostModel({
        title: args.input.title,
        content: args.input.content,
        imageUrl: args.input.imageUrl || null,
        authorId: userId
      });
      return await newPost.save();
    },

    updatePost: async (parent: unknown, args: { id: string; input: UpdatePostInput }) => {
      const updatedPost = await PostModel.findByIdAndUpdate(
        args.id,
        { ...args.input },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedPost) throw new Error('Post not found');
      return updatedPost;
    },

    deletePost: async (parent: unknown, args: { id: string }) => {
      const post = await PostModel.findByIdAndDelete(args.id);
      if (!post) return false;

      // Also remove related comments and likes
      await CommentModel.deleteMany({ postId: args.id });
      await LikeModel.deleteMany({ postId: args.id });
      return true;
    },

    // Interaction mutations
    likePost: async (parent: unknown, args: { postId: string }, context: AuthContext) => {
      const { userId } = requireAuth(context);

      const existingLike = await LikeModel.findOne({
        postId: args.postId,
        userId: userId
      });

      if (existingLike) return existingLike;

      const newLike = new LikeModel({
        userId: userId,
        postId: args.postId
      });
      return await newLike.save();
    },

    unlikePost: async (parent: unknown, args: { postId: string }, context: AuthContext) => {
      const { userId } = requireAuth(context);

      const result = await LikeModel.deleteOne({
        postId: args.postId,
        userId: userId
      });

      return result.deletedCount > 0;
    },

    addComment: async (parent: unknown, args: { input: CreateCommentInput }, context: AuthContext) => {
      const { userId } = requireAuth(context);

      const newComment = new CommentModel({
        content: args.input.content,
        postId: args.input.postId,
        authorId: userId
      });
      return await newComment.save();
    },

    deleteComment: async (parent: unknown, args: { id: string }) => {
      const result = await CommentModel.findByIdAndDelete(args.id);
      return !!result;
    },

    // Follow mutations
    followUser: async (parent: unknown, args: { userId: string }, context: AuthContext) => {
      const { userId: currentUserId } = requireAuth(context);
      const { userId: targetUserId } = args;

      if (currentUserId === targetUserId) {
        throw new Error('Cannot follow yourself');
      }

      // Check if already following
      const existingFollow = await FollowModel.findOne({
        followerId: currentUserId,
        followingId: targetUserId
      });

      if (existingFollow) {
        throw new Error('Already following this user');
      }

      // Create follow relationship
      const follow = new FollowModel({
        followerId: currentUserId,
        followingId: targetUserId
      });

      // Update both users' arrays
      await Promise.all([
        UserModel.findByIdAndUpdate(currentUserId, {
          $addToSet: { following: targetUserId }
        }),
        UserModel.findByIdAndUpdate(targetUserId, {
          $addToSet: { followers: currentUserId }
        })
      ]);

      return await follow.save();
    },

    unfollowUser: async (parent: unknown, args: { userId: string }, context: AuthContext) => {
      const { userId: currentUserId } = requireAuth(context);
      const { userId: targetUserId } = args;

      // Remove follow relationship
      const result = await FollowModel.findOneAndDelete({
        followerId: currentUserId,
        followingId: targetUserId
      });

      if (!result) {
        throw new Error('Not following this user');
      }

      // Update both users' arrays
      await Promise.all([
        UserModel.findByIdAndUpdate(currentUserId, {
          $pull: { following: targetUserId }
        }),
        UserModel.findByIdAndUpdate(targetUserId, {
          $pull: { followers: currentUserId }
        })
      ]);

      return true;
    }
  },

  // Relationship resolvers - This is where the magic happens!
  User: {
    posts: async (parent: any) => {
      return await PostModel.find({ authorId: parent._id }).sort({ createdAt: -1 }).lean();
    },
    comments: async (parent: any) => {
      return await CommentModel.find({ authorId: parent._id }).sort({ createdAt: -1 }).lean();
    },
    likes: async (parent: any) => {
      return await LikeModel.find({ userId: parent._id }).sort({ createdAt: -1 }).lean();
    },

    // Computed fields
    postCount: async (parent: any) => {
      return await PostModel.countDocuments({ authorId: parent._id });
    },
    followerCount: async (parent: any) => {
      return await FollowModel.countDocuments({ followingId: parent._id });
    },
    followingCount: async (parent: any) => {
      return await FollowModel.countDocuments({ followerId: parent._id });
    }
  },

  Post: {
    author: async (parent: any) => {
      return await UserModel.findById(parent.authorId).lean();
    },
    comments: async (parent: any) => {
      return await CommentModel.find({ postId: parent._id }).sort({ createdAt: -1 }).lean();
    },
    likes: async (parent: any) => {
      return await LikeModel.find({ postId: parent._id }).sort({ createdAt: -1 }).lean();
    },

    // Computed fields
    likeCount: async (parent: any) => {
      return await LikeModel.countDocuments({ postId: parent._id });
    },
    commentCount: async (parent: any) => {
      return await CommentModel.countDocuments({ postId: parent._id });
    },
    isLikedByMe: async (parent: any, _args: any, context: AuthContext) => {
      // Only check if user is authenticated
      if (!context.user) return false;

      const like = await LikeModel.findOne({
        postId: parent._id,
        userId: context.user.userId
      });
      return !!like;
    }
  },

  Comment: {
    author: async (parent: any) => {
      return await UserModel.findById(parent.authorId).lean();
    },
    post: async (parent: any) => {
      return await PostModel.findById(parent.postId).lean();
    }
  },

  Like: {
    user: async (parent: any) => {
      return await UserModel.findById(parent.userId).lean();
    },
    post: async (parent: any) => {
      return await PostModel.findById(parent.postId).lean();
    }
  }
};