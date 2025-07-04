// 3rd Party Modules
const { Router } = require("express");

// Local Modules
const { login } = require("../controllers/post/login");
const { verifySession } = require("../controllers/get/verifySession");
const { signup } = require("../controllers/post/signup");

// Initialization
const router = Router();

// Requests
//--- UNPROTECTED ROUTES ---//
router.get("/verify-session", verifySession);
router.post("/login", login);
router.post("/signup", signup);

//--- PROTECTED ROUTES ---//

module.exports = router;
