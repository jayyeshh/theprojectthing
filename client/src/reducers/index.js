import { combineReducers } from "redux";
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import postReducer from "./postReducer";
import modalReducer from "./modalReducer";

const rootReducer = combineReducers({
  authReducer,
  projectReducer,
  postReducer,
  modalReducer,
});

export default rootReducer;
