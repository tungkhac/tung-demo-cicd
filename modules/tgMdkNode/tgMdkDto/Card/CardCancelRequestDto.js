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
let CardCancelRequestDto = class CardCancelRequestDto extends AbstractPaymentCreditRequestDto_1.AbstractPaymentCreditRequestDto {
    constructor() {
        super(...arguments);
        this.serviceType = "card";
        this.serviceCommand = "Cancel";
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
], CardCancelRequestDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("originalOrderId", String, true)
], CardCancelRequestDto.prototype, "originalOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String, true)
], CardCancelRequestDto.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardNumber", String, true)
], CardCancelRequestDto.prototype, "cardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardExpire", String, true)
], CardCancelRequestDto.prototype, "cardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardOptionType", String, true)
], CardCancelRequestDto.prototype, "cardOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardCenter", String, true)
], CardCancelRequestDto.prototype, "cardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerCode", String, true)
], CardCancelRequestDto.prototype, "acquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("withNew", String, true)
], CardCancelRequestDto.prototype, "withNew", void 0);
__decorate([
    json2typescript_1.JsonProperty("withDirect", String, true)
], CardCancelRequestDto.prototype, "withDirect", void 0);
__decorate([
    json2typescript_1.JsonProperty("cancelDay", String, true)
], CardCancelRequestDto.prototype, "cancelDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemCode", String, true)
], CardCancelRequestDto.prototype, "itemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("currencyUnit", String, true)
], CardCancelRequestDto.prototype, "currencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("salesDay", String, true)
], CardCancelRequestDto.prototype, "salesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("pin", String, true)
], CardCancelRequestDto.prototype, "pin", void 0);
__decorate([
    json2typescript_1.JsonProperty("paymentType", String, true)
], CardCancelRequestDto.prototype, "paymentType", void 0);
__decorate([
    json2typescript_1.JsonProperty("jis1SecondTrack", String, true)
], CardCancelRequestDto.prototype, "jis1SecondTrack", void 0);
__decorate([
    json2typescript_1.JsonProperty("jis2Track", String, true)
], CardCancelRequestDto.prototype, "jis2Track", void 0);
__decorate([
    json2typescript_1.JsonProperty("useOriginalOrder", String, true)
], CardCancelRequestDto.prototype, "useOriginalOrder", void 0);
__decorate([
    json2typescript_1.JsonProperty("jpo", String, true)
], CardCancelRequestDto.prototype, "jpo", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstPayment", String, true)
], CardCancelRequestDto.prototype, "firstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("bonusFirstPayment", String, true)
], CardCancelRequestDto.prototype, "bonusFirstPayment", void 0);
__decorate([
    json2typescript_1.JsonProperty("withDirectOnFailure", String, true)
], CardCancelRequestDto.prototype, "withDirectOnFailure", void 0);
__decorate([
    json2typescript_1.JsonProperty("mcAmount", String, true)
], CardCancelRequestDto.prototype, "mcAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("posDataCode", String, true)
], CardCancelRequestDto.prototype, "posDataCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("terminalId", String, true)
], CardCancelRequestDto.prototype, "terminalId", void 0);
__decorate([
    json2typescript_1.JsonProperty("chipConditionCode", String, true)
], CardCancelRequestDto.prototype, "chipConditionCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("optionParams", [OptionParam_1.OptionParam])
], CardCancelRequestDto.prototype, "optionParams", void 0);
CardCancelRequestDto = __decorate([
    json2typescript_1.JsonObject("CardCancelRequestDto")
], CardCancelRequestDto);
exports.CardCancelRequestDto = CardCancelRequestDto;
//# sourceMappingURL=CardCancelRequestDto.js.map