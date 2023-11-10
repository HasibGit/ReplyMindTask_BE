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

module.exports = {
  signup,
  login,
  getUserById,
};
