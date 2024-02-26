import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testLocations, testBusinesss, italy, greece, mcdonalds } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";


suite("Business Model tests", () => {
  let italyList = null;

  setup(async () => {
    db.init("mongo");
    await db.locationStore.deleteAllLocations();
    await db.businessStore.deleteAllBusinesss();
    italyList = await db.locationStore.addLocation(italy);
    for (let i = 0; i < testBusinesss.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testBusinesss[i] = await db.businessStore.addBusiness(italyList._id, testBusinesss[i]);
    }
  });

  test("create single business", async () => {
    const greeceList = await db.locationStore.addLocation(greece);
    const business = await db.businessStore.addBusiness(greeceList._id, mcdonalds);
    assert.isNotNull(business._id);
    assertSubset(mcdonalds, business);
  });

  test("get multiple businesss", async () => {
    const businesss = await db.businessStore.getBusinesssByLocationId(italyList._id);
    assert.equal(businesss.length, testBusinesss.length);
  });

  test("delete all businesss", async () => {
    const businesss = await db.businessStore.getAllBusinesss();
    assert.equal(testBusinesss.length, businesss.length);
    await db.businessStore.deleteAllBusinesss();
    const newBusinesss = await db.businessStore.getAllBusinesss();
    assert.equal(0, newBusinesss.length);
  });

  test("get a business - success", async () => {
    const greeceList = await db.locationStore.addLocation(greece);
    const business = await db.businessStore.addBusiness(greeceList._id, mcdonalds);
    const newBusiness = await db.businessStore.getBusinessById(business._id);
    assertSubset(mcdonalds, newBusiness);
  });

  test("delete One Business - success", async () => {
    await db.businessStore.deleteBusiness(testBusinesss[0]._id);
    const businesss = await db.businessStore.getAllBusinesss();
    assert.equal(businesss.length, testLocations.length - 1);
    const deletedBusiness = await db.businessStore.getBusinessById(testBusinesss[0]._id);
    assert.isNull(deletedBusiness);
  });

  test("get a business - bad params", async () => {
    assert.isNull(await db.businessStore.getBusinessById(""));
    assert.isNull(await db.businessStore.getBusinessById());
  });

  test("delete one business - fail", async () => {
    await db.businessStore.deleteBusiness("bad-id");
    const businesss = await db.businessStore.getAllBusinesss();
    assert.equal(businesss.length, testLocations.length);
  });
});
