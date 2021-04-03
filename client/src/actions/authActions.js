import axios from "../utility/axios/apiInstance";
import { LOGGED_IN, LOGOUT, SETUP_PROFILE } from "./action-types";
import store from '../store'

export const loginAction = (data) => {
  return {
    type: LOGGED_IN,
    payload: data,
  };
};

export const logoutAction = (data) => {
  return {
    type: LOGOUT,
  };
};

export const setInitialSession = (token) => {
  return async (dispatch) => {
    return getUserProfileByToken(token).then(({ profile, as, error }) => {
      if (error) {
        dispatch({
          type: LOGOUT,
        });
      }
      if (profile && as) {
        dispatch({
          type: SETUP_PROFILE,
          payload: {
            profile,
            as,
          },
        });
      }
    });
  };
};

const getUserProfileByToken = (token) => {
  return axios
    .get("/profile", { headers: { Authorization: token } })
    .then((resp) => {
      return resp.data;
    })
    .catch((error) => {
      console.log("error: ", error);
      return { error: "Something went wrong!" };
    });
};

export const setupAuthentication = async () => {
  let token = localStorage.getItem("authToken");
  if (token) {
    await store.dispatch(setInitialSession(token));
  }
};
