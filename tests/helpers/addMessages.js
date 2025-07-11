// Local Modules
const { messages } = require("../data/message");

module.exports.addMessages = async (prisma) => {
  for (const message of messages) {
    await prisma.message.create({
      data: {
        content: message.message,
        sender: { connect: { username: message.sender } },
        receiver: { connect: { username: message.receiver } },
      },
    });
  }
};
