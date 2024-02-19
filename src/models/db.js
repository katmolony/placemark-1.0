import { userMemStore } from "./mem/user-mem-store.js";
import { locationMemStore } from "./mem/location-mem-store.js";
import { businessMemStore } from "./mem/business-mem-store.js";

export const db = {
  userStore: null,
  locationStore: null,
  businessStore: null,

  init() {
    this.userStore = userMemStore;
    this.locationStore = locationMemStore;
    this.businessStore = businessMemStore;
  },
};