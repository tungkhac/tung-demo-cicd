// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const express = require("express");
const router = express.Router();
const {
  login,
  getProducts,
  getProductDetail,
  getShipping,
  recalculation,
  createOrder,
  getDateShipping,
  getTimeShipping,
  getRecommendList,
  getAfterOrderRecommends,
  register,
  verifyEmail,
  verifyAddress,
  getEarliestDeliveryDay,
} = require("./controller");

router.post("/auth/login", login);
router.post("/product", getProducts);
router.post("/product/detail", getProductDetail);
router.post("/product/recommend", getRecommendList);
router.post("/product/afterOrderRecommends", getAfterOrderRecommends);
router.post("/shipping", getShipping);
router.post("/shipping/time", getTimeShipping);
router.post("/shipping/date", getDateShipping);
router.post("/recalculation", recalculation);
router.post("/order", createOrder);
router.post("/user/register", register);
router.post("/user/verifyEmail", verifyEmail);
router.post("/verifyAddress", verifyAddress);
router.post("/shipping/earliestDeliveryDay", getEarliestDeliveryDay);

module.exports = router;
