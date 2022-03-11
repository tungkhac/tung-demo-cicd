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
let FraudDetectionSessionDto = class FraudDetectionSessionDto {
    constructor(id) {
        this.id = id;
    }
};
__decorate([
    json2typescript_1.JsonProperty("id", String)
], FraudDetectionSessionDto.prototype, "id", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemsRemoved", String)
], FraudDetectionSessionDto.prototype, "itemsRemoved", void 0);
__decorate([
    json2typescript_1.JsonProperty("durationInMillis", String)
], FraudDetectionSessionDto.prototype, "durationInMillis", void 0);
__decorate([
    json2typescript_1.JsonProperty("activityPageCode", String)
], FraudDetectionSessionDto.prototype, "activityPageCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("failedLoginAttempts", String)
], FraudDetectionSessionDto.prototype, "failedLoginAttempts", void 0);
__decorate([
    json2typescript_1.JsonProperty("thirdPartySessionId", String)
], FraudDetectionSessionDto.prototype, "thirdPartySessionId", void 0);
__decorate([
    json2typescript_1.JsonProperty("loggedIn", String)
], FraudDetectionSessionDto.prototype, "loggedIn", void 0);
__decorate([
    json2typescript_1.JsonProperty("multiFactorAuthenticated", String)
], FraudDetectionSessionDto.prototype, "multiFactorAuthenticated", void 0);
__decorate([
    json2typescript_1.JsonProperty("challengeAttempts", String)
], FraudDetectionSessionDto.prototype, "challengeAttempts", void 0);
FraudDetectionSessionDto = __decorate([
    json2typescript_1.JsonObject("session")
], FraudDetectionSessionDto);
exports.FraudDetectionSessionDto = FraudDetectionSessionDto;
//# sourceMappingURL=FraudDetectionSessionDto.js.map