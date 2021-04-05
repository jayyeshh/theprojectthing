import express from "express";
import mongoose from "mongoose";
require("./db/mongoose");
import developerRoutes from "./routes/developerRoutes";
import companyRoutes from "./routes/companyRoutes";
import projectRoutes from "./routes/projectRoutes";
import auth from "./middlewares/auth";
import { Developer, Project } from "./models";
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
    const devs = await Developer.find({});
    res.send(devs);
  } catch (error) {
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
