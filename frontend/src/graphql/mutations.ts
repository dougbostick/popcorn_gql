import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      _id
      title
      content
      imageUrl
      createdAt
      updatedAt
      author {
        _id
        username
        displayName
        avatar
      }
      likeCount
      commentCount
      isLikedByMe
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($_id: ID!, $input: UpdatePostInput!) {
    updatePost(_id: $_id, input: $input) {
      _id
      title
      content
      imageUrl
      updatedAt
      author {
        _id
        username
        displayName
        avatar
      }
      likeCount
      commentCount
      isLikedByMe
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($_id: ID!) {
    deletePost(_id: $_id)
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      _id
      userId
      postId
      createdAt
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId)
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($input: CreateCommentInput!) {
    addComment(input: $input) {
      _id
      content
      createdAt
      author {
        _id
        username
        displayName
        avatar
      }
      postId
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($_id: ID!) {
    deleteComment(_id: $_id)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
      username
      email
      displayName
      bio
      avatar
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      _id
      username
      email
      displayName
      bio
      avatar
      updatedAt
    }
  }
`;