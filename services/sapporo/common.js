// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const { GoogleSpreadsheet } = require("google-spreadsheet");
const mailer = require("nodemailer");
const config = require("config");
const {
  OPERATORS_SS_ID,
  SS_EMAIL,
  SAPPORO_CPID,
  deniedLineMessage,
  approvedLineMessage,
  isProductionMode,
} = require("./constants");
const { ConnectPage, Variable, MessageVariable, Menu } = require("../../model");
const request = require("request");

const approvalEmailHtml =
  '下記の登録内容で新規登録がありました。<br/>\
<br/>\
内容を確認して、承認／否認を行ってください。<br/>\
<br/>\
登録内容<br/>\
——<br/>\
氏名：{{name}}<br/><br/>\
店舗名：{{store_name}}<br/>\
都道府県：{{prefectures}}<br/>\
市区町村：{{municipality}}<br/>\
店舗電話番号：{{phone_number}}<br/>\
取り扱い樽生ビール：{{barrel_handled}}<br/>\
<br/>\
企業名：{{company_name}}<br/>\
取引酒飯店様：{{restaurant}}<br/>\
<br/>\
LINEの表示名：{{display_name}}<br/>\
___<br/>\
<br/>\
承認する場合→<a href="{{approval_url}}">{{approval_url}}</a><br/>\
否認する場合→<a href="{{deny_url}}">{{deny_url}}</a><br/>\
<br/>\
※このメールはBOTCHANシステムから自動で送信されています。<br/>\
　返信しないでください。';

const approvalEmailSubject =
  "【新規申し込み】{{店舗名}} から新規登録がありました（LINE公式アカウント）";

const reminderEmailHtml =
  '下記の登録内容で新規登録がありました。<br/>\
承認操作がされておりません。<br/>\
<br/>\
内容を確認して、承認／否認を行ってください。<br/>\
<br/>\
登録内容<br/>\
——<br/>\
氏名：{{name}}<br/>\
店舗名：{{store_name}}<br/>\
都道府県：{{prefectures}}<br/>\
市区町村：{{municipality}}<br/>\
店舗電話番号：{{phone_number}}<br/>\
取り扱い樽生ビール：{{barrel_handled}}<br/>\
<br/>\
企業名：{{company_name}}<br/>\
取引酒飯店様：{{restaurant}}<br/>\
<br/>\
LINEの表示名：{{display_name}}<br/>\
___<br/>\
<br/>\
承認する場合→<a href="{{approval_url}}">{{approval_url}}</a><br/>\
否認する場合→<a href="{{deny_url}}">{{deny_url}}</a><br/>\
<br/>\
※こちらはリマインドメールです。<br/>\
　すでに対応済みで行き違いがある場合があります。<br/>\
※このメールはBOTCHANシステムから自動で送信されています。<br/>\
　返信しないでください。';

const reminderEmailSubject =
  "【承認リマインド】{{store_name}}から新規登録がありました";

/* istanbul ignore next */
const approvalUrl = isProductionMode()
  ? "https://api.botchan.chat/sapporo/approve?user_id={{user_id}}"
  : "https://stg2-sun.botchan.chat:3073/sapporo/approve?user_id={{user_id}}";

/* istanbul ignore next */
const denyUrl = isProductionMode()
  ? "https://api.botchan.chat/sapporo/deny?user_id={{user_id}}"
  : "https://stg2-sun.botchan.chat:3073/sapporo/deny?user_id={{user_id}}";

const bcc =
  "Koji.Yoshihara@sapporobeer.co.jp,Yoshikatsu.Hayashi@sapporobeer.co.jp";

const Log4js = require("log4js");
const logger = Log4js.getLogger("sapporo");

const putLog = (level, log) => {
  switch (level) {
    case "info":
      logger.info(log);
      break;
    case "error":
      logger.error(log);
      break;
    default:
      break;
  }
};

const preg_quote = (str, delimiter) => {
  return (str + "").replace(
    new RegExp(
      "[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\" + (delimiter || "") + "-]",
      "g"
    ),
    "\\$&"
  );
};

const sendApprovalEmail = async ({
  isReminder,
  user_id,
  to,
  name,
  store_name,
  prefectures,
  municipality,
  phone_number,
  barrel_handled,
  company_name,
  restaurant,
  display_name,
}) => {
  let subject =
    isReminder === true ? reminderEmailSubject : approvalEmailSubject;
  subject = subject.replace(
    new RegExp(preg_quote("{{店舗名}}"), "g"),
    store_name || ""
  );
  let html = isReminder === true ? reminderEmailHtml : approvalEmailHtml;
  const approval_url = approvalUrl.replace(
    new RegExp(preg_quote(`{{user_id}}`), "g"),
    user_id
  );
  const deny_url = denyUrl.replace(
    new RegExp(preg_quote(`{{user_id}}`), "g"),
    user_id
  );

  const values = {
    name: name || "",
    store_name: store_name || "",
    prefectures: prefectures || "",
    municipality: municipality || "",
    phone_number: phone_number || "",
    barrel_handled: barrel_handled || "",
    company_name: company_name || "",
    restaurant: restaurant || "",
    display_name: display_name || "",
    approval_url,
    deny_url,
  };
  for (const key in values) {
    html = html.replace(new RegExp(preg_quote(`{{${key}}}`), "g"), values[key]);
  }
  await sendMail({ to, bcc, subject, html });
};

const sendMail = async ({ to, cc, bcc, subject, html }) => {
  const transporter = mailer.createTransport({
    host: config.get("mail_host"),
    port: 25,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });
  const promise = new Promise((resolve) => {
    transporter.sendMail(
      {
        from: config.get("mail_from"),
        to,
        subject,
        cc,
        bcc,
        html,
      },
      (err, info) => {
        resolve();
      }
    );
  });
  await promise;
};

const getAllOperators = async () => {
  const operators = [];
  const private_key = config.get("sapporoSSPrivateKey");
  const doc = new GoogleSpreadsheet(OPERATORS_SS_ID);
  await doc.useServiceAccountAuth({ client_email: SS_EMAIL, private_key });
  await doc.loadInfo();
  const rows = await doc.sheetsByIndex[0].getRows();
  for (const row of rows) {
    operators.push({
      id: row["ID"],
      affiliation: row["所属名称"],
      pw: row["合言葉"],
      name: row["社員名称"],
      email: row["メールアドレス"],
      lineWorkUrl: row["招待コード"],
    });
  }
  return operators;
};

const getOperatorByPw = async (pw) => {
  if (pw) {
    const operators = await getAllOperators();
    for (const operator of operators) {
      if (pw == operator.pw) {
        return operator;
      }
    }
  }
};

const getOperatorById = async (id) => {
  if (id) {
    const operators = await getAllOperators();
    for (const operator of operators) {
      if (id == operator.id) {
        return operator;
      }
    }
  }
};

const checkExistedOperator = async (pw) => {
  if (pw) {
    const operator = await getOperatorByPw(pw);
    return !!operator;
  }
  return false;
};

const getAccessToken = async ({ connect_page_id }) => {
  const page = await ConnectPage.findOne({
    _id: connect_page_id,
    deleted_at: null,
  });
  if (page && page.channel_access_token) {
    return page.channel_access_token;
  }
};

const setLineMenuToUserWithToken = async ({ user_id, token, rich_menu_id }) => {
  if (user_id && token && rich_menu_id) {
    const promise = new Promise((resolve) => {
      request(
        {
          uri: `https://api.line.me/v2/bot/user/${user_id}/richmenu/${rich_menu_id}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        (error, response, body) => {
          resolve();
        }
      );
    });
    await promise;
  }
};

const setLineMenuToUser = async ({
  user_id,
  connect_page_id,
  rich_menu_id,
}) => {
  if (user_id && connect_page_id && rich_menu_id) {
    const token = await getAccessToken({ connect_page_id });
    await setLineMenuToUserWithToken({ user_id, rich_menu_id, token });
  }
};

const sendLineMessageWithToken = async ({ text, to, token }) => {
  if (token && text && to) {
    const json = {
      to,
      messages: [
        {
          type: "text",
          text,
        },
      ],
    };
    const promise = new Promise((resolve) => {
      request(
        {
          uri: "https://api.line.me/v2/bot/message/multicast",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          json,
        },
        (error, response, body) => {
          resolve();
        }
      );
    });
    await promise;
  }
};

const sendLineMessage = async ({ text, to, connect_page_id }) => {
  if (to && text && connect_page_id) {
    const token = await getAccessToken({ connect_page_id });
    await sendLineMessageWithToken({ text, to, token });
  }
};

const sendApprovalMessage = async ({ users, connect_page_id }) => {
  await sendLineMessage({
    to: users,
    text: approvedLineMessage,
    connect_page_id,
  });
};

const sendDeniedMessage = async ({ users, connect_page_id }) => {
  await sendLineMessage({
    to: users,
    text: approvedLineMessage,
    connect_page_id,
  });
};

const getVariableByName = async ({ variable_name }) => {
  if (variable_name) {
    const variable = await Variable.findOne({
      connect_page_id: SAPPORO_CPID,
      variable_name,
    });
    if (variable) return variable;
  }
};

const saveToMessageVariable = async ({
  variable_id,
  user_id,
  connect_page_id,
  variable_value,
}) => {
  const now = new Date();
  await MessageVariable.updateOne(
    {
      connect_page_id,
      user_id,
      variable_id,
    },
    {
      $set: {
        variable_value,
        created_at: now,
        updated_at: now,
      },
    },
    { upsert: true }
  );
};

const reminderUsersEmailSubject =
  "【承認リマインド】いくつかの店舗名新規登録がありました（LINE公式アカウント）";
const reminderUsersEmailTop =
  "下記の登録内容で新規登録がありました。<br/>\
承認操作がされておりません。<br/>\
<br/>\
内容を確認して、承認／否認を行ってください。<br/><br/>";
const reminderUsersEmailUser =
  '氏名：{{name}}<br/>\
店舗名：{{store_name}}<br/>\
都道府県：{{prefectures}}<br/>\
市区町村：{{municipality}}<br/>\
店舗電話番号：{{phone_number}}<br/>\
取り扱い樽生ビール：{{barrel_handled}}<br/>\
<br/>\
企業名：{{company_name}}<br/>\
取引酒飯店様：{{restaurant}}<br/>\
<br/>\
LINEの表示名：{{display_name}}<br/>\
___<br/>\
承認する場合→<a href="{{approval_url}}">{{approval_url}}</a><br/>\
否認する場合→<a href="{{deny_url}}">{{deny_url}}</a><br/><br/>';

const reminderUsersEmailStore = "◾️{{store_name}}<br/>\
登録内容<br/>___<br/>";
const reminderUsersEmailBottom =
  "※こちらはリマインドメールです。<br/>\
　すでに対応済みで行き違いがある場合があります。<br/>\
※このメールはBOTCHANシステムから自動で送信されています。<br/>\
　返信しないでください。";

const sendReminderUsersEmail = async ({ to, users }) => {
  let html = reminderUsersEmailTop;
  const stores = {};

  for (const user of users) {
    const store_name = user.store_name || "";
    if (!stores[store_name]) {
      stores[store_name] = [];
    }
    stores[store_name].push(user);
  }

  for (const [store_name, storeUsers] of Object.entries(stores)) {
    html += reminderUsersEmailStore.replace(
      new RegExp(preg_quote(`{{store_name}}`), "g"),
      store_name
    );
    for (const user of storeUsers) {
      const approval_url = approvalUrl.replace(
        new RegExp(preg_quote(`{{user_id}}`), "g"),
        user.user_id
      );
      const deny_url = denyUrl.replace(
        new RegExp(preg_quote(`{{user_id}}`), "g"),
        user.user_id
      );
      const values = {
        name: user.name || "",
        store_name: user.store_name || "",
        prefectures: user.prefectures || "",
        municipality: user.municipality || "",
        phone_number: user.phone_number || "",
        barrel_handled: user.barrel_handled || "",
        company_name: user.company_name || "",
        restaurant: user.restaurant || "",
        display_name: user.display_name || "",
        approval_url,
        deny_url,
      };
      let userHtml = reminderUsersEmailUser;
      for (const key in values) {
        userHtml = userHtml.replace(
          new RegExp(preg_quote(`{{${key}}}`), "g"),
          values[key]
        );
      }
      html += userHtml;
    }
  }
  html += reminderUsersEmailBottom;
  await sendMail({ to, bcc, subject: reminderUsersEmailSubject, html });
};

const getMenuIdByDefault = async (default_flg) => {
  const connect_page_id = SAPPORO_CPID;
  const menu = await Menu.findOne({ connect_page_id, default_flg });
  if (menu) {
    return menu.richMenuId;
  }
};

module.exports = {
  preg_quote,
  checkExistedOperator,
  getOperatorByPw,
  sendApprovalEmail,
  sendMail,
  getAllOperators,
  setLineMenuToUser,
  sendApprovalMessage,
  sendDeniedMessage,
  getVariableByName,
  sendLineMessageWithToken,
  setLineMenuToUserWithToken,
  getAccessToken,
  saveToMessageVariable,
  getOperatorById,
  sendReminderUsersEmail,
  getMenuIdByDefault,
  putLog,
};
