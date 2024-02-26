import { EventEmitter } from "events";
import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, greece, testLocations } from "../fixtures.js";

// import { maggie, mozart, testPlaylists } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Location API tests", () => {

  let user = null;

  setup(async () => {
    await placemarkService.deleteAllLocations();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    greece.userid = user._id;
  });

  teardown(async () => {});

  test("create location", async () => {
  });

  test("delete a location", async () => {
  });

  test("create multiple locations", async () => {
  });

  test("remove non-existant location", async () => {
  });
});