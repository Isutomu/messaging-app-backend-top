// 3rd Party Modules
const { validationResult } = require("express-validator");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

// Local Modules
const {
  validateUsername,
  validatePassword,
  validateEmail,
} = require("../helpers/validateInput");
const { PrismaClient } = require("../../generated/client");

// Constants
const prisma = new PrismaClient();

module.exports.signup = [
  validateEmail,
  validateUsername,
  validatePassword,
  (req, res, next) => {
    // These errors can only occur if the API was directly called
    // because the frontend would not allow them.
    // Hence why I'm sending a generic error as response.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors);
    }
    next();
  },
  expressAsyncHandler(async (req, res, next) => {
    const { email, username, password } = req.body;

    const userByEmail = await prisma.user.findUnique({ where: { email } });
    const userByUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (userByEmail) {
      return res
        .status(409)
        .send({ status: "error", message: "Email not available" });
    } else if (userByUsername) {
      return res
        .status(409)
        .send({ status: "error", message: "Username not available" });
    }

    bcrypt.genSalt(Number(process.env.SALT_ROUNDS), (err, salt) => {
      if (err) {
        throw err;
      }
      bcrypt.hash(password, salt, async (err, hashedPassword) => {
        if (err) {
          throw err;
        }
        try {
          await prisma.user.create({
            data: { email, username, password: hashedPassword },
          });
        } catch (err) {
          next(err);
        }
      });
    });

    next();
  }),
  (req, res) => {
    return res.status(201).send({ status: "success" });
  },
];
