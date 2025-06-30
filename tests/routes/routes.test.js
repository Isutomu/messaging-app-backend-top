// 3rd Party Modules
require("dotenv").config({ path: path.join(__dirname, "../../.env.tests") });
const path = require("path");
const express = require("express");
const request = require("supertest");

// Local Modules
const routes = require("../../src/routes");
const { PrismaClient } = require("../../src/generated/client");
const { cleanDatabase } = require("../helpers/cleanDatabase");
const { addUser } = require("../helpers/addUser");

// Constants
const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

// Server Initialization
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

beforeEach(async () => {
  await cleanDatabase(prisma);

  // For route GET /login
  await addUser(prisma);
});

afterEach(async () => {
  await cleanDatabase(prisma);
});

// Tests
test("Login route", (done) => {
  request(app).get("/login").expect(200, done);
});
