// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const express = require("express");
const router = express.Router();
const {
  login,
  register,
  getAccessToken,
  order,
  getShippingAddressOptions,
  getShippingAddressByIndex,
  addShippingAddress,
  getCardList,
  checkExistedEmail,
} = require("./controller");

router.post("/auth/login", login);
router.post("/auth/register", register);
router.post("/get-access-token", getAccessToken);
router.post("/get-card-list", getCardList);
router.post("/order", order);
router.post("/shipping-address-options", getShippingAddressOptions);
router.post("/get-shipping-address-by-index", getShippingAddressByIndex);
router.post("/add-shipping-address", addShippingAddress);
router.post("/check-existed-email", checkExistedEmail);
/* istanbul ignore next */
router.post("/set-variables", (req, res) => {
  return res.status(200).json({ ...req.body });
});
module.exports = router;
