import express from "express";
import validator from "validator";
import { Developer } from "../models/index";
import auth from "../middlewares/auth";
import {
  handlerRegistrationError,
  trimValues,
} from "../utils/utilityFunctions";

const router = new express.Router();

//Authentication routes:
router.post("/register", async (req, res) => {
  req.body = trimValues(req.body);
  let { username, name, email, password } = req.body;
  if (!username || !email || !password || !name) {
    return res.status(400).send({
      error: "Required fields must be filled for registration!",
    });
  }
  const developer = new Developer({
    username,
    email,
    password,
    name,
  });
  try {
    await developer.save();
    res.status(201).send();
  } catch (error) {
    return handlerRegistrationError(error, res);
  }
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).send({
      error: "Identifier and password are needed for login!",
    });
  }
  let developer;
  try {
    if (validator.isEmail(identifier)) {
      developer = await Developer.findByCredentials({
        email: identifier,
        password: password,
      });
    } else {
      developer = await Developer.findByCredentials({
        username: identifier,
        password: password,
      });
    }
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
  if (!developer) {
    res.status(404).send({
      error: "Bad Credentials",
    });
  }
  try {
    const token = await developer.generateAuthToken();
    // res.cookie("token", token, { httpOnly: true });
    res.json({
      developer,
      token,
    });
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error!",
    });
  }
});

router.post("/logout", auth, async (req, res) => {
  const { token, user } = req;
  try {
    const tokens = user.tokens.filter((_token) => _token.token !== token);
    await user.updateOne({ $set: { tokens } });
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/logoutall", auth, async (req, res) => {
  const { user } = req;
  try {
    await user.updateOne({ $set: { tokens: [] } });
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

//get authenticated developer profile
router.get("/", auth, async (req, res) => {
  try {
    res.send({
      profile: req.user,
    });
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error!",
    });
  }
});

//get developer by id
router.get("/:id", async (req, res) => {
  try {
    const developer = await Developer.findOne({ _id: req.params.id });
    if (!developer) {
      return res.status(404).send({
        error: "Not Found! Invalid Id!",
      });
    }
    res.send(developer);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({
        error: "Invalid Id!",
      });
    }
    res.status(500).send({
      error: "Internal Server Error!",
    });
  }
});

router.patch("/", auth, async (req, res) => {
  req.body = trimValues(req.body);
  let {
    username = req.user.username,
    name = req.user.name,
    email = req.user.email,
    password = req.user.password,
    github = req.user.websites.github,
    website = req.user.websites.website,
    portfolio = req.user.websites.portfolio,
    linkedIn = req.user.websites.linkedIn,
  } = req.body;
  try {
    const websites = {
      github,
      website,
      portfolio,
      linkedIn,
    };
    const updates = {
      username,
      name,
      email,
      password,
      websites,
    };
    await req.user.updateOne({ ...updates });
    const updatedProfile = await Developer.findOne({
      _id: req.user._id,
    });
    res.status(200).send({
      profile: updatedProfile,
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      res.status(400).send({
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
    res.status(400).send(resp);
  }
});

/*
expected routes:
/follow/:id
/unfollow/:id
/dashboard?sort => show project of following developer
*/

export default router;
