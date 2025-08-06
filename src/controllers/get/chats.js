// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");

// Local Modules
const { PrismaClient } = require("../../generated/client");

// Constants
const prisma = new PrismaClient();

module.exports.chats = expressAsyncHandler(async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: req.user.id },
    include: { chats: { include: { users: { select: { username: true } } } } },
  });

  const chats = user.chats.map((chat) => {
    const friend =
      !chat.group &&
      chat.users.filter((user) => user.username !== req.user.username)[0];
    return {
      id: chat.id,
      group: chat.group,
      name: chat.name || friend.username,
    };
  });

  return res.status(200).send({ status: "success", data: { chats } });
});
