import Recipe from '../models/Recipe';

const resolvers = {
  Query: {
    async recipe(_: any, { ID }: any) {
      return await Recipe.findById(ID);
    },

    async getRecipe(_: any, { amount }: any) {
      return await Recipe.find().sort({ createdAt: -1 }).limit(amount);
    },
  },
  Mutation: {
    async createRecipe(_, { recipeInput: { name, description } }) {
      const createRecipe = new Recipe({
        name: name,
        description: description,
        createdAt: new Date().toISOString(),
        thumbsUp: 0,
        thumbsDown: 0,
      });

      const res = await createRecipe.save();

      console.log('res ----->', res); // res._dec

      return {
        id: res.id,
        ...res,
      };
    },

    async deleteRecipe(_: any, { ID }) {
      const wasDeleted = (await Recipe.deleteOne({ _id: ID })).deletedCount;
      console.log('wasDeleted ------>', wasDeleted);

      return wasDeleted;
    },

    async editRecipe(_: any, { ID, recipeInput: { name, description } }) {
      const wasEdited = (
        await Recipe.updateOne(
          { _id: ID },
          { name: name, description: description }
        )
      ).modifiedCount;

      console.log('wasEdited ------>', wasEdited);

      return wasEdited;
    },
  },
};

export default resolvers;
