const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = "REPLYMIND";

const signup = async (req, res) => {
  try {
    const {
      Salutation,
      FirstName,
      LastName,
      Email,
      Password,
      ConfirmPassword,
      DateOfBirth,
      StreetAddress,
      City,
      PostalCode,
      Country,
      WorkExperienceInYears,
      Profession,
      AreasOfExpertise,
      Bio,
    } = req.body;

    const result = await userModel.create({
      Salutation,
      FirstName,
      LastName,
      Email,
      Password,
      ConfirmPassword,
      DateOfBirth,
      StreetAddress,
      City,
      PostalCode,
      Country,
      WorkExperienceInYears,
      Profession,
      AreasOfExpertise,
      Bio,
    });

    const expiresIn = 3600; // in seconds
    const token = jwt.sign(
      { id: result._id, email: result.Email },
      SECRET_KEY,
      { expiresIn }
    );

    res.status(201).json({
      token: token,
      userId: result._id,
      email: result.Email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const login = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const existingUser = await userModel.findOne({ Email: Email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, existingUser.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const expiresIn = 3600;
    const token = jwt.sign({ id: existingUser._id, email: Email }, SECRET_KEY, {
      expiresIn,
    });

    res.status(200).json({
      token: token,
      userId: existingUser._id,
      email: existingUser.Email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const getUserById = async (req, res) => {
  try {
    if (req.params.id !== req.userId) {
      res.status(404).json({ message: "No data found" });
    }

    const userData = await userModel.findById(req.params.id);

    if (!userData) {
      res.status(404).json({ message: "No data found" });
    }
    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.params.id !== req.userId) {
      res.status(400).json({ message: "Bad request" });
    }

    const updatedUserData = req.body;

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.userId },
      { $set: updatedUserData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const expiresIn = 3600; // in seconds
    const token = jwt.sign(
      { id: updatedUser._id, email: updatedUser.Email },
      SECRET_KEY,
      { expiresIn }
    );

    res.status(200).json({
      token: token,
      userId: updatedUser._id,
      email: updatedUser.Email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.params.id !== req.userId) {
      res.status(400).json({ message: "Bad request" });
      return;
    }

    const deletedUser = await userModel.findOneAndDelete({ _id: req.userId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

module.exports = {
  signup,
  login,
  getUserById,
  updateUser,
  deleteUser,
  logout,
};
