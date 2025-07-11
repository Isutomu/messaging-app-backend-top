// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");

// Local Modules
const { PrismaClient } = require("../../generated/client");
const { sanitizeHTML } = require("../helpers/sanitizeHTML");

// Constants
const prisma = new PrismaClient();

module.exports.postMessage = expressAsyncHandler(async (req, res) => {
  const { message } = req.body;
  const { username } = req.user;
  const receiver = req.params.username;

  const sanitizedMessage = sanitizeHTML(message);

  try {
    await prisma.message.create({
      data: {
        content: sanitizedMessage,
        receiver: { connect: { username: receiver } },
        sender: { connect: { username } },
      },
    });
  } catch {
    return res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }

  return res.status(201).send({ status: "success" });
});
