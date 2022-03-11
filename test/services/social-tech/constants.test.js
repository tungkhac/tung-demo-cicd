// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0

describe("social-tech/constants", () => {
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
    const { SS_EMAIL, SOCIAL_TECH_SS_ID } = require("../../../services/social-tech/constants");
    expect(SS_EMAIL).toEqual("sapporo@sapporo-308107.iam.gserviceaccount.com");
    expect(SOCIAL_TECH_SS_ID).toEqual("14XaG7kGJlhHUbYLRtgQ4EqBdgFXSEt-q97s1HDDay7o");
  })

  test("should return constant value not in product mode", () => {
    jest.doMock("config", () => {
      return {
        has: jest.fn().mockReturnValue(true),
        get: jest.fn().mockReturnValue("test"),
      }
    })
    const { SS_EMAIL, SOCIAL_TECH_SS_ID } = require("../../../services/social-tech/constants");
    expect(SS_EMAIL).toEqual("ss-read-write@sapporo-dev-305306.iam.gserviceaccount.com");
    expect(SOCIAL_TECH_SS_ID).toEqual("1nXTvR57zpfhXdzRMMxbBiO3oPPy-DVujV-p72Les4VQ");
  })

  test("should return constant value not in product mode with catch an error", () => {
    jest.doMock("config", () => {
      return {
        get: jest.fn().mockReturnValue("test"),
      }
    })
    const { SS_EMAIL, SOCIAL_TECH_SS_ID } = require("../../../services/social-tech/constants");
    expect(SS_EMAIL).toEqual("ss-read-write@sapporo-dev-305306.iam.gserviceaccount.com");
    expect(SOCIAL_TECH_SS_ID).toEqual("1nXTvR57zpfhXdzRMMxbBiO3oPPy-DVujV-p72Les4VQ");
  })
});
