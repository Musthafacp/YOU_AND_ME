const cors = require("cors");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const { createServer } = require("http");

const setupSocket = require("./socketio");
const connectDB = require("./config/connect");
const userrouter = require("./Routes/user");
const chatrouter = require("./Routes/chat");
const authrouter = require("./GoogleAuth/auth");
const cookieParser = require('cookie-parser')
const port = process.env.PORT;
const app = express();
const SESSION_SECRET = process.env.SESSION_SECRET;
connectDB();
require("dotenv").config();
require("./GoogleAuth/GoogleAuth");


const server = createServer(app);
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      // sameSite: "Lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    // origin: "http://localhost:5174",
    origin:"https://you-and-me-build.vercel.app",
    secure: false,
    credentials: true,
  })
);

setupSocket(server);

app.use("/users", userrouter);
app.use("/chat", chatrouter);
app.use("/auth", authrouter);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
