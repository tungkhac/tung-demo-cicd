// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("sapporo/common", () => {
  describe("sendMail", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("sendMail", async (done) => {
      const mock = jest.fn();
      jest.doMock("nodemailer", () => {
        return {
          createTransport: () => {
            return {
              sendMail: (param, callback) => {
                mock(param);
                if (callback) callback();
              },
            };
          },
        };
      });
      jest.doMock("../../../model", () => {
        return {};
      });
      const { sendMail } = require("../../../services/sapporo/common");
      await sendMail({ to: "test", cc: "test", subject: "test", html: "test" });
      setTimeout(() => {
        expect(mock).toHaveBeenCalledWith({
          cc: "test",
          from: "no-reply@botchan.chat",
          html: "test",
          subject: "test",
          to: "test",
        });
        done();
      }, 1000);
    });

    test("sendApprovalEmail", async (done) => {
      const mockFun = jest.fn();
      jest.doMock("nodemailer", () => {
        return {
          createTransport: () => {
            return {
              sendMail: (param, callback) => {
                mockFun(param);
                if (callback) callback();
              },
            };
          },
        };
      });
      jest.doMock("../../../model", () => {
        return {};
      });
      const { sendApprovalEmail } = require("../../../services/sapporo/common");
      await sendApprovalEmail({ to: "test", user_id: "test" });
      await sendApprovalEmail({
        to: "test",
        user_id: "test",
        isReminder: true,
      });
      setTimeout(() => {
        expect(mockFun.mock.calls.length).toEqual(2);
        done();
      }, 1000);
    });

    test("sendReminderUsersEmail", async (done) => {
      const mockFun = jest.fn();
      jest.doMock("nodemailer", () => {
        return {
          createTransport: () => {
            return {
              sendMail: (param, callback) => {
                mockFun(param);
                if (callback) callback();
              },
            };
          },
        };
      });
      jest.doMock("../../../model", () => {
        return {};
      });
      const {
        sendReminderUsersEmail,
      } = require("../../../services/sapporo/common");
      await sendReminderUsersEmail({
        to: "test",
        users: [
          { user_id: "test", store_name: "test" },
          { user_id: "test2" },
          { user_id: "test3" },
        ],
      });
      setTimeout(() => {
        expect(mockFun).toHaveBeenCalled();
        done();
      }, 1000);
    });
  });

  describe("operators", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    /* prettier-ignore */
    const operatorOne = {
      "ID": "test",
      "合言葉": "test",
      "社員名称": "test",
      "メールアドレス": "test",
      "招待コード": "test",
    };
    /* prettier-ignore */
    const operatorTwo = {
      "ID": "test2",
      "合言葉": "test2",
      "社員名称": "test2",
      "メールアドレス": "test2",
      "招待コード": "test2",
    };
    class GoogleSpreadsheet {
      constructor() {}
      save(callback) {
        callback();
      }
      useServiceAccountAuth() {}
      loadInfo() {}
      get sheetsByIndex() {
        return [
          {
            getRows: () => [operatorOne, operatorTwo],
          },
        ];
      }
    }

    test("getAllOperators", async () => {
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      jest.doMock("../../../model", () => {
        return {};
      });
      const { getAllOperators } = require("../../../services/sapporo/common");
      const operators = await getAllOperators();
      expect(operators).toEqual([
        {
          email: "test",
          id: "test",
          lineWorkUrl: "test",
          name: "test",
          pw: "test",
        },
        {
          email: "test2",
          id: "test2",
          lineWorkUrl: "test2",
          name: "test2",
          pw: "test2",
        },
      ]);
    });

    test("getOperatorByPw", async () => {
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      jest.doMock("../../../model", () => {
        return {};
      });
      const { getOperatorByPw } = require("../../../services/sapporo/common");
      let operator = await getOperatorByPw("test");
      expect(operator).toEqual({
        email: "test",
        id: "test",
        lineWorkUrl: "test",
        name: "test",
        pw: "test",
      });
      operator = await getOperatorByPw("test2");
      expect(operator).toEqual({
        email: "test2",
        id: "test2",
        lineWorkUrl: "test2",
        name: "test2",
        pw: "test2",
      });
      operator = await getOperatorByPw("");
      expect(operator).toEqual(undefined);
    });

    test("getOperatorById", async () => {
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      jest.doMock("../../../model", () => {
        return {};
      });
      const { getOperatorById } = require("../../../services/sapporo/common");
      let operator = await getOperatorById("test");
      expect(operator.id).toEqual("test");
      operator = await getOperatorById("test2");
      expect(operator.id).toEqual("test2");
      operator = await getOperatorById("");
      expect(operator).toEqual(undefined);
    });

    test("checkExistedOperator", async () => {
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      jest.doMock("../../../model", () => {
        return {};
      });
      const {
        checkExistedOperator,
      } = require("../../../services/sapporo/common");
      expect(await checkExistedOperator("")).toEqual(false);
      expect(await checkExistedOperator("test")).toEqual(true);
    });
  });

  describe("getAccessToken", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("return undefined if there is no page or channel_access_token", async () => {
      jest.doMock("../../../model", () => {
        return {
          ConnectPage: {
            findOne: () => {},
          },
        };
      });
      const { getAccessToken } = require("../../../services/sapporo/common");
      const token = await getAccessToken({ connect_page_id: "test" });
      expect(token).toEqual(undefined);
    });

    test("return token", async () => {
      jest.doMock("../../../model", () => {
        return {
          ConnectPage: {
            findOne: () => {
              return { channel_access_token: "test" };
            },
          },
        };
      });
      const { getAccessToken } = require("../../../services/sapporo/common");
      const token = await getAccessToken({ connect_page_id: "test" });
      expect(token).toEqual("test");
    });
  });

  describe("setLineMenuToUser", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid input", async (done) => {
      jest.doMock("../../../model", () => {
        return {};
      });
      const mockFunc = jest.fn();
      const requestFunc = (param, callback) => {
        mockFunc();
        callback(undefined, "test", "test");
      };
      jest.doMock("request", () => {
        return requestFunc;
      });
      const { setLineMenuToUser } = require("../../../services/sapporo/common");
      await setLineMenuToUser({ connect_page_id: "test", user_id: "test" });
      setTimeout(() => {
        expect(mockFunc).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    test("no token found", async (done) => {
      jest.doMock("../../../model", () => {
        return {
          ConnectPage: {
            findOne: () => {
              return {};
            },
          },
        };
      });
      const mockFunc = jest.fn();
      const requestFunc = (param, callback) => {
        mockFunc();
        callback(undefined, "test", "test");
      };
      jest.doMock("request", () => {
        return requestFunc;
      });
      const { setLineMenuToUser } = require("../../../services/sapporo/common");
      await setLineMenuToUser({
        connect_page_id: "test",
        user_id: "test",
        rich_menu_id: "test",
      });
      setTimeout(() => {
        expect(mockFunc).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    test("call request to line api", async (done) => {
      jest.doMock("../../../model", () => {
        return {
          ConnectPage: {
            findOne: () => {
              return { channel_access_token: "test" };
            },
          },
        };
      });
      const mockFunc = jest.fn();
      const requestFunc = (param, callback) => {
        mockFunc();
        callback(undefined, "test", "test");
      };
      jest.doMock("request", () => {
        return requestFunc;
      });
      const { setLineMenuToUser } = require("../../../services/sapporo/common");
      await setLineMenuToUser({
        connect_page_id: "test",
        user_id: "test",
        rich_menu_id: "test",
      });
      setTimeout(() => {
        expect(mockFunc).toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe("sendLineMessage", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid input", async (done) => {
      jest.doMock("../../../model", () => {
        return {};
      });
      const mockFunc = jest.fn();
      const requestFunc = (param, callback) => {
        mockFunc();
        callback(undefined, "test", "test");
      };
      jest.doMock("request", () => {
        return requestFunc;
      });
      const {
        sendApprovalMessage,
      } = require("../../../services/sapporo/common");
      await sendApprovalMessage({ users: ["test"] });
      setTimeout(() => {
        expect(mockFunc).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    test("no token found", async (done) => {
      jest.doMock("../../../model", () => {
        return {
          ConnectPage: {
            findOne: () => {
              return {};
            },
          },
        };
      });
      const mockFunc = jest.fn();
      const requestFunc = (param, callback) => {
        mockFunc();
        callback(undefined, "test", "test");
      };
      jest.doMock("request", () => {
        return requestFunc;
      });
      const {
        sendApprovalMessage,
      } = require("../../../services/sapporo/common");
      await sendApprovalMessage({
        users: ["test"],
        connect_page_id: "test",
      });
      setTimeout(() => {
        expect(mockFunc).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    test("call request to line api", async (done) => {
      jest.doMock("../../../model", () => {
        return {
          ConnectPage: {
            findOne: () => {
              return { channel_access_token: "test" };
            },
          },
        };
      });
      const mockFunc = jest.fn();
      const requestFunc = (param, callback) => {
        mockFunc();
        callback(undefined, "test", "test");
      };
      jest.doMock("request", () => {
        return requestFunc;
      });
      const {
        sendApprovalMessage,
      } = require("../../../services/sapporo/common");
      await sendApprovalMessage({
        connect_page_id: "test",
        users: ["test"],
      });
      setTimeout(() => {
        expect(mockFunc).toHaveBeenCalled();
        done();
      }, 100);
    });

    test("sendDeniedMessage", async (done) => {
      jest.doMock("../../../model", () => {
        return {
          ConnectPage: {
            findOne: () => {
              return { channel_access_token: "test" };
            },
          },
        };
      });
      const mockFunc = jest.fn();
      const requestFunc = (param, callback) => {
        mockFunc();
        callback(undefined, "test", "test");
      };
      jest.doMock("request", () => {
        return requestFunc;
      });
      const { sendDeniedMessage } = require("../../../services/sapporo/common");
      await sendDeniedMessage({
        connect_page_id: "test",
        users: ["test"],
      });
      setTimeout(() => {
        expect(mockFunc).toHaveBeenCalled();
        done();
      }, 100);
    });
  });

  describe("getVariableByName", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid input", async () => {
      jest.doMock("../../../model", () => {
        return {};
      });
      const { getVariableByName } = require("../../../services/sapporo/common");
      expect(await getVariableByName({ variable_name: "" })).toEqual();
    });

    test("no variable found", async () => {
      jest.doMock("../../../model", () => {
        return {
          Variable: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      const { getVariableByName } = require("../../../services/sapporo/common");
      expect(await getVariableByName({ variable_name: "test" })).toEqual();
    });

    test("variable found", async () => {
      jest.doMock("../../../model", () => {
        return {
          Variable: {
            findOne: () => {
              return "test";
            },
          },
        };
      });
      const { getVariableByName } = require("../../../services/sapporo/common");
      expect(await getVariableByName({ variable_name: "test" })).toEqual(
        "test"
      );
    });
  });

  describe("saveToMessageVariable", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("call updateOne", async () => {
      const mockFunc = jest.fn();
      jest.doMock("../../../model", () => {
        return {
          MessageVariable: {
            updateOne: () => {
              mockFunc();
            },
          },
        };
      });
      const {
        saveToMessageVariable,
      } = require("../../../services/sapporo/common");
      await saveToMessageVariable({
        variable_id: "test",
        user_id: "test",
        connect_page_id: "test",
        variable_value: "test",
      });
      expect(mockFunc).toHaveBeenCalled();
    });
  });

  describe("getMenuIdByDefault", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("no menu found", async () => {
      jest.doMock("../../../model", () => {
        return {
          Menu: {
            findOne: () => {
              return null;
            },
          },
        };
      });
      const {
        getMenuIdByDefault,
      } = require("../../../services/sapporo/common");
      expect(await getMenuIdByDefault("test")).toEqual(undefined);
    });
    test("menu found", async () => {
      jest.doMock("../../../model", () => {
        return {
          Menu: {
            findOne: () => {
              return { richMenuId: "test" };
            },
          },
        };
      });
      const {
        getMenuIdByDefault,
      } = require("../../../services/sapporo/common");
      expect(await getMenuIdByDefault("test")).toEqual("test");
    });
  });

  describe("putLog", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("putLog", () => {
      const infoMock = jest.fn();
      const errorMock = jest.fn();
      jest.doMock("../../../model", () => {
        return {};
      });
      jest.doMock("log4js", () => {
        return {
          getLogger: () => {
            return {
              info: () => {
                infoMock();
              },
              error: () => {
                errorMock();
              },
            };
          },
        };
      });
      const { putLog } = require("../../../services/sapporo/common");
      putLog("test", "test");
      expect(infoMock).not.toHaveBeenCalled();
      expect(errorMock).not.toHaveBeenCalled();
      putLog("info", "test");
      expect(infoMock).toHaveBeenCalled();
      putLog("error", "test");
      expect(errorMock).toHaveBeenCalled();
    });
  });
});
