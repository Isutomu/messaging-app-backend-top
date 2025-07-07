// 3rd Party Modules
const request = require("supertest");

// Local Modules
const { prisma, app } = require("../helpers/setupTests");
const routes = require("../../src/routes");
const { userLogin } = require("../data/user");
const { cleanDatabase } = require("../helpers/cleanDatabase");
const { addUser } = require("../helpers/addUser");
const { addFriends } = require("../helpers/addFriends");

//----------- SETTING UP TESTS -----------//
beforeAll(async () => {
  await cleanDatabase(prisma);
  await addUser(prisma);

  // For route /user-friends
  await addFriends(prisma);
});
afterAll(async () => {
  await cleanDatabase(prisma);
});
const injectUser = (req, res, next) => {
  req.user = {};
  req.user.id = userLogin.id;
  next();
};

// Routes
app.use([injectUser, routes]);

//----------------- TESTS -----------------//
test("Get user friends route", (done) => {
  request(app)
    .get("/friends")
    .expect("Content-type", /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        console.error(res.body);
      }
      done(err);
    });
});
