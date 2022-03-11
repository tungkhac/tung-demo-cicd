// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("spreadsheet/conversions", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  const {
    errorMessages,
    MODE,
  } = require("../../../services/spreadsheet/constants");

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

  class GoogleSpreadsheet {
    constructor() {}
    useServiceAccountAuth() {}
    loadInfo() {}
    get sheetsByIndex() {
      return [
        {
          getRows: () => ["", ""],
        },
      ];
    }
    addSheet() {
      return {
        addRow: () => {},
        setHeaderRow: () => {},
      };
    }
  }

  const mockModules = () => {
    jest.doMock("config", () => {
      return {
        has: () => {
          return true;
        },
        get: (key) => {
          if (key != "appEnv") return "test";
          const random = Math.floor(Math.random() * 3);
          if (random == 0) {
            return "botchan";
          } else if (random == 1) {
            return "test";
          }
          throw new Error("test");
        },
      };
    });
    jest.doMock("google-spreadsheet", () => {
      return {
        GoogleSpreadsheet,
      };
    });
  };

  describe("/export", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("mapping is invalid", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      mockModules();
      const {
        exportToSpreadsheet,
      } = require("../../../services/spreadsheet/controller/conversions");
      await exportToSpreadsheet(
        {
          body: {
            mapping: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        error_message: errorMessages.default,
      });
    });

    test("missing params ", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      mockModules();
      const {
        exportToSpreadsheet,
      } = require("../../../services/spreadsheet/controller/conversions");
      await exportToSpreadsheet(
        {
          body: {
            mode: "test",
            mapping: '{"test":"test"}',
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        error_message: errorMessages.missingRequired,
      });
    });

    test("not supported mode", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      mockModules();
      const {
        exportToSpreadsheet,
      } = require("../../../services/spreadsheet/controller/conversions");
      await exportToSpreadsheet(
        {
          body: {
            mode: "test",
            ss_id: "test",
            mapping: '{"test":"test"}',
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        error_message: errorMessages.notSupportedMode,
      });
    });

    test("headers are not valid", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      mockModules();
      const {
        exportToSpreadsheet,
      } = require("../../../services/spreadsheet/controller/conversions");
      await exportToSpreadsheet(
        {
          body: {
            mode: MODE.EXPORT_BY_DAY,
            ss_id: "test",
            mapping: "{}",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        error_message: errorMessages.invalidMapping,
      });
    });

    test("success with exporting by day mode", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      mockModules();
      const {
        exportToSpreadsheet,
      } = require("../../../services/spreadsheet/controller/conversions");
      await exportToSpreadsheet(
        {
          body: {
            mode: MODE.EXPORT_BY_DAY,
            ss_id: "test",
            mapping: '{"test":"test", "name": "name"}',
            name: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        status: "OK",
      });
    });

    test("sheet title is not exist", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      mockModules();
      const {
        exportToSpreadsheet,
      } = require("../../../services/spreadsheet/controller/conversions");
      await exportToSpreadsheet(
        {
          body: {
            mode: MODE.EXPORT_BY_SHEET_TITLE,
            ss_id: "test",
            mapping: '{"test":"test"}',
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        error_message: errorMessages.missingSheetTitle,
      });
    });

    test("success with exporting by sheet title mode", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      mockModules();
      const {
        exportToSpreadsheet,
      } = require("../../../services/spreadsheet/controller/conversions");
      await exportToSpreadsheet(
        {
          body: {
            mode: MODE.EXPORT_BY_SHEET_TITLE,
            ss_id: "test",
            ss_title: "test",
            mapping: '{"test": "test","name":"name"}',
            name: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        status: "OK",
      });
    });

    test("spreadsheet has sheet title", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      const addSheetMock = jest.fn();
      const setHeaderRowMock = jest.fn();
      class GoogleSpreadsheet2 {
        constructor() {}
        useServiceAccountAuth() {}
        loadInfo() {}
        get sheetsByIndex() {
          return [
            {
              title: "test",
              headerValues: ["test", "test"],
              addRow: () => {},
              setHeaderRow: () => {
                setHeaderRowMock();
              },
            },
          ];
        }
        get sheetCount() {
          return 1;
        }
        addSheet() {
          addSheetMock();
          return {
            addRow: () => {},
            setHeaderRow: () => {
              setHeaderRowMock();
            },
          };
        }
      }
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet: GoogleSpreadsheet2,
        };
      });
      const {
        exportToSpreadsheet,
      } = require("../../../services/spreadsheet/controller/conversions");
      await exportToSpreadsheet(
        {
          body: {
            mode: MODE.EXPORT_BY_SHEET_TITLE,
            ss_id: "test",
            ss_title: "test",
            mapping: '{"test": "test","name":"name"}',
            name: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        status: "OK",
      });
      expect(addSheetMock).not.toHaveBeenCalled();
      expect(setHeaderRowMock).not.toHaveBeenCalled();
    });

    test("can not get sheet", async () => {
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      class GoogleSpreadsheet3 {
        constructor() {}
        useServiceAccountAuth() {}
        loadInfo() {}
        get sheetsByIndex() {
          return [];
        }
        get sheetCount() {
          return 0;
        }
        addSheet() {
          return null;
        }
      }
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet: GoogleSpreadsheet3,
        };
      });
      const {
        exportToSpreadsheet,
      } = require("../../../services/spreadsheet/controller/conversions");
      await exportToSpreadsheet(
        {
          body: {
            mode: MODE.EXPORT_BY_SHEET_TITLE,
            ss_id: "test",
            ss_title: "test",
            mapping: '{"test": "test","name":"name"}',
            name: "test",
          },
        },
        mockResponse(statusMock, jsonMock)
      );
      expect(jsonMock).toHaveBeenCalledWith({
        error_message: errorMessages.default,
      });
    });
  });
});
