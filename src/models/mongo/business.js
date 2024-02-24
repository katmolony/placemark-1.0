import Mongoose from "mongoose";

const { Schema } = Mongoose;

const businessSchema = new Schema({
  title: String,
  category : String,
  locationid: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
});

export const Business = Mongoose.model("Business", businessSchema);