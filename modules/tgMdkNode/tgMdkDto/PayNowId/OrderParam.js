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
let OrderParam = class OrderParam {
};
__decorate([
    json2typescript_1.JsonProperty("originalOrderId", String)
], OrderParam.prototype, "originalOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("cleaningMerchantId", String)
], OrderParam.prototype, "cleaningMerchantId", void 0);
OrderParam = __decorate([
    json2typescript_1.JsonObject("orderParam")
], OrderParam);
exports.OrderParam = OrderParam;
//# sourceMappingURL=OrderParam.js.map