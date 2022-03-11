// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const get = require("lodash/get");
const axios = require("axios");
const FormData = require("form-data");
const parseString = require("xml2js").parseString;
const mongoose = require("mongoose");
const config = require("config");
const cryptor = require("../../../routes/crypto");
const TIMEZONE = config.get("timezone");
const {
  Connect,
  EfoPOrderSetting,
  PaymentGateway,
  EfoCv,
  Variable,
} = require("../../../model");
const {
  fillProductInformation,
  fillUserInformation,
  fillOrderHeaders,
  getZComResult,
  getConnectPage,
  getVariableValueById,
  getPaymentSettings,
  insertValueToMessageVariable,
  saveZCOMPayment,
} = require("../common");

const {
  PAYMENT_ZCOM_TYPE,
  TYPE_EFO_PAYMENT_METHOD_SETTING_YES,
  defaultErrorMessage,
  cgiURLs,
} = require("../constants");

const randomOrderNumber = async (req, res) => {
  const length = 10;
  let order_number = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    order_number += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  res.json({ order_number });
};

const requestReceiveOrder = (body) => {
  /* istanbul ignore if */
  if (!body) return;
  return new Promise((resolve) => {
    const url =
      body.mode == "production"
        ? cgiURLs.receiveOrder.production
        : cgiURLs.receiveOrder.test;
    const form = new FormData();
    try {
      fillOrderHeaders(form, body);
      fillUserInformation(form, body);
      fillProductInformation(form, body);
      form.append("st_code", "00000-00000-10000-00000-00000-00000-00000");
      form.append("mission_code", "1");
      form.append("currency_id", "TWD");
      axios
        .post(url, form, { headers: form.getHeaders() })
        .then((response) => {
          const xml = response ? response.data : "";
          if (xml) {
            parseString(xml, (error, json) => {
              const redirect = getZComResult(json, "redirect");
              resolve(redirect);
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

const createPayment = async (req, res, next) => {
  const body = req.body;
  const connect_page_id = body.connect_page_id,
    user_id = body.user_id,
    user_name = body.user_name || "",
    user_mail_add = body.user_mail_add || "",
    item_code = body.item_code || "",
    item_name = body.item_name || "",
    item_price = body.item_price,
    order_number = body.order_number,
    zcom_user_id = body.zcom_user_id,
    lang_id = body.lang_id;

  const params = {
    connect_page_id,
    user_id,
    user_name,
    user_mail_add,
    item_code,
    item_name,
    item_price,
    order_number,
    zcom_user_id,
    lang_id,
  };

  const connectPage = await getConnectPage(connect_page_id, user_id);
  if (!connectPage) {
    return res.status(400).json({ error_message: defaultErrorMessage });
  }
  params.encrypt_flg = connectPage.encrypt_flg;
  params.encrypt_key = connectPage.encrypt_key;
  params.connect_id = connectPage.connect_id;

  const paymentGateway = await getPaymentGateway(params);
  if (!paymentGateway) {
    return res.status(400).json({ error_message: defaultErrorMessage });
  }

  params.contract_code = paymentGateway.contract_code;
  params.mode = paymentGateway.mode;
  const redirectURL = await requestReceiveOrder(params);
  if (redirectURL) {
    const orderData = {
      connect_page_id,
      user_id,
      user_name,
      user_mail_add,
      item_code,
      item_name,
      item_price,
      order_number,
      lang_id,
      zcom_user_id,
      contract_code: params.contract_code,
      mode: params.mode,
    };
    const orderDataString = JSON.stringify(orderData);
    await insertValueToMessageVariable(
      connect_page_id,
      user_id,
      "zcom_order_data",
      orderDataString
    );
    await saveZCOMPayment(
      connect_page_id,
      user_id,
      params.contract_code,
      params.mode,
      order_number,
      zcom_user_id
    );
    return res.status(200).json({
      zcom_payment_url: decodeURIComponent(redirectURL),
      status: 1,
    });
  }
  return res.status(400).json({ error_message: defaultErrorMessage });
};

const getPaymentGateway = async (params) => {
  const connect = await Connect.findOne({ _id: params.connect_id });
  if (!connect) return;

  const paymentGateways = await PaymentGateway.find({
    user_id: connect.user_id,
    provider: PAYMENT_ZCOM_TYPE,
  });
  if (!Array.isArray(paymentGateways) || paymentGateways.length == 0) return;
  let paymentGateway;
  paymentGateways.forEach((gateway) => {
    if (gateway.default_flg == 1) {
      paymentGateway = gateway;
    }
  });
  if (!paymentGateway) {
    paymentGateway = paymentGateways[0];
  }
  const settings = await getPaymentSettings(params.connect_page_id);
  if (Array.isArray(settings) && settings.length > 0) {
    const setting = settings[0];
    /* istanbul ignore else */
    if (
      setting.payment_gateway_setting == TYPE_EFO_PAYMENT_METHOD_SETTING_YES
    ) {
      const variable_payment_method = setting.variable_payment_method;
      const gatewaySetting = setting.gateway_setting;
      /* istanbul ignore else */
      if (
        typeof variable_payment_method !== "undefined" &&
        mongoose.Types.ObjectId.isValid(variable_payment_method) &&
        typeof gatewaySetting !== "undefined"
      ) {
        params.variable_id = variable_payment_method;
        const variable_result = await getVariableValueById(
          params.connect_page_id,
          params.user_id,
          variable_payment_method,
          params.encrypt_key
        );
        let variable_value = null;
        /* istanbul ignore if */
        if (
          variable_result[variable_payment_method] != void 0 &&
          variable_result[variable_payment_method].value != void 0
        ) {
          variable_value = variable_result[variable_payment_method].value;
        } /* istanbul ignore else */ else if (
          variable_result[variable_payment_method] != void 0 &&
          variable_result[variable_payment_method] != void 0
        ) {
          variable_value = variable_result[variable_payment_method];
        }
        /* istanbul ignore else */
        if (variable_value) {
          /* istanbul ignore else */
          if (gatewaySetting[variable_value] !== void 0) {
            paymentGateways.forEach((gateway) => {
              /* istanbul ignore else */
              if (gateway._id == gatewaySetting[variable_value]) {
                paymentGateway = gateway;
              }
            });
          }
        }
      }
    }
  }
  return paymentGateway;
};

module.exports = { randomOrderNumber, createPayment, getPaymentGateway };
