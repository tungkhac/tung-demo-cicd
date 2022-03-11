// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const json2typescript_1 = require("json2typescript");
const MdkDtoBase_1 = require("../MdkDtoBase");
const PayNowIdResponse_1 = require("../PayNowId/PayNowIdResponse");
const FraudDetectionResponseDto_1 = require("../FraudDetection/FraudDetectionResponseDto");
let CardAuthorizeResponseDto = class CardAuthorizeResponseDto extends MdkDtoBase_1.MdkDtoBase {
    constructor() {
        super(...arguments);
        this.serviceType = undefined;
        this.mstatus = undefined;
        this.vResultCode = undefined;
        this.merrMsg = undefined;
        this.marchTxn = undefined;
        this.orderId = undefined;
        this.custTxn = undefined;
        this.txnVersion = undefined;
        this.cardTransactionType = undefined;
        this.gatewayRequestDate = undefined;
        this.gatewayResponseDate = undefined;
        this.centerRequestDate = undefined;
        this.centerResponseDate = undefined;
        this.pending = undefined;
        this.loopback = undefined;
        this.connectedCenterId = undefined;
        this.centerRequestNumber = undefined;
        this.centerReferenceNumber = undefined;
        this.reqCardNumber = undefined;
        this.reqCardExpire = undefined;
        this.reqCardOptionType = undefined;
        this.reqAmount = undefined;
        this.reqMerchantTransaction = undefined;
        this.reqReturnReferenceNumber = undefined;
        this.reqAuthCode = undefined;
        this.reqAcquirerCode = undefined;
        this.reqItemCode = undefined;
        this.reqCardCenter = undefined;
        this.reqJpoInformation = undefined;
        this.reqSalesDay = undefined;
        this.reqCancelDay = undefined;
        this.reqWithCapture = undefined;
        this.reqWithDirect = undefined;
        this.req3dMessageVersion = undefined;
        this.req3dTransactionId = undefined;
        this.req3dTransactionStatus = undefined;
        this.req3dCavvAlgorithm = undefined;
        this.req3dCavv = undefined;
        this.req3dEci = undefined;
        this.reqSecurityCode = undefined;
        this.reqAuthFlag = undefined;
        this.reqBirthday = undefined;
        this.reqTel = undefined;
        this.reqFirstKanaName = undefined;
        this.reqLastKanaName = undefined;
        this.resMerchantTransaction = undefined;
        this.resReturnReferenceNumber = undefined;
        this.resAuthCode = undefined;
        this.resActionCode = undefined;
        this.resCenterErrorCode = undefined;
        this.resAuthTerm = undefined;
        this.resItemCode = undefined;
        this.resResponseData = undefined;
        this.reqCurrencyUnit = undefined;
        this.reqWithNew = undefined;
        this.acquirerCode = undefined;
        this.terminalId = undefined;
        this.fraudDetectionResponse = undefined;
        this.resCenterProcessNumber = undefined;
        this.resCenterSendDateTime = undefined;
        this.resGiftBalance = undefined;
        this.resGiftExpire = undefined;
        this.payNowIdResponse = undefined;
    }
    get resultJson() {
        return this._resultJson;
    }
    set resultJson(value) {
        this._resultJson = value;
    }
};
__decorate([
    json2typescript_1.JsonProperty("serviceType", String, true)
], CardAuthorizeResponseDto.prototype, "serviceType", void 0);
__decorate([
    json2typescript_1.JsonProperty("mstatus", String, true)
], CardAuthorizeResponseDto.prototype, "mstatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("vResultCode", String, true)
], CardAuthorizeResponseDto.prototype, "vResultCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("merrMsg", String, true)
], CardAuthorizeResponseDto.prototype, "merrMsg", void 0);
__decorate([
    json2typescript_1.JsonProperty("marchTxn", String, true)
], CardAuthorizeResponseDto.prototype, "marchTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], CardAuthorizeResponseDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("custTxn", String, true)
], CardAuthorizeResponseDto.prototype, "custTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("txnVersion", String, true)
], CardAuthorizeResponseDto.prototype, "txnVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardTransactiontype", String, true)
], CardAuthorizeResponseDto.prototype, "cardTransactionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("gatewayRequestDate", String, true)
], CardAuthorizeResponseDto.prototype, "gatewayRequestDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("gatewayResponseDate", String, true)
], CardAuthorizeResponseDto.prototype, "gatewayResponseDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerRequestDate", String, true)
], CardAuthorizeResponseDto.prototype, "centerRequestDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerResponseDate", String, true)
], CardAuthorizeResponseDto.prototype, "centerResponseDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("pending", String, true)
], CardAuthorizeResponseDto.prototype, "pending", void 0);
__decorate([
    json2typescript_1.JsonProperty("loopback", String, true)
], CardAuthorizeResponseDto.prototype, "loopback", void 0);
__decorate([
    json2typescript_1.JsonProperty("connectedCenterId", String, true)
], CardAuthorizeResponseDto.prototype, "connectedCenterId", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerRequestNumber", String, true)
], CardAuthorizeResponseDto.prototype, "centerRequestNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerReferenceNumber", String, true)
], CardAuthorizeResponseDto.prototype, "centerReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardNumber", String, true)
], CardAuthorizeResponseDto.prototype, "reqCardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardExpire", String, true)
], CardAuthorizeResponseDto.prototype, "reqCardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardOptionType", String, true)
], CardAuthorizeResponseDto.prototype, "reqCardOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAmount", String, true)
], CardAuthorizeResponseDto.prototype, "reqAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqMerchantTransaction", String, true)
], CardAuthorizeResponseDto.prototype, "reqMerchantTransaction", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqReturnReferenceNumber", String, true)
], CardAuthorizeResponseDto.prototype, "reqReturnReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAuthCode", String, true)
], CardAuthorizeResponseDto.prototype, "reqAuthCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAcquirerCode", String, true)
], CardAuthorizeResponseDto.prototype, "reqAcquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqItemCode", String, true)
], CardAuthorizeResponseDto.prototype, "reqItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardCenter", String, true)
], CardAuthorizeResponseDto.prototype, "reqCardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqJpoInformation", String, true)
], CardAuthorizeResponseDto.prototype, "reqJpoInformation", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSalesDay", String, true)
], CardAuthorizeResponseDto.prototype, "reqSalesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCancelDay", String, true)
], CardAuthorizeResponseDto.prototype, "reqCancelDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithCapture", String, true)
], CardAuthorizeResponseDto.prototype, "reqWithCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithDirect", String, true)
], CardAuthorizeResponseDto.prototype, "reqWithDirect", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dMessageVersion", String, true)
], CardAuthorizeResponseDto.prototype, "req3dMessageVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dTransactionId", String, true)
], CardAuthorizeResponseDto.prototype, "req3dTransactionId", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dTransactionStatus", String, true)
], CardAuthorizeResponseDto.prototype, "req3dTransactionStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dCavvAlgorithm", String, true)
], CardAuthorizeResponseDto.prototype, "req3dCavvAlgorithm", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dCavv", String, true)
], CardAuthorizeResponseDto.prototype, "req3dCavv", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dEci", String, true)
], CardAuthorizeResponseDto.prototype, "req3dEci", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSecurityCode", String, true)
], CardAuthorizeResponseDto.prototype, "reqSecurityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAuthFlag", String, true)
], CardAuthorizeResponseDto.prototype, "reqAuthFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqBirthday", String, true)
], CardAuthorizeResponseDto.prototype, "reqBirthday", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqTel", String, true)
], CardAuthorizeResponseDto.prototype, "reqTel", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqFirstKanaName", String, true)
], CardAuthorizeResponseDto.prototype, "reqFirstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqLastKanaName", String, true)
], CardAuthorizeResponseDto.prototype, "reqLastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("resMerchantTransaction", String, true)
], CardAuthorizeResponseDto.prototype, "resMerchantTransaction", void 0);
__decorate([
    json2typescript_1.JsonProperty("resReturnReferenceNumber", String, true)
], CardAuthorizeResponseDto.prototype, "resReturnReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("resAuthCode", String, true)
], CardAuthorizeResponseDto.prototype, "resAuthCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resActionCode", String, true)
], CardAuthorizeResponseDto.prototype, "resActionCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterErrorCode", String, true)
], CardAuthorizeResponseDto.prototype, "resCenterErrorCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resAuthTerm", String, true)
], CardAuthorizeResponseDto.prototype, "resAuthTerm", void 0);
__decorate([
    json2typescript_1.JsonProperty("resItemCode", String, true)
], CardAuthorizeResponseDto.prototype, "resItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resResponseData", String, true)
], CardAuthorizeResponseDto.prototype, "resResponseData", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCurrencyUnit", String, true)
], CardAuthorizeResponseDto.prototype, "reqCurrencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithNew", String, true)
], CardAuthorizeResponseDto.prototype, "reqWithNew", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerCode", String, true)
], CardAuthorizeResponseDto.prototype, "acquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("terminalId", String, true)
], CardAuthorizeResponseDto.prototype, "terminalId", void 0);
__decorate([
    json2typescript_1.JsonProperty("fraudDetectionResponse", FraudDetectionResponseDto_1.FraudDetectionResponseDto, true)
], CardAuthorizeResponseDto.prototype, "fraudDetectionResponse", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterProcessNumber", String, true)
], CardAuthorizeResponseDto.prototype, "resCenterProcessNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterSendDateTime", String, true)
], CardAuthorizeResponseDto.prototype, "resCenterSendDateTime", void 0);
__decorate([
    json2typescript_1.JsonProperty("resGiftBalance", String, true)
], CardAuthorizeResponseDto.prototype, "resGiftBalance", void 0);
__decorate([
    json2typescript_1.JsonProperty("resGiftExpire", String, true)
], CardAuthorizeResponseDto.prototype, "resGiftExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("payNowIdResponse", PayNowIdResponse_1.PayNowIdResponse, true)
], CardAuthorizeResponseDto.prototype, "payNowIdResponse", void 0);
CardAuthorizeResponseDto = __decorate([
    json2typescript_1.JsonObject("CardAuthorizeResponseDto")
], CardAuthorizeResponseDto);
exports.CardAuthorizeResponseDto = CardAuthorizeResponseDto;
//# sourceMappingURL=CardAuthorizeResponseDto.js.map