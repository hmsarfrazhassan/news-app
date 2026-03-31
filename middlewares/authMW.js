import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export default auth;
