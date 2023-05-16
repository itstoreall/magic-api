import mongoose, { model, Schema } from 'mongoose';

// const recipeSchema = new Schema({
//   name: String,
//   description: String,
//   createdAt: String,
//   thumbsUp: Number,
//   thumbsDown: Number,
// });

// export default model('Recipe', recipeSchema);

const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
  // author: String,
  // time: String,
});

const Book = mongoose.model('Book', bookSchema);

// export default mongoose.model('Book', bookSchema);

export default Book;
