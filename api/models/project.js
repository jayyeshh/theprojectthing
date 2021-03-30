import mongoose from "mongoose";
import { CommentModel, DeveloperModel } from ".";
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    developer: {
      type: mongoose.Types.ObjectId,
      ref: "Developer",
    },
    upvotes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Developer",
      },
    ],
    downvotes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Developer",
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
    links: {
      github: {
        type: String,
      },
      site: {
        type: String,
      },
    },
    viewedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Company",
      },
    ],
  },
  {
    timestamps: true,
  }
);

projectSchema.pre("remove", async function (next) {
  await CommentModel.deleteMany({ by: this._id });
  next();
});

export default mongoose.model("Project", projectSchema);
