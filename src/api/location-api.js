import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const locationApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        const locations = await db.locationStore.getAllLocations();
        return locations;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  findOne: {
    auth: false,
    async handler(request) {
      try {
        const location = await db.locationStore.getLocationById(request.params.id);
        if (!location) {
          return Boom.notFound("No Location with this id");
        }
        return location;
      } catch (err) {
        return Boom.serverUnavailable("No Location with this id");
      }
    },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const location = request.payload;
        const newLocation = await db.locationStore.addLocation(location);
        if (newLocation) {
          return h.response(newLocation).code(201);
        }
        return Boom.badImplementation("error creating location");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const location = await db.locationStore.getLocationById(request.params.id);
        if (!location) {
          return Boom.notFound("No Location with this id");
        }
        await db.locationStore.deleteLocationById(location._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Location with this id");
      }
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.locationStore.deleteAllLocations();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  // suggestCity: {
  //   auth: false,
  //   handler: async function (request, h) {
  //     try {
  //       const { query } = request.query;
  //       // Make a request to the external API to get city name suggestions
  //       const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=6f31a0fd23d1415ef151dd57611408aa`);
  //       // const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${openWeatherApiKey}`);
  //       const suggestions = response.data.map(city => city.name); // Assuming the API response has a 'name' field for each city
  //       return suggestions;
  //     } catch (err) {
  //       return Boom.serverUnavailable("Failed to fetch city suggestions");
  //     }
  //   },
  // },
};