// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const get = require("lodash/get");
const { URL } = require("url");
const axios = require("axios");
const FormData = require("form-data");
const parseString = require("xml2js").parseString;
const {
  UserCryptKey,
  ConnectPage,
  EfoMessageVariable,
  Variable,
  EfoPOrderSetting,
  ZCOMPayment,
} = require("../../model");
const cryptor = require("../../routes/crypto");
const { cgiURLs } = require("./constants");

const fillFormByKeyValue = (form, key, value, defaultValue) => {
  if (defaultValue) {
    value = value || defaultValue;
    form.append(key, value);
    return;
  }
  if (!value) {
    throw new Error(`${key} is required.`);
  }
  form.append(key, value);
};

const fillOrderHeaders = (form, body) => {
  fillFormByKeyValue(form, "contract_code", get(body, "contract_code"));
  fillFormByKeyValue(form, "version", get(body, "version"), "1");
  fillFormByKeyValue(
    form,
    "character_code",
    get(body, "character_code"),
    "UTF-8"
  );
  fillFormByKeyValue(form, "process_code", get(body, "process_code"), "1");
};

const fillUserInformation = (form, body) => {
  const langs = ["en", "ja"];
  let lang_id = get(body, "lang_id") || "ja";
  if (!langs.includes(lang_id)) {
    lang_id = "ja";
  }
  form.append("lang_id", lang_id);
  fillFormByKeyValue(form, "user_id", get(body, "zcom_user_id"));
  fillFormByKeyValue(form, "user_name", get(body, "user_name"));
  fillFormByKeyValue(form, "user_mail_add", get(body, "user_mail_add"));
};

const fillProductInformation = (form, body) => {
  fillFormByKeyValue(form, "item_code", get(body, "item_code"));
  fillFormByKeyValue(form, "item_name", get(body, "item_name"));
  fillFormByKeyValue(form, "item_price", get(body, "item_price"));
  fillFormByKeyValue(form, "order_number", get(body, "order_number"));
};

const getZComResult = (json, key) => {
  if (!json || !key) return;
  const results = get(json, "GlobalPayment_result.result");
  if (!Array.isArray(results) || results.length == 0) return;
  let i = 0;
  for (i = 0; i < results.length; i++) {
    const result = results[i];
    const val = get(result, `$.${key}`);
    if (val) {
      return val;
    }
  }
};

const addParameterToURL = (url, key, value) => {
  try {
    if (key && value) {
      const newURL = new URL(url);
      newURL.searchParams.append(key, value);
      return newURL.toString();
    }
  } catch (error) {}
  return url;
};

const getUserCryptKey = async (connect_page_id, user_id) => {
  if (!connect_page_id || !user_id) return;
  const key = UserCryptKey.findOne({
    connect_page_id: connect_page_id,
    user_id: user_id,
  });
  if (key && key.salt) {
    return key.salt;
  }
};

const getConnectPage = async (connect_page_id, user_id) => {
  if (!connect_page_id || !user_id) return;
  const encrypt_key = await getUserCryptKey(connect_page_id, user_id);
  const connectPage = await ConnectPage.findOne({
    _id: connect_page_id,
    deleted_at: null,
  });
  if (!connectPage) return;
  return {
    connect_id: connectPage.connect_id,
    encrypt_flg: connectPage.encrypt_flg,
    encrypt_key,
  };
};

const getVariableValue = (encrypt_key, messageVariable) => {
  if (!messageVariable || !messageVariable.variable_value) return;
  let value = messageVariable.variable_value;
  if (encrypt_key) {
    value = cryptor.decryptConvertJSON(value, encrypt_key);
  }
  const values = [];
  if (Array.isArray(value)) {
    value.forEach((element) => {
      if (element.value !== undefined) {
        values.push(element.value);
      } else if (element.text) {
        values.push(element.text);
      } else {
        values.push(element);
      }
    });
    value = values.join(",");
  }
  return value;
};

const getVariableValueById = async (
  connect_page_id,
  user_id,
  variable_id,
  encrypt_key
) => {
  if (!connect_page_id || !user_id || !variable_id) return {};
  const value = {};
  const messageVariable = await EfoMessageVariable.findOne({
    connect_page_id,
    user_id,
    variable_id,
  });
  if (messageVariable) {
    value[variable_id] = getVariableValue(encrypt_key, messageVariable);
  }
  return value;
};

const insertValueToMessageVariable = async (
  connect_page_id,
  user_id,
  variable_name,
  value
) => {
  if (!connect_page_id || !user_id || !variable_name || !value) return;
  let variable = await Variable.findOne({ connect_page_id, variable_name });
  const now = new Date();
  if (!variable) {
    await Variable.update(
      { connect_page_id, variable_name },
      { $set: { created_at: now, updated_at: now } },
      { upsert: true, multi: false }
    );
    variable = await Variable.findOne({ connect_page_id, variable_name });
  }
  if (variable) {
    await EfoMessageVariable.update(
      { connect_page_id, user_id, variable_id: variable._id },
      {
        $set: {
          variable_value: [value],
          type: "001",
          created_at: now,
          updated_at: now,
        },
      },
      { upsert: true, multi: false }
    );
  }
};

const getZComResultObject = (json) => {
  if (!json) return undefined;
  const results = get(json, "GlobalPayment_result.result");
  if (!Array.isArray(results) || results.length == 0) return undefined;
  let i = 0;
  const object = {};
  for (i = 0; i < results.length; i++) {
    const val = get(results, `[${i}].$`);
    if (val && typeof val == "object") {
      const keys = Object.keys(val);
      if (Array.isArray(keys) && keys.length > 0) {
        keys.forEach((key) => {
          if (val[key]) {
            object[key] = val[key];
          }
        });
      }
    }
  }
  return object;
};

const requestCheckOrder = async (contract_code, mode, order_number) => {
  /* istanbul ignore if */
  if (!contract_code || !mode || !order_number) return;
  return new Promise((resolve) => {
    const url =
      mode == "production"
        ? cgiURLs.checkOrder.production
        : cgiURLs.checkOrder.test;
    const form = new FormData();
    try {
      fillFormByKeyValue(form, "contract_code", contract_code);
      fillFormByKeyValue(form, "order_number", order_number);
      axios
        .post(url, form, { headers: form.getHeaders() })
        .then((response) => {
          const xml = response ? response.data : "";
          if (xml) {
            parseString(xml, (error, json) => {
              resolve(getZComResultObject(json));
            });
          } else {
            resolve();
          }
        })
        .catch((error) => {
          resolve();
        });
    } catch (error) {
      resolve();
    }
  });
};

const getPaymentSettings = async (connect_page_id) => {
  if (!connect_page_id) return [];
  const setting = await EfoPOrderSetting.findOne({
    cpid: connect_page_id,
  });
  if (!setting) return [];
  return [
    {
      tax_type: setting.tax_type,
      rounding: setting.rounding,
      tax: setting.tax,
      settlement_fee_type: setting.settlement_fee_type,
      settlement_fee: setting.settlement_fee,
      variable_settlement: setting.variable_settlement,
      shipping_fee_type: setting.shipping_fee_type,
      shipping_fee: setting.shipping_fee,
      variable_address: setting.variable_address,
      payment_gateway_setting: setting.payment_gateway_setting,
      variable_payment_method: setting.variable_payment_method,
      gateway_setting: setting.gateway_setting,
    },
  ];
};

const getZComPayment = async (order_number) => {
  if (!order_number) return;
  const payment = await ZCOMPayment.findOne({ order_number });
  return payment;
};

const saveZCOMPayment = async (
  connect_page_id,
  user_id,
  contract_code,
  mode,
  order_number,
  zcom_user_id
) => {
  if (
    !connect_page_id ||
    !user_id ||
    !contract_code ||
    !mode ||
    !order_number ||
    !zcom_user_id
  )
    return;
  const created_at = new Date();
  await ZCOMPayment.update(
    { order_number },
    {
      $set: {
        created_at,
        user_id,
        zcom_user_id,
        contract_code,
        mode,
        connect_page_id,
      },
    },
    { upsert: true, multi: false }
  );
};

module.exports = {
  fillProductInformation,
  fillUserInformation,
  fillOrderHeaders,
  fillFormByKeyValue,
  getZComResult,
  addParameterToURL,
  getUserCryptKey,
  getConnectPage,
  getVariableValue,
  getVariableValueById,
  insertValueToMessageVariable,
  requestCheckOrder,
  getZComResultObject,
  getPaymentSettings,
  saveZCOMPayment,
  getZComPayment,
};
