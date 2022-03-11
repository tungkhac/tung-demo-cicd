// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const PAYMENT_ZCOM_TYPE = "020";
const TYPE_EFO_PAYMENT_METHOD_SETTING_YES = "002";
const defaultErrorMessage = "エラーが発生しました。再度お試しください。";
const cgiURLs = {
  receiveOrder: {
    test:
      "https://test.global-payment.asia/payment/cgi/order/receive_order.cgi",
    production:
      "https://secure.global-payment.asia/payment/cgi/order/receive_order.cgi",
  },
  checkOrder: {
    test: "https://test.global-payment.asia/payment/cgi/order/check_order.cgi",
    production:
      "https://secure.global-payment.asia/payment/cgi/order/check_order.cgi",
  },
};
module.exports = {
  PAYMENT_ZCOM_TYPE,
  TYPE_EFO_PAYMENT_METHOD_SETTING_YES,
  defaultErrorMessage,
  cgiURLs,
};
