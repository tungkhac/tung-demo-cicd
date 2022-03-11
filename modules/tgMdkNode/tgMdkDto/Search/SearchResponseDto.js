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
const MasterInfos_1 = require("./MasterInfos");
const OrderInfos_1 = require("./OrderInfos");
let SearchResponseDto = class SearchResponseDto extends MdkDtoBase_1.MdkDtoBase {
    constructor() {
        super(...arguments);
        this.serviceType = undefined;
        this.mstatus = undefined;
        this.vResultCode = undefined;
        this.merrMsg = undefined;
        this.orderId = undefined;
        this.marchTxn = undefined;
        this.custTxn = undefined;
        this.txnVersion = undefined;
        this.overMaxCountFlag = undefined;
        this.masterInfos = undefined;
        this.searchCount = undefined;
        this.orderInfos = undefined;
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
], SearchResponseDto.prototype, "serviceType", void 0);
__decorate([
    json2typescript_1.JsonProperty("mstatus", String, true)
], SearchResponseDto.prototype, "mstatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("vResultCode", String, true)
], SearchResponseDto.prototype, "vResultCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("merrMsg", String, true)
], SearchResponseDto.prototype, "merrMsg", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], SearchResponseDto.prototype, "orderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("marchTxn", String, true)
], SearchResponseDto.prototype, "marchTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("custTxn", String, true)
], SearchResponseDto.prototype, "custTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("txnVersion", String, true)
], SearchResponseDto.prototype, "txnVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("overMaxCountFlag", String, true)
], SearchResponseDto.prototype, "overMaxCountFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("masterInfos", MasterInfos_1.MasterInfos, true)
], SearchResponseDto.prototype, "masterInfos", void 0);
__decorate([
    json2typescript_1.JsonProperty("searchCount", String, true)
], SearchResponseDto.prototype, "searchCount", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderInfos", OrderInfos_1.OrderInfos, true)
], SearchResponseDto.prototype, "orderInfos", void 0);
SearchResponseDto = __decorate([
    json2typescript_1.JsonObject("SearchResponseDto")
], SearchResponseDto);
exports.SearchResponseDto = SearchResponseDto;
//# sourceMappingURL=SearchResponseDto.js.map