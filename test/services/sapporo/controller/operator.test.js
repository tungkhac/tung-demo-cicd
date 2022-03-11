// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("sapporo/operator", () => {
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
      render: jest.fn(),
      redirect: redirectMock ? redirectMock : jest.fn(),
    };
    return res;
  };
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
    "所属名称": "test",
    "氏名": "test",
  };
  /* prettier-ignore */
  const operatorTwo = {
    "ID": "test2",
    "合言葉": "test2",
    "社員名称": "test2",
    "メールアドレス": "test2",
    "招待コード": "test2",
  };
  /* prettier-ignore */
  const operatorThree = {
    "ID": "",
    "合言葉": "test3",
    "社員名称": "",
    "メールアドレス": "",
    "招待コード": "",
    "所属名称": "",
    "氏名": "",
  };
  class GoogleSpreadsheet {
    constructor() {}
    useServiceAccountAuth() {}
    loadInfo() {}
    get sheetsByIndex() {
      return [
        {
          getRows: () => [operatorOne, operatorTwo, operatorThree],
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

  describe("/validate", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("has valid operator", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      const {
        validate,
      } = require("../../../../services/sapporo/controller/operator");
      await validate(
        {
          body: {
            operator_pwd: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({ status: "valid" });
    });

    test("error thrown while processing", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet: GoogleSpreadsheetWithError,
        };
      });
      const {
        validate,
      } = require("../../../../services/sapporo/controller/operator");
      await validate(
        {
          body: {
            operator_pwd: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        message: expect.any(String),
        status: "invalid",
      });
    });

    test("no operator found", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {};
      });
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      const {
        validate,
      } = require("../../../../services/sapporo/controller/operator");
      await validate(
        {
          body: {
            operator_pwd: "not-found",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        message: expect.any(String),
        status: "invalid",
      });
    });
  });

  describe("/contact", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("invalid input", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      const {
        contact,
      } = require("../../../../services/sapporo/controller/operator");
      await contact(
        {
          query: {},
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(404);
    });

    test("no user found", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      const {
        contact,
      } = require("../../../../services/sapporo/controller/operator");
      await contact(
        {
          query: {
            user_id: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(404);
    });

    test("invalid configuration", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      const {
        contact,
      } = require("../../../../services/sapporo/controller/operator");
      await contact(
        {
          query: {
            user_id: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(404);
    });

    test("invalid operator_id value", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
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
          },
          MessageVariable: {
            findOne: () => {
              return { variable_value: "" };
            },
          },
        };
      });
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      const {
        contact,
      } = require("../../../../services/sapporo/controller/operator");
      await contact(
        {
          query: {
            user_id: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(statusMock).toHaveBeenCalledWith(404);
    });

    test("operator_id value", async () => {
      const statusMock = jest.fn();
      const redirectMock = jest.fn();
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
          },
          MessageVariable: {
            findOne: () => {
              return { variable_value: "test2" };
            },
          },
        };
      });
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      const {
        contact,
      } = require("../../../../services/sapporo/controller/operator");
      await contact(
        {
          query: {
            user_id: "test",
          },
        },
        mockResponse(statusMock, undefined, redirectMock)
      );
      expect(redirectMock).toHaveBeenCalledWith("test2");
    });
  });

  describe("/approve", () => {
    beforeEach(() => {
      jest.resetModules();
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
              return undefined;
            },
          },
        };
      });

      const {
        approve,
      } = require("../../../../services/sapporo/controller/operator");
      await approve(
        {
          query: {
            user_id: "test",
          },
        },
        mockResponse(statusMock)
      );
      expect(statusMock).not.toHaveBeenCalled();
    });

    test("user was approved", async () => {
      const statusMock = jest.fn();
      const renderMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            findOne: (query) => {
              if (query && query.variable_name == "氏名") {
                return null;
              }
              return { _id: "test" };
            },
          },
          MessageVariable: {
            findOne: () => {
              return { variable_value: 1 };
            },
            updateOne: () => {},
          },
        };
      });
      const {
        approve,
      } = require("../../../../services/sapporo/controller/operator");
      const res = mockResponse(statusMock);
      res.render = renderMock;
      await approve(
        {
          query: {
            user_id: "test",
          },
        },
        res
      );
      expect(renderMock).toHaveBeenCalled();
    });

    test("approve successfully", async () => {
      const statusMock = jest.fn();
      const renderMock = jest.fn();
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
          },
          MessageVariable: {
            findOne: () => {
              return { variable_value: "test", variable_id: "test" };
            },
            updateOne: () => {},
          },
        };
      });
      const {
        approve,
      } = require("../../../../services/sapporo/controller/operator");
      const res = mockResponse(statusMock);
      res.render = renderMock;
      await approve(
        {
          query: {
            user_id: "test",
          },
        },
        res
      );
      expect(renderMock).toHaveBeenCalled();
    });

    test("approve successfully when variable_id is undefined", async () => {
      const statusMock = jest.fn();
      const renderMock = jest.fn();
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
          },
          MessageVariable: {
            findOne: () => {
              return { variable_value: "test" };
            },
            updateOne: () => {},
          },
        };
      });
      const {
        approve,
      } = require("../../../../services/sapporo/controller/operator");
      const res = mockResponse(statusMock);
      res.render = renderMock;
      await approve(
        {
          query: {
            user_id: "test",
          },
        },
        res
      );
      expect(renderMock).toHaveBeenCalled();
    });
  });

  describe("/deny", () => {
    beforeEach(() => {
      jest.resetModules();
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
              return {};
            },
          },
          MessageVariable: {
            findOne: () => {
              return undefined;
            },
          },
        };
      });

      const {
        deny,
      } = require("../../../../services/sapporo/controller/operator");
      await deny(
        {
          query: {
            user_id: "test",
          },
        },
        mockResponse(statusMock)
      );
      expect(statusMock).not.toHaveBeenCalled();
    });

    test("user was denied", async () => {
      const statusMock = jest.fn();
      const renderMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            findOne: (query) => {
              if (query && query.variable_name == "氏名") {
                return { _id: "name" };
              }
              return { _id: "test" };
            },
          },
          MessageVariable: {
            findOne: (query) => {
              if (query && query.variable_id == "name") {
                return {};
              }
              return { variable_value: 9 };
            },
            updateOne: () => {},
          },
        };
      });
      const {
        deny,
      } = require("../../../../services/sapporo/controller/operator");
      const res = mockResponse(statusMock);
      res.render = renderMock;
      await deny(
        {
          query: {
            user_id: "test",
          },
        },
        res
      );
      expect(renderMock).toHaveBeenCalled();
    });

    test("deny successfully", async () => {
      const statusMock = jest.fn();
      const renderMock = jest.fn();
      jest.doMock("../../../../model", () => {
        return {
          UserProfile: {
            findOne: () => {
              return {};
            },
          },
          Variable: {
            findOne: (query) => {
              if (query && query.variable_name == "氏名") {
                return { _id: "name" };
              }
              return { _id: "test" };
            },
          },
          MessageVariable: {
            findOne: (query) => {
              if (query && query.variable_id == "name") {
                return null;
              }

              return { variable_value: "test", variable_id: "test" };
            },
            updateOne: () => {},
          },
        };
      });
      const {
        deny,
      } = require("../../../../services/sapporo/controller/operator");
      const res = mockResponse(statusMock);
      res.render = renderMock;
      await deny(
        {
          query: {
            user_id: "test",
          },
        },
        res
      );
      expect(renderMock).toHaveBeenCalled();
    });

    test("deny successfully when variable_id is undefined", async () => {
      const statusMock = jest.fn();
      const renderMock = jest.fn();
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
          },
          MessageVariable: {
            findOne: () => {
              return { variable_value: "test" };
            },
            updateOne: () => {},
          },
        };
      });
      const {
        deny,
      } = require("../../../../services/sapporo/controller/operator");
      const res = mockResponse(statusMock);
      res.render = renderMock;
      await deny(
        {
          query: {
            user_id: "test",
          },
        },
        res
      );
      expect(renderMock).toHaveBeenCalled();
    });
  });

  describe("/operator", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("operator found", async () => {
      jest.doMock("../../../../model", () => {
        return {};
      });
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      const res = {
        status: (code) => {
          statusMock(code);
          return res;
        },
        json: (data) => {
          jsonMock(data);
        },
      };
      const {
        getOperatorId,
      } = require("../../../../services/sapporo/controller/operator");
      await getOperatorId(
        {
          query: {
            pw: "test",
          },
        },
        res
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        affiliation: "test",
        id: "test",
        name: "test",
      });
    });

    test("operator not found", async () => {
      jest.doMock("../../../../model", () => {
        return {};
      });
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      const res = {
        status: (code) => {
          statusMock(code);
          return res;
        },
        json: (data) => {
          jsonMock(data);
        },
      };
      const {
        getOperatorId,
      } = require("../../../../services/sapporo/controller/operator");
      await getOperatorId(
        {
          query: {
            pw: "not-found",
          },
        },
        res
      );
      await getOperatorId(
        {
          query: {
            pw: "test3",
          },
        },
        res
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        affiliation: "",
        id: "",
        name: "",
      });
    });
  });
});
