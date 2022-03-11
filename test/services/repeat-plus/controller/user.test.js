// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("repeat-plus/user", () => {
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

  describe("repeat-plus/user/register", () => {
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
      const controller = require("../../../../services/repeat-plus/controller/user");
      await controller.register({}, mockResponse(mock));
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
      const controller = require("../../../../services/repeat-plus/controller/user");
      await controller.register(
        { body: { birth: "test" } },
        mockResponse(mock)
      );
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
      const controller = require("../../../../services/repeat-plus/controller/user");
      await controller.register({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(200);
    });
  });

  describe("repeat-plus/user/verifyEmail", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("request with error", async () => {
      const mock = jest.fn();
      const json = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        verifyEmail,
      } = require("../../../../services/repeat-plus/controller/user");
      await verifyEmail({}, mockResponse(mock, json));
      expect(json).toHaveBeenCalledWith({ status: "valid" });
    });

    test("not existed user", async () => {
      const mock = jest.fn();
      const json = jest.fn();
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
      const {
        verifyEmail,
      } = require("../../../../services/repeat-plus/controller/user");
      await verifyEmail({}, mockResponse(mock, json));
      expect(json).toHaveBeenCalledWith({ status: "valid" });
    });

    test("request with error from repeat-plus", async () => {
      const mock = jest.fn();
      const json = jest.fn();

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
        verifyEmail,
      } = require("../../../../services/repeat-plus/controller/user");
      await verifyEmail({ body: { birth: "test" } }, mockResponse(mock, json));
      expect(json).toHaveBeenCalledWith({ status: "valid" });
    });

    test("user existed", async () => {
      const mock = jest.fn();
      const json = jest.fn();
      const message = "mail_addr:E03-3032";
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.reject({
              response: { data: { data: ["test", message] } },
            }),
        };
      });
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        verifyEmail,
      } = require("../../../../services/repeat-plus/controller/user");
      await verifyEmail({ body: { birth: "test" } }, mockResponse(mock, json));
      expect(json).toHaveBeenCalledWith({ status: "invalid", message });
    });
  });
});
