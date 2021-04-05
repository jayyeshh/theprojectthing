import mongoose from "mongoose";
const Schema = mongoose.Schema;
import validator from "validator";
import bcrypt from "bcryptjs";
import { Developer } from ".";
import jwt from "jsonwebtoken";
import { validatePassword } from "../utils/utilityFunctions";

const developerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.matches(value, "^[a-zA-Z0-9_.-]*$")) {
          throw new Error("Invalid username");
        }
      },
    },
    name: {
      type: String,
      required: true,
    },
    avatar: Buffer,
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Invalid Email Address!");
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    projects: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Project",
      },
    ],
    websites: {
      github: {
        type: String,
      },
      website: {
        type: String,
      },
      portfolio: {
        type: String,
      },
      linkedIn: {
        type: String,
      },
    },
    followers: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

developerSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id.toString(),
      as: "Developer",
    },
    process.env.JWT_SECRET
  );
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

developerSchema.pre("save", async function (next) {
  const developer = this;

  if (developer.isModified("password")) {
    const isValid = validatePassword(developer.password);
    if (isValid.status === "invalid") {
      const err = new Error();
      err.message = isValid.error;
      err.name = "Password Invalidation";
      throw err;
    }
    developer.password = await bcrypt.hash(developer.password, 8);
  }
  next();
});

developerSchema.pre("updateOne", async function (next) {
  const developer = this;

  if (developer._update.password) {
    const isValid = validatePassword(developer._update.password);
    if (isValid.status === "invalid") {
      const err = new Error();
      err.message = isValid.error;
      err.name = "Password Invalidation";
      throw err;
    }
    developer._update.password = await bcrypt.hash(
      developer._update.password,
      8
    );
  }
  next();
});

developerSchema.pre("remove", async function (next) {
  await CommentModel.deleteMany({ by: this._id });
  await ProjectModel.deleteMany({ developer: this._id });
  next();
});

developerSchema.statics.findByCredentials = async ({
  email,
  username,
  password,
}) => {
  let developer;
  if (username) {
    developer = await Developer.findOne({ username });
  } else if (email) {
    developer = await Developer.findOne({ email });
  } else {
    throw new Error("use email/username to login!");
  }
  if (!developer) throw new Error("Bad Credentials!");
  const isMatch = await bcrypt.compare(password, developer.password);
  if (!isMatch) throw new Error("Bad Credentials!");
  return developer;
};

developerSchema.methods.toJSON = function () {
  const developer = this.toObject();
  delete developer.password;
  delete developer.tokens;
  delete developer.updatedAt;
  delete developer.createdAt;
  return developer;
};

export default mongoose.model("Developer", developerSchema);
