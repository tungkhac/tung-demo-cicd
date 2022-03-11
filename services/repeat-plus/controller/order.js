// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const get = require("lodash/get");
const first = require("lodash/first");
const isEmpty = require("lodash/isEmpty");
const moment = require("moment");

const {
  API,
  defaultErrorMessage,
  RECOMMEND_FLAG,
  AFTER_ORDER_RECOMMEND_FLAG,
} = require("../constants");
const { SHA256 } = require("../../../util");
const { apiRequest } = require("../base");
const {
  formatZipCode,
  formatDate,
  formatNull,
  formatTelephone,
  removeDash,
  formatOrderDevice,
  isDoubleByteString,
} = require("../format-data");

const getShipping = (req, res) => {
  try {
    const data = JSON.parse(get(req.body, "user_shipping")).map((shipping) => ({
      value: get(shipping, "shipping_no"),
      text: `${get(shipping, "shipping_name")}-${get(
        shipping,
        "shipping_addr1"
      )}-${get(shipping, "shipping_tel1")}`,
    }));
    data.push({
      value: "new",
      text: "上記とは別の住所に届ける",
    });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error_message: defaultErrorMessage });
  }
};

const getShippingById = (userShipping, shippingNo) => {
  const data = JSON.parse(userShipping).filter(
    (shipping) => get(shipping, "shipping_no") == shippingNo
  );
  return first(data);
};

const getDateShipping = (req, res) => {
  try {
    res.json({
      data: JSON.parse(get(req.body, "shipping_date_list")).map((date) => ({
        value: formatDate(date),
        text: date,
      })),
    });
  } catch (error) {
    res.status(500).json({ error_message: defaultErrorMessage });
  }
};

const getTimeShipping = (req, res) => {
  try {
    res.json({
      data: JSON.parse(get(req.body, "shipping_time_list")).map((time) => ({
        value: get(time, "shipping_time_id"),
        text: get(time, "shipping_time_message"),
      })),
    });
  } catch (error) {
    res.status(500).json({ error_message: defaultErrorMessage });
  }
};

const getAfterOrderRecommendFlag = (body) => {
  const afterOrderRecommendFlag = get(body, "after_order_recommend_flag");
  if (afterOrderRecommendFlag == "1" || afterOrderRecommendFlag == "2") {
    return afterOrderRecommendFlag;
  }
};

const getCartInfo = (body, isOrder) => {
  const loginType = get(body, "login_type");
  return {
    user_id: get(body, "user_id") || "",
    order_division: get(body, "order_division"),
    cart_id:
      loginType && loginType === "2" ? "" : formatNull(get(body, "cart_id")),
    order_kbn: formatOrderDevice(get(body, "device")),
    adv_code: formatNull(get(body, "adv_code")),
    recommend_flag: isOrder
      ? 0
      : get(body, "recommend_type") == RECOMMEND_FLAG.NO_RECOMMEND
      ? 0
      : get(body, "recommend_flag"),
    old_order_id: formatNull(get(body, "order_id")),
    after_order_recommend_flag: formatNull(getAfterOrderRecommendFlag(body)),
  };
};

const getCourseBuySetting = (body) => {
  const {
    course_buy_setting,
    fixed_purchase_kbn,
    course_buy_setting_x,
    course_buy_setting_y,
    course_buy_setting_z,
  } = body;
  if (course_buy_setting && typeof course_buy_setting == "string") {
    return course_buy_setting;
  }
  const settings = [];
  if (
    fixed_purchase_kbn == "01" &&
    course_buy_setting_x &&
    course_buy_setting_y
  ) {
    settings.push(course_buy_setting_x);
    settings.push(course_buy_setting_y);
  } else if (
    fixed_purchase_kbn == "02" &&
    course_buy_setting_x &&
    course_buy_setting_y &&
    (course_buy_setting_z || course_buy_setting_z == 0)
  ) {
    settings.push(course_buy_setting_x);
    settings.push(course_buy_setting_y);
    settings.push(course_buy_setting_z);
  } else if (fixed_purchase_kbn == "03" && course_buy_setting_x) {
    settings.push(course_buy_setting_x);
  }
  return settings.join() || undefined;
};

const getOrderShipping = (body) => {
  const shippingNo = get(body, "shipping_no");
  const data = ["new", "same"].includes(shippingNo)
    ? body
    : getShippingById(get(body, "user_shipping"), shippingNo);

  return {
    name:
      shippingNo == "same"
        ? `${get(data, "order_owner_name1")}　${get(data, "order_owner_name2")}`
        : get(data, "name"),
    shipping_name:
      shippingNo == "same"
        ? `${get(data, "order_owner_name1")}　${get(data, "order_owner_name2")}`
        : `${get(data, "shipping_name1")}　${get(data, "shipping_name2")}`,
    shipping_name1:
      shippingNo == "same"
        ? get(data, "order_owner_name1")
        : get(data, "shipping_name1"),
    shipping_name2:
      shippingNo == "same"
        ? get(data, "order_owner_name2")
        : get(data, "shipping_name2"),
    shipping_name_kana:
      shippingNo == "same"
        ? `${get(data, "order_owner_name_kana1")}${get(
            data,
            "order_owner_name_kana2"
          )}`
        : `${get(data, "shipping_name_kana1")}${get(
            data,
            "shipping_name_kana2"
          )}`,
    shipping_name_kana1:
      shippingNo == "same"
        ? get(data, "order_owner_name_kana1")
        : get(data, "shipping_name_kana1"),
    shipping_name_kana2:
      shippingNo == "same"
        ? get(data, "order_owner_name_kana2")
        : get(data, "shipping_name_kana2"),
    shipping_zip: formatZipCode(
      get(data, shippingNo == "same" ? "owner_post_code" : "shipping_zip")
    ),
    shipping_addr1: get(
      data,
      shippingNo == "same" ? "owner_address_1" : "shipping_addr1"
    ),
    shipping_addr2: get(
      data,
      shippingNo == "same" ? "owner_address_2" : "shipping_addr2"
    ),
    shipping_addr3: get(
      data,
      shippingNo == "same" ? "owner_address_3" : "shipping_addr3"
    ),
    shipping_addr4: get(
      data,
      shippingNo == "same" ? "owner_address_4" : "shipping_addr4"
    ),
    shipping_tel1: formatTelephone(
      get(data, shippingNo == "same" ? "order_owner_tel1" : "shipping_tel1")
    ),
    shipping_company_name: get(data, "shipping_company_name"),
    shipping_company_post_name: get(data, "shipping_company_post_name"),
    shipping_date: formatNull(get(body, "shipping_date")),
    shipping_time: formatNull(get(body, "shipping_time")),
    fixed_purchase_kbn: get(body, "fixed_purchase_kbn") || undefined,
    course_buy_setting: getCourseBuySetting(body),
  };
};

const getOrderPaymentInfo = (body) => {
  const cartNumber = formatNull(get(body, "credit_card_no"));
  const creditToken = formatNull(get(body, "credit_token"));
  return {
    payment_id: get(body, "payment_id"),
    credit_token: creditToken ? creditToken.replace(",", " ") : creditToken,
    credit_card_no: cartNumber && `000000000000${cartNumber}`,
    expiration_month: formatNull(get(body, "expiration_month")),
    expiration_year: formatNull(get(body, "expiration_year")),
    author_name: formatNull(get(body, "author_name")),
    credit_security_code: 687,
    credit_installments: cartNumber && "01",
    credit_regist_flag: get(body, "credit_regist_flag") || 0,
    credit_regist_name: formatNull(get(body, "credit_regist_name")),
  };
};

const getDiscountInfo = (body) => {
  return {
    order_point_use: 0,
    coupon_code: formatNull(get(body, "coupon_code")),
  };
};

const getProduct = (productId, products) => {
  return JSON.parse(products)
    .map((p) => ({
      product_id: get(p.product, "product_id"),
      variation_id: get(p.product_stock, "variation_id"),
      product_count: 1,
    }))
    .filter((product) => get(product, "product_id") == productId);
};

const getOrderProducts = (body) => {
  const products = get(body, "product_detail");
  const productId = get(body, "product_id");
  /* istanbul ignore else */
  if (typeof productId == "string") return getProduct(productId, products);
  /* istanbul ignore next: may not come here*/
  return JSON.parse(productId)
    .map((id) => getProduct(id, products))
    .filter((productItem) => !isEmpty(productItem));
};

const convertRecommendRadio = (param) => {
  return param && param != ""
    ? param.split(",").map((p) => ({
        product_id: p.split("-/-")[0],
        variation_id: p.split("-/-")[1],
        product_count: p.split("-/-")[2],
      }))
    : [];
};

const getRecommendOrders = (body) => {
  const orderProducts = getOrderProducts(body);
  switch (get(body, "recommend_type")) {
    case 1:
      const upSaleProducts = convertRecommendRadio(
        get(body, "up_sale_product_list")
      );
      return upSaleProducts.length > 0 ? upSaleProducts : orderProducts;
    case 2:
      return orderProducts.concat(
        convertRecommendRadio(get(body, "cross_sale_product_list"))
      );
    default:
      return orderProducts;
  }
};

const getOrderOwner = (body) => {
  return {
    name1: get(body, "order_owner_name1"),
    name2: get(body, "order_owner_name2"),
    name_kana1: get(body, "order_owner_name_kana1"),
    name_kana2: get(body, "order_owner_name_kana2"),
    birth: removeDash(get(body, "order_owner_birth")),
    sex: get(body, "order_owner_sex"),
    mail_addr: get(body, "order_owner_mail_addr"),
    zip: get(body, "owner_post_code"),
    addr1: get(body, "owner_address_1"),
    addr2: get(body, "owner_address_2"),
    addr3: get(body, "owner_address_3"),
    addr4: get(body, "owner_address_4"),
    tel1: formatTelephone(get(body, "order_owner_tel1")),
  };
};

const getRecalculationData = (body, isOrder) => {
  return JSON.stringify({
    cart: getCartInfo(body, isOrder),
    order_shipping_info: getOrderShipping(body),
    order_owner: getOrderOwner(body),
    order_payment_info: getOrderPaymentInfo(body),
    discount_info: getDiscountInfo(body),
    order_product_list: getRecommendOrders(body),
    auth_text: SHA256(get(body, "api-key")),
  });
};

const getRecommendType = (orderInfo, body) => {
  if (get(body, "recommend_type") && get(body, "recommend_type") != "0")
    return get(body, "recommend_type");
  const product = get(orderInfo, "recommend_originally_product_list");
  return product
    ? RECOMMEND_FLAG[`${get(first(product), "recommend_kbn")}`]
    : 0;
};

const getRecommendProduct = (orderInfo) => {
  const recommendOriginallyProducts = get(
    orderInfo,
    "recommend_originally_product_list",
    []
  );
  return get(orderInfo, "order_product_list", []).filter((orderProduct) =>
    recommendOriginallyProducts
      .map((product) => get(product, "recommend_product_id"))
      .includes(get(orderProduct, "product_id"))
  );
};

const getRecalculationResponse = (orderInfo, body) => {
  return {
    order_product_list: JSON.stringify(get(orderInfo, "order_product_list")),
    shipping_date_list: JSON.stringify(get(orderInfo, "shipping_date_list")),
    shipping_time_list: JSON.stringify(get(orderInfo, "shipping_time_list")),
    recommend_type: getRecommendType(orderInfo, body),
    recommend_product_list: JSON.stringify(getRecommendProduct(orderInfo)),
    ...get(orderInfo, "cart"),
    ...get(orderInfo, "receive_order_info"),
    ...get(orderInfo, "cart"),
  };
};

const handleRecalculationError = (error) => {
  return first(get(error, "error.response.data.data")) || defaultErrorMessage;
};

const recalculation = async (req, res) => {
  try {
    const recalculationData = getRecalculationData(req.body);
    console.log(
      `【${moment()}】>>/repeat-plus/recalculation::request.body<<`,
      recalculationData
    );

    res.json(
      getRecalculationResponse(
        await apiRequest(
          `${get(req.body, "request_url")}${API.recalculation}`,
          recalculationData
        ),
        req.body
      )
    );
  } catch (error) {
    console.log(
      `【${moment()}】>>/repeat-plus/recalculation::ERROR<<`,
      get(error, "error.response.data")
        ? JSON.stringify(get(error, "error.response.data"))
        : error
    );
    res.status(500).json({ error_message: handleRecalculationError(error) });
  }
};

const createOrder = async (req, res) => {
  try {
    // console.log(
    //   `【${moment()}】>>/repeat-plus/order::req.body<<`,
    //   JSON.stringify(req.body)
    // );
    const orderData = getRecalculationData(req.body, true);
    console.log(`【${moment()}】>>/repeat-plus/order::orderData<<`, orderData);
    const response = await apiRequest(
      `${get(req.body, "request_url")}${API.order}`,
      orderData
    );
    // console.log(
    //   `【${moment()}】>>/repeat-plus/order::response<<`,
    //   JSON.stringify(response)
    // );
    res.json(response);
  } catch (error) {
    console.log(
      `【${moment()}】>>/repeat-plus/order<<`,
      get(error, "error.response.data")
        ? JSON.stringify(get(error, "error.response.data"))
        : error
    );
    res.status(500).json({ error_message: defaultErrorMessage });
  }
};

const getAfterOrderRecommends = async (req, res) => {
  try {
    // console.log(
    //   `【${moment()}】>>/repeat-plus/product/afterOrderRecommends::request.body<<`,
    //   JSON.stringify(req.body)
    // );
    const orderData = getRecalculationData(req.body, true);
    console.log(
      `【${moment()}】>>/repeat-plus/product/afterOrderRecommends::orderData<<`,
      orderData
    );
    const data = await apiRequest(
      `${get(req.body, "request_url")}${API.order}`,
      orderData
    );
    // console.log(
    //   `【${moment()}】>>/repeat-plus/product/afterOrderRecommends::data<<`,
    //   data
    // );
    res.json({
      after_order_recommend_flag: 1,
      after_recommend_products_description: getAfterOrderRecommendsDescription(
        data
      ),
    });
  } catch (error) {
    console.log(
      `【${moment()}】>>/repeat-plus/get-after-order-recommends<<`,
      get(error, "error.response.data")
        ? JSON.stringify(get(error, "error.response.data"))
        : error
    );
    res.json({
      after_order_recommend_flag: 0,
    });
  }
};

const getAfterOrderRecommendsDescription = (orderInfo) => {
  let description = "";
  const afterOrderProducts = get(orderInfo, "order_product_list");
  if (
    afterOrderProducts &&
    Array.isArray(afterOrderProducts) &&
    afterOrderProducts.length > 0
  ) {
    const data = afterOrderProducts.map((product) => ({
      text: `[${get(product, "product_name")}] - 単価: ¥${get(
        product,
        "item_price"
      )} - 個数: ${get(product, "item_quantity")} - 消費税率: ${get(
        product,
        "product_tax_rate"
      )}%`,
    }));
    data.forEach((product) => {
      description += `${product.text}, `;
    });
  }
  return description;
};

const getRecommendList = (req, res) => {
  try {
    const data = JSON.parse(get(req.body, "recommend_product_list")).map(
      (product) => ({
        value: `${get(product, "product_id")}-/-${get(
          product,
          "variation_id"
        )}-/-${get(product, "item_quantity")}`,
        text: `[${get(product, "product_name")}] - 単価: ¥${get(
          product,
          "item_price"
        )} - 個数: ${get(product, "item_quantity")}`,
      })
    );
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error_message: defaultErrorMessage });
  }
};

const verifyAddress = async (req, res) => {
  console.log(
    `【${moment()}】>>/repeat-plus/verifyAddress::req.body<<`,
    req.body
  );
  const { addr1, addr2, addr3, addr4 } = req.body;
  if (
    isDoubleByteString(addr1) &&
    isDoubleByteString(addr2) &&
    isDoubleByteString(addr3)
  ) {
    if (isEmpty(addr4) || isDoubleByteString(addr4)) {
      res.status(200).json({
        status: "valid",
      });
      return;
    }
  }
  res.status(400).json({ error_message: "全角文字をご入力ください。" });
};

const getEarliestDeliveryDay = async (req, res) => {
  try {
    const data = JSON.parse(get(req.body, "shipping_date_list")).map(
      (date) => ({
        value: formatDate(date),
        text: date,
      })
    );
    const date = first(data).value;
    res.json({ date });
  } catch (error) {
    res.status(500).json({ error_message: defaultErrorMessage });
  }
};

module.exports = {
  getShipping,
  recalculation,
  createOrder,
  getDateShipping,
  getTimeShipping,
  getRecommendList,
  getAfterOrderRecommends,
  verifyAddress,
  getEarliestDeliveryDay,
};
