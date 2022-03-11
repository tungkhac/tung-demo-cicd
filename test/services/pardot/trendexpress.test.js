// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("routes_es6/trendexpress", () => {
  const modulePath = "../../../routes_es6/trendexpress";
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });
  const mockExpress = (req, res) => {
    jest.doMock("express", () => {
      return {
        Router: () => {
          return {
            post: (path, callback) => {
              callback(req, res, jest.fn());
            },
          };
        },
      };
    });
  };

  const mockResponse = () => {
    return {
      status: jest.fn().mockReturnThis(),
      render: jest.fn(),
      json: jest.fn(),
    };
  };
  test("invalid params", () => {
    jest.mock("../../../model", () => {
      return {};
    });
    const req = { body: {} };
    const res = mockResponse();
    mockExpress(req, res);
    const service = require(modulePath);
    expect(res.json).toHaveBeenCalledWith({});
  });

  test("request error", () => {
    jest.mock("../../../model", () => {
      return {};
    });
    const exceptionMock = jest.fn();
    jest.doMock("../../../util", () => {
      return {
        saveException: () => {
          exceptionMock();
        },
      };
    });
    const mockFunc = jest.fn();
    const requestFunc = (param, callback) => {
      mockFunc();
      callback(new Error("test"), "test", "test");
    };
    jest.doMock("request", () => {
      return requestFunc;
    });
    const req = { body: { endpoint_url: "test", cpid: "test", uid: "test" } };
    const res = mockResponse();
    mockExpress(req, res);
    const service = require(modulePath);
    expect(exceptionMock).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({});
  });

  test("request has no response body", () => {
    jest.mock("../../../model", () => {
      return {};
    });
    const exceptionMock = jest.fn();
    jest.doMock("../../../util", () => {
      return {
        saveException: () => {
          exceptionMock();
        },
      };
    });
    const mockFunc = jest.fn();
    const requestFunc = (param, callback) => {
      mockFunc();
      callback(null, { statusCode: 200 });
    };
    jest.doMock("request", () => {
      return requestFunc;
    });
    const req = { body: { endpoint_url: "test", cpid: "test", uid: "test" } };
    const res = mockResponse();
    mockExpress(req, res);
    const service = require(modulePath);
    expect(exceptionMock).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({});
  });

  test("request has response body", () => {
    jest.mock("../../../model", () => {
      return {};
    });
    const exceptionMock = jest.fn();
    jest.doMock("../../../util", () => {
      return {
        saveException: () => {
          exceptionMock();
        },
      };
    });
    const mockFunc = jest.fn();
    const requestFunc = (param, callback) => {
      mockFunc();
      callback(null, { statusCode: 200, body: "test" });
    };
    jest.doMock("request", () => {
      return requestFunc;
    });
    const req = { body: { endpoint_url: "test", cpid: "test", uid: "test" } };
    const res = mockResponse();
    mockExpress(req, res);
    const service = require(modulePath);
    expect(exceptionMock).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({});
  });
});
