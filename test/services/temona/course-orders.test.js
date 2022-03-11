// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("api/temona/course-orders", () => {
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

  describe("/course-orders/detail", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        course_order_id: "course_id",
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
        getCourseOrderDetail,
      } = require("../../../services/temona/controller");
      await getCourseOrderDetail({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("have no token", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOne: (options, callback) => {
              if (callback) return callback(new Error("error"), undefined);
              else return undefined;
            },
          },
          PuppeteerException,
        };
      });
      const {
        getCourseOrderDetail,
      } = require("../../../services/temona/controller");
      await getCourseOrderDetail(request, mockResponse(mock));
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
        getCourseOrderDetail,
      } = require("../../../services/temona/controller");
      await getCourseOrderDetail(request, mockResponse(mock));
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
        getRegularCourse,
      } = require("../../../services/temona/controller");
      await getRegularCourse(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/course_order/preferred_delivery_time_zone_list", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        course_order_id: "course_id",
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
        getPreferredDeliveryTimeZoneList,
      } = require("../../../services/temona/controller");
      await getPreferredDeliveryTimeZoneList({}, mockResponse(mock));
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
        getPreferredDeliveryTimeZoneList,
      } = require("../../../services/temona/controller");
      await getPreferredDeliveryTimeZoneList(request, mockResponse(mock));
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
        getPreferredDeliveryTimeZoneList,
      } = require("../../../services/temona/controller");
      await getPreferredDeliveryTimeZoneList(request, mockResponse(mock));
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
          get: () =>
            Promise.resolve({
              data: {
                shop_shipping_method: {
                  preferred_delivery_time_zone_options: [],
                },
              },
            }),
        };
      });
      mockModel();
      const {
        getPreferredDeliveryTimeZoneList,
      } = require("../../../services/temona/controller");
      await getPreferredDeliveryTimeZoneList(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });
});
