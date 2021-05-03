import jwt from "jsonwebtoken";
const { Company, Developer } = require("../models/index");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id, as } = decode;
    if (as === "Developer" && req.baseUrl === "/company")
      return res.sendStatus(401);
    if (as === "Company" && req.baseUrl === "/developer")
      return res.sendStatus(401);
    let user;
    if (as === "Developer") {
      user = await Developer.findOne({
        _id,
        "tokens.token": token,
      });
    } else if (as === "Company") {
      user = await Company.findOne({
        _id,
        "tokens.token": token,
      });
    }
    if (!user) return res.status(401).send({ error: "Please authenticate!" });
    req.user = user;
    req.as = as;
    req.token = token;
    next();
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error!" });
  }
};

export default auth;
