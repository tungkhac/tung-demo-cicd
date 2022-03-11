// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const config = require("config");
const { get } = require("lodash");
const moment = require("moment-timezone");
const TIMEZONE = config.get("timezone");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { MODE, errorMessages, SS_EMAIL } = require("../constants");
const {
  sheetByTitle,
  formatTel,
  getHeaderValues,
  getRow,
} = require("../common");

const getSheet = async (mode, ss_id, ss_title, headerValues) => {
  const private_key = config.get("sapporoSSPrivateKey");
  const client_email = SS_EMAIL;
  let sheet = null;
  const doc = new GoogleSpreadsheet(ss_id);
  await doc.useServiceAccountAuth({ client_email, private_key });
  await doc.loadInfo();
  /* istanbul ignore else */
  if (mode == MODE.EXPORT_BY_DAY) {
    const title = moment().tz(TIMEZONE).format("YYYYMMDD");
    sheet = sheetByTitle(doc, title);
    /* istanbul ignore else */
    if (!sheet) {
      sheet = await doc.addSheet({ title, headerValues });
    }
  } else if (mode == MODE.EXPORT_BY_SHEET_TITLE) {
    const title = ss_title;
    sheet = sheetByTitle(doc, title);
    if (!sheet) {
      sheet = await doc.addSheet({ title, headerValues });
    }
  }
  if (sheet) {
    const headers = sheet.headerValues;
    if (!headers) {
      await sheet.setHeaderRow(headerValues);
    }
  }
  return sheet;
};

const exportToSpreadsheet = async (req, res, next) => {
  try {
    const mode = get(req.body, "mode", "");
    const ss_id = get(req.body, "ss_id", "");
    const ss_title = get(req.body, "ss_title", "");
    const mapping = JSON.parse(get(req.body, "mapping", ""));
    if (!mode || !ss_id || !mapping) {
      return res
        .status(400)
        .json({ error_message: errorMessages.missingRequired });
    }
    const supportedModes = [MODE.EXPORT_BY_SHEET_TITLE, MODE.EXPORT_BY_DAY];
    if (!supportedModes.includes(mode)) {
      return res
        .status(400)
        .json({ error_message: errorMessages.notSupportedMode });
    }
    const headers = getHeaderValues(mapping);
    if (!headers) {
      return res
        .status(400)
        .json({ error_message: errorMessages.invalidMapping });
    }
    if (mode == MODE.EXPORT_BY_SHEET_TITLE && !ss_title) {
      return res
        .status(400)
        .json({ error_message: errorMessages.missingSheetTitle });
    }
    const sheet = await getSheet(mode, ss_id, ss_title, headers);
    const row = getRow(req.body, headers, mapping);
    /* istanbul ignore else */
    if (row && sheet) {
      sheet.addRow(row);
      return res.status(200).json({ status: "OK" });
    }
    /* istanbul ignore next */
    return res.status(400).json({ error_message: errorMessages.default });
  } catch (error) {
    return res.status(400).json({ error_message: errorMessages.default });
  }
};

module.exports = { exportToSpreadsheet };
