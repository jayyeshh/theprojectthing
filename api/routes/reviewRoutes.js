import express from "express";
const router = new express.Router();
import authAsDev from "../middlewares/authAsDev";
import { Review, Company } from "../models";
import mongoose from "mongoose";
import { trimValues } from "../utils/utilityFunctions";

//get review by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) return res.status(400).send({ error: "Invalid Object Id" });
    const review = await Review.findById(id).populate(["by", "company"]);
    if (!review) return res.status(404).send({ error: "Review not found!" });
    res.send(review);
  } catch (error) {
    res.sendStatus(500);
  }
});

//post review
router.post("/", authAsDev, async (req, res) => {
  try {
    const { text, companyId } = req.body;
    if (!companyId)
      return res.status(400).send({ error: "Missing User Input!" });
    if (!text || !!!text.trim())
      return res.status(400).send({ error: "Empty reviews are not allowed!" });
    if (!mongoose.isValidObjectId(companyId))
      return res.status(400).send({ error: "Invalid Company Id" });
    const company = await Company.findById(companyId);
    if (!company)
      return res.status(404).send({ error: "No such company exists!" });
    const review = new Review({
      text,
      company: company._id,
      by: req.developer._id,
    });
    await review.save();
    await company.updateOne({ $addToSet: { reviews: review._id } });
    res.send({ review });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//edit review
router.patch("/:id", authAsDev, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid Review Id" });
    const { text } = req.body;
    if (!!!text.trim())
      return res.status(400).send({ error: "Empty reviews are not allowed!" });
    const review = await Review.findById(id);
    if (!review) return res.status(404).send({ error: "Review not found!" });
    await review.updateOne({ text });
    const updatedReview = await Review.findById(id).populate(["by", "company"]);
    res.send({ review: updatedReview });
  } catch (error) {
    res.sendStatus(500);
  }
});

router.delete("/:id", authAsDev, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send({ error: "Invalid Review Id" });
    const review = await Review.findById(id);
    if (!review) return res.status(404).send({ error: "Review not found!" });
    await Review.findByIdAndDelete(id);
    const company = await Company.findById(review.company);
    await company.updateOne({ $pull: { reviews: review._id } });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
