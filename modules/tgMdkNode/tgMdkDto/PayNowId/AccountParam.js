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
const CardParam_1 = require("./CardParam");
const RecurringChargeParam_1 = require("./RecurringChargeParam");
const BankAccountParam_1 = require("./BankAccountParam");
const AccountBasicParam_1 = require("./AccountBasicParam");
let AccountParam = class AccountParam {
};
__decorate([
    json2typescript_1.JsonProperty("accountId", String)
], AccountParam.prototype, "accountId", void 0);
__decorate([
    json2typescript_1.JsonProperty("payNowId", String)
], AccountParam.prototype, "payNowId", void 0);
__decorate([
    json2typescript_1.JsonProperty("transData", String)
], AccountParam.prototype, "transData", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountBasicParam", AccountBasicParam_1.AccountBasicParam)
], AccountParam.prototype, "accountBasicParam", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardParam", CardParam_1.CardParam)
], AccountParam.prototype, "cardParam", void 0);
__decorate([
    json2typescript_1.JsonProperty("recurringChargeParam", RecurringChargeParam_1.RecurringChargeParam)
], AccountParam.prototype, "recurringChargeParam", void 0);
__decorate([
    json2typescript_1.JsonProperty("bankAccountParam", BankAccountParam_1.BankAccountParam)
], AccountParam.prototype, "bankAccountParam", void 0);
AccountParam = __decorate([
    json2typescript_1.JsonObject("accountParam")
], AccountParam);
exports.AccountParam = AccountParam;
//# sourceMappingURL=AccountParam.js.map