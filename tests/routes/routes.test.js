// 3rd Party Modules
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env.tests") });
const express = require("express");
const request = require("supertest");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

// Local Modules
const routes = require("../../src/routes");
const { PrismaClient } = require("../../src/generated/client");
const { cleanDatabase } = require("../helpers/cleanDatabase");
const { addUser } = require("../helpers/addUser");
const { user } = require("../data/user");

// Constants
const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

// Server Initialization
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Setup
app.use(
  expressSession({
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 1000 * 60 * 10,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

// Passport Authentication
const passport = require("../../src/config/passport");
app.use(passport.session());

// Routes
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
  request(app)
    .post("/login")
    .type("json")
    .send({ username: user.username, password: user.password })
    .expect("Content-type", /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        console.error(res.body);
      }
      done(err);
    });
});
