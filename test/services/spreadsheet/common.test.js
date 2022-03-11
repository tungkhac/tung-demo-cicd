// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const { GoogleSpreadsheet } = require("google-spreadsheet");

describe("/spreadsheet/common", () => {
  test("formatTel", async () => {
    const { formatTel } = require("../../../services/spreadsheet/common");
    expect(formatTel()).toEqual(undefined);
    expect(formatTel(1)).toEqual(1);
    expect(formatTel("123")).toEqual("'123");
    expect(formatTel("test")).toEqual("'test");
  });

  test("sheetByTitle", async () => {
    const { sheetByTitle } = require("../../../services/spreadsheet/common");
    expect(sheetByTitle()).toEqual(undefined);
    expect(
      sheetByTitle({ sheetCount: 2, sheetsByIndex: ["test1", "TEST"] }, "test")
    ).toEqual(undefined);
    expect(
      sheetByTitle(
        { sheetCount: 2, sheetsByIndex: ["test1", { title: "test" }] },
        "test"
      )
    ).toEqual({ title: "test" });
  });

  test("getHeaderValues", async () => {
    const { getHeaderValues } = require("../../../services/spreadsheet/common");
    expect(getHeaderValues()).toEqual(undefined);
    expect(getHeaderValues({ test: "test", test2: "test2" })).toEqual([
      "test",
      "test2",
    ]);
    expect(getHeaderValues({})).toEqual(undefined);
  });

  test("getRow", async () => {
    const { getRow } = require("../../../services/spreadsheet/common");
    expect(getRow()).toEqual(undefined);
    expect(getRow({}, [], {})).toEqual(undefined);
    expect(
      getRow({ test1: "test1-v", test2: "test2-v" }, ["test1", "test2"], {})
    ).toEqual({});
    const row = getRow({ test1: "test1-v" }, ["test1", "test2"], {
      test1: "test1",
      test2: "{{timestamp}}",
    });
    expect(row.test1).toEqual("test1-v");
    expect(row.test2).toBeDefined();
    const row2 = getRow({ test1: "test1-v" }, ["test1", "test2"], {
      test1: "test1",
      test2: "{{date}}",
    });
    expect(row2.test1).toEqual("test1-v");
    expect(row2.test2).toBeDefined();
    const row3 = getRow(
      { test1: "1test1-v", test2: "=test1-v" },
      ["test1", "test2"],
      {
        test1: "test1",
        test2: "test2",
      }
    );
    expect(row3.test1).toEqual("'1test1-v");
    expect(row3.test2).toEqual("'=test1-v");
    const row4 = getRow({ test1: "test1-v" }, ["test1", "test2"], {
      test1: "test1",
      test2: "{{timestamp2}}",
    });
    expect(row4.test1).toEqual("test1-v");
    expect(row4.test2).toBeDefined();
  });
});
