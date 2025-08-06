// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");

// Local Modules
const { PrismaClient } = require("../../generated/client");

// Constants
const prisma = new PrismaClient();

module.exports.addFriend = expressAsyncHandler(async (req, res) => {
  const { username } = req.params;

  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        friends: { connect: { username } },
        friendOf: { connect: { username } },
      },
    });
    await prisma.chat.create({
      data: {
        users: {
          connect: [{ id: req.user.id }, { username }],
        },
      },
    });
  } catch {
    return res.status(500).send({
      status: "error",
      message: "Internal Server Error",
    });
  }

  return res.status(200).send({ status: "success" });
});
