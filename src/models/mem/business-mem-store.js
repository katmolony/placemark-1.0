import { v4 } from "uuid";

let businesss = [];

export const businessMemStore = {
  async getAllBusinesss() {
    return businesss;
  },

  async addBusiness(locationId, business) {
    business._id = v4();
    business.locationid = locationId;
    businesss.push(business);
    return business;
  },

  async getBusinesssByLocationId(id) {
    return businesss.filter((business) => business.locationid === id);
  },

  async getBusinessById(id) {
    let foundBusiness = businesss.find((business) => business._id === id);
    if (!foundBusiness) {
      foundBusiness = null;
    }
    return foundBusiness;
  },

  async getLocationBusinesss(locationId) {
    let foundBusinesss = businesss.filter((business) => business.locationid === locationId);
    if (!foundBusinesss) {
      foundBusinesss = null;
    }
    return foundBusinesss;
  },

  async deleteBusiness(id) {
    const index = businesss.findIndex((business) => business._id === id);
    if (index !== -1) businesss.splice(index, 1);
  },

  async deleteAllBusinesss() {
    businesss = [];
  },

  async updateBusiness(business, updatedBusiness) {
    business.name = updatedBusiness.name;
    business.category = updatedBusiness.category;
  },
};