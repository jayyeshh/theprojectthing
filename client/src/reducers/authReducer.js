import { LOGGED_IN, LOGOUT } from "../actions/action-types";

const initialState = {
  authenticated: false,
  as: undefined,
  user: {
    username: undefined,
    name: undefined,
    email: undefined,
  },
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGGED_IN: {
      const newState = {};
      let email, username, name;
      if (action.payload.company) {
        newState.as = "Company";
        ({ email, username, name } = action.payload.company);
      }
      if (action.payload.developer) {
        newState.as = "Developer";
        ({ email, username, name } = action.payload.developer);
      }
      const user = {
        email,
        username,
        name,
      };
      newState.user = user;
      newState.authenticated = true;
      return newState;
    }
    case LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default authReducer;
