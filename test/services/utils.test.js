// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("services/utils", () => {
  test("default", async () => {
    const utils = require("../../services/utils");
    expect(utils).toBeDefined();
  });

  describe("logToChatwork", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("default", async () => {
      const { logToChatwork } = require("../../services/utils");
      expect(logToChatwork).toBeDefined();
    });

    test("missing config", async (done) => {
      const mock = jest.fn();
      jest.doMock("request", () => {
        return {
          post: (options, callback) => {
            mock();
            callback(undefined, { statusCode: 200 }, "test");
          },
        };
      });
      jest.doMock("config", () => {
        return {
          has: (key) => {
            return true;
          },
          get: (key) => {
            return "";
          },
        };
      });
      const { logToChatwork } = require("../../services/utils");
      logToChatwork("test");
      setTimeout(() => {
        expect(mock).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    test("missing message", async (done) => {
      const mock = jest.fn();
      jest.doMock("request", () => {
        return {
          post: (options, callback) => {
            mock();
            callback(undefined, { statusCode: 200 }, "test");
          },
        };
      });
      jest.doMock("config", () => {
        return {
          has: (key) => {
            return true;
          },
          get: (key) => {
            return "test";
          },
        };
      });
      const { logToChatwork } = require("../../services/utils");
      logToChatwork("");
      setTimeout(() => {
        expect(mock).not.toHaveBeenCalled();
        done();
      }, 100);
    });
    test("has message", async (done) => {
      const mock = jest.fn();
      jest.doMock("request", () => {
        return {
          post: (options, callback) => {
            mock();
            callback(undefined, { statusCode: 200 }, "test");
          },
        };
      });
      jest.doMock("config", () => {
        return {
          has: (key) => {
            return true;
          },
          get: (key) => {
            return "test";
          },
        };
      });
      const { logToChatwork } = require("../../services/utils");
      logToChatwork("test");
      setTimeout(() => {
        expect(mock).toHaveBeenCalled();
        done();
      }, 100);
    });
  });
});
