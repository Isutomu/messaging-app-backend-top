// 3rd Part Modules
require("dotenv/config");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("morgan");

// Local Modules
const routes = require("./routes");
const { errorHandler } = require("./middlewares/errorHandler");

// Server Initialization
const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(helmet());
app.use(logger("tiny"));

// Session (?) Setup

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
