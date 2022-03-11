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
const FraudDetectionCostDto_1 = require("./FraudDetectionCostDto");
let FraudDetectionShipmentDto = class FraudDetectionShipmentDto {
};
__decorate([
    json2typescript_1.JsonProperty("recipient", String)
], FraudDetectionShipmentDto.prototype, "recipient", void 0);
__decorate([
    json2typescript_1.JsonProperty("shipTypeCd", String)
], FraudDetectionShipmentDto.prototype, "shipTypeCd", void 0);
__decorate([
    json2typescript_1.JsonProperty("scheduledShipTime", String)
], FraudDetectionShipmentDto.prototype, "scheduledShipTime", void 0);
__decorate([
    json2typescript_1.JsonProperty("insured", String)
], FraudDetectionShipmentDto.prototype, "insured", void 0);
__decorate([
    json2typescript_1.JsonProperty("method", String)
], FraudDetectionShipmentDto.prototype, "method", void 0);
__decorate([
    json2typescript_1.JsonProperty("comment", String)
], FraudDetectionShipmentDto.prototype, "comment", void 0);
__decorate([
    json2typescript_1.JsonProperty("trackingNumber", String)
], FraudDetectionShipmentDto.prototype, "trackingNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("cost", FraudDetectionCostDto_1.FraudDetectionCostDto)
], FraudDetectionShipmentDto.prototype, "cost", void 0);
__decorate([
    json2typescript_1.JsonProperty("lineItems", [String])
], FraudDetectionShipmentDto.prototype, "lineItems", void 0);
FraudDetectionShipmentDto = __decorate([
    json2typescript_1.JsonObject("shipment")
], FraudDetectionShipmentDto);
exports.FraudDetectionShipmentDto = FraudDetectionShipmentDto;
//# sourceMappingURL=FraudDetectionShipmentDto.js.map