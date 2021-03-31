import { isAuthedAsDeveloper } from '../utils/utilityFunctions';

const authAsDev = async (req, res, next) => {
    if (isAuthedAsDeveloper(req)) next();
    res.sendStatus(401);
};

export default authAsDev;