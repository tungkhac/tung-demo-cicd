// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("rakuraku/helper", () => {
  const {
    GUEST,
    RAKURAKU_PREFIX,
    GMO_ERROR,
    PERIOD_TYPE_DATE,
    PERIOD_TYPE_MONTHLY_DATE,
    PERIOD_TYPE_MONTHLY_DAY,
    PERIOD_TYPE_BIWEEKLY,
    PERIOD_TYPE_WEEKLY,
  } = require("../../../services/rakuraku/constants");
  beforeEach(() => {
    jest.resetModules();
  });

  test("generateRandomId", async () => {
    const { generateRandomId } = require("../../../services/rakuraku/helper");
    expect(generateRandomId()).toBeDefined();
  });

  test("generateGuestID", async () => {
    const { generateGuestID } = require("../../../services/rakuraku/helper");
    expect(generateGuestID()).toBeDefined();
  });

  test("getGMOMemberID", async () => {
    const { getGMOMemberID } = require("../../../services/rakuraku/helper");
    expect(getGMOMemberID()).toBeDefined();
    expect(getGMOMemberID(GUEST)).toBeDefined();
  });

  test("generateLog", async () => {
    const { generateLog } = require("../../../services/rakuraku/helper");
    expect(generateLog()).toEqual(expect.stringContaining("undefined:"));
    expect(generateLog("test", "test")).toEqual(
      expect.stringContaining("test: test")
    );
    expect(generateLog("test", { test: "test" })).toEqual(
      expect.stringContaining('test: {"test":"test"}')
    );
    const data = { test: "test" };
    data.data = data;
    expect(generateLog("test", data)).toEqual();
  });

  test("generateGMOError", async () => {
    const { generateGMOError } = require("../../../services/rakuraku/helper");
    expect(generateGMOError()).toEqual("");
    expect(generateGMOError("test|E00000000")).toEqual("特になし");
    expect(generateGMOError("E00000000|E01010001")).toEqual(
      "特になし, ショップIDが指定されていません。"
    );
  });

  test("getPeriodicalOrderData", async () => {
    const data = {
      period_type: "test",
      period_day: "test",
      period_month_day: "test",
      period_test: "test",
      period_week: "test",
      period_day_w: "test",
    };
    const {
      getPeriodicalOrderData,
    } = require("../../../services/rakuraku/helper");
    expect(getPeriodicalOrderData({})).toEqual({});
    expect(getPeriodicalOrderData({ period_type: "" })).toEqual({});
    expect(getPeriodicalOrderData({ period_type: "test" })).toEqual({
      period_type: "test",
      periodical_order_id: -1,
    });
    let periodicalData = getPeriodicalOrderData({
      period_type: PERIOD_TYPE_DATE,
    });
    expect(periodicalData.next_period).toBeDefined();
    periodicalData = getPeriodicalOrderData({
      period_type: PERIOD_TYPE_MONTHLY_DATE,
    });
    expect(periodicalData.next_period).toBeDefined();
    periodicalData = getPeriodicalOrderData({
      period_type: PERIOD_TYPE_MONTHLY_DATE,
      period_date: "99",
    });
    expect(periodicalData.next_period).toBeDefined();
    periodicalData = getPeriodicalOrderData({
      period_type: PERIOD_TYPE_MONTHLY_DAY,
    });
    expect(periodicalData.next_period).toBeDefined();
    periodicalData = getPeriodicalOrderData({
      period_type: PERIOD_TYPE_WEEKLY,
    });
    expect(periodicalData.next_period).toBeDefined();
    periodicalData = getPeriodicalOrderData({
      period_type: PERIOD_TYPE_BIWEEKLY,
      period_day_w: "月",
    });
    expect(periodicalData.next_period).toBeDefined();
  });

  test("getFixedData", async () => {
    const { getFixedData } = require("../../../services/rakuraku/helper");
    expect(await getFixedData("test")).toEqual({});
    expect(await getFixedData({})).toEqual({});
    expect(await getFixedData({ test: "test" })).toEqual({});
    expect(
      await getFixedData({
        "order.test": "test",
        "order.test2": "test",
        "order_detail.test": "test",
      })
    ).toEqual({
      order: { test: "test", test2: "test" },
      order_detail: [{ test: "test" }],
    });
  });
});
