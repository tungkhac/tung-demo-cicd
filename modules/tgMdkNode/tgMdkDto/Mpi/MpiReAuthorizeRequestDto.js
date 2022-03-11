// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPaymentCreditRequestDto_1 = require("../Card/AbstractPaymentCreditRequestDto");
const json2typescript_1 = require("json2typescript");
const OptionParam_1 = require("../OptionParam");
const FraudDetectionRequestDto_1 = require("../FraudDetection/FraudDetectionRequestDto");
let MpiReAuthorizeRequestDto = class MpiReAuthorizeRequestDto extends AbstractPaymentCreditRequestDto_1.AbstractPaymentCreditRequestDto {
    constructor() {
        super(...arguments);
        this.serviceType = "mpi";
        this.serviceCommand = "ReAuthorize";
    }
    get maskedLog() {
        return this._maskedLog;
    }
    set maskedLog(value) {
        this._maskedLog = value;
    }
};
__decorate([
    json2typescript_1.JsonProperty("serviceOptionType", String, true)
], MpiReAuthorizeRequestDto.prototype, "serviceOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], MpiReAuthorizeRequestDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("originalOrderId", String, true)
], MpiReAuthorizeRequestDto.prototype, "originalOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String, true)
], MpiReAuthorizeRequestDto.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardNumber", String, true)
], MpiReAuthorizeRequestDto.prototype, "cardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardExpire", String, true)
], MpiReAuthorizeRequestDto.prototype, "cardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardCenter", String, true)
], MpiReAuthorizeRequestDto.prototype, "cardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerCode", String, true)
], MpiReAuthorizeRequestDto.prototype, "acquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("jpo", String, true)
], MpiReAuthorizeRequestDto.prototype, "jpo", void 0);
__decorate([
    json2typescript_1.JsonProperty("withCapture", String, true)
], MpiReAuthorizeRequestDto.prototype, "withCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("salesDay", String, true)
], MpiReAuthorizeRequestDto.prototype, "salesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemCode", String, true)
], MpiReAuthorizeRequestDto.prototype, "itemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("securityCode", String, true)
], MpiReAuthorizeRequestDto.prototype, "securityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("birthday", String, true)
], MpiReAuthorizeRequestDto.prototype, "birthday", void 0);
__decorate([
    json2typescript_1.JsonProperty("tel", String, true)
], MpiReAuthorizeRequestDto.prototype, "tel", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstKanaName", String, true)
], MpiReAuthorizeRequestDto.prototype, "firstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("lastKanaName", String, true)
], MpiReAuthorizeRequestDto.prototype, "lastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("currencyUnit", String, true)
], MpiReAuthorizeRequestDto.prototype, "currencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("redirectionUri", String, true)
], MpiReAuthorizeRequestDto.prototype, "redirectionUri", void 0);
__decorate([
    json2typescript_1.JsonProperty("httpUserAgent", String, true)
], MpiReAuthorizeRequestDto.prototype, "httpUserAgent", void 0);
__decorate([
    json2typescript_1.JsonProperty("httpAccept", String, true)
], MpiReAuthorizeRequestDto.prototype, "httpAccept", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstPayment", String, true)
], MpiReAuthorizeRequestDto.prototype, "firstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("bonusFirstPayment", String, true)
], MpiReAuthorizeRequestDto.prototype, "bonusFirstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("mcAmount", String, true)
], MpiReAuthorizeRequestDto.prototype, "mcAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("pushUrl", String, true)
], MpiReAuthorizeRequestDto.prototype, "pushUrl", void 0);
__decorate([
    json2typescript_1.JsonProperty("browserDeviceCategory", String, true)
], MpiReAuthorizeRequestDto.prototype, "browserDeviceCategory", void 0);
__decorate([
    json2typescript_1.JsonProperty("verifyTimeout", String, true)
], MpiReAuthorizeRequestDto.prototype, "verifyTimeout", void 0);
__decorate([
    json2typescript_1.JsonProperty("fraudDetectionRequest", FraudDetectionRequestDto_1.FraudDetectionRequestDto, true)
], MpiReAuthorizeRequestDto.prototype, "fraudDetectionRequest", void 0);
__decorate([
    json2typescript_1.JsonProperty("withFraudDetection", String, true)
], MpiReAuthorizeRequestDto.prototype, "withFraudDetection", void 0);
__decorate([
    json2typescript_1.JsonProperty("optionParams", [OptionParam_1.OptionParam])
], MpiReAuthorizeRequestDto.prototype, "optionParams", void 0);
MpiReAuthorizeRequestDto = __decorate([
    json2typescript_1.JsonObject("MpiReAuthorizeRequestDto")
], MpiReAuthorizeRequestDto);
exports.MpiReAuthorizeRequestDto = MpiReAuthorizeRequestDto;
//# sourceMappingURL=MpiReAuthorizeRequestDto.js.map