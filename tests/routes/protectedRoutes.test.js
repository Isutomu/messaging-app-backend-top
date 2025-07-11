// 3rd Party Modules
const request = require("supertest");

// Local Modules
const { prisma, app } = require("../helpers/setupTests");
const routes = require("../../src/routes");
const { userLogin } = require("../data/user");
const { cleanDatabase } = require("../helpers/cleanDatabase");
const { addUser } = require("../helpers/addUser");
const { addFriends } = require("../helpers/addFriends");
const { messages } = require("../data/message");
const { addMessages } = require("../helpers/addMessages");

//----------- SETTING UP TESTS -----------//
beforeEach(async () => {
  await cleanDatabase(prisma);
  await addUser(prisma);

  // For route /user-friends
  await addFriends(prisma);
  // For route /messages/:username (GET)
  // await addMessages(prisma);
});
afterEach(async () => {
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

// test("Post normal chat message route", (done) => {
//   request(app)
//     .post(`/messages?username=${messages[0].sender}`)
//     .type("json")
//     .send({ message: messages[0].message })
//     .expect("Content-type", /json/)
//     .expect(201)
//     .end((err, res) => {
//       if (err) {
//         console.error(res.body);
//       }
//       done(err);
//     });
// });

// test("Get normal chat messages route", (done) => {
//   request(app)
//     .get(`/messages/${messages[0].sender}`)
//     .expect("Content-type", /json/)
//     .expect(200)
//     .end((err, res) => {
//       if (err) {
//         console.error(res.body);
//       }
//       done(err);
//     });
// });
