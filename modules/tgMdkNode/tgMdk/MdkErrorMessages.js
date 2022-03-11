// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MdkErrorMessages {
    static getValue(errorCode, replaceStr = undefined) {
        let message = undefined;
        if (MdkErrorMessages.MESSAGES.hasOwnProperty(errorCode)) {
            message = MdkErrorMessages.MESSAGES[errorCode];
            if (replaceStr != null) {
                replaceStr.forEach((value, index) => message = message.replace("{" + index.toString() + "}", value));
            }
        }
        else {
            message = "message undefined: " + errorCode;
        }
        return message;
    }
}
MdkErrorMessages.MESSAGES = {
    MA01: '{0} is missing in the Config file',
    MA02: '{0} value "{1}" in the Config file is not correct',
    MA03: '{0} file does not exist',
    MA04: 'Message body encryption error',
    MA06: 'Message body decryption error',
    MA99: 'System internal error',
    MB01: 'Could not find the Config file. {0}',
    MB02: 'Could not read the Config file',
    MB03: 'SslStream creation error has occurred.',
    MB99: 'System internal error',
    MF01: 'Could not connect to the Proxy Server. ErrorInfo:[{0}]',
    MF02: 'Could not connect to the GW Server',
    MF03: 'Connection to server timed out',
    MF05: '500 Internal Server Error',
    MF06: '502 Bad Gateway',
    MF07: '503 Service Unavailable',
    MF99: 'System internal error'
};
exports.MdkErrorMessages = MdkErrorMessages;
//# sourceMappingURL=MdkErrorMessages.js.map