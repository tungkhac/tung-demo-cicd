// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const axios = require("axios");
const {
  RAKURAKU_API,
  CREATE_ORDER,
  PAYMENT_TYPE_COD,
  PAYMENT_TYPE_CREDIT_CARD,
  LOGIN,
  REGISTER,
  GUEST,
} = require("../constants");
const { get } = require("lodash");
const moment = require("moment");
const qs = require("querystring");
const {
  generateRandomId,
  generateLog,
  getGMOMemberID,
  getPeriodicalOrderData,
  getFixedData,
} = require("../helper");
const {
  createMember,
  searchMember,
  addCard,
  entryTran,
  execTran,
} = require("../GMO");
const { updateCustomer } = require("./auth");

const order = async (req, res) => {
  const {
    user_type,
    customer_id,
    payment_type,
    siteID,
    sitePass,
    shopID,
    shopPass,
    card_seq,
    card_token,
    access_token,
    amount = "10000",
  } = req.body;
  console.log(generateLog("/order params", req.body));
  try {
    let order_id = null;
    if (payment_type == PAYMENT_TYPE_COD) {
      const result = await createOrder(req.body, {
        ec_order_id: generateRandomId(),
      });
      order_id = result.order_id;
    } else if (payment_type == PAYMENT_TYPE_CREDIT_CARD) {
      //generate GMO MemberID, if guest => generate a new one, if login or register => Raku customer_id
      const GMOMemberID = getGMOMemberID(user_type, customer_id);

      // check whether GMO MemberID above was existed, if not existed then create, else do nothing
      const isExistedGMOMember = await searchMember({
        memberID: GMOMemberID,
        siteID,
        sitePass,
      });
      if (!isExistedGMOMember) {
        await createMember({
          memberID: GMOMemberID,
          memberName: "",
          siteID,
          sitePass,
        });
      }

      //if login or register case, update gmo_customer_id of the Raku customer as GMOMemberID
      if (user_type != GUEST) {
        await updateCustomer(
          {
            gmo_member_id: GMOMemberID,
          },
          customer_id,
          access_token
        );
      }

      let cardSeq = card_seq;
      //card_seq == "-1" means users choose add a new credit card to do payment
      if (card_token && card_seq == "-1") {
        const { cardSeq: newCardSeq } = await addCard({
          token: card_token,
          memberID: GMOMemberID,
          siteID,
          sitePass,
        });
        cardSeq = newCardSeq;
      }

      //do payment in GMO site
      const ec_order_id = generateRandomId();
      const { accessID, accessPass } = await entryTran({
        orderID: ec_order_id,
        amount,
        shopID,
        shopPass,
      });
      await execTran({
        orderID: ec_order_id,
        accessID,
        accessPass,
        memberID: GMOMemberID,
        cardSeq,
        siteID,
        sitePass,
      });

      const otherData = {
        gmo_auth_id: accessID,
        gmo_auth_pass: accessPass,
        gmo_order_id: ec_order_id,
        gmo_customer_id: GMOMemberID,
        gmo_card_seq: cardSeq,
        ec_order_id: ec_order_id,
      };

      const result = await createOrder(req.body, otherData);
      order_id = result.order_id;
    }
    if (order_id) {
      return res.status(200).json({ order_id });
    }
    return res.status(400).json({ error_message: `Server errors` });
  } catch (err) {
    console.log(err);
    console.log(generateLog("/order error", (err && err.message) || err));
    return res
      .status(400)
      .json({ error_message: (err && err.message) || err || "Server error" });
  }
};

const createOrder = async (data, /* istanbul ignore next */otherData = {}) => {
  const fixedOrderData = getFixedData(data);
  const periodicalOrderData = getPeriodicalOrderData(data);
  const {
    user_type,
    customer_id,
    access_token,
    shipping_tel,
    shipping_zip,
    shipping_pref,
    shipping_addr01,
    shipping_addr02,
    shipping_name01,
    shipping_name02,
    shipping_kana01,
    shipping_kana02,
    customer_email,
    customer_tel,
    customer_zip,
    customer_pref,
    customer_addr01,
    customer_addr02,
    customer_name01,
    customer_name02,
    customer_kana01,
    customer_kana02,
    payment_type,
  } = data;
  const order = {
    ...fixedOrderData,
    shipping: {
      ...(fixedOrderData.shipping || {}),
      shipping_tel,
      shipping_zip,
      shipping_pref,
      shipping_addr01,
      shipping_addr02,
      shipping_name01,
      shipping_name02,
      shipping_kana01,
      shipping_kana02,
    },
    order: {
      ...(fixedOrderData.order || {}),
      ...otherData,
      customer_id:
        user_type == LOGIN || user_type == REGISTER ? customer_id : "0",
      order_name01: customer_name01,
      order_name02: customer_name02,
      order_kana01: customer_kana01,
      order_kana02: customer_kana02,
      order_email: customer_email,
      order_tel: customer_tel,
      order_zip: customer_zip,
      order_pref: customer_pref,
      order_addr01: customer_addr01,
      order_addr02: customer_addr02,
      payment_id: payment_type,
      order_date: moment().format("YYYY-MM-DD HH:mm:ss"),
    },
    periodical_order: {
      ...periodicalOrderData,
    },
  };

  try {
    console.log(generateLog("createOrder orderData", order));
    const result = await axios.post(
      RAKURAKU_API + CREATE_ORDER,
      qs.stringify({ orders: JSON.stringify([order]) }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const { success, response } = get(result, "data") || {};
    const { id, log_info, result: _result } = get(response, "orders[0]");
    console.log(generateLog("createOrder response", { success, response }));
    if (_result === 1) {
      /* istanbul ignore else */
      if (id) {
        return {
          order_id: id,
        };
      }
    }
    throw log_info;
  } catch (err) {
    console.log(generateLog("createOrder error orderData", order));
    throw err;
  }
};

module.exports = {
  order,
};
