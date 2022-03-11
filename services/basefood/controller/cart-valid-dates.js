// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const moment = require("moment");
const { CART_VALID_DATES } = require("../constants");
const { baseProcessForGet } = require("../base");

const cartValidDates = async (req, res) => {
  try {
    console.log(req.body);
    // 処理実行
    const response = await baseProcessForGet(req.body, CART_VALID_DATES);
    // responseの作成
    createResponse(response.data);
    // 応答
    res.status(200).send(response.data);
  } catch (error) {
    console.error(`【${moment()}】>>/basefood${CART_VALID_DATES}::Error<<`, error);
    res.status(500).send({ errors: '予期せぬエラーが発生しました' });
  }
};

const createResponse = (data) => {
  for (let i = 0; i < data.valid_dates.length; i++) {
    data[`valid_dates_label_${i}`] = data.valid_dates[i].label;
    data[`valid_dates_value_${i}`] = data.valid_dates[i].value;
  }
};

module.exports = {
  cartValidDates,
};
