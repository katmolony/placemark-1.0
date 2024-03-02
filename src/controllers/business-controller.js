import { BusinessSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const businessController = {
  index: {
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      const business = await db.businessStore.getBusinessById(request.params.businessid);
      const viewData = {
        title: "Edit Song",
        location: location,
        business: business,
      };
      return h.view("business-view", viewData);
    },
  },

  update: {
    validate: {
      payload: BusinessSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("business-view", { title: "Edit business error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const business = await db.businessStore.getBusinessById(request.params.businessid);
      const newBusiness = {
        title: request.payload.title,
        artist: request.payload.artist,
        duration: Number(request.payload.duration), //all to be changed 
      };
      await db.businessStore.updateBusiness(business, newBusiness);
      return h.redirect(`/location/${request.params.id}`);
    },
  },
};