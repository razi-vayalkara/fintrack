import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_me");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    if (res.statusCode === 200) res.status(401);
    next(error);
  }
};

export default protect;
