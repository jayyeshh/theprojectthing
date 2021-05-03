import express from "express";
import auth from "../middlewares/auth";
import { Company, Developer, Post, Project } from "../models";
import authAsDev from "../middlewares/authAsDev";
import { isDev } from "../utils/utilityFunctions";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
const router = new express.Router();

router.get("/profile", auth, async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.patch("/password", auth, async (req, res) => {
  try {
    let { oldPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(oldPassword, req.user.password);
    if (!isMatch)
      return res.status(400).send({ oldPassword: "Incorrect Password!" });
    await req.user.updateOne({ password: newPassword });
    await req.user.updateOne({ $set: { tokens: [] } });
    return res.send();
  } catch (error) {
    if (error.name === "Password Invalidation") {
      return res
        .status(400)
        .send({ newPassword: true, message: error.message });
    }
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query, type } = req.query;
    const queryArray = query.split(/[_\s.]/);
    const expr = "(" + queryArray.join("|") + ")";
    let resp = [];
    if (type === "tag" || type === "all") {
      const projects = await Project.aggregate([
        {
          $match: {
            tags: {
              $in: [new RegExp(expr, "i")],
            },
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
      ]);
      resp = resp.concat(projects);
    }
    if (type === "developers" || type === "all") {
      let developers = [];
      const isDeveloper = await isDev(req);
      if (isDeveloper) {
        developers = await Developer.aggregate([
          {
            $match: {
              username: { $regex: new RegExp(expr, "i") },
            },
          },
          {
            $addFields: {
              isFollowing: {
                $in: [
                  mongoose.Types.ObjectId(req.developer._id.toString()),
                  "$followers",
                ],
              },
              isFollowed: {
                $in: [
                  mongoose.Types.ObjectId(req.developer._id.toString()),
                  "$following",
                ],
              },
            },
          },
          {
            $project: {
              password: 0,
              tokens: 0,
            },
          },
        ]);
      } else {
        developers = await Developer.aggregate([
          {
            $match: {
              username: { $regex: new RegExp(expr, "i") },
            },
          },
          {
            $project: {
              password: 0,
              tokens: 0,
            },
          },
        ]);
      }
      resp = resp.concat(developers);
    }
    if (type === "companies" || type === "all") {
      const companies = await Company.find({
        username: { $regex: new RegExp(expr, "i") },
      });
      resp = resp.concat(companies);
    }
    if (type === "projects" || type === "all") {
      const projects = await Project.aggregate([
        {
          $match: {
            title: {
              $regex: new RegExp(expr, "i"),
            },
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
      ]);
      resp = resp.concat(projects);
    }
    if (type === "posts" || type === "all") {
      const posts = await Post.aggregate([
        {
          $match: {
            $or: [
              {
                title: { $regex: new RegExp(expr, "i") },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: "$author",
        },
      ]);
      resp = resp.concat(posts);
    }
    res.send(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const totalCompanies = await Company.find({}).count();
    const totalDevelopers = await Developer.find({}).count();
    res.send({
      totalCompanies,
      totalDevelopers,
    });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/tags", async (req, res) => {
  const fetchedTags = await Project.aggregate([
    {
      $project: {
        tags: 1,
      },
    },
    {
      $unwind: "$tags",
    },
    {
      $group: {
        _id: null,
        tags: {
          $push: "$tags",
        },
      },
    },
    {
      $project: {
        tags: 1,
        _id: 0,
      },
    },
  ]);
  res.send({ tags: fetchedTags[0].tags });
});

router.get("/home", auth, async (req, res) => {
  try {
    if (req.as.toLowerCase() === "developer") {
      await req.user.populate("following").execPopulate();
      const followings = req.user.following;
      let projects = [];
      followings.forEach((user) => (projects = projects.concat(user.projects)));
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
      const fetchedProjects = await Project.aggregate([
        {
          $sample: { size: 30 },
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
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/devs", async (req, res) => {
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
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/projects", async (req, res) => {
  try {
    const { sortby } = req.query;
    if (sortby === "mostVoted") {
      const projects = await Project.aggregate([
        {
          $lookup: {
            from: "developers",
            as: "developer",
            localField: "developer",
            foreignField: "_id",
          },
        },
        {
          $unwind: "$developer",
        },
        {
          $addFields: {
            upvoteTotal: { $size: "$upvotes" },
            // downvoteTotal: { $size: "$downvotes" },
          },
        },
        {
          $sort: {
            upvoteTotal: -1,
          },
        },
      ]);
      res.send(projects);
    } else {
      const projects = await Project.aggregate([
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
            createdAt: -1,
          },
        },
      ]);
      res.send(projects);
    }
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/projects/:tag", async (req, res) => {
  try {
    const { tag } = req.params;
    const projects = await Project.aggregate([
      {
        $match: {
          tags: {
            $in: [tag],
          },
        },
      },
    ]);
    res.send(projects);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find({});
    res.send(companies);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/developers", async (req, res) => {
  try {
    const developers = await Developer.find({});
    res.send(developers);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/follow/:uid", authAsDev, async (req, res) => {
  try {
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
    //to update developer to follow's followers list
    await developerToFollow.updateOne({
      $addToSet: { followers: req.developer._id },
    });
    //to update user's following list
    await req.developer.updateOne({
      $addToSet: { following: developerToFollow._id },
    });
    res.sendStatus(200);
  } catch (error) {
    res.status.send({ error: "Internal Server Error" });
  }
});

router.post("/unfollow/:uid", authAsDev, async (req, res) => {
  try {
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
    //to update developer to unfollow's followers list
    await developerToUnfollow.updateOne({
      $pull: { followers: req.developer._id },
    });
    //to update user's following list
    await req.developer.updateOne({
      $pull: { following: developerToUnfollow._id },
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({}).populate(["interested", "author"]);
    res.send(posts);
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
