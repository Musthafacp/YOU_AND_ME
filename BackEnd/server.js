const cors = require("cors");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require('cookie-parser')
const { createServer } = require("http");

const setupSocket = require("./socketio");
const connectDB = require("./config/connect");
const userrouter = require("./Routes/user");
const chatrouter = require("./Routes/chat");
const authrouter = require("./GoogleAuth/auth");
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
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "https://you-and-me-lake.vercel.app",
    credentials: true,
  })
);

setupSocket(server);

app.use("/users", userrouter);
app.use("/chat", chatrouter);
app.use("/auth", authrouter);

server.listen(port, () => {
  console.log(`Server is running on https://you-and-me-build.vercel.app`);
});
