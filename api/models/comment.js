import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    by: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment", commentSchema);
