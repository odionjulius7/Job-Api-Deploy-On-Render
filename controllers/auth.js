const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcrypt");
// const passwordGenerator = require("password-generator"); // generated fakePassword

const getUser = (req, res) => {
  res.send("hi here");
};

// REGISTER
const register = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.json({ msg: "user already existed" });
  }

  const user = await User.create({ ...req.body });
  // note: when we create(), mongose genearte a method to get the properties in the model

  const token = user.createJWT();
  // the token we created in the model to genrate token when we register and as well the method to get it through d model

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please, provide email and password");
  }

  // first find the user with email, to know if it exist 1st
  const user = await User.findOne({ email });

  // check if user exist
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password); // we wait for it to compare
  console.log(isPasswordCorrect);
  // check if matches that of the user gotten user gotten
  if (isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials (invalid password)");
  }

  const token = user.createJWT(); // us tha mongoose method to get the token with props

  res.status(StatusCodes.OK).json({
    user: { name: user.name, email: user.email, id: user._id },
    token,
  });
};

module.exports = { register, login, getUser };

// we can hash the password in our control or we use the mongoose middleware for that in the model
// const register = async (req, res) => {
//   const { name, email, password } = req.body;

//   const salt = await bcrypt.genSalt(10); // the number of rounds of byte of the hashed password should be(10 is a default)

//   const hashedPassword = await bcrypt.hash(password, salt);

//   const tempUser = { name, email, password: hashedPassword };

//   const user = await User.create({ ...tempUser });
//   res.status(StatusCodes.CREATED).json({ user });
// res
// .status(StatusCodes.CREATED)
// .json({ user: { name: user.getName() }, token }); // or use mongoose property getter method frm schema;
// .json({ user: { name: user.name, id: user._id }, token });
// };

// Generate password for users as admin
// const register = async (req, res) => {
//   const { name, email } = req.body;
//   const password = passwordGenerator(12, false);

//   const salt = await bcrypt.genSalt(10); // the number of rounds of byte of the hashed password should be(10 is a default)

//   // const hashedPassword = await bcrypt.hash(password, salt);

//   const tempUser = { name, email, password };
//   // const tempUser = { name, email, password: hashedPassword};

//   const user = await User.create({ ...tempUser });
//   res.status(StatusCodes.CREATED).json({ user });
// };
