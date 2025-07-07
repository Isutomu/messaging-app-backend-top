// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");

module.exports.isLogged = expressAsyncHandler(async (req, res, next) => {
  if (!req.user?.id) {
    return res
      .status(401)
      .send({ status: "error", message: "User not logged" });
  }
  next();
});
