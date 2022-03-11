// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const moment = require("moment");
const { AMAZON_BILLING } = require("../constants");
const { baseProcess } = require("../base");

const amazonBilling = async (req, res) => {
  try {
    // 処理実行
    const response = await baseProcess(req.body, AMAZON_BILLING);
    // responseの作成
    createResponse(response.data);
    // 応答
    console.log(response.data);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(`【${moment()}】>>/basefood${AMAZON_BILLING}::Error<<`, error);
    res.status(500).send({ errors: '予期せぬエラーが発生しました' });
  }
};

const createResponse = (data) => {
  if (data.status == 'ng') return;
  data.first_name = data.cart.shipping_address.first_name;
  data.last_name = data.cart.shipping_address.last_name;
  data.province = data.cart.shipping_address.province;
  data.city = data.cart.shipping_address.city;
  data.address_line1 = data.cart.shipping_address.address_line1;
  data.address_line2 = data.cart.shipping_address.address_line2;
  data.phone = data.cart.shipping_address.phone;
  data.zip = data.cart.shipping_address.zip;
  data.email = data.cart.email;
  data.order_reference_id = data.order_reference_id;
};

module.exports = {
  amazonBilling,
};
