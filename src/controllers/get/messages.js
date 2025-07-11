// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");

// Local Modules
const { PrismaClient } = require("../../generated/client");

// Constants
const prisma = new PrismaClient();
const findMessages = async (sender, receiver) => {
  const messages = await prisma.message.findMany({
    where: {
      receiver: { username: receiver },
      sender: { username: sender },
    },
    select: { content: true, creationTime: true, id: true },
    orderBy: { creationTime: "asc" },
  });

  return messages.map((message) => ({
    content: message.content,
    creationTime: message.creationTime,
    sender,
  }));
};

module.exports.getMessages = expressAsyncHandler(async (req, res) => {
  const username = req.user.username;
  const friendUsername = req.params.username;

  const messagesSent = await findMessages(username, friendUsername);
  const messagesReceived = await findMessages(friendUsername, username);

  const messages = messagesSent
    .concat(messagesReceived)
    .sort((a, b) => a.creationTime - b.creationTime);

  return res.status(200).send({ status: "success", data: { messages } });
});
