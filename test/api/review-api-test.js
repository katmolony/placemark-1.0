import { EventEmitter } from "events";
import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, greece, maggieCredentials, testLocations, testBusinesss, mcdonalds , fiveStarReview} from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Review API tests", () => {
  let user = null;
  let newLocation = null;
  let newBusiness = null;

  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllLocations();
    await placemarkService.deleteAllBusinesss();
    await placemarkService.deleteAllReviews()
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    greece.userid = user._id;
    newLocation = await placemarkService.createLocation(greece);
    newBusiness = await placemarkService.createBusiness(newLocation._id, mcdonalds);
  });

  teardown(async () => {});

  test("create review", async () => {
//     const newLocation = await placemarkService.createLocation(greece);
//    const returnedBusiness = await placemarkService.createBusiness(newLocation._id, mcdonalds);
    const returnedReview = await placemarkService.createReview(newLocation._id, newBusiness._id, fiveStarReview);
    assertSubset(fiveStarReview, returnedReview);
  });
 
  test("delete a review", async () => {});

  test("create multiple reviews", async () => {});

  test("remove non-existant review", async () => {});
});
