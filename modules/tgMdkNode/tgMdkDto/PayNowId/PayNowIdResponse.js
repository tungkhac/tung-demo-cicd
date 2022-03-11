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
const OptionResults_1 = require("./OptionResults");
let PayNowIdResponse = class PayNowIdResponse {
    constructor() {
        this.processId = undefined;
        this.status = undefined;
        this.message = undefined;
        this.account = undefined;
        this.optionResults = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("processId", String, true)
], PayNowIdResponse.prototype, "processId", void 0);
__decorate([
    json2typescript_1.JsonProperty("status", String, true)
], PayNowIdResponse.prototype, "status", void 0);
__decorate([
    json2typescript_1.JsonProperty("message", String, true)
], PayNowIdResponse.prototype, "message", void 0);
__decorate([
    json2typescript_1.JsonProperty("account", String, true)
], PayNowIdResponse.prototype, "account", void 0);
__decorate([
    json2typescript_1.JsonProperty("optionResults", [OptionResults_1.OptionResults], true)
], PayNowIdResponse.prototype, "optionResults", void 0);
PayNowIdResponse = __decorate([
    json2typescript_1.JsonObject("PayNowIdResponse")
], PayNowIdResponse);
exports.PayNowIdResponse = PayNowIdResponse;
//# sourceMappingURL=PayNowIdResponse.js.map