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
    author: String
    image: String 
  }

  input ArticleInput {
    title: String
    article: String
    author: String
    image: String 
  }

  type Query {
    articles: [Article]
    getArticleById(ID: ID!): Article
    getArticleByTitle(title: String!): Article
  }

  type Mutation {
    addArticle(input: ArticleInput): Article
    deleteArticle(ID: ID!): Boolean
    editArticle(ID: ID!, articleInput: ArticleInput): Boolean
  }
`;

const Article = mongoose.model(
  'Article',
  new mongoose.Schema({
    title: String,
    article: String,
    author: String,
    image: String,
  })
);

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

    getArticleById: async (_: any, { ID }: any) => {
      const res = await Article.find({ _id: ID });

      console.log('getArticleById:', res);

      return {
        id: res[0]._id,
        title: res[0].title,
        article: res[0].article,
        author: res[0].author,
        image: res[0].image,
      };
    },

    async getArticleByTitle(_: any, { title }: any) {
      const res = await Article.find({ title });

      console.log('getArticleByTitle:', res);

      return {
        id: res[0]._id,
        title: res[0].title,
        article: res[0].article,
        author: res[0].author,
        image: res[0].image,
      };
    },
  },

  Mutation: {
    addArticle: async (_: any, { input }) => {
      const createArticle = new Article({
        title: input.title,
        article: input.article,
        author: input.author,
        image: input.image,
      });

      const res = await createArticle.save();

      console.log('addArticle:', res);

      return {
        title: res.title,
        article: res.article,
        author: res.author,
        image: res.image,
      };
    },

    deleteArticle: async (_: any, { ID }) => {
      const wasDeleted = (await Article.deleteOne({ _id: ID })).deletedCount;

      console.log('wasDeleted:', wasDeleted);

      return wasDeleted;
    },

    async editArticle(_: any, { ID, articleInput }) {
      const wasEdited = (
        await Article.updateOne({ _id: ID }, { ...articleInput })
      ).modifiedCount;

      console.log('wasEdited:', wasEdited);

      return wasEdited;
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
