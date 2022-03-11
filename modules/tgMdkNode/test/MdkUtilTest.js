// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const assert = require("power-assert");
const MdkUtil_1 = require("../tgMdk/MdkUtil");
const CardAuthorizeRequestDto_1 = require("../tgMdkDto/Card/CardAuthorizeRequestDto");
const FraudDetectionRequestDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionRequestDto");
const FraudDetectionDeviceDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionDeviceDto");
const FraudDetectionHeaderDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionHeaderDto");
const FraudDetectionTransactionDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionTransactionDto");
const FraudDetectionContactDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionContactDto");
const FraudDetectionSessionDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionSessionDto");
const FraudDetectionMethodCardDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionMethodCardDto");
const FraudDetectionUserAccountDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionUserAccountDto");
const FraudDetectionOrderDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionOrderDto");
const FraudDetectionLineItemDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionLineItemDto");
const FraudDetectionShipmentDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionShipmentDto");
const FraudDetectionCostDto_1 = require("../tgMdkDto/FraudDetection/FraudDetectionCostDto");
const json2typescript_1 = require("json2typescript");
const json_convert_enums_1 = require("json2typescript/src/json2typescript/json-convert-enums");
const CardAuthorizeResponseDto_1 = require("../tgMdkDto/Card/CardAuthorizeResponseDto");
mocha_1.describe('MdkUtil Test', () => {
    it("Mask test", () => {
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("test", "test"), "test");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("cardNumber", "2342-3423-4234-2341"), "234234******2341");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("cardNumber", "2342342342342341"), "234234******2341");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("cardNumber", "378282246310005"), "378282*****0005");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("cardNumber", "3782-822463-10005"), "378282*****0005");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("cardNumber", "36666666666660"), "366666****6660");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("cardNumber", "3666-666666-6660"), "366666****6660");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("cardNumber", "1234567890"), "**********");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("cardNumber", "12345678901"), "123456*8901");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("CardNumber", "4111111111111111"), "411111******1111");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("cardnumber", "4111111111111111"), "411111******1111");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("card_number", "4111111111111111"), "4111111111111111");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mailaddr", "foo@example.com"), "***@example.com");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mailaddr", "f@example.com"), "*@example.com");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mailaddr", "@example.com"), "@example.com");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mailaddr", "@example@.com"), "@example@.com");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mailaddr", "foo.example.com"), "foo.example.com");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mailaddr", "foo@t.co"), "***@t.co");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mailaddr", "foo@c"), "***@c");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mailaddr", "1@c"), "*@c");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mailaddr", "@"), "@");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mailaddr", "1@"), "*@");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mailAddress", "foo@example.com"), "***@example.com");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("Mailaddr", "foo@example.com"), "***@example.com");
        assert.equal(MdkUtil_1.MdkUtil.getMaskedValue("mail_addr", "foo@example.com"), "foo@example.com");
    });
    let request = new CardAuthorizeRequestDto_1.CardAuthorizeRequestDto();
    request.amount = "100";
    request.cardNumber = '4111111111111111';
    request.orderId = 'someorderid';
    request.accountId = 'tarou';
    request.cardExpire = '12/25';
    request.token = '43c23d46-f5dc-4527-a21b-0646d61db7b3';
    request.birthday = "0526";
    request.tel = "08000000000";
    request.firstKanaName = "ﾃｽﾄﾀﾛｳ";
    request.lastKanaName = "ﾃｽﾄｽｽﾞｷ";
    it("Serialize and mask CardAuthorizeRequestDto ", () => {
        let obj = MdkUtil_1.MdkUtil.convertDTOtoJsonObject(request);
        MdkUtil_1.MdkUtil.maskJson(obj);
        assert.equal(obj["cardNumber"], "411111******1111");
        assert.equal(obj["cardExpire"], "*****");
        assert.equal(obj["birthday"], "****");
        assert.equal(obj["tel"], "***********");
        assert.equal(obj["firstKanaName"], "******");
        assert.equal(obj["lastKanaName"], "*******");
        assert.equal(obj["orderId"], "someorderid");
    });
    it("Serialize and mask CardAuthorizeRequestDto with FraudDetection params", () => {
        let fraud = new FraudDetectionRequestDto_1.FraudDetectionRequestDto(new FraudDetectionDeviceDto_1.FraudDetectionDeviceDto("192.168.1.1", [
            new FraudDetectionHeaderDto_1.FraudDetectionHeaderDto("testName", "testValue")
        ]));
        fraud.contacts = [
            new FraudDetectionContactDto_1.FraudDetectionContactDto("1", "テスト", "タロウ", "JP"),
            new FraudDetectionContactDto_1.FraudDetectionContactDto("2", "テスト", "ハナコ", "JP")
        ];
        fraud.userAccount = new FraudDetectionUserAccountDto_1.FraudDetectionUserAccountDto();
        fraud.userAccount.id = "EC0000123";
        fraud.transaction = new FraudDetectionTransactionDto_1.FraudDetectionTransactionDto();
        fraud.transaction.payer = "1";
        fraud.transaction.methodCard = new FraudDetectionMethodCardDto_1.FraudDetectionMethodCardDto();
        fraud.transaction.methodCard.cardHolderName = "TAROU TEST";
        fraud.session = new FraudDetectionSessionDto_1.FraudDetectionSessionDto("kjlsd9234jd0jse902pjsdfu0a23");
        fraud.order = new FraudDetectionOrderDto_1.FraudDetectionOrderDto();
        fraud.order.lineItems = [
            new FraudDetectionLineItemDto_1.FraudDetectionLineItemDto("item1"),
            new FraudDetectionLineItemDto_1.FraudDetectionLineItemDto("item2"),
        ];
        fraud.order.shipment = new FraudDetectionShipmentDto_1.FraudDetectionShipmentDto();
        fraud.order.shipment.recipient = "2";
        fraud.order.shipment.cost = new FraudDetectionCostDto_1.FraudDetectionCostDto("300");
        fraud.order.shipment.lineItems = ["item1", "item2"];
        request.fraudDetectionRequest = fraud;
        let obj = MdkUtil_1.MdkUtil.convertDTOtoJsonObject(request);
        MdkUtil_1.MdkUtil.maskJson(obj);
        assert.equal(obj["fraudDetectionRequest"]["contacts"][0]["firstName"], "***");
        assert.equal(obj["fraudDetectionRequest"]["contacts"][0]["lastName"], "***");
        assert.equal(obj["fraudDetectionRequest"]["contacts"][1]["firstName"], "***");
        assert.equal(obj["fraudDetectionRequest"]["contacts"][1]["lastName"], "***");
    });
    it("deSerialize CardAuthorizeResponseDto", () => {
        let resultJson = "{\n" +
            "  \"vResultCode\": \"A001000000000000\",\n" +
            "  \"custTxn\": \"30065281\",\n" +
            "  \"acquirerCode\": \"05\",\n" +
            "  \"cardTransactiontype\": \"a\",\n" +
            "  \"centerRequestDate\": \"20190527113315\",\n" +
            "  \"centerResponseDate\": \"20190527113315\",\n" +
            "  \"connectedCenterId\": \"jcn\",\n" +
            "  \"fraudDetectionResponse\": {\n" +
            "    \"agResponse\": {\n" +
            "      \"decision\": \"accept\",\n" +
            "      \"hitReasons\": [\n" +
            "        \"DUMMY-REASON\"\n" +
            "      ],\n" +
            "      \"hitRules\": [\n" +
            "        \"DUMMY-RULE\"\n" +
            "      ]\n" +
            "    },\n" +
            "    \"result\": \"accept\",\n" +
            "    \"service\": \"ag\"\n" +
            "  },\n" +
            "  \"gatewayRequestDate\": \"20190527113315\",\n" +
            "  \"gatewayResponseDate\": \"20190527113315\",\n" +
            "  \"loopback\": \"0\",\n" +
            "  \"pending\": \"0\",\n" +
            "  \"reqAcquirerCode\": \"05\",\n" +
            "  \"reqAmount\": \"100\",\n" +
            "  \"reqCardExpire\": \"*****\",\n" +
            "  \"reqCardNumber\": \"411111********11\",\n" +
            "  \"reqItemCode\": \"0990\",\n" +
            "  \"resActionCode\": \"000\",\n" +
            "  \"resAuthCode\": \"000000\",\n" +
            "  \"resCenterErrorCode\": \"   \",\n" +
            "  \"resReturnReferenceNumber\": \"012345678901\",\n" +
            "  \"marchTxn\": \"30065281\",\n" +
            "  \"merrMsg\": \"処理が成功しました。\",\n" +
            "  \"mstatus\": \"success\",\n" +
            "  \"optionResults\": [],\n" +
            "  \"orderId\": \"order-1558924394\",\n" +
            "  \"serviceType\": \"card\",\n" +
            "  \"txnVersion\": \"1.0.1\"\n" +
            "}";
        try {
            let jsonConvert = new json2typescript_1.JsonConvert();
            jsonConvert.operationMode = json2typescript_1.OperationMode.ENABLE;
            jsonConvert.ignorePrimitiveChecks = true;
            jsonConvert.valueCheckingMode = json2typescript_1.ValueCheckingMode.ALLOW_NULL;
            jsonConvert.propertyMatchingRule = json_convert_enums_1.PropertyMatchingRule.CASE_INSENSITIVE;
            let obj = JSON.parse(resultJson);
            let response = jsonConvert.deserializeObject(obj, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
            assert.equal(response.orderId, "order-1558924394");
        }
        catch (e) {
            assert.fail();
        }
    });
});
//# sourceMappingURL=MdkUtilTest.js.map