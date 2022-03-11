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
let FraudDetectionContactDto = class FraudDetectionContactDto {
    constructor(refId, firstName, lastName, countryCode) {
        this.refId = refId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.countryCode = countryCode;
    }
};
__decorate([
    json2typescript_1.JsonProperty("refId", String)
], FraudDetectionContactDto.prototype, "refId", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstName", String)
], FraudDetectionContactDto.prototype, "firstName", void 0);
__decorate([
    json2typescript_1.JsonProperty("lastName", String)
], FraudDetectionContactDto.prototype, "lastName", void 0);
__decorate([
    json2typescript_1.JsonProperty("company", String)
], FraudDetectionContactDto.prototype, "company", void 0);
__decorate([
    json2typescript_1.JsonProperty("emailAddress", String)
], FraudDetectionContactDto.prototype, "emailAddress", void 0);
__decorate([
    json2typescript_1.JsonProperty("emailAddressType", String)
], FraudDetectionContactDto.prototype, "emailAddressType", void 0);
__decorate([
    json2typescript_1.JsonProperty("phoneNumber", String)
], FraudDetectionContactDto.prototype, "phoneNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("phoneNumberType", String)
], FraudDetectionContactDto.prototype, "phoneNumberType", void 0);
__decorate([
    json2typescript_1.JsonProperty("streetLine", String)
], FraudDetectionContactDto.prototype, "streetLine", void 0);
__decorate([
    json2typescript_1.JsonProperty("streetLine2", String)
], FraudDetectionContactDto.prototype, "streetLine2", void 0);
__decorate([
    json2typescript_1.JsonProperty("city", String)
], FraudDetectionContactDto.prototype, "city", void 0);
__decorate([
    json2typescript_1.JsonProperty("postal", String)
], FraudDetectionContactDto.prototype, "postal", void 0);
__decorate([
    json2typescript_1.JsonProperty("stateProvinceCode", String)
], FraudDetectionContactDto.prototype, "stateProvinceCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("countryCode", String)
], FraudDetectionContactDto.prototype, "countryCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("birthDate", String)
], FraudDetectionContactDto.prototype, "birthDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("mothersMaidenName", String)
], FraudDetectionContactDto.prototype, "mothersMaidenName", void 0);
FraudDetectionContactDto = __decorate([
    json2typescript_1.JsonObject("contacts")
], FraudDetectionContactDto);
exports.FraudDetectionContactDto = FraudDetectionContactDto;
//# sourceMappingURL=FraudDetectionContactDto.js.map