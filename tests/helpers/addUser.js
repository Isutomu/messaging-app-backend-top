// 3rd Party Modules
const bcrypt = require("bcryptjs");

// Local Modules
const { user } = require("../data/user");

module.exports.addUser = async (prisma) => {
  bcrypt.genSalt(Number(process.env.SALT_ROUNDS), (err, salt) => {
    if (err) {
      throw err;
    }
    bcrypt.hash(user.password, salt, async (err, hashedPassword) => {
      if (err) {
        throw err;
      }
      await prisma.user.create({
        data: { ...user, password: hashedPassword },
      });
    });
  });
};
