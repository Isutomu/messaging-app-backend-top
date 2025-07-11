// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

// Local Modules
const { PrismaClient } = require("../../generated/client");
const { validatePassword } = require("../helpers/validateInput");
const { validationResult } = require("express-validator");

// Constants
const prisma = new PrismaClient();

module.exports.changePassword = [
  validatePassword,
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
    const { password } = req.body;
    const { id } = req.user;

    let error;
    bcrypt.genSalt(Number(process.env.SALT_ROUNDS), function (err, salt) {
      if (err) {
        error = err;
      }
      bcrypt.hash(password, salt, async (err, hashedPassword) => {
        if (err) {
          error = err;
        }

        await prisma.user.update({
          where: { id },
          data: { password: hashedPassword },
        });
      });
    });
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal Server Error",
      });
    }

    return res.status(200).send({ status: "success" });
  }),
];
