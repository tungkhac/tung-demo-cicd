// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("services/rakuraku/auth", () => {
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

  describe("/login", () => {
    const request = {
      body: {
        email: "email",
        password: "password",
        access_token: "access_token",
      },
    };
    beforeEach(() => {
      jest.resetModules();
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        login,
      } = require("../../../../services/rakuraku/controller/auth");
      await login(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(400);
        done();
      }, 100);
    });

    test("login failed", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({}),
        };
      });
      const {
        login,
      } = require("../../../../services/rakuraku/controller/auth");
      await login(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(400);
        done();
      }, 100);
    });

    test("auth response with no user information", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("login")) {
              return Promise.resolve({
                data: {
                  success: "ok",
                  response: {
                    session: {
                      customer_id: "test",
                    },
                  },
                },
              });
            }
            return Promise.reject(new Error("error"));
          },
        };
      });
      const {
        login,
      } = require("../../../../services/rakuraku/controller/auth");
      await login(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(400);
        done();
      }, 100);
    });

    test("login succeed", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("login")) {
              return Promise.resolve({
                data: {
                  success: "ok",
                  response: {
                    session: {
                      customer_id: "test",
                    },
                  },
                },
              });
            }
            return Promise.resolve({
              data: {
                success: "ok",
                response: {
                  customer: [
                    {
                      customer: "customer",
                    },
                  ],
                },
              },
            });
          },
        };
      });
      const {
        login,
      } = require("../../../../services/rakuraku/controller/auth");
      await login(request, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("checkExistedEmail", () => {
    const body = {
      mail: "mail",
      access_token: "access_token",
    };
    beforeEach(() => {
      jest.resetModules();
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      const mockJson = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        checkExistedEmail,
      } = require("../../../../services/rakuraku/controller/auth");
      await checkExistedEmail({ body }, mockResponse(mock, mockJson));
      setTimeout(() => {
        expect(mockJson).toHaveBeenCalledWith({
          status: "invalid",
          message: "error",
        });
        done();
      }, 100);
    });

    test("email is not existed", async (done) => {
      const mock = jest.fn();
      const mockJson = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.resolve({}),
        };
      });
      const {
        checkExistedEmail,
      } = require("../../../../services/rakuraku/controller/auth");
      await checkExistedEmail({ body: body }, mockResponse(mock, mockJson));
      setTimeout(() => {
        expect(mockJson).toHaveBeenCalledWith({
          status: "valid",
        });
        done();
      }, 100);
    });

    test("email existed", async (done) => {
      const mock = jest.fn();
      const mockJson = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              data: {
                success: "ok",
                response: {
                  customers: [
                    {
                      customer: "test",
                    },
                  ],
                },
              },
            }),
        };
      });
      const {
        checkExistedEmail,
      } = require("../../../../services/rakuraku/controller/auth");
      await checkExistedEmail({ body: body }, mockResponse(mock, mockJson));
      setTimeout(() => {
        expect(mockJson).toHaveBeenCalledWith({
          status: "invalid",
          message:
            "メールアドレスはすでに使われています。他のメールアドレスを入力してください。",
        });
        done();
      }, 100);
    });
  });

  describe("register", () => {
    const body = {
      first_name: "first_name",
      last_name: "last_name",
      zipcode: "zipcode",
      pref: "pref",
      city: "city",
      address: "address",
      phone_number: "phone_number",
      mail: "mail",
      access_token: "access_token",
      furigana_first: "furigana_first",
      furigana_last: "furigana_last",
      password: "password",
    };
    beforeEach(() => {
      jest.resetModules();
    });
    test("request is invalid", async (done) => {
      const mock = jest.fn();
      const {
        register,
      } = require("../../../../services/rakuraku/controller/auth");
      await register({ body: {} }, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(400);
        done();
      }, 100);
    });

    test("error thrown while fetching", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        register,
      } = require("../../../../services/rakuraku/controller/auth");
      await register({ body: body }, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(400);
        done();
      }, 100);
    });

    test("check email is existed", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("customers/search")) {
              return Promise.resolve({
                data: {
                  errors: "error",
                },
              });
            }
          },
        };
      });
      const {
        register,
      } = require("../../../../services/rakuraku/controller/auth");
      await register({ body: body }, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(400);
        done();
      }, 100);
    });

    test("register failed", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("customers/search")) {
              return Promise.resolve({
                data: {
                  success: "ok",
                  response: {
                    customer: [
                      {
                        customer: "customer",
                      },
                    ],
                  },
                },
              });
            }
            return Promise.resolve({
              data: {
                error_message: "error_message",
              },
            });
          },
        };
      });
      const {
        register,
      } = require("../../../../services/rakuraku/controller/auth");
      await register({ body: body }, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(400);
        done();
      }, 100);
    });

    test("register success", async (done) => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("customers/search")) {
              return Promise.resolve({
                data: {
                  success: "ok",
                  response: {
                    customer: [
                      {
                        customer: "customer",
                      },
                    ],
                  },
                },
              });
            }
            return Promise.resolve({
              data: {
                response: {
                  customers: [
                    {
                      log_info: "log_info",
                      result: 1,
                      id: "id",
                    },
                  ],
                },
              },
            });
          },
        };
      });
      const {
        register,
      } = require("../../../../services/rakuraku/controller/auth");
      await register({ body: body }, mockResponse(mock));
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });

  describe("getAccessToken", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    const body = {
      client_id: "client_id",
      client_secret: "client_secret",
      code: "code",
      grant_type: "grant_type",
    };

    test("error thrown while fetching", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        getAccessToken,
      } = require("../../../../services/rakuraku/controller/auth");
      await getAccessToken({ body: body }, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("get access token failed", async () => {
      const mock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              status: "test",
            }),
        };
      });
      const {
        getAccessToken,
      } = require("../../../../services/rakuraku/controller/auth");
      await getAccessToken({ body }, mockResponse(mock));
      expect(mock).toHaveBeenCalledWith(400);
    });

    test("get access token succeed", async () => {
      const mock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("axios", () => {
        return {
          post: () =>
            Promise.resolve({
              status: 200,
              data: {
                access_token: "access_token",
              },
            }),
        };
      });
      const {
        getAccessToken,
      } = require("../../../../services/rakuraku/controller/auth");
      await getAccessToken({ body }, mockResponse(mock, jsonMock));
      expect(jsonMock).toHaveBeenCalledWith({
        access_token: "access_token",
      });
    });
  });

  describe("updateCustomer", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("request is invalid", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        updateCustomer,
      } = require("../../../../services/rakuraku/controller/auth");
      try {
        await updateCustomer();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test("error thrown while fetching", async () => {
      jest.doMock("axios", () => {
        return {
          post: () => Promise.reject(new Error("error")),
        };
      });
      const {
        updateCustomer,
      } = require("../../../../services/rakuraku/controller/auth");
      try {
        await updateCustomer("test", "test", "test");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test("check email is existed", async () => {
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("customers/search")) {
              return Promise.resolve({
                data: {
                  errors: "error",
                },
              });
            }
          },
        };
      });
      const {
        updateCustomer,
      } = require("../../../../services/rakuraku/controller/auth");
      try {
        await updateCustomer("test", "test", "test");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test("has no data", async () => {
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("customers/search")) {
              return Promise.resolve({
                data: {
                  success: "ok",
                  response: {
                    customers: [
                      {
                        customer: "customer",
                      },
                    ],
                  },
                },
              });
            }
            if (url && url.endsWith && url.endsWith("customers/update")) {
              return Promise.resolve({});
            }
            return Promise.resolve({
              data: {
                response: {
                  customers: [
                    {
                      log_info: "log_info",
                      result: 1,
                      id: "id",
                    },
                  ],
                },
              },
            });
          },
        };
      });
      const {
        updateCustomer,
      } = require("../../../../services/rakuraku/controller/auth");
      try {
        await updateCustomer("test", "test", "test");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test("update customer information failed", async () => {
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("customers/search")) {
              return Promise.resolve({
                data: {
                  success: "ok",
                  response: {
                    customers: [
                      {
                        customer: "customer",
                      },
                    ],
                  },
                },
              });
            }
            return Promise.resolve({
              data: {
                response: {
                  customers: [
                    {
                      log_info: "log_info",
                      result: 0,
                      id: "id",
                    },
                  ],
                },
              },
            });
          },
        };
      });
      const {
        updateCustomer,
      } = require("../../../../services/rakuraku/controller/auth");
      try {
        await updateCustomer("test", "test", "test");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test("update successfully", async (done) => {
      jest.doMock("axios", () => {
        return {
          post: (url) => {
            if (url && url.endsWith && url.endsWith("customers/search")) {
              return Promise.resolve({
                data: {
                  success: "ok",
                  response: {
                    customers: [
                      {
                        customer: "customer",
                      },
                    ],
                  },
                },
              });
            }
            return Promise.resolve({
              data: {
                response: {
                  customers: [
                    {
                      log_info: "log_info",
                      result: 1,
                      id: "id",
                    },
                  ],
                },
              },
            });
          },
        };
      });
      const {
        updateCustomer,
      } = require("../../../../services/rakuraku/controller/auth");
      const result = await updateCustomer("test", "test", "test");
      setTimeout(() => {
        expect(result).toEqual(true);
        done();
      }, 100);
    });
  });
});
