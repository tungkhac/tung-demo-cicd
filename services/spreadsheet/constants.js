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

const MODE = {
  EXPORT_BY_SHEET_TITLE: "by_sheet_title",
  EXPORT_BY_DAY: "by_day",
};

const errorMessages = {
  default: "エラーが発生しました。再度お試しください。",
  missingRequired: "mode, ss_id, ss_email, mapping are required.",
  notSupportedMode: "mode is not supported",
  invalidMapping: "mapping is invalid.",
  notExistedSheet: "Sheet is not existed.",
  missingSheetTitle: "ss_title is required.",
};

module.exports = {
  SS_EMAIL,
  MODE,
  errorMessages,
};
