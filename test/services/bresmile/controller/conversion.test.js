// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0

describe("bresmile/controller", () => {
  beforeEach(() => {
    jest.resetModules();
  });

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

  describe("/conversion", () => {
    test("should return 200 with type = 阻止", async () => {
      class GoogleSpreadsheet {
        constructor() {}
        useServiceAccountAuth() {}
        loadInfo() {}
        get sheetCount() {
          return 1;
        }
        get sheetsByIndex() {
          return [
            {
              title: '阻止通知',
              getRows: () => ["", ""],
              addRow: jest.fn().mockReturnThis(),
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

      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });

      const req = {
        body: {
          tel: {},
          type: '阻止',
        }
      }
      const status = jest.fn();
      const json = jest.fn();
      const { conversion } = require("../../../../services/bresmile/controller");
      await conversion(req, mockResponse(status, json));
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ status: "OK" });
    });
    test("should return 200 with type = 解約", async () => {
      class GoogleSpreadsheet {
        constructor() {}
        useServiceAccountAuth() {}
        loadInfo() {}
        get sheetCount() {
          return 1;
        }
        get sheetsByIndex() {
          return [
            {
              title: '解約通知',
              getRows: () => ["", ""],
              addRow: jest.fn().mockReturnThis(),
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
    
      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });
      const req = {
        body: {
          tel: '000',
          type: '解約',
        }
      }
      const status = jest.fn();
      const json = jest.fn();
      const { conversion } = require("../../../../services/bresmile/controller");
      await conversion(req, mockResponse(status, json));
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ status: "OK" });
    });
    test("should return 200 with error invalid type", async () => {
      const req = {
        body: {
          type: 'test',
        }
      }
      const status = jest.fn();
      const json = jest.fn();
      const { conversion } = require("../../../../services/bresmile/controller");
      await conversion(req, mockResponse(status, json));
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ error: "Invalid type" });
    });

    test("should return 200 with error: No sheet found ", async () => {
      class GoogleSpreadsheet {
        constructor() {}
        useServiceAccountAuth() {}
        loadInfo() {}
        get sheetCount() {
          return 1;
        }
        get sheetsByIndex() {
          return [
            {
              title: 'test',
              getRows: () => ["", ""],
              addRow: jest.fn().mockReturnThis(),
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

      jest.doMock("google-spreadsheet", () => {
        return {
          GoogleSpreadsheet,
        };
      });

      const req = {
        body: {
          tel: {},
          type: '阻止',
        }
      }
      const status = jest.fn();
      const json = jest.fn();
      const { conversion } = require("../../../../services/bresmile/controller");
      await conversion(req, mockResponse(status, json));
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ error: "No sheet found" });
    });

    test("should return 200 with default error message", async () => {
      jest.doMock("google-spreadsheet", () => {
        return {
          undefined,
        };
      });

      const req = {
        body: {
          title: '',
          type: '阻止',
        }
      }
      const status = jest.fn();
      const json = jest.fn();
      const { conversion } = require("../../../../services/bresmile/controller");
      await conversion(req, mockResponse(status, json));
      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ error: "エラーが発生しました。再度お試しください。" });
    });
  });
})
