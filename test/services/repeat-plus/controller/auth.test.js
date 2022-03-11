// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("repeat-plus/auth", () => {
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
  describe("repeat-plus/auth/login", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    test("request with error", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const controller = require("../../../../services/repeat-plus/controller/auth");
      await controller.login({}, mockResponse(mock));
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
      const controller = require("../../../../services/repeat-plus/controller/auth");
      await controller.login({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });
    test("request succeed", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: { data: { user: { user_id: "test" } } },
            }),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const controller = require("../../../../services/repeat-plus/controller/auth");
      await controller.login({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(200);
    });
  });
});
