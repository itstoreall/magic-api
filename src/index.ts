// /*
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4001;

console.log('PORT', process.env.PORT);

mongoose.connect(process.env.MONGO_DB);

const typeDefs = `#graphql

  type Book {
    id: String
    title: String
  }

  input BookInput {
    id: String
    title: String
  }

  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(input: BookInput): Book
  }
`;

// /*
const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
});

const Book = mongoose.model('Book', bookSchema);
// */

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
  Mutation: {
    async addBook(_, { input }) {
      const createBook = new Book({
        id: input.id,
        title: input.title,
      });

      const res = await createBook.save();

      console.log('res ----->', res); // res._dec

      return {
        id: res.id,
        title: res.title,
      };
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
