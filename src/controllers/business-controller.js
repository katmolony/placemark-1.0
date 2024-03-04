import { BusinessSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const businessController = {
  index: {
    handler: async function (request, h) {
      // const location = await db.locationStore.getLocationById(request.params.id);
      const business = await db.businessStore.getBusinessById(request.params.id);
      const viewData = {
        title: "Business View",
       // location: location,
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
        description: request.payload.description,
        category: request.payload.category, //all to be changed 

  //       title: String,
  // address: String,
  // description: String,
  // lat: Number,
  // lng: Number,
  // category: 
      };
      await db.businessStore.updateBusiness(business, newBusiness);
      return h.redirect(`/location/${request.params.id}`);
    },
  },
};