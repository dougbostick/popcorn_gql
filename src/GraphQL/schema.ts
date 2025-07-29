import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users: [User!]!
    
    # Post queries  
    post(id: ID!): Post
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
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
    
    # Interaction mutations
    likePost(postId: ID!): Like!
    unlikePost(postId: ID!): Boolean!
    addComment(input: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Boolean!
  }

  type User {
    id: ID!
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
    id: ID!
    title: String!
    content: String!
    imageUrl: String
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
    id: ID!
    content: String!
    createdAt: String!
    updatedAt: String!
    
    # Relationships
    author: User!
    post: Post!
  }

  type Like {
    id: ID!
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
`;