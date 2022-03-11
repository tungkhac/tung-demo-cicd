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
const ProperTransactionInfo_1 = require("./ProperTransactionInfo");
let TransactionInfo = class TransactionInfo {
    constructor() {
        this.txnId = undefined;
        this.command = undefined;
        this.mstatus = undefined;
        this.vResultCode = undefined;
        this.txnDatetime = undefined;
        this.amount = undefined;
        this.properTransactionInfo = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("txnId", String, true)
], TransactionInfo.prototype, "txnId", void 0);
__decorate([
    json2typescript_1.JsonProperty("command", String, true)
], TransactionInfo.prototype, "command", void 0);
__decorate([
    json2typescript_1.JsonProperty("mstatus", String, true)
], TransactionInfo.prototype, "mstatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("vResultCode", String, true)
], TransactionInfo.prototype, "vResultCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("txnDatetime", String, true)
], TransactionInfo.prototype, "txnDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String, true)
], TransactionInfo.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("properTransactionInfo", ProperTransactionInfo_1.ProperTransactionInfo, true)
], TransactionInfo.prototype, "properTransactionInfo", void 0);
TransactionInfo = __decorate([
    json2typescript_1.JsonObject("transactionInfo")
], TransactionInfo);
exports.TransactionInfo = TransactionInfo;
//# sourceMappingURL=TransactionInfo.js.map