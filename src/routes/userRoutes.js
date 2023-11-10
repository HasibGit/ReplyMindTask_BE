const express = require("express");
const { signup, login, getUserById } = require("../controllers/userController");
const auth = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.get("/getUserById/:id", auth, getUserById);

module.exports = userRouter;
