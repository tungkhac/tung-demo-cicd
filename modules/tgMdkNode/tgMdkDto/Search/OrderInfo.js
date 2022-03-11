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
const ProperOrderInfo_1 = require("./ProperOrderInfo");
const TransactionInfos_1 = require("./TransactionInfos");
let OrderInfo = class OrderInfo {
    constructor() {
        this.memo1 = undefined;
        this.memo2 = undefined;
        this.memo3 = undefined;
        this.freeKey = undefined;
        this.accountId = undefined;
        this.index = undefined;
        this.serviceTypeCd = undefined;
        this.orderId = undefined;
        this.orderStatus = undefined;
        this.lastSuccessTxnType = undefined;
        this.properOrderInfo = undefined;
        this.transactionInfos = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("memo1", String, true)
], OrderInfo.prototype, "memo1", void 0);
__decorate([
    json2typescript_1.JsonProperty("memo2", String, true)
], OrderInfo.prototype, "memo2", void 0);
__decorate([
    json2typescript_1.JsonProperty("memo3", String, true)
], OrderInfo.prototype, "memo3", void 0);
__decorate([
    json2typescript_1.JsonProperty("freeKey", String, true)
], OrderInfo.prototype, "freeKey", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountId", String, true)
], OrderInfo.prototype, "accountId", void 0);
__decorate([
    json2typescript_1.JsonProperty("index", String, true)
], OrderInfo.prototype, "index", void 0);
__decorate([
    json2typescript_1.JsonProperty("serviceTypeCd", String, true)
], OrderInfo.prototype, "serviceTypeCd", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], OrderInfo.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderStatus", String, true)
], OrderInfo.prototype, "orderStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("lastSuccessTxnType", String, true)
], OrderInfo.prototype, "lastSuccessTxnType", void 0);
__decorate([
    json2typescript_1.JsonProperty("properOrderInfo", ProperOrderInfo_1.ProperOrderInfo, true)
], OrderInfo.prototype, "properOrderInfo", void 0);
__decorate([
    json2typescript_1.JsonProperty("transactionInfos", TransactionInfos_1.TransactionInfos, true)
], OrderInfo.prototype, "transactionInfos", void 0);
OrderInfo = __decorate([
    json2typescript_1.JsonObject("orderInfo")
], OrderInfo);
exports.OrderInfo = OrderInfo;
//# sourceMappingURL=OrderInfo.js.map