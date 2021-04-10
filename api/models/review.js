import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    by: {
      type: mongoose.Types.ObjectId,
      ref: "Developer",
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);
