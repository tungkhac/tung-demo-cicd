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
let RecurringChargeParam = class RecurringChargeParam {
};
__decorate([
    json2typescript_1.JsonProperty("groupId", String)
], RecurringChargeParam.prototype, "groupId", void 0);
__decorate([
    json2typescript_1.JsonProperty("startDate", String)
], RecurringChargeParam.prototype, "startDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("endDate", String)
], RecurringChargeParam.prototype, "endDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("finalCharge", String)
], RecurringChargeParam.prototype, "finalCharge", void 0);
__decorate([
    json2typescript_1.JsonProperty("oneTimeAmount", String)
], RecurringChargeParam.prototype, "oneTimeAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String)
], RecurringChargeParam.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("recurringMemo1", String)
], RecurringChargeParam.prototype, "recurringMemo1", void 0);
__decorate([
    json2typescript_1.JsonProperty("recurringMemo2", String)
], RecurringChargeParam.prototype, "recurringMemo2", void 0);
__decorate([
    json2typescript_1.JsonProperty("recurringMemo3", String)
], RecurringChargeParam.prototype, "recurringMemo3", void 0);
__decorate([
    json2typescript_1.JsonProperty("useChargeOption", String)
], RecurringChargeParam.prototype, "useChargeOption", void 0);
__decorate([
    json2typescript_1.JsonProperty("salesDay", String)
], RecurringChargeParam.prototype, "salesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquireCode", String)
], RecurringChargeParam.prototype, "acquireCode", void 0);
RecurringChargeParam = __decorate([
    json2typescript_1.JsonObject("recurringChargeParam")
], RecurringChargeParam);
exports.RecurringChargeParam = RecurringChargeParam;
//# sourceMappingURL=RecurringChargeParam.js.map