const express = require("express");
const User = require("../models/User");

const { register, login, getUser } = require("../controllers/auth");

const router = express.Router();

router.route("/user").get(getUser);
router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
