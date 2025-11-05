# Social Media App - Frontend Flow & Architecture Plan

## Overview
This document outlines the complete frontend flow for our social media application, starting with authentication and progressing through the full user experience.

## 1. Authentication & Login Flow

### 1.1 Login Screen (`/login`)
**Purpose**: Initial entry point for users to authenticate

**Features**:
- Email/username and password input fields
- "Sign In" button
- "Sign Up" link for new users
- Basic form validation
- Error handling for invalid credentials
- Loading states during authentication

**Technical Implementation**:
- React component with form state management
- GraphQL mutation for login authentication
- JWT token storage (localStorage/sessionStorage)
- Redirect to feed after successful login

### 1.2 Registration Screen (`/register`)
**Purpose**: Allow new users to create accounts

**Features**:
- Username, email, password, display name fields
- Optional profile picture upload
- Form validation (email format, password strength)
- "Create Account" button
- "Already have an account?" link to login

**Technical Implementation**:
- Form validation with real-time feedback
- GraphQL `createUser` mutation
- Automatic login after successful registration

### 1.3 Protected Routes
**Purpose**: Ensure only authenticated users access main app

**Implementation**:
- Route wrapper component to check authentication
- Redirect to `/login` if not authenticated
- JWT token validation on app load

## 2. Post-Login Application Flow

### 2.1 Main Feed (`/` or `/feed`)
**Purpose**: Personalized feed showing posts from friends only

**Features**:
- **Friend-only posts**: Filter posts to show only from followed users
- **Create post functionality**: Floating action button or top-of-feed composer
- **Post interactions**: Like, comment, share buttons
- **Infinite scroll**: Load more posts as user scrolls
- **Real-time updates**: New posts appear without refresh

**Data Requirements**:
- New GraphQL query: `getFriendsFeed(userId, limit, offset)`
- Friend/following relationship data
- User's own posts included in feed

### 2.2 Navigation Structure
**Primary Navigation**:
- **Home/Feed** (`/`) - Friends' posts
- **Explore** (`/explore`) - All public posts (discovery)
- **Profile** (`/profile`) - User's own profile
- **Messages** (`/messages`) - Direct messaging (future)
- **Notifications** (`/notifications`) - Likes, comments, follows

**Header Components**:
- Logo/app name
- Search bar (users/posts)
- Notification bell icon
- User avatar dropdown
- Logout option

## 3. Detailed Screen Specifications

### 3.1 Friends Feed (`/`)
```
┌─────────────────────────────────────┐
│ Header: Logo | Search | 🔔 | Avatar │
├─────────────────────────────────────┤
│ Create Post Box                     │
├─────────────────────────────────────┤
│ Friend's Post 1                     │
│ ├ Author info                       │
│ ├ Content + image                   │
│ ├ Like/Comment/Share                │
│ └ Comments (accordion)              │
├─────────────────────────────────────┤
│ Friend's Post 2                     │
│ ...                                 │
└─────────────────────────────────────┘
```

### 3.2 Profile Page (`/profile` or `/user/:id`)
**Own Profile Features**:
- Edit profile button
- Bio, follower/following counts
- Grid of user's posts
- Stories/highlights section

**Other User's Profile Features**:
- Follow/Unfollow button
- Send message button
- Public posts only
- Mutual friends count

### 3.3 Explore Page (`/explore`)
**Purpose**: Discover new content and users

**Features**:
- All public posts (like current implementation)
- Trending hashtags
- Suggested users to follow
- Search functionality

## 4. Routing Structure

```
/login              → Login component
/register           → Registration component
/                   → Protected: Friends feed
/explore            → Protected: All posts (current implementation)
/profile            → Protected: Own profile
/user/:id           → Protected: Other user profile
/post/:id           → Protected: Individual post view
/notifications      → Protected: Notifications list
/messages           → Protected: Direct messages (future)
/settings           → Protected: Account settings
```

## 5. State Management & Context

### 5.1 Authentication Context
```typescript
interface AuthContext {
  user: User | null;
  login: (credentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}
```

### 5.2 Apollo Client Setup
- JWT token in Authorization header
- Automatic token refresh handling
- Error handling for 401/403 responses

## 6. Backend Requirements (for Frontend)

### 6.1 New GraphQL Queries Needed
```graphql
# Friends-only feed
query GetFriendsFeed($userId: ID!, $limit: Int, $offset: Int) {
  friendsFeed(userId: $userId, limit: $limit, offset: $offset) {
    # Same post structure as current feed
  }
}

# User authentication
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user { _id username displayName avatar }
  }
}

# Follow/unfollow functionality
mutation FollowUser($userId: ID!) {
  followUser(userId: $userId)
}
```

### 6.2 Friend/Following System
- User relationship table/collection
- Following status in user queries
- Friend count fields

## 7. Implementation Phases

### Phase 1: Authentication (Current Priority)
1. Create login/register components
2. Set up React Router
3. Implement authentication context
4. Add JWT token handling to Apollo Client

### Phase 2: Protected Routing
1. Create ProtectedRoute wrapper
2. Set up main navigation
3. Implement logout functionality

### Phase 3: Friends Feed
1. Implement following/friend system in backend
2. Create friends-only feed query
3. Update feed component for personalized content

### Phase 4: Enhanced Features
1. User profiles with edit capabilities
2. Search functionality
3. Notifications system
4. Real-time updates

## 8. Technical Considerations

### 8.1 Authentication Security
- JWT tokens with expiration
- Secure token storage
- Auto-logout on token expiry
- CSRF protection

### 8.2 Performance
- Route-based code splitting
- Image optimization
- Pagination for feeds
- Caching strategies

### 8.3 User Experience
- Loading skeletons
- Optimistic updates
- Error boundaries
- Offline handling

## Resume Project Strategy: Auto-Friending System

### Current Database Analysis
- **No friend/following system exists** in the current database
- **5 seed users** already exist: johndoe, sarahsmith, mikejohnson, emilydavis, alexwilson
- **Mock follower/following counts** in resolvers (random numbers)

### Resume-Friendly Approach
Since this is a resume project, we want immediate content visibility:

1. **Auto-Friend System**: When any new user registers, automatically add the 5 existing seed users as friends
2. **Populated Feed**: Friends feed will always show content from these 8 users (3 seed + new user + 4 others)
3. **Demo-Ready**: Instant populated feed for recruiters/demos

### Implementation Plan

#### Phase 1: Add Friends System to Backend
1. Create Follow/Friendship model in MongoDB
2. Add friend relationship fields to User model
3. Update GraphQL schema with friend queries/mutations
4. Modify seed script to pre-create friendships

#### Phase 2: Auto-Friending Logic
1. Modify `createUser` mutation to auto-follow seed users
2. Create `getFriendsFeed` query that includes:
   - Posts from followed users
   - User's own posts
   - Always includes the 5 core seed users

#### Phase 3: Frontend with Authentication
1. Login/register screens
2. Protected routing
3. Friends feed (personalized)
4. Explore feed (all posts)

### Database Schema Updates Needed

```typescript
// New Follow model
interface IFollow {
  followerId: ObjectId;  // User who follows
  followingId: ObjectId; // User being followed
  createdAt: Date;
}

// Updated User model
interface IUser {
  // ... existing fields
  following: ObjectId[];     // Array of user IDs this user follows
  followers: ObjectId[];     // Array of user IDs following this user
}
```

## Next Steps
1. **Backend**: Add friends/following system to database
2. **Backend**: Update seed script with auto-friendships
3. **Backend**: Create getFriendsFeed query
4. **Frontend**: Create login/register screens
5. **Frontend**: Set up React Router for navigation
6. **Frontend**: Implement authentication context and JWT handling