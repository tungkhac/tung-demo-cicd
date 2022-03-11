// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const express = require("express");
const router = express.Router();
const {
  cartInProgress,
  cartValidate,
  cart,
  order,
  cartValidDates,
  amazonBilling,
} = require("./controller");

router.post("/cart/in_progress", cartInProgress);
router.post("/cart/validate", cartValidate);
router.post("/cart", cart);
router.post("/order", order);
router.post("/cart/valid_dates", cartValidDates);
router.post("/amazon_billing", amazonBilling);

module.exports = router;
