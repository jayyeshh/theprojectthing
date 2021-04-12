import express from "express";
import { Comment, Project } from "../models";
import auth from "../middlewares/auth";
import mongoose from "mongoose";

const router = new express.Router();

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) return res.status(400).send({ error: "Invalid Object Id" });
    const comment = await Comment.findById(id).populate(["by", "project"]);
    if (!comment) return res.status(404).send({ error: "Comment not found!" });
    res.send(comment);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { text, projectId } = req.body;
    if (!projectId)
      return res.status(400).send({ error: "Missing User Input!" });
    if (!text || !!!text.trim())
      return res.status(400).send({ error: "Empty comments are not allowed!" });
    if (!mongoose.isValidObjectId(projectId))
      return res.status(400).send({ error: "Invalid Company Id" });
    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).send({ error: "No such project exists!" });
    let onModel = req.as.toLowerCase();
    onModel = onModel[0].toUpperCase() + onModel.substr(1);
    const comment = new Comment({
      text,
      project: project._id,
      onModel,
      by: req.user._id,
    });
    await comment.save();
    await project.updateOne({ $addToSet: { comments: comment._id } });
    await comment.populate(["by", "project"]).execPopulate();
    res.send({ comment });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid Comment Id" });
    const { text } = req.body;
    if (!text || !!!text.trim())
      return res.status(400).send({ error: "Empty comments are not allowed!" });
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).send({ error: "Comment not found!" });
    await comment.updateOne({ text });
    const updatedComment = await Comment.findById(id).populate([
      "by",
      "project",
    ]).select('-by.tokens');
    res.send({ comment: updatedComment });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid Comment Id" });
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).send({ error: "Comment not found!" });
    await Comment.findByIdAndDelete(id);
    const project = await Project.findById(comment.project);
    await project.updateOne({ $pull: { comments: comment._id } });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
