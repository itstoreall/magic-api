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
    id: String
    title: String
    article: String
    autor: String
    image: String 
  }

  input ArticleInput {
    id: String
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
  }
`;

// /*
const articleSchema = new mongoose.Schema({
  id: String,
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
        console.log(111);

        const res = await Article.find();
        console.log(222, res);
        return res;
      } catch (error) {
        throw new Error('Failed to fetch books');
      }
    },
  },
  Mutation: {
    async addArticle(_: any, { input }) {
      const createArticle = new Article({
        id: input.id,
        title: input.title,
        article: input.article,
        autor: input.autor,
        image: input.image,
      });

      const res = await createArticle.save();

      console.log('res ----->', res); // res._dec

      return {
        id: res.id,
        title: res.title,
        article: res.article,
        autor: res.autor,
        image: res.image,
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
