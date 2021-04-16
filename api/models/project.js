import mongoose from "mongoose";
import { CommentModel, DeveloperModel } from ".";
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    photo: {
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
    rewards: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Company",
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
        trim: true,
      },
      site: {
        type: String,
        trim: true,
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
