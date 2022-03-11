// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("zcom/order", () => {
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

  describe("/zcom/random-order-number", () => {
    const mockModel = () =>
      jest.doMock("../../../model", () => {
        return {};
      });
    beforeEach(() => {
      jest.resetModules();
    });
    test("return random order number", async () => {
      const jsonFunc = jest.fn();
      mockModel();
      const {
        randomOrderNumber,
      } = require("../../../services/zcom/controller");
      await randomOrderNumber({}, mockResponse(jest.fn(), jsonFunc));
      expect(jsonFunc).toHaveBeenCalled();
    });
  });

  describe("/zcom/create-payment", () => {
    const mockModel = () =>
      jest.doMock("../../../model", () => {
        return {};
      });
    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      const jsonFunc = jest.fn();
      const statusMock = jest.fn();
      mockModel();
      const { createPayment } = require("../../../services/zcom/controller");
      await createPayment({ body: {} }, mockResponse(statusMock, jsonFunc));
      expect(jsonFunc).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    test("ConnectPage not found", async () => {
      const jsonFunc = jest.fn();
      const statusMock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          UserCryptKey: {
            findOne: () => {
              return undefined;
            },
          },
          ConnectPage: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      const { createPayment } = require("../../../services/zcom/controller");
      await createPayment(
        { body: { connect_page_id: "test", user_id: "test" } },
        mockResponse(statusMock, jsonFunc)
      );
      expect(jsonFunc).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    test("Connect not found", async () => {
      const jsonFunc = jest.fn();
      const statusMock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          UserCryptKey: {
            findOne: () => {
              return undefined;
            },
          },
          Connect: {
            findOne: () => {
              return undefined;
            },
          },
          ConnectPage: {
            findOne: () => {
              return { connect_id: "test" };
            },
          },
        };
      });
      const { createPayment } = require("../../../services/zcom/controller");
      await createPayment(
        { body: { connect_page_id: "test", user_id: "test" } },
        mockResponse(statusMock, jsonFunc)
      );
      expect(jsonFunc).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    test("PaymentGateway not found", async () => {
      const jsonFunc = jest.fn();
      const statusMock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          UserCryptKey: {
            findOne: () => {
              return undefined;
            },
          },
          Connect: {
            findOne: () => {
              return { user_id: "test" };
            },
          },
          ConnectPage: {
            findOne: () => {
              return { connect_id: "test" };
            },
          },
          PaymentGateway: {
            find: () => {
              return [];
            },
          },
        };
      });
      const { createPayment } = require("../../../services/zcom/controller");
      await createPayment(
        { body: { connect_page_id: "test", user_id: "test" } },
        mockResponse(statusMock, jsonFunc)
      );
      expect(jsonFunc).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    const randomMode = () => {
      const random = Math.random();
      if (random < 0.5) return "production";
      return "test";
    };

    const mockAvailableModel = () =>
      jest.doMock("../../../model", () => {
        return {
          UserCryptKey: {
            findOne: () => {
              return undefined;
            },
          },
          Connect: {
            findOne: () => {
              return { user_id: "test" };
            },
          },
          ConnectPage: {
            findOne: () => {
              return { connect_id: "test" };
            },
          },
          EfoPOrderSetting: {
            findOne: () => {
              return undefined;
            },
          },
          Variable: {
            findOne: () => {
              return undefined;
            },
            update: () => {
              return undefined;
            },
          },
          ZCOMPayment: {
            update: () => {
              return undefined;
            },
          },
          PaymentGateway: {
            find: () => {
              return [
                {
                  contract_code: "test",
                  mode: randomMode(),
                },
              ];
            },
          },
        };
      });

    test("missing user/order information", async () => {
      const jsonFunc = jest.fn();
      const statusMock = jest.fn();
      mockAvailableModel();
      const { createPayment } = require("../../../services/zcom/controller");
      await createPayment(
        { body: { connect_page_id: "test", user_id: "test" } },
        mockResponse(statusMock, jsonFunc)
      );
      expect(jsonFunc).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    test("cgi error", async () => {
      const jsonFunc = jest.fn();
      const statusMock = jest.fn();
      mockAvailableModel();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const { createPayment } = require("../../../services/zcom/controller");
      await createPayment(
        {
          body: {
            connect_page_id: "test",
            user_id: "test",
            zcom_user_id: "test",
            user_name: "test",
            user_mail_add: "test",
            item_code: "test",
            item_name: "tes",
            item_price: "test",
            order_number: "test",
          },
        },
        mockResponse(statusMock, jsonFunc)
      );
      expect(jsonFunc).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    const xmlWithError =
      '<?xml version="1.0" encoding="UTF-8" ?><GlobalPayment_result><result result="9" /></GlobalPayment_result>';

    test("invalid response from cgi", async () => {
      const jsonFunc = jest.fn();
      const statusMock = jest.fn();
      mockAvailableModel();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve(),
        };
      });
      const { createPayment } = require("../../../services/zcom/controller");
      await createPayment(
        {
          body: {
            connect_page_id: "test",
            user_id: "test",
            zcom_user_id: "test",
            user_name: "test",
            user_mail_add: "test",
            item_code: "test",
            item_name: "tes",
            item_price: "test",
            order_number: "test",
          },
        },
        mockResponse(statusMock, jsonFunc)
      );
      expect(jsonFunc).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    test("redirect not found in cgi request", async () => {
      const jsonFunc = jest.fn();
      const statusMock = jest.fn();
      mockAvailableModel();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: xmlWithError }),
        };
      });
      const { createPayment } = require("../../../services/zcom/controller");
      await createPayment(
        {
          body: {
            connect_page_id: "test",
            user_id: "test",
            zcom_user_id: "test",
            user_name: "test",
            user_mail_add: "test",
            item_code: "test",
            item_name: "tes",
            item_price: "test",
            order_number: "test",
          },
        },
        mockResponse(statusMock, jsonFunc)
      );
      expect(jsonFunc).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    const xmlWithRedirectURL =
      '<?xml version="1.0" encoding="UTF-8" ?><GlobalPayment_result><result redirect="https://test.com/test" /></GlobalPayment_result>';
    test("redirect found in cgi request", async () => {
      const jsonFunc = jest.fn();
      const statusMock = jest.fn();
      mockAvailableModel();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: xmlWithRedirectURL }),
        };
      });
      const { createPayment } = require("../../../services/zcom/controller");
      await createPayment(
        {
          body: {
            connect_page_id: "test",
            user_id: "test",
            zcom_user_id: "test",
            user_name: "test",
            user_mail_add: "test",
            item_code: "test",
            item_name: "tes",
            item_price: "test",
            order_number: "test",
          },
        },
        mockResponse(statusMock, jsonFunc)
      );
      expect(jsonFunc).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
    });
  });

  describe("getPaymentGateway", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    test("Connect not found", async () => {
      const jsonFunc = jest.fn();
      const statusMock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          Connect: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      const {
        getPaymentGateway,
      } = require("../../../services/zcom/controller");
      expect(
        await getPaymentGateway({
          connect_page_id: "test",
          connect_id: "test",
          user_id: "test",
        })
      ).toEqual(undefined);
    });

    test("PaymentGateway not found", async () => {
      jest.doMock("../../../model", () => {
        return {
          Connect: {
            findOne: () => {
              return { user_id: "test" };
            },
          },
          PaymentGateway: {
            find: () => {
              return [];
            },
          },
        };
      });
      const {
        getPaymentGateway,
      } = require("../../../services/zcom/controller");
      expect(
        await getPaymentGateway({
          connect_page_id: "test",
          connect_id: "test",
          user_id: "test",
        })
      ).toEqual(undefined);
    });

    test("return default payment gateway", async () => {
      jest.doMock("../../../model", () => {
        return {
          Connect: {
            findOne: () => {
              return { user_id: "test" };
            },
          },
          PaymentGateway: {
            find: () => {
              return [{ default_flg: 1 }, {}];
            },
          },
          EfoPOrderSetting: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      const {
        getPaymentGateway,
      } = require("../../../services/zcom/controller");
      expect(
        await getPaymentGateway({
          connect_page_id: "test",
          connect_id: "test",
          user_id: "test",
        })
      ).toEqual({ default_flg: 1 });
    });

    test("return first payment gateway", async () => {
      jest.doMock("../../../model", () => {
        return {
          Connect: {
            findOne: () => {
              return { user_id: "test" };
            },
          },
          PaymentGateway: {
            find: () => {
              return [{ _id: 1 }, { _id: 2 }];
            },
          },
          EfoPOrderSetting: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      const {
        getPaymentGateway,
      } = require("../../../services/zcom/controller");
      expect(
        await getPaymentGateway({
          connect_page_id: "test",
          connect_id: "test",
          user_id: "test",
        })
      ).toEqual({ _id: 1 });
    });

    const objectId = "60f686f8447ec97b8a000111";
    test("order has settings", async () => {
      jest.doMock("../../../model", () => {
        return {
          Connect: {
            findOne: () => {
              return { user_id: "test" };
            },
          },
          PaymentGateway: {
            find: () => {
              return [{ _id: 1 }, { _id: 2 }];
            },
          },
          EfoPOrderSetting: {
            findOne: () => {
              return { variable_payment_method: 2 };
            },
          },
        };
      });
      const {
        getPaymentGateway,
      } = require("../../../services/zcom/controller");
      expect(
        await getPaymentGateway({
          connect_page_id: "test",
          connect_id: "test",
          user_id: "test",
        })
      ).toEqual({ _id: 1 });
    });

    test("order has settings", async () => {
      jest.doMock("../../../model", () => {
        return {
          Connect: {
            findOne: () => {
              return { user_id: "test" };
            },
          },
          PaymentGateway: {
            find: () => {
              return [{ _id: 1 }, { _id: objectId }];
            },
          },
          EfoPOrderSetting: {
            findOne: () => {
              return {
                variable_payment_method: objectId,
                payment_gateway_setting: "002",
                gateway_setting: { test: objectId },
              };
            },
          },
          EfoMessageVariable: {
            findOne: () => {
              return { variable_value: "test" };
            },
          },
        };
      });
      const {
        getPaymentGateway,
      } = require("../../../services/zcom/controller");
      expect(
        await getPaymentGateway({
          connect_page_id: "test",
          connect_id: "test",
          user_id: "test",
        })
      ).toEqual({ _id: objectId });
    });
  });
});
