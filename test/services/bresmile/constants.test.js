// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0

describe("bresmile/constants", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test("should return constant value in product mode", () => {
    jest.doMock("config", () => {
      return {
        has: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue("botchan"),
      }
    })
    const { SS_EMAIL, BRESMILE_SS_ID } = require("../../../services/bresmile/constants");
    expect(SS_EMAIL).toEqual("sapporo@sapporo-308107.iam.gserviceaccount.com");
    expect(BRESMILE_SS_ID).toEqual("1UxUrlCvmBS3HY1kCb8a2ewEu41cWYes7HzxcFniJTA4");
  })

  test("should return constant value not in product mode", () => {
    jest.doMock("config", () => {
      return {
        has: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue("test"),
      }
    })
    const { SS_EMAIL, BRESMILE_SS_ID } = require("../../../services/bresmile/constants");
    expect(SS_EMAIL).toEqual("ss-read-write@sapporo-dev-305306.iam.gserviceaccount.com");
    expect(BRESMILE_SS_ID).toEqual("1TZc7rbJ6qAecUB4Wf1xpvjdynNCb2JSLPkl4Nti2tBw");
  })

  test("should return constant value not in product mode with catch an error", () => {
    jest.doMock("config", () => {
      return {
        get: jest.fn().mockReturnValue("test"),
      }
    })
    const { SS_EMAIL, BRESMILE_SS_ID } = require("../../../services/bresmile/constants");
    expect(SS_EMAIL).toEqual("ss-read-write@sapporo-dev-305306.iam.gserviceaccount.com");
    expect(BRESMILE_SS_ID).toEqual("1TZc7rbJ6qAecUB4Wf1xpvjdynNCb2JSLPkl4Nti2tBw");
  })
});
