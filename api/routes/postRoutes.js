import express from "express";
import mongoose from "mongoose";
import authAsCompany from "../middlewares/authAsCompany";
import authAsDev from "../middlewares/authAsDev";
import { Post } from "../models";

const router = new express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id: postId } = req.params;
    const post = await Post.findById(postId).populate(["interested", "author"]);
    res.send(post);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/", authAsCompany, async (req, res) => {
  try {
    let { title, body, tags = [] } = req.body;
    if (title) title = title.trim();
    if (body) body = body.trim();
    if (!title || !title.length)
      return res.status(400).send({ error: "Title is required Field!" });
    if (!body || !body.length)
      return res.status(400).send({ error: "Post body is required Field!" });
    const post = new Post({
      title,
      body,
      tags,
      author: req.company._id,
    });
    await post.save();
    await req.company.updateOne({ $addToSet: { posts: post._id } });
    const response = await Post.findById(post._id).populate([
      "interested",
      "author",
    ]);
    res.send(response);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/interested", authAsDev, async (req, res) => {
  try {
    let { postId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).send({ error: "Invalid Post Id" });
    }
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send({ error: "Cannot find post!" });
    if (post.interested.includes(req.developer._id)) {
      await post.updateOne({ $pull: { interested: req.developer._id } });
    } else {
      await post.updateOne({ $addToSet: { interested: req.developer._id } });
    }
    const updatedPost = await Post.findById(post._id).populate([
      "interested",
      "author",
    ]);
    res.send({ post: updatedPost });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
