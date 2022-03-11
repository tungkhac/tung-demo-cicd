// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const axios = require("axios");
const FormData = require("form-data");
const {
  GMO_API,
  GMO_CREATE_MEMBER,
  GMO_SEARCH_MEMBER,
  GMO_ENTRY_TRAN,
  GMO_EXEC_TRAN,
  GMO_ADD_CARD,
  GMO_SEARCH_CARD,
} = require("./constants");
const qs = require("querystring");
const { generateGMOError, generateLog } = require("./helper");

const createMember = async ({ memberID, memberName, siteID, sitePass }) => {
  try {
    const form = new FormData();
    form.append("MemberID", memberID);
    form.append("MemberName", memberName);
    form.append("SiteID", siteID);
    form.append("SitePass", sitePass);
    const result = await axios.post(GMO_API + GMO_CREATE_MEMBER, form, {
      headers: form.getHeaders(),
    });
    const { MemberID, ErrInfo } = qs.parse(result.data);
    if (ErrInfo) {
      throw new Error(generateGMOError(ErrInfo));
    }
    if (MemberID) return MemberID;
  } catch (err) {
    console.log(generateLog("GMO createMember error", err));
    throw err;
  }
};

const entryTran = async (data) => {
  const { orderID, amount, jobCd = "CAPTURE", shopID, shopPass } = data;
  const form = new FormData();
  form.append("OrderID", orderID);
  form.append("Amount", amount);
  form.append("JobCd", jobCd);
  form.append("ShopID", shopID);
  form.append("ShopPass", shopPass);
  const result = await axios.post(GMO_API + GMO_ENTRY_TRAN, form, {
    headers: form.getHeaders(),
  });
  const { AccessID, AccessPass, ErrInfo } = qs.parse(result.data);
  if (ErrInfo) {
    throw new Error(generateGMOError(ErrInfo));
  }
  if (AccessID)
    return {
      accessID: AccessID,
      accessPass: AccessPass,
    };
};

const execTran = async (data) => {
  const {
    orderID,
    accessID,
    accessPass,
    memberID,
    method = "1",
    cardSeq,
    siteID,
    sitePass,
  } = data;
  const form = new FormData();
  form.append("OrderID", orderID);
  form.append("AccessID", accessID);
  form.append("AccessPass", accessPass);
  form.append("MemberID", memberID);
  form.append("Method", method);
  form.append("CardSeq", cardSeq);
  form.append("SiteID", siteID);
  form.append("SitePass", sitePass);
  const result = await axios.post(GMO_API + GMO_EXEC_TRAN, form, {
    headers: form.getHeaders(),
  });
  const { OrderID, ErrInfo } = qs.parse(result.data);
  if (ErrInfo) {
    throw new Error(generateGMOError(ErrInfo));
  }
  if (OrderID)
    return {
      orderID: OrderID,
    };
};

const addCard = async ({ token, memberID, siteID, sitePass }) => {
  try {
    const form = new FormData();
    form.append("MemberID", memberID);
    form.append("SiteID", siteID);
    form.append("SitePass", sitePass);
    form.append("Token", token);
    const result = await axios.post(GMO_API + GMO_ADD_CARD, form, {
      headers: form.getHeaders(),
    });
    const { CardSeq, ErrInfo } = qs.parse(result.data);
    if (ErrInfo) {
      throw new Error(generateGMOError(ErrInfo));
    }
    if (CardSeq) return { cardSeq: CardSeq };
  } catch (err) {
    console.log(generateLog("GMO addCard error", err));
    throw err;
  }
};

const searchCard = async ({ memberID, siteID, sitePass }) => {
  try {
    const form = new FormData();
    form.append("MemberID", memberID);
    form.append("SiteID", siteID);
    form.append("SitePass", sitePass);
    const result = await axios.post(GMO_API + GMO_SEARCH_CARD, form, {
      headers: form.getHeaders(),
    });
    const { CardNo, ErrInfo } = qs.parse(result.data);
    if (ErrInfo) {
      //if an error occurs, return []
      console.log(generateLog("GMO searchCard error" + Error(generateGMOError(ErrInfo))));
      return [];
    }
    if (CardNo) {
      return CardNo.split("|");
    }
    return [];
  } catch (err) {
    console.log(generateLog("GMO searchCard error", {err, message: err && err.message}));
    throw err;
  }
};

const searchMember = async ({ memberID, siteID, sitePass }) => {
  try {
    const form = new FormData();
    form.append("MemberID", memberID);
    form.append("SiteID", siteID);
    form.append("SitePass", sitePass);
    const result = await axios.post(GMO_API + GMO_SEARCH_MEMBER, form, {
      headers: form.getHeaders(),
    });
    const { MemberID, ErrInfo } = qs.parse(result.data);
    if (ErrInfo) {
      return null;
    }
    if (MemberID) return MemberID;
  } catch (err) {
    console.log(generateLog("GMO searchMember error", err));
    throw err;
  }
};

module.exports = {
  createMember,
  entryTran,
  execTran,
  searchMember,
  addCard,
  searchCard,
};
