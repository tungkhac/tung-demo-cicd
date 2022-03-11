// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("services", () => {
  test("default", async () => {
    jest.doMock("../../model", () => {
      return {};
    });
    const services = require("../../services");
    expect(services).toBeDefined();
  });
});
