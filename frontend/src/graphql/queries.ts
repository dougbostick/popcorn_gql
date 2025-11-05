import { gql } from '@apollo/client';

export const GET_FEED = gql`
  query GetFeed($limit: Int, $offset: Int) {
    feed(limit: $limit, offset: $offset) {
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

export const GET_POSTS = gql`
  query GetPosts {
    posts {
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
      comments {
        _id
        content
        createdAt
        author {
          _id
          username
          displayName
          avatar
        }
      }
      likeCount
      commentCount
      isLikedByMe
    }
  }
`;

export const GET_POST = gql`
  query GetPost($_id: ID!) {
    post(_id: $_id) {
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
        bio
      }
      comments {
        _id
        content
        createdAt
        author {
          _id
          username
          displayName
          avatar
        }
      }
      likes {
        _id
        user {
          _id
          username
          displayName
        }
        createdAt
      }
      likeCount
      commentCount
      isLikedByMe
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      _id
      username
      displayName
      bio
      avatar
      createdAt
      postCount
      followerCount
      followingCount
    }
  }
`;

export const GET_USER = gql`
  query GetUser($_id: ID!) {
    user(_id: $_id) {
      _id
      username
      displayName
      bio
      avatar
      createdAt
      postCount
      followerCount
      followingCount
      posts {
        _id
        title
        content
        imageUrl
        createdAt
        likeCount
        commentCount
        isLikedByMe
      }
    }
  }
`;

export const GET_USER_POSTS = gql`
  query GetUserPosts($userId: ID!) {
    userPosts(userId: $userId) {
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

export const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      displayName
      bio
      avatar
      createdAt
      postCount
      followerCount
      followingCount
    }
  }
`;

export const GET_FRIENDS_FEED = gql`
  query GetFriendsFeed($userId: ID!, $limit: Int = 10, $offset: Int = 0) {
    friendsFeed(userId: $userId, limit: $limit, offset: $offset) {
      _id
      title
      content
      imageUrl
      authorId
      createdAt
      updatedAt
      author {
        _id
        username
        displayName
        avatar
      }
      comments {
        _id
        content
        authorId
        createdAt
        author {
          _id
          username
          displayName
          avatar
        }
      }
      likes {
        _id
        userId
        createdAt
      }
      likeCount
      commentCount
      isLikedByMe
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        displayName
        bio
        avatar
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        _id
        username
        email
        displayName
        bio
        avatar
      }
    }
  }
`;