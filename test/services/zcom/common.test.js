// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("zcom/common", () => {
  const mockModel = () =>
    jest.doMock("../../../model", () => {
      return {};
    });
  beforeEach(() => {
    jest.resetModules();
  });

  test("getZComResult", async () => {
    mockModel();
    const { getZComResult } = require("../../../services/zcom/common");
    expect(getZComResult({})).toEqual(undefined);
    expect(getZComResult({}, "test")).toEqual(undefined);
    expect(
      getZComResult({ "GlobalPayment_result.result": ["test"] }, "test")
    ).toEqual(undefined);
    expect(
      getZComResult(
        { "GlobalPayment_result.result": [{ $: { test: "test" } }] },
        "test"
      )
    ).toEqual("test");
  });
  class FormData {
    constructor() {
      this.data = {};
    }

    append(key, value) {
      this.data[key] = value;
    }
    get(key) {
      return this.data[key];
    }
  }
  test("fillFormByKeyValue", async () => {
    mockModel();
    const form = new FormData();
    const { fillFormByKeyValue } = require("../../../services/zcom/common");
    fillFormByKeyValue(form, "test1", "test1", "");
    expect(form.get("test1")).toEqual("test1");
    fillFormByKeyValue(form, "test2", "", "test2");
    expect(form.get("test2")).toEqual("test2");
    try {
      fillFormByKeyValue(form, "test3", "", "");
    } catch (error) {
      expect(error.message).toEqual("test3 is required.");
    }
  });

  test("fillOrderHeaders", async () => {
    let form = new FormData();
    const { fillOrderHeaders } = require("../../../services/zcom/common");
    try {
      fillOrderHeaders(form, {});
    } catch (error) {
      expect(error.message).toEqual("contract_code is required.");
    }

    form = new FormData();
    fillOrderHeaders(form, { contract_code: "test" });
    expect(form.get("contract_code")).toEqual("test");
    expect(form.get("version")).toEqual("1");
    expect(form.get("character_code")).toEqual("UTF-8");
    expect(form.get("process_code")).toEqual("1");
  });

  test("fillUserInformation", async () => {
    mockModel();
    let form = new FormData();
    const { fillUserInformation } = require("../../../services/zcom/common");
    try {
      fillUserInformation(form, {});
    } catch (error) {
      expect(form.get("lang_id")).toEqual("ja");
      expect(error.message).toEqual("user_id is required.");
    }

    form = new FormData();
    fillUserInformation(form, {
      lang_id: "vn",
      zcom_user_id: "test",
      user_name: "test",
      user_mail_add: "test",
    });
    expect(form.get("lang_id")).toEqual("ja");
    expect(form.get("user_id")).toEqual("test");
    expect(form.get("user_name")).toEqual("test");
    expect(form.get("user_mail_add")).toEqual("test");
  });

  test("fillProductInformation", async () => {
    mockModel();
    let form = new FormData();
    const { fillProductInformation } = require("../../../services/zcom/common");
    try {
      fillProductInformation(form, {});
    } catch (error) {
      expect(error.message).toEqual("item_code is required.");
    }

    form = new FormData();
    fillProductInformation(form, {
      item_code: "test",
      item_name: "test",
      item_price: "test",
      order_number: "test",
    });
    expect(form.get("item_code")).toEqual("test");
    expect(form.get("item_name")).toEqual("test");
    expect(form.get("item_price")).toEqual("test");
    expect(form.get("order_number")).toEqual("test");
  });

  test("addParameterToURL", async () => {
    mockModel();
    const { addParameterToURL } = require("../../../services/zcom/common");
    expect(addParameterToURL()).toEqual(undefined);
    expect(addParameterToURL(undefined, "test", "test")).toEqual(undefined);
    expect(addParameterToURL("http://test.com", "test", "test")).toEqual(
      "http://test.com/?test=test"
    );
    expect(addParameterToURL("http://test.com?a=b", "test", "test")).toEqual(
      "http://test.com/?a=b&test=test"
    );
  });

  describe("getUserCryptKey", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid params", async () => {
      mockModel();
      const { getUserCryptKey } = require("../../../services/zcom/common");
      expect(await getUserCryptKey()).toEqual(undefined);
    });

    test("no key found", async () => {
      jest.doMock("../../../model", () => {
        return {
          UserCryptKey: {
            findOne: () => {
              return null;
            },
          },
        };
      });
      const { getUserCryptKey } = require("../../../services/zcom/common");
      expect(await getUserCryptKey("test", "test")).toEqual(undefined);
    });

    test("key found", async () => {
      jest.doMock("../../../model", () => {
        return {
          UserCryptKey: {
            findOne: () => {
              return { salt: "test" };
            },
          },
        };
      });
      const { getUserCryptKey } = require("../../../services/zcom/common");
      expect(await getUserCryptKey("test", "test")).toEqual("test");
    });
  });

  describe("getConnectPage", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid params", async () => {
      mockModel();
      const { getConnectPage } = require("../../../services/zcom/common");
      expect(await getConnectPage()).toEqual(undefined);
    });

    test("no connect page found", async () => {
      jest.doMock("../../../model", () => {
        return {
          UserCryptKey: {
            findOne: () => {
              return null;
            },
          },
          ConnectPage: {
            findOne: () => {
              return null;
            },
          },
        };
      });
      const { getConnectPage } = require("../../../services/zcom/common");
      expect(await getConnectPage("test", "test")).toEqual(undefined);
    });

    test("connect page found", async () => {
      jest.doMock("../../../model", () => {
        return {
          UserCryptKey: {
            findOne: () => {
              return { salt: "test" };
            },
          },
          ConnectPage: {
            findOne: () => {
              return { connect_id: "test", encrypt_flg: "test" };
            },
          },
        };
      });
      const { getConnectPage } = require("../../../services/zcom/common");
      expect(await getConnectPage("test", "test")).toEqual({
        connect_id: "test",
        encrypt_flg: "test",
        encrypt_key: "test",
      });
    });
  });

  describe("getVariableValue", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid params", async () => {
      mockModel();
      const { getVariableValue } = require("../../../services/zcom/common");
      expect(await getVariableValue()).toEqual(undefined);
      expect(await getVariableValue(null, {})).toEqual(undefined);
      expect(await getVariableValue(null, { variable_value: "" })).toEqual(
        undefined
      );
    });

    test("return variable value", async () => {
      mockModel();
      const { getVariableValue } = require("../../../services/zcom/common");
      expect(await getVariableValue(null, { variable_value: "test" })).toEqual(
        "test"
      );
      expect(
        await getVariableValue(null, {
          variable_value: ["test", { value: "test" }, { text: "test" }],
        })
      ).toEqual("test,test,test");
      const variable_value =
        "WP+VepLzTQ+20Y/z8PK4O+4+A4ONeBlM490lsuxtv+YJaK5ecQ2JHbkvGK3pTLX9bycFjsBsflDtO6ZClmGxZ0MMNMTO9hjMKnSZHMPhKNM=";
      const encrypt_key =
        "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";
      expect(
        await getVariableValue(encrypt_key, {
          variable_value,
        })
      ).toEqual("test,test2");
    });
  });

  describe("getVariableValueById", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid params", async () => {
      mockModel();
      const { getVariableValueById } = require("../../../services/zcom/common");
      expect(await getVariableValueById()).toEqual({});
    });

    test("no message variable", async () => {
      jest.doMock("../../../model", () => {
        return {
          EfoMessageVariable: {
            findOne: () => {
              return null;
            },
          },
        };
      });
      const { getVariableValueById } = require("../../../services/zcom/common");
      expect(await getVariableValueById("test", "test", "test")).toEqual({});
    });

    test("message variable found", async () => {
      jest.doMock("../../../model", () => {
        return {
          EfoMessageVariable: {
            findOne: () => {
              return { variable_value: "test" };
            },
          },
        };
      });
      const { getVariableValueById } = require("../../../services/zcom/common");
      expect(await getVariableValueById("test", "test", "test")).toEqual({
        test: "test",
      });
    });
  });

  describe("insertValueToMessageVariable", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid params", async () => {
      const findMock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          Variable: {
            findOne: () => {
              findMock();
              return null;
            },
          },
        };
      });
      const {
        insertValueToMessageVariable,
      } = require("../../../services/zcom/common");
      await insertValueToMessageVariable();
      expect(findMock).not.toHaveBeenCalled();
    });

    test("no variable found", async () => {
      const findMock = jest.fn();
      const updateMock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          Variable: {
            findOne: () => {
              findMock();
              return null;
            },
            update: () => {
              updateMock();
            },
          },
        };
      });
      const {
        insertValueToMessageVariable,
      } = require("../../../services/zcom/common");
      await insertValueToMessageVariable("test", "test", "test", "test");
      expect(findMock).toHaveBeenCalled();
      expect(updateMock).toHaveBeenCalled();
    });

    test("variable found", async () => {
      const findMock = jest.fn();
      const updateMock = jest.fn();
      const messageUpdateMock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          Variable: {
            findOne: () => {
              findMock();
              return { _id: "test" };
            },
            update: () => {
              updateMock();
            },
          },
          EfoMessageVariable: {
            update: () => {
              messageUpdateMock();
            },
          },
        };
      });
      const {
        insertValueToMessageVariable,
      } = require("../../../services/zcom/common");
      await insertValueToMessageVariable("test", "test", "test", "test");
      expect(findMock).toHaveBeenCalled();
      expect(updateMock).not.toHaveBeenCalled();
      expect(messageUpdateMock).toHaveBeenCalled();
    });
  });

  test("getZComResultObject", async () => {
    mockModel();
    const { getZComResultObject } = require("../../../services/zcom/common");
    expect(getZComResultObject()).toEqual(undefined);
    expect(getZComResultObject([])).toEqual(undefined);
    expect(
      getZComResultObject({
        GlobalPayment_result: {
          result: [
            { $: { test: "test" } },
            { $: { test2: "" } },
            {},
            { $: "test" },
            { $: {} },
          ],
        },
      })
    ).toEqual({ test: "test" });
    expect(
      getZComResultObject({
        GlobalPayment_result: {
          result: [{ $: { test: "test" } }, { $: { test2: "test" } }],
        },
      })
    ).toEqual({ test: "test", test2: "test" });
  });

  describe("requestCheckOrder", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      mockModel();
      const { requestCheckOrder } = require("../../../services/zcom/common");
      expect(await requestCheckOrder()).toEqual(undefined);
    });

    const randomMode = () => {
      const random = Math.random();
      if (random < 0.5) return "production";
      return "test";
    };

    test("exception handle", async () => {
      jest.doMock("axios", () => {
        return {};
      });
      const { requestCheckOrder } = require("../../../services/zcom/common");
      expect(await requestCheckOrder("test", randomMode(), "test")).toEqual(
        undefined
      );
    });

    test("cgi error", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const { requestCheckOrder } = require("../../../services/zcom/common");
      expect(await requestCheckOrder("test", randomMode(), "test")).toEqual(
        undefined
      );
    });

    const xml =
      '<?xml version="1.0" encoding="UTF-8" ?><GlobalPayment_result><result test="test" /></GlobalPayment_result>';

    test("invalid response from cgi", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve(),
        };
      });
      const { createPayment } = require("../../../services/zcom/controller");
      const { requestCheckOrder } = require("../../../services/zcom/common");
      expect(await requestCheckOrder("test", randomMode(), "test")).toEqual(
        undefined
      );
    });

    test("valid response from cgi", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: xml }),
        };
      });
      const { createPayment } = require("../../../services/zcom/controller");
      const { requestCheckOrder } = require("../../../services/zcom/common");
      expect(await requestCheckOrder("test", randomMode(), "test")).toEqual({
        test: "test",
      });
    });
  });

  describe("getPaymentSettings", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid params", async () => {
      jest.doMock("../../../model", () => {
        return {};
      });
      const { getPaymentSettings } = require("../../../services/zcom/common");
      expect(await getPaymentSettings()).toEqual([]);
    });

    test("no EfoPOrderSetting found", async () => {
      jest.doMock("../../../model", () => {
        return {
          EfoPOrderSetting: {
            findOne: () => {
              return null;
            },
          },
        };
      });
      const { getPaymentSettings } = require("../../../services/zcom/common");
      expect(await getPaymentSettings("test")).toEqual([]);
    });

    test("EfoPOrderSetting found", async () => {
      const setting = { test: "test" };
      jest.doMock("../../../model", () => {
        return {
          EfoPOrderSetting: {
            findOne: () => {
              return setting;
            },
          },
        };
      });
      const { getPaymentSettings } = require("../../../services/zcom/common");
      const settings = await getPaymentSettings("test");
      expect(settings.length).toEqual(1);
    });
  });

  describe("getZComPayment", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid params", async () => {
      mockModel();
      const { getZComPayment } = require("../../../services/zcom/common");
      expect(await getZComPayment()).toEqual(undefined);
    });

    test("ZCOMPayment found", async () => {
      jest.doMock("../../../model", () => {
        return {
          ZCOMPayment: {
            findOne: () => {
              return "test";
            },
          },
        };
      });
      const { getZComPayment } = require("../../../services/zcom/common");
      expect(await getZComPayment("test")).toEqual("test");
    });
  });

  describe("saveZCOMPayment", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid params", async () => {
      const updateMock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          ZCOMPayment: {
            update: () => {
              updateMock();
              return "test";
            },
          },
        };
      });
      const { saveZCOMPayment } = require("../../../services/zcom/common");
      await saveZCOMPayment();
      expect(updateMock).not.toHaveBeenCalled();
    });

    test("save ZCOMPayment", async () => {
      const updateMock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          ZCOMPayment: {
            update: () => {
              updateMock();
              return "test";
            },
          },
        };
      });
      const { saveZCOMPayment } = require("../../../services/zcom/common");
      await saveZCOMPayment("test", "test", "test", "test", "test", "test");
      expect(updateMock).toHaveBeenCalled();
    });
  });
});
