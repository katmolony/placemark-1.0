import { Review } from "./review.js";

export const reviewMongoStore = {
  async getAllReviews() {
    const reviews = await Review.find().lean();
    return reviews;
  },

  async addReview(businessId, review) {
    review.businessid = businessId;
    const newReview = new Review(review);
    const reviewObj = await newReview.save();
    return this.getReviewById(reviewObj._id);
  },

  async getReviewsByBusinessId(id) {
    const reviews = await Review.find({ businessid: id }).lean();
    return reviews;
  },

  async getReviewById(id) {
    if (id) {
      const review = await Review.findOne({ _id: id }).lean();
      return review;
    }
    return null;
  },

  async deleteReview(id) {
    try {
      await Review.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllReviews() {
    await Review.deleteMany({});
  },

  async updateReview(review, updatedReview) {
    const reviewDoc = await Review.findOne({ _id: review._id });
    reviewDoc.content = updatedReview.content;
    reviewDoc.rating = updatedReview.rating;
    await reviewDoc.save();
  },

};