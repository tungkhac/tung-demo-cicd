// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const { EfoUserProfile } = require("../../../model");
const {
  addParameterToURL,
  insertValueToMessageVariable,
  requestCheckOrder,
  getZComPayment,
} = require("../common");

const getUserProfile = async (order_number) => {
  if (!order_number) return;
  const payment = await getZComPayment(order_number);
  if (!payment || !payment.user_id || !payment.connect_page_id) return;
  return await EfoUserProfile.findOne({
    user_id: payment.user_id,
    connect_page_id: payment.connect_page_id,
  }).lean();
};

const back = async (req, res) => {
  const { order_number } = req.query;
  const user = await getUserProfile(order_number);
  if (!user || !user.current_url) {
    return res.render("error_404", {
      error: "404 NOT FOUND",
    });
  } else {
    res.redirect(user.current_url);
  }
};

const error = async (req, res) => {
  const { order_number } = req.query;
  const user = await getUserProfile(order_number);
  if (!user || !user.current_url) {
    return res.render("error_404", {
      error: "404 NOT FOUND",
    });
  } else {
    const url = addParameterToURL(user.current_url, "zcom_error", 1);
    res.redirect(url);
  }
};

const success = async (req, res) => {
  console.log("--> zcom/success:query", req.query);
  const { user_id, order_number, payment_code, state, trans_code } = req.query;
  const user = await getUserProfile(order_number);
  if (!user || !user.current_url) {
    return res.render("error_404", {
      error: "404 NOT FOUND",
    });
  }
  await insertValueToMessageVariable(
    user.connect_page_id,
    user_id,
    "zcom_trans_code",
    `${trans_code || ""}`
  );
  await insertValueToMessageVariable(
    user.connect_page_id,
    user_id,
    "zcom_payment_code",
    `${payment_code || ""}`
  );
  await insertValueToMessageVariable(
    user.connect_page_id,
    user_id,
    "zcom_state",
    `${state || ""}`
  );
  await insertValueToMessageVariable(
    user.connect_page_id,
    user_id,
    "zcom_payment_status",
    "success"
  );
  const url = addParameterToURL(user.current_url, "zcom_success", "1");
  res.redirect(url);
};

module.exports = { back, error, success };
