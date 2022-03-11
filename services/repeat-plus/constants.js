// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const https = require("https");

const API = {
  searchProduct: "/Botchan/Product/ProductSearch.ashx",
  login: "/Botchan/User/Login.ashx",
  recalculation: "/Botchan/Order/Recalculation.ashx",
  order: "/Botchan/Order/OrderRegister.ashx",
  register: "/Botchan/User/Register.ashx",
};

const defaultErrorMessage = "エラーが発生しました。再度お試しください。";

const responseType = "json";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  ecdhCurve: "secp384r1",
});

const ERROR_CODES = {
  emailTaken: "mail_addr:E03-3032",
};

const RECOMMEND_FLAG = {
  NO_RECOMMEND: 0,
  UP_SELL: 1,
  CROSS_SELL: 2,
};

const AFTER_ORDER_RECOMMEND_FLAG = {
  NO_RECOMMEND: 0,
  GET_RECOMMENDATION: 1,
  EXECUTE_RECOMMENDATION: 2,
};

module.exports = {
  API,
  defaultErrorMessage,
  responseType,
  httpsAgent,
  RECOMMEND_FLAG,
  ERROR_CODES,
  AFTER_ORDER_RECOMMEND_FLAG,
};
