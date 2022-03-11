// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const express = require("express");
const router = express.Router();

const temona = require("./temona");
const repeatPlus = require("./repeat-plus");
const rakuraku = require('./rakuraku');
const generate_scenario = require('./generate_scenario');
const sapporo = require("./sapporo");
const socialTech = require("./social-tech");
const bresmile = require("./bresmile");
const spreadsheet = require("./spreadsheet");
const basefood = require("./basefood");

router.use("/api/temona", temona);
router.use("/api/repeat-plus", repeatPlus);
router.use("/api/rakuraku", rakuraku);
router.use("/api", generate_scenario);
router.use("/sapporo", sapporo);
router.use("/api/social-tech", socialTech);
router.use("/api/bresmile", bresmile);
router.use("/api/spreadsheet", spreadsheet);
router.use("/api/basefood", basefood);

const zCom = require("./zcom");
router.use("/zcom", zCom);

const pardot = require("./pardot");
router.use("/api/pardot", pardot);

module.exports = router;
