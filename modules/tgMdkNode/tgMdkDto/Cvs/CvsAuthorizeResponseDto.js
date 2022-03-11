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
const MdkDtoBase_1 = require("../MdkDtoBase");
let CvsAuthorizeResponseDto = class CvsAuthorizeResponseDto extends MdkDtoBase_1.MdkDtoBase {
    constructor() {
        super(...arguments);
        this.serviceType = undefined;
        this.mstatus = undefined;
        this.vResultCode = undefined;
        this.merrMsg = undefined;
        this.marchTxn = undefined;
        this.orderId = undefined;
        this.custTxn = undefined;
        this.receiptNo = undefined;
        this.haraikomiUrl = undefined;
        this.txnVersion = undefined;
    }
    get resultJson() {
        return this._resultJson;
    }
    set resultJson(value) {
        this._resultJson = value;
    }
};
__decorate([
    json2typescript_1.JsonProperty("serviceType", String, true)
], CvsAuthorizeResponseDto.prototype, "serviceType", void 0);
__decorate([
    json2typescript_1.JsonProperty("mstatus", String, true)
], CvsAuthorizeResponseDto.prototype, "mstatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("vResultCode", String, true)
], CvsAuthorizeResponseDto.prototype, "vResultCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("merrMsg", String, true)
], CvsAuthorizeResponseDto.prototype, "merrMsg", void 0);
__decorate([
    json2typescript_1.JsonProperty("marchTxn", String, true)
], CvsAuthorizeResponseDto.prototype, "marchTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], CvsAuthorizeResponseDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("custTxn", String, true)
], CvsAuthorizeResponseDto.prototype, "custTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("receiptNo", String, true)
], CvsAuthorizeResponseDto.prototype, "receiptNo", void 0);
__decorate([
    json2typescript_1.JsonProperty("haraikomiUrl", String, true)
], CvsAuthorizeResponseDto.prototype, "haraikomiUrl", void 0);
__decorate([
    json2typescript_1.JsonProperty("txnVersion", String, true)
], CvsAuthorizeResponseDto.prototype, "txnVersion", void 0);
CvsAuthorizeResponseDto = __decorate([
    json2typescript_1.JsonObject("CvsAuthorizeResponseDto")
], CvsAuthorizeResponseDto);
exports.CvsAuthorizeResponseDto = CvsAuthorizeResponseDto;
//# sourceMappingURL=CvsAuthorizeResponseDto.js.map