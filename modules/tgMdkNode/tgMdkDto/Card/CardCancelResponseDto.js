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
let CardCancelResponseDto = class CardCancelResponseDto extends MdkDtoBase_1.MdkDtoBase {
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
        this.resGiftBalance = undefined;
        this.resGiftExpire = undefined;
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
], CardCancelResponseDto.prototype, "serviceType", void 0);
__decorate([
    json2typescript_1.JsonProperty("mstatus", String, true)
], CardCancelResponseDto.prototype, "mstatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("vResultCode", String, true)
], CardCancelResponseDto.prototype, "vResultCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("merrMsg", String, true)
], CardCancelResponseDto.prototype, "merrMsg", void 0);
__decorate([
    json2typescript_1.JsonProperty("marchTxn", String, true)
], CardCancelResponseDto.prototype, "marchTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], CardCancelResponseDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("custTxn", String, true)
], CardCancelResponseDto.prototype, "custTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("txnVersion", String, true)
], CardCancelResponseDto.prototype, "txnVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardTransactiontype", String, true)
], CardCancelResponseDto.prototype, "cardTransactiontype", void 0);
__decorate([
    json2typescript_1.JsonProperty("gatewayRequestDate", String, true)
], CardCancelResponseDto.prototype, "gatewayRequestDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("gatewayResponseDate", String, true)
], CardCancelResponseDto.prototype, "gatewayResponseDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerRequestDate", String, true)
], CardCancelResponseDto.prototype, "centerRequestDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerResponseDate", String, true)
], CardCancelResponseDto.prototype, "centerResponseDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("pending", String, true)
], CardCancelResponseDto.prototype, "pending", void 0);
__decorate([
    json2typescript_1.JsonProperty("loopback", String, true)
], CardCancelResponseDto.prototype, "loopback", void 0);
__decorate([
    json2typescript_1.JsonProperty("connectedCenterId", String, true)
], CardCancelResponseDto.prototype, "connectedCenterId", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerRequestNumber", String, true)
], CardCancelResponseDto.prototype, "centerRequestNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerReferenceNumber", String, true)
], CardCancelResponseDto.prototype, "centerReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardNumber", String, true)
], CardCancelResponseDto.prototype, "reqCardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardExpire", String, true)
], CardCancelResponseDto.prototype, "reqCardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardOptionType", String, true)
], CardCancelResponseDto.prototype, "reqCardOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAmount", String, true)
], CardCancelResponseDto.prototype, "reqAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqMerchantTransaction", String, true)
], CardCancelResponseDto.prototype, "reqMerchantTransaction", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqReturnReferenceNumber", String, true)
], CardCancelResponseDto.prototype, "reqReturnReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAuthCode", String, true)
], CardCancelResponseDto.prototype, "reqAuthCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAcquirerCode", String, true)
], CardCancelResponseDto.prototype, "reqAcquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqItemCode", String, true)
], CardCancelResponseDto.prototype, "reqItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardCenter", String, true)
], CardCancelResponseDto.prototype, "reqCardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqJpoInformation", String, true)
], CardCancelResponseDto.prototype, "reqJpoInformation", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSalesDay", String, true)
], CardCancelResponseDto.prototype, "reqSalesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCancelDay", String, true)
], CardCancelResponseDto.prototype, "reqCancelDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithCapture", String, true)
], CardCancelResponseDto.prototype, "reqWithCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithDirect", String, true)
], CardCancelResponseDto.prototype, "reqWithDirect", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dMessageVersion", String, true)
], CardCancelResponseDto.prototype, "req3dMessageVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dTransactionId", String, true)
], CardCancelResponseDto.prototype, "req3dTransactionId", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dTransactionStatus", String, true)
], CardCancelResponseDto.prototype, "req3dTransactionStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dCavvAlgorithm", String, true)
], CardCancelResponseDto.prototype, "req3dCavvAlgorithm", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dCavv", String, true)
], CardCancelResponseDto.prototype, "req3dCavv", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dEci", String, true)
], CardCancelResponseDto.prototype, "req3dEci", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSecurityCode", String, true)
], CardCancelResponseDto.prototype, "reqSecurityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAuthFlag", String, true)
], CardCancelResponseDto.prototype, "reqAuthFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqBirthday", String, true)
], CardCancelResponseDto.prototype, "reqBirthday", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqTel", String, true)
], CardCancelResponseDto.prototype, "reqTel", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqFirstKanaName", String, true)
], CardCancelResponseDto.prototype, "reqFirstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqLastKanaName", String, true)
], CardCancelResponseDto.prototype, "reqLastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("resMerchantTransaction", String, true)
], CardCancelResponseDto.prototype, "resMerchantTransaction", void 0);
__decorate([
    json2typescript_1.JsonProperty("resReturnReferenceNumber", String, true)
], CardCancelResponseDto.prototype, "resReturnReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("resAuthCode", String, true)
], CardCancelResponseDto.prototype, "resAuthCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resActionCode", String, true)
], CardCancelResponseDto.prototype, "resActionCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterErrorCode", String, true)
], CardCancelResponseDto.prototype, "resCenterErrorCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resAuthTerm", String, true)
], CardCancelResponseDto.prototype, "resAuthTerm", void 0);
__decorate([
    json2typescript_1.JsonProperty("resItemCode", String, true)
], CardCancelResponseDto.prototype, "resItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resResponseData", String, true)
], CardCancelResponseDto.prototype, "resResponseData", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCurrencyUnit", String, true)
], CardCancelResponseDto.prototype, "reqCurrencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithNew", String, true)
], CardCancelResponseDto.prototype, "reqWithNew", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerCode", String, true)
], CardCancelResponseDto.prototype, "acquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("terminalId", String, true)
], CardCancelResponseDto.prototype, "terminalId", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterProcessNumber", String, true)
], CardCancelResponseDto.prototype, "resCenterProcessNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterSendDateTime", String, true)
], CardCancelResponseDto.prototype, "resCenterSendDateTime", void 0);
__decorate([
    json2typescript_1.JsonProperty("resGiftBalance", String, true)
], CardCancelResponseDto.prototype, "resGiftBalance", void 0);
__decorate([
    json2typescript_1.JsonProperty("resGiftExpire", String, true)
], CardCancelResponseDto.prototype, "resGiftExpire", void 0);
CardCancelResponseDto = __decorate([
    json2typescript_1.JsonObject("CardCancelResponseDto")
], CardCancelResponseDto);
exports.CardCancelResponseDto = CardCancelResponseDto;
//# sourceMappingURL=CardCancelResponseDto.js.map