import Boom from "@hapi/boom";
import { IdSpec, LocationArraySpec, LocationSpec, LocationSpecPlus } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { validationError } from "./logger.js";

export const locationApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    async handler(request, h) {
      try {
        const locations = await db.locationStore.getAllLocations();
        return locations;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: LocationArraySpec, failAction: validationError },
    description: "Get all locations",
    notes: "Returns all locations",
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request, h) {
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
    tags: ["api"],
    description: "Find a Location",
    notes: "Returns a location",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: LocationSpecPlus, failAction: validationError },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    async handler(request, h) {
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
    tags: ["api"],
    description: "Create a Location",
    notes: "Returns the newly created location",
    validate: { payload: LocationSpec, failAction: validationError },
    response: { schema: LocationSpecPlus, failAction: validationError },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request, h) {
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
    tags: ["api"],
    description: "Delete a location",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    async handler(request, h) {
      try {
        await db.locationStore.deleteAllLocations();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all LocationApi",
  },
};

  // suggestCity: {
  //   auth: {
    //   strategy: "jwt",
    // },
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

