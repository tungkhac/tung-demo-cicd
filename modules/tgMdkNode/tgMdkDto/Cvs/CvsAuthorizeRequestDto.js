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
const AbstractPaymentRequestDto_1 = require("../AbstractPaymentRequestDto");
let CvsAuthorizeRequestDto = class CvsAuthorizeRequestDto extends AbstractPaymentRequestDto_1.AbstractPaymentRequestDto {
    constructor() {
        super(...arguments);
        this.serviceType = "cvs";
        this.serviceCommand = "Authorize";
    }
    get maskedLog() {
        return this._maskedLog;
    }
    set maskedLog(value) {
        this._maskedLog = value;
    }
};
__decorate([
    json2typescript_1.JsonProperty("serviceOptionType", String, true)
], CvsAuthorizeRequestDto.prototype, "serviceOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], CvsAuthorizeRequestDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String, true)
], CvsAuthorizeRequestDto.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("name1", String, true)
], CvsAuthorizeRequestDto.prototype, "name1", void 0);
__decorate([
    json2typescript_1.JsonProperty("name2", String, true)
], CvsAuthorizeRequestDto.prototype, "name2", void 0);
__decorate([
    json2typescript_1.JsonProperty("kana", String, true)
], CvsAuthorizeRequestDto.prototype, "kana", void 0);
__decorate([
    json2typescript_1.JsonProperty("telNo", String, true)
], CvsAuthorizeRequestDto.prototype, "telNo", void 0);
__decorate([
    json2typescript_1.JsonProperty("payLimit", String, true)
], CvsAuthorizeRequestDto.prototype, "payLimit", void 0);
__decorate([
    json2typescript_1.JsonProperty("paymentType", String, true)
], CvsAuthorizeRequestDto.prototype, "paymentType", void 0);
__decorate([
    json2typescript_1.JsonProperty("free1", String, true)
], CvsAuthorizeRequestDto.prototype, "free1", void 0);
__decorate([
    json2typescript_1.JsonProperty("free2", String, true)
], CvsAuthorizeRequestDto.prototype, "free2", void 0);
__decorate([
    json2typescript_1.JsonProperty("pushUrl", String, true)
], CvsAuthorizeRequestDto.prototype, "pushUrl", void 0);
__decorate([
    json2typescript_1.JsonProperty("payLimitHhmm", String, true)
], CvsAuthorizeRequestDto.prototype, "payLimitHhmm", void 0);
CvsAuthorizeRequestDto = __decorate([
    json2typescript_1.JsonObject("CvsAuthorizeRequestDto")
], CvsAuthorizeRequestDto);
exports.CvsAuthorizeRequestDto = CvsAuthorizeRequestDto;
//# sourceMappingURL=CvsAuthorizeRequestDto.js.map