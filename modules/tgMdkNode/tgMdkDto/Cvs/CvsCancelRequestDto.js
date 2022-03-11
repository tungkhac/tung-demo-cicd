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
let CvsCancelRequestDto = class CvsCancelRequestDto extends AbstractPaymentRequestDto_1.AbstractPaymentRequestDto {
    constructor() {
        super(...arguments);
        this.serviceType = "cvs";
        this.serviceCommand = "Cancel";
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
], CvsCancelRequestDto.prototype, "serviceOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderId", String, true)
], CvsCancelRequestDto.prototype, "orderId", void 0);
CvsCancelRequestDto = __decorate([
    json2typescript_1.JsonObject("CvsCancelRequestDto")
], CvsCancelRequestDto);
exports.CvsCancelRequestDto = CvsCancelRequestDto;
//# sourceMappingURL=CvsCancelRequestDto.js.map