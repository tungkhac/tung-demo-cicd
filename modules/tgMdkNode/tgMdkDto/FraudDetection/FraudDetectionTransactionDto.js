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
const FraudDetectionCashValueDto_1 = require("./FraudDetectionCashValueDto");
const FraudDetectionMethodCardDto_1 = require("./FraudDetectionMethodCardDto");
let FraudDetectionTransactionDto = class FraudDetectionTransactionDto {
};
__decorate([
    json2typescript_1.JsonProperty("type", String)
], FraudDetectionTransactionDto.prototype, "type", void 0);
__decorate([
    json2typescript_1.JsonProperty("id", String)
], FraudDetectionTransactionDto.prototype, "id", void 0);
__decorate([
    json2typescript_1.JsonProperty("cashValue", FraudDetectionCashValueDto_1.FraudDetectionCashValueDto)
], FraudDetectionTransactionDto.prototype, "cashValue", void 0);
__decorate([
    json2typescript_1.JsonProperty("comment", String)
], FraudDetectionTransactionDto.prototype, "comment", void 0);
__decorate([
    json2typescript_1.JsonProperty("time", String)
], FraudDetectionTransactionDto.prototype, "time", void 0);
__decorate([
    json2typescript_1.JsonProperty("payer", String)
], FraudDetectionTransactionDto.prototype, "payer", void 0);
__decorate([
    json2typescript_1.JsonProperty("category", String)
], FraudDetectionTransactionDto.prototype, "category", void 0);
__decorate([
    json2typescript_1.JsonProperty("methodCard", FraudDetectionMethodCardDto_1.FraudDetectionMethodCardDto)
], FraudDetectionTransactionDto.prototype, "methodCard", void 0);
FraudDetectionTransactionDto = __decorate([
    json2typescript_1.JsonObject("transaction")
], FraudDetectionTransactionDto);
exports.FraudDetectionTransactionDto = FraudDetectionTransactionDto;
//# sourceMappingURL=FraudDetectionTransactionDto.js.map