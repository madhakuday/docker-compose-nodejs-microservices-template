const axios = require("axios");

const externalPostApiCall = (url, path = "/", body = {}, token = "") => {
  return axios.post(`${url}/${path}`, { ...body });
};

module.exports = {
  externalPostApiCall,
};
