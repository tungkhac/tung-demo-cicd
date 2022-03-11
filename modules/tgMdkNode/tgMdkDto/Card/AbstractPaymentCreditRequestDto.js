// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractPaymentRequestDto_1 = require("../AbstractPaymentRequestDto");
class AbstractPaymentCreditRequestDto extends AbstractPaymentRequestDto_1.AbstractPaymentRequestDto {
    get cardId() {
        this.existCardParam();
        return this.payNowIdParam.accountParam.cardParam.cardId;
    }
    set cardId(value) {
        this.existCardParam();
        this.payNowIdParam.accountParam.cardParam.cardId = value;
    }
    get defaultCard() {
        this.existCardParam();
        return this.payNowIdParam.accountParam.cardParam.defaultCard;
    }
    set defaultCard(value) {
        this.existCardParam();
        this.payNowIdParam.accountParam.cardParam.defaultCard = value;
    }
    get groupId() {
        this.existRecurringChargeParam();
        return this.payNowIdParam.accountParam.recurringChargeParam.groupId;
    }
    set groupId(value) {
        this.existRecurringChargeParam();
        this.payNowIdParam.accountParam.recurringChargeParam.groupId = value;
    }
    get startDate() {
        this.existRecurringChargeParam();
        return this.payNowIdParam.accountParam.recurringChargeParam.startDate;
    }
    set startDate(value) {
        this.existRecurringChargeParam();
        this.payNowIdParam.accountParam.recurringChargeParam.startDate = value;
    }
    get endDate() {
        this.existRecurringChargeParam();
        return this.payNowIdParam.accountParam.recurringChargeParam.endDate;
    }
    set endDate(value) {
        this.existRecurringChargeParam();
        this.payNowIdParam.accountParam.recurringChargeParam.endDate = value;
    }
    get oneTimeAmount() {
        this.existRecurringChargeParam();
        return this.payNowIdParam.accountParam.recurringChargeParam.oneTimeAmount;
    }
    set oneTimeAmount(value) {
        this.existRecurringChargeParam();
        this.payNowIdParam.accountParam.recurringChargeParam.oneTimeAmount = value;
    }
    get recurringAmount() {
        this.existRecurringChargeParam();
        return this.payNowIdParam.accountParam.recurringChargeParam.amount;
    }
    set recurringAmount(value) {
        this.existRecurringChargeParam();
        this.payNowIdParam.accountParam.recurringChargeParam.amount = value;
    }
    get recurringMemo1() {
        this.existRecurringChargeParam();
        return this.payNowIdParam.accountParam.recurringChargeParam.recurringMemo1;
    }
    set recurringMemo1(value) {
        this.existRecurringChargeParam();
        this.payNowIdParam.accountParam.recurringChargeParam.recurringMemo1 = value;
    }
    get recurringMemo2() {
        this.existRecurringChargeParam();
        return this.payNowIdParam.accountParam.recurringChargeParam.recurringMemo2;
    }
    set recurringMemo2(value) {
        this.existRecurringChargeParam();
        this.payNowIdParam.accountParam.recurringChargeParam.recurringMemo2 = value;
    }
    get recurringMemo3() {
        this.existRecurringChargeParam();
        return this.payNowIdParam.accountParam.recurringChargeParam.recurringMemo3;
    }
    set recurringMemo3(value) {
        this.existRecurringChargeParam();
        this.payNowIdParam.accountParam.recurringChargeParam.recurringMemo3 = value;
    }
    get useChargeOption() {
        this.existRecurringChargeParam();
        return this.payNowIdParam.accountParam.recurringChargeParam.useChargeOption;
    }
    set useChargeOption(value) {
        this.existRecurringChargeParam();
        this.payNowIdParam.accountParam.recurringChargeParam.useChargeOption = value;
    }
    get recurringSalesDay() {
        this.existRecurringChargeParam();
        return this.payNowIdParam.accountParam.recurringChargeParam.salesDay;
    }
    set recurringSalesDay(value) {
        this.existRecurringChargeParam();
        this.payNowIdParam.accountParam.recurringChargeParam.salesDay = value;
    }
    get recurringAcquireCode() {
        this.existRecurringChargeParam();
        return this.payNowIdParam.accountParam.recurringChargeParam.acquireCode;
    }
    set recurringAcquireCode(value) {
        this.existRecurringChargeParam();
        this.payNowIdParam.accountParam.recurringChargeParam.acquireCode = value;
    }
    get tanking() {
        this.existPayNowIdParam();
        return this.payNowIdParam.tanking;
    }
    set tanking(value) {
        this.existPayNowIdParam();
        this.payNowIdParam.tanking = value;
    }
    get updater() {
        this.existPayNowIdParam();
        return this.payNowIdParam.accountParam.cardParam.updater;
    }
    set updater(value) {
        this.existPayNowIdParam();
        this.payNowIdParam.accountParam.cardParam.updater = value;
    }
    get token() {
        this.existPayNowIdParam();
        return this.payNowIdParam.token;
    }
    set token(value) {
        this.existPayNowIdParam();
        this.payNowIdParam.token = value;
    }
}
exports.AbstractPaymentCreditRequestDto = AbstractPaymentCreditRequestDto;
//# sourceMappingURL=AbstractPaymentCreditRequestDto.js.map