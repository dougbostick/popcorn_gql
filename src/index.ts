import { ApolloServer } from "apollo-server";
import { resolvers } from "./GraphQL/resolvers";
import { typeDefs } from "./GraphQL/schema";

const PORT = process.env.PORT || 4000;


const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
})