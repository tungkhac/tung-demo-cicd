// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const moment = require("moment");
const { CART_VALIDATE } = require("../constants");
const { baseProcess, getShippingAddress, getPaymentData } = require("../base");

const cartValidate = async (req, res) => {
  try {
    console.log(req.body);
    // requestの作成
    req.body.shipping_address = getShippingAddress(req.body);
    delete req.body.last_name;
    delete req.body.first_name;
    delete req.body.phone;
    delete req.body.zip;
    delete req.body.province;
    delete req.body.city;
    delete req.body.address_line1;
    delete req.body.address_line2;
    req.body.payment_data = getPaymentData(req.body);
    delete req.body.stripe_token;
    delete req.body.last4
    //処理実行
    const response = await baseProcess(req.body, CART_VALIDATE);
    // エラー確認
    if (response.data.exception && response.data.exception.errors) {
      const errors = response.data.exception.errors;
      response.data.errors = getErrorMessage(errors);
    }
    // 応答
    console.log(response.data);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(`【${moment()}】>>/basefood${CART_VALIDATE}::Error<<`, error);
    res.status(500).send({ errors: '予期せぬエラーが発生しました' });
  }
};

const getDetailErrorMessage = (errors) => {
  let message = "";
  if (Array.isArray(errors)) {
    errors.forEach((error) => {
      message = `${message}\n${error}`;
    });
  }
  return message.trim();
};

const getErrorMessage = (errors) => {
  let errorMessage = "";
  [
    "accepts_marketing",
    "payment_method",
    "payment_data",
    "delivery_date",
    "delivery_timezone",
    "non_face_to_face_receipt",
    "shipping_address.last_name",
    "shipping_address.first_name",
    "shipping_address.email",
    "shipping_address.phone",
    "shipping_address.zip",
    "shipping_address.province",
    "shipping_address.city",
    "shipping_address.address_line1",
    "shipping_address.address_line2",
    "password",
    "email",
    "products",
    "coupon",
  ].forEach((element) => {
    const message = getDetailErrorMessage(errors[element]);
    if (message.length > 0) {
      errorMessage = `${errorMessage}\n${message}`;
    }
  });
  if (errorMessage != "")
    errorMessage = "【入力情報不正】" + errorMessage;
  console.log(errorMessage);
  return errorMessage;
}

module.exports = {
  cartValidate,
};
