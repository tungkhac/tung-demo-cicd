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
let MpiAuthorizeRequestDto = class MpiAuthorizeRequestDto extends AbstractPaymentCreditRequestDto_1.AbstractPaymentCreditRequestDto {
    constructor() {
        super(...arguments);
        this.serviceType = "mpi";
        this.serviceCommand = "Authorize";
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
], MpiAuthorizeRequestDto.prototype, "serviceOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], MpiAuthorizeRequestDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String, true)
], MpiAuthorizeRequestDto.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardNumber", String, true)
], MpiAuthorizeRequestDto.prototype, "cardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardExpire", String, true)
], MpiAuthorizeRequestDto.prototype, "cardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardCenter", String, true)
], MpiAuthorizeRequestDto.prototype, "cardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerCode", String, true)
], MpiAuthorizeRequestDto.prototype, "acquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("jpo", String, true)
], MpiAuthorizeRequestDto.prototype, "jpo", void 0);
__decorate([
    json2typescript_1.JsonProperty("withCapture", String, true)
], MpiAuthorizeRequestDto.prototype, "withCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("salesDay", String, true)
], MpiAuthorizeRequestDto.prototype, "salesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemCode", String, true)
], MpiAuthorizeRequestDto.prototype, "itemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("securityCode", String, true)
], MpiAuthorizeRequestDto.prototype, "securityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("birthday", String, true)
], MpiAuthorizeRequestDto.prototype, "birthday", void 0);
__decorate([
    json2typescript_1.JsonProperty("tel", String, true)
], MpiAuthorizeRequestDto.prototype, "tel", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstKanaName", String, true)
], MpiAuthorizeRequestDto.prototype, "firstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("lastKanaName", String, true)
], MpiAuthorizeRequestDto.prototype, "lastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("currencyUnit", String, true)
], MpiAuthorizeRequestDto.prototype, "currencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("redirectionUri", String, true)
], MpiAuthorizeRequestDto.prototype, "redirectionUri", void 0);
__decorate([
    json2typescript_1.JsonProperty("httpUserAgent", String, true)
], MpiAuthorizeRequestDto.prototype, "httpUserAgent", void 0);
__decorate([
    json2typescript_1.JsonProperty("httpAccept", String, true)
], MpiAuthorizeRequestDto.prototype, "httpAccept", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstPayment", String, true)
], MpiAuthorizeRequestDto.prototype, "firstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("bonusFirstPayment", String, true)
], MpiAuthorizeRequestDto.prototype, "bonusFirstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("mcAmount", String, true)
], MpiAuthorizeRequestDto.prototype, "mcAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("pushUrl", String, true)
], MpiAuthorizeRequestDto.prototype, "pushUrl", void 0);
__decorate([
    json2typescript_1.JsonProperty("browserDeviceCategory", String, true)
], MpiAuthorizeRequestDto.prototype, "browserDeviceCategory", void 0);
__decorate([
    json2typescript_1.JsonProperty("tempRegistration", String, true)
], MpiAuthorizeRequestDto.prototype, "tempRegistration", void 0);
__decorate([
    json2typescript_1.JsonProperty("verifyTimeout", String, true)
], MpiAuthorizeRequestDto.prototype, "verifyTimeout", void 0);
__decorate([
    json2typescript_1.JsonProperty("fraudDetectionRequest", FraudDetectionRequestDto_1.FraudDetectionRequestDto, true)
], MpiAuthorizeRequestDto.prototype, "fraudDetectionRequest", void 0);
__decorate([
    json2typescript_1.JsonProperty("withFraudDetection", String, true)
], MpiAuthorizeRequestDto.prototype, "withFraudDetection", void 0);
__decorate([
    json2typescript_1.JsonProperty("optionParams", [OptionParam_1.OptionParam])
], MpiAuthorizeRequestDto.prototype, "optionParams", void 0);
MpiAuthorizeRequestDto = __decorate([
    json2typescript_1.JsonObject("MpiAuthorizeRequestDto")
], MpiAuthorizeRequestDto);
exports.MpiAuthorizeRequestDto = MpiAuthorizeRequestDto;
//# sourceMappingURL=MpiAuthorizeRequestDto.js.map