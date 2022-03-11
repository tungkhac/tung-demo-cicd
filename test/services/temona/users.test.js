// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("services/temona/users", () => {
  class PuppeteerException {
    constructor() {}
    save(callback) {
      callback();
    }
  }

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

  describe("/users/search", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        name: "name",
        email: "email",
        tel: "tel",
      },
    };
    const mockModel = () =>
      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOne: (options, callback) => {
              if (callback)
                return callback(undefined, { authentication_token: "test" });
              return { authentication_token: "test" };
            },
            findOneAndUpdate: () => {
              return { _id: "test" };
            },
          },
          PuppeteerException,
        };
      });

    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          PuppeteerException,
        };
      });
      const { searchUser } = require("../../../services/temona/controller");
      await searchUser({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("have no token", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          // ApiEfoEc: {
          //   findOne: (options, callback) => {
          //     if (callback) return callback(new Error("error"), undefined);
          //     else return undefined;
          //   },
          // },
          PuppeteerException,
        };
      });
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const { searchUser } = require("../../../services/temona/controller");
      await searchUser(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("error thrown while fetching", async (done) => {
      mockModel();
      const status = jest.fn();
      const json = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.reject(new Error("error")),
        };
      });
      const { searchUser } = require("../../../services/temona/controller");
      await searchUser(request, mockResponse(status, json));
      setTimeout(() => {
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({ login_value: 2 });
        done();
      }, 100);
    });

    test("no user found", async (done) => {
      const status = jest.fn();
      const json = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.resolve({}),
        };
      });
      mockModel();
      const { searchUser } = require("../../../services/temona/controller");
      await searchUser(request, mockResponse(status, json));
      setTimeout(() => {
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
          login_value: 2,
        });
        done();
      }, 100);
    });

    test("service get user has exception", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        let count = 0;
        return {
          get: () => {
            count += 1;
            if (count === 1) {
              return Promise.resolve({ data: { user_id: "user_id" } });
            } else {
              return Promise.reject(new Error("error"));
            }
          },
        };
      });
      mockModel();
      const { searchUser } = require("../../../services/temona/controller");
      await searchUser(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return user has no id", async (done) => {
      const status = jest.fn();
      const json = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.resolve({ data: {} }),
        };
      });
      mockModel();
      const { searchUser } = require("../../../services/temona/controller");
      await searchUser(request, mockResponse(status, json));
      setTimeout(() => {
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
          address: "",
          building_name: "",
          city: "",
          login_value: 2,
          state_name: "",
          zip_code: "",
        });
        done();
      }, 100);
    });

    test("return data", async (done) => {
      const mock = jest.fn();
      const json = jest.fn();

      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({ data: { access_token: "test" } }),
          get: () => Promise.resolve({ data: { id: 1 } }),
        };
      });
      mockModel();
      const { searchUser } = require("../../../services/temona/controller");
      await searchUser(request, mockResponse(mock, json));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
          address: "",
          building_name: "",
          city: "",
          id: 1,
          login_value: 1,
          state_name: "",
          zip_code: "",
        });
        done();
      }, 100);
    });
  });

  describe("/users/detail", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        user_login_id: "user_login_id",
        email: "email",
        password: "password",
        request_url: "request_url",
      },
    };
    const mockModel = () =>
      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOne: (options, callback) => {
              if (callback)
                return callback(undefined, { authentication_token: "test" });
              return { authentication_token: "test" };
            },
          },
          PuppeteerException,
        };
      });

    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          PuppeteerException,
        };
      });
      const {
        getCustomerDetail,
      } = require("../../../services/temona/controller");
      await getCustomerDetail({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("have no token", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          // ApiEfoEc: {
          //   findOne: (options, callback) => {
          //     if (callback) return callback(new Error("error"), undefined);
          //     else return undefined;
          //   },
          // },
          PuppeteerException,
        };
      });
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        getCustomerDetail,
      } = require("../../../services/temona/controller");
      await getCustomerDetail(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          get: () => Promise.reject(new Error("error")),
        };
      });
      mockModel();
      const {
        getCustomerDetail,
      } = require("../../../services/temona/controller");
      await getCustomerDetail(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("return data", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("access_tokens")) {
              return Promise.resolve({ data: { access_token: "test" } });
            }
            return Promise.resolve({ data: {} });
          },
          get: () =>
            Promise.resolve({
              data: { user_addresses: [{}], course_orders: [{}] },
            }),
        };
      });
      mockModel();
      const {
        getCustomerDetail,
      } = require("../../../services/temona/controller");
      await getCustomerDetail(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("/users/change_magazine_received_flag", () => {
    const request = {
      body: {
        cpid: "cpid",
        user_id: "user_id",
        client_id: "client_id",
        client_secret: "client_secret",
        user_login_id: "user_login_id",
        email: "email",
        password: "password",
        is_campaign_accepted: true,
      },
    };
    const mockModel = () =>
      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOne: (options, callback) => {
              if (callback)
                return callback(undefined, { authentication_token: "test" });
              return { authentication_token: "test" };
            },
          },
          PuppeteerException,
        };
      });

    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      const mock = jest.fn();
      mockModel();
      const {
        changeMagazineReceivedFlag,
      } = require("../../../services/temona/controller");
      await changeMagazineReceivedFlag({}, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(500);
    });

    test("have no token", async () => {
      const mock = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          ApiEfoEc: {
            findOne: (options, callback) => {
              if (callback) return callback(new Error("error"), undefined);
              else return undefined;
            },
          },
          PuppeteerException,
        };
      });
      const {
        changeMagazineReceivedFlag,
      } = require("../../../services/temona/controller");
      await changeMagazineReceivedFlag(request, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          get: () => Promise.reject(new Error("error")),
        };
      });
      mockModel();
      const {
        changeMagazineReceivedFlag,
      } = require("../../../services/temona/controller");
      await changeMagazineReceivedFlag(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(500);
        done();
      }, 100);
    });

    test("update magazine received flag success", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("access_tokens")) {
              return Promise.resolve({ data: { access_token: "test" } });
            }
            return Promise.resolve({
              data: {
                token: "test",
                user_token: "test",
                user_login_id: "test",
              },
            });
          },
          get: () =>
            Promise.resolve({
              data: { user_addresses: [{ is_default: true }] },
            }),
          patch: () => Promise.resolve({ data: {} }),
        };
      });
      mockModel();
      const {
        changeMagazineReceivedFlag,
      } = require("../../../services/temona/controller");
      await changeMagazineReceivedFlag(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });
});
