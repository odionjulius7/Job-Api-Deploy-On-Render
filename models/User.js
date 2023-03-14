const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    lowercase: true,
    minLength: 3,
    maxLength: 50,
  },

  email: {
    type: String,
    required: [true, "Please provide email"],
    lowercase: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
    unique: true,
  },

  password: {
    type: String,
    // required: [true, "Please provide name"],
    lowercase: true,
    minLength: 6,
  },
});

// using mongoose middleware to hashed the password and passing to the next() middleware
UserSchema.pre("save", async function (next) {
  // we used dis function() instead of arrow func  to be able to amke use of "this" keyword
  // to access any property of the UserSchema class
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hashSync(this.password, salt);

  next();
});

// mongoose method to create jwt token and separate concerrns(method frm controller to not suffocate it)
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};
// mongoose method to compare password before login is successful
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compareSync(candidatePassword, this.password); // compare the user password and password in the DB
  return isMatch;
};

// // mongoose method to get any property in the schema to when you want to return a value to the frontend
// UserSchema.methods.getName = function () {
//   // we used dis function() instead of arrow func  to be able to amke use of "this" keyword
//   // to access any property of the UserSchema class
//   return this.name;
// };

module.exports = mongoose.model("User", UserSchema);
