import axios from "../axios/apiInstance";

const configs = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
};

export const getProjectById = async (pid) => {
  return axios.get(`/project/${pid}`, configs);
};

export const voteProject = ({ pid, type }) => {
  return axios.post(
    "/project/vote",
    {
      pid,
      type,
    },
    configs
  );
};

export const getDeveloperById = (id) => {
  return axios.get(`/developer/${id}`, null, configs);
};

export const followUser = (uid) => {
  return axios.post(`/follow/${uid}`, null, configs);
};

export const unfollowUser = (uid) => {
  return axios.post(`/unfollow/${uid}`, null, configs);
};
