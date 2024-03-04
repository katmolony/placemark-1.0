import Mongoose from "mongoose";

const { Schema } = Mongoose;

// Define the categories separately
const categories = ["Accommodation", "Dining", "Shopping", "Nightlife", "Activities"];


const businessSchema = new Schema({
  title: String,
  address: String,
  description: String,
  lat: Number,
  lng: Number,
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