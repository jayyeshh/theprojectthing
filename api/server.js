import express from "express";
import mongoose, { isValidObjectId } from "mongoose";
require("./db/mongoose");
import developerRoutes from "./routes/developerRoutes";
import companyRoutes from "./routes/companyRoutes";
import projectRoutes from "./routes/projectRoutes";
import auth from "./middlewares/auth";
import { Developer, Project } from "./models";
import authAsDev from "./middlewares/authAsDev";
import { isDev } from "./utils/utilityFunctions";
// import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
// app.use(cookieParser());
app.get("/profile", auth, async (req, res) => {
  await req.user.populate("projects").execPopulate();
  let profile = req.user.toObject();
  profile.followers = profile.followers.length;
  profile.following = profile.following.length;
  res.send({ profile, as: req.as });
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
