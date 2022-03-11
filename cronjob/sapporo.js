// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const {
  sendMail,
  getAllOperators,
  getVariableByName,
  sendLineMessageWithToken,
  setLineMenuToUserWithToken,
  getAccessToken,
  saveToMessageVariable,
  sendApprovalEmail,
  preg_quote,
  sendReminderUsersEmail,
  getMenuIdByDefault,
  // menuIdByTitle,
} = require("../services/sapporo/common");
const { MessageVariable, Variable, UserProfile } = require("../model");
const {
  SAPPORO_CPID,
  approvalFlag,
  approvedLineMessage,
  approvedLineMessageWithOperatorName,
  deniedLineMessage,
  // USERS_SS_ID,
  SS_EMAIL,
  menuDefaultFlag,
} = require("../services/sapporo/constants");
const get = require("lodash/get");
const config = require("config");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const { logToChatwork } = require("../services/utils");
const TIMEZONE = config.get("timezone");
const moment = require("moment-timezone");

const getApprovalUsers = async () => {
  const approvalFlagVariable = await getVariableByName({
    variable_name: "承認フラグ", //"approval_flag",
  });
  if (!approvalFlagVariable) return;
  const messagesVariables = await MessageVariable.find({
    connect_page_id: SAPPORO_CPID,
    variable_id: approvalFlagVariable._id,
    variable_value: approvalFlag.default,
  });
  const users = [];
  if (Array.isArray(messagesVariables)) {
    const yesterday = new Date();
    yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayTime = yesterday.getTime();
    for (const messagesVariable of messagesVariables) {
      const date = new Date(messagesVariable.updated_at);
      const isReminder = date && date.getTime() < yesterdayTime ? true : false;
      users.push({ user_id: messagesVariable.user_id, isReminder });
    }
  }
  return users;
};

const mapUserInfo = (userInfo) => {
  if (userInfo) {
    return {
      ...userInfo,
      name: userInfo["氏名"],
      restaurant: userInfo["取引酒飯店"],
      company_name: userInfo["会社名"],
      barrel_handled: userInfo["取り扱い樽生ビール"],
      phone_number: userInfo["電話番号"],
      municipality: userInfo["市区町村"],
      prefectures: userInfo["都道府県"],
      store_name: userInfo["販売店"],
      operator_id: userInfo["担当者ID"],
    };
  }
  return userInfo;
};

const sendApprovalEmails = async () => {
  console.log(`[${new Date()}]>>SAPPORO::sendApprovalEmails<<`);
  const approvalUsers = await getApprovalUsers();
  if (!Array.isArray(approvalUsers) || approvalUsers.length < 1) return;
  const operators = await getAllOperators();
  if (!Array.isArray(operators) || operators.length < 1) return;
  const operatorMap = {};
  for (const operator of operators) {
    if (operator.id && operator.email) {
      operatorMap[operator.id] = operator.email;
    }
  }
  if (Object.keys(operatorMap).length < 1) return;

  const variableNames = [
    "氏名", //"name",
    "販売店", //"store_name",
    "パスワード", //"operator_pw",
    "担当者ID", //"operator_id",
    "都道府県", //"prefectures",
    "市区町村", //"municipality",
    "電話番号", //"phone_number",
    "取り扱い樽生ビール", //"barrel_handled",
    "会社名", //"company_name",
    "取引酒飯店", //"restaurant",
  ];
  const connect_page_id = SAPPORO_CPID;
  const variables = await Variable.find({
    connect_page_id,
    variable_name: { $in: variableNames },
  });
  if (!Array.isArray(variables) || variables.length < 1) return;
  const variableMap = {};
  const variableIds = [];
  for (const variable of variables) {
    variableMap[variable._id] = variable.variable_name;
    variableIds.push(variable._id);
  }

  const reminders = {};
  for (const { user_id, isReminder } of approvalUsers) {
    const user = await UserProfile.findOne({ user_id, connect_page_id });
    const display_name = get(user, "user_display_name") || "";
    const messageVariables = await MessageVariable.find({
      connect_page_id,
      user_id,
      variable_id: { $in: variableIds },
    });
    const userInfo = { display_name, user_id, isReminder };
    for (const messageVariable of messageVariables) {
      userInfo[variableMap[messageVariable.variable_id]] =
        messageVariable.variable_value;
    }
    const user_operator_id = userInfo["担当者ID"] || "";
    if (operatorMap[user_operator_id]) {
      userInfo.to = operatorMap[user_operator_id];
      if (isReminder) {
        if (!reminders[user_operator_id]) {
          reminders[user_operator_id] = [];
        }
        reminders[user_operator_id].push(mapUserInfo(userInfo));
      } else {
        console.log(
          `[${new Date()}]>>SAPPORO::sendApprovalEmail<< ${userInfo.to}`
        );
        await sendApprovalEmail(mapUserInfo(userInfo));
      }
    }
  }
  for (const [operator_id, users] of Object.entries(reminders)) {
    console.log(
      `[${new Date()}]>>SAPPORO::sendReminderUsersEmail<< ${
        operatorMap[operator_id]
      }`
    );
    await sendReminderUsersEmail({ to: operatorMap[operator_id], users });
  }
};

const sendApprovalMessages = async () => {
  console.log(`[${new Date()}]>>SAPPORO::sendApprovalMessages<<`);
  const connect_page_id = SAPPORO_CPID;
  const fistPushVariable = await getVariableByName({
    variable_name: "初回プッシュ", //"first_push",
  });
  const approvalFlagVariable = await getVariableByName({
    variable_name: "承認フラグ", //"approval_flag",
  });
  const operatorIdVariable = await getVariableByName({
    variable_name: "担当者ID", //"operator_id",
  });
  // const approvedMenuId = await menuIdByTitle("メニュー（承認後）");
  const approvedMenuId = await getMenuIdByDefault(menuDefaultFlag.not_default);

  if (!approvedMenuId) return;

  const token = await getAccessToken({ connect_page_id });
  if (
    !fistPushVariable ||
    !approvalFlagVariable ||
    !token ||
    !operatorIdVariable
  )
    return;

  const firstPushMessagesVariables = await MessageVariable.find({
    connect_page_id,
    variable_id: fistPushVariable._id,
    variable_value: 0,
  });
  if (!Array.isArray(firstPushMessagesVariables)) return;

  const operatorMap = {};
  const operators = await getAllOperators();
  if (Array.isArray(operators)) {
    for (const operator of operators) {
      if (operator.id && operator.name) {
        operatorMap[operator.id] = operator.name;
      }
    }
  }

  for (const firstPushMessagesVariable of firstPushMessagesVariables) {
    const approvalFlagMessageVariable = await MessageVariable.findOne({
      connect_page_id,
      user_id: firstPushMessagesVariable.user_id,
      variable_id: approvalFlagVariable._id,
    });
    if (approvalFlagMessageVariable) {
      if (approvalFlagMessageVariable.variable_value == approvalFlag.approved) {
        const operatorIdMessageVariable = await MessageVariable.findOne({
          connect_page_id,
          user_id: firstPushMessagesVariable.user_id,
          variable_id: operatorIdVariable._id,
        });
        let text = approvedLineMessage;
        const operator_id =
          get(operatorIdMessageVariable, "variable_value") || "";
        if (operatorMap[operator_id]) {
          text = approvedLineMessageWithOperatorName.replace(
            new RegExp(preg_quote(`{{OperatorName}}`), "g"),
            operatorMap[operator_id]
          );
        }
        console.log(
          `[${new Date()}]>>SAPPORO::send approved message to ${
            firstPushMessagesVariable.user_id
          }`
        );
        await sendLineMessageWithToken({
          to: [firstPushMessagesVariable.user_id],
          text,
          token,
        });
        console.log(
          `[${new Date()}]>>SAPPORO::set menu to ${
            firstPushMessagesVariable.user_id
          }`
        );
        await setLineMenuToUserWithToken({
          user_id: firstPushMessagesVariable.user_id,
          token,
          rich_menu_id: approvedMenuId,
        });
      } else if (
        approvalFlagMessageVariable.variable_value == approvalFlag.denied
      ) {
        console.log(
          `[${new Date()}]>>SAPPORO::send denied message to ${
            firstPushMessagesVariable.user_id
          }`
        );
        await sendLineMessageWithToken({
          to: [firstPushMessagesVariable.user_id],
          text: deniedLineMessage,
          token,
        });
      }
      await saveToMessageVariable({
        variable_id: fistPushVariable._id,
        user_id: firstPushMessagesVariable.user_id,
        connect_page_id,
        variable_value: 1,
      });
    }
  }
};

// const updateUsersGoogleSheet = async () => {
//   console.log(`[${new Date()}]>>SAPPORO::updateUsersGoogleSheet<<`);
//   const connect_page_id = SAPPORO_CPID;
//   const private_key = config.get("sapporoSSPrivateKey");
//   const doc = new GoogleSpreadsheet(USERS_SS_ID);
//   await doc.useServiceAccountAuth({ client_email: SS_EMAIL, private_key });
//   await doc.loadInfo();
//   const headerValues = [
//     "UID",
//     "LINEの表示名",
//     "氏名",
//     "店舗名",
//     "都道府県",
//     "市区町村",
//     "店舗電話番号",
//     "取り扱い樽生ビール",
//     "企業名",
//     "取引酒飯店様",
//     "担当者紐付けPW",
//     "担当者ID",
//     "承認Flg",
//     "First PUSH",
//   ];

//   let sheet = doc.sheetsByIndex[0];
//   if (sheet) {
//     await sheet.clear();
//     await sheet.setHeaderRow(headerValues);
//   } else {
//     sheet = await doc.addSheet({
//       headerValues,
//       title: "USERS",
//     });
//   }
//   const userIds = await MessageVariable.find({ connect_page_id }).distinct(
//     "user_id"
//   );
//   if (!Array.isArray(userIds) || userIds.length < 1) return;

//   const variableNames = [
//     "name",
//     "store_name",
//     "prefectures",
//     "municipality",
//     "phone_number",
//     "barrel_handled",
//     "company_name",
//     "restaurant",
//     "operator_pw",
//     "operator_id",
//     "first_push",
//     "approval_flag",
//   ];
//   const variables = await Variable.find({
//     connect_page_id,
//     variable_name: { $in: variableNames },
//   });
//   const variableMap = {};
//   const variableIds = [];
//   for (const variable of variables) {
//     variableMap[variable._id] = variable.variable_name;
//     variableIds.push(variable._id);
//   }
//   for (const user_id of userIds) {
//     const user = await UserProfile.findOne({ user_id, connect_page_id });
//     const display_name = get(user, "user_display_name") || "";
//     const messageVariables = await MessageVariable.find({
//       connect_page_id,
//       user_id,
//       variable_id: { $in: variableIds },
//     });
//     const userInfo = {};
//     for (const messageVariable of messageVariables) {
//       userInfo[variableMap[messageVariable.variable_id]] =
//         messageVariable.variable_value;
//     }
//     /* prettier-ignore */
//     await sheet.addRow({
//       "UID": user_id,
//       "LINEの表示名": display_name,
//       "氏名": userInfo.name,
//       "店舗名": userInfo.store_name,
//       "都道府県": userInfo.prefectures,
//       "市区町村": userInfo.municipality,
//       "店舗電話番号": userInfo.phone_number,
//       "取り扱い樽生ビール": userInfo.barrel_handled,
//       "企業名": userInfo.company_name,
//       "取引酒飯店様": userInfo.restaurant,
//       "担当者紐付けPW": userInfo.operator_pw,
//       "担当者ID": userInfo.operator_id,
//       "承認Flg": userInfo.approval_flag,
//       "First PUSH": userInfo.first_push,
//     });
//   }
// };

// const resetMenu = async () => {
//   const connect_page_id = SAPPORO_CPID;
//   const users = await UserProfile.find({ connect_page_id });
//   const token = await getAccessToken({ connect_page_id });
//   if (!token || !Array.isArray(users) || users.length < 1) return;
//   for (const user of users) {
//     await setLineMenuToUserWithToken({
//       user_id: user.user_id,
//       token,
//       rich_menu_id: "richmenu-c6d25ebffccdf1d5fee47fbd6e3fe310",
//     });
//   }
// };

const run = async () => {
  logToChatwork(
    `[info][title]SAPPORO BATCH[/title] STARTED @ ${moment()
      .tz(TIMEZONE)
      .format("YYYY-MM-DD HH:mm:ss")}[/info]`
  );
  await sendApprovalEmails();
  await sendApprovalMessages();
  // await updateUsersGoogleSheet();
  logToChatwork(
    `[info][title]SAPPORO BATCH[/title] ENDED @ ${moment()
      .tz(TIMEZONE)
      .format("YYYY-MM-DD HH:mm:ss")}[/info]`
  );
};

module.exports = {
  run,
  sendApprovalEmails,
  sendApprovalMessages,
  // updateUsersGoogleSheet,
};
