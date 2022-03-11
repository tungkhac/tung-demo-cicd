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
const AccountInfo_1 = require("./AccountInfo");
const RecurringCharge_1 = require("./RecurringCharge");
const CardInfo_1 = require("./CardInfo");
let Account = class Account {
    constructor() {
        this.accountId = undefined;
        this.transData = undefined;
        this.accountBasic = undefined;
        this.accountInfo = undefined;
        this.cardInfo = undefined;
        this.recurringCharge = undefined;
        this.bankAccountInfo = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("accountId", String, true)
], Account.prototype, "accountId", void 0);
__decorate([
    json2typescript_1.JsonProperty("transData", String, true)
], Account.prototype, "transData", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountBasic", String, true)
], Account.prototype, "accountBasic", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountInfo", [AccountInfo_1.AccountInfo], true)
], Account.prototype, "accountInfo", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardInfo", [CardInfo_1.CardInfo], true)
], Account.prototype, "cardInfo", void 0);
__decorate([
    json2typescript_1.JsonProperty("recurringCharge", [RecurringCharge_1.RecurringCharge], true)
], Account.prototype, "recurringCharge", void 0);
__decorate([
    json2typescript_1.JsonProperty("bankAccountInfo", String, true)
], Account.prototype, "bankAccountInfo", void 0);
Account = __decorate([
    json2typescript_1.JsonObject("Account")
], Account);
exports.Account = Account;
//# sourceMappingURL=Account.js.map