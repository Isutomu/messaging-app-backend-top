// 3rd Party Modules
const { Router } = require("express");

// Local Modules
const { login } = require("../controllers/post/login");
const { verifySession } = require("../controllers/get/verifySession");
const { signup } = require("../controllers/post/signup");
const {
  sendResetPasswordLink,
} = require("../controllers/post/sendResetPasswordLink");
const { resetPassword } = require("../controllers/post/resetPassword");
const { isLogged } = require("../middlewares/isLogged");
const { friends } = require("../controllers/get/friends");
const { getMessages } = require("../controllers/get/messages");
const { postMessage } = require("../controllers/post/messages");
const { changeEmail } = require("../controllers/post/email");
const { changeUsername } = require("../controllers/post/username");
const { changePassword } = require("../controllers/post/password");

// Initialization
const router = Router();

// Requests
//--- UNPROTECTED ROUTES ---//
router.get("/verify-session", verifySession);
router.post("/login", login);
router.post("/signup", signup);
router.post("/send-reset-password-link", sendResetPasswordLink);
router.post("/reset-password", resetPassword);

//--- PROTECTED ROUTES ---//
router.use(isLogged);
router.get("/friends", friends);
router.get("/messages/:username", getMessages);
router.post("/messages/:username", postMessage);
router.post("/settings/email", changeEmail);
router.post("/settings/username", changeUsername);
router.post("/settings/password", changePassword);

module.exports = router;
