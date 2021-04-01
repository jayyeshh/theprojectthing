import mongoose from "mongoose";
import { Developer, Company } from "./index";
const Schema = mongoose.Schema;
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validatePassword } from "../utils/utilityFunctions";

const companySchema = new Schema(
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
    logo: Buffer,
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
    },
    websites: {
      website: {
        type: String,
      },
      linkedIn: {
        type: String,
      },
    },
    saved: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Project",
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

companySchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id.toString(),
      as: "Company",
    },
    process.env.JWT_SECRET
  );
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

companySchema.pre("save", async function (next) {
  const company = this;

  if (company.isModified("password")) {
    const isValid = validatePassword(company.password);
    if (isValid.status === "invalid") {
      const err = new Error();
      err.message = isValid.error;
      err.name = "Password Invalidation";
      throw err;
    }
    company.password = await bcrypt.hash(company.password, 8);
  }
  next();
});

companySchema.pre("updateOne", async function (next) {
  const company = this;

  if (company._update.password) {
    const isValid = validatePassword(company._update.password);
    if (isValid.status === "invalid") {
      const err = new Error();
      err.message = isValid.error;
      err.name = "Password Invalidation";
      throw err;
    }
    company._update.password = await bcrypt.hash(company._update.password, 8);
  }
  next();
});

companySchema.pre("remove", async function (next) {
  await Developer.updateMany({ $pull: { viewers: this._id } });
  next();
});

companySchema.statics.findByCredentials = async ({
  email,
  username,
  password,
}) => {
  let company;
  if (username) {
    company = await Company.findOne({ username });
  } else if (email) {
    company = await Company.findOne({ email });
  } else {
    throw new Error("use email/username to login!");
  }
  if (!company) throw new Error("Bad Credentials!");
  const isMatch = await bcrypt.compare(password, company.password);
  if (!isMatch) throw new Error("Bad Credentials!");
  return company;
};

companySchema.methods.toJSON = function () {
  const company = this.toObject();
  delete company.password;
  delete company.tokens;
  delete company.updatedAt;
  delete company.createdAt;
  return company;
};

export default mongoose.model("Company", companySchema);
