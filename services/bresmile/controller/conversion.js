// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const config = require("config");
const get = require("lodash/get");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { BRESMILE_SS_ID, SS_EMAIL } = require("../constants");
const moment = require("moment-timezone");
const TIMEZONE = config.get("timezone");

const defaultErrorMessage = "エラーが発生しました。再度お試しください。";
const types = ["解約", "阻止"];
//(*) If type == 阻止, add data into the sheet 阻止通知. if type == 解約, add data into the sheet 解約通知
/* prettier-ignore */
const sheetTitles = { "解約": "解約通知", "阻止": "阻止通知" };

const formatTel = (tel) => {
  if (tel && typeof tel === "string") {
    return "'" + tel;
  }
  return tel;
};

const sheetByTitle = (doc, title) => {
  /* istanbul ignore if */
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

const conversion = async (req, res) => {
  console.log(">>bresmile/conversion<<", JSON.stringify(req.body));
  try {
    const type = get(req.body, "type");
    if (!types.includes(type)) {
      res.status(200).json({ error: "Invalid type" });
      return;
    }
    const name = get(req.body, "name", "");
    const tel = formatTel(get(req.body, "tel", ""));
    const email = get(req.body, "email", "");
    const product = get(req.body, "product", "");
    const entry_reason = get(req.body, "entry_reason", "");
    const continue_reason = get(req.body, "continue_reason", "");
    const question_1 = get(req.body, "question_1", "");
    const question_2 = get(req.body, "question_2", "");
    const question_3 = get(req.body, "question_3", "");
    const question_4 = get(req.body, "question_4", "");
    const question_5 = get(req.body, "question_5", "");
    const question_6 = get(req.body, "question_6", "");
    const question_6_1 = get(req.body, "question_6_1", "");
    const question_6_2 = get(req.body, "question_6_2", "");
    const question_7 = get(req.body, "question_7", "");
    const question_8 = get(req.body, "question_8", "");
    const question_9 = get(req.body, "question_9", "");
    const question_10 = get(req.body, "question_10", "");
    const question_11 = get(req.body, "question_11", "");
    const question_12 = get(req.body, "question_12", "");
    const question_13 = get(req.body, "question_13", "");
    const question_14 = get(req.body, "question_14", "");
    const question_15 = get(req.body, "question_15", "");
    const question_16 = get(req.body, "question_16", "");
    const question_17 = get(req.body, "question_17", "");
    const question_18 = get(req.body, "question_18", "");
    const question_19 = get(req.body, "question_19", "");
    const question_20 = get(req.body, "question_20", "");

    const private_key = config.get("sapporoSSPrivateKey");
    const doc = new GoogleSpreadsheet(BRESMILE_SS_ID);
    await doc.useServiceAccountAuth({ client_email: SS_EMAIL, private_key });
    await doc.loadInfo();
    const sheet = sheetByTitle(doc, sheetTitles[type]);

    if (!sheet) {
      res.status(200).json({ error: "No sheet found" });
      return;
    }

    const date = moment().tz(TIMEZONE).format("YYYY-MM-DD");

    /* prettier-ignore */
    const row = {
      "受付日": date,
      "名前": name,
      "電話番号": tel,
      "メール": email,
      "商品名": product,
      "質問1":question_1,
      "質問2": question_2,
      "質問3": question_3,
      "質問4": question_4,
      "質問5": question_5,
      "質問6": question_6,
      "質問6-1": question_6_1,
      "質問6-2": question_6_2,
      "質問7": question_7,
      "質問8": question_8,
      "質問9": question_9,
      "質問10": question_10,
      "質問11": question_11,
      "質問12": question_12,
      "質問13": question_13,
      "質問14": question_14,
      "質問15": question_15,
      "質問16": question_16,
      "質問17": question_17,
      "質問18": question_18,
      "質問19": question_19,
      "質問20": question_20,
    }

    if (type == types[0]) {
      row["エントリー\n理由"] = entry_reason;
    } else {
      row["阻止情報"] = continue_reason;
    }

    await sheet.addRow(row);
    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(200).json({ error: defaultErrorMessage });
  }
};

module.exports = { conversion };
