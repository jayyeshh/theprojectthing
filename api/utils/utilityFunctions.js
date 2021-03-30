import validator from "validator";
import jwt from "jsonwebtoken";
const { Company, Developer } = require("../models/index");

export const trimValues = (obj) => {
  Object.keys(obj).forEach((key) => {
    obj[key] = obj[key].trim();
  });
  return obj;
};

export const validatePassword = (value) => {
  if (value.toLowerCase().includes("password")) {
    return {
      status: "invalid",
      error:
        "Password must not contain 'password' word, choose strong password!",
    };
  }
  const options = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumber: 1,
    minSymbols: 1,
  };
  if (!validator.isStrongPassword(value, options)) {
    return {
      status: "invalid",
      error: "Choose strong password!",
    };
  }
  return {
    status: "valid",
  };
};

export const handlerRegistrationError = (error, res) => {
  if (error.name === "MongoError" && error.code === 11000) {
    return res.status(400).send({
      error:
        "user with same identity already exist! check username and email again!",
    });
  }
  if (error.name === "Password Invalidation") {
    return res.status(400).send({
      error: error.message,
    });
  }
  if (!error.errors) {
    return res.status(500).send({
      error: "Internal Server Error!",
    });
  }
  const { email, name, username, password } = error.errors;
  const resp = {};
  if (email) resp["email"] = email.message;
  if (name) resp["name"] = name.message;
  if (password) resp["password"] = password.message;
  if (username) resp["username"] = username.message;
  return res.status(400).send(resp);
};

export const isAuthedAsDeveloper = async (req) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id, as } = decode;
    console.log(_id);
    if (as === "Company") return false;
    const developer = await Developer.findOne({
      _id,
      "tokens.token": token,
    });
    if (!developer) return false;
    req.developer = user;
    req.token = token;
    return true;
  } catch (e) {
    res.sendStatus(500);
  }
};