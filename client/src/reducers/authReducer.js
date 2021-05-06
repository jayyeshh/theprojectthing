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
      let _id,
        email,
        username,
        name,
        followers,
        following,
        website = "",
        github = "",
        avatar = "",
        logo = "",
        technologies = [],
        portfolio = "",
        linkedIn = "",
        about = "";
      const { token } = action.payload;
      localStorage.setItem("authToken", token);
      if (action.payload.company) {
        newState.as = "Company";
        ({
          _id,
          email,
          username,
          technologies,
          about,
          name,
          logo,
        } = action.payload.company);
        if (action.payload.company.websites) {
          ({ website, linkedIn } = action.payload.company.websites);
        }
      }
      if (action.payload.developer) {
        newState.as = "Developer";
        ({
          _id,
          email,
          username,
          name,
          followers,
          following,
          avatar,
        } = action.payload.developer);
        if (action.payload.developer.websites) {
          ({
            website,
            github,
            portfolio,
            linkedIn,
          } = action.payload.developer.websites);
        }
      }
      const user = {
        _id,
        email,
        username,
        name,
        website,
        linkedIn,
      };
      if (newState.as === "Developer") {
        user.followers = followers;
        user.following = following;
        user.github = github;
        user.portfolio = portfolio;
        user.avatar = avatar;
      }
      if (newState.as === "Company") {
        user.about = about;
        user.technologies = technologies;
        user.logo = logo;
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
      let website = "",
        linkedIn = "",
        github = "",
        portfolio = "",
        avatar = "",
        logo = "";
      if (profile.websites) {
        ({ website, linkedIn, github, portfolio } = profile.websites);
      }
      const {
        _id,
        followers,
        following,
        about,
        technologies = [],
        email,
        name,
        username,
      } = profile;
      ({ avatar, logo } = profile);
      return {
        authenticated: true,
        as,
        user: {
          _id,
          username,
          name,
          email,
          about,
          technologies,
          followers,
          following,
          avatar,
          logo,
          website,
          linkedIn,
          github,
          portfolio,
        },
      };
    }
    default:
      return state;
  }
};

export default authReducer;
