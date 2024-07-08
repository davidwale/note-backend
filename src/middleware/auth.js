const jwt = require("jsonwebtoken");

const JWT_SECRET = "fkgfdkfogd{}234jgkmmmmmkdjgfgfncddjsasqw87";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.email;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;