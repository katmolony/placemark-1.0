import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const businessJsonStore = {
  async getAllBusinesss() {
    await db.read();
    return db.data.businesss;
  },

  async addBusiness(locationId, business) {
    await db.read();
    business._id = v4();
    business.locationid = locationId;
    db.data.businesss.push(business);
    await db.write();
    return business;
  },

  async getBusinesssByLocationId(id) {
    await db.read();
    return db.data.businesss.filter((business) => business.locationid === id);
  },

  async getBusinessById(id) {
    await db.read();
    return db.data.businesss.find((business) => business._id === id);
  },

  async deleteBusiness(id) {
    await db.read();
    const index = db.data.businesss.findIndex((business) => business._id === id);
    db.data.businesss.splice(index, 1);
    await db.write();
  },

  async deleteAllBusinesss() {
    db.data.businesss = [];
    await db.write();
  },

  async updateBusiness(business, updatedBusiness) {
    business.title = updatedBusiness.title;
    business.category = updatedBusiness.category;
    await db.write();
  },
};