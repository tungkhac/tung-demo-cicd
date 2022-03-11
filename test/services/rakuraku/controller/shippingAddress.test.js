// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const { GUEST } = require("../../../../services/rakuraku/constants");

describe("services/rakuraku/shippingAddress", () => {
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

  describe("fetchShippingAddress", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("error thrown while fetching", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        fetchShippingAddress,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      try {
        await fetchShippingAddress();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test("no data responded", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({}),
        };
      });
      const {
        fetchShippingAddress,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      expect(await fetchShippingAddress("test", "test")).toEqual();
    });

    test("succeed", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: {
                success: "ok",
                response: {
                  customer_deliveries: [{ customer_delivery: "test" }],
                },
              },
            }),
        };
      });
      const {
        fetchShippingAddress,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      expect(await fetchShippingAddress("test", "test")).toEqual("test");
    });
  });

  describe("getShippingAddressByIndex", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    const request = {
      body: {
        customer_id: "test",
        shipping_address_index: 0,
        access_token: "test",
      },
    };
    test("invalid request", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        getShippingAddressByIndex,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await getShippingAddressByIndex(
        { body: {} },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({});
    });

    test("no data responded", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({}),
        };
      });
      const {
        getShippingAddressByIndex,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await getShippingAddressByIndex(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("succeed", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: {
                success: "ok",
                response: {
                  customer_deliveries: [{ customer_delivery: [{}] }],
                },
              },
            }),
        };
      });
      const {
        getShippingAddressByIndex,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await getShippingAddressByIndex(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(200);
    });
  });

  describe("getShippingAddressOptions", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    const request = {
      body: {
        customer_id: "test",
        access_token: "test",
      },
    };
    test("invalid request", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        getShippingAddressOptions,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      expect(
        await getShippingAddressOptions({ body: {} }, mockResponse())
      ).toEqual(null);
    });

    test("error while fetching data", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        getShippingAddressOptions,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await getShippingAddressOptions(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("no data responded", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({}),
        };
      });
      const {
        getShippingAddressOptions,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await getShippingAddressOptions(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(200);
    });

    test("succeed", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: {
                success: "ok",
                response: {
                  customer_deliveries: [{ customer_delivery: [{}] }],
                },
              },
            }),
        };
      });
      const {
        getShippingAddressOptions,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await getShippingAddressOptions(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(200);
    });
  });

  describe("addShippingAddress", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    const request = {
      body: {
        customer_id: "test",
        access_token: "test",
        shipping_zipcode: "test",
      },
    };

    test("invalid request", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        addShippingAddress,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await addShippingAddress({ body: {} }, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("user_type is GUEST", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        addShippingAddress,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await addShippingAddress(
        { body: { ...request.body, user_type: GUEST } },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(200);
    });

    test("error while fetching data", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        addShippingAddress,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await addShippingAddress(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("no data responded", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({}),
        };
      });
      const {
        addShippingAddress,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await addShippingAddress(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("failed", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: {
                response: {
                  customer_deliveries: [
                    {
                      result: "test",
                    },
                  ],
                },
              },
            }),
        };
      });
      const {
        addShippingAddress,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await addShippingAddress(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("succeed", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: {
                success: "ok",
                response: {
                  customer_deliveries: [
                    {
                      result: 1,
                    },
                  ],
                },
              },
            }),
        };
      });
      const {
        addShippingAddress,
      } = require("../../../../services/rakuraku/controller/shippingAddress");
      await addShippingAddress(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(200);
    });
  });
});
