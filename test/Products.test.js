import mongoose from "mongoose";
import Products from "../src/dao/classes/product.dao.js";
import Assert from "assert";
import { config } from "dotenv";
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

describe("Test Products dao", () => {
  before(function () {
    this.productsDao = new Products();
  });
  beforeEach(function () {
    this.timeout(5000);
  });

  it("Dao adds product to the database as an admin role", async function () {
    const testProduct = {
      title: "Test Prod",
      description: "This is a test product",
      code: "123abc",
      price: 12,
      stock: 1,
      category: "Test",
      image: null,
    };

    const req = {
      session: {
        user: {
          role: "admin",
        },
      },
      body: testProduct,
    };
    const result = await this.productsDao.createProduct(req);
    assert.ok(result._id);
  });

  it("Dao must return the products array", async function () {
    try {
      const req = {
        query: {
          limit: 3,
          page: 1,
          sort: "asc",
          category: null,
        },
      };

      const result = await this.productsDao.getAllProducts(req);
      assert.strictEqual(Array.isArray(result), result.length > 0, true);
    } catch (error) {
      console.log("Error retrieving data: ", error);
      assert.fail("Missed test");
    }
  });
});
