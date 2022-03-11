// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("repeat-plus/order", () => {
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

  describe("repeat-plus/shipping", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request body", async () => {
      const mock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getShipping,
      } = require("../../../../services/repeat-plus/controller/order");
      await getShipping({ body: {} }, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request succeed", async () => {
      const jsonMock = jest.fn();
      const mock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getShipping,
      } = require("../../../../services/repeat-plus/controller/order");
      await getShipping(
        {
          body: {
            user_shipping: JSON.stringify([
              {
                shipping_no: "test",
                shipping_name: "test",
                shipping_addr1: "test",
                shipping_tel1: "test",
              },
            ]),
          },
        },
        mockResponse(mock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        data: [
          { value: "test", text: "test-test-test" },
          { value: "new", text: "上記とは別の住所に届ける" },
        ],
      });
    });
  });

  describe("repeat-plus/shipping/time", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request body", async () => {
      const mock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getTimeShipping,
      } = require("../../../../services/repeat-plus/controller/order");
      await getTimeShipping({ body: {} }, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request succeed", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getTimeShipping,
      } = require("../../../../services/repeat-plus/controller/order");
      await getTimeShipping(
        {
          body: {
            shipping_time_list: JSON.stringify([
              { shipping_time_id: "test", shipping_time_message: "test" },
            ]),
          },
        },
        mockResponse(mock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        data: [{ value: "test", text: "test" }],
      });
    });
  });

  describe("repeat-plus/shipping/date", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request body", async () => {
      const mock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getDateShipping,
      } = require("../../../../services/repeat-plus/controller/order");
      await getDateShipping({ body: {} }, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request succeed", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getDateShipping,
      } = require("../../../../services/repeat-plus/controller/order");
      await getDateShipping(
        {
          body: {
            shipping_date_list: JSON.stringify(["test", "20200202"]),
          },
        },
        mockResponse(mock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        data: [
          { text: "test", value: "Invalid date" },
          { text: "20200202", value: "2020/02/02" },
        ],
      });
    });
  });

  describe("repeat-plus/shipping/earliest-delivery-day", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request body", async () => {
      const mock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getEarliestDeliveryDay,
      } = require("../../../../services/repeat-plus/controller/order");
      await getEarliestDeliveryDay({ body: {} }, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request succeed", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getEarliestDeliveryDay,
      } = require("../../../../services/repeat-plus/controller/order");
      await getEarliestDeliveryDay(
        {
          body: {
            shipping_date_list: JSON.stringify(["20200202", "test"]),
          },
        },
        mockResponse(mock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        date: "2020/02/02",
      });
    });
  });

  describe("repeat-plus/product/recommend", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request body", async () => {
      const mock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getRecommendList,
      } = require("../../../../services/repeat-plus/controller/order");
      await getRecommendList({ body: {} }, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request succeed", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getRecommendList,
      } = require("../../../../services/repeat-plus/controller/order");
      await getRecommendList(
        {
          body: {
            recommend_product_list: JSON.stringify([
              {
                product_id: "test",
                variation_id: "test",
                item_quantity: 1,
                product_name: "test",
                item_price: "test",
              },
            ]),
          },
        },
        mockResponse(mock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        data: [
          { text: "[test] - 単価: ¥test - 個数: 1", value: "test-/-test-/-1" },
        ],
      });
    });
  });

  describe("repeat-plus/recalculation", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request body", async () => {
      const mock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        recalculation,
      } = require("../../../../services/repeat-plus/controller/order");
      await recalculation({ body: {} }, mockResponse(mock));
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
        recalculation,
      } = require("../../../../services/repeat-plus/controller/order");
      await recalculation(
        {
          body: {
            shipping_no: "new",
            product_detail: JSON.stringify([]),
            product_id: JSON.stringify([]),
            recommend_type: 1,
            up_sale_product_list: "",
            "api-key": "test",
          },
        },
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
        recalculation,
      } = require("../../../../services/repeat-plus/controller/order");
      await recalculation(
        {
          body: {
            shipping_no: "test",
            user_shipping: JSON.stringify([{ shipping_no: "test" }]),
            product_detail: JSON.stringify([]),
            product_id: JSON.stringify([]),
            recommend_type: 1,
            up_sale_product_list: "test-/-test-/-test",
            "api-key": "test",
          },
        },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request succeed", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: {
                data: {
                  order_product_list: [],
                  shipping_date_list: [],
                  shipping_time_list: [],
                },
              },
            }),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        recalculation,
      } = require("../../../../services/repeat-plus/controller/order");
      await recalculation(
        {
          body: {
            shipping_no: "new",
            product_detail: JSON.stringify([
              { product: { product_id: "test", variation_id: "test" } },
            ]),
            product_id: "test",
            recommend_type: 2,
            cross_sale_product_list: "",
            "api-key": "test",
          },
        },
        mockResponse(mock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        order_product_list: "[]",
        shipping_date_list: "[]",
        shipping_time_list: "[]",
        recommend_type: 2,
        recommend_product_list: "[]",
      });
    });
  });

  describe("repeat-plus/order", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request body", async () => {
      const mock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        createOrder,
      } = require("../../../../services/repeat-plus/controller/order");
      await createOrder({ body: {} }, mockResponse(mock));
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
        createOrder,
      } = require("../../../../services/repeat-plus/controller/order");
      await createOrder(
        {
          body: {
            shipping_no: "new",
            product_detail: JSON.stringify([]),
            product_id: JSON.stringify([]),
            "api-key": "test",
          },
        },
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
        createOrder,
      } = require("../../../../services/repeat-plus/controller/order");
      await createOrder(
        {
          body: {
            shipping_no: "new",
            product_detail: JSON.stringify([]),
            product_id: JSON.stringify([]),
            "api-key": "test",
          },
        },
        mockResponse(mock)
      );
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("request succeed", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: {
                data: {
                  order_product_list: [],
                  shipping_date_list: [],
                  shipping_time_list: [],
                },
              },
            }),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        createOrder,
      } = require("../../../../services/repeat-plus/controller/order");
      await createOrder(
        {
          body: {
            shipping_no: "new",
            product_detail: JSON.stringify([
              { product: { product_id: "test", variation_id: "test" } },
            ]),
            product_id: "test",
            "api-key": "test",
          },
        },
        mockResponse(mock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        order_product_list: [],
        shipping_date_list: [],
        shipping_time_list: [],
      });
    });
  });

  describe("repeat-plus/get-after-recommends", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request body", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getAfterOrderRecommends,
      } = require("../../../../services/repeat-plus/controller/order");
      await getAfterOrderRecommends({ body: {} }, mockResponse(mock, jsonMock));
      expect(jsonMock).toHaveBeenCalledWith({
        after_order_recommend_flag: 0,
      });
    });

    test("request with unexpected error", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getAfterOrderRecommends,
      } = require("../../../../services/repeat-plus/controller/order");
      await getAfterOrderRecommends(
        {
          body: {
            shipping_no: "new",
            product_detail: JSON.stringify([]),
            product_id: JSON.stringify([]),
            "api-key": "test",
          },
        },
        mockResponse(mock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        after_order_recommend_flag: 0,
      });
    });

    test("request with error from repeat-plus", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
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
        getAfterOrderRecommends,
      } = require("../../../../services/repeat-plus/controller/order");
      await getAfterOrderRecommends(
        {
          body: {
            shipping_no: "new",
            product_detail: JSON.stringify([]),
            product_id: JSON.stringify([]),
            "api-key": "test",
          },
        },
        mockResponse(mock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        after_order_recommend_flag: 0,
      });
    });

    test("request succeed", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: {
                data: {
                  after_recommend_products_description: "",
                },
              },
            }),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        getAfterOrderRecommends,
      } = require("../../../../services/repeat-plus/controller/order");
      await getAfterOrderRecommends(
        {
          body: {
            shipping_no: "new",
            product_detail: JSON.stringify([
              { product: { product_id: "test", variation_id: "test" } },
            ]),
            product_id: "test",
            old_order_id: "test",
            after_order_recommend_flag: 1,
            "api-key": "test",
          },
        },
        mockResponse(mock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        after_recommend_products_description: "",
        after_order_recommend_flag: 1,
      });
    });
  });

  describe("repeat-plus/verifyAddress", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request", async () => {
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        verifyAddress,
      } = require("../../../../services/repeat-plus/controller/order");

      let json = jest.fn();
      let mock = jest.fn();
      await verifyAddress({ body: {} }, mockResponse(mock, json));
      expect(json).toHaveBeenCalledWith({
        error_message: "全角文字をご入力ください。",
      });
      expect(mock).toHaveBeenCalledWith(400);

      json = jest.fn();
      mock = jest.fn();
      await verifyAddress(
        {
          body: {
            addr1: "\t",
            addr2: "ｔｅｓｔ",
            addr3: "ｔｅｓｔ",
            addr4: "",
          },
        },
        mockResponse(mock, json)
      );
      expect(json).toHaveBeenCalledWith({
        error_message: "全角文字をご入力ください。",
      });
      expect(mock).toHaveBeenCalledWith(400);

      json = jest.fn();
      mock = jest.fn();
      await verifyAddress(
        {
          body: {
            addr1: "\t",
            addr2: "ｔｅｓｔ",
            addr3: "ｔｅｓｔ",
            addr4: "ｔｅｓｔ",
          },
        },
        mockResponse(mock, json)
      );
      expect(json).toHaveBeenCalledWith({
        error_message: "全角文字をご入力ください。",
      });
      expect(mock).toHaveBeenCalledWith(400);

      json = jest.fn();
      mock = jest.fn();
      await verifyAddress(
        {
          body: {
            addr1: "ｔｅｓｔ",
            addr2: "ｔｅｓｔ",
            addr3: "ｔｅｓｔ",
            addr4: "test",
          },
        },
        mockResponse(mock, json)
      );
      expect(json).toHaveBeenCalledWith({
        error_message: "全角文字をご入力ください。",
      });
      expect(mock).toHaveBeenCalledWith(400);

      json = jest.fn();
      mock = jest.fn();
      await verifyAddress(
        {
          body: {
            addr1: "test",
            addr2: "test",
            addr3: "test",
            addr4: "",
          },
        },
        mockResponse(mock, json)
      );
      expect(json).toHaveBeenCalledWith({
        error_message: "全角文字をご入力ください。",
      });
      expect(mock).toHaveBeenCalledWith(400);

      json = jest.fn();
      mock = jest.fn();
      await verifyAddress(
        {
          body: {
            addr1: "test",
            addr2: "ｔｅｓｔ",
            addr3: "ｔｅｓｔ",
            addr4: "\t",
          },
        },
        mockResponse(mock, json)
      );
      expect(json).toHaveBeenCalledWith({
        error_message: "全角文字をご入力ください。",
      });
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("valid address with addr4 is empty", async () => {
      const mock = jest.fn();
      const json = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        verifyAddress,
      } = require("../../../../services/repeat-plus/controller/order");
      await verifyAddress(
        {
          body: {
            addr1: "ｔｅｓｔ",
            addr2: "ｔｅｓｔ",
            addr3: "ｔｅｓｔ",
            addr4: "",
          },
        },
        mockResponse(mock, json)
      );
      expect(json).toHaveBeenCalledWith({
        status: "valid",
      });
      expect(mock).toHaveBeenCalledWith(200);
    });

    test("valid address with addr4 is not empty", async () => {
      const mock = jest.fn();
      const json = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        verifyAddress,
      } = require("../../../../services/repeat-plus/controller/order");
      await verifyAddress(
        {
          body: {
            addr1: "ｔｅｓｔ",
            addr2: "ｔｅｓｔ",
            addr3: "ｔｅｓｔ",
            addr4: "ｔｅｓｔ",
          },
        },
        mockResponse(mock, json)
      );
      expect(json).toHaveBeenCalledWith({
        status: "valid",
      });
      expect(mock).toHaveBeenCalledWith(200);
    });
  });
});
