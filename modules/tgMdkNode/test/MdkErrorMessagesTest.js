// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MdkErrorMessages_1 = require("../tgMdk/MdkErrorMessages");
const mocha_1 = require("mocha");
const assert = require("power-assert");
mocha_1.describe('MdkErrorMessages Test', () => {
    it("replace pattern", () => {
        assert.equal(MdkErrorMessages_1.MdkErrorMessages.getValue("MA01", []), "{0} is missing in the Config file");
        assert.equal(MdkErrorMessages_1.MdkErrorMessages.getValue("MA01", null), "{0} is missing in the Config file");
        assert.equal(MdkErrorMessages_1.MdkErrorMessages.getValue("MA01", ["host"]), "host is missing in the Config file");
        assert.equal(MdkErrorMessages_1.MdkErrorMessages.getValue("MA02", ["foo", "bar"]), "foo value \"bar\" in the Config file is not correct");
        assert.equal(MdkErrorMessages_1.MdkErrorMessages.getValue("MA02", ["foo", "bar", "baz"]), "foo value \"bar\" in the Config file is not correct");
        assert.equal(MdkErrorMessages_1.MdkErrorMessages.getValue("MF06", ["foo"]), "502 Bad Gateway");
    });
    it("not replace pattern", () => {
        assert.equal(MdkErrorMessages_1.MdkErrorMessages.getValue("MA01"), "{0} is missing in the Config file");
        assert.equal(MdkErrorMessages_1.MdkErrorMessages.getValue("MF99"), "System internal error");
    });
    it("not found pattern", () => {
        assert.equal(MdkErrorMessages_1.MdkErrorMessages.getValue("MA00"), "message undefined: MA00");
    });
});
//# sourceMappingURL=MdkErrorMessagesTest.js.map