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

  type Article {
    id: ID
    title: String
    article: String
    autor: String
    image: String 
  }

  input ArticleInput {
    title: String
    article: String
    autor: String
    image: String 
  }

  type Query {
    articles: [Article]
  }

  type Mutation {
    addArticle(input: ArticleInput): Article
    deleteArticle(ID: ID!): Boolean
  }
`;

// /*
const articleSchema = new mongoose.Schema({
  title: String,
  article: String,
  autor: String,
  image: String,
});

const Article = mongoose.model('Article', articleSchema);
// */

const resolvers = {
  Query: {
    articles: async () => {
      try {
        const res = await Article.find();

        console.log('articles:', res?.length);

        return res;
      } catch (error) {
        throw new Error('Failed to fetch books');
      }
    },
  },
  Mutation: {
    addArticle: async (_: any, { input }) => {
      const createArticle = new Article({
        title: input.title,
        article: input.article,
        autor: input.autor,
        image: input.image,
      });

      const res = await createArticle.save();

      console.log('addArticle:', res);

      return {
        title: res.title,
        article: res.article,
        autor: res.autor,
        image: res.image,
      };
    },

    deleteArticle: async (_: any, { ID }) => {
      const wasDeleted = (await Article.deleteOne({ _id: ID })).deletedCount;

      console.log('wasDeleted:', wasDeleted);

      return wasDeleted;
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
}).then(({ url }) => console.log(`🚀 Server listening at: ${String(url)}`));

if (process.env.NODE_ENV === 'production') {
  console.log('===> Running in production mode', process.env.NODE_ENV);
} else if (process.env.NODE_ENV === 'development') {
  console.log('===> Running in development mode', process.env.NODE_ENV);
} else if (process.env.NODE_ENV === 'test') {
  console.log('===> Running in test mode', process.env.NODE_ENV);
} else {
  console.log('===> Unknown environment', process.env.NODE_ENV);
}
