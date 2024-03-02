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
      // const address = document.getElementById("address-input").value;
      // const city = document.getElementById("city-input").value;
      // const state = document.getElementById("state-input").value;
      // const zipcode = document.getElementById("zipcode-input").value;
      // const country = document.getElementById("country-input").value;
  
      // const fullAddress = `${address}, ${city}, ${state}, ${zipcode}, ${country}`;
      const location = await db.locationStore.getLocationById(request.params.id);
      const address = request.payload.address;
  
      const googleApiKey = process.env.GOOGLE_MAP_API;
  
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}`;
  
      try {
        const response = await axios.get(apiUrl);
        const data = response.data; // Assigning response data to a variable

        if (data.status === "OK" && data.results.length > 0) {
            const { geometry, formatted_address } = data.results[0];
            const { lat, lng } = geometry.location;
  
          const newBusiness = {
            title: request.payload.title,
            category: request.payload.category,
            address: address,
            lat: lat,
            lng: lng,
          };
          //console.log(response, lat, lng)
          await db.businessStore.addBusiness(location._id, newBusiness);
          return h.redirect(`/location/${location._id}`);
        } else {
          console.error("Invalid address");
          return h.view("location-view", { title: "Add Business Error", error: "Invalid address" }).takeover().code(400);
        } 
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        return h.view("location-view", { title: "Add Business Error", error: "Failed to fetch coordinates" }).takeover().code(500);
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
      const location = await db.locationStore.getLocationById(request.params.id);
      const category = request.payload.category; //query for get
      try {
        const allBusinesss = await db.getBusinesssByLocationId(location);
        const filteredBusinesses = await allBusinesss.getBusinessByCategory(category);
        return h.response(filteredBusinesses); // Return the filtered
      } catch (error) {
        console.error('Error filtering businesses:', error);
        return h.response({ error: 'Failed to filter businesses' }).code(500);
      }
    }
  }
};
