// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MerchantConfig_1 = require("./MerchantConfig");
const MdkLocalException_1 = require("./MdkLocalException");
const MdkUtil_1 = require("./MdkUtil");
const HttpClient_1 = require("./HttpClient");
class Transaction {
    constructor(logger, config, httpClient) {
        this._logger = logger;
        this._config = config;
        this._httpClient = httpClient || new HttpClient_1.HttpClient(config);
    }
    execute(requestDto, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._logger.info("Transaction.execute() start");
                let url = Transaction.createSendUrl(requestDto, this._config.host, MerchantConfig_1.MerchantConfig.ADD_URL_PAYMENT, MerchantConfig_1.MerchantConfig.ADD_URL_PAYMENT_VERSION, MerchantConfig_1.MerchantConfig.PAYNOWID_SERVICE_TYPE, MerchantConfig_1.MerchantConfig.ADD_URL_VTID, MerchantConfig_1.MerchantConfig.ADD_URL_VTID_VERSION, MerchantConfig_1.MerchantConfig.SERVICE_COMMAND_SEARCH, MerchantConfig_1.MerchantConfig.SEARCH_SERVER, this._config.dummyRequest, MerchantConfig_1.MerchantConfig.DUMMY_SERVER);
                this._logger.info("========== connect url       ==> " + url);
                this._logger.info("========== user agent        ==> " + MerchantConfig_1.MerchantConfig.userAgent);
                if (this._config.mdkErrorMode) {
                    this._logger.info("Transaction.execute() end");
                    let exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.TYPE_A_INTERNAL_ERROR);
                    return Transaction.getErrorResponse(exception.errorCode, exception.errorMessage, type);
                }
                let obj = MdkUtil_1.MdkUtil.convertDTOtoJsonObject(requestDto);
                let maskedCopy = JSON.parse(JSON.stringify(obj));
                MdkUtil_1.MdkUtil.maskJson(maskedCopy);
                let maskedLog = JSON.stringify(maskedCopy);
                this._logger.info("========== request mct data  ==> " + maskedLog);
                let bodyJson = Transaction.appendConnectParam(obj, this._config.merchantCcId, this._config.merchantSecretKey, this._config.dummyRequest, this._logger);
                requestDto.maskedLog = maskedLog;
                return this.sendRequest(url, bodyJson, type);
            }
            catch (e) {
                this._logger.info("Transaction.execute() end");
                if (e instanceof MdkLocalException_1.MdkLocalException) {
                    return Transaction.getErrorResponse(e.errorCode, e.errorMessage, type);
                }
                else {
                    let exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.TYPE_A_INTERNAL_ERROR);
                    return Transaction.getErrorResponse(exception.errorCode, exception.errorMessage, type);
                }
            }
        });
    }
    sendRequest(url, bodyJson, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this._httpClient.execute(url, bodyJson);
                this._logger.info("========== response json     ==> " + response.body);
                let responseDto;
                if (response.body != null) {
                    responseDto = MdkUtil_1.MdkUtil.setResponseProperties(response.body, type);
                }
                else {
                    let exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.TYPE_B_INTERNAL_ERROR);
                    responseDto = Transaction.getErrorResponse(exception.errorCode, exception.errorMessage, type);
                }
                this._logger.info("Transaction.execute() end");
                return responseDto;
            }
            catch (e) {
                this._logger.info("Transaction.execute() end");
                let code = undefined;
                if (e.hasOwnProperty("code")) {
                    code = e.code;
                }
                if (e instanceof Error) {
                    let exception;
                    if (code != null) {
                        if (code == "ESOCKETTIMEDOUT" || code == "ETIMEDOUT") {
                            exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.SERVER_TIMEOUT);
                        }
                        else if (code == "ECONNRESET" || code == "ECONNREFUSED" || code == "ENOTFOUND") {
                            exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.SOCKET_IO_ERROR);
                        }
                        else {
                            exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.TYPE_F_INTERNAL_ERROR);
                        }
                    }
                    else {
                        if (e.message.startsWith("SSL Error") || e.message.startsWith("Invalid protocol") ||
                            e.message.startsWith("Hostname/IP does not match certificate's altnames")) {
                            exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.SOCKET_FACTORY_CREATION_ERROR);
                        }
                        else {
                            exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.TYPE_F_INTERNAL_ERROR);
                        }
                    }
                    return Transaction.getErrorResponse(exception.errorCode, exception.errorMessage, type);
                }
                else if (e instanceof IncomingMessage) {
                    let exception;
                    switch (e.statusCode) {
                        case 500:
                            exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.INTERNAL_SERVER_ERROR);
                            break;
                        case 502:
                            exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.BAD_GW);
                            break;
                        case 503:
                            exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.SERVICE_UNAVAILABLE);
                            break;
                        default:
                            exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.GW_CONNECT_ERROR);
                    }
                    return Transaction.getErrorResponse(exception.errorCode, exception.errorMessage, type);
                }
                else {
                    let exception = new MdkLocalException_1.MdkLocalException(this._logger, MdkLocalException_1.MdkLocalException.TYPE_B_INTERNAL_ERROR);
                    return Transaction.getErrorResponse(exception.errorCode, exception.errorMessage, type);
                }
            }
        });
    }
    static createSendUrl(requestDto, host, addUrlPayment, addUrlPaymentVersion, payNowIdServiceType, addUrlVtId, addUrlVtIdVersion, serviceCommandSearch, searchServer, dummyRequest, dummyServer) {
        let url = host;
        let serviceType = requestDto.serviceType;
        let serviceCommand = requestDto.serviceCommand;
        let serviceName = addUrlPayment;
        let version = addUrlPaymentVersion;
        if (payNowIdServiceType.some(value => value == serviceType)) {
            serviceName = addUrlVtId;
            version = addUrlVtIdVersion;
        }
        if (serviceName == addUrlPayment && serviceCommand == serviceCommandSearch) {
            serviceName = serviceName + "-" + searchServer;
        }
        if (dummyRequest == "1") {
            serviceName = dummyServer + "-" + serviceName;
        }
        return url + "/" + serviceName + "/" + version + "/" + serviceCommand + "/" + serviceType;
    }
    static appendConnectParam(requestDto, merchantCcId, merchantSecretKey, dummyRequest, logger) {
        requestDto["txnVersion"] = MerchantConfig_1.MerchantConfig.MDK_DTO_VERSION;
        requestDto["dummyRequest"] = dummyRequest;
        requestDto["merchantCcid"] = merchantCcId;
        let jsonValue = JSON.stringify(requestDto);
        let maskedCopy = JSON.parse(jsonValue);
        MdkUtil_1.MdkUtil.maskJson(maskedCopy);
        let maskedLog = JSON.stringify(maskedCopy);
        logger.info("========== request mdk data  ==> " + maskedLog);
        let crypto = require("crypto");
        let sha256 = crypto.createHash("sha256");
        sha256.update(merchantCcId + jsonValue + merchantSecretKey);
        let authHash = sha256.digest('hex');
        let obj = {
            "params": requestDto,
            "authHash": authHash
        };
        return JSON.stringify(obj);
    }
    static getErrorResponse(vResultCode, errorMessage, type) {
        let responseDto = new type();
        if (vResultCode != null && vResultCode.length == 4) {
            vResultCode += "000000000000";
        }
        if (vResultCode != null) {
            responseDto["vResultCode"] = vResultCode;
        }
        if (errorMessage != null) {
            responseDto["MerrMsg"] = errorMessage;
        }
        return responseDto;
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map