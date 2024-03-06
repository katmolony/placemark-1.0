import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, greece, maggieCredentials, testLocations, testBusinesss, mcdonalds } from "../fixtures.js";

// import { maggie, mxozart, testLocations, testTXracks, cxoncerto } from "../fixtures.js";

suite("Business API tests", () => {
  let user = null;
  let locationList = null; //could be wrong locationList

  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllLocations();
    await placemarkService.deleteAllBusinesss();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    greece.userid = user._id;
    locationList = await placemarkService.createLocation(greece);
  });

  teardown(async () => {});

  test("create business", async () => {
    const returnedBusiness = await placemarkService.createBusiness(locationList._id, mcdonalds);
    assertSubset(mcdonalds, returnedBusiness);
  });

  test("create Multiple businesss", async () => {
    for (let i = 0; i < testBusinesss.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createBusiness(locationList._id, testBusinesss[i]);
    }
    const returnedBusinesss = await placemarkService.getAllBusinesss();
    assert.equal(returnedBusinesss.length, testBusinesss.length);
    for (let i = 0; i < returnedBusinesss.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const business = await placemarkService.getBusiness(returnedBusinesss[i]._id);
      assertSubset(business, returnedBusinesss[i]);
    }
  });

  test("Delete BusinessApi", async () => {
    for (let i = 0; i < testBusinesss.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createBusiness(locationList._id, testBusinesss[i]);
    }
    let returnedBusinesss = await placemarkService.getAllBusinesss();
    assert.equal(returnedBusinesss.length, testBusinesss.length);
    for (let i = 0; i < returnedBusinesss.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const business = await placemarkService.deleteBusiness(returnedBusinesss[i]._id);
    }
    returnedBusinesss = await placemarkService.getAllBusinesss();
    assert.equal(returnedBusinesss.length, 0);
  });

  test("denormalised location", async () => {
    for (let i = 0; i < testBusinesss.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createBusiness(locationList._id, testBusinesss[i]);
    }
    const returnedLocation = await placemarkService.getLocation(locationList._id);
    assert.equal(returnedLocation.businesss.length, testBusinesss.length);
    for (let i = 0; i < testBusinesss.length; i += 1) {
      assertSubset(testBusinesss[i], returnedLocation.businesss[i]);
    }
  });
});