// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("services/repeat-plus/format-data", () => {
  const {
    formatTaxInclude,
    removeDash,
    formatZipCode,
    formatTelephone,
    formatDate,
    formatNull,
    formatUserDevice,
    formatOrderDevice,
    isDoubleByteString,
    getMailFlag,
  } = require("../../../services/repeat-plus/format-data");

  test("formatTaxInclude", () => {
    expect(formatTaxInclude()).toEqual("税別");
    expect(formatTaxInclude("0")).toEqual("税別");
    expect(formatTaxInclude("1")).toEqual("税込");
  });

  test("removeDash", () => {
    expect(removeDash(1)).toEqual(1);
    expect(removeDash(undefined)).toEqual(undefined);
    expect(removeDash("test")).toEqual("test");
    expect(removeDash("tes-t")).toEqual("test");
  });

  test("formatZipCode", () => {
    expect(formatZipCode(1)).toEqual(1);
    expect(formatZipCode(undefined)).toEqual(undefined);
    expect(formatZipCode("test")).toEqual("test");
    expect(formatZipCode("111-2222")).toEqual("111-2222");
    expect(formatZipCode("1-11-2222")).toEqual("111-2222");
    expect(formatZipCode("1112222")).toEqual("111-2222");
  });

  test("formatTelephone", () => {
    expect(formatTelephone(1)).toEqual(1);
    expect(formatTelephone(undefined)).toEqual(undefined);
    expect(formatTelephone("test")).toEqual("test");
    expect(formatTelephone("111-2222")).toEqual("1112222");
    expect(formatTelephone("123-1234-1234")).toEqual("123-1234-1234");
    expect(formatTelephone("1231234-1234")).toEqual("123-1234-1234");
  });

  test("formatDate", () => {
    expect(formatDate(undefined)).toEqual(undefined);
    expect(formatDate("20200121")).toEqual("2020/01/21");
  });

  test("formatNull", () => {
    expect(formatNull(undefined)).toEqual(undefined);
    expect(formatNull("")).toEqual(undefined);
    expect(formatNull("test")).toEqual("test");
  });

  test("formatUserDevice", () => {
    expect(formatUserDevice(undefined)).toEqual(undefined);
    expect(formatUserDevice("Mobile")).toEqual("SP_USER");
    expect(formatUserDevice(" Tablet")).toEqual("SP_USER");
    expect(formatUserDevice("test")).toEqual("PC_USER");
    expect(formatUserDevice("PC")).toEqual("PC_USER");
  });

  test("formatOrderDevice", () => {
    expect(formatOrderDevice(undefined)).toEqual(undefined);
    expect(formatOrderDevice("Mobile")).toEqual("SP");
    expect(formatOrderDevice(" Tablet")).toEqual("SP");
    expect(formatOrderDevice("test")).toEqual("PC");
    expect(formatOrderDevice("PC")).toEqual("PC");
  });

  test("isDoubleByteString", () => {
    expect(isDoubleByteString(undefined)).toEqual(false);
    expect(isDoubleByteString(null)).toEqual(false);
    expect(isDoubleByteString(1)).toEqual(false);
    expect(isDoubleByteString({})).toEqual(false);
    expect(isDoubleByteString("test")).toEqual(false);
    expect(isDoubleByteString("")).toEqual(false);
    expect(isDoubleByteString("ｔｅｓｔ")).toEqual(true);
  });

  test("getMailFlag", () => {
    expect(getMailFlag(undefined)).toEqual(undefined);
    expect(getMailFlag("")).toEqual(undefined);
    expect(getMailFlag({})).toEqual(undefined);
    expect(getMailFlag({ mail_flg: "on " })).toEqual("ON");
    expect(getMailFlag({ mail_flg: "off" })).toEqual("OFF");
    expect(getMailFlag({ mail_flg: " UNKNOWn " })).toEqual("UNKNOWN");
    expect(getMailFlag({ mail_flg: " test " })).toEqual(undefined);
  });
});
