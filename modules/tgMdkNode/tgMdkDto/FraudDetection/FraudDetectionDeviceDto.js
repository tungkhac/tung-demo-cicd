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
const FraudDetectionHeaderDto_1 = require("./FraudDetectionHeaderDto");
const FraudDetectionUserIdentityCookieDto_1 = require("./FraudDetectionUserIdentityCookieDto");
let FraudDetectionDeviceDto = class FraudDetectionDeviceDto {
    constructor(ip, headers) {
        this.ip = ip;
        this.headers = headers;
    }
};
__decorate([
    json2typescript_1.JsonProperty("ip", String)
], FraudDetectionDeviceDto.prototype, "ip", void 0);
__decorate([
    json2typescript_1.JsonProperty("headers", [FraudDetectionHeaderDto_1.FraudDetectionHeaderDto])
], FraudDetectionDeviceDto.prototype, "headers", void 0);
__decorate([
    json2typescript_1.JsonProperty("userIdentityCookies", [FraudDetectionUserIdentityCookieDto_1.FraudDetectionUserIdentityCookieDto])
], FraudDetectionDeviceDto.prototype, "userIdentityCookies", void 0);
__decorate([
    json2typescript_1.JsonProperty("devicePrint", String)
], FraudDetectionDeviceDto.prototype, "devicePrint", void 0);
FraudDetectionDeviceDto = __decorate([
    json2typescript_1.JsonObject("device")
], FraudDetectionDeviceDto);
exports.FraudDetectionDeviceDto = FraudDetectionDeviceDto;
//# sourceMappingURL=FraudDetectionDeviceDto.js.map