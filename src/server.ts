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
    id: String
    title: String
    article: String
  }

  input ArticleInput {
    id: String
    title: String
    article: String
  }

  type Query {
    articles: [Article]
  }

  type Mutation {
    addArticle(input: ArticleInput): Article
  }
`;

// /*
const ArticleSchema = new mongoose.Schema({
  id: String,
  title: String,
  article: String,
});

const Article = mongoose.model('Article', ArticleSchema);
// */

const resolvers = {
  Query: {
    articles: async () => {
      try {
        const res = await Article.find();

        console.log('getAll articles:', res?.length);

        return res;
      } catch (error) {
        throw new Error('Failed to fetch books');
      }
    },
  },

  Mutation: {
    async addArticle(_: any, { input }: any) {
      const createArticle = new Article({
        id: input.id,
        title: input.title,
        article: input.article,
      });

      const res = await createArticle.save();

      console.log('add article:', res);

      return {
        id: res.id,
        title: res.title,
        article: res.article,
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

startStandaloneServer(server, {
  listen: { port: Number(PORT) },
}).then(({ url }) => console.log(`server ★(◔.◔)★ ${String(url)}`));
