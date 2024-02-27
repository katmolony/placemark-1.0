import { db } from "../models/db.js";
import { BusinessSpec } from "../models/joi-schemas.js";

export const locationController = {
  index: {
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      const viewData = {
        title: "Location",
        location: location,
      };
      return h.view("location-view", viewData);
    },
  },

  addBusiness: {
    validate: {
      payload: BusinessSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("location-view", { title: "Add Business error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      const newBusiness = {
        title: request.payload.title,
        category: request.payload.category,
      };
      await db.businessStore.addBusiness(location._id, newBusiness);
      return h.redirect(`/location/${location._id}`);
    },
  },

  deleteBusiness: {
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      await db.businessStore.deleteBusiness(request.params.businessid);
      return h.redirect(`/location/${location._id}`);
    },
  },
};
