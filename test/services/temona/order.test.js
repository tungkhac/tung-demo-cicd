// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const { api } = require("../../../services/temona/constants");

describe("api/temona/purchase", () => {
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

  describe("/purchase/confirm_order", () => {
    const request = {
      body: {
        request_url: "request_url",
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        id: "id",
        product_id: "1",
        quantity: "1",
        variant_id: "1",
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
      const { confirmOrder } = require("../../../services/temona/controller");
      await confirmOrder({}, mockResponse(mock));
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
      const { confirmOrder } = require("../../../services/temona/controller");
      await confirmOrder(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          put: () => Promise.reject(new Error("error")),
        };
      });
      mockModel();
      const { confirmOrder } = require("../../../services/temona/controller");
      await confirmOrder(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return data with success", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          put: () => Promise.resolve({ data: { success: true } }),
          post: () => Promise.resolve({ data: { access_token: "test" } }),
        };
      });
      mockModel();
      const { confirmOrder } = require("../../../services/temona/controller");
      await confirmOrder(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });

    test("return data with errors", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          put: () => Promise.resolve({ data: { errors: [] } }),
          post: () => Promise.resolve({ data: { access_token: "test" } }),
        };
      });
      mockModel();
      const { confirmOrder } = require("../../../services/temona/controller");
      await confirmOrder(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/purchase/create_order", () => {
    const request = {
      body: {
        request_url: "request_url",
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        id: "id",
        product_id: "1",
        quantity: "1",
        variant_id: "1",
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
      const { createOrder } = require("../../../services/temona/controller");
      await createOrder({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    // test("have no token", async () => {
    //   const mock = jest.fn();
    //   jest.doMock("../../../model", () => {
    //     return {
    //       ApiEfoEc: {
    //         findOne: (options, callback) => {
    //           if (callback) return callback(new Error("error"), undefined);
    //           else return undefined;
    //         },
    //       },
    //       PuppeteerException,
    //     };
    //   });
    //   const { createOrder } = require("../../../services/temona/controller");
    //   await createOrder(request, mockResponse(mock));
    //   expect(mock).toHaveBeenCalledWith(500);
    // });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      mockModel();
      const { createOrder } = require("../../../services/temona/controller");
      await createOrder(
        { body: { ...request.body, distribution_courses_ids: "1" } },
        mockResponse(mock)
      );
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return data with success", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("access_tokens")) {
              return Promise.resolve({ data: { access_token: "test" } });
            }
            return Promise.resolve({ data: { success: true } });
          },
        };
      });
      mockModel();
      const { createOrder } = require("../../../services/temona/controller");
      await createOrder(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });

    test("return data with errors", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("access_tokens")) {
              return Promise.resolve({ data: { access_token: "test" } });
            }
            return Promise.resolve({ data: { errors: "error" } });
          },
        };
      });
      mockModel();
      const { createOrder } = require("../../../services/temona/controller");
      await createOrder(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });
});
