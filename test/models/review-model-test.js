import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testLocations, testReviews, italy, mcdonalds, starbucks, fiveStarReview } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";


suite("Review Model tests", () => {
  let reviewList = null;

  setup(async () => {
    db.init("mongo");
    await db.businessStore.deleteAllBusinesss();
    await db.reviewStore.deleteAllReviews();
    reviewList = await db.businessStore.addBusiness(mcdonalds);
    for (let i = 0; i < testReviews.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testReviews[i] = await db.reviewStore.addReview(reviewList._id, testReviews[i]);
    }
  });

  test("create single review", async () => {
    const oneStarReviewList = await db.businessStore.addBusiness(starbucks);
    const review = await db.reviewStore.addReview(oneStarReviewList._id, fiveStarReview);
    assert.isNotNull(review._id);
    assertSubset(fiveStarReview, review);
  });
});
