import { model, Schema } from 'mongoose';

const recipeSchema = new Schema({
  name: String,
  description: String,
  createdAt: String,
  thumbsUp: Number,
  thumbsDown: Number,
});

// module.exports = model('Recipe', recipeSchema);
export default model('Recipe', recipeSchema);
