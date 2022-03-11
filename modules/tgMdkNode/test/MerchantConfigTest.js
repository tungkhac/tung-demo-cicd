// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MerchantConfig_1 = require("../tgMdk/MerchantConfig");
const mocha_1 = require("mocha");
const assert = require("power-assert");
mocha_1.describe('MerchantConfig Test', () => {
    it("need mask (some case pattern)", () => {
        assert.equal(MerchantConfig_1.MerchantConfig.isNeedMask("cardNumber"), true);
        assert.equal(MerchantConfig_1.MerchantConfig.isNeedMask("cardnumber"), true);
        assert.equal(MerchantConfig_1.MerchantConfig.isNeedMask("ReqCardNumber"), true);
        assert.equal(MerchantConfig_1.MerchantConfig.isNeedMask("REQCARDNUMBER"), true);
    });
    it("not need mask", () => {
        assert.equal(MerchantConfig_1.MerchantConfig.isNeedMask("foo"), false);
    });
    it("null and empty", () => {
        assert.equal(MerchantConfig_1.MerchantConfig.isNeedMask(""), false);
        assert.equal(MerchantConfig_1.MerchantConfig.isNeedMask(null), false);
    });
    it("useragent check", () => {
        assert.equal(MerchantConfig_1.MerchantConfig.userAgent, "VeriTrans 4G MDK/1.0.1/1.0.1 (TypeScript)");
    });
});
//# sourceMappingURL=MerchantConfigTest.js.map