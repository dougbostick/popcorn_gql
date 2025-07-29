export const resolvers = {
    query: {
        // get all posts for a user
        getAllPosts: (parent, args, context, info) => {
            return context.dataSources.postsAPI.getAllPosts(args.id);
        },
        getPost: (parent, args, context, info) => {
            return context.dataSources.postsAPI.getPost(args.id);
        }
    }
};