import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR", "GBP"],
      default: "INR"
    },
    density: {
      type: String,
      enum: ["comfortable", "compact"],
      default: "comfortable"
    },
    defaultCategory: {
      type: String,
      default: "Food"
    },
    monthStartDay: {
      type: Number,
      min: 1,
      max: 28,
      default: 1
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    settings: {
      type: settingsSchema,
      default: () => ({})
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    settings: this.settings
  };
};

export default mongoose.model("User", userSchema);
