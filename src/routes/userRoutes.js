const express = require("express");
const {
  signup,
  login,
  getUserById,
  updateUser,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.get("/get-user-by-Id/:id", auth, getUserById);

userRouter.post("/update-user/:id", auth, updateUser);

module.exports = userRouter;
