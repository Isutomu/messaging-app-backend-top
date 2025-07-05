// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Local Modules
const { PrismaClient } = require("../../generated/client");

// Constants
const prisma = new PrismaClient();

// Auxiliary Methods
const sendLink = (token, email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ALERT_EMAIL_USER,
      pass: process.env.ALERT_EMAIL_PASSWORD,
    },
  });

  const mailData = {
    from: process.env.ALERT_EMAIL_USER,
    to: email,
    subject: "Reset Password Link",
    text: `This is the reset password link request. Please be advised that it's only valid for 15 minutes. ${process.env.APP_BASE_URL}/reset-password?token=${token}`,
    html: `<br>This is the reset password link request.</br><br>Please be advised that it's only valid for 15 minutes.</br><br>${process.env.APP_BASE_URL}/reset-password?token=${token}</br>`,
  };

  return transporter.sendMail(mailData);
};

module.exports.sendResetPasswordLink = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).send({ errors: "Email not found" });
  }

  const userData = user?.data;

  const opts = { expiresIn: 15 * 60 }; // 15 minutes to expire
  const payload = { sub: user.id, iat: Date.now() };
  const token = jwt.sign(payload, process.env.JWT_SECRET, opts);

  await sendLink(token, user.email);

  await prisma.user.update({
    where: { id: user.id },
    data: { data: { ...userData, resetPasswordToken: token } },
  });
  return res.status(200).send({ staus: "success" });
});
