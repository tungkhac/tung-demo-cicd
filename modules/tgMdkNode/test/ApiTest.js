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
const SearchRequestDto_1 = require("../tgMdkDto/Search/SearchRequestDto");
const CommonSearchParameter_1 = require("../tgMdkDto/Search/CommonSearchParameter");
const SearchParameters_1 = require("../tgMdkDto/Search/SearchParameters");
const SearchResponseDto_1 = require("../tgMdkDto/Search/SearchResponseDto");
const CardCaptureRequestDto_1 = require("../tgMdkDto/Card/CardCaptureRequestDto");
const CardCaptureResponseDto_1 = require("../tgMdkDto/Card/CardCaptureResponseDto");
const CardCancelRequestDto_1 = require("../tgMdkDto/Card/CardCancelRequestDto");
const CardCancelResponseDto_1 = require("../tgMdkDto/Card/CardCancelResponseDto");
const CardReAuthorizeRequestDto_1 = require("../tgMdkDto/Card/CardReAuthorizeRequestDto");
const CardReAuthorizeResponseDto_1 = require("../tgMdkDto/Card/CardReAuthorizeResponseDto");
const MpiAuthorizeRequestDto_1 = require("../tgMdkDto/Mpi/MpiAuthorizeRequestDto");
const MpiAuthorizeResponseDto_1 = require("../tgMdkDto/Mpi/MpiAuthorizeResponseDto");
const CvsAuthorizeRequestDto_1 = require("../tgMdkDto/Cvs/CvsAuthorizeRequestDto");
const CvsAuthorizeResponseDto_1 = require("../tgMdkDto/Cvs/CvsAuthorizeResponseDto");
const CvsCancelRequestDto_1 = require("../tgMdkDto/Cvs/CvsCancelRequestDto");
const CvsCancelResponseDto_1 = require("../tgMdkDto/Cvs/CvsCancelResponseDto");
function getConfig() {
    return new MerchantConfig_1.MerchantConfig("Set Merchant CcId here.", "Set Merchant Secret Key here.", "1");
}
function getLogger() {
    Log4js.configure({
        appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
    });
    return Log4js.getLogger("default");
}
mocha_1.describe('Card Api Test', () => {
    let orderId;
    let transaction;
    it("Card Authorize Test", () => __awaiter(this, void 0, void 0, function* () {
        let logger = getLogger();
        let config = getConfig();
        transaction = new Transaction_1.Transaction(logger, config);
        orderId = 'order-' + Math.floor(((new Date()).getTime()) / 1000).toString();
        let request = new CardAuthorizeRequestDto_1.CardAuthorizeRequestDto();
        request.amount = "100";
        request.token = 'abcdef01-2345-6789-abcd-ef0123456789';
        //request.cardNumber = '4111111111111111';
        //request.cardExpire = '12/25';
        request.orderId = orderId;
        request.withCapture = "false";
        let responseDto = yield transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
        let requestLog = request.maskedLog;
        let resultJson = responseDto.resultJson;
        assert.equal(responseDto.orderId, request.orderId);
        assert.equal(responseDto.mstatus, "success");
        assert.notEqual(requestLog, null);
        assert.notEqual(resultJson, null);
    }));
    it("Order Search Test", () => __awaiter(this, void 0, void 0, function* () {
        let searchRequest = new SearchRequestDto_1.SearchRequestDto();
        searchRequest.serviceTypeCd = ["card"];
        searchRequest.containDummyFlag = "true";
        searchRequest.searchParameters = new SearchParameters_1.SearchParameters(new CommonSearchParameter_1.CommonSearchParameter(orderId));
        let searchResponseDto = yield transaction.execute(searchRequest, SearchResponseDto_1.SearchResponseDto);
        assert.equal(searchResponseDto.vResultCode, "N001000000000000");
        assert.equal(searchResponseDto.searchCount, "1");
    }));
    it("Card Capture Test", () => __awaiter(this, void 0, void 0, function* () {
        let captureRequestDto = new CardCaptureRequestDto_1.CardCaptureRequestDto();
        captureRequestDto.orderId = orderId;
        captureRequestDto.amount = "100";
        let captureResponseDto = yield transaction.execute(captureRequestDto, CardCaptureResponseDto_1.CardCaptureResponseDto);
        assert.equal(captureResponseDto.mstatus, "success");
    }));
    it("Card Cancel Test", () => __awaiter(this, void 0, void 0, function* () {
        let cancelRequestDto = new CardCancelRequestDto_1.CardCancelRequestDto();
        cancelRequestDto.orderId = orderId;
        cancelRequestDto.amount = "100";
        let cancelResponseDto = yield transaction.execute(cancelRequestDto, CardCancelResponseDto_1.CardCancelResponseDto);
        assert.equal(cancelResponseDto.mstatus, "success");
    }));
    it("Card ReAuthorize Test", () => __awaiter(this, void 0, void 0, function* () {
        let reAuthorizeRequestDto = new CardReAuthorizeRequestDto_1.CardReAuthorizeRequestDto();
        reAuthorizeRequestDto.originalOrderId = orderId;
        reAuthorizeRequestDto.orderId = orderId + "-2";
        reAuthorizeRequestDto.amount = "100";
        let cardReAuthorizeResponseDto = yield transaction.execute(reAuthorizeRequestDto, CardReAuthorizeResponseDto_1.CardReAuthorizeResponseDto);
        assert.equal(cardReAuthorizeResponseDto.mstatus, "success");
    }));
});

mocha_1.describe('Mpi Api Test', () => {
    let orderId;
    let transaction;
    let requestId;
    it("Mpi Authorize Test", () => __awaiter(this, void 0, void 0, function* () {
        let logger = getLogger();
        let config = getConfig();
        transaction = new Transaction_1.Transaction(logger, config);
        orderId = 'order-' + Math.floor(((new Date()).getTime()) / 1000).toString();
        let request = new MpiAuthorizeRequestDto_1.MpiAuthorizeRequestDto();
        request.serviceOptionType = "mpi-complete";
        request.orderId = orderId;
        request.amount = "100";
        request.token = 'abcdef01-2345-6789-abcd-ef0123456789';
        //request.cardNumber = '4111111111111111';
        //request.cardExpire = '12/25';
        request.withCapture = "false";
        request.redirectionUri = "http://localhost/index.php";
        request.httpUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3800.0 Safari/537.36 Edg/76.0.172.0";
        request.httpAccept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3";
        let responseDto = yield transaction.execute(request, MpiAuthorizeResponseDto_1.MpiAuthorizeResponseDto);
        let requestLog = request.maskedLog;
        let resultJson = responseDto.resultJson;
        assert.equal(responseDto.orderId, request.orderId);
        assert.equal(responseDto.mstatus, "success");
        assert.notEqual(requestLog, null);
        assert.notEqual(resultJson, null);
    }));
    /*    it("Mpi Search Test", async () => {
            let searchRequest = new SearchRequestDto();
            searchRequest.requestId = requestId;
            searchRequest.serviceTypeCd = ["card"];
            searchRequest.containDummyFlag = "true";
            let searchResponseDto = await transaction.execute(searchRequest, SearchResponseDto);
            assert.equal(searchResponseDto.vResultCode, "N001000000000000");
            assert.equal(searchResponseDto.searchCount, "1");
        });*/
});

mocha_1.describe('Cvs Api Test', () => {
    let orderId;
    let transaction;
    it("Cvs Authorize Test", () => __awaiter(this, void 0, void 0, function* () {
        let logger = getLogger();
        let config = getConfig();
        transaction = new Transaction_1.Transaction(logger, config);
        orderId = 'order-' + Math.floor(((new Date()).getTime()) / 1000).toString();
        let request = new CvsAuthorizeRequestDto_1.CvsAuthorizeRequestDto();
        request.serviceOptionType = "sej";
        request.orderId = orderId;
        request.amount = "100";
        request.name1 = "支払い";
        request.name2 = "太郎";
        request.serviceOptionType = "sej";
        request.telNo = "090-0000-0000";
        request.payLimit = "2019/08/01";
        request.paymentType = "0";
        let responseDto = yield transaction.execute(request, CvsAuthorizeResponseDto_1.CvsAuthorizeResponseDto);
        let requestLog = request.maskedLog;
        let resultJson = responseDto.resultJson;
        assert.equal(responseDto.orderId, request.orderId);
        assert.equal(responseDto.mstatus, "success");
        assert.notEqual(requestLog, null);
        assert.notEqual(resultJson, null);
    }));
    it("Cvs Cancel Test", () => __awaiter(this, void 0, void 0, function* () {
        let cvsCancelRequestDto = new CvsCancelRequestDto_1.CvsCancelRequestDto();
        cvsCancelRequestDto.serviceOptionType = "sej";
        cvsCancelRequestDto.orderId = orderId;
        let cancelResponseDto = yield transaction.execute(cvsCancelRequestDto, CvsCancelResponseDto_1.CvsCancelResponseDto);
        assert.equal(cancelResponseDto.mstatus, "success");
    }));
});

//# sourceMappingURL=ApiTest.js.map