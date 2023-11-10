const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
  {
    Salutation: { type: String, required: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Email: {
      type: String,
      required: true,
      unique: true,
      validate: { validator: validateEmail, message: "Invalid email format" },
    },
    Password: {
      type: String,
      required: true,
      validate: {
        validator: validatePassword,
        message: "Invalid password format",
      },
    },
    ConfirmPassword: {
      type: String,
      required: true,
      validate: {
        validator: validateConfirmPassword,
        message: "Passwords do not match",
      },
    },
    DateOfBirth: { type: String, required: true },
    StreetAddress: { type: String, required: true },
    City: { type: String, required: true },
    PostalCode: { type: String, required: true },
    Country: { type: String, required: true },
    WorkExperienceInYears: { type: String, required: true },
    Profession: { type: String, required: true },
    AreasOfExpertise: { type: [String], required: true },
    Bio: {
      type: String,
      required: true,
      validate: {
        validator: validateMaxWords,
        message: "Bio exceeds maximum word limit",
      },
    },
  },
  { timestamps: true }
);

// Hash the password before saving to the database
UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("Password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.Password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.Password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);

// Custom Validator Functions
// Custom email validation function
function validateEmail(email) {
  // Use a regex or a more advanced email validation library here
  // For simplicity, a basic regex is used in this example
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}

// Custom password validation function
function validatePassword(password) {
  // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[\w!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;
  return passwordRegex.test(password);
}

// Custom confirmPassword validation function
function validateConfirmPassword(confirmPassword) {
  return confirmPassword === this.Password;
}

// Custom validator function for maximum words in Bio
function validateMaxWords(bio) {
  const maxWords = 50;
  const wordCount = bio.split(/\s+/).length;
  return wordCount <= maxWords;
}
