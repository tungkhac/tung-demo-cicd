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
const AccountParam_1 = require("./AccountParam");
const ChargeParam_1 = require("./ChargeParam");
const OrderParam_1 = require("./OrderParam");
let PayNowIdParam = class PayNowIdParam {
};
__decorate([
    json2typescript_1.JsonProperty("accountParam", AccountParam_1.AccountParam)
], PayNowIdParam.prototype, "accountParam", void 0);
__decorate([
    json2typescript_1.JsonProperty("chargeParam", ChargeParam_1.ChargeParam)
], PayNowIdParam.prototype, "chargeParam", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderParam", OrderParam_1.OrderParam)
], PayNowIdParam.prototype, "orderParam", void 0);
__decorate([
    json2typescript_1.JsonProperty("tanking", String)
], PayNowIdParam.prototype, "tanking", void 0);
__decorate([
    json2typescript_1.JsonProperty("freeKey", String)
], PayNowIdParam.prototype, "freeKey", void 0);
__decorate([
    json2typescript_1.JsonProperty("memo1", String)
], PayNowIdParam.prototype, "memo1", void 0);
__decorate([
    json2typescript_1.JsonProperty("receiptData", String)
], PayNowIdParam.prototype, "receiptData", void 0);
__decorate([
    json2typescript_1.JsonProperty("token", String)
], PayNowIdParam.prototype, "token", void 0);
PayNowIdParam = __decorate([
    json2typescript_1.JsonObject("payNowIdParam")
], PayNowIdParam);
exports.PayNowIdParam = PayNowIdParam;
//# sourceMappingURL=PayNowIdParam.js.map