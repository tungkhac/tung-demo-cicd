// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const config = require("config");
const isProductionMode = () => {
  try {
    return config.has("appEnv") && config.get("appEnv") === "botchan";
  } catch (err) {
    return false;
  }
};

const OPERATORS_SS_ID = isProductionMode()
  ? "1LY_sMB3s-1r0xeo8gK1CW4n4_fIvF29gNo_EWwj0Wd0" //PRD
  : "1bWXf798fwjOb52_lf8M5NBfbZxQR8foXCXCGQjUgG-c";
// const USERS_SS_ID = isProductionMode()
//   ? "PRO-1JIrT8MMrH8ek3NNzP4uIJ1Rs6yLUJYId23aItCNNQc4" //: PRD
//   : "1JIrT8MMrH8ek3NNzP4uIJ1Rs6yLUJYId23aItCNNQc4";
const SAPPORO_CPID = isProductionMode()
  ? "5fd6f6b9a24a61ed991a04d2" //PRD
  : "602cf0d50643a2031b0a2549";
const SS_EMAIL = isProductionMode()
  ? "sapporo@sapporo-308107.iam.gserviceaccount.com" //PRD
  : "ss-read-write@sapporo-dev-305306.iam.gserviceaccount.com";

const validationErrors = {
  default: "エラーが発生しました。システムアドミンをご連絡ください。",
  no_operator_found: "このあいことばは存在していません。",
};
const registerErrors = {
  default: "エラーが発生しました。システムアドミンをご連絡ください。",
  no_operator_found: "このあいことばは存在していません。",
  invalidInput: "エラーが発生しました。システムアドミンをご連絡ください。",
};
const approvalFlag = { default: 0, approved: 1, denied: 9 };
const menuDefaultFlag = { default: 1, not_default: 0 };

const approvedLineMessage =
  "いつもお世話になっております。\
サッポロビール飲食店様専用公式ＬＩＮＥにご参加いただきありがとうございます。\
お役に立てる情報や弊社おすすめ商品・キャンペーン情報等を配信していきますのでよろしくお願い致します。\
お問い合わせ等ございましたら、メニューの「担当者にＬＩＮＥする」を\
タップいただくとＬＩＮＥで貴店の弊社営業担当者宛てに直接メッセージが送れます。";

const approvedLineMessageWithOperatorName =
  "いつもお世話になっております。サッポロビール営業担当の{{OperatorName}}です。\
サッポロビール飲食店様専用公式ＬＩＮＥにご参加いただきありがとうございます。\
お役に立てる情報や弊社おすすめ商品・キャンペーン情報等を配信していきますのでよろしくお願い致します。\
お問い合わせ等ございましたら、メニューの「担当者にＬＩＮＥする」を\
タップいただくとＬＩＮＥで{{OperatorName}}宛てに直接メッセージが送れます。";

const deniedLineMessage =
  "【否認】\
サッポロビール飲食店様専用公式ＬＩＮＥへの情報登録ありがとうございます。\
登録の際エラーが発生してしまいました。\
恐れ入りますが、ご案内させていただきました弊社営業担当者へパスワードをご確認の上、\
再度登録をお願い致します。";

module.exports = {
  OPERATORS_SS_ID,
  SAPPORO_CPID,
  SS_EMAIL,
  // USERS_SS_ID,
  validationErrors,
  registerErrors,
  approvalFlag,
  approvedLineMessage,
  deniedLineMessage,
  approvedLineMessageWithOperatorName,
  isProductionMode,
  menuDefaultFlag,
};
