import jwt from "jsonwebtoken";
import Locker from "../models/Locker.js";
import Suggestion from "../models/Suggestion.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "dev_secret_change_me", {
    expiresIn: "30d"
  });

const sendUser = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    token: createToken(user._id),
    user: user.toSafeObject()
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      throw new Error("Email is already registered");
    }

    const user = await User.create({ name, email, password });
    sendUser(res, user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    sendUser(res, user);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const updates = {
      ...req.user.settings.toObject(),
      ...req.body
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { settings: updates },
      { new: true, runValidators: true }
    );

    res.json({ user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Current password and new password are required");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters");
    }

    const user = await User.findById(req.user._id);

    if (!user || !(await user.matchPassword(currentPassword))) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed" });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await Promise.all([
      Transaction.deleteMany({ user: userId }),
      Suggestion.deleteMany({ user: userId }),
      Locker.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.json({ message: "Account deleted" });
  } catch (error) {
    next(error);
  }
};
