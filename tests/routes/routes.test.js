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
const { userLogin, userSignup } = require("../data/user");

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

beforeAll(async () => {
  await cleanDatabase(prisma);

  // For route GET /login
  // For route POST /send-reset-password-link
  // For route POST /reset-password
  await addUser(prisma);
});

afterAll(async () => {
  await cleanDatabase(prisma);
});

// Tests
test("Login route", (done) => {
  request(app)
    .post("/login")
    .type("json")
    .send({ username: userLogin.username, password: userLogin.password })
    .expect("Content-type", /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        console.error(res.body);
      }
      done(err);
    });
});

test("Sign up route", (done) => {
  request(app)
    .post("/signup")
    .type("json")
    .send({
      email: userSignup.email,
      username: userSignup.username,
      password: userSignup.password,
    })
    .expect("Content-type", /json/)
    .expect(201)
    .end((err, res) => {
      if (err) {
        console.error(res.body);
      }
      done(err);
    });
});

test("Reset password route", (done) => {
  request(app)
    .post(
      "/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpZCIsImlhdCI6MTc1MTc0NTg2MzEyMSwiZXhwIjoxNzUxNzQ1OTcxMTIxfQ.ViHHsjiKbEWFZLZCtes8i__kv-VQvPPXf1peudPX99U",
    )
    .type("json")
    .send({
      password: "newPassword",
    })
    .expect("Content-type", /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        console.error(res.body);
      }
      done(err);
    });
});

test("Send reset password link route", (done) => {
  request(app)
    .post("/send-reset-password-link")
    .type("json")
    .send({
      email: userLogin.email,
    })
    .expect("Content-type", /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        console.error(res.body);
      }
      done(err);
    });
});
