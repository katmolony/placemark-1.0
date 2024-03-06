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
    let foundBusinesss = db.data.businesss.filter((business) => business.locationid === id);
    if (!foundBusinesss) {
      foundBusinesss = null;
    }
    return foundBusinesss;
  },

  async getBusinessById(id) {
    await db.read();
    let foundBusiness = db.data.businesss.find((business) => business._id === id);
    if (!foundBusiness) {
      foundBusiness = null;
    }
    return foundBusiness;
  },

  async getLocationBusinesss(locationId) {
    await db.read();
    let foundBusinesss = businesss.filter((business) => business.locationid === locationId);
    if (!foundBusinesss) {
      foundBusinesss = null;
    }
    return foundBusinesss;
  },

  async deleteBusiness(id) {
    await db.read();
    const index = db.data.businesss.findIndex((business) => business._id === id);
    if (index !== -1) db.data.businesss.splice(index, 1);
    await db.write();
  },

  async deleteAllBusinesss() {
    db.data.businesss = [];
    await db.write();
  },

  async updateBusiness(business, updatedBusiness) {
    business.title = updatedBusiness.title;
    business.category = updatedBusiness.category;
    business.description = updatedBusiness.description;
    await db.write();
  },

};