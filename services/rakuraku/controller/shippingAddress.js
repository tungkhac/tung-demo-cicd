// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const axios = require("axios");
const {
  RAKURAKU_API,
  GET_CUSTOMER_DELIVERY,
  CREATE_CUSTOMER_DELIVERY,
  GUEST,
} = require("../constants");
const { get } = require("lodash");
const qs = require("querystring");
const { generateLog } = require("../helper");

const fetchShippingAddress = async (customer_id, access_token) => {
  const result = await axios.post(
    RAKURAKU_API + GET_CUSTOMER_DELIVERY,
    qs.stringify({
      "search_options[customer_id_from]": customer_id,
      "search_options[customer_id_to]": customer_id,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const { success, response } = get(result, "data") || {};
  const customer_delivery = get(
    response,
    "customer_deliveries[0].customer_delivery"
  );
  if (success === "ok" && customer_delivery) {
    return customer_delivery;
  }
};

const getShippingAddressByIndex = async (req, res) => {
  const { customer_id, shipping_address_index, access_token } = req.body;
  if (!customer_id) res.status(200).json({});
  try {
    const customer_delivery = await fetchShippingAddress(
      customer_id,
      access_token
    );
    if (customer_delivery && customer_delivery[shipping_address_index]) {
      const delivery = customer_delivery[shipping_address_index];
      return res.status(200).json({
        delivery_name01: delivery.name01,
        delivery_name02: delivery.name02,
        delivery_kana01: delivery.kana01,
        delivery_kana02: delivery.kana02,
        delivery_zip: delivery.zip,
        delivery_pref: delivery.pref,
        delivery_addr01: delivery.addr01,
        delivery_addr02: delivery.addr02,
        delivery_tel: delivery.tel,
      });
    }
    return res
      .status(400)
      .json({ error_message: `/set-shipping-address error` });
  } catch (err) {
    console.log(generateLog("/set-shipping-address error", err));
    return res
      .status(400)
      .json({ error_message: `/set-shipping-address error` });
  }
};

const getShippingAddressOptions = async (req, res) => {
  const { customer_id, access_token } = req.body;
  if (!customer_id) return null;
  try {
    const customer_delivery = await fetchShippingAddress(
      customer_id,
      access_token
    );
    return res.status(200).json({
      data:
        customer_delivery &&
        customer_delivery
          .map((delivery, i) => {
            const { name01, name02, pref, addr01, addr02, tel, zip } = delivery;
            return {
              text: `${name01} ${name02} - ${zip} ${pref} ${addr01} ${addr02} - ${tel}`,
              value: i,
            };
          })
          .concat([
            {
              text: "New shipping address",
              value: -1,
            },
          ]),
    });
  } catch (err) {
    console.log(
      generateLog("/get-shipping-address-options", {
        err,
        message: err.message,
      })
    );
    return res
      .status(400)
      .json({ error_message: `/get-shipping-address-options error` });
  }
};

const addShippingAddress = async (req, res) => {
  const {
    customer_id,
    access_token,
    shipping_first_name,
    shipping_last_name,
    shipping_furigana_first,
    shipping_furigana_last,
    shipping_zipcode,
    shipping_pref,
    shipping_address01,
    shipping_address02,
    shipping_phone_number,
    user_type,
  } = req.body;
  try {
    if (user_type == GUEST) {
      //for login or register cases then call API to save the new shipping address
      //user_type == 2 means this user is a guest and doesn't have accounts => don't make API because API needs customer_id
      return res.status(200).json({ });
    }
    const custom_shipping_zipcode = shipping_zipcode.split("");
    custom_shipping_zipcode.splice(3, 0, "-");
    const result = await axios.post(
      RAKURAKU_API + CREATE_CUSTOMER_DELIVERY,
      qs.stringify({
        customer_deliveries: JSON.stringify([
          {
            customer: {
              customer_id: customer_id,
            },
            customer_delivery: [
              {
                other_deliv_id: "",
                trade_code: "",
                name01: shipping_first_name,
                name02: shipping_last_name,
                kana01: shipping_furigana_first,
                kana02: shipping_furigana_last,
                zip: custom_shipping_zipcode.join(""),
                pref: shipping_pref,
                addr01: shipping_address01,
                addr02: shipping_address02,
                tel: shipping_phone_number,
              },
            ],
          },
        ]),
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const { response } = get(result, "data") || {};
    const { result: _result, log_info } = get(
      response,
      "customer_deliveries[0]"
    );
    console.log(generateLog("/add-shipping-address response", response));
    if (_result === 1) {
      return res.status(200).json({ });
    }
    res.status(400).json({ error_message: log_info });
  } catch (err) {
    console.log(
      generateLog("/add-shipping-address", { err, message: err.message })
    );
    res.status(400).json({ error_message: `/add-shipping-address error` });
  }
};

module.exports = {
  fetchShippingAddress,
  getShippingAddressOptions,
  getShippingAddressByIndex,
  addShippingAddress,
};
