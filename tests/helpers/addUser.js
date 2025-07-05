// 3rd Party Modules
const bcrypt = require("bcryptjs");

// Local Modules
const { userLogin } = require("../data/user");

module.exports.addUser = async (prisma) => {
  bcrypt.genSalt(Number(process.env.SALT_ROUNDS), (err, salt) => {
    if (err) {
      throw err;
    }
    bcrypt.hash(userLogin.password, salt, async (err, hashedPassword) => {
      if (err) {
        throw err;
      }
      const user = await prisma.user.create({
        data: {
          ...userLogin,
          password: hashedPassword,
        },
      });
    });
  });
};
