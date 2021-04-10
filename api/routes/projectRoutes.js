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

router.post("/", authAsDev, async (req, res) => {
  const upload = multer({ storage }).single("photo");
  await upload(req, res, async function (err) {
    const { title, about, github, site } = req.body;
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
        errors: {
          title:
            "You have already posted a project with same title. Choose a different title!",
        },
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
  const response = project.toObject();
  if (isDeveloper) {
    const upvoted = response.upvotes.some(
      (id) => id.toString() === req.developer._id.toString()
    );
    const downvoted = response.downvotes.some(
      (id) => id.toString() === req.developer._id.toString()
    );
    response.upvoted = upvoted;
    response.downvoted = downvoted;
  }
  response.developer.followers = project.developer.followers.length;
  response.developer.following = project.developer.following.length;
  response.upvotes = project.upvotes.length;
  response.downvotes = project.downvotes.length;

  if (
    isDeveloper &&
    req.developer._id.toString() === project.developer._id.toString()
  ) {
    //requesting developer is developer of project

    return res.send(response);
  } else {
    delete response.viewedBy;
    return res.send(response);
  }
});

router.post("/vote", authAsDev, async (req, res) => {
  const { pid, type } = req.body;
  if (![1, -1].includes(type))
    return res.status(400).send({ error: "Invalid Type" });
  try {
    const project = await Project.findById(pid);
    if (!project) return res.status(404).send({ error: "Invalid Project Id!" });
    if (type === -1) {
      //downvote
      if (project.downvotes.includes(req.developer._id)) {
        await project.update({ $pull: { downvotes: req.developer._id } });
      } else {
        await project.updateOne({
          $addToSet: { downvotes: req.developer._id },
          $pull: { upvotes: req.developer._id },
        });
      }
    }
    if (type === 1) {
      //upvote
      if (project.upvotes.includes(req.developer._id)) {
        await project.update({ $pull: { upvotes: req.developer._id } });
      } else {
        await project.updateOne({
          $addToSet: { upvotes: req.developer._id },
          $pull: { downvotes: req.developer._id },
        });
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
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
  const upload = multer({ storage }).single("photo");
  await upload(req, res, async function (err) {
    if (err) return res.send(err);
    let { title, about, github, site, photo } = req.body;
    if (!title)
      return res
        .status(400)
        .send({ error: "title is required for a project!" });

    const project = await Project.findById(pid);
    if (!project)
      return res.status(404).send({
        error: "Invalid Project Id",
      });
    if (project.developer.toString() !== req.developer._id.toString())
      return res.send(400).send({
        error: "You don't have permission to perform this action!",
      });
    const links = {
      github: !!github ? github : project.links.github,
      site: !!site ? site : project.links.site,
    };
    const duplicateTitle = await Project.find({
      title,
      developer: req.developer._id,
      _id: { $ne: project._id },
    });
    if (duplicateTitle.length)
      return res
        .status(400)
        .send({ error: "You already have a project with same title!" });
    if (req.file) {
      await cloudinary.uploader.upload(
        req.file.path,
        {
          public_id: `project-images/${req.developer.username}:${project._id}`,
          tags: "projectphoto",
        },
        async function (err, image) {
          if (err) return res.status(400).send(err);
          fs.unlinkSync(req.file.path);
          photo = image.url;
        }
      );
    }
    try {
      const updates = {
        title: !!title ? title : project.title,
        about: !!about ? about : project.about,
        links,
      };
      if (!!photo) {
        updates.photo = photo;
      }
      await project.updateOne({ ...updates });
      res.sendStatus(200);
    } catch (error) {
      res.status(400).send({
        error: error.message,
      });
    }
  });
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
