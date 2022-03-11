// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("api/temona/auth", () => {
  class PuppeteerException {
    constructor() {}
    save(callback) {
      callback();
    }
  }

  const mockResponse = (statusMock, jsonMock = undefined) => {
    const jsonFunc = jsonMock ? jsonMock : jest.fn();
    const res = {
      status: (code) => {
        statusMock(code);
        return res;
      },
      json: jsonFunc,
    };
    return res;
  };

  describe("/auth", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
      },
    };
    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          PuppeteerException,
        };
      });
      const { auth } = require("../../../services/temona/controller");
      await auth({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("can not insert to ApiEfoEc", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOneAndUpdate: (conditions, set, options, callback) => {
              if (callback) return callback(new Error("Error"), undefined);
              else return undefined;
            },
          },
          PuppeteerException,
        };
      });
      const { auth } = require("../../../services/temona/controller");
      await auth(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOneAndUpdate: (conditions, set, options, callback) => {
              if (callback) {
                callback(undefined, { _id: "_id" });
              } else {
                return { _id: "_id" };
              }
            },
          },
          PuppeteerException,
        };
      });
      const { auth } = require("../../../services/temona/controller");
      await auth(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return empty access_token", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: { error: "error", error_description: "error_description" },
            }),
        };
      });

      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOneAndUpdate: (conditions, set, options, callback) => {
              if (callback) {
                callback(undefined, { _id: "_id" });
              } else {
                return { _id: "_id" };
              }
            },
          },
          PuppeteerException,
        };
      });
      const { auth } = require("../../../services/temona/controller");
      await auth(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("return data", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({ data: { access_token: "access_token" } }),
        };
      });

      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOneAndUpdate: (conditions, set, options, callback) => {
              if (callback) return callback(undefined, { _id: "_id" });
              else return { _id: "_id" };
            },
            findOne: (options, callback) => {
              if (callback) return callback(undefined, undefined);
              else return undefined;
            },
          },
          PuppeteerException,
        };
      });
      const { auth } = require("../../../services/temona/controller");
      await auth(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(200);
    });
  });
});
