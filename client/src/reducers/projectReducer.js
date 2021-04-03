import { LOGGED_IN, LOGOUT, SETUP_PROFILE } from "../actions/action-types";

const initialState = {
  projects: [],
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETUP_PROFILE: {
      return {
        ...state,
        projects: action.payload.profile.projects,
      };
    }
    default:
      return state;
  }
};

export default projectReducer;
