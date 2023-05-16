// /*
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose, { ConnectOptions } from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4001;

console.log('PORT', process.env.PORT);

const MONGODB = process.env.MONGO_DB;

console.log('MONGODB', MONGODB);

mongoose.connect(MONGODB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const typeDefs = `#graphql

  type Book {
    title: String
  }

  type Query {
    books: [Book]
  }
`;

// const books = [
//   {
//     title: 'The Awakening',
//     author: 'Kate Chopin',
//     time: 2456778,
//   },
//   {
//     title: 'City of Glass',
//     author: 'Paul Auster',
//     time: 5567,
//   },
// ];

const bookSchema = new mongoose.Schema({
  title: String,
  // author: String,
  // time: String,
});

const Book = mongoose.model('Book', bookSchema);

// const resolvers = {
//   Query: {
//     books: () => books,
//     times: () => books,
//   },
// };

const resolvers = {
  Query: {
    books: async () => {
      try {
        console.log(111);

        const res = await Book.find();
        console.log(222, res);
        return res;
      } catch (error) {
        throw new Error('Failed to fetch books');
      }
    },
  },
};

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: Number(PORT) },
});

if (process.env.NODE_ENV === 'production') {
  console.log('===> Running in production mode', process.env.NODE_ENV);
} else if (process.env.NODE_ENV === 'development') {
  console.log('===> Running in development mode', process.env.NODE_ENV);
} else if (process.env.NODE_ENV === 'test') {
  console.log('===> Running in test mode', process.env.NODE_ENV);
} else {
  console.log('===> Unknown environment', process.env.NODE_ENV);
}

console.log(`🚀 Server listening at: ${url}`);
// */

/*
import { ApolloServer } from 'apollo-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
// import typeDefs from './graphql/typeDefs';
// import resolvers from './graphql/resolvers';

const MONGODB =
  'mongodb+srv://magic_db_user:magic_db_passm@itstoreall.daksk.mongodb.net';

const PORT = process.env.PORT || 4001;

console.log('PORT', process.env.PORT);

const typeDefs = `#graphql

  type Book {
    title: String
    author: String
    time: String,
  }

  type Query {
    books: [Book]
    times: [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    time: 2456778,
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    time: 5567,
  },
];

const resolvers = {
  Query: {
    books: () => books,
    times: () => books,
  },
};

// const server = new ApolloServer({
//   typeDefs,
//   // resolvers,
//   // context: { models },
// });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(MONGODB)
  .then(() => {
    console.log('!!!!!!!!!!!');
    return server.listen({ port: PORT });
  })
  .then(res => {
    console.log('!!!222!!!', res.url);
  });
// */
