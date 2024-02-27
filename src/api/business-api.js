import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const businessApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const businesss = await db.businessStore.getAllBusinesss();
        return businesss;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  findOne: {
    auth: false,
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
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const business = await db.businessStore.addBusiness(request.params.id, request.payload);
        if (business) {
          return h.response(business).code(201);
        }
        return Boom.badImplementation("error creating business");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.businessStore.deleteAllBusinesss();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
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
  },
};