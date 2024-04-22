import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { locationController } from "./controllers/location-controller.js";
import { businessController } from "./controllers/business-controller.js";
import { reviewController } from "./controllers/review-controller.js";
import os from "os";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },
  { method: "GET", path: "/profile", config: accountsController.profile },

  { method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/dashboard/addlocation", config: dashboardController.addLocation },

  // for admin dashboard
  { method: "GET", path: "/admin", config: dashboardController.admin },
  // for owner dashboard
  { method: "GET", path: "/owner", config: dashboardController.owner },
  { method: "GET", path: "/dashboard/deletelocation/{id}", config: dashboardController.deleteLocation },
  { method: "GET", path: "/dashboard/deleteuser/{id}", config: dashboardController.deleteUser },

  { method: "GET", path: "/location/{id}", config: locationController.index },
  { method: "POST", path: "/location/{id}/addbusiness", config: locationController.addBusiness },
  { method: "GET", path: "/location/{id}/deletebusiness/{businessid}", config: locationController.deleteBusiness },
  { method: "GET", path: "/location/{id}/filterbusinesscategory", config: locationController.filterBusinessCategory },

  { method: "GET", path: "/location/{locationid}/business/{id}", config: businessController.index },
  { method: "POST", path: "/location/{locationid}/updateBusiness/{businessid}", config: businessController.update },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },

  // Reviews
  // { method: "GET", path: "/business/(businessid}/review/{id}", config: reviewController.index },
  { method: "POST", path: "/location/{locationid}/business/{businessid}/addreview", config: businessController.addReview },

  {
    method: "GET",
    path: "/testlb",
    handler: function (request, h) {
      return "Server: " + os.hostname();
    },
    config: { auth: false },
  },
];
