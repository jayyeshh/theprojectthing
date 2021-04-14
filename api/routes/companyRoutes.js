import express from "express";
import validator from "validator";
import { Company } from "../models/index";
import auth from "../middlewares/auth";
import {
  trimValues,
  handlerRegistrationError,
} from "../utils/utilityFunctions";

const router = new express.Router();

//Authentication routes:
//company registration(sign up)
router.post("/register", async (req, res) => {
  req.body = trimValues(req.body);
  let { username, name, email, password } = req.body;
  if (!username || !email || !password || !name) {
    return res.status(400).send({
      error: "Required fields must be filled for registration!",
    });
  }
  const usernameExpr = new RegExp(
    /^(?=.{1,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
    "i"
  );
  if (!usernameExpr.test(username))
    return res.status(400).send({ error: "Invalid Username String!" });
  const company = new Company({
    username,
    email,
    password,
    name,
  });
  try {
    await company.save();
    res.status(201).send();
  } catch (error) {
    return handlerRegistrationError(error, res);
  }
});

//company sign in
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).send({
      error: "Identifier and password are needed for login!",
    });
  }
  let company;
  try {
    if (validator.isEmail(identifier)) {
      company = await Company.findByCredentials({
        email: identifier,
        password: password,
      });
    } else {
      company = await Company.findByCredentials({
        username: identifier,
        password: password,
      });
    }
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
  if (!company) {
    res.status(404).send({
      error: "Bad Credentials",
    });
  }
  try {
    const token = await company.generateAuthToken();
    await company.populate("posts").execPopulate();
    res.send({
      company,
      token,
    });
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error!",
    });
  }
});

//logout from current session
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

//logout from all devices user is logged in from
router.post("/logoutall", auth, async (req, res) => {
  const { user } = req;
  try {
    await user.updateOne({ $set: { tokens: [] } });
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

//get authenticated company profile
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

//get company by id
router.get("/:id", async (req, res) => {
  try {
    let company = await Company.findOne({ _id: req.params.id })
      .populate({
        path: "posts",
        populate: [
          {
            path: "author",
          },
          {
            path: "interested",
          },
        ],
      })
      .populate({
        path: "reviews",
        populate: [
          {
            path: "by",
          },
          {
            path: "company",
          },
        ],
      });
    if (!company) {
      return res.status(404).send({
        error: "Not Found! Invalid Id!",
      });
    }
    company = company.toObject();
    delete company.saved;
    res.send(company);
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

//update company profile
router.patch("/", auth, async (req, res) => {
  req.body = trimValues(req.body);
  let {
    username = req.user.username,
    name = req.user.name,
    email = req.user.email,
    website = req.user.websites.website,
    linkedIn = req.user.websites.linkedIn,
  } = req.body;
  try {
    const websites = {
      website,
      linkedIn,
    };
    const updates = {
      username,
      name,
      email,
      websites,
    };
    await req.user.updateOne({ ...updates });
    const updatedProfile = await Company.findOne({
      _id: req.user._id,
    }).populate("posts");
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
    if (!error.errors) {
      return res.status(500).send({
        error: "Internal Server Error!",
      });
    }
    const { email, name, username } = error.errors;
    const resp = {};
    if (email) resp["email"] = email.message;
    if (name) resp["name"] = name.message;
    if (username) resp["username"] = username.message;
    res.status(400).send(resp);
  }
});

export default router;
