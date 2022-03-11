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
let FraudDetectionAuthorizationDto = class FraudDetectionAuthorizationDto {
};
__decorate([
    json2typescript_1.JsonProperty("declined", String)
], FraudDetectionAuthorizationDto.prototype, "declined", void 0);
__decorate([
    json2typescript_1.JsonProperty("approvalCode", String)
], FraudDetectionAuthorizationDto.prototype, "approvalCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("avsAddr", String)
], FraudDetectionAuthorizationDto.prototype, "avsAddr", void 0);
__decorate([
    json2typescript_1.JsonProperty("avsZip", String)
], FraudDetectionAuthorizationDto.prototype, "avsZip", void 0);
__decorate([
    json2typescript_1.JsonProperty("cvv2", String)
], FraudDetectionAuthorizationDto.prototype, "cvv2", void 0);
__decorate([
    json2typescript_1.JsonProperty("ddds", String)
], FraudDetectionAuthorizationDto.prototype, "ddds", void 0);
__decorate([
    json2typescript_1.JsonProperty("eci", String)
], FraudDetectionAuthorizationDto.prototype, "eci", void 0);
__decorate([
    json2typescript_1.JsonProperty("xid", String)
], FraudDetectionAuthorizationDto.prototype, "xid", void 0);
__decorate([
    json2typescript_1.JsonProperty("bank", String)
], FraudDetectionAuthorizationDto.prototype, "bank", void 0);
__decorate([
    json2typescript_1.JsonProperty("type", String)
], FraudDetectionAuthorizationDto.prototype, "type", void 0);
__decorate([
    json2typescript_1.JsonProperty("enhAuthPhone", String)
], FraudDetectionAuthorizationDto.prototype, "enhAuthPhone", void 0);
__decorate([
    json2typescript_1.JsonProperty("enhAuthName", String)
], FraudDetectionAuthorizationDto.prototype, "enhAuthName", void 0);
__decorate([
    json2typescript_1.JsonProperty("enhAuthEmail", String)
], FraudDetectionAuthorizationDto.prototype, "enhAuthEmail", void 0);
__decorate([
    json2typescript_1.JsonProperty("psAddr", String)
], FraudDetectionAuthorizationDto.prototype, "psAddr", void 0);
__decorate([
    json2typescript_1.JsonProperty("psPayer", String)
], FraudDetectionAuthorizationDto.prototype, "psPayer", void 0);
FraudDetectionAuthorizationDto = __decorate([
    json2typescript_1.JsonObject("authorization")
], FraudDetectionAuthorizationDto);
exports.FraudDetectionAuthorizationDto = FraudDetectionAuthorizationDto;
//# sourceMappingURL=FraudDetectionAuthorizationDto.js.map