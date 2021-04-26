import { CompanyModel, DeveloperModel } from "../models";
import bcrypt from "bcryptjs";

export const findByCredentials = async (username, password, as) => {
  let user;
  if (as === "Developer") user = await DeveloperModel.findOne({ username });
  if (as === "Company") user = await CompanyModel.findOne({ username });
  if (!user) throw new Error("Unable to login!");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login!");
  return user;
};
