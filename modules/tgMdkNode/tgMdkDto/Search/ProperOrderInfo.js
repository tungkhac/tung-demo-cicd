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
let ProperOrderInfo = class ProperOrderInfo {
    constructor() {
        this.settlementMethod = undefined;
        this.settlementType = undefined;
        this.amount = undefined;
        this.authorizeAmount = undefined;
        this.balance = undefined;
        this.usedPoint = undefined;
        this.usePoint = undefined;
        this.givePoint = undefined;
        this.recruitCoupon = undefined;
        this.merchantCoupon = undefined;
        this.settlementLimit = undefined;
        this.forwardMailFlag = undefined;
        this.merchantMailAddr = undefined;
        this.cancelMailAddr = undefined;
        this.requestMailAddInfo = undefined;
        this.completeMailAddInfo = undefined;
        this.shopName = undefined;
        this.completeMailFlag = undefined;
        this.confirmScreenAddInfo = undefined;
        this.completeScreenAddInfo = undefined;
        this.screenTitle = undefined;
        this.completeReturnKind = undefined;
        this.completeReturnUrl = undefined;
        this.completeNoticeUrl = undefined;
        this.salesType = undefined;
        this.free = undefined;
        this.refundOrderCtlId = undefined;
        this.appUrl = undefined;
        this.orderKind = undefined;
        this.completeDatetime = undefined;
        this.reAuthorizeRedirectionUrl = undefined;
        this.transactionKind = undefined;
        this.userId = undefined;
        this.settlementId = undefined;
        this.reAuthAppUrl = undefined;
        this.cvsType = undefined;
        this.name1 = undefined;
        this.name2 = undefined;
        this.kana = undefined;
        this.telNo = undefined;
        this.mailAddr = undefined;
        this.free1 = undefined;
        this.free2 = undefined;
        this.payLimit = undefined;
        this.payLimitDatetime = undefined;
        this.receiptNo = undefined;
        this.paidDatetime = undefined;
        this.receivedDatetime = undefined;
        this.startTxn = undefined;
        this.dddMessageVersion = undefined;
        this.requestCurrencyUnit = undefined;
        this.cardExpire = undefined;
        this.tradUrl = undefined;
        this.invoiceId = undefined;
        this.payerId = undefined;
        this.paymentDatetime = undefined;
        this.merchantRedirectUri = undefined;
        this.totalAmount = undefined;
        this.walletAmount = undefined;
        this.cardAmount = undefined;
        this.cardOrderId = undefined;
        this.crServiceType = undefined;
        this.withCapture = undefined;
        this.accountingType = undefined;
        this.itemInfo = undefined;
        this.itemId = undefined;
        this.itemType = undefined;
        this.terminalKind = undefined;
        this.authorizeDatetime = undefined;
        this.captureDatetime = undefined;
        this.cancelDatetime = undefined;
        this.mpFirstDate = undefined;
        this.mpDay = undefined;
        this.mpStatus = undefined;
        this.mpOrderId = undefined;
        this.mpTxnStatusType = undefined;
        this.mpCaptureDatetime = undefined;
        this.mpCancelDatetime = undefined;
        this.mpTerminateDatetime = undefined;
        this.crOrderId = undefined;
        this.d3Flag = undefined;
        this.fletsArea = undefined;
        this.merchantRedirectionUrl = undefined;
        this.oricoOrderNo = undefined;
        this.userNo = undefined;
        this.itemName = undefined;
        this.itemName1 = undefined;
        this.itemCount1 = undefined;
        this.itemAmount1 = undefined;
        this.itemName2 = undefined;
        this.itemCount2 = undefined;
        this.itemAmount2 = undefined;
        this.itemName3 = undefined;
        this.itemCount3 = undefined;
        this.itemAmount3 = undefined;
        this.itemName4 = undefined;
        this.itemCount4 = undefined;
        this.itemAmount4 = undefined;
        this.itemName5 = undefined;
        this.itemCount5 = undefined;
        this.itemAmount5 = undefined;
        this.totalItemAmount = undefined;
        this.totalCarriage = undefined;
        this.deposit = undefined;
        this.shippingZipCode = undefined;
        this.handlingContractNo = undefined;
        this.memberStoreNo = undefined;
        this.contractDocumentKbn = undefined;
        this.webDescriptionId = undefined;
        this.rakutenOrderId = undefined;
        this.recruitOrderId = undefined;
        this.linepayOrderId = undefined;
        this.itemAmount = undefined;
        this.masterpassOrderId = undefined;
        this.acquirerCode = undefined;
        this.cardNumber = undefined;
        this.jpoInformation = undefined;
        this.vaccDepositStatusType = undefined;
        this.transferExpiredDate = undefined;
        this.reconcileDate = undefined;
        this.totalDepositAmount = undefined;
        this.entryTransferName = undefined;
        this.entryTransferNumber = undefined;
        this.accountNumber = undefined;
        this.accountManageType = undefined;
        this.tenpayServiceType = undefined;
        this.itemDetail = undefined;
        this.itemLabel = undefined;
        this.tenpayOrderId = undefined;
        this.bitcoinServiceType = undefined;
        this.itemDescription = undefined;
        this.currency = undefined;
        this.paymentAmount = undefined;
        this.paymentAmountBtc = undefined;
        this.paymentFixDatetime = undefined;
        this.balanceBtc = undefined;
        this.bitcoinOrderId = undefined;
        this.properTransactionInfo = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("settlementMethod", String, true)
], ProperOrderInfo.prototype, "settlementMethod", void 0);
__decorate([
    json2typescript_1.JsonProperty("settlementType", String, true)
], ProperOrderInfo.prototype, "settlementType", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String, true)
], ProperOrderInfo.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("authorizeAmount", String, true)
], ProperOrderInfo.prototype, "authorizeAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("balance", String, true)
], ProperOrderInfo.prototype, "balance", void 0);
__decorate([
    json2typescript_1.JsonProperty("usedPoint", String, true)
], ProperOrderInfo.prototype, "usedPoint", void 0);
__decorate([
    json2typescript_1.JsonProperty("usePoint", String, true)
], ProperOrderInfo.prototype, "usePoint", void 0);
__decorate([
    json2typescript_1.JsonProperty("givePoint", String, true)
], ProperOrderInfo.prototype, "givePoint", void 0);
__decorate([
    json2typescript_1.JsonProperty("recruitCoupon", String, true)
], ProperOrderInfo.prototype, "recruitCoupon", void 0);
__decorate([
    json2typescript_1.JsonProperty("merchantCoupon", String, true)
], ProperOrderInfo.prototype, "merchantCoupon", void 0);
__decorate([
    json2typescript_1.JsonProperty("settlementLimit", String, true)
], ProperOrderInfo.prototype, "settlementLimit", void 0);
__decorate([
    json2typescript_1.JsonProperty("forwardMailFlag", String, true)
], ProperOrderInfo.prototype, "forwardMailFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("merchantMailAddr", String, true)
], ProperOrderInfo.prototype, "merchantMailAddr", void 0);
__decorate([
    json2typescript_1.JsonProperty("cancelMailAddr", String, true)
], ProperOrderInfo.prototype, "cancelMailAddr", void 0);
__decorate([
    json2typescript_1.JsonProperty("requestMailAddInfo", String, true)
], ProperOrderInfo.prototype, "requestMailAddInfo", void 0);
__decorate([
    json2typescript_1.JsonProperty("completeMailAddInfo", String, true)
], ProperOrderInfo.prototype, "completeMailAddInfo", void 0);
__decorate([
    json2typescript_1.JsonProperty("shopName", String, true)
], ProperOrderInfo.prototype, "shopName", void 0);
__decorate([
    json2typescript_1.JsonProperty("completeMailFlag", String, true)
], ProperOrderInfo.prototype, "completeMailFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("confirmScreenAddInfo", String, true)
], ProperOrderInfo.prototype, "confirmScreenAddInfo", void 0);
__decorate([
    json2typescript_1.JsonProperty("completeScreenAddInfo", String, true)
], ProperOrderInfo.prototype, "completeScreenAddInfo", void 0);
__decorate([
    json2typescript_1.JsonProperty("screenTitle", String, true)
], ProperOrderInfo.prototype, "screenTitle", void 0);
__decorate([
    json2typescript_1.JsonProperty("completeReturnKind", String, true)
], ProperOrderInfo.prototype, "completeReturnKind", void 0);
__decorate([
    json2typescript_1.JsonProperty("completeReturnUrl", String, true)
], ProperOrderInfo.prototype, "completeReturnUrl", void 0);
__decorate([
    json2typescript_1.JsonProperty("completeNoticeUrl", String, true)
], ProperOrderInfo.prototype, "completeNoticeUrl", void 0);
__decorate([
    json2typescript_1.JsonProperty("salesType", String, true)
], ProperOrderInfo.prototype, "salesType", void 0);
__decorate([
    json2typescript_1.JsonProperty("free", String, true)
], ProperOrderInfo.prototype, "free", void 0);
__decorate([
    json2typescript_1.JsonProperty("refundOrderCtlId", String, true)
], ProperOrderInfo.prototype, "refundOrderCtlId", void 0);
__decorate([
    json2typescript_1.JsonProperty("appUrl", String, true)
], ProperOrderInfo.prototype, "appUrl", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderKind", String, true)
], ProperOrderInfo.prototype, "orderKind", void 0);
__decorate([
    json2typescript_1.JsonProperty("completeDatetime", String, true)
], ProperOrderInfo.prototype, "completeDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("reAuthorizeRedirectionUrl", String, true)
], ProperOrderInfo.prototype, "reAuthorizeRedirectionUrl", void 0);
__decorate([
    json2typescript_1.JsonProperty("transactionKind", String, true)
], ProperOrderInfo.prototype, "transactionKind", void 0);
__decorate([
    json2typescript_1.JsonProperty("userId", String, true)
], ProperOrderInfo.prototype, "userId", void 0);
__decorate([
    json2typescript_1.JsonProperty("settlementId", String, true)
], ProperOrderInfo.prototype, "settlementId", void 0);
__decorate([
    json2typescript_1.JsonProperty("reAuthAppUrl", String, true)
], ProperOrderInfo.prototype, "reAuthAppUrl", void 0);
__decorate([
    json2typescript_1.JsonProperty("cvsType", String, true)
], ProperOrderInfo.prototype, "cvsType", void 0);
__decorate([
    json2typescript_1.JsonProperty("name1", String, true)
], ProperOrderInfo.prototype, "name1", void 0);
__decorate([
    json2typescript_1.JsonProperty("name2", String, true)
], ProperOrderInfo.prototype, "name2", void 0);
__decorate([
    json2typescript_1.JsonProperty("kana", String, true)
], ProperOrderInfo.prototype, "kana", void 0);
__decorate([
    json2typescript_1.JsonProperty("telNo", String, true)
], ProperOrderInfo.prototype, "telNo", void 0);
__decorate([
    json2typescript_1.JsonProperty("mailAddr", String, true)
], ProperOrderInfo.prototype, "mailAddr", void 0);
__decorate([
    json2typescript_1.JsonProperty("free1", String, true)
], ProperOrderInfo.prototype, "free1", void 0);
__decorate([
    json2typescript_1.JsonProperty("free2", String, true)
], ProperOrderInfo.prototype, "free2", void 0);
__decorate([
    json2typescript_1.JsonProperty("payLimit", String, true)
], ProperOrderInfo.prototype, "payLimit", void 0);
__decorate([
    json2typescript_1.JsonProperty("payLimitDatetime", String, true)
], ProperOrderInfo.prototype, "payLimitDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("receiptNo", String, true)
], ProperOrderInfo.prototype, "receiptNo", void 0);
__decorate([
    json2typescript_1.JsonProperty("paidDatetime", String, true)
], ProperOrderInfo.prototype, "paidDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("receivedDatetime", String, true)
], ProperOrderInfo.prototype, "receivedDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("startTxn", String, true)
], ProperOrderInfo.prototype, "startTxn", void 0);
__decorate([
    json2typescript_1.JsonProperty("dddMessageVersion", String, true)
], ProperOrderInfo.prototype, "dddMessageVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("requestCurrencyUnit", String, true)
], ProperOrderInfo.prototype, "requestCurrencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardExpire", String, true)
], ProperOrderInfo.prototype, "cardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("tradUrl", String, true)
], ProperOrderInfo.prototype, "tradUrl", void 0);
__decorate([
    json2typescript_1.JsonProperty("invoiceId", String, true)
], ProperOrderInfo.prototype, "invoiceId", void 0);
__decorate([
    json2typescript_1.JsonProperty("payerId", String, true)
], ProperOrderInfo.prototype, "payerId", void 0);
__decorate([
    json2typescript_1.JsonProperty("paymentDatetime", String, true)
], ProperOrderInfo.prototype, "paymentDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("merchantRedirectUri", String, true)
], ProperOrderInfo.prototype, "merchantRedirectUri", void 0);
__decorate([
    json2typescript_1.JsonProperty("totalAmount", String, true)
], ProperOrderInfo.prototype, "totalAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("walletAmount", String, true)
], ProperOrderInfo.prototype, "walletAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardAmount", String, true)
], ProperOrderInfo.prototype, "cardAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardOrderId", String, true)
], ProperOrderInfo.prototype, "cardOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("crServiceType", String, true)
], ProperOrderInfo.prototype, "crServiceType", void 0);
__decorate([
    json2typescript_1.JsonProperty("withCapture", String, true)
], ProperOrderInfo.prototype, "withCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountingType", String, true)
], ProperOrderInfo.prototype, "accountingType", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemInfo", String, true)
], ProperOrderInfo.prototype, "itemInfo", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemId", String, true)
], ProperOrderInfo.prototype, "itemId", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemType", String, true)
], ProperOrderInfo.prototype, "itemType", void 0);
__decorate([
    json2typescript_1.JsonProperty("terminalKind", String, true)
], ProperOrderInfo.prototype, "terminalKind", void 0);
__decorate([
    json2typescript_1.JsonProperty("authorizeDatetime", String, true)
], ProperOrderInfo.prototype, "authorizeDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("captureDatetime", String, true)
], ProperOrderInfo.prototype, "captureDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("cancelDatetime", String, true)
], ProperOrderInfo.prototype, "cancelDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("mpFirstDate", String, true)
], ProperOrderInfo.prototype, "mpFirstDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("mpDay", String, true)
], ProperOrderInfo.prototype, "mpDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("mpStatus", String, true)
], ProperOrderInfo.prototype, "mpStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("mpOrderId", String, true)
], ProperOrderInfo.prototype, "mpOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("mpTxnStatusType", String, true)
], ProperOrderInfo.prototype, "mpTxnStatusType", void 0);
__decorate([
    json2typescript_1.JsonProperty("mpCaptureDatetime", String, true)
], ProperOrderInfo.prototype, "mpCaptureDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("mpCancelDatetime", String, true)
], ProperOrderInfo.prototype, "mpCancelDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("mpTerminateDatetime", String, true)
], ProperOrderInfo.prototype, "mpTerminateDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("crOrderId", String, true)
], ProperOrderInfo.prototype, "crOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("d3Flag", String, true)
], ProperOrderInfo.prototype, "d3Flag", void 0);
__decorate([
    json2typescript_1.JsonProperty("fletsArea", String, true)
], ProperOrderInfo.prototype, "fletsArea", void 0);
__decorate([
    json2typescript_1.JsonProperty("merchantRedirectionUrl", String, true)
], ProperOrderInfo.prototype, "merchantRedirectionUrl", void 0);
__decorate([
    json2typescript_1.JsonProperty("oricoOrderNo", String, true)
], ProperOrderInfo.prototype, "oricoOrderNo", void 0);
__decorate([
    json2typescript_1.JsonProperty("userNo", String, true)
], ProperOrderInfo.prototype, "userNo", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemName", String, true)
], ProperOrderInfo.prototype, "itemName", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemName1", String, true)
], ProperOrderInfo.prototype, "itemName1", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemCount1", String, true)
], ProperOrderInfo.prototype, "itemCount1", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemAmount1", String, true)
], ProperOrderInfo.prototype, "itemAmount1", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemName2", String, true)
], ProperOrderInfo.prototype, "itemName2", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemCount2", String, true)
], ProperOrderInfo.prototype, "itemCount2", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemAmount2", String, true)
], ProperOrderInfo.prototype, "itemAmount2", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemName3", String, true)
], ProperOrderInfo.prototype, "itemName3", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemCount3", String, true)
], ProperOrderInfo.prototype, "itemCount3", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemAmount3", String, true)
], ProperOrderInfo.prototype, "itemAmount3", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemName4", String, true)
], ProperOrderInfo.prototype, "itemName4", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemCount4", String, true)
], ProperOrderInfo.prototype, "itemCount4", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemAmount4", String, true)
], ProperOrderInfo.prototype, "itemAmount4", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemName5", String, true)
], ProperOrderInfo.prototype, "itemName5", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemCount5", String, true)
], ProperOrderInfo.prototype, "itemCount5", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemAmount5", String, true)
], ProperOrderInfo.prototype, "itemAmount5", void 0);
__decorate([
    json2typescript_1.JsonProperty("totalItemAmount", String, true)
], ProperOrderInfo.prototype, "totalItemAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("totalCarriage", String, true)
], ProperOrderInfo.prototype, "totalCarriage", void 0);
__decorate([
    json2typescript_1.JsonProperty("deposit", String, true)
], ProperOrderInfo.prototype, "deposit", void 0);
__decorate([
    json2typescript_1.JsonProperty("shippingZipCode", String, true)
], ProperOrderInfo.prototype, "shippingZipCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("handlingContractNo", String, true)
], ProperOrderInfo.prototype, "handlingContractNo", void 0);
__decorate([
    json2typescript_1.JsonProperty("memberStoreNo", String, true)
], ProperOrderInfo.prototype, "memberStoreNo", void 0);
__decorate([
    json2typescript_1.JsonProperty("contractDocumentKbn", String, true)
], ProperOrderInfo.prototype, "contractDocumentKbn", void 0);
__decorate([
    json2typescript_1.JsonProperty("webDescriptionId", String, true)
], ProperOrderInfo.prototype, "webDescriptionId", void 0);
__decorate([
    json2typescript_1.JsonProperty("rakutenOrderId", String, true)
], ProperOrderInfo.prototype, "rakutenOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("recruitOrderId", String, true)
], ProperOrderInfo.prototype, "recruitOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("linepayOrderId", String, true)
], ProperOrderInfo.prototype, "linepayOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemAmount", String, true)
], ProperOrderInfo.prototype, "itemAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("masterpassOrderId", String, true)
], ProperOrderInfo.prototype, "masterpassOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerCode", String, true)
], ProperOrderInfo.prototype, "acquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardNumber", String, true)
], ProperOrderInfo.prototype, "cardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("jpoInformation", String, true)
], ProperOrderInfo.prototype, "jpoInformation", void 0);
__decorate([
    json2typescript_1.JsonProperty("vaccDepositStatusType", String, true)
], ProperOrderInfo.prototype, "vaccDepositStatusType", void 0);
__decorate([
    json2typescript_1.JsonProperty("transferExpiredDate", String, true)
], ProperOrderInfo.prototype, "transferExpiredDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("reconcileDate", String, true)
], ProperOrderInfo.prototype, "reconcileDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("totalDepositAmount", String, true)
], ProperOrderInfo.prototype, "totalDepositAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("entryTransferName", String, true)
], ProperOrderInfo.prototype, "entryTransferName", void 0);
__decorate([
    json2typescript_1.JsonProperty("entryTransferNumber", String, true)
], ProperOrderInfo.prototype, "entryTransferNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountNumber", String, true)
], ProperOrderInfo.prototype, "accountNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("accountManageType", String, true)
], ProperOrderInfo.prototype, "accountManageType", void 0);
__decorate([
    json2typescript_1.JsonProperty("tenpayServiceType", String, true)
], ProperOrderInfo.prototype, "tenpayServiceType", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemDetail", String, true)
], ProperOrderInfo.prototype, "itemDetail", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemLabel", String, true)
], ProperOrderInfo.prototype, "itemLabel", void 0);
__decorate([
    json2typescript_1.JsonProperty("tenpayOrderId", String, true)
], ProperOrderInfo.prototype, "tenpayOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("bitcoinServiceType", String, true)
], ProperOrderInfo.prototype, "bitcoinServiceType", void 0);
__decorate([
    json2typescript_1.JsonProperty("itemDescription", String, true)
], ProperOrderInfo.prototype, "itemDescription", void 0);
__decorate([
    json2typescript_1.JsonProperty("currency", String, true)
], ProperOrderInfo.prototype, "currency", void 0);
__decorate([
    json2typescript_1.JsonProperty("paymentAmount", String, true)
], ProperOrderInfo.prototype, "paymentAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("paymentAmountBtc", String, true)
], ProperOrderInfo.prototype, "paymentAmountBtc", void 0);
__decorate([
    json2typescript_1.JsonProperty("paymentFixDatetime", String, true)
], ProperOrderInfo.prototype, "paymentFixDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("balanceBtc", String, true)
], ProperOrderInfo.prototype, "balanceBtc", void 0);
__decorate([
    json2typescript_1.JsonProperty("bitcoinOrderId", String, true)
], ProperOrderInfo.prototype, "bitcoinOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("properTransactionInfo", String, true)
], ProperOrderInfo.prototype, "properTransactionInfo", void 0);
ProperOrderInfo = __decorate([
    json2typescript_1.JsonObject("properOrderInfo")
], ProperOrderInfo);
exports.ProperOrderInfo = ProperOrderInfo;
//# sourceMappingURL=ProperOrderInfo.js.map