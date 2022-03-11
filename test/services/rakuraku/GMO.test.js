// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const { ExpectationFailed } = require("http-errors");
const mock = require("mock-require");
const {
  PAYMENT_TYPE_COD,
  PAYMENT_TYPE_CREDIT_CARD,
  LOGIN,
  REGISTER,
  GUEST,
  RAKURAKU_API,
  ACCESS_TOKEN_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
  UPDATE_CUSTOMER_PATH,
  GET_CUSTOMER_PATH,
  GET_CUSTOMER_DELIVERY,
  CREATE_CUSTOMER_DELIVERY,
  CREATE_ORDER,
  RAKURAKU_LOG,
  RAKURAKU_PREFIX,
  GMO_API,
  GMO_CREATE_MEMBER,
  GMO_SEARCH_MEMBER,
  GMO_ENTRY_TRAN,
  GMO_EXEC_TRAN,
  GMO_ADD_CARD,
  GMO_SEARCH_CARD,
  GMO_ERROR,
  PERIOD_TYPE_DATE,
  PERIOD_TYPE_MONTHLY_DATE,
  PERIOD_TYPE_MONTHLY_DAY,
  PERIOD_TYPE_WEEKLY,
  PERIOD_TYPE_BIWEEKLY,
  VALIDATE_ERRORS,
} = require("../../../services/rakuraku/constants");

describe("rakuraku/GMO", () => {
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

  beforeEach(() => {
    jest.resetModules();
  });

  describe("createMember", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    const data = {
      memberID: "test",
      memberName: "test",
      siteID: "test",
      sitePass: "test",
    };

    test("request is invalid", async () => {
      const { createMember } = require("../../../services/rakuraku/GMO");
      await expect(createMember()).rejects.toThrow(TypeError);
    });

    test("exception handle", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const { createMember } = require("../../../services/rakuraku/GMO");
      await expect(createMember(data)).rejects.toThrow("error");
    });

    test("invalid response", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve(),
        };
      });
      const { createMember } = require("../../../services/rakuraku/GMO");
      await expect(createMember(data)).rejects.toThrow(TypeError);
    });

    test("response data is not expected", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "test",
            }),
        };
      });
      const { createMember } = require("../../../services/rakuraku/GMO");
      expect(await createMember(data)).toEqual(undefined);
    });

    test("have error", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "ErrInfo=E00000000|E01010001",
            }),
        };
      });
      const { createMember } = require("../../../services/rakuraku/GMO");
      await expect(createMember(data)).rejects.toThrow(
        "特になし, ショップIDが指定されていません。"
      );
    });

    test("create member successfully", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "MemberID=test",
            }),
        };
      });
      const { createMember } = require("../../../services/rakuraku/GMO");
      expect(await createMember(data)).toEqual("test");
    });
  });

  describe("entryTran", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    const data = {
      orderID: "test",
      amount: "test",
      shopID: "test",
      shopPass: "test",
    };

    test("request is invalid", async () => {
      const { entryTran } = require("../../../services/rakuraku/GMO");
      await expect(entryTran()).rejects.toThrow(TypeError);
    });

    test("exception handle", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const { entryTran } = require("../../../services/rakuraku/GMO");
      await expect(entryTran(data)).rejects.toThrow(Error);
    });

    test("invalid response", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve(),
        };
      });
      const { entryTran } = require("../../../services/rakuraku/GMO");
      await expect(entryTran(data)).rejects.toThrow(TypeError);
    });

    test("response data is not expected", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "test",
            }),
        };
      });
      const { entryTran } = require("../../../services/rakuraku/GMO");
      expect(await entryTran(data)).toEqual(undefined);
    });

    test("have error", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "ErrInfo=E00000000",
            }),
        };
      });
      const { entryTran } = require("../../../services/rakuraku/GMO");
      await expect(entryTran(data)).rejects.toThrow("特になし");
    });

    test("response data don't have access password", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "AccessID=test",
            }),
        };
      });
      const { entryTran } = require("../../../services/rakuraku/GMO");
      expect(await entryTran(data)).toEqual({
        accessID: "test",
        accessPass: undefined,
      });
    });

    test("response data have access password", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "AccessID=test&AccessPass=test",
            }),
        };
      });
      const { entryTran } = require("../../../services/rakuraku/GMO");
      expect(await entryTran(data)).toEqual({
        accessID: "test",
        accessPass: "test",
      });
    });
  });

  describe("execTran", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    const data = {
      orderID: "test",
      accessID: "test",
      accessPass: "test",
      memberID: "test",
      cardSeq: "test",
      siteID: "test",
      sitePass: "test",
    };
    test("request is invalid", async () => {
      const { execTran } = require("../../../services/rakuraku/GMO");
      await expect(execTran()).rejects.toThrow(TypeError);
    });

    test("exception handle", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const { execTran } = require("../../../services/rakuraku/GMO");
      await expect(execTran(data)).rejects.toThrow(Error);
    });

    test("invalid response", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve(),
        };
      });
      const { execTran } = require("../../../services/rakuraku/GMO");
      await expect(execTran(data)).rejects.toThrow(TypeError);
    });

    test("response data is not expected", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "test",
            }),
        };
      });
      const { execTran } = require("../../../services/rakuraku/GMO");
      expect(await execTran(data)).toEqual(undefined);
    });

    test("have error", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "ErrInfo=E00000000",
            }),
        };
      });
      const { execTran } = require("../../../services/rakuraku/GMO");
      await expect(execTran(data)).rejects.toThrow("特になし");
    });

    test("success", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "OrderID=test",
            }),
        };
      });
      const { execTran } = require("../../../services/rakuraku/GMO");
      expect(await execTran(data)).toEqual({ orderID: "test" });
    });
  });

  describe("addCard", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    const data = {
      token: "test",
      memberID: "test",
      siteID: "test",
      sitePass: "test",
    };

    test("request is invalid", async () => {
      const { addCard } = require("../../../services/rakuraku/GMO");
      await expect(addCard()).rejects.toThrow(TypeError);
    });

    test("exception handle", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const { addCard } = require("../../../services/rakuraku/GMO");
      await expect(addCard(data)).rejects.toThrow(Error);
    });

    test("invalid response", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve(),
        };
      });
      const { addCard } = require("../../../services/rakuraku/GMO");
      await expect(addCard(data)).rejects.toThrow(TypeError);
    });

    test("response data is not expected", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "test",
            }),
        };
      });
      const { addCard } = require("../../../services/rakuraku/GMO");
      expect(await addCard(data)).toEqual(undefined);
    });

    test("have error", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "ErrInfo=E00000000",
            }),
        };
      });
      const { addCard } = require("../../../services/rakuraku/GMO");
      await expect(addCard(data)).rejects.toThrow("特になし");
    });

    test("add card successfully", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "CardSeq=test",
            }),
        };
      });
      const { addCard } = require("../../../services/rakuraku/GMO");
      expect(await addCard(data)).toEqual({ cardSeq: "test" });
    });
  });

  describe("searchCard", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    const data = { memberID: "test", siteID: "test", sitePass: "test" };

    test("request is invalid", async () => {
      const { searchCard } = require("../../../services/rakuraku/GMO");
      await expect(searchCard()).rejects.toThrow(TypeError);
    });

    test("exception handle", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const { searchCard } = require("../../../services/rakuraku/GMO");
      await expect(searchCard(data)).rejects.toThrow(Error);
    });

    test("invalid response", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve(),
        };
      });
      const { searchCard } = require("../../../services/rakuraku/GMO");
      await expect(searchCard(data)).rejects.toThrow(TypeError);
    });

    test("response data is not expected", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "test",
            }),
        };
      });
      const { searchCard } = require("../../../services/rakuraku/GMO");
      expect(await searchCard(data)).toEqual([]);
    });

    test("have error", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "ErrInfo=E00000000",
            }),
        };
      });
      const { searchCard } = require("../../../services/rakuraku/GMO");
      expect(await searchCard(data)).toEqual([]);
    });

    test("success", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "CardNo=test",
            }),
        };
      });
      const { searchCard } = require("../../../services/rakuraku/GMO");
      expect(await searchCard(data)).toEqual(["test"]);
    });
  });

  describe("searchMember", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    const data = { memberID: "test", siteID: "test", sitePass: "test" };

    test("request is invalid", async () => {
      const { searchMember } = require("../../../services/rakuraku/GMO");
      await expect(searchMember()).rejects.toThrow(TypeError);
    });

    test("exception handle", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const { searchMember } = require("../../../services/rakuraku/GMO");
      await expect(searchMember(data)).rejects.toThrow(Error);
    });

    test("invalid response", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve(),
        };
      });
      const { searchMember } = require("../../../services/rakuraku/GMO");
      await expect(searchMember(data)).rejects.toThrow(TypeError);
    });

    test("response data is not expected", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "test",
            }),
        };
      });
      const { searchMember } = require("../../../services/rakuraku/GMO");
      expect(await searchMember(data)).toEqual(undefined);
    });

    test("have error", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "ErrInfo=test",
            }),
        };
      });
      const { searchMember } = require("../../../services/rakuraku/GMO");
      expect(await searchMember(data)).toEqual(null);
    });

    test("success", async () => {
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: "MemberID=test",
            }),
        };
      });
      const { searchMember } = require("../../../services/rakuraku/GMO");
      expect(await searchMember(data)).toEqual("test");
    });
  });
});
