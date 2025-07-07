// 3rd Party Modules
const bcrypt = require("bcryptjs");

// Local Modules
const { friendUserLogin1, friendUserLogin2 } = require("../data/user");

module.exports.addFriends = async (prisma) => {
  for (const user of [friendUserLogin1, friendUserLogin2]) {
    bcrypt.genSalt(Number(process.env.SALT_ROUNDS), (err, salt) => {
      if (err) {
        throw err;
      }
      bcrypt.hash(user.password, salt, async (err, hashedPassword) => {
        if (err) {
          throw err;
        }
        const createdUser = await prisma.user.create({
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            password: hashedPassword,
            friends: { connect: { id: user.friendId } },
            friendOf: { connect: { id: user.friendId } },
          },
        });
      });
    });
  }
};
