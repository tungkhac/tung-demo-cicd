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
const FraudDetectionCbWarningDto_1 = require("./FraudDetectionCbWarningDto");
let FraudDetectionCbResponseDto = class FraudDetectionCbResponseDto {
    constructor() {
        this.id = undefined;
        this.modelCode = undefined;
        this.modelVersion = undefined;
        this.orgCode = undefined;
        this.time = undefined;
        this.score = undefined;
        this.deviceId = undefined;
        this.tdl = undefined;
        this.systemResponse = undefined;
        this.fulfillmentAction = undefined;
        this.auditTrail = undefined;
        this.riskLevel = undefined;
        this.warnings = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("id", String, true)
], FraudDetectionCbResponseDto.prototype, "id", void 0);
__decorate([
    json2typescript_1.JsonProperty("modelCode", String, true)
], FraudDetectionCbResponseDto.prototype, "modelCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("modelVersion", String, true)
], FraudDetectionCbResponseDto.prototype, "modelVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("orgCode", String, true)
], FraudDetectionCbResponseDto.prototype, "orgCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("time", String, true)
], FraudDetectionCbResponseDto.prototype, "time", void 0);
__decorate([
    json2typescript_1.JsonProperty("score", String, true)
], FraudDetectionCbResponseDto.prototype, "score", void 0);
__decorate([
    json2typescript_1.JsonProperty("deviceId", String, true)
], FraudDetectionCbResponseDto.prototype, "deviceId", void 0);
__decorate([
    json2typescript_1.JsonProperty("tdl", String, true)
], FraudDetectionCbResponseDto.prototype, "tdl", void 0);
__decorate([
    json2typescript_1.JsonProperty("systemResponse", String, true)
], FraudDetectionCbResponseDto.prototype, "systemResponse", void 0);
__decorate([
    json2typescript_1.JsonProperty("fulfillmentAction", String, true)
], FraudDetectionCbResponseDto.prototype, "fulfillmentAction", void 0);
__decorate([
    json2typescript_1.JsonProperty("auditTrail", String, true)
], FraudDetectionCbResponseDto.prototype, "auditTrail", void 0);
__decorate([
    json2typescript_1.JsonProperty("riskLevel", String, true)
], FraudDetectionCbResponseDto.prototype, "riskLevel", void 0);
__decorate([
    json2typescript_1.JsonProperty("warnings", [FraudDetectionCbWarningDto_1.FraudDetectionCbWarningDto], true)
], FraudDetectionCbResponseDto.prototype, "warnings", void 0);
FraudDetectionCbResponseDto = __decorate([
    json2typescript_1.JsonObject("FraudDetectionCbResponseDto")
], FraudDetectionCbResponseDto);
exports.FraudDetectionCbResponseDto = FraudDetectionCbResponseDto;
//# sourceMappingURL=FraudDetectionCbResponseDto.js.map