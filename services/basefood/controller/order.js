// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const moment = require("moment");
const { ORDER } = require("../constants");
const { baseProcess, getShippingAddress, getPaymentData } = require("../base");

const order = async (req, res) => {
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
    delete req.body.last4;
    if (!req.body.amazon_pay_access_token) req.body.amazon_pay_access_token = 'dummy';
    if (!req.body.non_face_to_face_receipt) req.body.non_face_to_face_receipt = 'false';
    //処理実行
    const response = await baseProcess(req.body, ORDER);
    // response作成
    if (response.data.order && response.data.order.id)
      response.data.order_id = response.data.order.id;
      response.data.order_info = JSON.stringify(response.data.order);
    // エラー確認
    if (response.data.exception && response.data.exception.length > 0) {
      let errorMessage = "【入力情報不正】";
      for (let i = 0; i < response.data.exception.length; i++) {
        errorMessage = `${errorMessage}\n${response.data.exception[i]}`;
      }
      response.data.errors = errorMessage;
    }
    console.log(response.data);
    // 応答
    res.status(200).send(response.data);
  } catch (error) {
    console.error(`【${moment()}】>>/basefood${ORDER}::Error<<`, error);
    res.status(500).send({ errors: "予期せぬエラーが発生しました" });
  }
};

module.exports = {
  order,
};
