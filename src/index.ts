import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./GraphQL/resolvers";
import { typeDefs } from "./GraphQL/schema";

const PORT = Number(process.env.PORT) || 4000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: PORT },
    });
    
    console.log(`🚀 Server ready at ${url}`);
    console.log(`📊 GraphQL Studio: https://studio.apollographql.com/sandbox/explorer?endpoint=${encodeURIComponent(url)}`);
}

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});