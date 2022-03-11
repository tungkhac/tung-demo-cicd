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
let FraudDetectionLineItemDto = class FraudDetectionLineItemDto {
    constructor(refId) {
        this.refId = refId;
    }
};
__decorate([
    json2typescript_1.JsonProperty("refId", String)
], FraudDetectionLineItemDto.prototype, "refId", void 0);
__decorate([
    json2typescript_1.JsonProperty("name", String)
], FraudDetectionLineItemDto.prototype, "name", void 0);
__decorate([
    json2typescript_1.JsonProperty("description", String)
], FraudDetectionLineItemDto.prototype, "description", void 0);
__decorate([
    json2typescript_1.JsonProperty("sku", String)
], FraudDetectionLineItemDto.prototype, "sku", void 0);
__decorate([
    json2typescript_1.JsonProperty("eanCode", String)
], FraudDetectionLineItemDto.prototype, "eanCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("promoCode", String)
], FraudDetectionLineItemDto.prototype, "promoCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("category", String)
], FraudDetectionLineItemDto.prototype, "category", void 0);
__decorate([
    json2typescript_1.JsonProperty("brand", String)
], FraudDetectionLineItemDto.prototype, "brand", void 0);
__decorate([
    json2typescript_1.JsonProperty("sellerId", String)
], FraudDetectionLineItemDto.prototype, "sellerId", void 0);
__decorate([
    json2typescript_1.JsonProperty("unitWeight", String)
], FraudDetectionLineItemDto.prototype, "unitWeight", void 0);
__decorate([
    json2typescript_1.JsonProperty("unit", String)
], FraudDetectionLineItemDto.prototype, "unit", void 0);
__decorate([
    json2typescript_1.JsonProperty("quantity", String)
], FraudDetectionLineItemDto.prototype, "quantity", void 0);
__decorate([
    json2typescript_1.JsonProperty("unitAmount", String)
], FraudDetectionLineItemDto.prototype, "unitAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("unitCurrencyCode", String)
], FraudDetectionLineItemDto.prototype, "unitCurrencyCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("totalAmount", String)
], FraudDetectionLineItemDto.prototype, "totalAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("totalCurrencyCode", String)
], FraudDetectionLineItemDto.prototype, "totalCurrencyCode", void 0);
FraudDetectionLineItemDto = __decorate([
    json2typescript_1.JsonObject("lineItems")
], FraudDetectionLineItemDto);
exports.FraudDetectionLineItemDto = FraudDetectionLineItemDto;
//# sourceMappingURL=FraudDetectionLineItemDto.js.map