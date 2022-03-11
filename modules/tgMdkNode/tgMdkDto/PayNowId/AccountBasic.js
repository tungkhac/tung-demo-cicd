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
let AccountBasic = class AccountBasic {
    constructor() {
        this.lastName = undefined;
        this.lastKanaName = undefined;
        this.firstName = undefined;
        this.firstKanaName = undefined;
        this.mailAddress = undefined;
        this.createDate = undefined;
        this.deleteDate = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("lastName", String, true)
], AccountBasic.prototype, "lastName", void 0);
__decorate([
    json2typescript_1.JsonProperty("lastKanaName", String, true)
], AccountBasic.prototype, "lastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstName", String, true)
], AccountBasic.prototype, "firstName", void 0);
__decorate([
    json2typescript_1.JsonProperty("firstKanaName", String, true)
], AccountBasic.prototype, "firstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("mailAddress", String, true)
], AccountBasic.prototype, "mailAddress", void 0);
__decorate([
    json2typescript_1.JsonProperty("createDate", String, true)
], AccountBasic.prototype, "createDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("deleteDate", String, true)
], AccountBasic.prototype, "deleteDate", void 0);
AccountBasic = __decorate([
    json2typescript_1.JsonObject("AccountBasic")
], AccountBasic);
exports.AccountBasic = AccountBasic;
//# sourceMappingURL=AccountBasic.js.map