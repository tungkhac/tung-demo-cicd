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
let FraudDetectionRdResponseDto = class FraudDetectionRdResponseDto {
    constructor() {
        this.code = undefined;
        this.requestId = undefined;
        this.orderId = undefined;
        this.riskStatusCode = undefined;
        this.riskFraudStatusCode = undefined;
        this.riskResponseCode = undefined;
        this.riskOrderId = undefined;
        this.riskNeuralScore = undefined;
        this.riskRuleCategory = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("code", String, true)
], FraudDetectionRdResponseDto.prototype, "code", void 0);
__decorate([
    json2typescript_1.JsonProperty("requestId", String, true)
], FraudDetectionRdResponseDto.prototype, "requestId", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], FraudDetectionRdResponseDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("riskStatusCode", String, true)
], FraudDetectionRdResponseDto.prototype, "riskStatusCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("riskFraudStatusCode", String, true)
], FraudDetectionRdResponseDto.prototype, "riskFraudStatusCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("riskResponseCode", String, true)
], FraudDetectionRdResponseDto.prototype, "riskResponseCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("riskOrderId", String, true)
], FraudDetectionRdResponseDto.prototype, "riskOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("riskNeuralScore", String, true)
], FraudDetectionRdResponseDto.prototype, "riskNeuralScore", void 0);
__decorate([
    json2typescript_1.JsonProperty("riskRuleCategory", String, true)
], FraudDetectionRdResponseDto.prototype, "riskRuleCategory", void 0);
FraudDetectionRdResponseDto = __decorate([
    json2typescript_1.JsonObject("FraudDetectionRdResponseDto")
], FraudDetectionRdResponseDto);
exports.FraudDetectionRdResponseDto = FraudDetectionRdResponseDto;
//# sourceMappingURL=FraudDetectionRdResponseDto.js.map