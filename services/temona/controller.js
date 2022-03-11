// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const moment = require("moment");
const axios = require("axios");
const { isUri } = require("valid-url");

const { isNumber, get, toNumber, isArray, groupBy } = require("lodash");
// const { ApiEfoEc } = require("../../model");
const {
  httpsAgent,
  responseType,
  headers,
  states,
  api,
  defaultErrorMessage,
  loginErrorMessage,
} = require("./constants");

const {
  getGender,
  getBirthday,
  getFrequencyId,
  getOrderItems,
  logException,
  isObject,
  getFrequenciesFromResponse,
  getVariantsFromResponse,
  productVariantsFromResponse,
  getTrueValue,
  getCustomerDetailFromResponse,
  getRegularCourseListFromResponse,
  getRegularCourseDetailFromResponse,
  getUpdatedRegularCourseData,
  getStopRegularCourseData,
  getPeriodicListFromResponse,
  getTimeZoneListFromResponse,
  getCourseConditionFromResponse,
} = require("./common");

const isNotEmptyString = (str) =>
  str && typeof str === "string" && str.length > 0;

const stateId = (name) =>
  isNotEmptyString(name) && states[name] ? states[name] : 0;

const Log4js = require("log4js");
const logger = Log4js.getLogger("temona");

const requestAuth = async (requestBody) => {
  const { cpid, user_id, client_id, client_secret, request_url } = requestBody;
  // const now = new Date();
  try {
    // const result = await ApiEfoEc.findOneAndUpdate(
    //   { cpid, user_id },
    //   {
    //     $set: {
    //       update_at: now,
    //     },
    //     $setOnInsert: {
    //       cpid,
    //       user_id,
    //       client_id,
    //       client_secret,
    //       request: requestBody,
    //       created_at: now,
    //     },
    //   },
    //   { upsert: true, multi: false, new: true }
    // );
    // if (result) {
    const response = await axios.post(
      `${request_url}${api.access_tokens}`,
      { client_id, client_secret },
      { headers, httpsAgent, responseType }
    );
    // const _index = result._id;
    const body = response.data;
    if (isNotEmptyString(body.access_token)) {
      // await ApiEfoEc.findOneAndUpdate(
      //   { _id: result._id },
      //   {
      //     $set: {
      //       authentication_token: body.access_token,
      //       response: body,
      //       result: body.access_token,
      //       updated_at: new Date(),
      //     },
      //   },
      //   { upsert: false, multi: false }
      // );
      return body.access_token;
    }
    // await ApiEfoEc.findOneAndUpdate(
    //   { _id: _index },
    //   {
    //     $set: {
    //       result: body.error,
    //       error_code: body.error,
    //       error_message: body.error_description,
    //       error_info: body.error_description,
    //       updated_at: new Date(),
    //     },
    //   },
    //   { upsert: false, multi: false }
    // );
    // }
  } catch (error) {
    logException(requestBody, error);
  }
  return false;
};

const getToken = async (requestBody) => {
  const { cpid, user_id, client_id, client_secret } = requestBody;
  // const result = await ApiEfoEc.findOne({
  //   cpid,
  //   user_id,
  //   client_id,
  //   client_secret,
  // });
  // let token = result ? result.authentication_token : false;
  // if (!token) {
  const token = await requestAuth(requestBody);
  // }
  // console.log('-----> token: ', token);
  return token;
};

const auth = async (req, res, next) => {
  const request_body = req.body;
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(`start /auth with cpid - userid: ${cpid} - ${user_id}`);
  try {
    const token = await requestAuth(req.body);
    if (token) {
      logger.info(`end /auth 200 with cpid - userid: ${cpid} - ${user_id}`);
      res.status(200).json({ token });
      return;
    }
    logger.error(`end /auth 500 with cpid - userid: ${cpid} - ${user_id}`);
    res.status(500).json({ error_message: defaultErrorMessage });
  } catch (err) {
    logException(request_body, err);
    logger.error(`end /auth 500 with cpid - userid: ${cpid} - ${user_id}`);
    res.status(500).json({ error_message: defaultErrorMessage });
  }
};

const searchUser = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(`start /users/search with cpid - userid: ${cpid} - ${user_id}`);
  try {
    const { email, tel, name, request_url } = req.body;
    // console.log(moment(), "---- searchUser --->", req.body);
    const token = await getToken(req.body);
    // console.log(moment(), "---- token --->", token);
    if (!token) {
      logger.error(
        `end /users/search 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      logException(req.body, "authentication_token expired");
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.available_user}`, {
        params: { email, tel, name },
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        if (isObject(response.data)) {
          axios
            .get(`${request_url}${api.user}/${response.data.user_id}`, {
              headers: { ...headers, Authorization: `Bearer ${token}` },
              httpsAgent,
              responseType,
            })
            .then((userResponse) => {
              const extra = {
                login_value: isNumber(get(userResponse.data, "id")) ? 1 : 2,
                zip_code: get(
                  userResponse.data,
                  "user_addresses[0].zip_code",
                  ""
                ),
                state_name: get(
                  userResponse.data,
                  "user_addresses[0].state_name",
                  ""
                ),
                city: get(userResponse.data, "user_addresses[0].city", ""),
                address: get(
                  userResponse.data,
                  "user_addresses[0].address",
                  ""
                ),
                building_name: get(
                  userResponse.data,
                  "user_addresses[0].building_name",
                  ""
                ),
              };
              const resp = { ...userResponse.data, ...extra };
              // console.log(moment(), "searchUser ---> ", resp);
              logger.info(
                `end /users/search 200 with cpid - userid: ${cpid} - ${user_id}`
              );
              res.status(200).json(resp);
            })
            .catch((error) => {
              logger.error(
                `end /users/search 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
              );
              logException(req.body, error);
              res.status(500).json({ error_message: defaultErrorMessage });
            });
        } else {
          // console.log(moment(), " ==> no user found");
          logException(req.body, "no user found");
          logger.error(
            `end /users/search 500 with cpid - userid: ${cpid} - ${user_id}. Error: no user found`
          );
          res.status(200).json({ login_value: 2 });
        }
      })
      .catch((error) => {
        // console.log(moment(), "250 ==> ", error);
        logException(req.body, error);
        logger.error(
          `end /users/search 500 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({ login_value: 2 });
      });
  } catch (err) {
    // console.log(moment(), "254 ==> ", err);
    logException(req.body, err);
    logger.error(
      `end /users/search 500 with cpid - userid: ${cpid} - ${user_id}`
    );
    res.status(500).json({ error_message: err });
  }
};

const productVariants = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /products/variants with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { ids, request_url } = req.body;
    // console.log(moment(), "---- productVariants --->", req.body);
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /products/variants 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.products}`, {
        params: { ids },
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const variant_id = productVariantsFromResponse(ids, response);
        logger.info(
          `end /products/variants 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({ variant_id });
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /products/variants 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        // console.log("---> error: ", error);
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    // console.log("---> err: ", err);
    logException(req.body, err);
    logger.error(
      `end /products/variants 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const searchProduct = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(`start /products with cpid - userid: ${cpid} - ${user_id}`);
  try {
    const { ids, codes, request_url } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /products 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.products}`, {
        params: { ids, codes },
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        logger.info(
          `end /products 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json(response.data);
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /products 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /products 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getProduct = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /products/detail with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { id, request_url } = req.body;
    // console.log(moment(), "---- getProduct --->", req.body);
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /products/detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.products}/${id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const variant_id = get(response.data, "variants[0].id");
        logger.info(
          `end /products/detail 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        // console.log("getProduct 200 ---> ", response.data);
        res.status(200).json({ ...response.data, variant_id });
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /products/detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /products/detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const maxDuration = 100;

const isInt = (value) => {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
};

const isValidDuration = (duration) => {
  return (
    isInt(duration) && Number(duration) > 0 && Number(duration) < maxDuration
  );
};

const preferredDeliveryDay = (fromDate = undefined, duration = 14) => {
  // console.log(moment(), "---> fromDate: ", fromDate);
  const length = isValidDuration(duration) ? Number(duration) : 14;
  const from = 7;
  const dates = [];
  if (!fromDate) {
    for (let i = from; i <= from + length; i++) {
      dates.push(moment().add(i, "days").format("YYYY-MM-DD"));
    }
  } else {
    for (let i = 0; i < length; i++) {
      dates.push(fromDate.clone().add(i, "days").format("YYYY-MM-DD"));
    }
  }
  // console.log(moment(), "---> dates: ", dates);
  return dates;
};

const getPreferredDeliveryDay = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /purchase/get_preferred_delivery_day with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const {
      address_state,
      shipping_address_state,
      shop_shipping_method_id,
      request_url,
      duration,
    } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /purchase/get_preferred_delivery_day 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    let shipping_address_state_id = false;
    if (
      isNotEmptyString(shipping_address_state) &&
      states[shipping_address_state]
    ) {
      shipping_address_state_id = states[shipping_address_state];
    } else if (isNotEmptyString(address_state) && states[address_state]) {
      shipping_address_state_id = states[address_state];
    }
    if (!shipping_address_state_id) {
      logger.info(
        `end /purchase/get_preferred_delivery_day 200 with cpid - userid: ${cpid} - ${user_id}`
      );
      res.status(200).json({
        mode: "available",
        date: preferredDeliveryDay(undefined, duration),
      });
      return;
    }
    axios
      .get(`${request_url}${api.get_preferred_delivery_day}`, {
        params: { shipping_address_state_id, shop_shipping_method_id },
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const fromDate = moment(
          get(response.data, "start_available_next_scheduled_delivery_on"),
          "YYYY-MM-DD"
        );
        logger.info(
          `end /purchase/get_preferred_delivery_day 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({
          mode: "available",
          date: preferredDeliveryDay(fromDate, duration),
        });
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /purchase/get_preferred_delivery_day 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /purchase/get_preferred_delivery_day 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getEarliestDeliveryDay = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /purchase/get_earliest_delivery_day with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const {
      address_state,
      shipping_address_state,
      shop_shipping_method_id,
      request_url,
    } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /purchase/get_earliest_delivery_day 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    let shipping_address_state_id = false;
    if (
      isNotEmptyString(shipping_address_state) &&
      states[shipping_address_state]
    ) {
      shipping_address_state_id = states[shipping_address_state];
    } else if (isNotEmptyString(address_state) && states[address_state]) {
      shipping_address_state_id = states[address_state];
    }
    if (!shipping_address_state_id) {
      const date = moment().add(7, "days").format("YYYY-MM-DD");
      logger.info(
        `end /purchase/get_earliest_delivery_day 200 with cpid - userid: ${cpid} - ${user_id}`
      );
      res.status(200).json({ date });
      return;
    }
    axios
      .get(`${request_url}${api.get_preferred_delivery_day}`, {
        params: { shipping_address_state_id, shop_shipping_method_id },
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const date = get(
          response.data,
          "start_available_next_scheduled_delivery_on"
        );
        if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          logger.error(
            `end /purchase/get_earliest_delivery_day 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
          );
          res.status(500).json({ error_message: defaultErrorMessage });
        } else {
          logger.info(
            `end /purchase/get_earliest_delivery_day 200 with cpid - userid: ${cpid} - ${user_id}`
          );
          res.status(200).json({ date });
        }
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /purchase/get_earliest_delivery_day 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /purchase/get_earliest_delivery_day 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getClientAddress = (body) => {
  const {
    address_state,
    family_name,
    first_name,
    family_name_kana,
    first_name_kana,
    zip_code,
    city,
    address,
    building_name,
    tel,
    email,
  } = body;
  return {
    family_name,
    first_name,
    family_name_kana,
    first_name_kana,
    zip_code,
    state_id: stateId(address_state),
    city,
    address,
    building_name: isNotEmptyString(building_name) ? building_name : undefined,
    tel,
    email,
  };
};

const getShippingAddress = (body, clientAddress) => {
  const { shipping_address_type } = body;
  if (shipping_address_type === "same") {
    return clientAddress;
  }
  const {
    shipping_family_name,
    shipping_first_name,
    shipping_family_name_kana,
    shipping_first_name_kana,
    shipping_zip_code,
    shipping_city,
    shipping_address,
    shipping_building_name,
    shipping_tel,
    shipping_email,
    shipping_address_state,
  } = body;
  const shipping_state_id = stateId(shipping_address_state);
  return {
    family_name: shipping_family_name,
    first_name: shipping_first_name,
    family_name_kana: shipping_family_name_kana,
    first_name_kana: shipping_first_name_kana,
    zip_code: shipping_zip_code,
    state_id: shipping_state_id,
    city: shipping_city,
    address: shipping_address,
    building_name: isNotEmptyString(shipping_building_name)
      ? shipping_building_name
      : undefined,
    tel: shipping_tel,
    email: shipping_email,
  };
};

const getSettlement = (body) => {
  const {
    card_name,
    card_year,
    card_month,
    card_number,
    card_brand,
    card_token,
    payment_method_shop_id,
    // payment_method_id,
    amazon_username,
    amazon_email,
    amazon_order_reference_id,
    amazon_billing_agreement_id,
    amazon_agreement_type,
  } = body;
  const settlement = {
    payment_method_shop_id: toNumber(payment_method_shop_id),
    // payment_method_id: toNumber(payment_method_id),
  };
  if (isNotEmptyString(card_token)) {
    return {
      ...settlement,
      credit_card: {
        holder_name: card_name,
        expire_year: card_year,
        expire_month: card_month,
        masked_card_number: card_number,
        token_key: card_token,
        brand: card_brand,
      },
    };
  } else if (isNotEmptyString(amazon_username)) {
    return {
      ...settlement,
      amazon_pay: {
        amazon_username: amazon_username,
        amazon_email: amazon_email,
        amazon_order_reference_id: amazon_order_reference_id,
        amazon_billing_agreement_id: amazon_billing_agreement_id,
        agreement_type: amazon_agreement_type,
      },
    };
  }
  return settlement;
};

const getCampaignAccepted = (val) => {
  try {
    if (val) {
      const val2String = val.toString().trim().toLowerCase();
      return val2String === "true" || val2String === "1";
    }
  } catch (err) {}
  return undefined;
};

const getUser = (body) => {
  const { account_kind, password, gender_shop_id, birthday } = body;
  const is_campaign_accepted = getCampaignAccepted(body.is_campaign_accepted);

  const user = {
    account_kind: toNumber(account_kind),
    is_campaign_accepted,
    gender_shop_id: getGender(gender_shop_id),
    birthday: getBirthday(birthday),
  };
  if (user.account_kind === 1) {
    return { ...user, password, password_confirmation: password };
  }
  return user;
};

const formatAddressForAmazon = (address) => {
  if (!isNotEmptyString(address.first_name)) {
    address.first_name = "　";
  }
  if (!isNotEmptyString(address.first_name_kana)) {
    address.first_name_kana = "　";
  }
  if (!isNotEmptyString(address.family_name_kana)) {
    address.family_name_kana = "　";
  }
  if (isNotEmptyString(address.tel)) {
    address.tel = address.tel.replace(/[^0-9]/g, "");
  }
};

const orderRequest = (body) => {
  const user = getUser(body);
  const client_address = getClientAddress(body);
  const shipping_address = getShippingAddress(body, client_address);
  const settlement = getSettlement(body);
  const order_items = getOrderItems(body);
  const {
    shop_shipping_method_id,
    scheduled_delivery_on,
    time_zone_id,
    temona_user_id,
    frequency_id,
    regular_course_id,
    advertisement_code,
    specified_referrer_url,
  } = body;
  if (settlement.amazon_pay) {
    formatAddressForAmazon(client_address);
    formatAddressForAmazon(shipping_address);
  }
  return {
    client_address,
    order_items,
    settlement,
    shipments: [
      {
        shipping_address,
        shop_shipping_method_id,
        scheduled_delivery_on,
        time_zone_id,
      },
    ],
    user,
    frequency_id: getFrequencyId(body),
    is_send_mail: getTrueValue(body.is_send_mail),
    user_id: isNumber(temona_user_id) ? temona_user_id : undefined,
    specified_referrer_url: isUri(specified_referrer_url)
      ? specified_referrer_url
      : undefined,
    advertisement_code: isNotEmptyString(advertisement_code)
      ? advertisement_code
      : undefined,
  };
};

const logIfRequestFailed = (data, body) => {
  if (get(data, "success") === true) return;
  const errors = get(data, "errors");
  if (isObject(errors) || isArray(errors)) {
    logException(body, JSON.stringify(errors));
  }
};

const createOrder = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /purchase/create_order with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { request_url } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /purchase/create_order 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    const startedAt = new Date();
    axios
      .post(`${request_url}${api.create_order}`, orderRequest(req.body), {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const doneAt = new Date();
        const duration = (doneAt.getTime() - startedAt.getTime()) / 1000;
        // console.log("-----> createOrder::response.data", JSON.stringify(response.data));
        logIfRequestFailed(response.data, req.body);
        logger.info(
          `end /purchase/create_order 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        if (duration > 20) {
          logger.info(
            `/purchase/create_order took ${duration} sec to complete`
          );
          logException(
            {
              ...req.body,
              duration,
              success: get(response.data, "success"),
              order_id: get(response.data, "data.id"),
              order_uid: get(response.data, "data.uid"),
            },
            "took longer time"
          );
        }
        res.status(200).json({
          ...response.data,
          success_code: get(response.data, "success") === true ? 1 : 0,
          order_id: get(response.data, "data.id"),
          order_uid: get(response.data, "data.uid"),
          order_token: get(response.data, "others.order_token"),
        });
      })
      .catch((error) => {
        // console.log(moment(), "----> error: ", error);
        logException(req.body, error);
        logger.error(
          `end /purchase/create_order 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    // console.log(moment(), "----> err: ", err);
    logException(req.body, err);
    logger.error(
      `end /purchase/create_order 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const confirmOrder = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /purchase/confirm_order with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { request_url } = req.body;
    // console.log("---- confirmOrder --->", JSON.stringify(req.body));
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /purchase/confirm_order 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    // console.log("requestBody: ", JSON.stringify(orderRequest(req.body)));
    axios
      .put(`${request_url}${api.confirm_order}`, orderRequest(req.body), {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        // console.log(
        //   "---- confirmOrder 200 --->",
        //   JSON.stringify(response.data)
        // );
        logIfRequestFailed(response.data, req.body);
        logger.info(
          `end /purchase/confirm_order 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({
          ...response.data,
          success_code: get(response.data, "success") === true ? 1 : 0,
        });
      })
      .catch((error) => {
        // console.log(moment(), "622 -> ", error);
        logException(req.body, error);
        logger.error(
          `end /purchase/confirm_order 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    // console.log(moment(), "631 -> ", err);
    logException(req.body, err);
    logger.error(
      `end /purchase/confirm_order 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getRegularCourse = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /regular_courses/detail with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { id, request_url } = req.body;
    // console.log(moment(), "---- getRegularCourse --->", req.body);
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /regular_courses/detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.regular_courses}/${id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const variant_id = get(response.data, "variants[0].id");
        // console.log(moment(), "200 ---> ", response.data);
        logger.info(
          `end /regular_courses/detail 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({ ...response.data, variant_id });
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /regular_courses/detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /regular_courses/detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getFrequencies = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /regular_courses/frequencies with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { id, request_url } = req.body;
    // console.log(moment(), "---- getFrequencies --->", req.body);
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /regular_courses/frequencies 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.regular_courses}/${id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        // console.log(moment(), "200 ---> ", response.data);
        const data = getFrequenciesFromResponse(response);
        logger.info(
          `end /regular_courses/frequencies 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({ data });
      })
      .catch((error) => {
        // console.log('error:', error);
        logException(req.body, error);
        logger.error(
          `end /regular_courses/frequencies 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    // console.log('err:', err);
    logException(req.body, err);
    logger.error(
      `end /regular_courses/frequencies 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getVariants = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /regular_courses/variants with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { id, request_url } = req.body;
    // console.log(moment(), "---- getVariants --->", req.body);
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /regular_courses/variants 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.regular_courses}/${id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        // console.log("200 ---> ", JSON.stringify(response.data));
        const data = getVariantsFromResponse(response);
        // console.log("---->", JSON.stringify(data));
        logger.info(
          `end /regular_courses/variants 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({ data });
      })
      .catch((error) => {
        // console.log("---> ERROR:", error);
        logException(req.body, error);
        logger.error(
          `end /regular_courses/variants 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    // console.log("---> ERR:", err);
    logException(req.body, err);
    logger.error(
      `end /regular_courses/variants 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getProductOfRegularCourse = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /regular_courses/get_product with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { id, request_url, variant_id } = req.body;
    // console.log(moment(), "---- getProductOfRegularCourse --->", req.body);
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /regular_courses/get_product 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.regular_courses}/${id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        // console.log(moment(), "200 ---> ", response.data);
        const products = get(response, "data.products");
        let product_id = undefined;
        if (isArray(products)) {
          products.forEach((product) => {
            if (`${variant_id}` === `${get(product, "variant.id")}`) {
              product_id = get(product, "variant.product_id");
            }
          });
        }
        // console.log("---> product_id:", product_id);
        logger.info(
          `end /regular_courses/get_product 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({ product_id });
      })
      .catch((error) => {
        // console.log("---> ERROR:", error);
        logException(req.body, error);
        logger.error(
          `end /regular_courses/get_product 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    // console.log("---> ERR:", err);
    logException(req.body, err);
    logger.error(
      `end /regular_courses/get_product 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getLoginInfo = (requestBody, token) => {
  return new Promise((resolve) => {
    try {
      const { request_url, email, password } = requestBody;
      axios
        .post(
          `${request_url}${api.login}`,
          { email, password },
          {
            headers: { ...headers, Authorization: `Bearer ${token}` },
            httpsAgent,
            responseType,
          }
        )
        .then((response) => {
          resolve({
            token: token,
            user_token: get(response.data, "token"),
            user_login_id: get(response.data, "user_id"),
          });
        })
        .catch((error) => {
          resolve();
        });
    } catch (err) {
      resolve();
    }
  });
};

const getCustomerDetail = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /customer_detail with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { email, password, request_url } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /customer_detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .post(
        `${request_url}${api.login}`,
        { email, password },
        {
          headers: { ...headers, Authorization: `Bearer ${token}` },
          httpsAgent,
          responseType,
        }
      )
      .then((response) => {
        const user_login_id = get(response.data, "user_id");
        const user_token = get(response.data, "token");
        axios
          .get(`${request_url}${api.user}/${user_login_id}`, {
            headers: { ...headers, Authorization: `Bearer ${token}` },
            httpsAgent,
            responseType,
          })
          .then((response) => {
            const data = getCustomerDetailFromResponse(
              response,
              user_login_id,
              user_token
            );
            axios
              .get(`${request_url}${api.user_course_orders}`, {
                headers: {
                  ...headers,
                  Authorization: `Bearer ${token}`,
                  EachUserToken: user_token,
                },
                httpsAgent,
                responseType,
              })
              .then((response2) => {
                data.num_of_orders = getRegularCourseListFromResponse(
                  response2
                ).length;
                logger.info(
                  `end /customer_detail 200 with cpid - userid: ${cpid} - ${user_id}`
                );
                res.status(200).json(data);
              })
              .catch((error) => {
                logException(req.body, error);
                logger.error(
                  `end /customer_detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
                );
                res.status(500).json({ error_message: defaultErrorMessage });
              });
          })
          .catch((error) => {
            logException(req.body, error);
            logger.error(
              `end /customer_detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
            );
            res.status(500).json({ error_message: defaultErrorMessage });
          });
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /customer_detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${loginErrorMessage}`
        );
        res.status(500).json({ error_message: loginErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /login 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
    );
    res.status(500).json({ error_message: defaultErrorMessage });
  }
};

const getRegularCourseList = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /regular_course_list with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { request_url } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /get_periodic_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    const loginInfo = await getLoginInfo(req.body, token);
    if (!loginInfo) {
      logException(req.body, "login failed");
      logger.error(
        `end /regular_course_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: Login Failed`
      );
      res.status(500).json({ error_message: "Login Failed" });
      return;
    }
    axios
      .get(`${request_url}${api.user_course_orders}`, {
        headers: {
          ...headers,
          Authorization: `Bearer ${loginInfo.token}`,
          EachUserToken: loginInfo.user_token,
        },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const data = getRegularCourseListFromResponse(response);
        logger.info(
          `end /regular_course_list 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({ data });
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /regular_course_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /regular_course_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getCourseOrderDetail = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /course_order/detail with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { request_url, course_order_id } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /course_order/detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.course_orders}/${course_order_id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const categories = JSON.parse(
          get(req.body, "商品カテゴリ一_master_data")
        );
        const ecoRegulars = JSON.parse(
          get(req.body, "eco定期一覧_master_data")
        );
        const tags = JSON.parse(
          get(req.body, "tags", "[]")
        );
        const course = getRegularCourseDetailFromResponse(
          response,
          categories,
          ecoRegulars,
          tags
        );
        logger.info(
          `end /course_order/detail 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json(course);
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /course_order/detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /course_order/detail 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getPeriodicList = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /get_periodic_list with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { course_id, request_url } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /get_periodic_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    const periodicType = get(req.body, "periodic_type");
    axios
      .get(`${request_url}${api.regular_courses}/${course_id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const periodicList = getPeriodicListFromResponse(
          response,
          periodicType
        );
        logger.info(
          `end /get_periodic_list 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({ data: periodicList });
      })
      .catch((error) => {
        axios
          .get(`${request_url}${api.distribution_courses}/${course_id}`, {
            headers: { ...headers, Authorization: `Bearer ${token}` },
            httpsAgent,
            responseType,
          })
          .then((response) => {
            const periodicList = getPeriodicListFromResponse(
              response,
              periodicType
            );
            logger.info(
              `end /get_periodic_list 200 with cpid - userid: ${cpid} - ${user_id}`
            );
            res.status(200).json({ data: periodicList });
          })
          .catch((error) => {
            logException(req.body, error);
            logger.error(
              `end /get_periodic_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
            );
            res.status(500).json({ error_message: defaultErrorMessage });
          });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /get_periodic_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getCourseCondition = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /get_course_condition with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { course_id, request_url } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /get_course_condition 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    const countOfPeriodic = get(req.body, "count_of_periodic");
    axios
      .get(`${request_url}${api.regular_courses}/${course_id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const courseCondition = getCourseConditionFromResponse(
          response,
          toNumber(countOfPeriodic),
        );
        logger.info(
          `end /get_course_condition 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json(courseCondition);
      })
      .catch((error) => {
        axios
          .get(`${request_url}${api.distribution_courses}/${course_id}`, {
            headers: { ...headers, Authorization: `Bearer ${token}` },
            httpsAgent,
            responseType,
          })
          .then((response) => {
            const courseCondition = getCourseConditionFromResponse(
              response,
              toNumber(countOfPeriodic),
            );
            logger.info(
              `end /get_course_condition 200 with cpid - userid: ${cpid} - ${user_id}`
            );
            res.status(200).json(courseCondition);
          })
          .catch((error) => {
            logException(req.body, error);
            logger.error(
              `end /get_course_condition 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
            );
            res.status(500).json({ error_message: defaultErrorMessage });
          });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /get_course_condition 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const updateRegularCourse = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /regular_course/update with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { request_url, course_order_id } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /get_periodic_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    const loginInfo = await getLoginInfo(req.body, token);
    if (!loginInfo) {
      logException(req.body, "login failed");
      logger.error(
        `end /regular_course/update 500 with cpid - userid: ${cpid} - ${user_id}. Error: Login Failed`
      );
      res.status(500).json({ error_message: "Login Failed" });
      return;
    }
    const updateRegularCourseData = await getUpdatedRegularCourseData(req.body);
    axios
      .patch(
        `${request_url}${api.user_course_orders}/${course_order_id}`,
        updateRegularCourseData,
        {
          headers: {
            ...headers,
            Authorization: `Bearer ${loginInfo.token}`,
            EachUserToken: loginInfo.user_token,
          },
          httpsAgent,
          responseType,
        }
      )
      .then((response) => {
        logger.info(
          `end /regular_course/update 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({ update_course_flag: 1 });
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /regular_course/update 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /regular_course/update 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const stopRegularCourse = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /regular_course/stop with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { request_url, course_order_id } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /get_periodic_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    const loginInfo = await getLoginInfo(req.body, token);
    if (!loginInfo) {
      logException(req.body, "login failed");
      logger.error(
        `end /regular_course/stop 500 with cpid - userid: ${cpid} - ${user_id}. Error: Login Failed`
      );
      res.status(500).json({ error_message: "Login Failed" });
      return;
    }
    const stopRegularCourseData = await getStopRegularCourseData(req.body);
    axios
      .patch(
        `${request_url}${api.user_course_orders}/${course_order_id}`,
        stopRegularCourseData,
        {
          headers: {
            ...headers,
            Authorization: `Bearer ${loginInfo.token}`,
            EachUserToken: loginInfo.user_token,
          },
          httpsAgent,
          responseType,
        }
      )
      .then((response) => {
        logger.info(
          `end /regular_course/stop 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({ stop_course_flag: 1 });
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /regular_course/stop 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /regular_course/stop 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getMostPriorityReason = (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /get_most_priority_reason with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    let data = undefined;
    let reasons = get(
      req.body,
      "reason_for_regular_suspension_priority_1"
    ).split(",");
    let others = JSON.parse(get(req.body, "その他_master_data"));

    let existOther = false;
    for (const reason of reasons) {
      if (others.includes(reason)) {
        existOther = true;
        break;
      }
    }

    reasons.sort();
    data = {
      most_priority_reason: reasons[0],
      exist_other_reason_flag: existOther ? 1 : 0,
    };
    logger.info(
      `end /get_most_priority_reason 200 with cpid - userid: ${cpid} - ${user_id}`
    );
    res.status(200).json(data);
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /get_most_priority_reason 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const changeMagazineReceivedFlag = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /user/change_magazine_receive_flag with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { request_url, is_campaign_accepted, user_login_id } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /user/change_magazine_receive_flag 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.user}/${user_login_id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const current = get(response.data, "user_addresses").find(
          (adr) => adr.is_default
        );
        if (!current) {
          return res.status(400).json({
            error_message: "Cannot update user without default address",
          });
        }
        const updateData = {
          user: {
            is_campaign_accepted: is_campaign_accepted == 1 ? true : false,
            default_address_attributes: {
              id: current.id,
              family_name: current.family_name,
              first_name: current.first_name,
              zip_code: current.zip_code,
              state_id: current.state_id,
              city: current.city,
              address: current.address,
              building_name: current.building_name,
              tel: current.tel,
            },
          },
        };
        axios
          .patch(`${request_url}${api.user}/${user_login_id}`, updateData, {
            headers: {
              ...headers,
              Authorization: `Bearer ${token}`,
            },
            httpsAgent,
            responseType,
          })
          .then((response) => {
            logger.info(
              `end /user/change_magazine_receive_flag 200 with cpid - userid: ${cpid} - ${user_id}`
            );
            res.status(200).json({ update_magazine_received_flag: 1 });
          })
          .catch((error) => {
            logException(req.body, error);
            logger.error(
              `end /user/change_magazine_receive_flag 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
            );
            res.status(500).json({ error_message: defaultErrorMessage });
          });
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /user/change_magazine_receive_flag 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /user/change_magazine_receive_flag 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getPreferredDeliveryTimeZoneList = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /course_order/preferred_delivery_time_zone_list with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { request_url, course_order_id } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /course_order/preferred_delivery_time_zone_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.course_orders}/${course_order_id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const data = getTimeZoneListFromResponse(response);
        logger.info(
          `end /course_order/preferred_delivery_time_zone_list 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res.status(200).json({ data });
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /course_order/preferred_delivery_time_zone_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /course_order/preferred_delivery_time_zone_list 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

module.exports = {
  auth,
  searchUser,
  searchProduct,
  getProduct,
  productVariants,
  getPreferredDeliveryDay,
  createOrder,
  confirmOrder,
  getRegularCourse,
  getFrequencies,
  getVariants,
  getProductOfRegularCourse,
  getEarliestDeliveryDay,
  getCustomerDetail,
  getRegularCourseList,
  getPeriodicList,
  getCourseCondition,
  updateRegularCourse,
  stopRegularCourse,
  getMostPriorityReason,
  changeMagazineReceivedFlag,
  getCourseOrderDetail,
  getPreferredDeliveryTimeZoneList,
  getToken,
};
