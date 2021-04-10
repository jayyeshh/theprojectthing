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
      refPath: "onModel",
      required: true,
    },
    onModel: {
      type: String,
      enum: ["Developer", "Company"],
      required: true,
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
