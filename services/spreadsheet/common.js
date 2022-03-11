// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const { isArray, get } = require("lodash");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { MODE } = require("./constants");
const moment = require("moment-timezone");
const config = require("config");
const TIMEZONE = config.get("timezone");

const formatTel = (tel) => {
  if (tel && typeof tel === "string") {
    return "'" + tel;
  }
  return tel;
};

const sheetByTitle = (doc, title) => {
  if (!doc || !title) return;
  let index = 0;
  for (index = 0; index < doc.sheetCount; index++) {
    const sheet = doc.sheetsByIndex[index];
    if (
      sheet.title &&
      typeof sheet.title === "string" &&
      sheet.title.trim() == title
    ) {
      return sheet;
    }
  }
};

const getHeaderValues = (mapping) => {
  if (!mapping) return;
  const keys = Object.keys(mapping);
  if (Array.isArray(keys) && keys.length > 0) {
    return keys;
  }
};

const getRow = (body, headers, mapping) => {
  if (!body || !Array.isArray(headers) || headers.length == 0 || !mapping)
    return;
  const row = {};
  const specialCharacters = "0123456789=+-*/() '";
  let i = 0;
  for (i = 0; i < headers.length; i++) {
    const header = headers[i];
    const key = get(mapping, header);
    if (key) {
      let value = "";
      if (key == "{{timestamp}}") {
        value = moment().tz(TIMEZONE).format("HH:mm:ss");
      } else if (key == "{{date}}") {
        value = moment().tz(TIMEZONE).format("YYYY-MM-DD");
      } else if (key == "{{timestamp2}}") {
        value = moment().tz(TIMEZONE).format("YYYY-MM-DD HH:mm:ss");
      } else {
        value = get(body, key, "");
        if (value.length > 0 && specialCharacters.includes(value[0])) {
          value = "'" + value;
        }
      }
      row[header] = value;
    }
  }
  return row;
};

module.exports = {
  formatTel,
  sheetByTitle,
  getHeaderValues,
  getRow,
};
