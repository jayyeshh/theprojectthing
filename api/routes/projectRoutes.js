import express from "express";
import { Project } from "../models";
import { isAuthedAsDeveloper } from "../utils/utilityFunctions";

const router = new express.Router();

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
    //loggedIn as Developer and viewing other developer's project
    project.toObject();
    delete project.viewedBy;
    return res.send(project);
  }
});

export default router;
