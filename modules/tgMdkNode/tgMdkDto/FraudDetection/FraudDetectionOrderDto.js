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
const FraudDetectionLineItemDto_1 = require("./FraudDetectionLineItemDto");
const FraudDetectionShipmentDto_1 = require("./FraudDetectionShipmentDto");
let FraudDetectionOrderDto = class FraudDetectionOrderDto {
};
__decorate([
    json2typescript_1.JsonProperty("id", String)
], FraudDetectionOrderDto.prototype, "id", void 0);
__decorate([
    json2typescript_1.JsonProperty("source", String)
], FraudDetectionOrderDto.prototype, "source", void 0);
__decorate([
    json2typescript_1.JsonProperty("promoCode", String)
], FraudDetectionOrderDto.prototype, "promoCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("failedPaymentAttempts", String)
], FraudDetectionOrderDto.prototype, "failedPaymentAttempts", void 0);
__decorate([
    json2typescript_1.JsonProperty("oiRepeat", String)
], FraudDetectionOrderDto.prototype, "oiRepeat", void 0);
__decorate([
    json2typescript_1.JsonProperty("lineItems", [FraudDetectionLineItemDto_1.FraudDetectionLineItemDto])
], FraudDetectionOrderDto.prototype, "lineItems", void 0);
__decorate([
    json2typescript_1.JsonProperty("shipment", FraudDetectionShipmentDto_1.FraudDetectionShipmentDto)
], FraudDetectionOrderDto.prototype, "shipment", void 0);
FraudDetectionOrderDto = __decorate([
    json2typescript_1.JsonObject("order")
], FraudDetectionOrderDto);
exports.FraudDetectionOrderDto = FraudDetectionOrderDto;
//# sourceMappingURL=FraudDetectionOrderDto.js.map