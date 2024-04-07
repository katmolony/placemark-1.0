import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import Hapi from "@hapi/hapi";
import Cookie from "@hapi/cookie";
import dotenv from "dotenv";
import path from "path";
import Joi from "joi";
import jwt from "hapi-auth-jwt2";
import HapiSwagger from "hapi-swagger";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { validate } from "./api/jwt-utils.js";
import { apiRoutes } from "./api-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

const swaggerOptions = {
  info: {
    title: "Placemark API", //was changed
    version: "0.1",
  },
};

async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
  });

  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  await server.register(jwt);

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.validator(Joi);

  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.COOKIE_NAME,
      password: process.env.COOKIE_PASSWORD,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });
  server.auth.strategy("jwt", "jwt", {
    key: process.env.COOKIE_PASSWORD,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] },
  });
  server.auth.default("session");

  db.init("mongo");

  // // Define route for handling file uploads
  // server.route({
  //   method: "POST",
  //   path: "/location/{id}/addbusiness",
  //   handler: async function (request, h) {
  //     const location = await db.locationStore.getLocationById(request.params.id);
  //     const address = request.payload.address;

  //     // Nomanti Open street map, no APIkey needed
  //     const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  //     try {
  //       const response = await axios.get(apiUrl);

  //       if (response.data.length > 0) {
  //         const { lat, lon } = response.data[0];

  //         // Access uploaded image file
  //         const image = request.file; // Corrected this line to access the uploaded file

  //         const newBusiness = {
  //           title: request.payload.title,
  //           category: request.payload.category,
  //           description: request.payload.description,
  //           address: address,
  //           lat: lat,
  //           lng: lon,
  //           image: image ? image.filename : null, // Save only the filename to the database
  //         };

  //         // Save the business to the database
  //         await db.businessStore.addBusiness(location._id, newBusiness);
  //         return h.redirect(`/location/${location._id}`);
  //       } else {
  //         console.error("Invalid address");
  //         return h.redirect(`/location/${location._id}`);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching coordinates:", error);
  //       return h.view("location-view", { title: "Add Business Error", error: "Failed to fetch coordinates" }).takeover().code(500);
  //     }
  //   },
  //   options: {
  //     payload: {
  //       output: "stream",
  //       parse: true,
  //       allow: "multipart/form-data",
  //       multipart: true,
  //       maxBytes: 10485760, // Adjust the maximum payload size limit for this route
  //     },
  //     pre: [
  //       { method: upload.single("image") }, // 'image' should match the name attribute of your file input field
  //     ],
  //   },
  // });

  server.route(webRoutes);
  server.route(apiRoutes);
  await server.start();
  console.log("Server running on %s", server.info.uri);
  // for admin
  //console.log(`AdminJS available at ${server.info.uri}${adminOptions.rootPath}`);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  // process.exit(1);
});

init();
