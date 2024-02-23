// import { userMemStore } from "./mem/user-mem-store.js";
// import { locationMemStore } from "./mem/location-mem-store.js";
// import { businessMemStore } from "./mem/business-mem-store.js";

import { userJsonStore } from "./json/user-json-store.js";
import { locationJsonStore } from "./json/location-json-store.js";
import { businessJsonStore } from "./json/business-json-store.js";

export const db = {
  userStore: null,
  locationStore: null,
  businessStore: null,

  init() {
    this.userStore = userJsonStore;
    this.locationStore = locationJsonStore;
    this.businessStore = businessJsonStore;
  },
};