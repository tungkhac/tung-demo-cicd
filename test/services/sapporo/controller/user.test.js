// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("sapporo/user", () => {
  const mockResponse = (
    statusMock,
    jsonMock = undefined,
    redirectMock = undefined
  ) => {
    const res = {
      status: (code) => {
        statusMock(code);
        return res;
      },
      json: jsonMock ? jsonMock : jest.fn(),
      send: jest.fn(),
      redirect: redirectMock ? redirectMock : jest.fn(),
    };
    return res;
  };
  beforeEach(() => {
    jest.resetModules();
  });
  /* prettier-ignore */
  const operatorOne = {
    "合言葉": "test",
    ID: "test",
    pw: "test",
    name: "test",
    "メールアドレス": "test",
    lineWorkUrl: "test",
  };
  /* prettier-ignore */
  const operatorTwo = {
    "合言葉": "test2",
    ID: "test2",
    name: "test2",
    "メールアドレス": "test2",
    lineWorkUrl: "test2",
  };
  class GoogleSpreadsheet {
    constructor() {}
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
  class GoogleSpreadsheetWithError {
    constructor() {}
    useServiceAccountAuth() {}
    loadInfo() {
      throw new Error("Error");
    }
    get sheetsByIndex() {
      return [
        {
          getRows: () => [operatorOne, operatorTwo],
        },
      ];
    }
  }
  const mockGoogleSpreadsheet = () => {
    jest.doMock("google-spreadsheet", () => {
      return {
        GoogleSpreadsheet,
      };
    });
  };

  describe("/register", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid input", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      mockGoogleSpreadsheet();
      const {
        register,
      } = require("../../../../services/sapporo/controller/user");
      await register(
        {
          body: {},
        },
        mockResponse(statusMock)
      );
      expect(statusMock).toHaveBeenCalledWith(500);
    });

    const request = {
      body: {
        line_cpid: "test",
        user_id: "test",
        name: "test",
        prefectures: "test",
        municipality: "test",
        phone_number: "test",
        barrel_handled: "test",
        operator_pw: "test",
      },
    };

    test("operator not found", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            find: () => {
              return [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const {
        register,
      } = require("../../../../services/sapporo/controller/user");
      await register(
        { body: { ...request.body, operator_pw: "not-found" } },
        mockResponse(statusMock)
      );
      expect(statusMock).toHaveBeenCalledWith(500);
    });

    test("UserProfile not found", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const {
        register,
      } = require("../../../../services/sapporo/controller/user");
      await register(request, mockResponse(statusMock));
      expect(statusMock).toHaveBeenCalledWith(500);
    });

    test("invalid configuration", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            find: () => {
              return [];
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const {
        register,
      } = require("../../../../services/sapporo/controller/user");
      await register(request, mockResponse(statusMock));
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    test("operator not found", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            find: () => {
              return [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const {
        register,
      } = require("../../../../services/sapporo/controller/user");
      await register(request, mockResponse(statusMock));
      expect(statusMock).toHaveBeenCalledWith(500);
    });

    test("update user's variables", async () => {
      const statusMock = jest.fn();
      const updateMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            find: () => {
              return [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
            },
          },
          MessageVariable: {
            updateOne: () => {
              updateMock();
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const {
        register,
      } = require("../../../../services/sapporo/controller/user");
      await register(request, mockResponse(statusMock));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(updateMock).toHaveBeenCalled();
    });
  });

  describe("/update", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid input", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      mockGoogleSpreadsheet();
      const {
        update,
      } = require("../../../../services/sapporo/controller/user");
      await update(
        {
          body: {},
        },
        mockResponse(statusMock)
      );
      expect(statusMock).toHaveBeenCalledWith(500);
    });

    const request = {
      body: {
        line_cpid: "test",
        user_id: "test",
        name: "test",
        prefectures: "test",
        municipality: "test",
        phone_number: "test",
        barrel_handled: "test",
        operator_pw: "test",
        company_name: "test",
        restaurant: "test",
      },
    };

    test("handle error", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      mockGoogleSpreadsheet();
      const {
        update,
      } = require("../../../../services/sapporo/controller/user");
      await update(request, mockResponse(statusMock));
      expect(statusMock).toHaveBeenCalledWith(500);
    });

    test("UserProfile not found", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const {
        update,
      } = require("../../../../services/sapporo/controller/user");
      await update(request, mockResponse(statusMock));
      expect(statusMock).toHaveBeenCalledWith(500);
    });

    test("invalid configuration", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            find: () => {
              return [];
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const {
        register,
      } = require("../../../../services/sapporo/controller/user");
      await register(request, mockResponse(statusMock));
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    test("update user's variables", async () => {
      const statusMock = jest.fn();
      const updateMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            find: () => {
              return [{}, {}, {}, {}, {}, {}, {}, {}];
            },
          },
          MessageVariable: {
            updateOne: () => {
              updateMock();
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const {
        update,
      } = require("../../../../services/sapporo/controller/user");
      await update(request, mockResponse(statusMock));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(updateMock).toHaveBeenCalled();
    });
  });

  describe("/unsubscribe", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    const request = {
      body: {
        user_id: "test",
      },
    };

    test("invalid input", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      const {
        unsubscribe,
      } = require("../../../../services/sapporo/controller/user");
      await unsubscribe(
        {
          body: {},
        },
        mockResponse(statusMock)
      );
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    test("UserProfile not found", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      const {
        unsubscribe,
      } = require("../../../../services/sapporo/controller/user");
      await unsubscribe(request, mockResponse(statusMock));
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    test("invalid configuration", async () => {
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            findOne: () => {
              return null;
            },
          },
        };
      });
      const {
        unsubscribe,
      } = require("../../../../services/sapporo/controller/user");
      await unsubscribe(request, mockResponse(statusMock));
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    test("update unsubscribeFlag", async () => {
      const updateMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            findOne: () => {
              return { _id: "test" };
            },
            find: () => {
              return [];
            },
          },
          MessageVariable: {
            updateOne: () => {
              updateMock();
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const {
        unsubscribe,
      } = require("../../../../services/sapporo/controller/user");
      await unsubscribe(request, mockResponse());
      expect(updateMock).toHaveBeenCalled();
    });

    test("send mail to operator", async () => {
      const updateMock = jest.fn();
      const statusMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            findOne: () => {
              return { _id: "test" };
            },
            find: () => {
              return [
                { _id: "name", variable_name: "氏名" },
                { _id: "operator_id", variable_name: "担当者ID" },
                { _id: "store_name", variable_name: "販売店" },
              ];
            },
          },
          Menu: {
            findOne: () => {
              return { richMenuId: "test" };
            },
          },
          MessageVariable: {
            updateOne: () => {
              updateMock();
            },
            find: () => {
              return [
                { variable_id: "name", variable_value: "test" },
                { variable_id: "operator_id", variable_value: "test" },
                { variable_id: "store_name", variable_value: "test" },
              ];
            },
          },
        };
      });
      mockGoogleSpreadsheet();
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
      const {
        unsubscribe,
      } = require("../../../../services/sapporo/controller/user");
      await unsubscribe(request, mockResponse(statusMock));
      expect(updateMock).toHaveBeenCalled();
      expect(mock).toHaveBeenCalled();
    });
  });

  describe("/sync", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid input", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      mockGoogleSpreadsheet();
      const { sync } = require("../../../../services/sapporo/controller/user");
      await sync(
        {
          body: {},
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ registered: "0" });
    });

    test("EfoUserProfile not found", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          EfoUserProfile: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const { sync } = require("../../../../services/sapporo/controller/user");
      await sync(
        {
          body: {
            line_cpid: "test",
            liff_user_id: "test",
            cpid: "test",
            user_id: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ registered: "0" });
    });

    test("UserProfile not found", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          EfoUserProfile: {
            findOne: () => {
              return {};
            },
          },
          UserProfile: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const { sync } = require("../../../../services/sapporo/controller/user");
      await sync(
        {
          body: {
            line_cpid: "test",
            liff_user_id: "test",
            cpid: "test",
            user_id: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ registered: "0" });
    });

    test("Variable not found", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          EfoUserProfile: {
            findOne: () => {
              return {};
            },
          },
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            findOne: () => {
              return undefined;
            },
            find: () => {
              return undefined;
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const { sync } = require("../../../../services/sapporo/controller/user");
      await sync(
        {
          body: {
            line_cpid: "test",
            liff_user_id: "test",
            cpid: "test",
            user_id: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ registered: "0" });
    });

    test("user was denied", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          EfoUserProfile: {
            findOne: () => {
              return {};
            },
          },
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            findOne: () => {
              return { variable_id: "test" };
            },
          },
          MessageVariable: {
            findOne: () => {
              return { variable_value: 9 };
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const { sync } = require("../../../../services/sapporo/controller/user");
      await sync(
        {
          body: {
            line_cpid: "test",
            liff_user_id: "test",
            cpid: "test",
            user_id: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ registered: "0" });
    });

    test("user found with no information", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          EfoUserProfile: {
            findOne: () => {
              return {};
            },
          },
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            findOne: () => {
              return { variable_id: "test" };
            },
            find: () => {
              return [
                { variable_id: "test1", variable_name: "氏名" },
                { variable_id: "test2", variable_name: "販売店" },
                { variable_id: "test3", variable_name: "都道府県" },
                { variable_id: "test4", variable_name: "市区町村" },
                { variable_id: "test5", variable_name: "電話番号" },
                { variable_id: "test6", variable_name: "取り扱い樽生ビール" },
                { variable_id: "test7", variable_name: "会社名" },
                { variable_id: "test8", variable_name: "取引酒飯店" },
              ];
            },
          },
          MessageVariable: {
            findOne: () => {
              return { variable_value: 1 };
            },
            find: () => {
              return undefined;
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const { sync } = require("../../../../services/sapporo/controller/user");
      await sync(
        {
          body: {
            line_cpid: "test",
            liff_user_id: "test",
            cpid: "test",
            user_id: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ registered: "0" });
    });

    test("user found with information", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          EfoUserProfile: {
            findOne: () => {
              return {};
            },
          },
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            findOne: () => {
              return { variable_id: "test" };
            },
            find: () => {
              return [
                { _id: "test1", variable_name: "氏名" },
                { _id: "test2", variable_name: "販売店" },
                { _id: "test3", variable_name: "都道府県" },
                { _id: "test4", variable_name: "市区町村" },
                { _id: "test5", variable_name: "電話番号" },
                { _id: "test6", variable_name: "取り扱い樽生ビール" },
                { _id: "test7", variable_name: "会社名" },
                { _id: "test8", variable_name: "取引酒飯店" },
              ];
            },
          },
          MessageVariable: {
            findOne: () => {
              return { variable_value: 1 };
            },
            find: () => {
              return [
                { variable_id: "test1", variable_value: "test" },
                { variable_id: "test2", variable_value: "test" },
                { variable_id: "test3", variable_value: "test" },
                { variable_id: "test4", variable_value: "test" },
                { variable_id: "test5", variable_value: "test" },
                { variable_id: "test6", variable_value: "test" },
                { variable_id: "test7", variable_value: "test" },
                { variable_id: "test8", variable_value: "test" },
              ];
            },
          },
        };
      });
      mockGoogleSpreadsheet();
      const { sync } = require("../../../../services/sapporo/controller/user");
      await sync(
        {
          body: {
            line_cpid: "test",
            liff_user_id: "test",
            cpid: "test",
            user_id: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      /* prettier-ignore */
      expect(jsonMock).toHaveBeenCalledWith({
        registered: "1",
        "会社名": "test",
        "取り扱い樽生ビール": "test",
        "取引酒飯店": "test",
        "市区町村": "test",
        "氏名": "test",
        "販売店": "test",
        "都道府県": "test",
        "電話番号": "test",
      });
    });
  });
});
