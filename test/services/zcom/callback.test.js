// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("zcom/callback", () => {
  const mockResponse = (
    status,
    json = undefined,
    render = undefined,
    redirect = undefined
  ) => {
    const statusFunc = status ? status : jest.fn();
    const jsonFunc = json ? json : jest.fn();
    const renderFunc = render ? render : jest.fn();
    const redirectFunc = redirect ? redirect : jest.fn();
    const res = {
      status: (code) => {
        statusFunc(code);
        return res;
      },
      json: jsonFunc,
      render: renderFunc,
      redirect: redirectFunc,
    };
    return res;
  };

  const mockModel = () =>
    jest.doMock("../../../model", () => {
      return {};
    });

  describe("zcom/back", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid order_number", async () => {
      mockModel();
      const { back } = require("../../../services/zcom/controller/callback");
      const render = jest.fn();
      await back({ query: {} }, mockResponse(null, null, render));
      expect(render).toHaveBeenCalled();
    });

    test("no ZComPayment found", async () => {
      jest.doMock("../../../model", () => {
        return {
          ZCOMPayment: {
            findOne: () => {
              return {};
            },
          },
        };
      });
      const { back } = require("../../../services/zcom/controller/callback");
      const render = jest.fn();
      await back(
        { query: { order_number: "test" } },
        mockResponse(null, null, render)
      );
      expect(render).toHaveBeenCalled();
    });

    test("invalid current_url", async () => {
      jest.doMock("../../../model", () => {
        return {
          ZCOMPayment: {
            findOne: () => {
              return {
                user_id: "test",
                connect_page_id: "test",
              };
            },
          },
          EfoUserProfile: {
            findOne: () => {
              return {
                lean: () => {
                  return { user_id: "test" };
                },
              };
            },
          },
        };
      });
      const { back } = require("../../../services/zcom/controller/callback");
      const render = jest.fn();
      await back(
        { query: { order_number: "test" } },
        mockResponse(null, null, render)
      );
      expect(render).toHaveBeenCalled();
    });

    test("valid current_url", async () => {
      jest.doMock("../../../model", () => {
        return {
          ZCOMPayment: {
            findOne: () => {
              return {
                user_id: "test",
                connect_page_id: "test",
              };
            },
          },
          EfoUserProfile: {
            findOne: () => {
              return {
                lean: () => {
                  return { user_id: "test", current_url: "test" };
                },
              };
            },
          },
        };
      });
      const { back } = require("../../../services/zcom/controller/callback");
      const redirect = jest.fn();
      await back(
        { query: { order_number: "test" } },
        mockResponse(null, null, null, redirect)
      );
      expect(redirect).toHaveBeenCalled();
    });
  });

  describe("zcom/error", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid order_number", async () => {
      mockModel();
      const { error } = require("../../../services/zcom/controller/callback");
      const render = jest.fn();
      await error({ query: {} }, mockResponse(null, null, render));
      expect(render).toHaveBeenCalled();
    });

    test("invalid current_url", async () => {
      jest.doMock("../../../model", () => {
        return {
          ZCOMPayment: {
            findOne: () => {
              return {
                user_id: "test",
                connect_page_id: "test",
              };
            },
          },
          EfoUserProfile: {
            findOne: () => {
              return {
                lean: () => {
                  return { user_id: "test" };
                },
              };
            },
          },
        };
      });
      const { error } = require("../../../services/zcom/controller/callback");
      const render = jest.fn();
      await error(
        { query: { order_number: "test" } },
        mockResponse(null, null, render)
      );
      expect(render).toHaveBeenCalled();
    });

    test("valid current_url", async () => {
      jest.doMock("../../../model", () => {
        return {
          ZCOMPayment: {
            findOne: () => {
              return {
                user_id: "test",
                connect_page_id: "test",
              };
            },
          },
          EfoUserProfile: {
            findOne: () => {
              return {
                lean: () => {
                  return { user_id: "test", current_url: "http://test.com" };
                },
              };
            },
          },
        };
      });
      const { error } = require("../../../services/zcom/controller/callback");
      const redirect = jest.fn();
      await error(
        { query: { order_number: "test" } },
        mockResponse(null, null, null, redirect)
      );
      expect(redirect).toHaveBeenCalledWith("http://test.com/?zcom_error=1");
    });
  });

  describe("zcom/success", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid order_number", async () => {
      mockModel();
      const { success } = require("../../../services/zcom/controller/callback");
      const render = jest.fn();
      await success({ query: {} }, mockResponse(null, null, render));
      expect(render).toHaveBeenCalled();
    });

    test("invalid current_url", async () => {
      jest.doMock("../../../model", () => {
        return {
          ZCOMPayment: {
            findOne: () => {
              return {
                user_id: "test",
                connect_page_id: "test",
              };
            },
          },
          EfoUserProfile: {
            findOne: () => {
              return {
                lean: () => {
                  return { user_id: "test" };
                },
              };
            },
          },
        };
      });
      const { success } = require("../../../services/zcom/controller/callback");
      const render = jest.fn();
      await success(
        { query: { order_number: "test" } },
        mockResponse(null, null, render)
      );
      expect(render).toHaveBeenCalled();
    });

    test("valid current_url", async () => {
      jest.doMock("../../../model", () => {
        return {
          ZCOMPayment: {
            findOne: () => {
              return {
                user_id: "test",
                connect_page_id: "test",
              };
            },
          },
          EfoUserProfile: {
            findOne: () => {
              return {
                lean: () => {
                  return { user_id: "test", current_url: "http://test.com" };
                },
              };
            },
          },
        };
      });
      const { success } = require("../../../services/zcom/controller/callback");
      const redirect = jest.fn();
      await success(
        { query: { order_number: "test" } },
        mockResponse(null, null, null, redirect)
      );
      expect(redirect).toHaveBeenCalledWith("http://test.com/?zcom_success=1");
    });
  });
});
