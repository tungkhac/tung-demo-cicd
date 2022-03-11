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

const SOCIAL_TECH_SS_ID = isProductionMode()
  ? "14XaG7kGJlhHUbYLRtgQ4EqBdgFXSEt-q97s1HDDay7o" //PRD
  : "1nXTvR57zpfhXdzRMMxbBiO3oPPy-DVujV-p72Les4VQ";

module.exports = {
  SS_EMAIL,
  SOCIAL_TECH_SS_ID,
};
