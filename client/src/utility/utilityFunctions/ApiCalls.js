import axios from "../axios/apiInstance";

let configs = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
};

const setConfigs = () => {
  configs = {
    ...configs,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };
};

export const getProjectById = async (pid) => {
  setConfigs();
  return axios.get(`/project/${pid}`, configs);
};

export const voteProject = ({ pid, type }) => {
  setConfigs();
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
  setConfigs();
  return axios.get(`/developer/${id}`, null, configs);
};

export const getCompanyById = (id) => {
  setConfigs();
  return axios.get(`/company/${id}`, null, configs);
};

export const followUser = (uid) => {
  setConfigs();
  return axios.post(`/follow/${uid}`, null, configs);
};

export const getPostById = (id) => {
  setConfigs();
  return axios.get(`/post/${id}`, null, configs);
};

export const unfollowUser = (uid) => {
  setConfigs();
  return axios.post(`/unfollow/${uid}`, null, configs);
};
