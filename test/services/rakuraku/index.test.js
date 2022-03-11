// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("services/rakuraku", () => {
  test("default", () => {
    jest.mock("../../../model", () => {
      return {};
    });
    const service = require("../../../services/rakuraku");
    expect(service).toBeDefined();
  });
});
