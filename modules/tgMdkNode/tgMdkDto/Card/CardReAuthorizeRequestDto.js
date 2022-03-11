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
let CardReAuthorizeRequestDto = class CardReAuthorizeRequestDto extends AbstractPaymentCreditRequestDto_1.AbstractPaymentCreditRequestDto {
    constructor() {
        super(...arguments);
        this.serviceType = "card";
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
    json2typescript_1.JsonProperty("orderId", String, true)
], CardReAuthorizeRequestDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("originalOrderId", String, true)
], CardReAuthorizeRequestDto.prototype, "originalOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String, true)
], CardReAuthorizeRequestDto.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardNumber", String, true)
], CardReAuthorizeRequestDto.prototype, "cardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardExpire", String, true)
], CardReAuthorizeRequestDto.prototype, "cardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardOptionType", String, true)
], CardReAuthorizeRequestDto.prototype, "cardOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardCenter", String, true)
], CardReAuthorizeRequestDto.prototype, "cardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerCode", String, true)
], CardReAuthorizeRequestDto.prototype, "acquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("jpo", String, true)
], CardReAuthorizeRequestDto.prototype, "jpo", void 0);
__decorate([
    json2typescript_1.JsonProperty("withCapture", String, true)
], CardReAuthorizeRequestDto.prototype, "withCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("salesDay", String, true)
], CardReAuthorizeRequestDto.prototype, "salesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemCode", String, true)
], CardReAuthorizeRequestDto.prototype, "itemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddMessageVersion", String, true)
], CardReAuthorizeRequestDto.prototype, "dddMessageVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddTransactionId", String, true)
], CardReAuthorizeRequestDto.prototype, "dddTransactionId", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddTransactionStatus", String, true)
], CardReAuthorizeRequestDto.prototype, "dddTransactionStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddCavvAlgorithm", String, true)
], CardReAuthorizeRequestDto.prototype, "dddCavvAlgorithm", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddCavv", String, true)
], CardReAuthorizeRequestDto.prototype, "dddCavv", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddEci", String, true)
], CardReAuthorizeRequestDto.prototype, "dddEci", void 0);
__decorate([
    json2typescript_1.JsonProperty("securityCode", String, true)
], CardReAuthorizeRequestDto.prototype, "securityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("authFlag", String, true)
], CardReAuthorizeRequestDto.prototype, "authFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("birthday", String, true)
], CardReAuthorizeRequestDto.prototype, "birthday", void 0);
__decorate([
    json2typescript_1.JsonProperty("tel", String, true)
], CardReAuthorizeRequestDto.prototype, "tel", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstKanaName", String, true)
], CardReAuthorizeRequestDto.prototype, "firstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("lastKanaName", String, true)
], CardReAuthorizeRequestDto.prototype, "lastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("currencyUnit", String, true)
], CardReAuthorizeRequestDto.prototype, "currencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("pin", String, true)
], CardReAuthorizeRequestDto.prototype, "pin", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstPayment", String, true)
], CardReAuthorizeRequestDto.prototype, "firstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("bonusFirstPayment", String, true)
], CardReAuthorizeRequestDto.prototype, "bonusFirstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("mcAmount", String, true)
], CardReAuthorizeRequestDto.prototype, "mcAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("posDataCode", String, true)
], CardReAuthorizeRequestDto.prototype, "posDataCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("terminalId", String, true)
], CardReAuthorizeRequestDto.prototype, "terminalId", void 0);
__decorate([
    json2typescript_1.JsonProperty("fraudDetectionRequest", String, true)
], CardReAuthorizeRequestDto.prototype, "fraudDetectionRequest", void 0);
__decorate([
    json2typescript_1.JsonProperty("withFraudDetection", String, true)
], CardReAuthorizeRequestDto.prototype, "withFraudDetection", void 0);
CardReAuthorizeRequestDto = __decorate([
    json2typescript_1.JsonObject("CardReAuthorizeRequestDto")
], CardReAuthorizeRequestDto);
exports.CardReAuthorizeRequestDto = CardReAuthorizeRequestDto;
//# sourceMappingURL=CardReAuthorizeRequestDto.js.map