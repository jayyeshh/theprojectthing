import { LOGGED_IN, LOGOUT, SETUP_PROFILE } from "../actions/action-types";

const initialState = {
  authenticated: false,
  as: undefined,
  user: {},
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGGED_IN: {
      const newState = {};
      let _id, email, username, name, followers, following;
      const { token } = action.payload;
      localStorage.setItem("authToken", token);
      if (action.payload.company) {
        newState.as = "Company";
        ({ _id, email, username, name } = action.payload.company);
      }
      if (action.payload.developer) {
        newState.as = "Developer";
        ({
          email,
          _id,
          username,
          name,
          followers,
          following,
        } = action.payload.developer);
      }
      const user = {
        _id,
        email,
        username,
        name,
      };
      if (newState.as === "Developer") {
        user.followers = followers;
        user.following = following;
      }
      newState.user = user;
      newState.authenticated = true;
      return newState;
    }
    case LOGOUT: {
      localStorage.removeItem("authToken");
      return initialState;
    }
    case SETUP_PROFILE: {
      const { profile, as } = action.payload;
      const { _id, followers, following, email, name, username } = profile;
      return {
        authenticated: true,
        as,
        user: {
          _id,
          username,
          name,
          email,
          followers,
          following,
        },
      };
    }
    default:
      return state;
  }
};

export default authReducer;
