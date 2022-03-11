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
const SearchParameters_1 = require("./SearchParameters");
let SearchRequestDto = class SearchRequestDto extends MdkDtoBase_1.MdkDtoBase {
    constructor() {
        super(...arguments);
        this.serviceType = "search";
        this.serviceCommand = "Search";
    }
    get maskedLog() {
        return this._maskedLog;
    }
    set maskedLog(value) {
        this._maskedLog = value;
    }
};
__decorate([
    json2typescript_1.JsonProperty("requestId", String)
], SearchRequestDto.prototype, "requestId", void 0);
__decorate([
    json2typescript_1.JsonProperty("serviceTypeCd", [String])
], SearchRequestDto.prototype, "serviceTypeCd", void 0);
__decorate([
    json2typescript_1.JsonProperty("newerFlag", String)
], SearchRequestDto.prototype, "newerFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("containDummyFlag", String)
], SearchRequestDto.prototype, "containDummyFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("maxCount", String)
], SearchRequestDto.prototype, "maxCount", void 0);
__decorate([
    json2typescript_1.JsonProperty("masterNames", [String])
], SearchRequestDto.prototype, "masterNames", void 0);
__decorate([
    json2typescript_1.JsonProperty("searchParameters", SearchParameters_1.SearchParameters)
], SearchRequestDto.prototype, "searchParameters", void 0);
SearchRequestDto = __decorate([
    json2typescript_1.JsonObject("SearchRequestDto")
], SearchRequestDto);
exports.SearchRequestDto = SearchRequestDto;
//# sourceMappingURL=SearchRequestDto.js.map