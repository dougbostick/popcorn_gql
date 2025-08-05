import { GraphQLResolveInfo } from 'graphql';
import * as data from '../data/data.json';
import { User, Post, Comment, Like, Context, CreateUserInput, UpdateUserInput, CreatePostInput, UpdatePostInput, CreateCommentInput } from '../types/graphql';

const { users, posts, comments, likes } = data;

export const resolvers = {
  Query: {
    // User queries
    me: (parent: unknown, args: {}, context: Context, info: GraphQLResolveInfo): User => users[0], // Mock current user as first user
    user: (parent: unknown, args: { id: string }, context: Context, info: GraphQLResolveInfo): User | undefined => users.find(user => user.id === args.id),
    users: (parent: unknown, args: {}, context: Context, info: GraphQLResolveInfo): User[] => users,
    
    // Post queries
    post: (parent: unknown, args: { id: string }, context: Context, info: GraphQLResolveInfo): Post | undefined => posts.find(post => post.id === args.id),
    posts: (parent: unknown, args: {}, context: Context, info: GraphQLResolveInfo): Post[] => posts,
    userPosts: (parent: unknown, args: { userId: string }, context: Context, info: GraphQLResolveInfo): Post[] => posts.filter(post => post.authorId === args.userId),
    
    // Feed query with pagination
    feed: (parent: unknown, args: { limit?: number; offset?: number }, context: Context, info: GraphQLResolveInfo): Post[] => {
      const { limit = 10, offset = 0 } = args;
      return posts
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(offset, offset + limit);
    }
  },

  Mutation: {
    // User mutations
    createUser: (parent: unknown, args: { input: CreateUserInput }, context: Context, info: GraphQLResolveInfo): User => {
      const newUser: User = {
        id: String(users.length + 1),
        username: args.input.username,
        email: args.input.email,
        displayName: args.input.displayName,
        bio: args.input.bio || null,
        avatar: args.input.avatar || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      (users as User[]).push(newUser);
      return newUser;
    },
    
    updateUser: (parent: unknown, args: { input: UpdateUserInput & { id: string } }, context: Context, info: GraphQLResolveInfo) => {
      const userIndex = users.findIndex(user => user.id === args.input.id);
      if (userIndex === -1) throw new Error('User not found');
      
      users[userIndex] = {
        ...users[userIndex],
        ...args.input,
        updatedAt: new Date().toISOString()
      };
      return users[userIndex];
    },

    // Post mutations
    createPost: (parent: unknown, args: { input: CreatePostInput }, context: Context, info: GraphQLResolveInfo): Post => {
      const newPost: Post = {
        id: String(posts.length + 1),
        title: args.input.title,
        content: args.input.content,
        imageUrl: args.input.imageUrl || null,
        authorId: "1", // Mock current user
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      (posts as Post[]).push(newPost);
      return newPost;
    },

    updatePost: (parent: unknown, args: { id: string; input: UpdatePostInput }, context: Context, info: GraphQLResolveInfo) => {
      const postIndex = posts.findIndex(post => post.id === args.id);
      if (postIndex === -1) throw new Error('Post not found');
      
      posts[postIndex] = {
        ...posts[postIndex],
        ...args.input,
        updatedAt: new Date().toISOString()
      };
      return posts[postIndex];
    },

    deletePost: (parent: unknown, args: { id: string }, context: Context, info: GraphQLResolveInfo) => {
      const postIndex = posts.findIndex(post => post.id === args.id);
      if (postIndex === -1) return false;
      
      posts.splice(postIndex, 1);
      // Also remove related comments and likes
      comments.filter(comment => comment.postId !== args.id);
      likes.filter(like => like.postId !== args.id);
      return true;
    },

    // Interaction mutations
    likePost: (parent: unknown, args: { postId: string }, context: Context, info: GraphQLResolveInfo) => {
      const existingLike = likes.find(like => 
        like.postId === args.postId && like.userId === "1" // Mock current user
      );
      
      if (existingLike) return existingLike;
      
      const newLike = {
        id: String(likes.length + 1),
        userId: "1", // Mock current user
        postId: args.postId,
        createdAt: new Date().toISOString()
      };
      likes.push(newLike);
      return newLike;
    },

    unlikePost: (parent: unknown, args: { postId: string }, context: Context, info: GraphQLResolveInfo) => {
      const likeIndex = likes.findIndex(like => 
        like.postId === args.postId && like.userId === "1" // Mock current user
      );
      
      if (likeIndex === -1) return false;
      likes.splice(likeIndex, 1);
      return true;
    },

    addComment: (parent: unknown, args: { input: CreateCommentInput }, context: Context, info: GraphQLResolveInfo) => {
      const newComment = {
        id: String(comments.length + 1),
        ...args.input,
        authorId: "1", // Mock current user
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      comments.push(newComment);
      return newComment;
    },

    deleteComment: (parent: unknown, args: { id: string }, context: Context, info: GraphQLResolveInfo) => {
      const commentIndex = comments.findIndex(comment => comment.id === args.id);
      if (commentIndex === -1) return false;
      
      comments.splice(commentIndex, 1);
      return true;
    }
  },

  // Relationship resolvers - This is where the magic happens!
  User: {
    posts: (parent: User, args: {}, context: Context, info: GraphQLResolveInfo): Post[] => posts.filter(post => post.authorId === parent.id),
    comments: (parent: User, args: {}, context: Context, info: GraphQLResolveInfo): Comment[] => comments.filter(comment => comment.authorId === parent.id),
    likes: (parent: User, args: {}, context: Context, info: GraphQLResolveInfo): Like[] => likes.filter(like => like.userId === parent.id),
    
    // Computed fields
    postCount: (parent: User, args: {}, context: Context, info: GraphQLResolveInfo): number => posts.filter(post => post.authorId === parent.id).length,
    followerCount: (parent: User, args: {}, context: Context, info: GraphQLResolveInfo): number => Math.floor(Math.random() * 1000), // Mock data
    followingCount: (parent: User, args: {}, context: Context, info: GraphQLResolveInfo): number => Math.floor(Math.random() * 500)   // Mock data
  },

  Post: {
    author: (parent: Post, args: {}, context: Context, info: GraphQLResolveInfo): User | undefined => users.find(user => user.id === parent.authorId),
    comments: (parent: Post, args: {}, context: Context, info: GraphQLResolveInfo): Comment[] => comments.filter(comment => comment.postId === parent.id),
    likes: (parent: Post, args: {}, context: Context, info: GraphQLResolveInfo): Like[] => likes.filter(like => like.postId === parent.id),
    
    // Computed fields
    likeCount: (parent: Post, args: {}, context: Context, info: GraphQLResolveInfo): number => likes.filter(like => like.postId === parent.id).length,
    commentCount: (parent: Post, args: {}, context: Context, info: GraphQLResolveInfo): number => comments.filter(comment => comment.postId === parent.id).length,
    isLikedByMe: (parent: Post, args: {}, context: Context, info: GraphQLResolveInfo): boolean => likes.some(like => 
      like.postId === parent.id && like.userId === "1" // Mock current user
    )
  },

  Comment: {
    author: (parent: Comment, args: {}, context: Context, info: GraphQLResolveInfo): User | undefined => users.find(user => user.id === parent.authorId),
    post: (parent: Comment, args: {}, context: Context, info: GraphQLResolveInfo): Post | undefined => posts.find(post => post.id === parent.postId)
  },

  Like: {
    user: (parent: Like, args: {}, context: Context, info: GraphQLResolveInfo): User | undefined => users.find(user => user.id === parent.userId),
    post: (parent: Like, args: {}, context: Context, info: GraphQLResolveInfo): Post | undefined => posts.find(post => post.id === parent.postId)
  }
};