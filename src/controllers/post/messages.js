// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

// Local Modules
const { PrismaClient } = require("../../generated/client");
const { sanitizeHTML } = require("../helpers/sanitizeHTML");
const { validateMessage } = require("../helpers/validateInput");

// Constants
const prisma = new PrismaClient();

module.exports.postMessage = [
  validateMessage,
  (req, res, next) => {
    // These errors can only occur if the API was directly called
    // because the frontend would not allow them.
    // Hence why I'm sending a generic error as response.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({
        status: "error",
        message: "Can't send an empty message",
      });
    }
    next();
  },
  expressAsyncHandler(async (req, res) => {
    const { message } = req.body;
    const senderId = req.user.id;
    const chatId = req.params.chatId;

    const sanitizedMessage = sanitizeHTML(message);
    let createdMessage;
    try {
      createdMessage = await prisma.message.create({
        data: {
          content: sanitizedMessage,
          senderId,
          chatId,
        },
        include: { sender: true },
      });
    } catch {
      return res.status(500).send({
        status: "error",
        message: "Internal Server Error",
      });
    }

    return res.status(201).send({
      status: "success",
      message: {
        id: createdMessage.id,
        content: createdMessage.content,
        sender: createdMessage.sender.username,
      },
    });
  }),
];
