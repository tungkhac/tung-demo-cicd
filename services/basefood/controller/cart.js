// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const moment = require("moment");
const { CART } = require("../constants");
const { baseProcess, getShippingAddress, getPaymentData } = require("../base");

const cart = async (req, res) => {
  try {
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
    const response = await baseProcess(req.body, CART);
    // responseの作成
    createResponse(response.data);
    // 応答
    console.log(response.data);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(`【${moment()}】>>/basefood${CART}::Error<<`, error);
    res.status(500).send({ errors: '予期せぬエラーが発生しました' });
  }
};

const createResponse = (data) => {
  data.total_price_result = Number(data.cart.first_line_total_price) + Number(data.cart.total_shipping_fee) - Number(data.cart.first_total_discounts);
  data.first_total_discounts = data.cart.first_total_discounts;
  data.after_second_total_price = Number(data.cart.after_second_line_total_price) + Number(data.cart.total_shipping_fee);
  data.total_shipping_fee = data.cart.total_shipping_fee;
  data.first_line_total_price = data.cart.first_line_total_price;
  for (let i = 0; i < data.cart.products.length; i++) {
    data[`product_${i}_quantity`] = data.cart.products[i].quantity;
    data[`product_${i}_title`] = data.cart.products[i].title;
    data[`product_${i}_variant_title`] = data.cart.products[i].variant_title;
    data[`product_${i}_first_subscription_total_price`] = data.cart.products[i].first_subscription_total_price;
    data[`product_${i}_image`] = data.cart.products[i].images[0];
  }
  data.cart_info = JSON.stringify(data.cart);
};

module.exports = {
  cart,
};
