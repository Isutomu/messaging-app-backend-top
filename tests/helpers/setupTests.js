// 3rd Party Modules
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env.tests") });
const express = require("express");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

// Local Modules
const { PrismaClient } = require("../../src/generated/client");

// Constants
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

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

module.exports = { prisma, app };
