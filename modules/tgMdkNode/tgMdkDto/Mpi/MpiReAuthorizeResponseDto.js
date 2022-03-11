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
let MpiReAuthorizeResponseDto = class MpiReAuthorizeResponseDto extends MdkDtoBase_1.MdkDtoBase {
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
], MpiReAuthorizeResponseDto.prototype, "serviceType", void 0);
__decorate([
    json2typescript_1.JsonProperty("mstatus", String, true)
], MpiReAuthorizeResponseDto.prototype, "mstatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("vResultCode", String, true)
], MpiReAuthorizeResponseDto.prototype, "vResultCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("merrMsg", String, true)
], MpiReAuthorizeResponseDto.prototype, "merrMsg", void 0);
__decorate([
    json2typescript_1.JsonProperty("marchTxn", String, true)
], MpiReAuthorizeResponseDto.prototype, "marchTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], MpiReAuthorizeResponseDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("custTxn", String, true)
], MpiReAuthorizeResponseDto.prototype, "custTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("txnVersion", String, true)
], MpiReAuthorizeResponseDto.prototype, "txnVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("mpiTransactiontype", String, true)
], MpiReAuthorizeResponseDto.prototype, "mpiTransactiontype", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardNumber", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqCardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardExpire", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqCardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAmount", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAcquirerCode", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqAcquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqItemCode", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardCenter", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqCardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqJpoInformation", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqJpoInformation", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSalesDay", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqSalesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithCapture", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqWithCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSecurityCode", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqSecurityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqBirthday", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqBirthday", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqTel", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqTel", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqFirstKanaName", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqFirstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqLastKanaName", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqLastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCurrencyUnit", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqCurrencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqRedirectionUri", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqRedirectionUri", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqHttpUserAgent", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqHttpUserAgent", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqHttpAccept", String, true)
], MpiReAuthorizeResponseDto.prototype, "reqHttpAccept", void 0);
__decorate([
    json2typescript_1.JsonProperty("resResponseContents", String, true)
], MpiReAuthorizeResponseDto.prototype, "resResponseContents", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCorporationId", String, true)
], MpiReAuthorizeResponseDto.prototype, "resCorporationId", void 0);
__decorate([
    json2typescript_1.JsonProperty("resBrandId", String, true)
], MpiReAuthorizeResponseDto.prototype, "resBrandId", void 0);
__decorate([
    json2typescript_1.JsonProperty("res3dMessageVersion", String, true)
], MpiReAuthorizeResponseDto.prototype, "res3dMessageVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("authRequestDatetime", String, true)
], MpiReAuthorizeResponseDto.prototype, "authRequestDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("authResponseDatetime", String, true)
], MpiReAuthorizeResponseDto.prototype, "authResponseDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("payNowIdResponse", PayNowIdResponse_1.PayNowIdResponse, true)
], MpiReAuthorizeResponseDto.prototype, "payNowIdResponse", void 0);
MpiReAuthorizeResponseDto = __decorate([
    json2typescript_1.JsonObject("MpiReAuthorizeResponseDto")
], MpiReAuthorizeResponseDto);
exports.MpiReAuthorizeResponseDto = MpiReAuthorizeResponseDto;
//# sourceMappingURL=MpiReAuthorizeResponseDto.js.map