// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const axios = require("axios");
const get = require("lodash/get");
const { PuppeteerException } = require("../../model");
const {
  httpsAgent,
  responseType,
  headers,
  states,
  api,
  defaultErrorMessage,
} = require("./constants");
const {
  getGender,
  getBirthday,
  logException,
  isNotEmptyString,
  getFrequenciesFromResponse,
  uniqBy,
} = require("./common");
const { getToken } = require("./controller");

const getDetail = async (req, res, next) => {
  try {
    const { id, request_url } = req.body;
    // console.log(`【${moment()}】>>/distribution_courses/detail<<`, JSON.stringify(req.body));
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.distribution_courses}/${id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        // console.log(moment(), "200 ---> ", response.data);
        res.status(200).json(response.data);
      })
      .catch((error) => {
        logException(req.body, error);
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    res.status(500).json({ error_message: err });
  }
};

const search = async (req, res, next) => {
  try {
    const { ids, codes, request_url } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.distribution_courses}`, {
        params: { ids, codes },
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        logException(req.body, error);
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    res.status(500).json({ error_message: err });
  }
};

const getFrequencies = async (req, res, next) => {
  try {
    const { ids, request_url } = req.body;
    // console.log(`【${new Date()}】>>/distribution_courses/frequencies<<`, JSON.stringify(req.body));
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.distribution_courses}`, {
        params: { ids },
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        // console.log(
        //   `【${new Date()}】>>/distribution_courses/frequencies response:<<`,
        //   JSON.stringify(response.data)
        // );
        let data = [];
        const distributionCourses = get(response, "data.distribution_courses");
        if (
          Array.isArray(distributionCourses) &&
          distributionCourses.length > 0
        ) {
          data = getFrequenciesFromResponse({ data: distributionCourses[0] });
          data = uniqBy(data, (item) => item.value);
          for (let i = 1; i < distributionCourses.length; i++) {
            if (get(data, "length") > 0) {
              let frequencies = getFrequenciesFromResponse({
                data: distributionCourses[i],
              });
              if (get(frequencies, "length") > 0) {
                data = data.filter((item) => {
                  for (const frequency of frequencies) {
                    if (frequency.value == item.value) {
                      return true;
                    }
                  }
                  return false;
                });
              } else {
                data = [];
              }
            }
          }
        }
        res.status(200).json({ data });
      })
      .catch((error) => {
        // console.log("error:", error);
        logException(req.body, error);
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    // console.log("err:", err);
    logException(req.body, err);
    res.status(500).json({ error_message: err });
  }
};

module.exports = { getDetail, search, getFrequencies };
