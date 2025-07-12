// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");

module.exports.logout = expressAsyncHandler(async (req, res) => {
  req.logOut((err) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        message: err,
      });
    }
    return res.status(200).send({ status: "success" });
  });
});
