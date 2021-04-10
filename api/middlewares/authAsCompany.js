import { isAuthedAsCompany } from "../utils/utilityFunctions";

const authAsCompany = async (req, res, next) => {
  const authCheck = await isAuthedAsCompany(req, res);
  if (authCheck) return next();
  res.sendStatus(401);
};

export default authAsCompany;
