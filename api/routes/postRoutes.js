import express from "express";
import mongoose from "mongoose";
import authAsCompany from "../middlewares/authAsCompany";
import authAsDev from "../middlewares/authAsDev";
import { Post } from "../models";

const router = new express.Router();

router.get("/:id", async (req, res) => {
  const { id: postId } = req.params;
  try {
    const post = await Post.findById(postId).populate(["interested", "author"]);
    res.send(post);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/", authAsCompany, async (req, res) => {
  let { text } = req.body;
  if (text) text = text.trim();
  if (!text || !text.length)
    return res.status(400).send({ error: "Empty post not allowed!" });
  try {
    const post = new Post({
      text,
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
    console.log(error);
    res.sendStatus(500);
  }
  res.send();
});

router.post("/interested", authAsDev, async (req, res) => {
  let { postId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).send({ error: "Invalid Post Id" });
  }
  const post = await Post.findById(postId);
  if (!post) return res.status(404).send({ error: "Cannot find post!" });
  try {
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
    console.log(error);
    return res.sendStatus(500);
  }
});

export default router;
