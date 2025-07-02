// 3rd Party Modules
const { validationResult } = require("express-validator");

// Local Modules
const passport = require("../../config/passport");
const {
  validateUsername,
  validatePassword,
} = require("../helpers/validateInput");

module.exports.login = [
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
  (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
      if (err?.status) {
        return res
          .status(err.status)
          .json({ status: "error", message: err.message });
      }
      if (err) {
        return next(err);
      }

      req.login(user, next);
    })(req, res, next);
  },
  (req, res) => {
    return res.status(200).send({});
  },
];
