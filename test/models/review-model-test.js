import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testLocations, testBusinesss, testReviews, greece, italy, mcdonalds, starbucks, fiveStarReview } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";


suite("Review Model tests", () => {
  let italyList = null;
  let businessList = null;
  let reviewList = null;

  setup(async () => {
    db.init("mongo");
    await db.locationStore.deleteAllLocations();
    await db.businessStore.deleteAllBusinesss();
    await db.reviewStore.deleteAllReviews();
    italyList = await db.locationStore.addLocation(italy);
    for (let i = 0; i < testBusinesss.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testBusinesss[i] = await db.businessStore.addBusiness(italyList._id, testBusinesss[i]);
    }
    for (let i = 0; i < testReviews.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testReviews[i] = await db.reviewStore.addReview(testBusinesss[i]._id, testReviews[i]);
    }
  });

  test("create single review", async () => {
    const greeceList = await db.locationStore.addLocation(greece);
    const business = await db.businessStore.addBusiness(greeceList._id, mcdonalds);
   // const oneStarReview = await db.reviewStore.addReview(mcdonalds._id, business);
    const review = await db.reviewStore.addReview(business._id, fiveStarReview);
    assert.isNotNull(review._id);
    assertSubset(fiveStarReview, review);
  });
});
