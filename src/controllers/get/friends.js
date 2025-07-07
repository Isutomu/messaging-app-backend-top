// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");

// Local Modules
const { PrismaClient } = require("../../generated/client");

// Constants
const prisma = new PrismaClient();

module.exports.friends = expressAsyncHandler(async (req, res) => {
  const friends = (
    await prisma.user.findFirst({
      where: { id: req.user.id },
      include: { friends: { select: { username: true } } },
    })
  ).friends;
  return res.status(200).send({ status: "success", data: { friends } });
});
