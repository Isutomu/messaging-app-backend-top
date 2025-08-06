// Local Modules
const { isLogged } = require("../helpers/isLogged");

module.exports.verifySession = [
  isLogged,
  (req, res) =>
    res
      .status(200)
      .send({ status: "success", data: { username: req.user.username } }),
];
