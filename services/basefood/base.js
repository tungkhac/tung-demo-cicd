// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const axios = require("axios");
const qs = require("querystring");
const moment = require("moment");
const { PROVINCES } = require("./constants");

const baseProcess = async (body, apiUri) => {
  try {
    console.log(`【${moment()}】>>/basefood/${apiUri}::request.body<<`, body);
    const baseUrl = body.request_url;
    delete body.request_url;
    console.log(qs.stringify(body));
    return await axios
      .post(`${baseUrl}${apiUri}`, qs.stringify(body), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });
  } catch (error) {
    console.error(`【${moment()}】>>/basefood/${apiUri}::Error<<`, error);
    return { status: 500, data: error };
  }
};

const baseProcessForGet = async (body, apiUri) => {
  try {
    console.log(`【${moment()}】>>/basefood/${apiUri}<<`);
    const baseUrl = body.request_url;
    delete body.request_url;
    return await axios
      .get(`${baseUrl}${apiUri}`)
      .then((response) => response)
      .catch((error) => {
        return error.response;
      });
  } catch (error) {
    console.error(`【${moment()}】>>/basefood/${apiUri}::Error<<`, error);
    return { status: 500, data: error };
  }
};

const getShippingAddress = (body) => {
  const {
    last_name,
    first_name,
    email,
    phone,
    zip,
    province,
    city,
    address_line1,
    address_line2,
  } = body;
  return JSON.stringify({
    last_name: last_name || "",
    first_name: first_name || "",
    email: email || "",
    phone: phone || "",
    zip: zip || "",
    province: province ? `JP-${PROVINCES[province]}` : "",
    city: city || "",
    address_line1: address_line1 || "",
    address_line2: address_line2 || "",
  });
};

const getPaymentData = (body) => {
  const { payment_method, stripe_token, last4, payment_data } = body;
  console.log(payment_data);
  switch (payment_method) {
    case 'credit':
      return JSON.stringify(
        stripe_token ? { stripe_token, last4: last4 || "" } : {}
      );
    case 'amazon':
      console.log(JSON.stringify({ amazon_billing_agreement_id: payment_data }));
      return JSON.stringify(
        payment_data ? { amazon_billing_agreement_id: payment_data } : {}
      );
    default:
        return '{}';
  }
};

module.exports = {
  baseProcess,
  getShippingAddress,
  getPaymentData,
  baseProcessForGet,
};
