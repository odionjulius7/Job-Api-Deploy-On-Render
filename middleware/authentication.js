const { UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  // check header for authorization existence
  const authHeader = req.headers.authorization;

  //   if not authHeader and if not AuthHearder value with starting with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Invalid");
    // res.json({ error: "Authentication Invalid" });
  }

  //   convert(split()) the Bearer and the main token into an array, an make use of the 2rd index[1]
  const token = authHeader.split(" ")[1];

  try {
    // get the user object from the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // u can use this to get the details of the user with the token
    // const user = User.findById(payload.userId).select("-password"); // select takes away the password that will be returned
    // req.user = user;
    // or use this
    req.user = { userId: payload.userId, name: payload.name }; //jwt.sign({ userId: this._id, name: this.name },
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = auth;
