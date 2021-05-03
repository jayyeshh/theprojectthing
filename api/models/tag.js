import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  type: Array,
  default: [],
});

export default mongoose.model("Tag", tagSchema);
