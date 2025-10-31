# Frontend Development Plan - Social Media App

## Project Overview
Building a Facebook-inspired social media frontend for the existing GraphQL server with React, TypeScript, and modern tooling.

## Technology Stack Chosen
- **React 18** with **TypeScript** - Modern, type-safe development
- **Vite** - Fast development server and build tool
- **Apollo Client** - GraphQL client with caching and state management
- **Tailwind CSS** - Utility-first CSS for rapid UI development
- **React Router** - Client-side routing
- **Headless UI** - Accessible component primitives
- **React Hook Form** - Performant form handling

## Steps Completed ✅

### 1. Project Setup
- Created React TypeScript project with Vite: `npm create vite@latest frontend -- --template react-ts`
- Installed core dependencies:
  ```bash
  npm install @apollo/client graphql tailwindcss @headlessui/react @heroicons/react react-router-dom react-hook-form
  npm install -D tailwindcss postcss autoprefixer
  ```

### 2. Tailwind CSS Configuration
- Created `tailwind.config.js` with Facebook-inspired color scheme
- Created `postcss.config.js` for PostCSS configuration
- Updated `src/index.css` with Tailwind directives and custom component classes:
  - `.btn-primary` - Primary button styling
  - `.btn-secondary` - Secondary button styling
  - `.card` - Card component base
  - `.input-field` - Form input styling

### 3. Project Structure Setup
- Frontend created in `/frontend` directory alongside backend
- Basic Vite React TypeScript template structure in place

## Next Steps - Immediate Priorities 🚀

### 4. Apollo Client Configuration
- [ ] Create `src/lib/apollo.ts` with Apollo Client setup
- [ ] Configure connection to GraphQL server at `http://localhost:4000/`
- [ ] Set up InMemoryCache with appropriate type policies
- [ ] Wrap React app with ApolloProvider

### 5. GraphQL Integration
- [ ] Create GraphQL queries and mutations in `src/graphql/`:
  - `queries.ts` - GET_POSTS, GET_USERS, GET_FEED, GET_USER_POSTS
  - `mutations.ts` - CREATE_POST, LIKE_POST, ADD_COMMENT, CREATE_USER
- [ ] Generate TypeScript types from GraphQL schema (using GraphQL Code Generator)

### 6. Core Components Development
- [ ] **Header Component**: Navigation bar with logo, search, user menu
- [ ] **Post Component**: Individual post display with author, content, actions
- [ ] **Feed Component**: List of posts with infinite scroll
- [ ] **CreatePost Component**: Form for creating new posts
- [ ] **Comment Component**: Individual comment display
- [ ] **User Card Component**: User profile display

### 7. Page Components
- [ ] **Home Page**: Main feed with create post and post list
- [ ] **Profile Page**: User profile with their posts
- [ ] **Post Detail Page**: Individual post with comments

### 8. Authentication & User Context
- [ ] Create user context for managing current user state
- [ ] Implement mock authentication (since backend uses first user)
- [ ] User state management throughout app

### 9. Styling & Layout
- [ ] Responsive layout implementation
- [ ] Facebook-inspired design system
- [ ] Mobile-first responsive design
- [ ] Loading states and skeletons
- [ ] Error state handling

### 10. Features Implementation
- [ ] **Post Creation**: Text and image upload
- [ ] **Like/Unlike**: Toggle post likes with optimistic updates
- [ ] **Comments**: Add/view comments on posts
- [ ] **User Interactions**: View user profiles and posts
- [ ] **Feed Pagination**: Infinite scroll or pagination

## Future Enhancements 🔮

### Phase 2 Features
- [ ] Real-time updates with GraphQL subscriptions
- [ ] Image upload and storage integration
- [ ] Advanced post types (photos, links, etc.)
- [ ] Notifications system
- [ ] Friend/Follow system
- [ ] Search functionality
- [ ] Post editing and deletion
- [ ] Comment replies and threading

### Technical Improvements
- [ ] Performance optimization with React.memo and useMemo
- [ ] Error boundary implementation
- [ ] Progressive Web App (PWA) features
- [ ] Offline support with Apollo cache
- [ ] Unit and integration testing with Vitest/Testing Library
- [ ] Storybook for component documentation
- [ ] CI/CD pipeline setup

## File Structure Plan
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Post.tsx
│   │   ├── Feed.tsx
│   │   ├── CreatePost.tsx
│   │   ├── Comment.tsx
│   │   └── UserCard.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Profile.tsx
│   │   └── PostDetail.tsx
│   ├── graphql/
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── types.ts         # Generated types
│   ├── lib/
│   │   ├── apollo.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useFeed.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   └── types/
│       └── index.ts
├── public/
└── package.json
```

## Design Goals
- **Facebook-inspired**: Clean, familiar social media interface
- **Mobile-first**: Responsive design that works on all devices
- **Performance**: Fast loading with efficient caching
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Type Safety**: Full TypeScript coverage
- **User Experience**: Smooth interactions with optimistic updates

## Success Metrics for First Iteration
- [ ] Users can view the feed of posts
- [ ] Users can create new posts
- [ ] Users can like/unlike posts
- [ ] Users can add comments to posts
- [ ] Users can view user profiles
- [ ] Responsive design works on mobile and desktop
- [ ] All interactions work smoothly with the GraphQL backend