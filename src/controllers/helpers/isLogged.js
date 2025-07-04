module.exports.isLogged = (req, res, next) => {
  if (!req.user?.id) {
    return res
      .status(401)
      .send({ status: "error", message: "User not logged." });
  }
  next();
};
