// 3rd Party Modules
const request = require("supertest");

// Local Modules
const { prisma, app } = require("../helpers/setupTests");
const routes = require("../../src/routes");
const { userLogin, userSignup } = require("../data/user");
const { cleanDatabase } = require("../helpers/cleanDatabase");
const { addUser } = require("../helpers/addUser");

//----------- SETTING UP TESTS -----------//
beforeAll(async () => {
  await cleanDatabase(prisma);
  await addUser(prisma);
});
afterAll(async () => {
  await cleanDatabase(prisma);
});

// Routes
app.use(routes);

//----------------- TESTS -----------------//
test("Login route", (done) => {
  request(app)
    .post("/login")
    .type("json")
    .send({ username: userLogin.username, password: userLogin.password })
    .expect("Content-type", /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        console.error(res.body);
      }
      done(err);
    });
});

test("Sign up route", (done) => {
  request(app)
    .post("/signup")
    .type("json")
    .send({
      email: userSignup.email,
      username: userSignup.username,
      password: userSignup.password,
    })
    .expect("Content-type", /json/)
    .expect(201)
    .end((err, res) => {
      if (err) {
        console.error(res.body);
      }
      done(err);
    });
});

test("Reset password route", (done) => {
  request(app)
    .post(
      "/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpZCIsImlhdCI6MTc1MTc0NTg2MzEyMSwiZXhwIjoxNzUxNzQ1OTcxMTIxfQ.ViHHsjiKbEWFZLZCtes8i__kv-VQvPPXf1peudPX99U",
    )
    .type("json")
    .send({
      password: "newPassword",
    })
    .expect("Content-type", /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        console.error(res.body);
      }
      done(err);
    });
});

test("Send reset password link route", (done) => {
  request(app)
    .post("/send-reset-password-link")
    .type("json")
    .send({
      email: userLogin.email,
    })
    .expect("Content-type", /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        console.error(res.body);
      }
      done(err);
    });
});
