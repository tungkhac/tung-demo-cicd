// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const assert = require("power-assert");
const MerchantConfig_1 = require("../tgMdk/MerchantConfig");
const Transaction_1 = require("../tgMdk/Transaction");
const CardAuthorizeRequestDto_1 = require("../tgMdkDto/Card/CardAuthorizeRequestDto");
const Log4js = require("log4js");
const CardAuthorizeResponseDto_1 = require("../tgMdkDto/Card/CardAuthorizeResponseDto");
const moq_ts_1 = require("moq.ts");
const net_1 = require("net");
mocha_1.describe('Transaction Test', () => {
    const merchantCcId = "some_merchant_ccid";
    const merchantSecret = "some_merchant_secret_key";
    it("Card url Test", () => {
        let request = new CardAuthorizeRequestDto_1.CardAuthorizeRequestDto();
        request.amount = "100";
        request.orderId = 'some_order_id';
        request.accountId = 'some_account_id';
        request.token = 'abcdef01-2345-6789-abcd-ef0123456789';
        request.birthday = "0526";
        request.tel = "1234";
        request.firstKanaName = "ﾃｽﾄﾀﾛｳ";
        request.lastKanaName = "ﾃｽﾄｽｽﾞｷ";
        let config = new MerchantConfig_1.MerchantConfig(merchantCcId, merchantSecret);
        let url = Transaction_1.Transaction.createSendUrl(request, config.host, MerchantConfig_1.MerchantConfig.ADD_URL_PAYMENT, MerchantConfig_1.MerchantConfig.ADD_URL_PAYMENT_VERSION, MerchantConfig_1.MerchantConfig.PAYNOWID_SERVICE_TYPE, MerchantConfig_1.MerchantConfig.ADD_URL_VTID, MerchantConfig_1.MerchantConfig.ADD_URL_VTID_VERSION, MerchantConfig_1.MerchantConfig.SERVICE_COMMAND_SEARCH, MerchantConfig_1.MerchantConfig.SEARCH_SERVER, config.dummyRequest, MerchantConfig_1.MerchantConfig.DUMMY_SERVER);
        assert.equal(url, "https://api.veritrans.co.jp:443/paynow/v2/Authorize/card");
        url = Transaction_1.Transaction.createSendUrl(request, config.host, MerchantConfig_1.MerchantConfig.ADD_URL_PAYMENT, MerchantConfig_1.MerchantConfig.ADD_URL_PAYMENT_VERSION, MerchantConfig_1.MerchantConfig.PAYNOWID_SERVICE_TYPE, MerchantConfig_1.MerchantConfig.ADD_URL_VTID, MerchantConfig_1.MerchantConfig.ADD_URL_VTID_VERSION, MerchantConfig_1.MerchantConfig.SERVICE_COMMAND_SEARCH, MerchantConfig_1.MerchantConfig.SEARCH_SERVER, "1", MerchantConfig_1.MerchantConfig.DUMMY_SERVER);
        assert.equal(url, "https://api.veritrans.co.jp:443/test-paynow/v2/Authorize/card");
    });
    it("Card request Test success", () => __awaiter(this, void 0, void 0, function* () {
        Log4js.configure({
            appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
        });
        let logger = Log4js.getLogger("default");
        let config = new MerchantConfig_1.MerchantConfig(merchantCcId, merchantSecret);
        let responseMock = new moq_ts_1.Mock("Response mock");
        responseMock.setup(instance => instance.body).returns("{\"result\":{\"vResultCode\":\"A001000000000000\",\"custTxn\":\"30446978\",\"acquirerCode\":\"05\",\"cardTransactiontype\":\"a\",\"centerRequestDate\":\"20190531140107\",\"centerResponseDate\":\"20190531140107\",\"connectedCenterId\":\"jcn\",\"fraudDetectionResponse\":{\"agResponse\":{\"decision\":\"accept\",\"hitReasons\":[\"DUMMY-REASON\"],\"hitRules\":[\"DUMMY-RULE\"]},\"result\":\"accept\",\"service\":\"ag\"},\"gatewayRequestDate\":\"20190531140107\",\"gatewayResponseDate\":\"20190531140107\",\"loopback\":\"0\",\"pending\":\"0\",\"reqAcquirerCode\":\"05\",\"reqAmount\":\"100\",\"reqCardExpire\":\"*****\",\"reqCardNumber\":\"411111********11\",\"reqItemCode\":\"0990\",\"resActionCode\":\"000\",\"resAuthCode\":\"000000\",\"resCenterErrorCode\":\"   \",\"resReturnReferenceNumber\":\"012345678901\",\"marchTxn\":\"30446978\",\"merrMsg\":\"処理が成功しました。\",\"mstatus\":\"success\",\"optionResults\":[],\"orderId\":\"order-1559278058\",\"serviceType\":\"card\",\"txnVersion\":\"1.0.1\"}}");
        responseMock.setup(instance => instance.statusCode).returns(200);
        let httpClientMock = new moq_ts_1.Mock("HttpClient mock");
        httpClientMock.setup(instance => instance.execute(moq_ts_1.It.Is(value => value === "https://api.veritrans.co.jp:443/paynow/v2/Authorize/card"), moq_ts_1.It.IsAny())).returns(yield new Promise(resolve => resolve(responseMock.object())));
        let transaction = new Transaction_1.Transaction(logger, config, httpClientMock.object());
        let request = genDto();
        let responseDto = yield transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
        httpClientMock.verify(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny()), moq_ts_1.Times.Once());
        assert.equal(responseDto.mstatus, "success");
        assert.equal(responseDto.orderId, request.orderId);
    }));
    it("Card request Test 500", () => __awaiter(this, void 0, void 0, function* () {
        Log4js.configure({
            appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
        });
        let logger = Log4js.getLogger("default");
        let config = new MerchantConfig_1.MerchantConfig(merchantCcId, merchantSecret);
        let response = new IncomingMessage(new net_1.Socket());
        response.statusCode = 500;
        let httpClientMock;
        httpClientMock = new moq_ts_1.Mock("HttpClient mock 2");
        httpClientMock.setup(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny())).throws(response);
        let transaction = new Transaction_1.Transaction(logger, config, httpClientMock.object());
        let request = genDto();
        let responseDto = yield transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
        httpClientMock.verify(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny()), moq_ts_1.Times.Once());
        assert.equal(responseDto.vResultCode, "MF05000000000000");
    }));
    it("Card request Test 502", () => __awaiter(this, void 0, void 0, function* () {
        Log4js.configure({
            appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
        });
        let logger = Log4js.getLogger("default");
        let config = new MerchantConfig_1.MerchantConfig(merchantCcId, merchantSecret);
        let response = new IncomingMessage(new net_1.Socket());
        response.statusCode = 502;
        let httpClientMock;
        httpClientMock = new moq_ts_1.Mock("HttpClient mock 2");
        httpClientMock.setup(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny())).throws(response);
        let transaction = new Transaction_1.Transaction(logger, config, httpClientMock.object());
        let request = genDto();
        let responseDto = yield transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
        httpClientMock.verify(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny()), moq_ts_1.Times.Once());
        assert.equal(responseDto.vResultCode, "MF06000000000000");
    }));
    it("Card request Test 503", () => __awaiter(this, void 0, void 0, function* () {
        Log4js.configure({
            appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
        });
        let logger = Log4js.getLogger("default");
        let config = new MerchantConfig_1.MerchantConfig(merchantCcId, merchantSecret);
        let response = new IncomingMessage(new net_1.Socket());
        response.statusCode = 503;
        let httpClientMock;
        httpClientMock = new moq_ts_1.Mock("HttpClient mock 2");
        httpClientMock.setup(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny())).throws(response);
        let transaction = new Transaction_1.Transaction(logger, config, httpClientMock.object());
        let request = genDto();
        let responseDto = yield transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
        httpClientMock.verify(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny()), moq_ts_1.Times.Once());
        assert.equal(responseDto.vResultCode, "MF07000000000000");
    }));
    it("Card request Test 505", () => __awaiter(this, void 0, void 0, function* () {
        Log4js.configure({
            appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
        });
        let logger = Log4js.getLogger("default");
        let config = new MerchantConfig_1.MerchantConfig(merchantCcId, merchantSecret);
        let response = new IncomingMessage(new net_1.Socket());
        response.statusCode = 505;
        let httpClientMock;
        httpClientMock = new moq_ts_1.Mock("HttpClient mock 2");
        httpClientMock.setup(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny())).throws(response);
        let transaction = new Transaction_1.Transaction(logger, config, httpClientMock.object());
        let request = genDto();
        let responseDto = yield transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
        httpClientMock.verify(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny()), moq_ts_1.Times.Once());
        assert.equal(responseDto.vResultCode, "MF02000000000000");
    }));
    it("Card request Test ETIMEDOUT", () => __awaiter(this, void 0, void 0, function* () {
        Log4js.configure({
            appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
        });
        let logger = Log4js.getLogger("default");
        let config = new MerchantConfig_1.MerchantConfig(merchantCcId, merchantSecret);
        let response = new Error();
        response["code"] = "ETIMEDOUT";
        let httpClientMock;
        httpClientMock = new moq_ts_1.Mock("HttpClient mock 2");
        httpClientMock.setup(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny())).throws(response);
        let transaction = new Transaction_1.Transaction(logger, config, httpClientMock.object());
        let request = genDto();
        let responseDto = yield transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
        httpClientMock.verify(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny()), moq_ts_1.Times.Once());
        assert.equal(responseDto.vResultCode, "MF03000000000000");
    }));
    it("Card request Test ENOTFOUND", () => __awaiter(this, void 0, void 0, function* () {
        Log4js.configure({
            appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
        });
        let logger = Log4js.getLogger("default");
        let config = new MerchantConfig_1.MerchantConfig(merchantCcId, merchantSecret);
        let response = new Error();
        response["code"] = "ENOTFOUND";
        let httpClientMock;
        httpClientMock = new moq_ts_1.Mock("HttpClient mock 2");
        httpClientMock.setup(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny())).throws(response);
        let transaction = new Transaction_1.Transaction(logger, config, httpClientMock.object());
        let request = genDto();
        let responseDto = yield transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
        httpClientMock.verify(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny()), moq_ts_1.Times.Once());
        assert.equal(responseDto.vResultCode, "MF04000000000000");
    }));
    it("Card request Test other code", () => __awaiter(this, void 0, void 0, function* () {
        Log4js.configure({
            appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
        });
        let logger = Log4js.getLogger("default");
        let config = new MerchantConfig_1.MerchantConfig(merchantCcId, merchantSecret);
        let response = new Error();
        response["code"] = "OTHER";
        let httpClientMock;
        httpClientMock = new moq_ts_1.Mock("HttpClient mock 2");
        httpClientMock.setup(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny())).throws(response);
        let transaction = new Transaction_1.Transaction(logger, config, httpClientMock.object());
        let request = genDto();
        let responseDto = yield transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
        httpClientMock.verify(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny()), moq_ts_1.Times.Once());
        assert.equal(responseDto.vResultCode, "MF99000000000000");
    }));
    it("Card request Test SSL Error", () => __awaiter(this, void 0, void 0, function* () {
        Log4js.configure({
            appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
        });
        let logger = Log4js.getLogger("default");
        let config = new MerchantConfig_1.MerchantConfig(merchantCcId, merchantSecret);
        let response = new Error("SSL Error");
        let httpClientMock;
        httpClientMock = new moq_ts_1.Mock("HttpClient mock 2");
        httpClientMock.setup(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny())).throws(response);
        let transaction = new Transaction_1.Transaction(logger, config, httpClientMock.object());
        let request = genDto();
        let responseDto = yield transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
        httpClientMock.verify(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny()), moq_ts_1.Times.Once());
        assert.equal(responseDto.vResultCode, "MB03000000000000");
    }));
    it("Card request Test other message", () => __awaiter(this, void 0, void 0, function* () {
        Log4js.configure({
            appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
        });
        let logger = Log4js.getLogger("default");
        let config = new MerchantConfig_1.MerchantConfig(merchantCcId, merchantSecret);
        let response = new Error("Some Error Message");
        let httpClientMock;
        httpClientMock = new moq_ts_1.Mock("HttpClient mock 2");
        httpClientMock.setup(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny())).throws(response);
        let transaction = new Transaction_1.Transaction(logger, config, httpClientMock.object());
        let request = genDto();
        let responseDto = yield transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
        httpClientMock.verify(instance => instance.execute(moq_ts_1.It.IsAny(), moq_ts_1.It.IsAny()), moq_ts_1.Times.Once());
        assert.equal(responseDto.vResultCode, "MF99000000000000");
    }));
    function genDto() {
        let request = new CardAuthorizeRequestDto_1.CardAuthorizeRequestDto();
        request.amount = "100";
        request.orderId = 'order-1559278058';
        request.token = 'abcdef01-2345-6789-abcd-ef0123456789';
        return request;
    }
});
//# sourceMappingURL=TransactionTest.js.map