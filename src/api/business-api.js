import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, BusinessSpec, BusinessSpecPlus, BusinessArraySpec } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

export const businessApi = {
  find: {
    auth: {
      strategy: "jwt"
    },
    async handler(request, h) {
      try {
        const businesses = await db.businessStore.getAllBusinesss();
        return businesses;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: BusinessArraySpec, failAction: validationError },
    description: "Get all businesses",
    notes: "Returns all businesses"
  },

  findOne: {
    auth: {
      strategy: "jwt"
    },
    async handler(request) {
      try {
        const business = await db.businessStore.getBusinessById(request.params.id);
        if (!business) {
          return Boom.notFound("No business with this id");
        }
        return business;
      } catch (err) {
        return Boom.serverUnavailable("No business with this id");
      }
    },
    tags: ["api"],
    description: "Find a Business",
    notes: "Returns a business",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: BusinessSpecPlus, failAction: validationError }
  },

  create: {
    auth: {
      strategy: "jwt"
    },
    async handler(request, h) {
      try {
        const business = await db.businessStore.addBusiness(request.params.id, request.payload);
        if (business) {
          return h.response(business).code(201);
        }
        return Boom.badImplementation("Error creating business");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a business",
    notes: "Returns the newly created business",
    validate: { payload: BusinessSpec },
    response: { schema: BusinessSpecPlus, failAction: validationError }
  },

  deleteAll: {
    auth: {
      strategy: "jwt"
    },
    async handler(request, h) {
      try {
        await db.businessStore.deleteAllBusinesss();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all businesses"
  },

  deleteOne: {
    auth: {
      strategy: "jwt"
    },
    async handler(request, h) {
      try {
        const business = await db.businessStore.getBusinessById(request.params.id);
        if (!business) {
          return Boom.notFound("No Business with this id");
        }
        await db.businessStore.deleteBusiness(business._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Business with this id");
      }
    },
    tags: ["api"],
    description: "Delete a business",
    validate: { params: { id: IdSpec }, failAction: validationError }
  }
};