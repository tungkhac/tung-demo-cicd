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
let BankFinancialInstInfo = class BankFinancialInstInfo {
    constructor() {
        this.bankCode = undefined;
        this.deviceCode = undefined;
        this.bankName = undefined;
        this.bankKana = undefined;
        this.bankIndexChar1 = undefined;
        this.bankIndexChar2 = undefined;
        this.startDatetime = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("bankCode", String, true)
], BankFinancialInstInfo.prototype, "bankCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("deviceCode", String, true)
], BankFinancialInstInfo.prototype, "deviceCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("bankName", String, true)
], BankFinancialInstInfo.prototype, "bankName", void 0);
__decorate([
    json2typescript_1.JsonProperty("bankKana", String, true)
], BankFinancialInstInfo.prototype, "bankKana", void 0);
__decorate([
    json2typescript_1.JsonProperty("bankIndexChar1", String, true)
], BankFinancialInstInfo.prototype, "bankIndexChar1", void 0);
__decorate([
    json2typescript_1.JsonProperty("bankIndexChar2", String, true)
], BankFinancialInstInfo.prototype, "bankIndexChar2", void 0);
__decorate([
    json2typescript_1.JsonProperty("startDatetime", String, true)
], BankFinancialInstInfo.prototype, "startDatetime", void 0);
BankFinancialInstInfo = __decorate([
    json2typescript_1.JsonObject("bankFinancialInstInfo")
], BankFinancialInstInfo);
exports.BankFinancialInstInfo = BankFinancialInstInfo;
//# sourceMappingURL=BankFinancialInstInfo.js.map