import { v4 } from "uuid";

let reviews = [];

export const reviewMemStore = {
  async getAllReviews() {
    return reviews;
  },

  async addReview(businessId, review) {
    review._id = v4();
    review.businessid = businessId;
    reviews.push(review);
    return review;
  },

  async getReviewsByBuisnessId(id) {
    return reviews.filter((review) => review.businessid === id);
  },

  async getReviewById(id) {
    let foundReview = reviews.find((review) => review._id === id);
    if (!foundReview) {
      foundReview = null;
    }
    return foundReview;
  },

  async getbusinessReviews(businessId) {
    let foundReviews = reviews.filter((review) => review.businessid === businessId);
    if (!foundReviews) {
      foundReviews = null;
    }
    return foundReviews;
  },

  async deleteReview(id) {
    const index = reviews.findIndex((review) => review._id === id);
    if (index !== -1) reviews.splice(index, 1);
  },

  async deleteAllReviews() {
    reviews = [];
  },

  // Might need updating
  async updateReview(review, updatedReview) {
    review.rating = updatedReview.rating;
    review.content = updatedReview.content;
  },
};