// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const moment = require("moment");
const { CART_IN_PROGRESS } = require("../constants");
const { baseProcess, getShippingAddress, getPaymentData } = require("../base");

const cartInProgress = async (req, res) => {
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
    // 処理実行
    const response = await baseProcess(req.body, CART_IN_PROGRESS);
    // エラー確認
    if (
      (response.data.errors && response.data.errors.email) ||
      (response.data.exception && response.data.exception.length > 0)
    ) {
      let errorMessage = "【入力情報不正】";
      if (response.data.exception && response.data.exception.length > 0) {
        for (let i = 0; i < response.data.exception.length; i++) {
          errorMessage = `${errorMessage}\n${response.data.exception[i]}`;
        }
      }
      // メールアドレスが不正であるか？
      if (response.data.errors && response.data.errors.email)
        errorMessage = `${errorMessage}\n${response.data.errors.email[0]}`;
      response.data.errors = errorMessage;
    }
    console.log(response.data);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(`【${moment()}】>>/basefood${CART_IN_PROGRESS}::Error<<`, error);
    res.status(500).send({ errors: '予期せぬエラーが発生しました' });
  }
};

module.exports = {
  cartInProgress,
};
