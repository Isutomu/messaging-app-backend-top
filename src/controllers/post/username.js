// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");

// Local Modules
const { PrismaClient } = require("../../generated/client");
const { validateUsername } = require("../helpers/validateInput");
const { validationResult } = require("express-validator");

// Constants
const prisma = new PrismaClient();

module.exports.changeUsername = [
  validateUsername,
  (req, res, next) => {
    // These errors can only occur if the API was directly called
    // because the frontend would not allow them.
    // Hence why I'm sending a generic error as response.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(500).send({
        status: "error",
        message: "Internal server error",
      });
    }
    next();
  },
  expressAsyncHandler(async (req, res) => {
    const { username } = req.body;
    const { id } = req.user;

    const available = await prisma.user.findFirst({ where: { username } });
    if (available) {
      return res.status(400).send({
        status: "error",
        message: "Username not available",
      });
    }

    try {
      await prisma.user.update({
        where: { id },
        data: { username },
      });
    } catch {
      if (error) {
        return res.status(500).send({
          status: "error",
          message: "Internal Server Error",
        });
      }
    }

    return res.status(200).send({ status: "success" });
  }),
];
