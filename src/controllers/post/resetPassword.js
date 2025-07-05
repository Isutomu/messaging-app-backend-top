// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Local Modules
const { PrismaClient } = require("../../generated/client");

// Constants
const prisma = new PrismaClient();

module.exports.resetPassword = expressAsyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.query;

  let jwtPayload;
  try {
    jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res
      .status(401)
      .send({ status: "error", message: "Invalid reset password link" });
  }

  const user = await prisma.user.findFirst({ where: { id: jwtPayload.sub } });
  const userData = user?.data;
  if (!user || userData?.resetPasswordToken !== token) {
    return res
      .status(401)
      .send({ status: "error", message: "Invalid reset password link" });
  }

  let error;
  bcrypt.genSalt(Number(process.env.SALT_ROUNDS), function (err, salt) {
    if (err) {
      error = err;
    }
    bcrypt.hash(password, salt, async (err, hashedPassword) => {
      if (err) {
        error = err;
      }

      delete userData.resetPasswordToken;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          data: userData,
        },
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
});
