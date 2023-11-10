const jwt = require("jsonwebtoken");
const SECRET_KEY = "REPLYMIND";

const auth = (req, res, next) => {
  try {
    let token = req?.headers?.authorization;

    if (token) {
      token = token.split(" ")[0];
      let user = jwt.verify(token, SECRET_KEY);
      req.userId = user.id;
    } else {
      res.status(401).json({ message: "Unauthorized user" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized user" });
  }
};

module.exports = auth;
