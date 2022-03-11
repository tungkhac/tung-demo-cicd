// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("services/temona/controller", () => {
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

  describe("/products", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        ids: "id",
      },
    };
    const mockModel = () =>
      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOne: (options, callback) => {
              if (callback)
                return callback(undefined, { authentication_token: "test" });
              else return { authentication_token: "test" };
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
      const controller = require("../../../services/temona/controller");
      await controller.searchProduct({}, mockResponse(mock));
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
      const controller = require("../../../services/temona/controller");
      await controller.searchProduct(request, mockResponse(mock));
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
      const controller = require("../../../services/temona/controller");
      await controller.searchProduct(request, mockResponse(mock));
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
      const controller = require("../../../services/temona/controller");
      await controller.searchProduct(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/products/detail", () => {
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
      const controller = require("../../../services/temona/controller");
      await controller.getProduct({}, mockResponse(mock));
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
      const controller = require("../../../services/temona/controller");
      await controller.getProduct(request, mockResponse(mock));
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
      const controller = require("../../../services/temona/controller");
      await controller.getProduct(request, mockResponse(mock));
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
      const controller = require("../../../services/temona/controller");
      await controller.getProduct(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/purchase/get_earliest_delivery_day", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        shipping_address_state_id: "test",
        shop_shipping_method_id: "test",
        address_state: "北海道",
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
      const controller = require("../../../services/temona/controller");
      await controller.getEarliestDeliveryDay({}, mockResponse(mock));
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
      const controller = require("../../../services/temona/controller");
      await controller.getEarliestDeliveryDay(request, mockResponse(mock));
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
      const controller = require("../../../services/temona/controller");
      await controller.getEarliestDeliveryDay(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return data", async (done) => {
      mockModel();

      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () =>
            Promise.resolve({
              data: {
                start_available_next_scheduled_delivery_on: "2020-09-09",
              },
            }),
        };
      });
      const controller = require("../../../services/temona/controller");
      await controller.getEarliestDeliveryDay(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/purchase/get_preferred_delivery_day", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        shipping_address_state_id: "test",
        shop_shipping_method_id: "test",
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
      const controller = require("../../../services/temona/controller");
      await controller.getPreferredDeliveryDay({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("have no token", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          PuppeteerException,
        };
      });
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const controller = require("../../../services/temona/controller");
      await controller.getPreferredDeliveryDay(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.reject(new Error("error")),
        };
      });
      mockModel();
      const controller = require("../../../services/temona/controller");
      await controller.getPreferredDeliveryDay(
        { body: { ...request.body, shipping_address_state: "北海道" } },
        mockResponse(mock)
      );
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return data", async (done) => {
      mockModel();

      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.resolve({ data: {} }),
        };
      });
      const controller = require("../../../services/temona/controller");
      await controller.getPreferredDeliveryDay(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/purchase/get_periodic_list", () => {
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
      const controller = require("../../../services/temona/controller");
      await controller.getPeriodicList({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("have no token", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          PuppeteerException,
        };
      });
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const controller = require("../../../services/temona/controller");
      await controller.getPeriodicList(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.reject(new Error("error")),
        };
      });
      mockModel();
      const controller = require("../../../services/temona/controller");
      await controller.getPeriodicList(
        { body: { ...request.body, shipping_address_state: "北海道" } },
        mockResponse(mock)
      );
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return data", async (done) => {
      mockModel();

      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.resolve({ data: {} }),
        };
      });
      const controller = require("../../../services/temona/controller");
      await controller.getPeriodicList(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });
});
