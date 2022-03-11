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
const FraudDetectionResponseDto_1 = require("../FraudDetection/FraudDetectionResponseDto");
let CardReAuthorizeResponseDto = class CardReAuthorizeResponseDto extends MdkDtoBase_1.MdkDtoBase {
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
        this.cardTransactiontype = undefined;
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
], CardReAuthorizeResponseDto.prototype, "serviceType", void 0);
__decorate([
    json2typescript_1.JsonProperty("mstatus", String, true)
], CardReAuthorizeResponseDto.prototype, "mstatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("vResultCode", String, true)
], CardReAuthorizeResponseDto.prototype, "vResultCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("merrMsg", String, true)
], CardReAuthorizeResponseDto.prototype, "merrMsg", void 0);
__decorate([
    json2typescript_1.JsonProperty("marchTxn", String, true)
], CardReAuthorizeResponseDto.prototype, "marchTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], CardReAuthorizeResponseDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("custTxn", String, true)
], CardReAuthorizeResponseDto.prototype, "custTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("txnVersion", String, true)
], CardReAuthorizeResponseDto.prototype, "txnVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardTransactiontype", String, true)
], CardReAuthorizeResponseDto.prototype, "cardTransactiontype", void 0);
__decorate([
    json2typescript_1.JsonProperty("gatewayRequestDate", String, true)
], CardReAuthorizeResponseDto.prototype, "gatewayRequestDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("gatewayResponseDate", String, true)
], CardReAuthorizeResponseDto.prototype, "gatewayResponseDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerRequestDate", String, true)
], CardReAuthorizeResponseDto.prototype, "centerRequestDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerResponseDate", String, true)
], CardReAuthorizeResponseDto.prototype, "centerResponseDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("pending", String, true)
], CardReAuthorizeResponseDto.prototype, "pending", void 0);
__decorate([
    json2typescript_1.JsonProperty("loopback", String, true)
], CardReAuthorizeResponseDto.prototype, "loopback", void 0);
__decorate([
    json2typescript_1.JsonProperty("connectedCenterId", String, true)
], CardReAuthorizeResponseDto.prototype, "connectedCenterId", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerRequestNumber", String, true)
], CardReAuthorizeResponseDto.prototype, "centerRequestNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerReferenceNumber", String, true)
], CardReAuthorizeResponseDto.prototype, "centerReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardNumber", String, true)
], CardReAuthorizeResponseDto.prototype, "reqCardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardExpire", String, true)
], CardReAuthorizeResponseDto.prototype, "reqCardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardOptionType", String, true)
], CardReAuthorizeResponseDto.prototype, "reqCardOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAmount", String, true)
], CardReAuthorizeResponseDto.prototype, "reqAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqMerchantTransaction", String, true)
], CardReAuthorizeResponseDto.prototype, "reqMerchantTransaction", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqReturnReferenceNumber", String, true)
], CardReAuthorizeResponseDto.prototype, "reqReturnReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAuthCode", String, true)
], CardReAuthorizeResponseDto.prototype, "reqAuthCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAcquirerCode", String, true)
], CardReAuthorizeResponseDto.prototype, "reqAcquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqItemCode", String, true)
], CardReAuthorizeResponseDto.prototype, "reqItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardCenter", String, true)
], CardReAuthorizeResponseDto.prototype, "reqCardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqJpoInformation", String, true)
], CardReAuthorizeResponseDto.prototype, "reqJpoInformation", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSalesDay", String, true)
], CardReAuthorizeResponseDto.prototype, "reqSalesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCancelDay", String, true)
], CardReAuthorizeResponseDto.prototype, "reqCancelDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithCapture", String, true)
], CardReAuthorizeResponseDto.prototype, "reqWithCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithDirect", String, true)
], CardReAuthorizeResponseDto.prototype, "reqWithDirect", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dMessageVersion", String, true)
], CardReAuthorizeResponseDto.prototype, "req3dMessageVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dTransactionId", String, true)
], CardReAuthorizeResponseDto.prototype, "req3dTransactionId", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dTransactionStatus", String, true)
], CardReAuthorizeResponseDto.prototype, "req3dTransactionStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dCavvAlgorithm", String, true)
], CardReAuthorizeResponseDto.prototype, "req3dCavvAlgorithm", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dCavv", String, true)
], CardReAuthorizeResponseDto.prototype, "req3dCavv", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dEci", String, true)
], CardReAuthorizeResponseDto.prototype, "req3dEci", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSecurityCode", String, true)
], CardReAuthorizeResponseDto.prototype, "reqSecurityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAuthFlag", String, true)
], CardReAuthorizeResponseDto.prototype, "reqAuthFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqBirthday", String, true)
], CardReAuthorizeResponseDto.prototype, "reqBirthday", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqTel", String, true)
], CardReAuthorizeResponseDto.prototype, "reqTel", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqFirstKanaName", String, true)
], CardReAuthorizeResponseDto.prototype, "reqFirstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqLastKanaName", String, true)
], CardReAuthorizeResponseDto.prototype, "reqLastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("resMerchantTransaction", String, true)
], CardReAuthorizeResponseDto.prototype, "resMerchantTransaction", void 0);
__decorate([
    json2typescript_1.JsonProperty("resReturnReferenceNumber", String, true)
], CardReAuthorizeResponseDto.prototype, "resReturnReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("resAuthCode", String, true)
], CardReAuthorizeResponseDto.prototype, "resAuthCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resActionCode", String, true)
], CardReAuthorizeResponseDto.prototype, "resActionCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterErrorCode", String, true)
], CardReAuthorizeResponseDto.prototype, "resCenterErrorCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resAuthTerm", String, true)
], CardReAuthorizeResponseDto.prototype, "resAuthTerm", void 0);
__decorate([
    json2typescript_1.JsonProperty("resItemCode", String, true)
], CardReAuthorizeResponseDto.prototype, "resItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resResponseData", String, true)
], CardReAuthorizeResponseDto.prototype, "resResponseData", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCurrencyUnit", String, true)
], CardReAuthorizeResponseDto.prototype, "reqCurrencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithNew", String, true)
], CardReAuthorizeResponseDto.prototype, "reqWithNew", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerCode", String, true)
], CardReAuthorizeResponseDto.prototype, "acquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("terminalId", String, true)
], CardReAuthorizeResponseDto.prototype, "terminalId", void 0);
__decorate([
    json2typescript_1.JsonProperty("fraudDetectionResponse", FraudDetectionResponseDto_1.FraudDetectionResponseDto, true)
], CardReAuthorizeResponseDto.prototype, "fraudDetectionResponse", void 0);
CardReAuthorizeResponseDto = __decorate([
    json2typescript_1.JsonObject("CardReAuthorizeResponseDto")
], CardReAuthorizeResponseDto);
exports.CardReAuthorizeResponseDto = CardReAuthorizeResponseDto;
//# sourceMappingURL=CardReAuthorizeResponseDto.js.map