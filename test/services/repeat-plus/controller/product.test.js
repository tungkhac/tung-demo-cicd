// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("repeat-plus/product", () => {
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

  describe("repeat-plus/product/detail", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request body", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const controller = require("../../../../services/repeat-plus/controller/product");
      await controller.getProductDetail({ body: {} }, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request with unexpected error", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const controller = require("../../../../services/repeat-plus/controller/product");
      await controller.getProductDetail(
        { body: { product_id: "test", "api-key": "test" } },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request with error from repeat-plus", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.reject({
              response: { data: { data: "test" } },
            }),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const controller = require("../../../../services/repeat-plus/controller/product");
      await controller.getProductDetail(
        { body: { product_id: [{ productId: "test" }], "api-key": "test" } },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request succeed", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: { data: [{}] },
            }),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const controller = require("../../../../services/repeat-plus/controller/product");
      await controller.getProductDetail(
        { body: { product_id: [{ productId: "test" }], "api-key": "test" } },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(200);
    });
  });

  describe("repeat-plus/product", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request body", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getProducts,
      } = require("../../../../services/repeat-plus/controller/product");
      await getProducts({ body: {} }, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request with unexpected error", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getProducts,
      } = require("../../../../services/repeat-plus/controller/product");
      await getProducts(
        { body: { product_id: "test", "api-key": "test" } },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request with error from repeat-plus", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.reject({
              response: { data: { data: "test" } },
            }),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getProducts,
      } = require("../../../../services/repeat-plus/controller/product");
      await getProducts(
        { body: { product_id: [{ productId: "test" }], "api-key": "test" } },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request succeed", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: { data: [{}] },
            }),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getProducts,
      } = require("../../../../services/repeat-plus/controller/product");
      await getProducts(
        { body: { product_id: [{ productId: "test" }], "api-key": "test" } },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(200);
    });
  });
});
