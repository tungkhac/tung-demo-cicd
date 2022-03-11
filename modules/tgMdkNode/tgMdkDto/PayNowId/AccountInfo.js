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
let AccountInfo = class AccountInfo {
    constructor() {
        this.accountInfoId = undefined;
        this.accountType = undefined;
        this.defaultAccount = undefined;
        this.recipient = undefined;
        this.zip = undefined;
        this.address = undefined;
        this.tel = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("accountInfoId", String, true)
], AccountInfo.prototype, "accountInfoId", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountType", String, true)
], AccountInfo.prototype, "accountType", void 0);
__decorate([
    json2typescript_1.JsonProperty("defaultAccount", String, true)
], AccountInfo.prototype, "defaultAccount", void 0);
__decorate([
    json2typescript_1.JsonProperty("recipient", String, true)
], AccountInfo.prototype, "recipient", void 0);
__decorate([
    json2typescript_1.JsonProperty("zip", String, true)
], AccountInfo.prototype, "zip", void 0);
__decorate([
    json2typescript_1.JsonProperty("address", String, true)
], AccountInfo.prototype, "address", void 0);
__decorate([
    json2typescript_1.JsonProperty("tel", String, true)
], AccountInfo.prototype, "tel", void 0);
AccountInfo = __decorate([
    json2typescript_1.JsonObject("AccountInfo")
], AccountInfo);
exports.AccountInfo = AccountInfo;
//# sourceMappingURL=AccountInfo.js.map