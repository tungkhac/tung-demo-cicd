// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const express = require("express");
const router = express.Router();
const { exportToSpreadsheet } = require("./controller");

router.post("/export", exportToSpreadsheet);
module.exports = router;
