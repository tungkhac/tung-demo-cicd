// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by datlt on 27/05/2019.
 */
const request = require('request');
var express = require('express');
var moment = require('moment');
var validator = require('validator');
var router = express.Router();
var model = require('../../model');
const Connect =  model.Connect;
const ConnectPage =  model.ConnectPage;
const PaymentGateway =  model.PaymentGateway;
const EfoPOrderSetting =  model.EfoPOrderSetting;
const EfoMessageVariable =  model.EfoMessageVariable;
const EfoPOrderHistory =  model.EfoPOrderHistory;
const EfoCart =  model.EfoCart;
const Variable =  model.Variable;
const mongoose = require('mongoose');
const Common = require('../../modules/common');
const cryptor = require('../crypto');
const config = require('config');
const payment_np_error = require('../../public/locales/payment_np_error.json');
const TIMEZONE = config.get('timezone');
const he = require('he');

const PAYMENT_NP_COD_TYPE = "007",
    TYPE_EFO_PAYMENT_METHOD_SETTING_YES = '002',
    SEND_NP_NORMAL = '02',
    SEND_NP_WIZ = '03';
const PAYMENT_SUCCESS = '001',
    PAYMENT_FAIL = '002';

const SHIPPING_METHOD_NEW = '2';
const NP_WIZ = '2';

const authori_result = {
    "OK":"00",
    "NG":"20",
    "HOLD":"10",
    "BEFORE_AUTH": "40",
    "AUTH": "50"
};

const error_msg_arr = {
    "NG":"今回のご注文ではNP後払いをご利用いただけません。別の決済手段をご利用ください。",
    "HOLD":"情報不備がある可能性がございましたため、現時点ではNP後払いはご利用できません。",
    "BEFORE_AUTH": "40",
    "AUTH": "50"
};

const authori_result_ng = {
    "NG001":"ご利用上限金額を超えているため、NP後払いをご利用いただけません。別の決済手段をご利用ください。",
    "NG002":"情報不備がある可能性がございましたため、現時点ではNP後払いはご利用できません。別の決済手段をご利用ください。",
    "NG999":"今回のご注文ではNP後払いをご利用いただけません。別の決済手段をご利用ください。"
};

const authori_result_hold = {
    "RE009":"住所情報",
    "RE014":"勤務確認",
    "RE015":"配送先情報",
    "RE020":"配送先勤務",
    "RE021":"電話番号",
    "RE023":"配送先電話番号"
};

var default_error_message1 = 'システムエラーが発生しているため、サポートデスクへお問い合わせください。';
var default_error_message2 = 'ボットIDが正しいかご確認ください。';
var NP_CREATE_ORDER = {
    "test" : "https://ctcp.np-payment-gateway.com/v1/transactions",
    "production" : "https://cp.np-payment-gateway.com/v1/transactions"
};
var NP_CANCEL_ORDER = {
    "test" : "https://ctcp.np-payment-gateway.com/v1/transactions/cancel",
    "production" : "https://cp.np-payment-gateway.com/v1/transactions/cancel"
};

router.post('/order', function (req, res, next) {
    var response = {};
    try{
        var body = req.body;
        var list_input = [
            "np_merchant_code", "np_sp_code", "np_terminal_id", "np_mode",
            'cpid', "user_id",
            'last_name', 'first_name', 'last_furigana', 'first_furigana',
            'zipcode', 'pref', 'address1', 'address2', 'address3',
            'tel', 'email',
            'shipping_method',
            'shipping_last_name', 'shipping_first_name', 'shipping_last_furigana', 'shipping_first_furigana',
            'shipping_zipcode', 'shipping_pref', 'shipping_address1', 'shipping_address2', 'shipping_address3',
            'shipping_tel',
            'current_url', 'user_agent', 'user_device',
            'product_code',  'product_name',
            'payment_method', //“02:NP後払い”、”03:NP後払いwiz” のいずれか
            'product_unit_price', 'order_quantity', 'order_total', 'order_settlement_fee', 'order_shipping_fee', "order_sub_total"
        ];
        var data = getDataInput(list_input, body);
        if(data.np_mode !== "production"){
            data.np_node = "test";
        }

        data.customer_name = data.last_name + data.first_name;
        data.customer_name_kana = data.last_furigana + data.first_furigana;
        data.dest_customer_name = data.shipping_last_name + data.shipping_first_name;
        data.dest_customer_name_kana = data.shipping_last_furigana + data.shipping_first_furigana;
        data.address = data.pref + data.address1 + data.address2 + "　" + data.address3;
        data.dest_address = data.shipping_pref + data.shipping_address1 + data.shipping_address2  + "　" +  data.shipping_address3;
        console.log(data);
        var params = {
            cpid: data.cpid,
            user_id: data.user_id
        };
        //return res.status(200).json(response);
        // Validation inputs
        var error_validations = [];
        if (data.customer_name.length == 0) {
            error_validations.push('氏名は、必ず指定してください。');
        }
        if (data.address.length == 0) {
            error_validations.push('住所は、必ず指定してください。');
        }
        if (data.email.length == 0) {
            error_validations.push('メールアドレスは、必ず指定してください。');
        }
        if (data.tel.length == 0) {
            error_validations.push('電話番号は、必ず指定してください。');
        }
        if (data.email.length == 0) {
            error_validations.push('メールアドレス、必ず指定してください。');
        }

        if (error_validations.length) {
            response.error_message  = error_validations;
            return res.status(500).json(response);
        }

        ConnectPage.findOne({_id: data.cpid, deleted_at: null}, function (err, result) {
            if(result){
                params.encrypt_flg = result.encrypt_flg;
                params.encrypt_key = result.encrypt_key;
                params.connect_id = result.connect_id;

                getPaymentGatewayCODInfo(data, params, result.connect_id, function (error, error_message, gateway) {
                    console.log(error, error_message, gateway);
                    if(error){
                        response.error_message  = error_message;
                        return res.status(500).json(response);
                    }
                    var execTranUrl = NP_CREATE_ORDER[gateway.mode];

                    execTranNpCOD(params, data, gateway, execTranUrl, function (result) {
                        if(result && result.success){
                            console.log(result);
                            res.status(200).json(result.body);
                        }else{
                            if(result.error){
                                response.error_message = result.error;
                            }else{
                                response.error_message = default_error_message1;
                            }
                            console.log('response', response);
                            return res.status(500).json(response);
                        }
                    });
                });
            }else{
                response.error_message  = default_error_message2;
                return res.status(500).json(response);
            }
        });
    }catch(e){
        console.log(e);
        response.error_message  = default_error_message1;
        return res.status(500).json(response);
    }

});

function execTranNpCOD(params, data, gateway, post_url, callback) {
    // console.log("execTranNpCOD", params, price);
    var options = {};
    var result = [];
    result['success'] = false;
    var now = new Date();
    var request_date = moment(now).tz(TIMEZONE).format('YYYYMMDDHHmmss');
    // Last 6 character and time request date is order_id
    var order_id = request_date + '-' + data.user_id.toString().slice(-5).toUpperCase();

    if(gateway.np_merchant_code != undefined && gateway.sp_code != undefined && gateway.terminal_id != undefined){
        options['shop_transaction_id'] = order_id;
        options['shop_order_date'] = moment(now).tz(TIMEZONE).format('YYYY-MM-DD');

        var goods = [];
        var product_name = he.decode(data.product_name);

        goods.push({
            goods_name: product_name ? product_name.substr(0, 150) : '',
            goods_price: parseInt(data.product_unit_price),
            quantity: parseInt(data.order_quantity)
        });

        if (data.order_settlement_fee != 0 && parseInt(data.order_settlement_fee) > 0) {
            goods.push({
                goods_name: 'NP後払い手数料',
                goods_price: parseInt(data.order_settlement_fee),
                quantity: 1
            });
        }

        if (data.order_shipping_fee != 0 && parseInt(data.order_shipping_fee) > 0) {
            goods.push({
                goods_name: "送料他",
                goods_price: parseInt(data.order_shipping_fee),
                quantity: 1
            });
        }

        options['goods'] = goods;
        options['billed_amount'] = data.order_total;

        options['customer'] = {
            "customer_name" : data.customer_name,
            "customer_name_kana" :  data.customer_name_kana,
            "zip_code" :  data.zipcode,
            "address" :  data.address,
            "tel" :  data.tel,
            "email" :  data.email
        };

        if(data.shipping_method == SHIPPING_METHOD_NEW){
            options['dest_customer'] = {
                "customer_name" : data.dest_customer_name,
                "customer_name_kana" :  data.dest_customer_name_kana,
                "zip_code" :  data.shipping_zipcode,
                "address" :  data.dest_address,
                "tel" :  data.shipping_tel
            };
        }

        options['settlement_type'] = SEND_NP_NORMAL;
        //if (data.payment_method == NP_WIZ) {
        //    options['settlement_type'] = SEND_NP_WIZ;
        //}
        var transactions = [];
        transactions.push(options);

        console.dir(transactions);
        console.dir( options['goods']);
        //var result = {
        //    success: true
        //};
        //return callback(result);

        console.log(JSON.stringify(transactions, null, 4));

        var token = Buffer.from(gateway.np_merchant_code + ':' + gateway.sp_code).toString('base64');

        console.log({
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Basic ' + token,
                'X-NP-Terminal-Id': gateway.terminal_id
            },
            uri: post_url,
            method: 'POST',
            json: {
                transactions: transactions
            }
        });

        request({
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Basic ' + token,
                'X-NP-Terminal-Id': gateway.terminal_id
            },
            uri: post_url,
            method: 'POST',
            json: {
                transactions: transactions
            }
        }, function (error, response, body) {
            var result = {
                success: false
            };
            console.log(response.statusCode, body);
            if (response != void 0 && response.statusCode === 201 && body !== void 0) {
                if (body.results !== void 0 && body.results.length) {
                    var np_result = body.results[0];
                    if(np_result.authori_result == authori_result.OK){
                        result['success'] = true;
                        result['body'] = np_result;
                        //saveHistoryOrder(params, data, order_id, body, true, true);
                    }else{
                        result['success'] = false;
                        result['error'] = authori_result_ng.NG999;
                    }

                    //if(np_result.authori_result == authori_result.NG){
                    //    result['success'] = false;
                    //    result['body'] = body.results[0];
                    //    result['error'] = "";
                    //}
                    transactionCancel(gateway, np_result.np_transaction_id);
                } else {
                    result['success'] = false;
                    result['error'] = '現在お客様のお申込みにつきましてはお取扱いできません。<br />別の決済方法をご選択いただけますようお願い致します。';
                    //saveHistoryOrder(params, data, order_id, body, false);
                }
            } else {
                console.log('fail=====');
                result['success'] = false;
                result['order_status'] = null;
                result['error'] = default_error_message1;
                if (body && body.errors !== void 0 && body.errors.length) {
                    body.errors.forEach(function (error) {
                        if (error.codes !== void 0 && error.codes.length) {
                            result['error'] = '';
                            error.codes.forEach(function (code) {
                                if (payment_np_error[code] !== void 0 && payment_np_error[code]) {
                                    result['error'] += payment_np_error[code] + '<br />';
                                }
                            });
                        }
                    });
                }
            }
            return callback(result);
        });
    }else{
        return callback(result);
    }
}

//transactions/cancel
function transactionCancel(gateway, np_transaction_id){
    console.log("transactionCancel", np_transaction_id);
    var execTranUrl = NP_CANCEL_ORDER[gateway.mode];
    console.log(execTranUrl);
    var token = Buffer.from(gateway.np_merchant_code + ':' + gateway.sp_code).toString('base64');
    request({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + token,
            'X-NP-Terminal-Id': gateway.terminal_id
        },
        uri: execTranUrl,
        method: 'PATCH',
        json: {
            transactions: [
                {
                    "np_transaction_id" : np_transaction_id
                }
            ]
        }
    }, function (error, response, body) {
        console.log(error, response.statusCode, body);
    });
}

function convertJSONEncrypt(cipher, key) {
    try {
        var cipher_plain_text = JSON.stringify(cipher);
        return encrypt(key, cipher_plain_text);
    } catch (err) {
        return '';
    }
}

function saveHistoryOrder(params, data, order_id, data_response, status_code, is_need_crawl) {
    var now = new Date();
    //encrypt
    if (params.encrypt_flg != void 0 && params.encrypt_flg == 1 && params.encrypt_key != '') {
        data_response = convertJSONEncrypt(data_response, params.encrypt_key);
    }
    console.log(data);
    var efo_order_history_create = {
        connect_page_id: params.cpid,
        user_id: params.user_id,
        order_id: order_id,
        data: data_response,
        amount: data['order_sub_total'] ? data['order_sub_total'] : 0,
        price_tax: data['order_tax'] ? data['order_tax'] : 0,
        settlement_fee: data['order_settlement_fee'] ? data['order_settlement_fee'] : 0,
        shipping_fee: data['order_shipping_fee'] ? data['order_shipping_fee'] : 0,
        order_status: status_code ? PAYMENT_SUCCESS : PAYMENT_FAIL,
        payment_status : status_code ? (is_need_crawl ? '1' : '2') : "1", // payment_status is 1 : is not payment | 2 : is payment
        mode: (params.mode != 'production') ? '1' : '2',
        updated_at: now
    };
    console.log('=======efo_order_history_create', efo_order_history_create);
    if (is_need_crawl != void 0 && is_need_crawl) {
        efo_order_history_create['is_crawled'] = false;
    }

    EfoPOrderHistory.findOneAndUpdate({connect_page_id : params.connect_page_id, user_id: params.user_id, order_id: order_id}, {
        $set: efo_order_history_create,
        $setOnInsert: {created_at: now}
    }, {upsert: true, multi: false, new:true}, function(err, result) {
        if (err) {
            console.log('error===efo_order_history_create', err);
        }

        if(status_code == PAYMENT_SUCCESS){
            EfoCart.update({cid : params.connect_page_id, uid: params.user_id}, {
                $set: {
                    order_id: order_id,
                    status: status_code ? PAYMENT_SUCCESS : PAYMENT_FAIL,
                    updated_at: now
                }
            },{ upsert: false, multi: true }, function (err, result) {
            });
        }
    });
}

function getPaymentGatewayCODInfo(data, params, connect_id, callback) {
    var error_message  = "";
    if(data.np_merchant_code !== ""){
        var select_gateway = {
            np_merchant_code: data.np_merchant_code,
            sp_code: data.np_sp_code,
            terminal_id: data.np_terminal_id,
            mode: data.np_mode
        };
        console.log("select_gateway", select_gateway);
        return callback(false, error_message, select_gateway);
    }else{
        Connect.findOne({_id: connect_id}, function (err, res) {
            if (res) {
                PaymentGateway.find({
                    user_id: res.user_id,
                    provider: PAYMENT_NP_COD_TYPE
                }, function (e, data_gateways) {
                    if (data_gateways !== void 0 && data_gateways.length) {
                        var select_gateway = null;
                        // Select gateway default or first
                        data_gateways.forEach(function (gateway) {
                            if (gateway.default_flg == 1) {
                                select_gateway = gateway
                            }
                        });
                        if (select_gateway === null) {
                            select_gateway = data_gateways[0];
                        }

                        getPaymentSettingInfo(params, function (data_setting) {
                            if (data_setting.length && data_setting[0] != void 0) {
                                data_setting = data_setting[0];
                                console.log(data_setting);
                                // payment_gateway_setting
                                if (data_setting.payment_gateway_setting == TYPE_EFO_PAYMENT_METHOD_SETTING_YES) {
                                    var variable_payment_method = data_setting.variable_payment_method;
                                    var gateway_setting = data_setting.gateway_setting;

                                    if (typeof variable_payment_method !== 'undefined'
                                        && mongoose.Types.ObjectId.isValid(variable_payment_method)
                                        && typeof gateway_setting !== 'undefined') {
                                        params.variable_id = variable_payment_method;
                                        getOneVariableValue(params, function (variable_result) {
                                            var variable_value = null;
                                            if (variable_result[variable_payment_method] != void 0 && variable_result[variable_payment_method].value != void 0) {
                                                variable_value = variable_result[variable_payment_method].value;
                                            } else if (variable_result[variable_payment_method] != void 0 && variable_result[variable_payment_method] != void 0) {
                                                variable_value = variable_result[variable_payment_method];
                                            }

                                            if (variable_value) {
                                                if (gateway_setting[variable_value] !== void 0) {
                                                    data_gateways.forEach(function (gateway) {
                                                        if (gateway._id == gateway_setting[variable_value]) {
                                                            select_gateway = gateway;
                                                        }
                                                    });
                                                }
                                            }
                                            console.log('select_gateway', select_gateway);

                                            return callback(false, error_message, select_gateway);
                                        });
                                    }
                                } else {
                                    return callback(false, error_message, select_gateway);
                                }
                            } else {
                                return callback(false, error_message, select_gateway);
                            }
                        });
                    } else {
                        error_message  = "NP後払いのペイメントゲートウェイが設定されていません";
                        return callback(true, error_message);
                    }
                });
            } else {
                error_message  = "ボットが存在しません。";
                return callback(true, error_message);
            }
        });
    }

}

function getPaymentSettingInfo(params, callback) {
    var data_setting = [];
    EfoPOrderSetting.findOne({cpid: params.cpid}, function (err, res) {
        if(res){
            data_setting.push({
                'tax_type': res.tax_type,
                'rounding': res.rounding,
                'tax': res.tax,
                'settlement_fee_type': res.settlement_fee_type,
                'settlement_fee': res.settlement_fee,
                'variable_settlement': res.variable_settlement,
                'shipping_fee_type': res.shipping_fee_type,
                'shipping_fee': res.shipping_fee,
                'variable_address': res.variable_address,
                'payment_gateway_setting': res.payment_gateway_setting,
                'variable_payment_method': res.variable_payment_method,
                'gateway_setting': res.gateway_setting
            });
        }
        return callback(data_setting);
    });
}

function getOneVariableValue(params, callback){
    var variable_result = {};
    EfoMessageVariable.findOne({connect_page_id: params.connect_page_id,
        user_id:  params.user_id,
        variable_id: params.variable_id}, function(err, result) {
        if (err) throw err;
        if (result) {
            variable_result[params.variable_id] = convertVariableValue(params, result);
        }
        return callback(variable_result);
    });
}

function convertVariableValue(params, row){
    var value = row.variable_value;
    if(params && params.encrypt_flg){
        value = cryptor.decryptConvertJSON(value, params.encrypt_key);
    }
    var tmp_value_arr = [];
    var tmp_value = value;

    if(Array.isArray(value)){
        value.forEach(function (element) {
            if(element.value !== undefined){
                tmp_value_arr.push(element.value);
            }else if(element.text){
                tmp_value_arr.push(element.text);
            }
            else{
                tmp_value_arr.push(element);
            }
        });
        tmp_value = tmp_value_arr.join(",");
    }
    return tmp_value;
}

function getDataInput(list_input, body){
    var data = {};
    list_input.forEach(key => {
        data[key] = validateInput(body, key);
        //console.log(body);
    });
    return data;
}

function validateInput(body, key, value_default = "") {
    let result = value_default;
    if (typeof body[key] !== "undefined") {
        result = body[key];
    } else {
        // console.log(" Don't have data input ---> " + key);
    }
    return result;
}

// function
module.exports = router;