import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4001;

mongoose.connect(process.env.MONGO_DB);

const typeDefs = `#graphql

  type Article {
    id: ID
    title: String
    article: String
  }

  input ArticleInput {
    title: String
    article: String
  }

  type Query {
    articles: [Article]
  }
`;

// /*
const articlesSchema = new mongoose.Schema({
  title: String,
  article: String,
});

const Articles = mongoose.model('Articles', articlesSchema);
// */

const resolvers = {
  Query: {
    articles: async () => {
      try {
        const res = await Articles.find();

        console.log('getAll articles:', res?.length);

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

startStandaloneServer(server, {
  listen: { port: Number(PORT) },
}).then(({ url }) => console.log(`server ★(◔.◔)★ ${String(url)}`));
