import { combineReducers } from "redux";
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import modalReducer from "./modalReducer";

const rootReducer = combineReducers({
  authReducer,
  projectReducer,
  modalReducer,
});

export default rootReducer;
