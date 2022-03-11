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
const MdkDtoBase_1 = require("./MdkDtoBase");
const PayNowIdParam_1 = require("./PayNowId/PayNowIdParam");
const AccountParam_1 = require("./PayNowId/AccountParam");
const AccountBasicParam_1 = require("./PayNowId/AccountBasicParam");
const CardParam_1 = require("./PayNowId/CardParam");
const RecurringChargeParam_1 = require("./PayNowId/RecurringChargeParam");
const BankAccountParam_1 = require("./PayNowId/BankAccountParam");
class AbstractPaymentRequestDto extends MdkDtoBase_1.MdkDtoBase {
    get accountId() {
        this.existAccountParam();
        return this.payNowIdParam.accountParam.accountId;
    }
    set accountId(value) {
        this.existAccountParam();
        this.payNowIdParam.accountParam.accountId = value;
    }
    get createDate() {
        this.existAccountBasicParam();
        return this.payNowIdParam.accountParam.accountBasicParam.createDate;
    }
    set createDate(value) {
        this.existAccountBasicParam();
        this.payNowIdParam.accountParam.accountBasicParam.createDate = value;
    }
    get freeKey() {
        this.existPayNowIdParam();
        return this.payNowIdParam.freeKey;
    }
    set freeKey(value) {
        this.existPayNowIdParam();
        this.payNowIdParam.freeKey = value;
    }
    get memo1() {
        this.existPayNowIdParam();
        return this.payNowIdParam.memo1;
    }
    set memo1(value) {
        this.existPayNowIdParam();
        this.payNowIdParam.memo1 = value;
    }
    get receiptData() {
        this.existPayNowIdParam();
        return this.payNowIdParam.receiptData;
    }
    set receiptData(value) {
        this.existPayNowIdParam();
        this.payNowIdParam.receiptData = value;
    }
    existPayNowIdParam() {
        if (this.payNowIdParam == null) {
            this.payNowIdParam = new PayNowIdParam_1.PayNowIdParam();
        }
    }
    existAccountParam() {
        this.existPayNowIdParam();
        if (this.payNowIdParam.accountParam == null) {
            this.payNowIdParam.accountParam = new AccountParam_1.AccountParam();
        }
    }
    existAccountBasicParam() {
        this.existAccountParam();
        if (this.payNowIdParam.accountParam.accountBasicParam == null) {
            this.payNowIdParam.accountParam.accountBasicParam = new AccountBasicParam_1.AccountBasicParam();
        }
    }
    existCardParam() {
        this.existAccountParam();
        if (this.payNowIdParam.accountParam.cardParam == null) {
            this.payNowIdParam.accountParam.cardParam = new CardParam_1.CardParam();
        }
    }
    existRecurringChargeParam() {
        this.existAccountParam();
        if (this.payNowIdParam.accountParam.recurringChargeParam == null) {
            this.payNowIdParam.accountParam.recurringChargeParam = new RecurringChargeParam_1.RecurringChargeParam();
        }
    }
    existBankAccountParam() {
        this.existAccountParam();
        if (this.payNowIdParam.accountParam.bankAccountParam == null) {
            this.payNowIdParam.accountParam.bankAccountParam = new BankAccountParam_1.BankAccountParam();
        }
    }
}
__decorate([
    json2typescript_1.JsonProperty("payNowIdParam", PayNowIdParam_1.PayNowIdParam)
], AbstractPaymentRequestDto.prototype, "payNowIdParam", void 0);
exports.AbstractPaymentRequestDto = AbstractPaymentRequestDto;
//# sourceMappingURL=AbstractPaymentRequestDto.js.map