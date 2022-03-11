// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0

describe("getCardList", () => {
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

  test("require is invalid", async (done) => {
    const mock = jest.fn();
    const {
      getCardList,
    } = require("../../../../services/rakuraku/controller/card");
    await getCardList({ body: {} }, mockResponse(mock));
    setTimeout(() => {
      expect(mock).toHaveBeenCalledWith(400);
      done();
    }, 100);
  });

  const body = {
    customer_id: "customer_id",
    siteID: "siteID",
    sitePass: "sitePass",
  };

  test("error thrown while fetching", async (done) => {
    const mock = jest.fn();
    const mockJson = jest.fn();
    jest.doMock("axios", () => {
      return {
        post: () => Promise.reject(new Error("error")),
      };
    });
    const {
      getCardList,
    } = require("../../../../services/rakuraku/controller/card");
    await getCardList({ body: body }, mockResponse(mock));
    setTimeout(() => {
      expect(mock).toHaveBeenCalledWith(400);
      done();
    }, 100);
  });

  test("search card error", async (done) => {
    const mock = jest.fn();
    const mockJson = jest.fn();
    jest.doMock("axios", () => {
      return {
        post: () =>
          Promise.resolve({
            data: {
              Error: "error",
            },
          }),
      };
    });
    const {
      getCardList,
    } = require("../../../../services/rakuraku/controller/card");
    await getCardList({ body: body }, mockResponse(mock, mockJson));
    setTimeout(() => {
      expect(mockJson).toHaveBeenCalledWith({
        data: [
          {
            text: "New card",
            value: -1,
          },
        ],
      });
      done();
    }, 100);
  });

  test("card not found", async (done) => {
    const mock = jest.fn();
    const mockJson = jest.fn();
    jest.doMock("axios", () => {
      return {
        post: () =>
          Promise.resolve({
            data: {
              CardNo: "",
            },
          }),
      };
    });
    const {
      getCardList,
    } = require("../../../../services/rakuraku/controller/card");
    await getCardList({ body: body }, mockResponse(mock, mockJson));
    setTimeout(() => {
      expect(mockJson).toHaveBeenCalledWith({
        data: [
          {
            text: "New card",
            value: -1,
          },
        ],
      });
      done();
    }, 100);
  });

  test("get card list succeed", async (done) => {
    const mock = jest.fn();
    const mockJson = jest.fn();
    jest.doMock("axios", () => {
      return {
        post: () =>
          Promise.resolve({
            data: "CardNo=test|test2",
          }),
      };
    });
    const {
      getCardList,
    } = require("../../../../services/rakuraku/controller/card");
    await getCardList({ body: body }, mockResponse(mock, mockJson));
    setTimeout(() => {
      expect(mockJson).toHaveBeenCalledWith({
        data: [
          {
            text: "test",
            value: 0,
          },
          {
            text: "test2",
            value: 1,
          },
          {
            text: "New card",
            value: -1,
          },
        ],
      });
      done();
    }, 100);
  });
});
