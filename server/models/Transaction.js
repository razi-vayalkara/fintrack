import mongoose from "mongoose";

export const CATEGORIES = [
  "Food",
  "Rent",
  "Transport",
  "Entertainment",
  "Health",
  "Shopping",
  "Salary",
  "Freelance",
  "Other"
];

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "Other"
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
