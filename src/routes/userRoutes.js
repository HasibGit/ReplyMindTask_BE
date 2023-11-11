const express = require("express");
const {
  signup,
  login,
  getUserById,
  updateUser,
  deleteUser,
  logout,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.get("/get-user-by-Id/:id", auth, getUserById);

userRouter.put("/update-user/:id", auth, updateUser);

userRouter.delete("/delete-user/:id", auth, deleteUser);

userRouter.post("/logout", auth, logout);

module.exports = userRouter;
