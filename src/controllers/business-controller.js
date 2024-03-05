import { BusinessSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const businessController = {
  index: {
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.locationid);
      const business = await db.businessStore.getBusinessById(request.params.id);
      const viewData = {
        title: "Business View",
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
      const locationid = await db.locationStore.getLocationById(request.params.locationid);
      const business = await db.businessStore.getBusinessById(request.params.businessid);
      const newBusiness = {
        title: request.payload.title,
        category: request.payload.category,
        description: request.payload.description,
        address: request.payload.address,
        // these fields don't change
       // address: business._address,
       // lat: business._lat,
       // lng: business._lng,
       // locationid: locationid._id
      };
      console.log(`Updating Reading ${business._id} from Station ${locationid._id}`);
      await db.businessStore.updateBusiness(business, newBusiness);
      return h.redirect(`/location/${locationid._id}/business/${business._id}`);
    },
  },
};
