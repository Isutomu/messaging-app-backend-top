// 3rd Party Modules
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Local Modules
const { PrismaClient } = require("../generated/client");

// Constants
const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

const authStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: { username },
    });
    if (!user) {
      return done({ status: 401, message: "Username not found" }, false);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done({ status: 401, message: "Incorrect password" }, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

passport.use(authStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
