// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const {
  PAYMENT_TYPE_COD,
  PAYMENT_TYPE_CREDIT_CARD,
  GMO_SEARCH_MEMBER,
  GET_CUSTOMER_PATH,
  UPDATE_CUSTOMER_PATH,
  GMO_ENTRY_TRAN,
  GMO_EXEC_TRAN,
  GUEST,
  REGISTER,
  GMO_ADD_CARD,
} = require("../../../../services/rakuraku/constants");

describe("services/rakuraku/order", () => {
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

  describe("order", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid request", async () => {
      const mock = jest.fn();
      const {
        order,
      } = require("../../../../services/rakuraku/controller/order");
      await order({ body: {} }, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(400);
    });

    describe("payment_type is PAYMENT_TYPE_COD", () => {
      beforeEach(() => {
        jest.resetModules();
      });
      const request = {
        body: {
          customer_id: "test",
          access_token: "test",
          shipping_zipcode: "test",
          payment_type: PAYMENT_TYPE_COD,
        },
      };
      test("error while fetching data", async () => {
        const mock = jest.fn();
        jest.doMock("axios", () => {
          return {
            post: () => Promise.reject(new Error("error")),
          };
        });
        const {
          order,
        } = require("../../../../services/rakuraku/controller/order");
        await order(request, mockResponse(mock));
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
          order,
        } = require("../../../../services/rakuraku/controller/order");
        await order(request, mockResponse(mock));
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
                    orders: [
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
          order,
        } = require("../../../../services/rakuraku/controller/order");
        await order(request, mockResponse(mock));
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
                    orders: [
                      {
                        id: "test",
                        result: 1,
                      },
                    ],
                  },
                },
              }),
          };
        });
        const {
          order,
        } = require("../../../../services/rakuraku/controller/order");
        await order(
          { body: { ...request.body, user_type: REGISTER } },
          mockResponse(mock)
        );
        expect(mock).toHaveBeenCalledWith(200);
      });
    });

    describe("payment_type is PAYMENT_TYPE_CREDIT_CARD", () => {
      beforeEach(() => {
        jest.resetModules();
      });
      const request = {
        body: {
          customer_id: "test",
          access_token: "test",
          shipping_zipcode: "test",
          payment_type: PAYMENT_TYPE_CREDIT_CARD,
          siteID: "test",
          sitePass: "test",
          card_seq: "test",
          card_token: "test",
          amount: 10,
          shopID: "test",
          shopPass: "test",
          accessID: "test",
          accessPass: "test",
        },
      };
      test("error while fetching data", async () => {
        const mock = jest.fn();
        jest.doMock("axios", () => {
          return {
            post: () => Promise.reject(new Error("error")),
          };
        });
        const {
          order,
        } = require("../../../../services/rakuraku/controller/order");
        await order(request, mockResponse(mock));
        expect(mock).toHaveBeenCalledWith(400);
      });

      test("no data responded", async () => {
        const mock = jest.fn();
        jest.doMock("axios", () => {
          return {
            post: (url) => {
              if (url && url.endsWith) {
                if (url.endsWith(GET_CUSTOMER_PATH))
                  return Promise.resolve({
                    data: {
                      success: "ok",
                      response: { customers: [{ customer: {} }] },
                    },
                  });
                else if (url.endsWith(UPDATE_CUSTOMER_PATH))
                  return Promise.resolve({
                    data: {
                      success: "ok",
                      response: { customers: [{ result: 1, id: "test" }] },
                    },
                  });
                else if (url.endsWith(GMO_ENTRY_TRAN))
                  return Promise.resolve({
                    data: "AccessID=test&AccessPass=test",
                  });
                else if (url.endsWith(GMO_EXEC_TRAN))
                  return Promise.resolve({
                    data: "OrderID=test",
                  });
              }
              return Promise.resolve({});
            },
          };
        });
        const {
          order,
        } = require("../../../../services/rakuraku/controller/order");
        await order(request, mockResponse(mock));
        expect(mock).toHaveBeenCalledWith(400);
      });

      test("failed", async () => {
        const mock = jest.fn();
        jest.doMock("axios", () => {
          return {
            post: (url) => {
              if (url && url.endsWith) {
                if (url.endsWith(GET_CUSTOMER_PATH))
                  return Promise.resolve({
                    data: {
                      success: "ok",
                      response: { customers: [{ customer: {} }] },
                    },
                  });
                else if (url.endsWith(UPDATE_CUSTOMER_PATH))
                  return Promise.resolve({
                    data: {
                      success: "ok",
                      response: { customers: [{ result: 1, id: "test" }] },
                    },
                  });
                else if (url.endsWith(GMO_ENTRY_TRAN))
                  return Promise.resolve({
                    data: "AccessID=test&AccessPass=test",
                  });
                else if (url.endsWith(GMO_EXEC_TRAN))
                  return Promise.resolve({
                    data: "OrderID=test",
                  });
                else if (url.endsWith(GMO_ADD_CARD))
                  return Promise.resolve({
                    data: "CardSeq=test",
                  });
              }
              return Promise.resolve({
                data: {
                  response: {
                    orders: [
                      {
                        result: "test",
                      },
                    ],
                  },
                },
              });
            },
          };
        });
        const {
          order,
        } = require("../../../../services/rakuraku/controller/order");
        await order(
          { body: { ...request.body, user_type: GUEST, card_seq: "-1" } },
          mockResponse(mock)
        );
        expect(mock).toHaveBeenCalledWith(400);
      });

      test("succeed", async () => {
        const mock = jest.fn();
        jest.doMock("axios", () => {
          return {
            post: (url) => {
              if (url && url.endsWith) {
                if (url.endsWith(GET_CUSTOMER_PATH))
                  return Promise.resolve({
                    data: {
                      success: "ok",
                      response: { customers: [{ customer: {} }] },
                    },
                  });
                else if (url.endsWith(UPDATE_CUSTOMER_PATH))
                  return Promise.resolve({
                    data: {
                      success: "ok",
                      response: { customers: [{ result: 1, id: "test" }] },
                    },
                  });
                else if (url.endsWith(GMO_ENTRY_TRAN))
                  return Promise.resolve({
                    data: "AccessID=test&AccessPass=test",
                  });
                else if (url.endsWith(GMO_EXEC_TRAN))
                  return Promise.resolve({
                    data: "OrderID=test",
                  });
                else if (url.endsWith(GMO_ADD_CARD))
                  return Promise.resolve({
                    data: "CardSeq=test",
                  });
                else if (url.endsWith(GMO_SEARCH_MEMBER))
                  return Promise.resolve({
                    data: "MemberID=test",
                  });
              }
              return Promise.resolve({
                data: {
                  success: "ok",
                  response: {
                    orders: [
                      {
                        id: "test",
                        result: 1,
                      },
                    ],
                  },
                },
              });
            },
          };
        });

        const {
          order,
        } = require("../../../../services/rakuraku/controller/order");
        await order(request, mockResponse(mock));
        expect(mock).toHaveBeenCalledWith(200);
      });
    });
  });
});
