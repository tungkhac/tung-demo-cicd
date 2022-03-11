// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const {
  UserProfile,
  Variable,
  MessageVariable,
  EfoUserProfile,
} = require("../../../model");
const {
  getOperatorByPw,
  // sendApprovalEmail,
  getVariableByName,
  sendMail,
  preg_quote,
  getOperatorById,
  saveToMessageVariable,
  setLineMenuToUser,
  getMenuIdByDefault,
  putLog,
  // menuIdByTitle,
} = require("../common");
const {
  registerErrors,
  approvalFlag,
  SAPPORO_CPID,
  menuDefaultFlag,
} = require("../constants");
const get = require("lodash/get");

const variableNames = [
  "氏名", //"name",
  "販売店", //"store_name",
  "パスワード", //"operator_pw",
  "担当者ID", //"operator_id",
  "所属部署", //"operator_affiliation",
  "担当者氏名", //"operator_name",
  "都道府県", //"prefectures",
  "市区町村", //"municipality",
  "電話番号", //"phone_number",
  "取り扱い樽生ビール", //"barrel_handled",
  "会社名", //"company_name",
  "取引酒飯店", //"restaurant",
  "承認フラグ", //"approval_flag",
];

const getUser = async ({ user_id, connect_page_id }) => {
  const user = await UserProfile.findOne({
    user_id,
    connect_page_id,
  });
  if (!user) {
    throw new Error(registerErrors.invalidInput);
  }
  return user;
};

const getOperator = async (pw) => {
  const operator = await getOperatorByPw(pw);
  if (operator) {
    return operator;
  }
  throw new Error(registerErrors.no_operator_found);
};

const register = async (req, res) => {
  putLog("info", `>>user/register: ${JSON.stringify(req.body)}`);
  const {
    line_cpid,
    user_id,
    name,
    store_name,
    prefectures,
    municipality,
    phone_number,
    barrel_handled,
    company_name,
    restaurant,
    operator_pw,
  } = req.body;
  try {
    if (
      line_cpid &&
      user_id &&
      name &&
      prefectures &&
      municipality &&
      phone_number &&
      barrel_handled &&
      operator_pw
    ) {
      const connect_page_id = line_cpid;
      const user = await getUser({
        user_id,
        connect_page_id,
      });
      const display_name = user.user_display_name || "";
      const variables = await Variable.find({
        connect_page_id,
        variable_name: { $in: variableNames },
      });
      if (
        Array.isArray(variables) &&
        variableNames.length == variables.length
      ) {
        const operator = await getOperator(operator_pw);
        const operator_id = get(operator, "id");
        const operator_affiliation = get(operator, "affiliation");
        const operator_name = get(operator, "name");

        /* prettier-ignore */
        /* istanbul ignore next */
        const values = {
          "氏名": name, //name,
          "販売店": store_name || "", //store_name: store_name || "",
          "パスワード": operator_pw,
          "担当者ID": operator_id,
          "所属部署": operator_affiliation, //operator_affiliation,
          "担当者氏名": operator_name,
          "都道府県": prefectures || "", //prefectures: prefectures || "",
          "市区町村": municipality || "", //municipality: municipality || "",
          "電話番号": phone_number || "", //phone_number: phone_number || "",
          "取り扱い樽生ビール": barrel_handled || "", //barrel_handled: barrel_handled || "",
          "会社名": company_name || "", //company_name: company_name || "",
          "取引酒飯店": restaurant || "", //restaurant: restaurant || "",
          "承認フラグ": approvalFlag.default, //approval_flag: approvalFlag.default,
        };
        const now = new Date();
        for (const variable of variables) {
          await MessageVariable.updateOne(
            {
              connect_page_id,
              user_id,
              variable_id: variable._id,
            },
            {
              $set: {
                variable_value: values[variable.variable_name],
                created_at: now,
                updated_at: now,
              },
            },
            { upsert: true }
          );
        }
        // Send ApprovalEmail by batch
        // const to = get(operator, "email");
        // await sendApprovalEmail({ ...values, to, user_id, display_name });
      }
      putLog("info", "<<user/register: OK");
      res.status(200).json({ status: "OK" });
      return;
    }
    throw new Error(registerErrors.invalidInput);
  } catch (error) {
    /* istanbul ignore next */
    putLog(
      "error",
      `<<user/register: ${error.message ? error.message : error}`
    );
    /* istanbul ignore next */
    res
      .status(500)
      .json({ error_message: error.message ? error.message : error });
  }
};

const getLineUserData = async ({ line_cpid, liff_user_id, cpid, user_id }) => {
  if (!line_cpid || !liff_user_id || !cpid || !user_id) return;
  const efoUser = await EfoUserProfile.findOne({
    connect_page_id: cpid,
    user_id,
    liff_user_id,
  });
  if (!efoUser) return;
  const user = await UserProfile.findOne({
    connect_page_id: line_cpid,
    user_id: liff_user_id,
  });
  if (!user) return;

  // check if user has been denied
  const approvalFlagVariable = await getVariableByName({
    variable_name: "承認フラグ", //"approval_flag",
  });
  if (approvalFlagVariable) {
    const approvalFlagMessageVariable = await MessageVariable.findOne({
      connect_page_id: line_cpid,
      user_id: liff_user_id,
      variable_id: approvalFlagVariable._id,
    });
    const variable_value = get(approvalFlagMessageVariable, "variable_value");
    if (variable_value == approvalFlag.denied) {
      return;
    }
  }

  const variables = await Variable.find({
    connect_page_id: line_cpid,
    variable_name: { $in: updateVariableNames },
  });
  if (
    Array.isArray(variables) &&
    updateVariableNames.length == variables.length
  ) {
    const variableMap = {};
    const variableIds = [];
    for (const variable of variables) {
      variableMap[variable._id] = variable.variable_name;
      variableIds.push(variable._id);
    }
    const messageVariables = await MessageVariable.find({
      connect_page_id: line_cpid,
      user_id: liff_user_id,
      variable_id: { $in: variableIds },
    });
    if (Array.isArray(messageVariables) && messageVariables.length > 0) {
      const userInfo = {};
      for (const messageVariable of messageVariables) {
        userInfo[variableMap[messageVariable.variable_id]] =
          messageVariable.variable_value;
      }
      return userInfo;
    }
  }
};

const sync = async (req, res) => {
  putLog("info", `>>user/sync: ${JSON.stringify(req.body)}`);
  const data = await getLineUserData(req.body);
  putLog("info", `<<user/sync: ${data ? JSON.stringify(data) : "NOT_FOUND"}`);
  res.status(200).json({ registered: data ? "1" : "0", ...(data || {}) });
};

const updateVariableNames = [
  "氏名", //"name",
  "販売店", //"store_name",
  "都道府県", //"prefectures",
  "市区町村", //"municipality",
  "電話番号", //"phone_number",
  "取り扱い樽生ビール", //"barrel_handled",
  "会社名", //"company_name",
  "取引酒飯店", //"restaurant",
];

const update = async (req, res) => {
  putLog("info", `>>user/update: ${JSON.stringify(req.body)}`);
  const {
    line_cpid,
    user_id,
    name,
    store_name,
    prefectures,
    municipality,
    phone_number,
    barrel_handled,
    company_name,
    restaurant,
  } = req.body;
  try {
    if (
      line_cpid &&
      user_id &&
      name &&
      prefectures &&
      municipality &&
      phone_number &&
      barrel_handled &&
      restaurant
    ) {
      const connect_page_id = line_cpid;
      const user = await getUser({
        user_id,
        connect_page_id,
      });
      const display_name = user.user_display_name || "";
      const variables = await Variable.find({
        connect_page_id,
        variable_name: { $in: updateVariableNames },
      });
      /* istanbul ignore else */
      if (
        Array.isArray(variables) &&
        updateVariableNames.length == variables.length
      ) {
        /* prettier-ignore */
        /* istanbul ignore next */
        const values = {
          "氏名": name, //name,
          "販売店": store_name || "", //store_name: store_name || "",
          "都道府県": prefectures || "", //prefectures: prefectures || "",
          "市区町村": municipality || "", //municipality: municipality || "",
          "電話番号": phone_number || "", //phone_number: phone_number || "",
          "取り扱い樽生ビール": barrel_handled || "", //barrel_handled: barrel_handled || "",
          "会社名": company_name || "", //company_name: company_name || "",
          "取引酒飯店": restaurant || "", //restaurant: restaurant || "",
        };
        const now = new Date();
        for (const variable of variables) {
          await MessageVariable.updateOne(
            {
              connect_page_id,
              user_id,
              variable_id: variable._id,
            },
            {
              $set: {
                variable_value: values[variable.variable_name],
                created_at: now,
                updated_at: now,
              },
            },
            { upsert: true }
          );
        }
      }
      putLog("info", ">>user/update: OK");
      res.status(200).json({ status: "OK" });
      return;
    }
    throw new Error(registerErrors.invalidInput);
  } catch (error) {
    /* istanbul ignore next */
    putLog("error", `<<user/update: ${error.message ? error.message : error}`);
    /* istanbul ignore next */
    res
      .status(500)
      .json({ error_message: error.message ? error.message : error });
  }
};

const unsubscribe = async (req, res) => {
  putLog("info", `>>user/unsubscribe: ${JSON.stringify(req.body)}`);
  let html =
    "下記ユーザーからの退会処理を受け付けました。<br/>\
<br/>\
===<br/>\
氏名：{{name}}<br/>\
店舗名：{{store_name}}<br/>\
===<br/>\
<br/>\
※このメールはBOTCHANシステムから自動的に送信されています。<br/>\
　このメールに返信を行わないでください。";

  let subject = "{{name}} から退会がありました【LINE公式アカウント】";
  const { user_id } = req.body;
  const connect_page_id = SAPPORO_CPID;

  try {
    const user = await getUser({
      user_id,
      connect_page_id,
    });
    // save unsubscribeFlag
    const unsubscribeFlagVariable = await getVariableByName({
      variable_name: "退会フラグ", //"unsubscribeFlag",
    });
    if (unsubscribeFlagVariable) {
      await saveToMessageVariable({
        variable_id: unsubscribeFlagVariable._id,
        user_id: user_id,
        connect_page_id,
        variable_value: 1,
      });
    }
    const names = [
      "氏名", //"name",
      "担当者ID", //"operator_id",
      "販売店", //"store_name"
    ];
    //send email
    const variables = await Variable.find({
      connect_page_id,
      variable_name: { $in: names },
    });
    if (!Array.isArray(variables) || variables.length < 1) return;
    const variableMap = {};
    const variableIds = [];
    for (const variable of variables) {
      variableMap[variable._id] = variable.variable_name;
      variableIds.push(variable._id);
    }
    const messageVariables = await MessageVariable.find({
      connect_page_id,
      user_id,
      variable_id: { $in: variableIds },
    });
    const userInfo = { user_id };
    for (const messageVariable of messageVariables) {
      userInfo[variableMap[messageVariable.variable_id]] =
        messageVariable.variable_value;
    }
    // const operator = await getOperatorById(userInfo.operator_id);
    const operator = await getOperatorById(userInfo["担当者ID"]);
    /* istanbul ignore else */
    if (operator && operator.email) {
      /* istanbul ignore next */
      subject = subject.replace(
        new RegExp(preg_quote("{{name}}"), "g"),
        // userInfo.name || ""
        userInfo["氏名"] || ""
      );
      /* istanbul ignore next */
      const values = {
        // name: userInfo.name || "",
        name: userInfo["氏名"] || "",
        // store_name: userInfo.store_name || "",
        store_name: userInfo["販売店"] || "",
      };
      for (const key in values) {
        html = html.replace(
          new RegExp(preg_quote(`{{${key}}}`), "g"),
          values[key]
        );
      }
      await sendMail({ to: operator.email, subject, html });
    }
    // const defaultMenuId = await menuIdByTitle("メニュー");
    const defaultMenuId = await getMenuIdByDefault(menuDefaultFlag.default);
    /* istanbul ignore else */
    if (defaultMenuId) {
      await setLineMenuToUser({
        user_id,
        connect_page_id,
        rich_menu_id: defaultMenuId,
      });
    }
  } catch (error) {
    /* istanbul ignore next */
    putLog(
      "error",
      `<<user/unsubscribe: ${error.message ? error.message : error}`
    );
  }
  res.status(200).json({ status: "OK" });
};

module.exports = { register, update, sync, unsubscribe };
