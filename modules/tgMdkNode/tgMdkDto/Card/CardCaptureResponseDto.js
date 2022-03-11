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
let CardCaptureResponseDto = class CardCaptureResponseDto extends MdkDtoBase_1.MdkDtoBase {
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
        this.resCenterProcessNumber = undefined;
        this.resCenterSendDateTime = undefined;
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
], CardCaptureResponseDto.prototype, "serviceType", void 0);
__decorate([
    json2typescript_1.JsonProperty("mstatus", String, true)
], CardCaptureResponseDto.prototype, "mstatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("vResultCode", String, true)
], CardCaptureResponseDto.prototype, "vResultCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("merrMsg", String, true)
], CardCaptureResponseDto.prototype, "merrMsg", void 0);
__decorate([
    json2typescript_1.JsonProperty("marchTxn", String, true)
], CardCaptureResponseDto.prototype, "marchTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], CardCaptureResponseDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("custTxn", String, true)
], CardCaptureResponseDto.prototype, "custTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("txnVersion", String, true)
], CardCaptureResponseDto.prototype, "txnVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardTransactiontype", String, true)
], CardCaptureResponseDto.prototype, "cardTransactiontype", void 0);
__decorate([
    json2typescript_1.JsonProperty("gatewayRequestDate", String, true)
], CardCaptureResponseDto.prototype, "gatewayRequestDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("gatewayResponseDate", String, true)
], CardCaptureResponseDto.prototype, "gatewayResponseDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerRequestDate", String, true)
], CardCaptureResponseDto.prototype, "centerRequestDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerResponseDate", String, true)
], CardCaptureResponseDto.prototype, "centerResponseDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("pending", String, true)
], CardCaptureResponseDto.prototype, "pending", void 0);
__decorate([
    json2typescript_1.JsonProperty("loopback", String, true)
], CardCaptureResponseDto.prototype, "loopback", void 0);
__decorate([
    json2typescript_1.JsonProperty("connectedCenterId", String, true)
], CardCaptureResponseDto.prototype, "connectedCenterId", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerRequestNumber", String, true)
], CardCaptureResponseDto.prototype, "centerRequestNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerReferenceNumber", String, true)
], CardCaptureResponseDto.prototype, "centerReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardNumber", String, true)
], CardCaptureResponseDto.prototype, "reqCardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardExpire", String, true)
], CardCaptureResponseDto.prototype, "reqCardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardOptionType", String, true)
], CardCaptureResponseDto.prototype, "reqCardOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAmount", String, true)
], CardCaptureResponseDto.prototype, "reqAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqMerchantTransaction", String, true)
], CardCaptureResponseDto.prototype, "reqMerchantTransaction", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqReturnReferenceNumber", String, true)
], CardCaptureResponseDto.prototype, "reqReturnReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAuthCode", String, true)
], CardCaptureResponseDto.prototype, "reqAuthCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAcquirerCode", String, true)
], CardCaptureResponseDto.prototype, "reqAcquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqItemCode", String, true)
], CardCaptureResponseDto.prototype, "reqItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardCenter", String, true)
], CardCaptureResponseDto.prototype, "reqCardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqJpoInformation", String, true)
], CardCaptureResponseDto.prototype, "reqJpoInformation", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSalesDay", String, true)
], CardCaptureResponseDto.prototype, "reqSalesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCancelDay", String, true)
], CardCaptureResponseDto.prototype, "reqCancelDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithCapture", String, true)
], CardCaptureResponseDto.prototype, "reqWithCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithDirect", String, true)
], CardCaptureResponseDto.prototype, "reqWithDirect", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dMessageVersion", String, true)
], CardCaptureResponseDto.prototype, "req3dMessageVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dTransactionId", String, true)
], CardCaptureResponseDto.prototype, "req3dTransactionId", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dTransactionStatus", String, true)
], CardCaptureResponseDto.prototype, "req3dTransactionStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dCavvAlgorithm", String, true)
], CardCaptureResponseDto.prototype, "req3dCavvAlgorithm", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dCavv", String, true)
], CardCaptureResponseDto.prototype, "req3dCavv", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dEci", String, true)
], CardCaptureResponseDto.prototype, "req3dEci", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSecurityCode", String, true)
], CardCaptureResponseDto.prototype, "reqSecurityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAuthFlag", String, true)
], CardCaptureResponseDto.prototype, "reqAuthFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqBirthday", String, true)
], CardCaptureResponseDto.prototype, "reqBirthday", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqTel", String, true)
], CardCaptureResponseDto.prototype, "reqTel", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqFirstKanaName", String, true)
], CardCaptureResponseDto.prototype, "reqFirstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqLastKanaName", String, true)
], CardCaptureResponseDto.prototype, "reqLastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("resMerchantTransaction", String, true)
], CardCaptureResponseDto.prototype, "resMerchantTransaction", void 0);
__decorate([
    json2typescript_1.JsonProperty("resReturnReferenceNumber", String, true)
], CardCaptureResponseDto.prototype, "resReturnReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("resAuthCode", String, true)
], CardCaptureResponseDto.prototype, "resAuthCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resActionCode", String, true)
], CardCaptureResponseDto.prototype, "resActionCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterErrorCode", String, true)
], CardCaptureResponseDto.prototype, "resCenterErrorCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resAuthTerm", String, true)
], CardCaptureResponseDto.prototype, "resAuthTerm", void 0);
__decorate([
    json2typescript_1.JsonProperty("resItemCode", String, true)
], CardCaptureResponseDto.prototype, "resItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resResponseData", String, true)
], CardCaptureResponseDto.prototype, "resResponseData", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCurrencyUnit", String, true)
], CardCaptureResponseDto.prototype, "reqCurrencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithNew", String, true)
], CardCaptureResponseDto.prototype, "reqWithNew", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerCode", String, true)
], CardCaptureResponseDto.prototype, "acquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("terminalId", String, true)
], CardCaptureResponseDto.prototype, "terminalId", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterProcessNumber", String, true)
], CardCaptureResponseDto.prototype, "resCenterProcessNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterSendDateTime", String, true)
], CardCaptureResponseDto.prototype, "resCenterSendDateTime", void 0);
CardCaptureResponseDto = __decorate([
    json2typescript_1.JsonObject("CardCaptureResponseDto")
], CardCaptureResponseDto);
exports.CardCaptureResponseDto = CardCaptureResponseDto;
//# sourceMappingURL=CardCaptureResponseDto.js.map