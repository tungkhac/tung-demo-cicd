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
let MpiAuthorizeResponseDto = class MpiAuthorizeResponseDto extends MdkDtoBase_1.MdkDtoBase {
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
        this.mpiTransactiontype = undefined;
        this.reqCardNumber = undefined;
        this.reqCardExpire = undefined;
        this.reqAmount = undefined;
        this.reqAcquirerCode = undefined;
        this.reqItemCode = undefined;
        this.reqCardCenter = undefined;
        this.reqJpoInformation = undefined;
        this.reqSalesDay = undefined;
        this.reqWithCapture = undefined;
        this.reqSecurityCode = undefined;
        this.reqBirthday = undefined;
        this.reqTel = undefined;
        this.reqFirstKanaName = undefined;
        this.reqLastKanaName = undefined;
        this.reqCurrencyUnit = undefined;
        this.reqRedirectionUri = undefined;
        this.reqHttpUserAgent = undefined;
        this.reqHttpAccept = undefined;
        this.resResponseContents = undefined;
        this.resCorporationId = undefined;
        this.resBrandId = undefined;
        this.res3dMessageVersion = undefined;
        this.authRequestDatetime = undefined;
        this.authResponseDatetime = undefined;
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
], MpiAuthorizeResponseDto.prototype, "serviceType", void 0);
__decorate([
    json2typescript_1.JsonProperty("mstatus", String, true)
], MpiAuthorizeResponseDto.prototype, "mstatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("vResultCode", String, true)
], MpiAuthorizeResponseDto.prototype, "vResultCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("merrMsg", String, true)
], MpiAuthorizeResponseDto.prototype, "merrMsg", void 0);
__decorate([
    json2typescript_1.JsonProperty("marchTxn", String, true)
], MpiAuthorizeResponseDto.prototype, "marchTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], MpiAuthorizeResponseDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("custTxn", String, true)
], MpiAuthorizeResponseDto.prototype, "custTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("txnVersion", String, true)
], MpiAuthorizeResponseDto.prototype, "txnVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("mpiTransactiontype", String, true)
], MpiAuthorizeResponseDto.prototype, "mpiTransactiontype", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardNumber", String, true)
], MpiAuthorizeResponseDto.prototype, "reqCardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardExpire", String, true)
], MpiAuthorizeResponseDto.prototype, "reqCardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAmount", String, true)
], MpiAuthorizeResponseDto.prototype, "reqAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAcquirerCode", String, true)
], MpiAuthorizeResponseDto.prototype, "reqAcquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqItemCode", String, true)
], MpiAuthorizeResponseDto.prototype, "reqItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardCenter", String, true)
], MpiAuthorizeResponseDto.prototype, "reqCardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqJpoInformation", String, true)
], MpiAuthorizeResponseDto.prototype, "reqJpoInformation", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSalesDay", String, true)
], MpiAuthorizeResponseDto.prototype, "reqSalesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithCapture", String, true)
], MpiAuthorizeResponseDto.prototype, "reqWithCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSecurityCode", String, true)
], MpiAuthorizeResponseDto.prototype, "reqSecurityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqBirthday", String, true)
], MpiAuthorizeResponseDto.prototype, "reqBirthday", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqTel", String, true)
], MpiAuthorizeResponseDto.prototype, "reqTel", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqFirstKanaName", String, true)
], MpiAuthorizeResponseDto.prototype, "reqFirstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqLastKanaName", String, true)
], MpiAuthorizeResponseDto.prototype, "reqLastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCurrencyUnit", String, true)
], MpiAuthorizeResponseDto.prototype, "reqCurrencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqRedirectionUri", String, true)
], MpiAuthorizeResponseDto.prototype, "reqRedirectionUri", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqHttpUserAgent", String, true)
], MpiAuthorizeResponseDto.prototype, "reqHttpUserAgent", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqHttpAccept", String, true)
], MpiAuthorizeResponseDto.prototype, "reqHttpAccept", void 0);
__decorate([
    json2typescript_1.JsonProperty("resResponseContents", String, true)
], MpiAuthorizeResponseDto.prototype, "resResponseContents", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCorporationId", String, true)
], MpiAuthorizeResponseDto.prototype, "resCorporationId", void 0);
__decorate([
    json2typescript_1.JsonProperty("resBrandId", String, true)
], MpiAuthorizeResponseDto.prototype, "resBrandId", void 0);
__decorate([
    json2typescript_1.JsonProperty("res3dMessageVersion", String, true)
], MpiAuthorizeResponseDto.prototype, "res3dMessageVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("authRequestDatetime", String, true)
], MpiAuthorizeResponseDto.prototype, "authRequestDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("authResponseDatetime", String, true)
], MpiAuthorizeResponseDto.prototype, "authResponseDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("payNowIdResponse", PayNowIdResponse_1.PayNowIdResponse, true)
], MpiAuthorizeResponseDto.prototype, "payNowIdResponse", void 0);
MpiAuthorizeResponseDto = __decorate([
    json2typescript_1.JsonObject("MpiAuthorizeResponseDto")
], MpiAuthorizeResponseDto);
exports.MpiAuthorizeResponseDto = MpiAuthorizeResponseDto;
//# sourceMappingURL=MpiAuthorizeResponseDto.js.map