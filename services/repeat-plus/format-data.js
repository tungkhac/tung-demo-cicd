// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const moment = require("moment");

const formatTaxInclude = (taxInclude) => {
  switch (taxInclude) {
    case "1":
      return "税込";
    case "0":
      return "税別";
    default:
      return "税別";
  }
};

const removeDash = (value) =>
  value && typeof value === "string" ? value.replace(/\-/g, "") : value;

const formatZipCode = (value) => {
  return value && typeof value === "string"
    ? removeDash(value).replace(/(\d{3})(\d{4})/, "$1-$2")
    : value;
};

const formatTelephone = (value) => {
  return value && typeof value === "string"
    ? removeDash(value).replace(/(\d{1,6})(\d{4})(\d{4})/, "$1-$2-$3")
    : value;
};

const formatDate = (date) => {
  if (!date) return date;
  const momentCT = moment;
  momentCT.locale("ja");
  return momentCT(date, "ll").format("YYYY/MM/DD");
};

const formatNull = (data) => {
  return data != "" ? data : undefined;
};

const formatUserDevice = (device) => {
  if (device && typeof device === "string") {
    if (["mobile", "tablet"].includes(device.trim().toLowerCase())) {
      return "SP_USER";
    }
    return "PC_USER";
  }
};

const formatOrderDevice = (device) => {
  if (device && typeof device === "string") {
    if (["mobile", "tablet"].includes(device.trim().toLowerCase())) {
      return "SP";
    }
    return "PC";
  }
};

const isDoubleByteString = (str) => {
  if (str && typeof str === "string" && str.length > 0) {
    return str.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? true : false;
  }
  return false;
};

const isNotEmptyString = (str) =>
  str && typeof str === "string" && str.length > 0;

const getMailFlag = (body) => {
  if (!body || !isNotEmptyString(body.mail_flg)) return;
  const mail_flg = body.mail_flg.trim().toUpperCase();
  if (["ON", "OFF", "UNKNOWN"].includes(mail_flg)) {
    return mail_flg;
  }
};

module.exports = {
  formatTaxInclude,
  formatZipCode,
  formatDate,
  formatNull,
  formatTelephone,
  removeDash,
  formatUserDevice,
  formatOrderDevice,
  isDoubleByteString,
  isNotEmptyString,
  getMailFlag,
};
