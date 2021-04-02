import express from "express";
import { Project } from "../models";
import { isAuthedAsDeveloper } from "../utils/utilityFunctions";
import authAsDev from "../middlewares/authAsDev";
import sharp from "sharp";
const fs = require('fs')
import multer from "multer";
import path from 'path'

const router = new express.Router();

const storage = new multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../assets/'))
  },
  filname: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  }
})

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

const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

router.post("/", authAsDev, async (req, res) => {
  const upload = multer({ storage }).single('image')
  await upload(req, res, async function (err) {
    let buffer;
    const { title, about, github, site } = req.body;
    if (!title)
      return res.status(400).send({ error: "title is required for a project!" });
    if (err) return res.send(err);
    // if (req.file) buffer = await sharp(req.file.buffer).png().toBuffer();
    await cloudinary.uploader.upload(req.file.path, { public_id: `project-images/${new Date().toString()}`, tags: 'projectphoto' },
      async function (err, image) {
        if (err) return res.status(400).send(err);
        fs.unlinkSync(req.file.path)
        const links = {
          github,
          site,
        };
        const project = new Project({
          title,
          about,
          links,
          developer: req.developer._id,
          photo: image.url,
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
      })
  })
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
