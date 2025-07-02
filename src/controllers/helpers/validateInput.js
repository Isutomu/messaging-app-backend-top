// 3rd Party Modules
const { body } = require("express-validator");

module.exports.validateUsername = body("username")
  .notEmpty()
  .isAlphanumeric()
  .isLength({ min: 3, max: 20 });

module.exports.validatePassword = body("password").notEmpty().isLength({
  min: 6,
  max: 30,
});

module.exports.validateEmail = body("email")
  .notEmpty()
  .isLength({ max: 50 })
  .isEmail();
