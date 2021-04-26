import express from "express";
import mongoose from "mongoose";
require("./db/mongoose");
import developerRoutes from "./routes/developerRoutes";
import companyRoutes from "./routes/companyRoutes";
import projectRoutes from "./routes/projectRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import commentRoutes from "./routes/commentRoutes";
import baseRoutes from "./routes/baseRoutes";
import cors from "cors";
import postRoutes from "./routes/postRoutes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(baseRoutes);
app.use("/developer", developerRoutes);
app.use("/company", companyRoutes);
app.use("/project", projectRoutes);
app.use("/post", postRoutes);
app.use("/review", reviewRoutes);
app.use("/comment", commentRoutes);
app.use((err, _req, res, next) => {
  //to check if request is in valid JSON format or not
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.sendStatus(400); // Bad request
  }
  next();
});

app.get("*", (_req, res) => {
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
