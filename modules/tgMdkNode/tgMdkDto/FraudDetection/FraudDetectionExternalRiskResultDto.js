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
let FraudDetectionExternalRiskResultDto = class FraudDetectionExternalRiskResultDto {
};
__decorate([
    json2typescript_1.JsonProperty("source", String)
], FraudDetectionExternalRiskResultDto.prototype, "source", void 0);
__decorate([
    json2typescript_1.JsonProperty("score", String)
], FraudDetectionExternalRiskResultDto.prototype, "score", void 0);
__decorate([
    json2typescript_1.JsonProperty("code", String)
], FraudDetectionExternalRiskResultDto.prototype, "code", void 0);
FraudDetectionExternalRiskResultDto = __decorate([
    json2typescript_1.JsonObject("externalRiskResults")
], FraudDetectionExternalRiskResultDto);
exports.FraudDetectionExternalRiskResultDto = FraudDetectionExternalRiskResultDto;
//# sourceMappingURL=FraudDetectionExternalRiskResultDto.js.map