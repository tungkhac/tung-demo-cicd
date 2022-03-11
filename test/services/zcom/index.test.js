// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("services/zcom", () => {
  test("default", () => {
    jest.mock("../../../model", () => {
      return {};
    });
    const service = require("../../../services/zcom");
    expect(service).toBeDefined();
  });
});
