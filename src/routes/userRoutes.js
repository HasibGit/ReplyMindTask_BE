const express = require("express");
const userRouter = express.Router();

userRouter.post("/signup", (req, res) => {
  res.send("signup");
});

userRouter.post("/login", (req, res) => {
  res.send("login");
});

module.exports = userRouter;
