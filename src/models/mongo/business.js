import Mongoose from "mongoose";
import { categories } from "../../utils/categories.js";

const { Schema } = Mongoose;

// Define the categories separately
const categories = ["Accommodation", "Dining", "Shopping", "Nightlife", "Activities"];


const businessSchema = new Schema({
  title: String,
  category: {
    type: String,
    enum: categories,
    required: true
  },
  locationid: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
});

export const Business = Mongoose.model("Business", businessSchema);