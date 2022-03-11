// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MerchantConfig {
    constructor(merchantCcId, merchantSecretKey, dummyRequest = "0", host = "https://api.veritrans.co.jp:443", timeout = 60, mdkErrorMode = false, allowHttp = false) {
        this.host = undefined;
        this.timeout = undefined;
        this.merchantCcId = undefined;
        this.merchantSecretKey = undefined;
        this.dummyRequest = undefined;
        this.mdkErrorMode = false;
        this.allowHttp = false;
        this.host = host;
        this.timeout = timeout;
        this.merchantCcId = merchantCcId;
        this.merchantSecretKey = merchantSecretKey;
        this.dummyRequest = dummyRequest;
        this.mdkErrorMode = mdkErrorMode;
        this.allowHttp = allowHttp;
    }
    static isNeedMask(name) {
        if (name == null)
            return false;
        return MerchantConfig.MASK_ITEM.map(value => value.toLowerCase()).some(value => value == name.toLowerCase());
    }
    static get userAgent() {
        return `VeriTrans 4G MDK/${MerchantConfig.MDK_VERSION}/${MerchantConfig.MDK_DTO_VERSION} (TypeScript)`;
    }
}
MerchantConfig.MASK_ITEM = ["cardNumber", "cardExpire", "birthday", "tel", "firstKanaName",
    "lastKanaName", "mailAddr", "merchantMailAddr", "cancelMailAddr", "name1", "name2", "kana", "kana1", "kana2",
    "telNo", "address1", "address2", "address3", "post1", "post2", "customerNo", "pan", "settleAmount",
    "exchangeRate", "paymentDate", "paymentStatus", "centerTxnId", "shipName", "shipStreet1", "shipStreet2",
    "shipCity", "shipState", "shipCountry", "shipPostalCode", "shipPhone", "reqFirstKanaName", "reqLastKanaName",
    "reqTel", "reqBirthday", "reqCardNumber", "reqCardExpire", "securityCode", "pin", "jis1SecondTrack",
    "jis2Track", "mailAddress", "firstName", "lastName", "recipient", "address", "zip", "emvData",
    "company", "emailAddress", "phoneNumber", "streetLine", "streetLine2", "city", "postal", "birthDate",
    "mothersMaidenName", "cardHolderName", "hashedCardNumber", "expireDate", "comment"];
MerchantConfig.ADD_URL_PAYMENT_VERSION = "v2";
MerchantConfig.ADD_URL_VTID_VERSION = "v1";
MerchantConfig.ADD_URL_PAYMENT = "paynow";
MerchantConfig.ADD_URL_VTID = "paynowid";
MerchantConfig.PAYNOWID_SERVICE_TYPE = ["account", "charge", "recurring", "cardinfo", "bankAccount"];
MerchantConfig.SERVICE_COMMAND_SEARCH = "Search";
MerchantConfig.SEARCH_SERVER = "search";
MerchantConfig.DUMMY_SERVER = "test";
MerchantConfig.MDK_VERSION = "1.0.1";
MerchantConfig.MDK_DTO_VERSION = "1.0.1";
exports.MerchantConfig = MerchantConfig;
//# sourceMappingURL=MerchantConfig.js.map