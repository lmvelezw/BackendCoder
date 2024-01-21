import mongoose from "mongoose";
import Assert from "assert";
import { config } from "dotenv";
import Carts from "../src/dao/classes/carts.dao.js";
import * as chai from "chai";

const expect = chai.expect;

config();

const mongoUrl = process.env.MONGO_URL;

await mongoose
  .connect(mongoUrl)
  .then(() => {})
  .catch((error) => {
    throw Error(`Error connecting to database ${error}`);
  });

const assert = Assert.strict;

describe("Test Carts dao", () => {
  before(function () {
    this.cartsDao = new Carts();
  });
  beforeEach(function () {
    this.timeout(5000);
  });

  it("Dao creates a cart in the database", async function () {
    const req = {
      products: [],
    };

    const createdCart = await this.cartsDao.createCart(req);
    assert.ok(createdCart._id);
  });

  it("Dao deletes a cart in the database", async function () {
    const req = {
      products: [],
    };

    const createdCart = await this.cartsDao.createCart(req);
    assert.ok(createdCart._id);

    const cartAfterDeletion = await this.cartsDao.getCartByID(createdCart._id);
    assert.strict(cartAfterDeletion, null);
  });
});
