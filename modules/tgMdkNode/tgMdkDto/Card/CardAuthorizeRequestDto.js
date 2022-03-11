// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPaymentCreditRequestDto_1 = require("./AbstractPaymentCreditRequestDto");
const json2typescript_1 = require("json2typescript");
const OptionParam_1 = require("../OptionParam");
const FraudDetectionRequestDto_1 = require("../FraudDetection/FraudDetectionRequestDto");
let CardAuthorizeRequestDto = class CardAuthorizeRequestDto extends AbstractPaymentCreditRequestDto_1.AbstractPaymentCreditRequestDto {
    constructor() {
        super(...arguments);
        this.serviceType = "card";
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
    json2typescript_1.JsonProperty("orderId", String)
], CardAuthorizeRequestDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String)
], CardAuthorizeRequestDto.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardNumber", String)
], CardAuthorizeRequestDto.prototype, "cardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardExpire", String)
], CardAuthorizeRequestDto.prototype, "cardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardOptionType", String)
], CardAuthorizeRequestDto.prototype, "cardOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardCenter", String)
], CardAuthorizeRequestDto.prototype, "cardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerCode", String)
], CardAuthorizeRequestDto.prototype, "acquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("jpo", String)
], CardAuthorizeRequestDto.prototype, "jpo", void 0);
__decorate([
    json2typescript_1.JsonProperty("withCapture", String)
], CardAuthorizeRequestDto.prototype, "withCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("salesDay", String)
], CardAuthorizeRequestDto.prototype, "salesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemCode", String)
], CardAuthorizeRequestDto.prototype, "itemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddMessageVersion", String)
], CardAuthorizeRequestDto.prototype, "dddMessageVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddTransactionId", String)
], CardAuthorizeRequestDto.prototype, "dddTransactionId", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddTransactionStatus", String)
], CardAuthorizeRequestDto.prototype, "dddTransactionStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddCavvAlgorithm", String)
], CardAuthorizeRequestDto.prototype, "dddCavvAlgorithm", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddCavv", String)
], CardAuthorizeRequestDto.prototype, "dddCavv", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddEci", String)
], CardAuthorizeRequestDto.prototype, "dddEci", void 0);
__decorate([
    json2typescript_1.JsonProperty("securityCode", String)
], CardAuthorizeRequestDto.prototype, "securityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("authFlag", String)
], CardAuthorizeRequestDto.prototype, "authFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("birthday", String)
], CardAuthorizeRequestDto.prototype, "birthday", void 0);
__decorate([
    json2typescript_1.JsonProperty("tel", String)
], CardAuthorizeRequestDto.prototype, "tel", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstKanaName", String)
], CardAuthorizeRequestDto.prototype, "firstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("lastKanaName", String)
], CardAuthorizeRequestDto.prototype, "lastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("currencyUnit", String)
], CardAuthorizeRequestDto.prototype, "currencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("pin", String)
], CardAuthorizeRequestDto.prototype, "pin", void 0);
__decorate([
    json2typescript_1.JsonProperty("paymentType", String)
], CardAuthorizeRequestDto.prototype, "paymentType", void 0);
__decorate([
    json2typescript_1.JsonProperty("jis1SecondTrack", String)
], CardAuthorizeRequestDto.prototype, "jis1SecondTrack", void 0);
__decorate([
    json2typescript_1.JsonProperty("jis2Track", String)
], CardAuthorizeRequestDto.prototype, "jis2Track", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstPayment", String)
], CardAuthorizeRequestDto.prototype, "firstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("bonusFirstPayment", String)
], CardAuthorizeRequestDto.prototype, "bonusFirstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("mcAmount", String)
], CardAuthorizeRequestDto.prototype, "mcAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("posDataCode", String)
], CardAuthorizeRequestDto.prototype, "posDataCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("terminalId", String)
], CardAuthorizeRequestDto.prototype, "terminalId", void 0);
__decorate([
    json2typescript_1.JsonProperty("fraudDetectionRequest", FraudDetectionRequestDto_1.FraudDetectionRequestDto)
], CardAuthorizeRequestDto.prototype, "fraudDetectionRequest", void 0);
__decorate([
    json2typescript_1.JsonProperty("withFraudDetection", String)
], CardAuthorizeRequestDto.prototype, "withFraudDetection", void 0);
__decorate([
    json2typescript_1.JsonProperty("chipConditionCode", String)
], CardAuthorizeRequestDto.prototype, "chipConditionCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("optionParams", [OptionParam_1.OptionParam])
], CardAuthorizeRequestDto.prototype, "optionParams", void 0);
CardAuthorizeRequestDto = __decorate([
    json2typescript_1.JsonObject("CardAuthorizeRequestDto")
], CardAuthorizeRequestDto);
exports.CardAuthorizeRequestDto = CardAuthorizeRequestDto;
//# sourceMappingURL=CardAuthorizeRequestDto.js.map