// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const config = require("config");
const isProductionMode = () => {
  try {
    return config.has("appEnv") && config.get("appEnv") === "botchan";
  } catch (err) {
    return false;
  }
};

const SS_EMAIL = isProductionMode()
  ? "sapporo@sapporo-308107.iam.gserviceaccount.com" //PRD
  : "ss-read-write@sapporo-dev-305306.iam.gserviceaccount.com";

const BRESMILE_SS_ID = isProductionMode()
  ? "1UxUrlCvmBS3HY1kCb8a2ewEu41cWYes7HzxcFniJTA4" //PRD
  : "1TZc7rbJ6qAecUB4Wf1xpvjdynNCb2JSLPkl4Nti2tBw";

module.exports = {
  SS_EMAIL,
  BRESMILE_SS_ID,
};
