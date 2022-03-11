// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const get = require("lodash/get");
const first = require("lodash/first");
const moment = require("moment");

const { API, defaultErrorMessage, ERROR_CODES } = require("../constants");
const { apiRequest } = require("../base");
const { SHA256 } = require("../../../util");
const {
  formatUserDevice,
  formatTelephone,
  getMailFlag,
} = require("../format-data");

const formatBirthday = (value) =>
  value && typeof value === "string" ? value.replace(/\-/g, "/") : value;

const getRegisterUser = (body) => {
  const mail_addr = get(body, "mail_addr");
  const password = get(body, "password");
  const mail_flg = getMailFlag(body);
  return JSON.stringify({
    user_register: {
      name1: get(body, "name1"),
      name2: get(body, "name2"),
      name_kana1: get(body, "name_kana1"),
      name_kana2: get(body, "name_kana2"),
      birth: formatBirthday(get(body, "birth")),
      sex: get(body, "sex"),
      mail_addr,
      user_kbn: formatUserDevice(get(body, "device")),
      zip: get(body, "zip"),
      addr1: get(body, "address_1"),
      addr2: get(body, "address_2"),
      addr3: get(body, "address_3"),
      addr4: get(body, "address_4"),
      tel1: formatTelephone(get(body, "tel1")),
      password,
      mail_flg,
    },
    user_ip_address: get(body, "user_ip_address"),
    auth_text: SHA256(`${get(body, "api-key")}`),
  });
};

const register = async (req, res) => {
  try {
    const registerUser = getRegisterUser(req.body);
    // console.log(">>INFO::body:", JSON.stringify(req.body));
    // console.log(">>INFO::registerUser:", registerUser);
    console.log(
      `【${moment()}】>>/repeat-plus/user/register::request.body<<`,
      registerUser
    );

    const user = await apiRequest(
      `${get(req.body, "request_url")}${API.register}`,
      registerUser
    );
    // console.log(">>INFO::user:", JSON.stringify(user));
    res.status(200).json({
      userId: get(user, "user_id"),
    });
  } catch (error) {
    console.log(
      `【${moment()}】>>/repeat-plus/user/register::ERROR<<`,
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

const verifyEmail = async (req, res) => {
  try {
    const registerUser = getRegisterUser(req.body);
    // console.log(">>INFO::body:", JSON.stringify(req.body));
    // console.log(">>INFO::registerUser:", registerUser);
    console.log(
      `【${moment()}】>>/repeat-plus/user/verifyEmail::request.body<<`,
      registerUser
    );

    const user = await apiRequest(
      `${get(req.body, "request_url")}${API.register}`,
      registerUser
    );
    res.json({
      status: "valid",
    });
  } catch (error) {
    console.log(
      `【${moment()}】>>/repeat-plus/user/verifyEmail::ERROR<<`,
      get(error, "error.response.data")
        ? JSON.stringify(get(error, "error.response.data"))
        : error
    );
    const data = get(error, "error.response.data.data");
    if (Array.isArray(data) && data.length > 0) {
      for (const message of data) {
        if (
          message &&
          typeof message == "string" &&
          message.trim().startsWith(ERROR_CODES.emailTaken)
        ) {
          res.json({
            status: "invalid",
            message,
          });
          return;
        }
      }
    }
    res.json({
      status: "valid",
    });
  }
};

module.exports = {
  register,
  verifyEmail,
};
