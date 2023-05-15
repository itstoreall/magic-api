import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4001;

console.log('PORT', process.env.PORT);

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

async function startApolloServer() {
  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: PORT }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

if (process.env.NODE_ENV === 'production') {
  console.log('===> Running in production mode', process.env.NODE_ENV);
} else if (process.env.NODE_ENV === 'development') {
  console.log('===> Running in development mode', process.env.NODE_ENV);
} else if (process.env.NODE_ENV === 'test') {
  console.log('===> Running in test mode', process.env.NODE_ENV);
} else {
  console.log('===> Unknown environment', process.env.NODE_ENV);
}

startApolloServer();
