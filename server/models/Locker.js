import mongoose from "mongoose";

const movementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    note: {
      type: String,
      trim: true,
      default: ""
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const lockerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    note: {
      type: String,
      trim: true,
      default: ""
    },
    movements: {
      type: [movementSchema],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Locker", lockerSchema);
