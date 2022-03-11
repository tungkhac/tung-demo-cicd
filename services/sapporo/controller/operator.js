// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const {
  validationErrors,
  SAPPORO_CPID,
  approvalFlag,
} = require("../constants");
const {
  checkExistedOperator,
  getAllOperators,
  getOperatorByPw,
  sendApprovalMessage,
  sendDeniedMessage,
  setLineMenuToUser,
  getVariableByName,
  saveToMessageVariable,
  putLog,
} = require("../common");
const { UserProfile, Variable, MessageVariable } = require("../../../model");

//sapporo/operator/validate
const validate = async (req, res) => {
  try {
    const { operator_pwd } = req.body;
    putLog("info", `>> operator/validate: ${operator_pwd}`);
    const existed = await checkExistedOperator(operator_pwd);
    if (existed) {
      putLog("info", "<< operator/validate: valid");
      res.json({
        status: "valid",
      });
      return;
    }
    putLog("info", "<< operator/validate: no_operator_found");
    res.json({
      status: "invalid",
      message: validationErrors.no_operator_found,
    });
  } catch (error) {
    putLog("error", `<< operator/validate: ${validationErrors.default}`);
    res.json({
      status: "invalid",
      message: validationErrors.default,
    });
  }
};

const getMessageVariable = async ({ user_id, variable_name }) => {
  if (user_id) {
    const connect_page_id = SAPPORO_CPID;
    const user = await UserProfile.findOne({ user_id, connect_page_id });
    if (!user) {
      return { error: "user not found" };
    }
    const variable = await Variable.findOne({
      connect_page_id,
      variable_name,
    });
    if (!variable) {
      return { error: "invalid configuration" };
    }
    const messagesVariable = await MessageVariable.findOne({
      user_id,
      connect_page_id,
      variable_id: variable._id,
    });
    return { messagesVariable };
  }
  return { error: "user not found" };
};

const APPROVED_OR_DENIED_ERROR = "APPROVED_OR_DENIED_ERROR";

const getApprovalFlagVariableId = async ({ user_id }) => {
  const { error, messagesVariable } = await getMessageVariable({
    user_id,
    variable_name: "承認フラグ", //"approval_flag",
  });
  if (!error) {
    if (!messagesVariable) {
      return { error: "invalid configuration" };
    }
    if (
      messagesVariable.variable_value == approvalFlag.approved ||
      messagesVariable.variable_value == approvalFlag.denied
    ) {
      return { error: APPROVED_OR_DENIED_ERROR };
    }
    return { variable_id: messagesVariable.variable_id };
  } else {
    return { error };
  }
};

const saveFirstPushMessageVariable = async ({ user_id }) => {
  const variable = await getVariableByName({
    variable_name: "初回プッシュ", //"first_push",
  });
  /* istanbul ignore else  */
  if (variable && variable._id) {
    await saveToMessageVariable({
      user_id,
      connect_page_id: SAPPORO_CPID,
      variable_id: variable._id,
      variable_value: 0,
    });
  }
};

const getNameByUserId = async (user_id) => {
  const variable = await getVariableByName({ variable_name: "氏名" }); //"name"
  if (variable) {
    const messageVariable = await MessageVariable.findOne({
      user_id,
      connect_page_id: SAPPORO_CPID,
      variable_id: variable._id,
    });
    if (messageVariable) {
      return messageVariable.variable_value || "";
    }
  }
  return "";
};

//sapporo/approve
const approve = async (req, res) => {
  const { user_id } = req.query;
  putLog("info", `>> sapporo/approve: ${user_id}`);
  const defaultErrorMessage =
    "エラーが発生しました。システムアドミンをご連絡ください";
  const connect_page_id = SAPPORO_CPID;
  const { error, variable_id } = await getApprovalFlagVariableId({ user_id });
  if (!error) {
    if (variable_id) {
      await saveToMessageVariable({
        user_id,
        connect_page_id,
        variable_id,
        variable_value: approvalFlag.approved,
      });
      await saveFirstPushMessageVariable({ user_id });
    }
    const name = await getNameByUserId(user_id);
    putLog("info", `<< sapporo/approve: approved ${user_id}`);
    return res.render("sapporo_approval", {
      message: `${name}のユーザー情報が承認されました。`,
    });
  } else {
    if (error === APPROVED_OR_DENIED_ERROR) {
      const name = await getNameByUserId(user_id);
      putLog("info", `<< sapporo/approve: APPROVED_OR_DENIED_ERROR ${user_id}`);
      return res.render("sapporo_approval_error", {
        error: `${name} のユーザー情報が既に承認／否認されました。<br/>再度ご確認をお願いいたします。`,
      });
    }
    putLog("error", `<< sapporo/approve: ${defaultErrorMessage}`);
    return res.render("sapporo_approval_error", { error: defaultErrorMessage });
  }
};

//sapporo/deny
const deny = async (req, res) => {
  const { user_id } = req.query;
  putLog("info", `>> sapporo/deny: ${user_id}`);
  const defaultErrorMessage =
    "エラーが発生しました。システムアドミンをご連絡ください";
  const connect_page_id = SAPPORO_CPID;
  const { error, variable_id } = await getApprovalFlagVariableId({ user_id });
  if (!error) {
    if (variable_id) {
      await saveToMessageVariable({
        user_id,
        connect_page_id,
        variable_id,
        variable_value: approvalFlag.denied,
      });
      await saveFirstPushMessageVariable({ user_id });
    }
    const name = await getNameByUserId(user_id);
    putLog("info", `<< sapporo/deny: denied ${user_id}`);
    return res.render("sapporo_approval", {
      message: `${name}のユーザー情報が否認されました。`,
    });
  } else {
    if (error === APPROVED_OR_DENIED_ERROR) {
      const name = await getNameByUserId(user_id);
      putLog("info", `<< sapporo/deny: APPROVED_OR_DENIED_ERROR ${user_id}`);
      return res.render("sapporo_approval_error", {
        error: `${name} のユーザー情報が既に承認／否認されました。<br/>再度ご確認をお願いいたします。`,
      });
    }
    putLog("error", `<< sapporo/deny: ${defaultErrorMessage}`);
    return res.render("sapporo_approval_error", { error: defaultErrorMessage });
  }
};

//sapporo/contact
const contact = async (req, res) => {
  const { user_id } = req.query;
  putLog("info", `>> sapporo/contact: ${user_id}`);
  const { messagesVariable } = await getMessageVariable({
    user_id,
    variable_name: "担当者ID", //"operator_id",
  });
  if (messagesVariable) {
    const { variable_value } = messagesVariable;
    if (variable_value) {
      const operators = await getAllOperators();
      /* istanbul ignore else  */
      if (Array.isArray(operators)) {
        for (const operator of operators) {
          if (operator.id == variable_value) {
            putLog("info", ">> sapporo/contact: FOUND");
            res.redirect(operator.lineWorkUrl);
            return;
          }
        }
      }
    }
  }
  putLog("info", ">> sapporo/contact: NOT FOUND");
  res.status(404).send("NOT FOUND");
};

//sapporo/operator
const getOperatorId = async (req, res) => {
  const { pw } = req.query;
  putLog("info", `>> sapporo/operator: ${pw}`);
  const operator = await getOperatorByPw(pw);
  const id = operator ? operator.id || "" : "";
  const affiliation = operator ? operator.affiliation || "" : "";
  const name = operator ? operator.name || "" : "";
  putLog("info", `<< sapporo/contact: ${id}-${affiliation}-${name}`);
  res.status(200).json({ id, affiliation, name });
};

module.exports = { validate, approve, deny, contact, getOperatorId };
