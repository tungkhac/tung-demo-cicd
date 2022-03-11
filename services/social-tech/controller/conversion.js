// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const config = require("config");
const get = require("lodash/get");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { SOCIAL_TECH_SS_ID, SS_EMAIL } = require("../constants");
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
  console.log(">>social-tech/conversion<<", JSON.stringify(req.body));
  try {
    const type = get(req.body, "type");
    if (!types.includes(type)) {
      res.status(200).json({ error: "Invalid type" });
      return;
    }
    const name = get(req.body, "name", "");
    const tel = formatTel(get(req.body, "tel", ""));
    const email = get(req.body, "email", "");
    const continue_reason = get(req.body, "continue_reason", "");
    const entry_reason = get(req.body, "entry_reason", "");
    const question_1 = get(req.body, "question_1", "");
    const question_2 = get(req.body, "question_2", "");
    const question_3 = get(req.body, "question_3", "");
    const question_4 = get(req.body, "question_4", "");
    const question_5 = get(req.body, "question_5", "");
    const question_6 = get(req.body, "question_6", "");
    const question_6_1 = get(req.body, "question_6_1", "");
    const question_6_2 = get(req.body, "question_6_2", "");
    const question_7 = get(req.body, "question_7", "");
    const question_7_1 = get(req.body, "question_7_1", "");
    const question_7_2 = get(req.body, "question_7_2", "");

    const private_key = config.get("sapporoSSPrivateKey");
    const doc = new GoogleSpreadsheet(SOCIAL_TECH_SS_ID);
    await doc.useServiceAccountAuth({ client_email: SS_EMAIL, private_key });
    await doc.loadInfo();
    const sheet = sheetByTitle(doc, sheetTitles[type]);
    if (!sheet) {
      res.status(200).json({ error: "No sheet found" });
      return;
    }
    const date = moment().tz(TIMEZONE).format("YYYY-MM-DD");
    if (type == types[0]) {
      /* prettier-ignore */
      const row = {
        "受付日": date,
        "名前": name,
        "電話番号": tel,
        "メール": email,
        "エントリー\n理由": entry_reason,
        "質問1":question_1,
        "質問2": question_2,
        "質問3": question_3,
        "質問4": question_4,
        "質問5": question_5,
        "質問6": question_6,
        "質問6-1": question_6_1,
        "質問6-2": question_6_2,
        "質問7": question_7,
        "質問7-1": question_7_1,
        "質問7-2": question_7_2,
      };
      await sheet.addRow(row);
    } else /* istanbul ignore else */ if (type == types[1]) {
      /* prettier-ignore */
      const row = {
        "受付日": date,
        "名前": name,
        "電話番号": tel,
        "メール": email,
        "阻止情報": continue_reason,
        "質問1": question_1,
        "質問2": question_2,
        "質問3": question_3,
        "質問4": question_4,
        "質問5": question_5,
      };
      await sheet.addRow(row);
    }
    res.status(200).json({ status: "OK" });
  } catch (error) {
    res.status(200).json({ error: defaultErrorMessage });
  }
};

module.exports = { conversion };
