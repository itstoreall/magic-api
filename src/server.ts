import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4001;

// console.log('PORT', process.env.PORT);

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
    #getArticleById(ID: ID!): Article
    #getArticleByTitle(title: String!): Article
  }

  type Mutation {
    addArticle(input: ArticleInput): Article
    #deleteArticle(ID: ID!): Boolean
    #editArticle(ID: ID!, articleInput: ArticleInput): Boolean
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

    // async getArticleById(_: any, { ID }: any) {
    //   const res = await Articles.find({ _id: ID });

    //   console.log('getArticleById article:', res);

    //   return { id: res[0]._id, title: res[0].title, article: res[0].article };
    // },

    // async getArticleByTitle(_: any, { title }: any) {
    //   const res = await Articles.find({ title });

    //   console.log('getArticleByTitle article:', res);

    //   return { id: res[0]._id, title: res[0].title, article: res[0].article };
    // },
  },
  Mutation: {
    async addArticle(_: any, { input }: any) {
      const createArticle = new Articles({
        title: input.title,
        article: input.article,
      });

      const res = await createArticle.save();

      console.log('add article:', res);

      return { id: res._id, ...res };
    },

    // async deleteArticle(_: any, { ID }) {
    //   const wasDeleted = (await Articles.deleteOne({ _id: ID })).deletedCount;

    //   console.log('wasDeleted:', wasDeleted);

    //   return wasDeleted;
    // },

    // async editArticle(_: any, { ID, articleInput: { title, article } }) {
    //   const wasEdited = (
    //     await Articles.updateOne({ _id: ID }, { title, article })
    //   ).modifiedCount;

    //   console.log('wasEdited:', wasEdited);

    //   return wasEdited;
    // },
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

// if (process.env.NODE_ENV === 'production') {
//   console.log('===> Running in production mode', process.env.NODE_ENV);
// } else if (process.env.NODE_ENV === 'development') {
//   console.log('===> Running in development mode', process.env.NODE_ENV);
// } else if (process.env.NODE_ENV === 'test') {
//   console.log('===> Running in test mode', process.env.NODE_ENV);
// } else {
//   console.log('===> Unknown environment', process.env.NODE_ENV);
// }
