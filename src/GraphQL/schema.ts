import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    # User queries
    me: User
    user(_id: ID!): User
    users: [User!]!

    # Post queries
    post(_id: ID!): Post
    posts: [Post!]!
    userPosts(userId: ID!): [Post!]!
    
    # Feed query (for timeline)
    feed(limit: Int = 10, offset: Int = 0): [Post!]!
  }

  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
    
    # Post mutations
    createPost(input: CreatePostInput!): Post!
    updatePost(_id: ID!, input: UpdatePostInput!): Post!
    deletePost(_id: ID!): Boolean!
    
    # Interaction mutations
    likePost(postId: ID!): Like!
    unlikePost(postId: ID!): Boolean!
    addComment(input: CreateCommentInput!): Comment!
    deleteComment(_id: ID!): Boolean!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    displayName: String!
    bio: String
    avatar: String
    createdAt: String!
    updatedAt: String!
    
    # Relationships
    posts: [Post!]!
    comments: [Comment!]!
    likes: [Like!]!
    
    # Computed fields
    postCount: Int!
    followerCount: Int!
    followingCount: Int!
  }

  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String
    authorId: ID!
    createdAt: String!
    updatedAt: String!
    
    # Relationships
    author: User!
    comments: [Comment!]!
    likes: [Like!]!
    
    # Computed fields
    likeCount: Int!
    commentCount: Int!
    isLikedByMe: Boolean!
  }

  type Comment {
    _id: ID!
    content: String!
    authorId: ID!
    postId: ID!
    createdAt: String!
    updatedAt: String!
    
    # Relationships
    author: User!
    post: Post!
  }

  type Like {
    _id: ID!
    userId: ID!
    postId: ID!
    createdAt: String!
    
    # Relationships
    user: User!
    post: Post!
  }

  # Input types
  input CreateUserInput {
    username: String!
    email: String!
    displayName: String!
    bio: String
    avatar: String
  }

  input UpdateUserInput {
    displayName: String
    bio: String
    avatar: String
  }

  input CreatePostInput {
    title: String!
    content: String!
    imageUrl: String
  }

  input UpdatePostInput {
    title: String
    content: String
    imageUrl: String
  }

  input CreateCommentInput {
    postId: ID!
    content: String!
  }

  input UpdateUserInput {
    _id: ID!
    displayName: String
    bio: String
    avatar: String
  }
`;