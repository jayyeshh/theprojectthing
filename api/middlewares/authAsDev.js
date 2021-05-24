import { isAuthedAsDeveloper } from "../utils/utilityFunctions";

const authAsDev = async (req, res, next) => {
  const authCheck = await isAuthedAsDeveloper(req, res);
  if (authCheck===true) return next();
  return res.sendStatus(401);
};

export default authAsDev;
