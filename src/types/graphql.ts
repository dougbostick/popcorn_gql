// Types directly inferred from our GraphQL schema
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string | null;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;  // Allow null from JSON data
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

// Input types from GraphQL schema
export interface CreateUserInput {
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatar?: string;
}

export interface UpdateUserInput {
  displayName?: string;
  bio?: string;
  avatar?: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  imageUrl?: string;
}

export interface CreateCommentInput {
  postId: string;
  content: string;
}

// GraphQL Context interface
export interface Context {
  // Will expand this when we add authentication, dataloaders, etc.
}