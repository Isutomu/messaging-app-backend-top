// 3rd Part Modules
require("dotenv/config");
const express = require("express");
const { createServer } = require("http");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("morgan");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const passport = require("./config/passport");
const { Server } = require("socket.io");

// Local Modules
const routes = require("./routes");
const { errorHandler } = require("./middlewares/errorHandler");
const { PrismaClient } = require("./generated/client");

// Constants
const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

// Server Initialization
const PORT = process.env.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.APP_BASE_URL,
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(helmet());
app.use(logger("tiny"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Session Setup
app.use(
  expressSession({
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.COOKIE_SECURE,
      sameSite: process.env.COOKIE_SAME_SITE,
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
    origin: process.env.APP_BASE_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
  routes,
);

// Error Middleware
app.use(errorHandler);

// Server Listening
io.on("connection", (socket) => {
  socket.on("send message", (data) => {
    console.log("send");
    io.to(data.chatId).emit("receive message", { message: data.message });
  });
  socket.on("join room", (data) => {
    console.log("join");
    socket.join(data.chatId);
  });
  socket.on("leave room", (data) => {
    console.log("leave");
    socket.leave(data.chatId);
  });
});
server.listen(PORT, (err) => {
  if (!err) {
    console.log(
      `Server is Successfully Running, and App is listening on port ${PORT}`,
    );
  } else {
    console.log(`Error occurred, server can't start ${err}`);
  }
});
