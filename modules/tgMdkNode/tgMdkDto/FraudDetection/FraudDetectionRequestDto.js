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
const FraudDetectionOrderDto_1 = require("./FraudDetectionOrderDto");
const FraudDetectionTransactionDto_1 = require("./FraudDetectionTransactionDto");
const FraudDetectionTotalDto_1 = require("./FraudDetectionTotalDto");
const FraudDetectionSessionDto_1 = require("./FraudDetectionSessionDto");
const FraudDetectionUserAccountDto_1 = require("./FraudDetectionUserAccountDto");
const FraudDetectionContactDto_1 = require("./FraudDetectionContactDto");
const FraudDetectionExternalRiskResultDto_1 = require("./FraudDetectionExternalRiskResultDto");
const FraudDetectionDeviceDto_1 = require("./FraudDetectionDeviceDto");
let FraudDetectionRequestDto = class FraudDetectionRequestDto {
    constructor(device) {
        this.device = device;
    }
};
__decorate([
    json2typescript_1.JsonProperty("orgCode", String)
], FraudDetectionRequestDto.prototype, "orgCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("modelCode", String)
], FraudDetectionRequestDto.prototype, "modelCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("merchantId", String)
], FraudDetectionRequestDto.prototype, "merchantId", void 0);
__decorate([
    json2typescript_1.JsonProperty("bruceSector", String)
], FraudDetectionRequestDto.prototype, "bruceSector", void 0);
__decorate([
    json2typescript_1.JsonProperty("customField1", String)
], FraudDetectionRequestDto.prototype, "customField1", void 0);
__decorate([
    json2typescript_1.JsonProperty("customField2", String)
], FraudDetectionRequestDto.prototype, "customField2", void 0);
__decorate([
    json2typescript_1.JsonProperty("customField3", String)
], FraudDetectionRequestDto.prototype, "customField3", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData1", String)
], FraudDetectionRequestDto.prototype, "ebtUserData1", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData2", String)
], FraudDetectionRequestDto.prototype, "ebtUserData2", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData3", String)
], FraudDetectionRequestDto.prototype, "ebtUserData3", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData4", String)
], FraudDetectionRequestDto.prototype, "ebtUserData4", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData5", String)
], FraudDetectionRequestDto.prototype, "ebtUserData5", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData6", String)
], FraudDetectionRequestDto.prototype, "ebtUserData6", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData7", String)
], FraudDetectionRequestDto.prototype, "ebtUserData7", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData8", String)
], FraudDetectionRequestDto.prototype, "ebtUserData8", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData9", String)
], FraudDetectionRequestDto.prototype, "ebtUserData9", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData10", String)
], FraudDetectionRequestDto.prototype, "ebtUserData10", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData11", String)
], FraudDetectionRequestDto.prototype, "ebtUserData11", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData12", String)
], FraudDetectionRequestDto.prototype, "ebtUserData12", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData13", String)
], FraudDetectionRequestDto.prototype, "ebtUserData13", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData14", String)
], FraudDetectionRequestDto.prototype, "ebtUserData14", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData15", String)
], FraudDetectionRequestDto.prototype, "ebtUserData15", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData16", String)
], FraudDetectionRequestDto.prototype, "ebtUserData16", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData17", String)
], FraudDetectionRequestDto.prototype, "ebtUserData17", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData18", String)
], FraudDetectionRequestDto.prototype, "ebtUserData18", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData19", String)
], FraudDetectionRequestDto.prototype, "ebtUserData19", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData20", String)
], FraudDetectionRequestDto.prototype, "ebtUserData20", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData21", String)
], FraudDetectionRequestDto.prototype, "ebtUserData21", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData22", String)
], FraudDetectionRequestDto.prototype, "ebtUserData22", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData23", String)
], FraudDetectionRequestDto.prototype, "ebtUserData23", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData24", String)
], FraudDetectionRequestDto.prototype, "ebtUserData24", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtUserData25", String)
], FraudDetectionRequestDto.prototype, "ebtUserData25", void 0);
__decorate([
    json2typescript_1.JsonProperty("actCd", String)
], FraudDetectionRequestDto.prototype, "actCd", void 0);
__decorate([
    json2typescript_1.JsonProperty("divNum", String)
], FraudDetectionRequestDto.prototype, "divNum", void 0);
__decorate([
    json2typescript_1.JsonProperty("SKeyId", String)
], FraudDetectionRequestDto.prototype, "SKeyId", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtService", String)
], FraudDetectionRequestDto.prototype, "ebtService", void 0);
__decorate([
    json2typescript_1.JsonProperty("ebtName", String)
], FraudDetectionRequestDto.prototype, "ebtName", void 0);
__decorate([
    json2typescript_1.JsonProperty("userId", String)
], FraudDetectionRequestDto.prototype, "userId", void 0);
__decorate([
    json2typescript_1.JsonProperty("id", String)
], FraudDetectionRequestDto.prototype, "id", void 0);
__decorate([
    json2typescript_1.JsonProperty("time", String)
], FraudDetectionRequestDto.prototype, "time", void 0);
__decorate([
    json2typescript_1.JsonProperty("source", String)
], FraudDetectionRequestDto.prototype, "source", void 0);
__decorate([
    json2typescript_1.JsonProperty("device", FraudDetectionDeviceDto_1.FraudDetectionDeviceDto)
], FraudDetectionRequestDto.prototype, "device", void 0);
__decorate([
    json2typescript_1.JsonProperty("externalRiskResults", [FraudDetectionExternalRiskResultDto_1.FraudDetectionExternalRiskResultDto])
], FraudDetectionRequestDto.prototype, "externalRiskResults", void 0);
__decorate([
    json2typescript_1.JsonProperty("contacts", [FraudDetectionContactDto_1.FraudDetectionContactDto])
], FraudDetectionRequestDto.prototype, "contacts", void 0);
__decorate([
    json2typescript_1.JsonProperty("userAccount", FraudDetectionUserAccountDto_1.FraudDetectionUserAccountDto)
], FraudDetectionRequestDto.prototype, "userAccount", void 0);
__decorate([
    json2typescript_1.JsonProperty("session", FraudDetectionSessionDto_1.FraudDetectionSessionDto)
], FraudDetectionRequestDto.prototype, "session", void 0);
__decorate([
    json2typescript_1.JsonProperty("total", FraudDetectionTotalDto_1.FraudDetectionTotalDto)
], FraudDetectionRequestDto.prototype, "total", void 0);
__decorate([
    json2typescript_1.JsonProperty("transaction", FraudDetectionTransactionDto_1.FraudDetectionTransactionDto)
], FraudDetectionRequestDto.prototype, "transaction", void 0);
__decorate([
    json2typescript_1.JsonProperty("order", FraudDetectionOrderDto_1.FraudDetectionOrderDto)
], FraudDetectionRequestDto.prototype, "order", void 0);
FraudDetectionRequestDto = __decorate([
    json2typescript_1.JsonObject("fraudDetectionRequest")
], FraudDetectionRequestDto);
exports.FraudDetectionRequestDto = FraudDetectionRequestDto;
//# sourceMappingURL=FraudDetectionRequestDto.js.map