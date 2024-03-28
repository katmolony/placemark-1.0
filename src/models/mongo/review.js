import Mongoose from "mongoose";

const { Schema } = Mongoose;

const reviewSchema = new Schema(
  {
    content: String,
    rating: Number,
    timestamp: String,
    businessid: {
      type: Schema.Types.ObjectId,
      ref: "Business",
     // required: true
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: "User",
      //  required: true 
      },
  },
  // { timestamp: true } // Add timestamps option to automatically add createdAt and updatedAt fields
);

export const Review = Mongoose.model("Review", reviewSchema);