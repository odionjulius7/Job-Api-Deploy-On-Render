const express = require("express");
require("dotenv").config();
require("express-async-errors");

// Extra Security to secure the app

//helmet a middleware that helps secure your application by setting various HTTP headers.
// These headers provide an additional layer of protection against common security vulnerabilities like cross-site scripting (XSS)
const helmet = require("helmet");

const cors = require("cors"); // needed
const xss = require("xss-clean"); //
const rateLimiter = require("rate-limiter"); //

const app = express();

// connect DB
const connectDB = require("./db/connect");

// Authenticate user middleware
const authenticateUser = require("./middleware/authentication");

// Routes
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Use to limit repeated requests to public APIs and/or endpoints such as password reset
// app.set("trust proxy", 1); // always use w u host, for rateLimiter
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//     // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     // legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//   })
// );
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
