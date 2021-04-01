import express from "express";
import { Project } from "../models";
import { isAuthedAsDeveloper } from "../utils/utilityFunctions";
import authAsDev from "../middlewares/authAsDev";
import sharp from "sharp";
import multer from "multer";

const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/gm)) {
      return cb(new Error("Please upload file with proper extension only!"));
    }
    cb(undefined, true);
  },
});

router.post("/", authAsDev, upload.single("photo"), async (req, res) => {
  let buffer;
  const { title, about, github, site } = req.body;
  if (!title)
    return res.status(400).send({ error: "title is required for a project!" });
  if (req.file) buffer = await sharp(req.file.buffer).png().toBuffer();
  const links = {
    github,
    site,
  };
  const project = new Project({
    title,
    about,
    links,
    developer: req.developer._id,
    photo: buffer,
  });
  try {
    await project.save();
    res.status(201).send({
      project,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
  res.status(201).send();
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const project = await Project.findById(pid).populate(
    {
      path: "developer",
    },
    {
      path: "comments",
      populate: {
        path: "by",
      },
    }
  );
  if (!project)
    return res.status(404).send({
      error: "Invalid Project Id",
    });
  if (
    isAuthedAsDeveloper(req) &&
    req.developer._id.toString() === project.developer._id.toString()
  ) {
    //requesting developer is developer of project
    return res.send(project);
  } else {
    project.toObject();
    delete project.viewedBy;
    return res.send(project);
  }
});

export default router;

/*
Routes:
/:pid => patch
/:pid => delete
*/
