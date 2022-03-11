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
let ChargeParam = class ChargeParam {
};
__decorate([
    json2typescript_1.JsonProperty("groupId", String)
], ChargeParam.prototype, "groupId", void 0);
__decorate([
    json2typescript_1.JsonProperty("groupName", String)
], ChargeParam.prototype, "groupName", void 0);
__decorate([
    json2typescript_1.JsonProperty("type", String)
], ChargeParam.prototype, "type", void 0);
__decorate([
    json2typescript_1.JsonProperty("oneTimeAmount", String)
], ChargeParam.prototype, "oneTimeAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String)
], ChargeParam.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("chargeType", String)
], ChargeParam.prototype, "chargeType", void 0);
__decorate([
    json2typescript_1.JsonProperty("schedule", String)
], ChargeParam.prototype, "schedule", void 0);
__decorate([
    json2typescript_1.JsonProperty("salesDay", String)
], ChargeParam.prototype, "salesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquireCode", String)
], ChargeParam.prototype, "acquireCode", void 0);
ChargeParam = __decorate([
    json2typescript_1.JsonObject("chargeParam")
], ChargeParam);
exports.ChargeParam = ChargeParam;
//# sourceMappingURL=ChargeParam.js.map