import { v4 } from "uuid";
import { businessMemStore } from "./business-mem-store.js";

let locations = [];

export const locationMemStore = {
  async getAllLocations() {
    return locations;
  },

  async addLocation(location) {
    location._id = v4();
    locations.push(location);
    return location;
  },

  async getLocationById(id) {
    const list = locations.find((location) => location._id === id);
    list.businesss = await businessMemStore.getBusinesssByLocationId(list._id);
    return list;
  },

  async getUserLocations(userid) {
    return locations.filter((location) => location.userid === userid);
  },

  async deleteLocationById(id) {
    const index = locations.findIndex((location) => location._id === id);
    locations.splice(index, 1);
  },

  async deleteAllLocations() {
    locations = [];
  },
};