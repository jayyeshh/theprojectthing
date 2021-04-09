import { LOGGED_IN, LOGOUT, SETUP_PROFILE } from "../actions/action-types";

const initialState = {
  posts: [],
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETUP_PROFILE: {
      return {
        ...state,
        posts: action.payload.profile.posts,
      };
    }
    default:
      return state;
  }
};

export default postReducer;
