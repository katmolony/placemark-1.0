import { Business } from "./business.js";

export const businessMongoStore = {
  async getAllBusinesss() {
    const businesss = await Business.find().lean();
    return businesss;
  },

  async addBusiness(locationId, business) {
    business.locationid = locationId;
    const newBusiness = new Business(business);
    const businessObj = await newBusiness.save();
    return this.getBusinessById(businessObj._id);
  },

  async getBusinesssByLocationId(id) {
    const businesss = await Business.find({ locationid: id }).lean();
    return businesss;
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

  async deleteAllBusinesss() {
    await Business.deleteMany({});
  },

  async updateBusiness(business, updatedBusiness) {
    const businessDoc = await Business.findOne({ _id: business._id });
    businessDoc.title = updatedBusiness.title;
    businessDoc.category = updatedBusiness.category;
    // businessDoc.address = updatedBusiness.address;
    businessDoc.description = updatedBusiness.description;
    await businessDoc.save();
  },

};