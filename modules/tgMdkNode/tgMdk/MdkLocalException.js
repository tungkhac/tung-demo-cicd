// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MdkErrorMessages_1 = require("./MdkErrorMessages");
class MdkLocalException {
    constructor(logger, errorCode, replaceStr = undefined, error = undefined) {
        this._logger = undefined;
        this._error = undefined;
        this._errorCode = undefined;
        this._errorMessage = undefined;
        this._logger = logger;
        this._error = error;
        this._errorCode = errorCode;
        this.setErrorMessage(errorCode, replaceStr);
    }
    get errorMessage() {
        return this._errorMessage;
    }
    get errorCode() {
        return this._errorCode;
    }
    setErrorMessage(errorCode, replaceStr) {
        this._errorMessage = MdkErrorMessages_1.MdkErrorMessages.getValue(errorCode, replaceStr);
        if (this._error == null) {
            this._logger.error(this._errorMessage);
        }
        else {
            this._logger.error(this._errorMessage, this._error);
        }
    }
}
MdkLocalException.CONFIG_MISSING = "MA01";
MdkLocalException.CONFIG_VALUE_INVALID = "MA02";
MdkLocalException.FILE_NO_EXIST = "MA03";
MdkLocalException.ENCRYPTION_ERROR = "MA04";
MdkLocalException.DECRYPTION_ERROR = "MA06";
MdkLocalException.TYPE_A_INTERNAL_ERROR = "MA99";
MdkLocalException.NO_CONFIG_FILE = "MB01";
MdkLocalException.CONFIG_READ_ERROR = "MB02";
MdkLocalException.SOCKET_FACTORY_CREATION_ERROR = "MB03";
MdkLocalException.TYPE_B_INTERNAL_ERROR = "MB99";
MdkLocalException.PROXY_CONNECT_ERROR = "MF01";
MdkLocalException.GW_CONNECT_ERROR = "MF02";
MdkLocalException.SERVER_TIMEOUT = "MF03";
MdkLocalException.SOCKET_IO_ERROR = "MF04";
MdkLocalException.INTERNAL_SERVER_ERROR = "MF05";
MdkLocalException.BAD_GW = "MF06";
MdkLocalException.SERVICE_UNAVAILABLE = "MF07";
MdkLocalException.TYPE_F_INTERNAL_ERROR = "MF99";
exports.MdkLocalException = MdkLocalException;
//# sourceMappingURL=MdkLocalException.js.map