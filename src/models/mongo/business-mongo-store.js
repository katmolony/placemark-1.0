import { Business } from "./business.js";
import { categories } from "../../utils/categories.js";

export const businessMongoStore = {
  async getAllBusinesses() {
    const businesses = await Business.find().lean();
    return businesses;
  },

  async addBusiness(locationId, business) {
    business.locationid = locationId;
    const newBusiness = new Business(business);
    const businessObj = await newBusiness.save();
    return this.getBusinessById(businessObj._id);
  },

  async getBusinessesByLocationId(id) {
    const businesses = await Business.find({ locationid: id }).lean();
    return businesses;
  },

  async getBusinessById(id) {
    if (id) {
      const business = await Business.findOne({ _id: id }).lean();
      return business;
    }
    return null;
  },

  async deleteBusiness(id) {
    try {
      await Business.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllBusinesses() {
    await Business.deleteMany({});
  },

  async updateBusiness(business, updatedBusiness) {
    const businessDoc = await Business.findOne({ _id: business._id });
    businessDoc.title = updatedBusiness.title;
    businessDoc.category = updatedBusiness.category;
    await businessDoc.save();
  },
};