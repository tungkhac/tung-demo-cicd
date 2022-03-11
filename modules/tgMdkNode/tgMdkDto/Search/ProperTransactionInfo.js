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
let ProperTransactionInfo = class ProperTransactionInfo {
    constructor() {
        this.txnKind = undefined;
        this.emTxnType = undefined;
        this.centerProcDatetime = undefined;
        this.cardType = undefined;
        this.cardNo = undefined;
        this.cardBrandCode = undefined;
        this.settlementStatus = undefined;
        this.cvsTxnType = undefined;
        this.peTxnType = undefined;
        this.receiptNo = undefined;
        this.startDatetime = undefined;
        this.cardTransactionType = undefined;
        this.gatewayRequestDate = undefined;
        this.gatewayResponseDate = undefined;
        this.centerRequestDate = undefined;
        this.centerResponseDate = undefined;
        this.centerRequestNumber = undefined;
        this.centerReferenceNumber = undefined;
        this.reqItemCode = undefined;
        this.resItemCode = undefined;
        this.reqReturnReferenceNumber = undefined;
        this.responsedata = undefined;
        this.pending = undefined;
        this.loopback = undefined;
        this.connectedCenterId = undefined;
        this.reqCardNumber = undefined;
        this.reqCardExpire = undefined;
        this.reqAmount = undefined;
        this.reqCardOptionType = undefined;
        this.reqMerchantTransaction = undefined;
        this.reqAuthCode = undefined;
        this.reqAcquirerCode = undefined;
        this.reqCardCenter = undefined;
        this.reqJpoInformation = undefined;
        this.reqSalesDay = undefined;
        this.reqCancelDay = undefined;
        this.reqWithCapture = undefined;
        this.reqWithDirect = undefined;
        this.req3dMessageVersion = undefined;
        this.req3dTransactionId = undefined;
        this.req3dTransactionStatus = undefined;
        this.req3dCavvAlgorithm = undefined;
        this.req3dCavv = undefined;
        this.req3dEci = undefined;
        this.reqSecurityCode = undefined;
        this.reqAuthFlag = undefined;
        this.reqBirthday = undefined;
        this.reqTel = undefined;
        this.reqFirstKanaName = undefined;
        this.reqLastKanaName = undefined;
        this.resMerchantTransaction = undefined;
        this.resReturnReferenceNumber = undefined;
        this.resAuthCode = undefined;
        this.resActionCode = undefined;
        this.resCenterErrorCode = undefined;
        this.resAuthTerm = undefined;
        this.reqWithNew = undefined;
        this.amount = undefined;
        this.txnFixed = undefined;
        this.ppTxnType = undefined;
        this.centerTxnId = undefined;
        this.feeAmount = undefined;
        this.exchangeRate = undefined;
        this.netRefundAmount = undefined;
        this.mpiTransactionType = undefined;
        this.reqRedirectionUri = undefined;
        this.corporationId = undefined;
        this.brandId = undefined;
        this.acquirerBinary = undefined;
        this.dsLoginId = undefined;
        this.crresStatus = undefined;
        this.veresStatus = undefined;
        this.paresStatus = undefined;
        this.paresSign = undefined;
        this.paresEci = undefined;
        this.authResponseCode = undefined;
        this.verifyResponseCode = undefined;
        this.res3dMessageVersion = undefined;
        this.res3dTransactionId = undefined;
        this.res3dTransactionStatus = undefined;
        this.res3dCavvAlgorithm = undefined;
        this.res3dCavv = undefined;
        this.res3dEci = undefined;
        this.authRequestDatetime = undefined;
        this.authResponseDatetime = undefined;
        this.verifyRequestDatetime = undefined;
        this.verifyResponseDatetime = undefined;
        this.reqCurrencyUnit = undefined;
        this.aqAqfWalletBalance = undefined;
        this.aqAqfPointBalance = undefined;
        this.aqAvailableValue = undefined;
        this.upopTxnType = undefined;
        this.resUpopSettleAmount = undefined;
        this.resUpopSettleDate = undefined;
        this.resUpopSettleCurrency = undefined;
        this.resUpopExchangeDate = undefined;
        this.resUpopExchangeRate = undefined;
        this.resUpopOrderId = undefined;
        this.centerTradeId = undefined;
        this.alipayTxnType = undefined;
        this.settleAmount = undefined;
        this.settleCurrency = undefined;
        this.paymentTime = undefined;
        this.settlementTime = undefined;
        this.payType = undefined;
        this.crResultCode = undefined;
        this.detailCommandType = undefined;
        this.crRequestDatetime = undefined;
        this.crResponseDatetime = undefined;
        this.oricoTxnType = undefined;
        this.orderStateCode = undefined;
        this.approvalNo = undefined;
        this.requestDate = undefined;
        this.loanPrincipal = undefined;
        this.paymentCount = undefined;
        this.jpyAmount = undefined;
        this.resMcpResponseCode = undefined;
        this.rakutenApiErrorCode = undefined;
        this.rakutenOrderErrorCode = undefined;
        this.rakutenRequestDatetime = undefined;
        this.rakutenResponseDatetime = undefined;
        this.recruitErrorCode = undefined;
        this.recruitRequestDatetime = undefined;
        this.recruitResponseDatetime = undefined;
        this.linepayErrorCode = undefined;
        this.linepayRequestDatetime = undefined;
        this.linepayResponseDatetime = undefined;
        this.authCode = undefined;
        this.referenceNumber = undefined;
        this.cardVResultCode = undefined;
        this.masterpassRequestDatetime = undefined;
        this.masterpassResponseDatetime = undefined;
        this.withReconcile = undefined;
        this.depositId = undefined;
        this.registrationMethod = undefined;
        this.depositDate = undefined;
        this.transferName = undefined;
        this.tenpayErrorCode = undefined;
        this.tenpayRequestDatetime = undefined;
        this.tenpayResponseDatetime = undefined;
        this.amountBtc = undefined;
        this.bitcoinRequestDatetime = undefined;
        this.bitcoinResponseDatetime = undefined;
        this.resCenterProcessNumber = undefined;
        this.resCenterSendDateTime = undefined;
    }
};
__decorate([
    json2typescript_1.JsonProperty("txnKind", String, true)
], ProperTransactionInfo.prototype, "txnKind", void 0);
__decorate([
    json2typescript_1.JsonProperty("emTxnType", String, true)
], ProperTransactionInfo.prototype, "emTxnType", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerProcDatetime", String, true)
], ProperTransactionInfo.prototype, "centerProcDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardType", String, true)
], ProperTransactionInfo.prototype, "cardType", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardNo", String, true)
], ProperTransactionInfo.prototype, "cardNo", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardBrandCode", String, true)
], ProperTransactionInfo.prototype, "cardBrandCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("settlementStatus", String, true)
], ProperTransactionInfo.prototype, "settlementStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("cvsTxnType", String, true)
], ProperTransactionInfo.prototype, "cvsTxnType", void 0);
__decorate([
    json2typescript_1.JsonProperty("peTxnType", String, true)
], ProperTransactionInfo.prototype, "peTxnType", void 0);
__decorate([
    json2typescript_1.JsonProperty("receiptNo", String, true)
], ProperTransactionInfo.prototype, "receiptNo", void 0);
__decorate([
    json2typescript_1.JsonProperty("startDatetime", String, true)
], ProperTransactionInfo.prototype, "startDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardTransactionType", String, true)
], ProperTransactionInfo.prototype, "cardTransactionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("gatewayRequestDate", String, true)
], ProperTransactionInfo.prototype, "gatewayRequestDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("gatewayResponseDate", String, true)
], ProperTransactionInfo.prototype, "gatewayResponseDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerRequestDate", String, true)
], ProperTransactionInfo.prototype, "centerRequestDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerResponseDate", String, true)
], ProperTransactionInfo.prototype, "centerResponseDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerRequestNumber", String, true)
], ProperTransactionInfo.prototype, "centerRequestNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerReferenceNumber", String, true)
], ProperTransactionInfo.prototype, "centerReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqItemCode", String, true)
], ProperTransactionInfo.prototype, "reqItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resItemCode", String, true)
], ProperTransactionInfo.prototype, "resItemCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqReturnReferenceNumber", String, true)
], ProperTransactionInfo.prototype, "reqReturnReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("responsedata", String, true)
], ProperTransactionInfo.prototype, "responsedata", void 0);
__decorate([
    json2typescript_1.JsonProperty("pending", String, true)
], ProperTransactionInfo.prototype, "pending", void 0);
__decorate([
    json2typescript_1.JsonProperty("loopback", String, true)
], ProperTransactionInfo.prototype, "loopback", void 0);
__decorate([
    json2typescript_1.JsonProperty("connectedCenterId", String, true)
], ProperTransactionInfo.prototype, "connectedCenterId", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardNumber", String, true)
], ProperTransactionInfo.prototype, "reqCardNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardExpire", String, true)
], ProperTransactionInfo.prototype, "reqCardExpire", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAmount", String, true)
], ProperTransactionInfo.prototype, "reqAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardOptionType", String, true)
], ProperTransactionInfo.prototype, "reqCardOptionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqMerchantTransaction", String, true)
], ProperTransactionInfo.prototype, "reqMerchantTransaction", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAuthCode", String, true)
], ProperTransactionInfo.prototype, "reqAuthCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAcquirerCode", String, true)
], ProperTransactionInfo.prototype, "reqAcquirerCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCardCenter", String, true)
], ProperTransactionInfo.prototype, "reqCardCenter", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqJpoInformation", String, true)
], ProperTransactionInfo.prototype, "reqJpoInformation", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSalesDay", String, true)
], ProperTransactionInfo.prototype, "reqSalesDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCancelDay", String, true)
], ProperTransactionInfo.prototype, "reqCancelDay", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithCapture", String, true)
], ProperTransactionInfo.prototype, "reqWithCapture", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithDirect", String, true)
], ProperTransactionInfo.prototype, "reqWithDirect", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dMessageVersion", String, true)
], ProperTransactionInfo.prototype, "req3dMessageVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dTransactionId", String, true)
], ProperTransactionInfo.prototype, "req3dTransactionId", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dTransactionStatus", String, true)
], ProperTransactionInfo.prototype, "req3dTransactionStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dCavvAlgorithm", String, true)
], ProperTransactionInfo.prototype, "req3dCavvAlgorithm", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dCavv", String, true)
], ProperTransactionInfo.prototype, "req3dCavv", void 0);
__decorate([
    json2typescript_1.JsonProperty("req3dEci", String, true)
], ProperTransactionInfo.prototype, "req3dEci", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqSecurityCode", String, true)
], ProperTransactionInfo.prototype, "reqSecurityCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqAuthFlag", String, true)
], ProperTransactionInfo.prototype, "reqAuthFlag", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqBirthday", String, true)
], ProperTransactionInfo.prototype, "reqBirthday", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqTel", String, true)
], ProperTransactionInfo.prototype, "reqTel", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqFirstKanaName", String, true)
], ProperTransactionInfo.prototype, "reqFirstKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqLastKanaName", String, true)
], ProperTransactionInfo.prototype, "reqLastKanaName", void 0);
__decorate([
    json2typescript_1.JsonProperty("resMerchantTransaction", String, true)
], ProperTransactionInfo.prototype, "resMerchantTransaction", void 0);
__decorate([
    json2typescript_1.JsonProperty("resReturnReferenceNumber", String, true)
], ProperTransactionInfo.prototype, "resReturnReferenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("resAuthCode", String, true)
], ProperTransactionInfo.prototype, "resAuthCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resActionCode", String, true)
], ProperTransactionInfo.prototype, "resActionCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterErrorCode", String, true)
], ProperTransactionInfo.prototype, "resCenterErrorCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("resAuthTerm", String, true)
], ProperTransactionInfo.prototype, "resAuthTerm", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqWithNew", String, true)
], ProperTransactionInfo.prototype, "reqWithNew", void 0);
__decorate([
    json2typescript_1.JsonProperty("amount", String, true)
], ProperTransactionInfo.prototype, "amount", void 0);
__decorate([
    json2typescript_1.JsonProperty("txnFixed", String, true)
], ProperTransactionInfo.prototype, "txnFixed", void 0);
__decorate([
    json2typescript_1.JsonProperty("ppTxnType", String, true)
], ProperTransactionInfo.prototype, "ppTxnType", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerTxnId", String, true)
], ProperTransactionInfo.prototype, "centerTxnId", void 0);
__decorate([
    json2typescript_1.JsonProperty("feeAmount", String, true)
], ProperTransactionInfo.prototype, "feeAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("exchangeRate", String, true)
], ProperTransactionInfo.prototype, "exchangeRate", void 0);
__decorate([
    json2typescript_1.JsonProperty("netRefundAmount", String, true)
], ProperTransactionInfo.prototype, "netRefundAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("mpiTransactionType", String, true)
], ProperTransactionInfo.prototype, "mpiTransactionType", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqRedirectionUri", String, true)
], ProperTransactionInfo.prototype, "reqRedirectionUri", void 0);
__decorate([
    json2typescript_1.JsonProperty("corporationId", String, true)
], ProperTransactionInfo.prototype, "corporationId", void 0);
__decorate([
    json2typescript_1.JsonProperty("brandId", String, true)
], ProperTransactionInfo.prototype, "brandId", void 0);
__decorate([
    json2typescript_1.JsonProperty("acquirerBinary", String, true)
], ProperTransactionInfo.prototype, "acquirerBinary", void 0);
__decorate([
    json2typescript_1.JsonProperty("dsLoginId", String, true)
], ProperTransactionInfo.prototype, "dsLoginId", void 0);
__decorate([
    json2typescript_1.JsonProperty("crresStatus", String, true)
], ProperTransactionInfo.prototype, "crresStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("veresStatus", String, true)
], ProperTransactionInfo.prototype, "veresStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("paresStatus", String, true)
], ProperTransactionInfo.prototype, "paresStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("paresSign", String, true)
], ProperTransactionInfo.prototype, "paresSign", void 0);
__decorate([
    json2typescript_1.JsonProperty("paresEci", String, true)
], ProperTransactionInfo.prototype, "paresEci", void 0);
__decorate([
    json2typescript_1.JsonProperty("authResponseCode", String, true)
], ProperTransactionInfo.prototype, "authResponseCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("verifyResponseCode", String, true)
], ProperTransactionInfo.prototype, "verifyResponseCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("res3dMessageVersion", String, true)
], ProperTransactionInfo.prototype, "res3dMessageVersion", void 0);
__decorate([
    json2typescript_1.JsonProperty("res3dTransactionId", String, true)
], ProperTransactionInfo.prototype, "res3dTransactionId", void 0);
__decorate([
    json2typescript_1.JsonProperty("res3dTransactionStatus", String, true)
], ProperTransactionInfo.prototype, "res3dTransactionStatus", void 0);
__decorate([
    json2typescript_1.JsonProperty("res3dCavvAlgorithm", String, true)
], ProperTransactionInfo.prototype, "res3dCavvAlgorithm", void 0);
__decorate([
    json2typescript_1.JsonProperty("res3dCavv", String, true)
], ProperTransactionInfo.prototype, "res3dCavv", void 0);
__decorate([
    json2typescript_1.JsonProperty("res3dEci", String, true)
], ProperTransactionInfo.prototype, "res3dEci", void 0);
__decorate([
    json2typescript_1.JsonProperty("authRequestDatetime", String, true)
], ProperTransactionInfo.prototype, "authRequestDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("authResponseDatetime", String, true)
], ProperTransactionInfo.prototype, "authResponseDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("verifyRequestDatetime", String, true)
], ProperTransactionInfo.prototype, "verifyRequestDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("verifyResponseDatetime", String, true)
], ProperTransactionInfo.prototype, "verifyResponseDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("reqCurrencyUnit", String, true)
], ProperTransactionInfo.prototype, "reqCurrencyUnit", void 0);
__decorate([
    json2typescript_1.JsonProperty("aqAqfWalletBalance", String, true)
], ProperTransactionInfo.prototype, "aqAqfWalletBalance", void 0);
__decorate([
    json2typescript_1.JsonProperty("aqAqfPointBalance", String, true)
], ProperTransactionInfo.prototype, "aqAqfPointBalance", void 0);
__decorate([
    json2typescript_1.JsonProperty("aqAvailableValue", String, true)
], ProperTransactionInfo.prototype, "aqAvailableValue", void 0);
__decorate([
    json2typescript_1.JsonProperty("upopTxnType", String, true)
], ProperTransactionInfo.prototype, "upopTxnType", void 0);
__decorate([
    json2typescript_1.JsonProperty("resUpopSettleAmount", String, true)
], ProperTransactionInfo.prototype, "resUpopSettleAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("resUpopSettleDate", String, true)
], ProperTransactionInfo.prototype, "resUpopSettleDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("resUpopSettleCurrency", String, true)
], ProperTransactionInfo.prototype, "resUpopSettleCurrency", void 0);
__decorate([
    json2typescript_1.JsonProperty("resUpopExchangeDate", String, true)
], ProperTransactionInfo.prototype, "resUpopExchangeDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("resUpopExchangeRate", String, true)
], ProperTransactionInfo.prototype, "resUpopExchangeRate", void 0);
__decorate([
    json2typescript_1.JsonProperty("resUpopOrderId", String, true)
], ProperTransactionInfo.prototype, "resUpopOrderId", void 0);
__decorate([
    json2typescript_1.JsonProperty("centerTradeId", String, true)
], ProperTransactionInfo.prototype, "centerTradeId", void 0);
__decorate([
    json2typescript_1.JsonProperty("alipayTxnType", String, true)
], ProperTransactionInfo.prototype, "alipayTxnType", void 0);
__decorate([
    json2typescript_1.JsonProperty("settleAmount", String, true)
], ProperTransactionInfo.prototype, "settleAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("settleCurrency", String, true)
], ProperTransactionInfo.prototype, "settleCurrency", void 0);
__decorate([
    json2typescript_1.JsonProperty("paymentTime", String, true)
], ProperTransactionInfo.prototype, "paymentTime", void 0);
__decorate([
    json2typescript_1.JsonProperty("settlementTime", String, true)
], ProperTransactionInfo.prototype, "settlementTime", void 0);
__decorate([
    json2typescript_1.JsonProperty("payType", String, true)
], ProperTransactionInfo.prototype, "payType", void 0);
__decorate([
    json2typescript_1.JsonProperty("crResultCode", String, true)
], ProperTransactionInfo.prototype, "crResultCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("detailCommandType", String, true)
], ProperTransactionInfo.prototype, "detailCommandType", void 0);
__decorate([
    json2typescript_1.JsonProperty("crRequestDatetime", String, true)
], ProperTransactionInfo.prototype, "crRequestDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("crResponseDatetime", String, true)
], ProperTransactionInfo.prototype, "crResponseDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("oricoTxnType", String, true)
], ProperTransactionInfo.prototype, "oricoTxnType", void 0);
__decorate([
    json2typescript_1.JsonProperty("orderStateCode", String, true)
], ProperTransactionInfo.prototype, "orderStateCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("approvalNo", String, true)
], ProperTransactionInfo.prototype, "approvalNo", void 0);
__decorate([
    json2typescript_1.JsonProperty("requestDate", String, true)
], ProperTransactionInfo.prototype, "requestDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("loanPrincipal", String, true)
], ProperTransactionInfo.prototype, "loanPrincipal", void 0);
__decorate([
    json2typescript_1.JsonProperty("paymentCount", String, true)
], ProperTransactionInfo.prototype, "paymentCount", void 0);
__decorate([
    json2typescript_1.JsonProperty("jpyAmount", String, true)
], ProperTransactionInfo.prototype, "jpyAmount", void 0);
__decorate([
    json2typescript_1.JsonProperty("resMcpResponseCode", String, true)
], ProperTransactionInfo.prototype, "resMcpResponseCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("rakutenApiErrorCode", String, true)
], ProperTransactionInfo.prototype, "rakutenApiErrorCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("rakutenOrderErrorCode", String, true)
], ProperTransactionInfo.prototype, "rakutenOrderErrorCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("rakutenRequestDatetime", String, true)
], ProperTransactionInfo.prototype, "rakutenRequestDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("rakutenResponseDatetime", String, true)
], ProperTransactionInfo.prototype, "rakutenResponseDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("recruitErrorCode", String, true)
], ProperTransactionInfo.prototype, "recruitErrorCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("recruitRequestDatetime", String, true)
], ProperTransactionInfo.prototype, "recruitRequestDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("recruitResponseDatetime", String, true)
], ProperTransactionInfo.prototype, "recruitResponseDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("linepayErrorCode", String, true)
], ProperTransactionInfo.prototype, "linepayErrorCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("linepayRequestDatetime", String, true)
], ProperTransactionInfo.prototype, "linepayRequestDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("linepayResponseDatetime", String, true)
], ProperTransactionInfo.prototype, "linepayResponseDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("authCode", String, true)
], ProperTransactionInfo.prototype, "authCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("referenceNumber", String, true)
], ProperTransactionInfo.prototype, "referenceNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("cardVResultCode", String, true)
], ProperTransactionInfo.prototype, "cardVResultCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("masterpassRequestDatetime", String, true)
], ProperTransactionInfo.prototype, "masterpassRequestDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("masterpassResponseDatetime", String, true)
], ProperTransactionInfo.prototype, "masterpassResponseDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("withReconcile", String, true)
], ProperTransactionInfo.prototype, "withReconcile", void 0);
__decorate([
    json2typescript_1.JsonProperty("depositId", String, true)
], ProperTransactionInfo.prototype, "depositId", void 0);
__decorate([
    json2typescript_1.JsonProperty("registrationMethod", String, true)
], ProperTransactionInfo.prototype, "registrationMethod", void 0);
__decorate([
    json2typescript_1.JsonProperty("depositDate", String, true)
], ProperTransactionInfo.prototype, "depositDate", void 0);
__decorate([
    json2typescript_1.JsonProperty("transferName", String, true)
], ProperTransactionInfo.prototype, "transferName", void 0);
__decorate([
    json2typescript_1.JsonProperty("tenpayErrorCode", String, true)
], ProperTransactionInfo.prototype, "tenpayErrorCode", void 0);
__decorate([
    json2typescript_1.JsonProperty("tenpayRequestDatetime", String, true)
], ProperTransactionInfo.prototype, "tenpayRequestDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("tenpayResponseDatetime", String, true)
], ProperTransactionInfo.prototype, "tenpayResponseDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("amountBtc", String, true)
], ProperTransactionInfo.prototype, "amountBtc", void 0);
__decorate([
    json2typescript_1.JsonProperty("bitcoinRequestDatetime", String, true)
], ProperTransactionInfo.prototype, "bitcoinRequestDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("bitcoinResponseDatetime", String, true)
], ProperTransactionInfo.prototype, "bitcoinResponseDatetime", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterProcessNumber", String, true)
], ProperTransactionInfo.prototype, "resCenterProcessNumber", void 0);
__decorate([
    json2typescript_1.JsonProperty("resCenterSendDateTime", String, true)
], ProperTransactionInfo.prototype, "resCenterSendDateTime", void 0);
ProperTransactionInfo = __decorate([
    json2typescript_1.JsonObject("properTransactionInfo")
], ProperTransactionInfo);
exports.ProperTransactionInfo = ProperTransactionInfo;
//# sourceMappingURL=ProperTransactionInfo.js.map