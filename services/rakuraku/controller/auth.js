// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const axios = require("axios");
const {
  RAKURAKU_API,
  ACCESS_TOKEN_PATH,
  LOGIN_PATH,
  GET_CUSTOMER_PATH,
  REGISTER_PATH,
  UPDATE_CUSTOMER_PATH,
  VALIDATE_ERRORS: {
    EXISTED_EMAIL,
  }
} = require("../constants");
const { get } = require("lodash");
const qs = require("querystring");
const { generateLog, getFixedData } = require("../helper");

const login = async (req, res) => {
  const { email, password, access_token } = req.body;
  try {
    const result = await axios.post(
      RAKURAKU_API + LOGIN_PATH,
      qs.stringify({
        email,
        password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const { success, error_message, response } = get(result, "data") || {};
    const customer_id = get(response, "session.customer_id");
    if (success === "ok" && customer_id) {
      const customer_info = await getCustomerInfo(access_token, {
        "search_options[customer_id_from]": customer_id,
        "search_options[customer_id_to]": customer_id,
      });
      return res.status(200).json({
        customer_name01: customer_info.name01,
        customer_name02: customer_info.name02,
        customer_kana01: customer_info.kana01,
        customer_kana02: customer_info.kana02,
        customer_zip: customer_info.zip,
        customer_pref: customer_info.pref,
        customer_addr01: customer_info.addr01,
        customer_addr02: customer_info.addr02,
        customer_tel: customer_info.tel,
        customer_id: customer_info.customer_id,
      });
    }
    console.log(generateLog("/login result", response));
    return res.status(400).json({ error_message });
  } catch (err) {
    console.log(generateLog("/login error", { err, message: err.message }));
    return res.status(400).json({ error_message: `/login error` });
  }
};

const getCustomerInfo = async (access_token, params) => {
  try {
    const result = await axios.post(
      RAKURAKU_API + GET_CUSTOMER_PATH,
      qs.stringify(params),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const { success, response } = get(result, "data") || {};
    const customer = get(response, "customers[0].customer");
    if (success === "ok" && customer) {
      return customer;
    }
    console.log(generateLog("getCustomerInfo response", response));
    return null;
  } catch (err) {
    console.log(
      generateLog("/getCustomerInfo error", { err, message: err.message })
    );
    throw err;
  }
};

const checkExistedEmail = async (req, res) => {
  const {
    mail,
    access_token
  } = req.body;
  try {
    const isExistedEmail = await checkIsExistedEmail(mail, access_token);
    if (isExistedEmail) {
      return res.json({
        status: "invalid",
        message: EXISTED_EMAIL
      });
    }
    return res.json({
      status: "valid",
    });
  } catch (err) {
    console.log(
      generateLog("/check-existed-email error", { err, message: err.message })
    );
    /* istanbul ignore next */
    return res.status(400).json({
      status: "invalid",
      message: err && err.message || '/check-existed-email error',
    });
  }

}

const register = async (req, res) => {
  const {
    first_name,
    last_name,
    zipcode,
    pref,
    city,
    address,
    phone_number,
    mail,
    access_token,
    furigana_first,
    furigana_last,
    password,
  } = req.body;
  const fixedData = getFixedData(req.body);
  console.log(generateLog("/register params", req.body));
  const data = {
    customers: JSON.stringify([
      {
        customer: {
          ...(fixedData.customer || {}),
          customer_name: `${first_name} ${last_name}`,
          customer_kana: `${furigana_first} ${furigana_last}`,
          zip: zipcode,
          pref: pref,
          addr01: city,
          addr02: address,
          tel: phone_number,
          email: mail,
          name01: first_name,
          name02: last_name,
          kana01: furigana_first,
          kana02: furigana_last,
          password: password,
          pre_password: password,
          sex: "男性",
          profile_image_type: "0",
        },
      },
    ]),
  };
  try {
    const isExistedEmail = await checkIsExistedEmail(mail, access_token);
    if (isExistedEmail) {
      return res.status(400).json({
        error_message: EXISTED_EMAIL,
      });
    }
    const result = await axios.post(
      RAKURAKU_API + REGISTER_PATH,
      qs.stringify(data),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const { error_message, response } = get(result, "data") || {};
    const { log_info, id, result: _result } =
      get(response, "customers[0]") || {};

    console.log(generateLog("/register result", { error_message, response }));
    if (_result === 1 && id) {
      return res.status(200).json({
        customer_id: id,
      });
    }

    return res.status(400).json({ error_message: log_info });
  } catch (err) {
    console.log(generateLog("/register error", { err, message: err.message }));
    return res.status(400).json({ error_message: `/register error` });
  }
};

const checkIsExistedEmail = async (email, access_token) => {
  const customer = await getCustomerInfo(access_token, {
    "search_options[email]": email,
  });
  return !!customer;
};

const getAccessToken = async (req, res) => {
  const { client_id, client_secret, code, grant_type } = req.body;
  try {
    const result = await axios.post(RAKURAKU_API + ACCESS_TOKEN_PATH, {
      grant_type,
      code,
      client_secret,
      client_id,
    });
    if (result.status === 200) {
      const {
        data: { access_token },
      } = result;
      return res.status(200).json({ access_token });
    }
    console.log(generateLog("/get-access-token result", result));
    return res.status(400).json({ error_message: `Server errors` });
  } catch (err) {
    console.log(
      generateLog("/get-access-token error", { err, message: err.message })
    );
    return res.status(400).json({ error_message: `/get-access-token error` });
  }
};

const updateCustomer = async (updatedData, customerID, access_token) => {
  try {
    const customer = await getCustomerInfo(access_token, {
      "search_options[customer_id_from]": customerID,
      "search_options[customer_id_to]": customerID,
    });
    if (!customer) {
      throw new Error(`customerID ${customerID} is not existed.`);
    }
    const data = {
      customers: JSON.stringify([
        {
          customer: {
            customer_id: customerID,
            ...updatedData,
          },
        },
      ]),
    };
    const result = await axios.post(
      RAKURAKU_API + UPDATE_CUSTOMER_PATH,
      qs.stringify(data),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const { error_message, response } = get(result, "data") || {};
    const { log_info, id, result: _result } =
      get(response, "customers[0]") || {};

    console.log(generateLog("/updateCustomer result", { error_message, response }));
    if (_result === 1 && id) {
      return true;
    }

    throw new Error(log_info);
  } catch (err) {
    console.log(
      generateLog("/updateCustomer error", { err, message: err.message })
    );
    throw err;
  }
};

module.exports = {
  login,
  register,
  getAccessToken,
  updateCustomer,
  checkExistedEmail,
};
