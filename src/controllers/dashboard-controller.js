import { db } from "../models/db.js";
import { LocationSpec } from "../models/joi-schemas.js";
import axios from "axios";
import { adminAnalytics } from "../utils/admin-analytics.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const locations = await db.locationStore.getUserLocations(loggedInUser._id);

      const allLocations = await db.locationStore.getAllLocations();
      const viewData = {
        title: "Placemark Dashboard",
        user: loggedInUser,
        locations: locations,
        allLocations: allLocations,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  admin: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const allLocations = await db.locationStore.getAllLocations();
      const allUsers = await db.userStore.getAllUsers();
      const allBusinesss = await db.businessStore.getAllBusinesss();
      // User analytics
      const numUsers = await adminAnalytics.getUserCount(allUsers);
      const numLocation = await adminAnalytics.getLocationCount(allLocations);
      const numBusiness = await adminAnalytics.getBusinessCount(allBusinesss);

      const viewData = {
        title: "Placemark Admin Dashboard",
        user: loggedInUser,
        allLocations: allLocations,
        allUsers: allUsers,
        numUsers: numUsers,
        numLocation: numLocation,
        numBusiness: numBusiness,
      };
      return h.view("admin-view", viewData);
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
      const imageURL = request.payload.imageURL;

      const apiKey = process.env.OPENWEATHER_API_KEY;

      const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

      try {
        const response = await axios.get(requestUrl);
        const { lat, lon } = response.data.coord;
        const { main } = response.data.weather[0];
        const { temp } = response.data.main;

        const newLocation = {
          userid: loggedInUser._id,
          title: city,
          imageURL: imageURL,
          lat: lat,
          lng: lon,
         weather: main,
          temp: temp,
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
      return h.redirect("/admin");
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      const user = await db.userStore.getUserById(request.params.id);
      await db.userStore.deleteUserById(user._id);
      return h.redirect("/admin");
    },
  },
};