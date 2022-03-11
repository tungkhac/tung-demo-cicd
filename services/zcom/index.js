// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const express = require("express");
const router = express.Router();
const {
  randomOrderNumber,
  createPayment,
  back,
  error,
  success,
} = require("./controller");

router.get("/random-order-number", randomOrderNumber);
router.post("/create-payment", createPayment);
router.get("/back", back);
router.get("/error", error);
router.get("/success", success);

module.exports = router;
