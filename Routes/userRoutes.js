const express = require('express');
const { registerUser } = require('../Controllers/userController');
const { authUser } = require('../Controllers/userController');
const { allUsers } = require('../Controllers/userController');
const { protect } = require('../Middlewares/authMiddleware');
const router = express.Router();

router.route("/").post(registerUser).get( protect ,allUsers);
router.post("/login", authUser);


module.exports = router;