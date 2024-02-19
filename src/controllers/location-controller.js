import { db } from "../models/db.js";

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
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      const newBusiness = {
        name: request.payload.name,
        category: request.payload.category,
      };
      await db.businessStore.addBusiness(location._id, newBusiness);
      return h.redirect(`/location/${location._id}`);
    },
  },

  deleteBusiness: {
    handler: async function(request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      await db.businessStore.deleteBusiness(request.params.businessid);
      return h.redirect(`/location/${location._id}`);
    },
  },
};