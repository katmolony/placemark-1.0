import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { validationError } from "./logger.js";
import { IdSpec, ReviewSpec, ReviewSpecPlus, ReviewArraySpec } from "../models/joi-schemas.js";

export const reviewApi = {
  find: {
    auth: {
      strategy: "jwt"
    },
    async handler(request, h) {
      try {
        const reviews = await db.reviewStore.getAllReviews();
        return reviews;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: ReviewArraySpec, failAction: validationError },
    description: "Get all reviews",
    notes: "Returns all reviews"
  },

  findOne: {
    auth: {
      strategy: "jwt"
    },
    async handler(request) {
      try {
        const review = await db.reviewStore.getReviewById(request.params.id);
        if (!review) {
          return Boom.notFound("No review with this id");
        }
        return review;
      } catch (err) {
        return Boom.serverUnavailable("No review with this id");
      }
    },
    tags: ["api"],
    description: "Find a Review",
    notes: "Returns a review",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: ReviewSpecPlus, failAction: validationError }
  },

  create: {
    auth: {
      strategy: "jwt"
    },
    async handler(request, h) {
      try {
        const review = request.payload;
        const newReview = await db.reviewStore.addReview(request.params.id, review);
        if (newReview) {
          return h.response(newReview).code(201);
        }
        return Boom.badImplementation("Error creating review");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a Review",
    notes: "Returns the newly created review",
    validate: { payload: ReviewSpec },
    response: { schema: ReviewSpecPlus, failAction: validationError }
  },

  deleteAll: {
    auth: {
      strategy: "jwt"
    },
    async handler(request, h) {
      try {
        await db.reviewStore.deleteAllReviews();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all reviews"
  },

  deleteOne: {
    auth: {
      strategy: "jwt"
    },
    async handler(request, h) {
      try {
        const review = await db.reviewStore.getReviewById(request.params.id);
        if (!review) {
          return Boom.notFound("No Review with this id");
        }
        await db.reviewStore.deleteReview(review._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Review with this id");
      }
    },
    tags: ["api"],
    description: "Delete a review",
    validate: { params: { id: IdSpec }, failAction: validationError }
  }
};