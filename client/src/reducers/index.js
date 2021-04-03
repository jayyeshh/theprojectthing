import { combineReducers } from "redux";
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";

const rootReducer = combineReducers({
  authReducer,
  projectReducer,
});

export default rootReducer;
