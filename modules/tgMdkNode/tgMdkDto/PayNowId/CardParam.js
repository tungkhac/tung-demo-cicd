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
let CardParam = class CardParam {
};
__decorate([
    json2typescript_1.JsonProperty("cardId", String)
], CardParam.prototype, "cardId", void 0);
__decorate([
    json2typescript_1.JsonProperty("defaultCard", String)
], CardParam.prototype, "defaultCard", void 0);
__decorate([
    json2typescript_1.JsonProperty("defaultCardId", String)
], CardParam.prototype, "defaultCardId", void 0);
__decorate([
    json2typescript_1.JsonProperty("updater", String)
], CardParam.prototype, "updater", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardNumber", String)
], CardParam.prototype, "cardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardExpire", String)
], CardParam.prototype, "cardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("securityCode", String)
], CardParam.prototype, "securityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("token", String)
], CardParam.prototype, "token", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardNumberMaskType", String)
], CardParam.prototype, "cardNumberMaskType", void 0);
CardParam = __decorate([
    json2typescript_1.JsonObject("cardParam")
], CardParam);
exports.CardParam = CardParam;
//# sourceMappingURL=CardParam.js.map