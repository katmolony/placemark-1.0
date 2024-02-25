import Mongoose from "mongoose";

const { Schema } = Mongoose;

const businessSchema = new Schema({
  title: String,
  category: {
    type: String,
    enum: categories, // Use the predefined list of categories
  },
  locationid: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
});

export const Business = Mongoose.model("Business", businessSchema);