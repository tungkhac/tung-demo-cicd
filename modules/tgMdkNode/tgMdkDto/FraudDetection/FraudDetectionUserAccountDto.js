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
const FraudDetectionLastActionTimesDto_1 = require("./FraudDetectionLastActionTimesDto");
let FraudDetectionUserAccountDto = class FraudDetectionUserAccountDto {
};
__decorate([
    json2typescript_1.JsonProperty("id", String)
], FraudDetectionUserAccountDto.prototype, "id", void 0);
__decorate([
    json2typescript_1.JsonProperty("enrollmentTime", String)
], FraudDetectionUserAccountDto.prototype, "enrollmentTime", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountHolder", String)
], FraudDetectionUserAccountDto.prototype, "accountHolder", void 0);
__decorate([
    json2typescript_1.JsonProperty("returnCustomer", String)
], FraudDetectionUserAccountDto.prototype, "returnCustomer", void 0);
__decorate([
    json2typescript_1.JsonProperty("username", String)
], FraudDetectionUserAccountDto.prototype, "username", void 0);
__decorate([
    json2typescript_1.JsonProperty("tof", String)
], FraudDetectionUserAccountDto.prototype, "tof", void 0);
__decorate([
    json2typescript_1.JsonProperty("lastActionTimes", FraudDetectionLastActionTimesDto_1.FraudDetectionLastActionTimesDto)
], FraudDetectionUserAccountDto.prototype, "lastActionTimes", void 0);
FraudDetectionUserAccountDto = __decorate([
    json2typescript_1.JsonObject("userAccount")
], FraudDetectionUserAccountDto);
exports.FraudDetectionUserAccountDto = FraudDetectionUserAccountDto;
//# sourceMappingURL=FraudDetectionUserAccountDto.js.map