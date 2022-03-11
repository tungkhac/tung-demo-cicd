// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const axios = require("axios");
const { responseType, httpsAgent } = require("./constants");

const apiRequest = async (url, data, header = {}) => {
  try {
    const response = await axios.post(url, data, { httpsAgent, responseType });
    return response.data.data;
  } catch (error) {
    return Promise.reject({ error });
  }
};

module.exports = {
  apiRequest,
};
