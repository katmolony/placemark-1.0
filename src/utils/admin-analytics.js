import { db } from "../models/db.js";

export const adminAnalytics = {

    getUserCount(users) {
        var numUsers = users.length - 1;
        return numUsers;
    }

}