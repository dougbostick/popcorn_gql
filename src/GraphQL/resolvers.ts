import { GraphQLResolveInfo } from 'graphql';
import { User as UserModel } from '../models/User';
import { Post as PostModel } from '../models/Post';
import { Comment as CommentModel } from '../models/Comment';
import { Like as LikeModel } from '../models/Like';
import { User, Post, Comment, Like, Context, CreateUserInput, UpdateUserInput, CreatePostInput, UpdatePostInput, CreateCommentInput } from '../types/graphql';
import mongoose from 'mongoose';

// recently added this trandformDoc function to help match mongoDB responses with gql schema expectiations
// might want to explore chjanging GQL schema instead
// Helper function to transform MongoDB documents to match GraphQL schema
const transformDoc = (doc: any) => {
  if (!doc) return null;
  return {
    ...doc,
    id: doc._id.toString(),
    authorId: doc.authorId?.toString(),
    postId: doc.postId?.toString(),
    userId: doc.userId?.toString()
  };
};

export const resolvers = {
  Query: {
    // User queries
    me: async () => {
      // Return first user as mock current user
      const user = await UserModel.findOne().lean();
      return transformDoc(user);
    },
    user: async (parent: unknown, args: { id: string }) => {
      const user = await UserModel.findById(args.id).lean();
      return transformDoc(user);
    },
    users: async () => {
      const users = await UserModel.find().lean();
      return users.map(transformDoc);
    },

    // Post queries
    post: async (parent: unknown, args: { id: string }) => {
      const post = await PostModel.findById(args.id).lean();
      return transformDoc(post);
    },
    posts: async () => {
      const posts = await PostModel.find().sort({ createdAt: -1 }).lean();
      return posts.map(transformDoc);
    },
    userPosts: async (parent: unknown, args: { userId: string }) => {
      const posts = await PostModel.find({ authorId: args.userId }).sort({ createdAt: -1 }).lean();
      return posts.map(transformDoc);
    },

    // Feed query with pagination
    feed: async (parent: unknown, args: { limit?: number; offset?: number }) => {
      const { limit = 10, offset = 0 } = args;
      const posts = await PostModel.find()
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean();
      return posts.map(transformDoc);
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
      return await newUser.save();
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
    createPost: async (parent: unknown, args: { input: CreatePostInput }) => {
      // Get first user as mock current user
      const currentUser = await UserModel.findOne();
      if (!currentUser) throw new Error('No users found');

      const newPost = new PostModel({
        title: args.input.title,
        content: args.input.content,
        imageUrl: args.input.imageUrl || null,
        authorId: currentUser._id
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
    likePost: async (parent: unknown, args: { postId: string }) => {
      // Get first user as mock current user
      const currentUser = await UserModel.findOne();
      if (!currentUser) throw new Error('No users found');

      const existingLike = await LikeModel.findOne({
        postId: args.postId,
        userId: currentUser._id
      });

      if (existingLike) return existingLike;

      const newLike = new LikeModel({
        userId: currentUser._id,
        postId: args.postId
      });
      return await newLike.save();
    },

    unlikePost: async (parent: unknown, args: { postId: string }) => {
      // Get first user as mock current user
      const currentUser = await UserModel.findOne();
      if (!currentUser) throw new Error('No users found');

      const result = await LikeModel.deleteOne({
        postId: args.postId,
        userId: currentUser._id
      });

      return result.deletedCount > 0;
    },

    addComment: async (parent: unknown, args: { input: CreateCommentInput }) => {
      // Get first user as mock current user
      const currentUser = await UserModel.findOne();
      if (!currentUser) throw new Error('No users found');

      const newComment = new CommentModel({
        content: args.input.content,
        postId: args.input.postId,
        authorId: currentUser._id
      });
      return await newComment.save();
    },

    deleteComment: async (parent: unknown, args: { id: string }) => {
      const result = await CommentModel.findByIdAndDelete(args.id);
      return !!result;
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
    followerCount: () => Math.floor(Math.random() * 1000), // Mock data
    followingCount: () => Math.floor(Math.random() * 500)   // Mock data
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
    isLikedByMe: async (parent: any) => {
      // Get first user as mock current user
      const currentUser = await UserModel.findOne();
      if (!currentUser) return false;

      const like = await LikeModel.findOne({
        postId: parent._id,
        userId: currentUser._id
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