// 3rd Party Modules
const { Router } = require("express");

// Local Modules
const { login } = require("../controllers/post/login");

// Initialization
const router = Router();

// Requests
//--- UNPROTECTED ROUTES ---//
router.post("/login", login);

//--- PROTECTED ROUTES ---//

module.exports = router;
