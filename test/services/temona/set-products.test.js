// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("api/temona/set-products", () => {
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

  const mockModel = () =>
    jest.doMock("../../../model", () => {
      return {
        PuppeteerException,
      };
    });

  describe("/set-products/detail", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        id: "id",
      },
    };

    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      const mock = jest.fn();
      mockModel();
      const { getDetail } = require("../../../services/temona/set-products");
      await getDetail({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("have no token", async () => {
      const mock = jest.fn();
      mockModel();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: {} }),
          get: () => Promise.resolve({ data: {} }),
        };
      });
      const { getDetail } = require("../../../services/temona/set-products");
      await getDetail(request, mockResponse(mock));
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
      const { getDetail } = require("../../../services/temona/set-products");
      await getDetail(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return product", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () =>
            Promise.resolve({
              data: "test",
            }),
        };
      });
      mockModel();
      const { getDetail } = require("../../../services/temona/set-products");
      await getDetail(request, mockResponse(mock, jsonMock));
      expect(mock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith("test");
    });
  });

  describe("/set-products/groups", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        id: "id",
      },
    };

    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      const mock = jest.fn();
      mockModel();
      const {
        productGroups,
      } = require("../../../services/temona/set-products");
      await productGroups({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("have no token", async () => {
      const mock = jest.fn();
      mockModel();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: {} }),
          get: () => Promise.resolve({ data: {} }),
        };
      });
      const {
        productGroups,
      } = require("../../../services/temona/set-products");
      await productGroups(request, mockResponse(mock));
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
      const {
        productGroups,
      } = require("../../../services/temona/set-products");
      await productGroups(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("returned no product found", async (done) => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.resolve({ data: [] }),
        };
      });
      mockModel();
      const {
        productGroups,
      } = require("../../../services/temona/set-products");
      await productGroups(request, mockResponse(mock, jsonMock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
          groups: JSON.stringify({}),
          original_groups: {},
        });
        done();
      }, 100);
    });

    test("return groups of products", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () =>
            Promise.resolve({
              data: {
                products: [
                  {},
                  {
                    id: "test",
                    groups: [
                      {},
                      {
                        id: "test",
                        variants: [{}, { id: "test" }, { id: "test" }],
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
        productGroups,
      } = require("../../../services/temona/set-products");
      await productGroups(request, mockResponse(mock, jsonMock));
      expect(mock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        groups: JSON.stringify({
          test: [{ id: "test", variants: [{ id: "test" }] }],
        }),
        original_groups: { test: [{ id: "test", variants: [{ id: "test" }] }] },
      });
    });
  });

  describe("/set-products/set-quantity", () => {
    const groups =
      '{"test":[{"id":"test","selection_items_per_group":3,"variants":[{"id":1},{"id":2},{"id":3}]}]}';
    const groups_with_quantities =
      '{"test":[{"id":"test","selection_items_per_group":3,"variants":[{"id":1,"quantity":1},{"id":2,"quantity":2},{"id":3}]}]}';
    const body = {
      cpid: "test",
      user_id: "test",
      groups,
      product_id: "test",
      group_id: "test",
      variant_id: "1",
    };

    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      const mock = jest.fn();
      mockModel();
      const {
        setQuantityForVariant,
      } = require("../../../services/temona/set-products");
      await setQuantityForVariant({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("invalid product_id", async () => {
      const mock = jest.fn();
      mockModel();
      const {
        setQuantityForVariant,
      } = require("../../../services/temona/set-products");
      await setQuantityForVariant(
        {
          body: {
            ...body,
            product_id: "test-test",
          },
        },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("total quantities is greater than allowed", async () => {
      const mock = jest.fn();
      mockModel();
      const {
        setQuantityForVariant,
      } = require("../../../services/temona/set-products");
      await setQuantityForVariant(
        {
          body: {
            ...body,
            quantity: 4,
          },
        },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("test checking_total", async () => {
      const mock = jest.fn();
      mockModel();
      const {
        setQuantityForVariant,
      } = require("../../../services/temona/set-products");
      await setQuantityForVariant(
        {
          body: {
            ...body,
            groups_with_quantities,
            checking_total: true,
          },
        },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("return groups_with_quantities", async () => {
      const mock = jest.fn();
      mockModel();
      const {
        setQuantityForVariant,
      } = require("../../../services/temona/set-products");
      await setQuantityForVariant(
        {
          body: {
            ...body,
            quantity: 1,
            cleared_variants: "2,3,4",
          },
        },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(200);
    });
  });
});
