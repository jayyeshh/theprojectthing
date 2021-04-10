import mongoose from "mongoose";
import { Company } from ".";
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    interested: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Developer",
      },
    ],
    author: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: true
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre("remove", async function (next) {
  await Company.updateOne({ _id: this.author }, { $pull: { posts: this._id } });
  next();
});

export default mongoose.model("Post", postSchema);
