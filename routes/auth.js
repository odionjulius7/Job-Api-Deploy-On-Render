const express = require("express");
const User = require("../models/User");

const { register, login } = require("../controllers/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
