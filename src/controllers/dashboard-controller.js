import { db } from "../models/db.js";
import { LocationSpec } from "../models/joi-schemas.js";
import axios from "axios";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const locations = await db.locationStore.getUserLocations(loggedInUser._id);
      const viewData = {
        title: "Placemark Dashboard",
        user: loggedInUser,
        locations: locations,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addLocation: {
    validate: {
      payload: LocationSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard-view", { title: "Add Location error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const city = request.payload.title;

      const apiKey = process.env.OPENWEATHER_API_KEY;

      const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

      try {
        const response = await axios.get(requestUrl);
        const { lat, lon } = response.data.coord;

        const newLocation = {
          userid: loggedInUser._id,
          title: city,
          lat: lat,
          lng: lon, //fix
        };

        await db.locationStore.addLocation(newLocation);
        return h.redirect("/dashboard");
      } catch (error) {
        console.error("Error getting city data:", error);
        return h.view("dashboard-view", { title: "Error adding location", error: "Failed to retrieve city data. Please try again." }).takeover().code(500);
      }
    },
  },

  deleteLocation: {
    handler: async function (request, h) {
      const location = await db.locationStore.getLocationById(request.params.id);
      await db.locationStore.deleteLocationById(location._id);
      return h.redirect("/dashboard");
    },
  },
};
