import { LOGGED_IN, LOGOUT } from "./action-types";

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
