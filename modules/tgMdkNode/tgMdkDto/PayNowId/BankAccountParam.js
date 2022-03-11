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
let BankAccountParam = class BankAccountParam {
};
__decorate([
    json2typescript_1.JsonProperty("bankCode", String)
], BankAccountParam.prototype, "bankCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("branchCode", String)
], BankAccountParam.prototype, "branchCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountType", String)
], BankAccountParam.prototype, "accountType", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountNumber", String)
], BankAccountParam.prototype, "accountNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountManageType", String)
], BankAccountParam.prototype, "accountManageType", void 0);
__decorate([
    json2typescript_1.JsonProperty("rejectBankAccount", String)
], BankAccountParam.prototype, "rejectBankAccount", void 0);
BankAccountParam = __decorate([
    json2typescript_1.JsonObject("bankAccountParam")
], BankAccountParam);
exports.BankAccountParam = BankAccountParam;
//# sourceMappingURL=BankAccountParam.js.map