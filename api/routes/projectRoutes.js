import express from "express";
import { Developer, Project } from "../models";
import {
  isAuthedAsDeveloper,
  isDev,
  trimValues,
} from "../utils/utilityFunctions";
import authAsDev from "../middlewares/authAsDev";
import sharp from "sharp";
const fs = require("fs");
import multer from "multer";
import path from "path";

const router = new express.Router();

const storage = new multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../assets/"));
  },
  filname: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

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

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/home", authAsDev, async (req, res) => {
  // req.developer.following.forEach(devId=>{
  //   await Developer.findById(devId).populate('projects');
  // })
});

router.post("/", authAsDev, async (req, res) => {
  const upload = multer({ storage }).single("photo");
  await upload(req, res, async function (err) {
    const { title, about, github, site } = req.body;
    console.log("=> ", about);
    if (!title)
      return res
        .status(400)
        .send({ error: "title is required for a project!" });
    if (err) return res.send(err);
    await req.developer.populate("projects").execPopulate();
    const alreadyExist = req.developer.projects.some(
      (project) => project.title === title.trim()
    );
    if (alreadyExist) {
      return res.status(400).send({
        error:
          "You have already posted a project with same title. Choose a different title!",
      });
    }
    const project = new Project({
      title,
      about,
      links: {
        github,
        site,
      },
      developer: req.developer._id,
    });
    if (req.file) {
      // if (req.file) buffer = await sharp(req.file.buffer).png().toBuffer();
      await cloudinary.uploader.upload(
        req.file.path,
        {
          public_id: `project-images/${req.developer.username}:${project._id}`,
          tags: "projectphoto",
        },
        async function (err, image) {
          if (err) return res.status(400).send(err);
          fs.unlinkSync(req.file.path);
          project.photo = image.url;
        }
      );
    }
    try {
      await project.save();
      await req.developer.updateOne({
        $addToSet: { projects: project._id },
      });
      res.status(201).send({
        project,
      });
    } catch (error) {
      res.status(400).send({
        error: error.message,
      });
    }
  });
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  let project;
  try {
    project = await Project.findById(pid).populate([
      {
        path: "developer",
        select: "-tokens",
        populate: {
          path: "projects",
        },
      },
      {
        path: "comments",
        populate: {
          path: "by",
        },
      },
    ]);
  } catch (error) {
    return res.status(500).send();
  }
  if (!project)
    return res.status(404).send({
      error: "Invalid Project Id",
    });
  const isDeveloper = await isDev(req);
  if (
    isDeveloper &&
    req.developer._id.toString() === project.developer._id.toString()
  ) {
    //requesting developer is developer of project
    return res.send(project);
  } else {
    const response = project.toObject();
    delete response.viewedBy;
    return res.send(response);
  }
});

router.delete("/:pid", authAsDev, async (req, res) => {
  const { pid } = req.params;
  const project = await Project.findById(pid);
  if (!project)
    return res.status(404).send({
      error: "Invalid Project Id",
    });
  if (project.developer.toString() !== req.developer._id.toString())
    return res.send(400).send({
      error: "You don't have permission to perform this action!",
    });
  try {
    await Project.deleteOne({ _id: project._id });
    await req.developer.updateOne({ $pull: { projects: project._id } });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.patch("/:pid", authAsDev, async (req, res) => {
  const { pid } = req.params;
  req.body = trimValues(req.body);
  const { title, about, github, site } = req.body;
  const project = await Project.findById(pid);
  if (!project)
    return res.status(404).send({
      error: "Invalid Project Id",
    });
  if (project.developer.toString() !== req.developer._id.toString())
    return res.send(400).send({
      error: "You don't have permission to perform this action!",
    });
  try {
    const links = {
      github: !!github ? github : project.links.github,
      site: !!site ? site : project.links.site,
    };
    const updates = {
      title: !!title ? title : project.title,
      about: !!about ? about : project.about,
      links,
    };
    await project.updateOne({ ...updates });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.patch("/:pid/photo", authAsDev, async (req, res) => {
  const { pid } = req.params;
  const project = await Project.findById(pid);
  if (!project)
    return res.status(404).send({
      error: "Invalid Project Id",
    });
  if (project.developer.toString() !== req.developer._id.toString())
    return res.send(400).send({
      error: "You don't have permission to perform this action!",
    });
  //uploading photo to cloudinary
  const upload = multer({ storage }).single("photo");
  await upload(req, res, async function (err) {
    if (err) return res.status(400).send(err);
    // if (req.file) buffer = await sharp(req.file.buffer).png().toBuffer();
    const oldPhoto = project.photo;
    let public_id = oldPhoto.replace(/(.*)?\/project-images/, "").split(".");
    public_id.pop();
    public_id = public_id.join(".");

    await cloudinary.uploader.destroy(
      `project-images${public_id}`,
      function (err, result) {
        if (err) console.log("[cloudinary destroy log]: ", err);
      }
    );
    await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: `project-images/${req.developer.username}:${project._id}`,
        tags: "projectphoto",
      },
      async function (err, image) {
        if (err) return res.status(400).send(err);
        fs.unlinkSync(req.file.path);
        try {
          await project.updateOne({ photo: image.url });
          const updatedProject = await Project.findById(project._id);
          res.status(200).send({
            project: updatedProject,
          });
        } catch (error) {
          res.status(400).send({
            error: error.message,
          });
        }
      }
    );
  });
});

export default router;
