// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("api/temona/distribution_courses", () => {
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

  describe("/distribution_courses/detail", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        id: "id",
      },
    };
    const mockModel = () =>
      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOne: (options, callback) => {
              if (callback)
                return callback(undefined, { authentication_token: "test" });
              return { authentication_token: "test" };
            },
          },
          PuppeteerException,
        };
      });

    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      const mock = jest.fn();
      mockModel();
      const {
        getDetail,
      } = require("../../../services/temona/distribution-courses");
      await getDetail({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("have no token", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          // ApiEfoEc: {
          //   findOne: (options, callback) => {
          //     if (callback) return callback(new Error("error"), undefined);
          //     else return undefined;
          //   },
          // },
          PuppeteerException,
        };
      });
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        getDetail,
      } = require("../../../services/temona/distribution-courses");
      await getDetail(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          get: () => Promise.reject(new Error("error")),
        };
      });
      mockModel();
      const {
        getDetail,
      } = require("../../../services/temona/distribution-courses");
      await getDetail(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return data", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.resolve({ data: {} }),
        };
      });
      mockModel();
      const {
        getDetail,
      } = require("../../../services/temona/distribution-courses");
      await getDetail(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/distribution_courses/search", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        id: "id",
      },
    };
    const mockModel = () =>
      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOne: (options, callback) => {
              if (callback)
                return callback(undefined, { authentication_token: "test" });
              return { authentication_token: "test" };
            },
          },
          PuppeteerException,
        };
      });

    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      const mock = jest.fn();
      mockModel();
      const {
        search,
      } = require("../../../services/temona/distribution-courses");
      await search({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("have no token", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          // ApiEfoEc: {
          //   findOne: (options, callback) => {
          //     if (callback) return callback(new Error("error"), undefined);
          //     else return undefined;
          //   },
          // },
          PuppeteerException,
        };
      });
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        search,
      } = require("../../../services/temona/distribution-courses");
      await search(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          get: () => Promise.reject(new Error("error")),
        };
      });
      mockModel();
      const {
        search,
      } = require("../../../services/temona/distribution-courses");
      await search(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return data", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.resolve({ data: {} }),
        };
      });
      mockModel();
      const {
        search,
      } = require("../../../services/temona/distribution-courses");
      await search(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/distribution_courses/frequencies", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        ids: "1,2",
      },
    };
    const mockModel = () =>
      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOne: (options, callback) => {
              if (callback)
                return callback(undefined, { authentication_token: "test" });
              return { authentication_token: "test" };
            },
          },
          PuppeteerException,
        };
      });

    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      const mock = jest.fn();
      mockModel();
      const {
        getFrequencies,
      } = require("../../../services/temona/distribution-courses");
      await getFrequencies({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("have no token", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          // ApiEfoEc: {
          //   findOne: (options, callback) => {
          //     if (callback) return callback(new Error("error"), undefined);
          //     else return undefined;
          //   },
          // },
          PuppeteerException,
        };
      });
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        getFrequencies,
      } = require("../../../services/temona/distribution-courses");
      await getFrequencies(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          get: () => Promise.reject(new Error("error")),
        };
      });
      mockModel();
      const {
        getFrequencies,
      } = require("../../../services/temona/distribution-courses");
      await getFrequencies(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("response with no distribution_courses", async (done) => {
      const mock = jest.fn();
      const json = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.resolve({ data: {} }),
        };
      });
      mockModel();
      const {
        getFrequencies,
      } = require("../../../services/temona/distribution-courses");
      await getFrequencies(request, mockResponse(mock, json));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({ data: [] });
        done();
      }, 100);
    });

    test("response with first distribution_course has no frequency", async (done) => {
      const mock = jest.fn();
      const json = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () =>
            Promise.resolve({
              data: {
                distribution_courses: [
                  {
                    frequencies: [],
                  },
                  {
                    frequencies: [
                      {
                        id: 1,
                        period_kind: "monthly",
                        month_or_week_or_day_period: {
                          id: 1,
                          name: "1ヶ月ごと",
                        },
                        week_period: null,
                        date_or_week_day_period: {
                          id: "test1",
                          name: "1日",
                        },
                      },
                    ],
                  },
                ],
              },
            }),
        };
      });
      mockModel();
      const {
        getFrequencies,
      } = require("../../../services/temona/distribution-courses");
      await getFrequencies(request, mockResponse(mock, json));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
          data: [],
        });
        done();
      }, 100);
    });

    test("response with a distribution_course has no frequency", async (done) => {
      const mock = jest.fn();
      const json = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () =>
            Promise.resolve({
              data: {
                distribution_courses: [
                  {
                    frequencies: [
                      {
                        id: 1,
                        period_kind: "monthly",
                        month_or_week_or_day_period: {
                          id: 1,
                          name: "1ヶ月ごと",
                        },
                        week_period: null,
                        date_or_week_day_period: {
                          id: "test1",
                          name: "1日",
                        },
                      },
                    ],
                  },
                  {
                    frequencies: [],
                  },
                ],
              },
            }),
        };
      });
      mockModel();
      const {
        getFrequencies,
      } = require("../../../services/temona/distribution-courses");
      await getFrequencies(request, mockResponse(mock, json));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
          data: [],
        });
        done();
      }, 100);
    });

    test("response with one distribution_course", async (done) => {
      const mock = jest.fn();
      const json = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () =>
            Promise.resolve({
              data: {
                distribution_courses: [
                  {
                    frequencies: [
                      {
                        id: 1,
                        period_kind: "monthly",
                        month_or_week_or_day_period: {
                          id: 1,
                          name: "1ヶ月ごと",
                        },
                        week_period: null,
                        date_or_week_day_period: {
                          id: "test1",
                          name: "1日",
                        },
                      },
                      {
                        id: 2,
                        period_kind: "monthly",
                        month_or_week_or_day_period: {
                          id: 2,
                          name: "2ヶ月ごと",
                        },
                        week_period: null,
                      },
                    ],
                  },
                ],
              },
            }),
        };
      });
      mockModel();
      const {
        getFrequencies,
      } = require("../../../services/temona/distribution-courses");
      await getFrequencies(request, mockResponse(mock, json));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
          data: [
            { text: "1ヶ月ごと／1日", value: 1 },
            { text: "2ヶ月ごと／指定なし", value: 2 },
          ],
        });
        done();
      }, 100);
    });

    test("response with distribution_courses has common frequency", async (done) => {
      const mock = jest.fn();
      const json = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () =>
            Promise.resolve({
              data: {
                distribution_courses: [
                  {
                    frequencies: [
                      {
                        id: 1,
                        period_kind: "monthly",
                        month_or_week_or_day_period: {
                          id: 1,
                          name: "1ヶ月ごと",
                        },
                        week_period: null,
                        date_or_week_day_period: {
                          id: "test1",
                          name: "1日",
                        },
                      },
                      {
                        id: 2,
                        period_kind: "monthly",
                        month_or_week_or_day_period: {
                          id: 2,
                          name: "2ヶ月ごと",
                        },
                        week_period: null,
                      },
                    ],
                  },
                  {
                    frequencies: [
                      {
                        id: 1,
                        period_kind: "monthly",
                        month_or_week_or_day_period: {
                          id: 1,
                          name: "1ヶ月ごと",
                        },
                        week_period: null,
                        date_or_week_day_period: {
                          id: "test1",
                          name: "1日",
                        },
                      },
                    ],
                  },
                ],
              },
            }),
        };
      });
      mockModel();
      const {
        getFrequencies,
      } = require("../../../services/temona/distribution-courses");
      await getFrequencies(request, mockResponse(mock, json));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
          data: [{ text: "1ヶ月ごと／1日", value: 1 }],
        });
        done();
      }, 100);
    });
  });
});
