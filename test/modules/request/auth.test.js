// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("modules/request/auth", () => {
  test("isInWhiteList", () => {
    const { isInWhiteList } = require("../../../modules/request/auth");
    expect(isInWhiteList("https://google.com/test")).toEqual(false);
    expect(isInWhiteList("http://stg2-sun.botchan.chat:3073/test")).toEqual(
      true
    );
    expect(isInWhiteList("http://stg2-sun.botchan.chat/test")).toEqual(false);
    expect(isInWhiteList("https://www3.toray-research.co.jp/test")).toEqual(
      true
    );
    expect(isInWhiteList("https://info.riso-kyoikugroup.com/test")).toEqual(
      true
    );
    expect(isInWhiteList("test")).toEqual(false);
  });

  test("updateInWhitelistRequestParams", () => {
    const {
      updateInWhitelistRequestParams,
    } = require("../../../modules/request/auth");
    let params = undefined;
    updateInWhitelistRequestParams(params);
    expect(params).toEqual(undefined);

    params = {};
    updateInWhitelistRequestParams(params);
    expect(params).toEqual({});

    params = { uri: "test" };
    updateInWhitelistRequestParams(params);
    expect(params).toEqual({ uri: "test" });

    params = { uri: "http://stg2-sun.botchan.chat:3073/test" };
    updateInWhitelistRequestParams(params);
    expect(params).toEqual({
      uri: "http://stg2-sun.botchan.chat:3073/test",
      agentOptions: { rejectUnauthorized: false },
    });

    params = {
      uri: "http://stg2-sun.botchan.chat:3073/test",
      agentOptions: { test: "test" },
    };
    updateInWhitelistRequestParams(params);
    expect(params).toEqual({
      uri: "http://stg2-sun.botchan.chat:3073/test",
      agentOptions: { rejectUnauthorized: false, test: "test" },
    });
  });
});
