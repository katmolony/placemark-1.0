import { db } from "../models/db.js";
import { BusinessSpec } from "../models/joi-schemas.js";
import axios from "axios";

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
      const address = request.payload.address;

      // Nomanti Open street map, no APIkey needed
      const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

      try {
        const response = await axios.get(apiUrl);

        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];

          const newBusiness = {
            title: request.payload.title,
            category: request.payload.category,
            description: request.payload.description,
            address: address,
            lat: lat,
            lng: lon, // change for API
          };
          await db.businessStore.addBusiness(location._id, newBusiness);
          return h.redirect(`/location/${location._id}`);
        } else {
          console.error("Invalid address");
          return h.redirect(`/location/${location._id}`);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        return h.redirect(`/location/${location._id}`, { title: "Add Business Error", error: "Failed to fetch coordinates" }).takeover().code(500);
      }
    },
  },

  deleteBusiness: {
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      await db.businessStore.deleteBusiness(request.params.businessid);
      return h.redirect(`/location/${location._id}`);
    },
  },

  filterBusinessCategory: {
    handler: async function (request, h) {
      const locationId = request.params.id;
      const category = request.payload.category;
      try {
        const filteredBusinesses = await db.getBusinessByCategoryAndLocation(category, locationId);
        return h.response(filteredBusinesses);
      } catch (error) {
        console.error("Error filtering businesses:", error);
        return h.response({ error: "Failed to filter businesses" }).code(500);
      }
    },
  },
};