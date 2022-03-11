// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MdkLocalException_1 = require("../tgMdk/MdkLocalException");
const mocha_1 = require("mocha");
const Log4js = require("log4js");
const assert = require("power-assert");
mocha_1.describe('MdkLocalException Test', () => {
    Log4js.configure({
        appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
    });
    let logger = Log4js.getLogger("default");
    it("Test MdkLocalException messages", () => {
        let ma01 = new MdkLocalException_1.MdkLocalException(logger, "MA01");
        assert.equal(ma01.errorMessage, "{0} is missing in the Config file");
        let ma01_2 = new MdkLocalException_1.MdkLocalException(logger, "MA01", ["host"]);
        assert.equal(ma01_2.errorMessage, "host is missing in the Config file");
        let ma02 = new MdkLocalException_1.MdkLocalException(logger, "MA02");
        assert.equal(ma02.errorMessage, "{0} value \"{1}\" in the Config file is not correct");
        let ma02_2 = new MdkLocalException_1.MdkLocalException(logger, "MA02", ["foo", "val"]);
        assert.equal(ma02_2.errorMessage, "foo value \"val\" in the Config file is not correct");
        let ma03 = new MdkLocalException_1.MdkLocalException(logger, "MA03");
        assert.equal(ma03.errorMessage, "{0} file does not exist");
        let ma04 = new MdkLocalException_1.MdkLocalException(logger, "MA04");
        assert.equal(ma04.errorMessage, "Message body encryption error");
        let ma06 = new MdkLocalException_1.MdkLocalException(logger, "MA06");
        assert.equal(ma06.errorMessage, "Message body decryption error");
        let ma99 = new MdkLocalException_1.MdkLocalException(logger, "MA99");
        assert.equal(ma99.errorMessage, "System internal error");
        let mb01 = new MdkLocalException_1.MdkLocalException(logger, "MB01");
        assert.equal(mb01.errorMessage, "Could not find the Config file. {0}");
        let mb02 = new MdkLocalException_1.MdkLocalException(logger, "MB02");
        assert.equal(mb02.errorMessage, "Could not read the Config file");
        let mb03 = new MdkLocalException_1.MdkLocalException(logger, "MB03");
        assert.equal(mb03.errorMessage, "SslStream creation error has occurred.");
        let mb99 = new MdkLocalException_1.MdkLocalException(logger, "MB99");
        assert.equal(mb99.errorMessage, "System internal error");
        let mf01 = new MdkLocalException_1.MdkLocalException(logger, "MF01");
        assert.equal(mf01.errorMessage, "Could not connect to the Proxy Server. ErrorInfo:[{0}]");
        let mf02 = new MdkLocalException_1.MdkLocalException(logger, "MF02");
        assert.equal(mf02.errorMessage, "Could not connect to the GW Server");
        let mf03 = new MdkLocalException_1.MdkLocalException(logger, "MF03");
        assert.equal(mf03.errorMessage, "Connection to server timed out");
        let mf05 = new MdkLocalException_1.MdkLocalException(logger, "MF05");
        assert.equal(mf05.errorMessage, "500 Internal Server Error");
        let mf06 = new MdkLocalException_1.MdkLocalException(logger, "MF06");
        assert.equal(mf06.errorMessage, "502 Bad Gateway");
        let mf07 = new MdkLocalException_1.MdkLocalException(logger, "MF07");
        assert.equal(mf07.errorMessage, "503 Service Unavailable");
        let mf99 = new MdkLocalException_1.MdkLocalException(logger, "MF99");
        assert.equal(mf99.errorMessage, "System internal error");
    });
});
//# sourceMappingURL=MdkLocalExceptionTest.js.map