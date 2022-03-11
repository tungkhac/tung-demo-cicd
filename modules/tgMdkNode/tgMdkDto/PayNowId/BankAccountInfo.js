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
let BankAccountInfo = class BankAccountInfo {
    constructor() {
        this.bankCode = undefined;
        this.branchCode = undefined;
        this.accountType = undefined;
        this.accountNumber = undefined;
        this.accountName = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("bankCode", String, true)
], BankAccountInfo.prototype, "bankCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("branchCode", String, true)
], BankAccountInfo.prototype, "branchCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountType", String, true)
], BankAccountInfo.prototype, "accountType", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountNumber", String, true)
], BankAccountInfo.prototype, "accountNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountName", String, true)
], BankAccountInfo.prototype, "accountName", void 0);
BankAccountInfo = __decorate([
    json2typescript_1.JsonObject("BankAccountInfo")
], BankAccountInfo);
exports.BankAccountInfo = BankAccountInfo;
//# sourceMappingURL=BankAccountInfo.js.map