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
const FraudDetectionAuthorizationDto_1 = require("./FraudDetectionAuthorizationDto");
let FraudDetectionMethodCardDto = class FraudDetectionMethodCardDto {
};
__decorate([
    json2typescript_1.JsonProperty("type", String)
], FraudDetectionMethodCardDto.prototype, "type", void 0);
__decorate([
    json2typescript_1.JsonProperty("brand", String)
], FraudDetectionMethodCardDto.prototype, "brand", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardHolderName", String)
], FraudDetectionMethodCardDto.prototype, "cardHolderName", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardBin", String)
], FraudDetectionMethodCardDto.prototype, "cardBin", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardLastFour", String)
], FraudDetectionMethodCardDto.prototype, "cardLastFour", void 0);
__decorate([
    json2typescript_1.JsonProperty("hashedCardNumber", String)
], FraudDetectionMethodCardDto.prototype, "hashedCardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("expireDate", String)
], FraudDetectionMethodCardDto.prototype, "expireDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("tof", String)
], FraudDetectionMethodCardDto.prototype, "tof", void 0);
__decorate([
    json2typescript_1.JsonProperty("authorization", FraudDetectionAuthorizationDto_1.FraudDetectionAuthorizationDto)
], FraudDetectionMethodCardDto.prototype, "authorization", void 0);
FraudDetectionMethodCardDto = __decorate([
    json2typescript_1.JsonObject("methodCard")
], FraudDetectionMethodCardDto);
exports.FraudDetectionMethodCardDto = FraudDetectionMethodCardDto;
//# sourceMappingURL=FraudDetectionMethodCardDto.js.map