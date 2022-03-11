// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("api/temona/regular_courses", () => {
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

  describe("/regular_courses/detail", () => {
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
        getRegularCourse,
      } = require("../../../services/temona/controller");
      await getRegularCourse({}, mockResponse(mock));
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
        getRegularCourse,
      } = require("../../../services/temona/controller");
      await getRegularCourse(request, mockResponse(mock));
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
        getRegularCourse,
      } = require("../../../services/temona/controller");
      await getRegularCourse(request, mockResponse(mock));
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

  describe("/regular_courses/frequencies", () => {
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
      const { getFrequencies } = require("../../../services/temona/controller");
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
      const { getFrequencies } = require("../../../services/temona/controller");
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
      const { getFrequencies } = require("../../../services/temona/controller");
      await getFrequencies(request, mockResponse(mock));
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
      const { getFrequencies } = require("../../../services/temona/controller");
      await getFrequencies(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/regular_courses/variants", () => {
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
      const { getVariants } = require("../../../services/temona/controller");
      await getVariants({}, mockResponse(mock));
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
      const { getVariants } = require("../../../services/temona/controller");
      await getVariants(request, mockResponse(mock));
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
      const { getVariants } = require("../../../services/temona/controller");
      await getVariants(request, mockResponse(mock));
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
      const { getVariants } = require("../../../services/temona/controller");
      await getVariants(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/regular_courses/get_product", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        id: "id",
        variant_id: "test",
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
        getProductOfRegularCourse,
      } = require("../../../services/temona/controller");
      await getProductOfRegularCourse({}, mockResponse(mock));
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
        getProductOfRegularCourse,
      } = require("../../../services/temona/controller");
      await getProductOfRegularCourse(request, mockResponse(mock));
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
        getProductOfRegularCourse,
      } = require("../../../services/temona/controller");
      await getProductOfRegularCourse(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return empty data", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.resolve({ data: {} }),
        };
      });
      mockModel();
      const {
        getProductOfRegularCourse,
      } = require("../../../services/temona/controller");
      await getProductOfRegularCourse(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });

    test("return data with product found", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () =>
            Promise.resolve({
              data: {
                products: [
                  { variant: { id: "test", product_id: "test" } },
                  { variant: { id: "test1", product_id: "test1" } },
                ],
              },
            }),
        };
      });
      mockModel();
      const {
        getProductOfRegularCourse,
      } = require("../../../services/temona/controller");
      await getProductOfRegularCourse(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });
});
