// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");

// Local Modules
const { PrismaClient } = require("../../generated/client");

// Constants
const prisma = new PrismaClient();

module.exports.getMessages = expressAsyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const chat = await prisma.chat.findFirst({
    where: { id: chatId },
    include: {
      messages: {
        orderBy: { creationTime: "asc" },
        include: { sender: { select: { username: true } } },
      },
      users: true,
    },
  });

  const chatName = chat.group
    ? chat.name
    : chat.users.filter((user) => user.username !== req.user.username)[0]
        .username;
  const messages = chat.messages.map((message) => ({
    id: message.id,
    content: message.content,
    sender: message.sender.username,
  }));

  return res.status(200).send({
    status: "success",
    data: { chat: { name: chatName, messages: messages } },
  });
});
