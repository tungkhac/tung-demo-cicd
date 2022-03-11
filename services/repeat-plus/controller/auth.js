// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const get = require("lodash/get");
const first = require("lodash/first");
const moment = require("moment");

const { API, defaultErrorMessage } = require("../constants");
const { apiRequest } = require("../base");
const { SHA256 } = require("../../../util");

const getLoginData = (body) => {
  const email = get(body, "email");
  return JSON.stringify({
    mail_address: email,
    user_ip_address: get(body, "user_ip_address"),
    auth_text: SHA256(
      `${email}${get(body, "password")}${get(body, "api-key")}`
    ),
  });
};

const login = async (req, res) => {
  try {
    const loginData = getLoginData(req.body);
    console.log(
      `【${moment()}】>>/repeat-plus/auth/login::request.body<<`,
      loginData
    );

    const userInfo = await apiRequest(
      `${get(req.body, "request_url")}${API.login}`,
      loginData
    );
    res.status(200).json({
      userId: get(userInfo.user, "user_id"),
      userName: get(userInfo.user, "name"),
      userShipping: JSON.stringify(get(userInfo, "userShipping")),
      userCreditCard: JSON.stringify(get(userInfo, "userCreditCard")),
    });
  } catch (error) {
    console.log(
      `【${moment()}】>>/repeat-plus/auth/login::ERROR<<`,
      get(error, "error.response.data")
        ? JSON.stringify(get(error, "error.response.data"))
        : error
    );
    res.status(500).json({
      error_message: get(error, "error.response.data.data")
        ? first(get(error, "error.response.data.data"))
        : defaultErrorMessage,
    });
  }
};

module.exports = {
  login,
};
