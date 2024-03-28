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
  { timestamps: true } // timestamps option adds createdAt and updatedAt fields
);

export const Review = Mongoose.model("Review", reviewSchema);