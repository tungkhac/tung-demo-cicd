// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("api/temona/each_user/course_orders", () => {
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

  describe("/course-orders/update", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        course_order_id: "course_order_id",
        email: "email",
        password: "password",
        next_scheduled_delivery_on: "2021-11-11",
        next_preferred_delivery_time_zone_id: 99,
        frequency_id: 99,
        continue_use_point_flag: 1,
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
        updateRegularCourse,
      } = require("../../../services/temona/controller");
      await updateRegularCourse({}, mockResponse(mock));
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
        updateRegularCourse,
      } = require("../../../services/temona/controller");
      await updateRegularCourse(request, mockResponse(mock));
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
        updateRegularCourse,
      } = require("../../../services/temona/controller");
      await updateRegularCourse(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("update course success", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: {
                access_token: "test",
                user_token: "test",
                login_user_id: "test",
              },
            }),
          patch: () => Promise.resolve({ data: {} }),
        };
      });
      mockModel();
      const {
        updateRegularCourse,
      } = require("../../../services/temona/controller");
      await updateRegularCourse(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/course_order/stop", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        course_order_id: "course_order_id",
        email: "email",
        password: "password",
        status: 2,
        pause_reasons_list: "pause_reasons_list",
        定期停止理由_優先1_master_data: "[]",
        reason_for_regular_suspension_priority_1: "test",
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
      jest.doMock("../../../model", () => {
        return {
          PuppeteerException,
        };
      });
      const {
        stopRegularCourse,
      } = require("../../../services/temona/controller");
      await stopRegularCourse({}, mockResponse(mock));
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
        stopRegularCourse,
      } = require("../../../services/temona/controller");
      await stopRegularCourse(request, mockResponse(mock));
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
        stopRegularCourse,
      } = require("../../../services/temona/controller");
      await stopRegularCourse(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("stop course success", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("access_tokens")) {
              return Promise.resolve({ data: { access_token: "test" } });
            }
            return Promise.resolve({
              data: {
                token: "test",
                user_token: "test",
                user_login_id: "test",
              },
            });
          },
          patch: () => Promise.resolve({ data: { stop_course_flag: 1 } }),
        };
      });
      mockModel();
      const {
        stopRegularCourse,
      } = require("../../../services/temona/controller");
      await stopRegularCourse(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });
});
