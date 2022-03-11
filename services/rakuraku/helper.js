// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const {
  RAKURAKU_LOG,
  GMO_ERROR,
  GUEST,
  RAKURAKU_PREFIX,
  PERIOD_TYPE_DATE,
  PERIOD_TYPE_MONTHLY_DATE,
  PERIOD_TYPE_MONTHLY_DAY,
  PERIOD_TYPE_WEEKLY,
  PERIOD_TYPE_BIWEEKLY,
} = require("./constants");
const moment = require("moment");

const generateRandomId = () => {
  return (
    moment().format("YYYYMMDD-HHmmss-") +
    Math.random().toString(36).substr(2, 9)
  );
};
const generateLog = (name, data = "") => {
  try {
    return `${RAKURAKU_LOG} ${moment().format()} ${name}: ${
      typeof data === "string" ? data : JSON.stringify(data)
    }`;
  } catch (e) {
    console.log(`${RAKURAKU_LOG} error generateLog`, e);
  }
};

const generateGMOError = (errInfo) => {
  if (!errInfo) return "";
  const splitErr = errInfo.split("|");
  const result = splitErr
    .map((err) => {
      if (err && GMO_ERROR[err]) {
        return GMO_ERROR[err];
      }
      return "";
    })
    .filter((err) => !!err);
  return result.join(", ");
};

const generateGuestID = () => {
  return RAKURAKU_PREFIX + "guest-" + moment().format("YYYYMMDD-HHmmss");
};

const getGMOMemberID = (memberType, customerId) => {
  let GMOMemberID = null;
  if (memberType == GUEST) {
    GMOMemberID = generateGuestID();
  } else {
    GMOMemberID = RAKURAKU_PREFIX + customerId;
  }
  return GMOMemberID;
};

const getPeriodicalOrderData = (data) => {
  const {
    period_type,
    period_day,
    period_month_key,
    period_date,
    period_week,
    period_day_w,
  } = data;
  if (!period_type) return {};
  return {
    periodical_order_id: -1,
    period_type,
    next_period: calculateNextPeriod(data),
    period_day,
    period_month_key,
    period_date,
    period_week,
    period_day_w,
  };
};

const calculateNextPeriod = (data) => {
  const {
    period_type,
    period_day,
    period_month_key,
    period_date,
    period_week,
    period_day_w,
  } = data;
  /* istanbul ignore if */
  if (!period_type) return;
  switch (period_type) {
    case PERIOD_TYPE_DATE:
      return moment().add(period_day, "days").format("YYYY-MM-DD");
    case PERIOD_TYPE_MONTHLY_DATE:
      if (period_date == "99") {
        return moment().add(period_month_key, "months").endOf("month").format("YYYY-MM-DD");
      }
      return (
        moment().add(period_month_key, "months").format("YYYY-MM-") +
        ("0" + period_date).slice(-2)
      );
    case PERIOD_TYPE_MONTHLY_DAY:
      return moment()
        .add(period_month_key, "months")
        .startOf("month")
        .add(period_week, "weeks")
        .add(parseJapaneseDayToNumber(period_day_w), "days");
    case PERIOD_TYPE_WEEKLY:
      return moment().startOf("week").add(parseJapaneseDayToNumber, "days");
    case PERIOD_TYPE_BIWEEKLY:
      return moment()
        .startOf("week")
        .add(1, "weeks")
        .add(parseJapaneseDayToNumber(period_day_w), "days");
  }
};

const parseJapaneseDayToNumber = (japaneseDay) => {
  if (!japaneseDay) return 0;
  const mapDay = {
    月: 0,
    火: 1,
    水: 2,
    木: 3,
    金: 4,
    土: 5,
    日: 6,
  };
  return mapDay[japaneseDay] || 0;
};

const getFixedData = (data) => {
  //data = {"order.subtotal": 1, "order_detail.name": 2} => parse to {"order": {"subtotal": 1}, "order_detail": [{name: 2}]}
  const fixedOrderData = {};
  Object.keys(data).forEach((key) => {
    const splitKey = key.split(".");
    if (splitKey.length > 1) {
      if (!fixedOrderData[splitKey[0]]) {
        if (splitKey[0] === "order_detail") {
          fixedOrderData[splitKey[0]] = [{}];
        } else {
          fixedOrderData[splitKey[0]] = {};
        }
      }

      if (splitKey[0] === "order_detail") {
        fixedOrderData[splitKey[0]][0][splitKey[1]] = data[key];
      } else {
        fixedOrderData[splitKey[0]][splitKey[1]] = data[key];
      }
    }
  });
  return fixedOrderData;
};

module.exports = {
  generateRandomId,
  generateLog,
  generateGMOError,
  generateGuestID,
  getGMOMemberID,
  getPeriodicalOrderData,
  getFixedData,
};
