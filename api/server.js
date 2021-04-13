import express from "express";
import mongoose, { isValidObjectId } from "mongoose";
require("./db/mongoose");
import developerRoutes from "./routes/developerRoutes";
import companyRoutes from "./routes/companyRoutes";
import projectRoutes from "./routes/projectRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import commentRoutes from "./routes/commentRoutes";
import auth from "./middlewares/auth";
import { Company, Developer, Post, Project } from "./models";
import authAsDev from "./middlewares/authAsDev";
import { isDev } from "./utils/utilityFunctions";
import cors from "cors";
import postRoutes from "./routes/postRoutes";
import bcrypt from "bcryptjs";
// import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors());
// app.use(cookieParser());
app.get("/profile", auth, async (req, res) => {
  let profile = req.user;
  if (req.as.toLowerCase() === "developer") {
    await profile.populate("projects").execPopulate();
    profile = profile.toObject();
    profile.followers = profile.followers.length;
    profile.following = profile.following.length;
  }
  if (req.as.toLowerCase() === "company") {
    await profile.populate("posts").execPopulate();
  }
  return res.send({ profile, as: req.as });
});

app.patch("/password", auth, async (req, res) => {
  let { oldPassword, newPassword } = req.body;
  const isMatch = await bcrypt.compare(oldPassword, req.user.password);
  if (!isMatch)
    return res.status(400).send({ oldPassword: "Incorrect Password!" });
  try {
    await req.user.updateOne({ password: newPassword });
    await req.user.updateOne({ $set: { tokens: [] } });
    return res.send();
  } catch (error) {
    if (error.name === "Password Invalidation") {
      return res
        .status(400)
        .send({ newPassword: true, message: error.message });
    }
    return res.sendStatus(500);
  }
});

app.get("/search", async (req, res) => {
  const { query } = req.query;
  const queryArray = query.split(/[_\s.]/);
  const expr = "(" + queryArray.join("|") + ")";
  let resp = [];
  const devs = await Developer.find({
    username: { $regex: expr },
  });
  const companies = await Company.find({
    username: { $regex: expr },
  });
  const projects = await Project.find({
    title: { $regex: expr },
  });
  resp = resp.concat(devs, companies, projects);
  res.send(resp);
});

app.get("/stats", async (req, res) => {
  try {
    const totalCompanies = await Company.find({}).count();
    const totalDevelopers = await Developer.find({}).count();
    res.send({
      totalCompanies,
      totalDevelopers,
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/home", auth, async (req, res) => {
  try {
    if (req.as.toLowerCase() === "developer") {
      await req.user.populate("following").execPopulate();
      const followings = req.user.following;
      let projects = [];
      followings.forEach((user) => (projects = projects.concat(user.projects)));
      // const fetchedProjects = await Project.find({
      //   _id: { $in: projects },
      // }).populate('developer').sort("-createdAt");
      const fetchedProjects = await Project.aggregate([
        {
          $match: {
            _id: { $in: projects },
          },
        },
        {
          $lookup: {
            from: "developers",
            localField: "developer",
            foreignField: "_id",
            as: "developer",
          },
        },
        {
          $unwind: "$developer",
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
        {
          $addFields: {
            upvoted: {
              $in: [
                mongoose.Types.ObjectId(req.user._id.toString()),
                "$upvotes",
              ],
            },
            downvoted: {
              $in: [
                mongoose.Types.ObjectId(req.user._id.toString()),
                "$downvotes",
              ],
            },
            upvotes: { $size: "$upvotes" },
            downvotes: { $size: "$downvotes" },
          },
        },
      ]);
      res.send(fetchedProjects);
    }
    if (req.as.toLowerCase() === "company") {
      res.send([]);
    }
  } catch (error) {
    res.sendStatus(500);
  }
  res.send();
});

app.get("/devs", async (req, res) => {
  try {
    let devs = await Developer.find({});
    const isDeveloper = await isDev(req);
    if (isDeveloper) {
      devs = devs.map((dev) => {
        dev = dev.toObject();
        dev.follows = dev.followers.some(
          (follower) => follower.toString() === req.developer._id.toString()
        );
        return dev;
      });
    }
    res.send(devs);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find({});
    res.send(projects);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find({});
    res.send(companies);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/follow/:uid", authAsDev, async (req, res) => {
  const { uid } = req.params;
  if (!mongoose.Types.ObjectId.isValid(uid)) {
    return res.status(400).send({
      error: "Invalid user id",
    });
  }
  if (uid.toString() === req.developer._id.toString()) {
    return res.status(400).send({
      error: "Invalid Operation!",
    });
  }
  const developerToFollow = await Developer.findById(uid);
  if (!developerToFollow)
    return res.status(404).send({
      error: "Developer Not Found",
    });
  const alreadyFollows = developerToFollow.followers.some(
    (devid) => devid.toString() === req.developer._id.toString()
  );
  if (alreadyFollows)
    return res.status(400).send({
      error: "You already follow this developer!",
    });
  try {
    await developerToFollow.updateOne({
      $addToSet: { followers: req.developer._id },
    });
    await req.developer.updateOne({
      $addToSet: { following: developerToFollow._id },
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/unfollow/:uid", authAsDev, async (req, res) => {
  const { uid } = req.params;
  if (!mongoose.Types.ObjectId.isValid(uid)) {
    return res.status(400).send({
      error: "Invalid user id",
    });
  }
  if (uid.toString() === req.developer._id.toString()) {
    return res.status(400).send({
      error: "Invalid Operation!",
    });
  }
  const developerToUnfollow = await Developer.findById(uid);
  if (!developerToUnfollow)
    return res.status(404).send({
      error: "Developer Not Found",
    });
  const doesNotFollow = developerToUnfollow.followers.some(
    (devid) => devid.toString() === req.developer._id.toString()
  );
  if (!doesNotFollow)
    return res.status(400).send({
      error: "Developer not in following list.",
    });
  try {
    await developerToUnfollow.updateOne({
      $pull: { followers: req.developer._id },
    });
    await req.developer.updateOne({
      $pull: { following: developerToUnfollow._id },
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.use("/developer", developerRoutes);
app.use("/company", companyRoutes);
app.use("/project", projectRoutes);
app.use("/post", postRoutes);
app.use("/review", reviewRoutes);
app.use("/comment", commentRoutes);
app.use((err, req, res, next) => {
  //to check if request is in valid JSON format or not
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.sendStatus(400); // Bad request
  }
  next();
});

app.get("*", (req, res) => {
  res.status(404).send({
    error: "Endpoint does not exist!",
  });
});

mongoose.connection.on("open", () => {
  console.log("database connected!");
});

mongoose.connection.on("error", (err) => {
  console.log("Database connection error: ", err);
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is running on port: ${process.env.PORT}`);
});
