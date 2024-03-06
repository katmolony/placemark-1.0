import { db } from "../models/db.js";

export const adminAnalytics = {

    getUserCount(users) {
        const numUsers = users.length;
        return numUsers;
    },

    getLocationCount(location) {
        const numlocation = location.length;
        return numlocation;
    }

}