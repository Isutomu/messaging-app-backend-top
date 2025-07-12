// 3rd Party Modules
const expressAsyncHandler = require("express-async-handler");

// Local Modules
const { PrismaClient } = require("../../generated/client");

// Constants
const prisma = new PrismaClient();

module.exports.search = expressAsyncHandler(async (req, res) => {
  const searchTerm = req.query["search_term"];
  const searchResults = await prisma.user.findMany({
    where: {
      username: {
        contains: searchTerm,
        mode: "insensitive",
        not: req.user.username,
      },
    },
    select: { username: true, friends: { select: { id: true } } },
  });

  const response =
    searchResults &&
    searchResults.map((result) => ({
      username: result.username,
      friend: !!result.friends.find((friend) => friend.id === req.user.id),
    }));

  return res
    .status(200)
    .send({ status: "success", data: { searchResults: response } });
});
