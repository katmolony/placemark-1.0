import { Business } from "./business.js";

export const businessMongoStore = {
  async getBusinesssByLocationId(id) {
    const businesss = await Business.find({ locationid: id }).lean();
    return businesss;
  },
};