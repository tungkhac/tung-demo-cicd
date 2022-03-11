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
let CardCaptureRequestDto = class CardCaptureRequestDto extends AbstractPaymentCreditRequestDto_1.AbstractPaymentCreditRequestDto {
    constructor() {
        super(...arguments);
        this.serviceType = "card";
        this.serviceCommand = "Capture";
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
], CardCaptureRequestDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String, true)
], CardCaptureRequestDto.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardNumber", String, true)
], CardCaptureRequestDto.prototype, "cardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardExpire", String, true)
], CardCaptureRequestDto.prototype, "cardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardOptionType", String, true)
], CardCaptureRequestDto.prototype, "cardOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerCode", String, true)
], CardCaptureRequestDto.prototype, "acquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("salesDay", String, true)
], CardCaptureRequestDto.prototype, "salesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemCode", String, true)
], CardCaptureRequestDto.prototype, "itemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("withDirect", String, true)
], CardCaptureRequestDto.prototype, "withDirect", void 0);
__decorate([
    json2typescript_1.JsonProperty("authCode", String, true)
], CardCaptureRequestDto.prototype, "authCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("currencyUnit", String, true)
], CardCaptureRequestDto.prototype, "currencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("jpo", String, true)
], CardCaptureRequestDto.prototype, "jpo", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstPayment", String, true)
], CardCaptureRequestDto.prototype, "firstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("bonusFirstPayment", String, true)
], CardCaptureRequestDto.prototype, "bonusFirstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("mcAmount", String, true)
], CardCaptureRequestDto.prototype, "mcAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("terminalId", String, true)
], CardCaptureRequestDto.prototype, "terminalId", void 0);
CardCaptureRequestDto = __decorate([
    json2typescript_1.JsonObject("CardCaptureRequestDto")
], CardCaptureRequestDto);
exports.CardCaptureRequestDto = CardCaptureRequestDto;
//# sourceMappingURL=CardCaptureRequestDto.js.map