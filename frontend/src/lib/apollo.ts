import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:4000/',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Post: {
        fields: {
          // Configure cache policies for better performance
          comments: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          likes: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
      User: {
        fields: {
          posts: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});