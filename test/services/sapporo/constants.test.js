// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0

describe("sapporo/constants", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("return production values when appEnv is botchan", () => {
    jest.doMock("config", () => {
      return {
        has: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue("botchan"),
      };
    });
    const {
      SS_EMAIL,
      OPERATORS_SS_ID,
      SAPPORO_CPID,
    } = require("../../../services/sapporo/constants");
    expect(SS_EMAIL).toEqual("sapporo@sapporo-308107.iam.gserviceaccount.com");
    expect(OPERATORS_SS_ID).toEqual(
      "1LY_sMB3s-1r0xeo8gK1CW4n4_fIvF29gNo_EWwj0Wd0"
    );
    expect(SAPPORO_CPID).toEqual("5fd6f6b9a24a61ed991a04d2");
  });

  test("not return production values when appEnv is not botchan", () => {
    jest.doMock("config", () => {
      return {
        has: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue("test"),
      };
    });
    const {
      SS_EMAIL,
      OPERATORS_SS_ID,
      SAPPORO_CPID,
    } = require("../../../services/sapporo/constants");
    expect(SS_EMAIL).toEqual(
      "ss-read-write@sapporo-dev-305306.iam.gserviceaccount.com"
    );
    expect(OPERATORS_SS_ID).not.toEqual(
      "1LY_sMB3s-1r0xeo8gK1CW4n4_fIvF29gNo_EWwj0Wd0"
    );
    expect(SAPPORO_CPID).not.toEqual("5fd6f6b9a24a61ed991a04d2");
  });

  test("not return production values when error", () => {
    jest.doMock("config", () => {
      return {
        get: jest.fn().mockReturnValue("test"),
      };
    });
    const {
      SS_EMAIL,
      OPERATORS_SS_ID,
      SAPPORO_CPID,
    } = require("../../../services/sapporo/constants");
    expect(SS_EMAIL).toEqual(
      "ss-read-write@sapporo-dev-305306.iam.gserviceaccount.com"
    );
    expect(OPERATORS_SS_ID).not.toEqual(
      "1LY_sMB3s-1r0xeo8gK1CW4n4_fIvF29gNo_EWwj0Wd0"
    );
    expect(SAPPORO_CPID).not.toEqual("5fd6f6b9a24a61ed991a04d2");
  });
});
