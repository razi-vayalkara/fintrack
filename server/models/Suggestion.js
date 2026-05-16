import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    useCount: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

suggestionSchema.index({ user: 1, text: 1 }, { unique: true });

export default mongoose.model("Suggestion", suggestionSchema);
