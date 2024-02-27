import { db } from "../models/db.js";
import { LocationSpec } from "../models/joi-schemas.js";

const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=52.160858&lon=-7.152420&units=metric&appid=6f31a0fd23d1415ef151dd57611408aa`


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

    // const lat = request.payload.lat;
    // const lng = request.payload.lng;

    // const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=6f31a0fd23d1415ef151dd57611408aa`

      const newLocation = {
        userid: loggedInUser._id,
        title: request.payload.title,
        // temperature: Number(request.body.temperature),
       // lat: request.payload.lat,
      //  lng: request.payload.lng, //fix
      };

    //   const result = await axios.get(requestUrl);
    // if (result.status == 200) {
    //   const reading = result.data.current;
    //   temp = reading.temp;
    // }
      await db.locationStore.addLocation(newLocation);
      return h.redirect("/dashboard");
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