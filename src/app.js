// 3rd Part Modules
require("dotenv/config");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("morgan");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const passport = require("./config/passport");

// Local Modules
const routes = require("./routes");
const { errorHandler } = require("./middlewares/errorHandler");
const { PrismaClient } = require("./generated/client");

// Constants
const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

// Server Initialization
const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(helmet());
app.use(logger("tiny"));
app.use(express.json({ limit: "50mb" }));
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
require("./config/passport");
app.use(passport.session());

// Routes
app.use(
  "/",
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
  routes,
);

// Error Middleware
app.use(errorHandler);

// Server Listening
app.listen(PORT, (err) => {
  if (!err) {
    console.log(
      `Server is Successfully Running, and App is listening on port ${PORT}`,
    );
  } else {
    console.log(`Error occurred, server can't start ${err}`);
  }
});
