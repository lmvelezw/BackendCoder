import mongoose from "mongoose";
import supertest from "supertest";
import Assert from "assert";
import { config } from "dotenv";
import app from "../src/index.js";
import userModel from "../src/dao/models/users.model.js";
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

describe("User Registration redirect", () => {
  beforeEach(async () => {
    await userModel.deleteMany();
  });

  it("should register a new user", async () => {
    const newUser = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      age: 25,
      role: "user",
      password: "password123",
    };

    try {
      const res = await supertest(app)
        .post("/api/sessions/register")
        .send(newUser)
        .expect(302)
        .expect("Location", "/api/sessions/login");
    } catch (error) {
      console.error("Error in user registration test:", error);
      throw error;
    }
  });
});
