// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json2typescript_1 = require("json2typescript");
const json_convert_enums_1 = require("json2typescript/src/json2typescript/json-convert-enums");
const MerchantConfig_1 = require("./MerchantConfig");
class MdkUtil {
    static maskJson(obj) {
        if (Array.isArray(obj)) {
            this.parseArray(obj);
        }
        else if (typeof obj == "object") {
            this.parseObject(obj);
        }
    }
    static parseObject(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (Array.isArray(obj[key])) {
                    this.parseArray(obj[key]);
                }
                else if (typeof obj[key] == "object") {
                    this.parseObject(obj[key]);
                }
                else if (typeof obj[key] == "string") {
                    if (MerchantConfig_1.MerchantConfig.isNeedMask(key)) {
                        obj[key] = MdkUtil.getMaskedValue(key, obj[key]);
                    }
                }
            }
        }
    }
    static parseArray(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (Array.isArray(obj[key])) {
                    this.parseArray(obj[key]);
                }
                else if (typeof obj[key] == "object") {
                    this.parseObject(obj[key]);
                }
                else {
                }
            }
        }
    }
    static getMaskedValue(key, value) {
        if (value == null || value == "") {
            return "";
        }
        if (key.toLowerCase().indexOf("mailaddr") > -1) {
            let index = value.indexOf("@");
            if (index > 0) {
                return "*".repeat(index) + value.substr(index);
            }
            else {
                return value;
            }
        }
        else if (key.toLowerCase().indexOf("cardnumber") > -1) {
            let cardNumber = value.replace(/-/g, "");
            if (cardNumber.length >= 11) {
                return cardNumber.substr(0, 6) + ("*".repeat(cardNumber.length - 10)) + cardNumber.substr(-4);
            }
            else {
                return "*".repeat(cardNumber.length);
            }
        }
        else if (MerchantConfig_1.MerchantConfig.isNeedMask(key)) {
            return "*".repeat(value.length);
        }
        else {
            return value;
        }
    }
    static convertDTOtoJsonObject(dto) {
        let jsonConvert = new json2typescript_1.JsonConvert();
        jsonConvert.operationMode = json2typescript_1.OperationMode.ENABLE;
        jsonConvert.ignorePrimitiveChecks = false;
        jsonConvert.valueCheckingMode = json2typescript_1.ValueCheckingMode.DISALLOW_NULL;
        jsonConvert.propertyMatchingRule = json_convert_enums_1.PropertyMatchingRule.CASE_INSENSITIVE;
        return jsonConvert.serializeObject(dto);
    }
    static setResponseProperties(resultJson, type) {
        let obj = JSON.parse(resultJson); // 応答JSONをデシリアライズ
        // resultという名前のプロパティが存在することを確認し、
        if (obj.hasOwnProperty("result")) {
            let result = obj["result"]; // resultを取り出す
            delete obj["result"]; // objからresultを削除
            // objからrootレベルのキーを取得(payNowIdResponse, viewResultなど)
            let rootKeys = [];
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    rootKeys.push(key);
                }
            }
            for (let key in result) {
                if (result.hasOwnProperty(key)) {
                    // rootレベルにキー重複がなければresultのプロパティをobjに追加
                    if (!rootKeys.some(value => value == key)) {
                        obj[key] = result[key];
                    }
                }
            }
            let jsonConvert = new json2typescript_1.JsonConvert();
            jsonConvert.operationMode = json2typescript_1.OperationMode.ENABLE;
            jsonConvert.ignorePrimitiveChecks = true;
            jsonConvert.valueCheckingMode = json2typescript_1.ValueCheckingMode.ALLOW_NULL;
            jsonConvert.propertyMatchingRule = json_convert_enums_1.PropertyMatchingRule.CASE_INSENSITIVE;
            let response = jsonConvert.deserializeObject(obj, type); // T型にデシリアライズしてresponseに上書き
            MdkUtil.maskJson(obj);
            response.resultJson = JSON.stringify(obj); // resultJsonプロパティにマスクしたobjのJSONを詰める
            return response;
        }
        return new type();
    }
}
exports.MdkUtil = MdkUtil;
//# sourceMappingURL=MdkUtil.js.map