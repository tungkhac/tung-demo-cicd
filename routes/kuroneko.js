// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var moment = require('moment');
var router = express.Router();
var model = require('../model');
const mongoose = require('mongoose');
const Common = require('../modules/common');
var xmlParser = require('xml-js');
var validator = require('validator');
const config = require('config');
const cryptor = require('./crypto');
const TIMEZONE = config.get('timezone');

var Connect =  model.Connect;
var ConnectPage =  model.ConnectPage;
var EfoPOrderHistory =  model.EfoPOrderHistory;
var EfoPOrderSetting =  model.EfoPOrderSetting;
var PCodSetting =  model.PCodSetting;

var PaymentGateway =  model.PaymentGateway;
var EfoCart =  model.EfoCart;
var EfoCv =  model.EfoCv;
var EfoMessageVariable = model.EfoMessageVariable;
var UserCryptKey = model.UserCryptKey;
var Variable = model.Variable;

const TAX_EXCLUDED_TYPE = '002',
    ROUND_DOWN_TYPE = '001',
    ROUND_UP_TYPE = '002',
    PAYMENT_KURONEKO_COD_TYPE = '005',
    IS_A_SETTLEMENT_FEE_TYPE = '002',
    IS_A_SHIPPING_FEE_TYPE = '002',
    TYPE_EFO_PAYMENT_METHOD_SETTING_YES = '002';
const PAYMENT_SUCCESS = '001',
      PAYMENT_FAIL = '002';
const SEND_DIV_NORMAL = 0,
    SEND_DIV_FRIENDS = 1,
    SEND_DIV_INCLUDE = 2;

const COD_KURONEKO = "005";

const default_kuroneko_gateway = {
    trader_code: "888889479",
    kuroneko_access_key: "1111111",
    merchant_code: '10200318000',
    kuroneko_password: 'ysd12345',
    mode: "test"
};
const fee_variable = ['order_settlement_fee', 'order_shipping_fee', 'order_total'];

var default_error_message = 'カードに誤りがあります。再度確認して入力して下さい。';

function getOneVariableValueByName(connect_page_id, user_id, variable_name, callback){
    Variable.findOne({connect_page_id: connect_page_id, variable_name: variable_name}, function (err, result) {
        if (err) throw err;
        if(result){
            EfoMessageVariable.findOne({connect_page_id: connect_page_id, user_id: user_id, variable_id: result._id}, function(err, row) {
                if (err) throw err;
                var tmp_value = 0;
                if (row) {
                    tmp_value = convertVariableValue(null, row);
                }
                return callback(true, parseInt(tmp_value));
            });
        }else{
            return callback(true, 0);
        }
    });
}

function updateVariableValueById(connect_page_id, user_id, variable_id, variable_value, callback){
    EfoMessageVariable.update({connect_page_id: connect_page_id, user_id, variable_id: variable_id}, {$set: {variable_value: [variable_value], type: "017", updated_at : new Date()}},
        {upsert: true, multi: false}, function (err) {
            return callback(true);
        });
}

router.post('/getMaximumAmount', function (req, res, next) {
    var body = req.body;
    var cpid = body.cpid,
        uid = body.uid;
    var response = {
        cod_max_flg: 0,
        include_invoice_flg: 0
    };
    getOneVariableValueByName(cpid, uid, "order_sub_total_tax", function(next, order_total){
        console.log("order_total=", order_total);
        if(order_total > 0){
            Common.getCodSettingInfo(cpid, function(next, cod_setting) {
                if (next) {
                    var max_order_total = (typeof cod_setting.max_order_total !== 'undefined') ? parseInt(cod_setting.max_order_total) : 0;

                    console.log("max_order_total=", max_order_total);
                    response.include_invoice_flg = (typeof cod_setting.include_invoice_flg !== 'undefined') ? parseInt(cod_setting.include_invoice_flg) : 0;
                    if (order_total > max_order_total) {
                        response.cod_max_flg = 1;
                    }
                    return res.status(200).json(response);
                }else{
                    return res.status(200).json(response);
                }
            });
        }else{
            return res.status(200).json(response);
        }
    });
});


router.post('/getFee', function (req, res, next) {
    var body = req.body;
    var cpid = body.cpid,
        uid = body.uid;
    var response = {
    };
    getOneVariableValueByName(cpid, uid, "order_sub_total_tax", function(next, order_sub_total_tax){
        console.log("order_sub_total_tax=", order_sub_total_tax);
        if(order_sub_total_tax > 0){
            Common.getCodSettingInfo(cpid, COD_KURONEKO, function(next, cod_setting){
                console.log(cod_setting);
                if(next){
                    var order_settlement_fee = 0;
                    var fee_arr = (typeof cod_setting.settlement_fee !== 'undefined') ? cod_setting.settlement_fee : [];
                    var isUpdateFee = false;
                    if(fee_arr && Array.isArray(fee_arr) && fee_arr.length > 0){
                        for(var i = 0; i < fee_arr.length; i++){
                            var row = fee_arr[i];
                            var min = (typeof row.min !== 'undefined') ? parseInt(row.min) : 0;
                            var max = (typeof row.max !== 'undefined') ? parseInt(row.max) : 0;
                            var fee = (typeof row.fee !== 'undefined') ? parseInt(row.fee) : 0;
                            if(order_sub_total_tax >= min && order_sub_total_tax <= max){
                                isUpdateFee = true;
                                order_settlement_fee = fee;
                                break;
                            }
                        }
                    }
                    console.log("isUpdateFee=", isUpdateFee);
                    if(isUpdateFee){
                        var index1 = 0;
                        var fun1;
                        var params = {"connect_page_id" : cpid, "user_id" : uid};
                        var variable_arr = [];
                        getVariableValueByName2(params, index1, fee_variable, fun1 = function(next, variable_name, value, variable_id) {
                            if (next) {
                                if(variable_name){
                                    variable_arr[variable_name] = {value: value, variable_id: variable_id};
                                }
                                getVariableValueByName2(params, ++index1, fee_variable, fun1);
                            } else {
                                console.log(variable_arr);
                                var order_settlement_fee_id = (typeof variable_arr["order_settlement_fee"] !== 'undefined') ? variable_arr["order_settlement_fee"].variable_id : "";
                                var order_total_id = (typeof variable_arr["order_total"] !== 'undefined') ? variable_arr["order_total"].variable_id : "";
                                var order_shipping_fee = (typeof variable_arr["order_shipping_fee"] !== 'undefined') ? parseInt(variable_arr["order_shipping_fee"].value) : 0;
                                var order_total = order_sub_total_tax + order_shipping_fee + order_settlement_fee;
                                console.log("order_settlement_fee=", order_settlement_fee);
                                console.log("order_shipping_fee=", order_shipping_fee);
                                console.log("new order_total=", order_total);
                                updateVariableValueById(cpid, uid, order_settlement_fee_id, order_settlement_fee, function(next) {
                                    updateVariableValueById(cpid, uid, order_total_id, order_total, function(next) {
                                        return res.status(200).json(response);
                                    });
                                });
                            }
                        });
                    }else{
                        return res.status(200).json(response);
                    }
                }else{
                    return res.status(200).json(response);
                }
            });
        }else{
            return res.status(200).json(response);
        }
    });
});

router.post('/payment-cod', function (req, res, next) {
    var body = req.body;
    var connect_page_id = body.cpid,
        user_id = body.uid,
        include_invoice_flg = body.include_invoice_flg,

        name = body.name,
        address = body.address,
        email = body.email,
        tel_num = body.tel_num,
        ship_ymd = body.ship_ymd,
        send_name = body.send_name,
        send_address = body.send_address,

        name_kana = body.name_kana,
        // bill_post_code = body.bill_post_code,
        // bill_address_1 = body.bill_address_1,
        // bill_address_2 = body.bill_address_2,
        // bill_tel_num = body.bill_tel_num,
        send_tel_num = body.send_tel_num;

    var response = {};
    var params = {};

    // Validation inputs
    var error_validations = [];
    if (name === null || name === void 0 || name.length == 0) {
        error_validations.push('氏名は、必ず指定してください。');
    }
    if (address === null || address === void 0 || address.length == 0) {
        error_validations.push('住所は、必ず指定してください。');
    }
    if (email === null || email === void 0 || email.length == 0) {
        error_validations.push('メールアドレスは、必ず指定してください。');
    }
    if (tel_num === null || tel_num === void 0 || tel_num.length == 0) {
        error_validations.push('電話番号は、必ず指定してください。');
    }
    if (ship_ymd === null || ship_ymd === void 0 || ship_ymd.length == 0) {
        error_validations.push('配達希望日は、必ず指定してください。');
    }

    if ((connect_page_id && !validator.isByteLength(connect_page_id, {min: 0}))
        || (user_id && !validator.isByteLength(user_id, {min: 0}))) {
        error_validations.push('Input data is empty.');
    }
    if ((name && !validator.isByteLength(name, {min: 0, max: 60}))
        || (name && !validator.isLength(name, {min: 0, max: 30}))) {
        error_validations.push('氏名は、必ず指定してください。');
    }
    if (address && !validator.isByteLength(address, {min: 0})) {
        error_validations.push('住所は、必ず指定してください。');
    }
    if (email && !validator.isByteLength(email, {min: 0, max: 64})) {
        error_validations.push('メールアドレスは、必ず指定してください。');
    }
    if (email && !validator.isEmail(email)) {
        error_validations.push('メールアドレスは、有効なメールアドレス形式で指定してください。');
    }
    if (tel_num && !validator.isByteLength(tel_num, {min: 0})) {
        error_validations.push('電話番号は、必ず指定してください。');
    }
    if (ship_ymd && !validator.isByteLength(ship_ymd, {min: 0})) {
        error_validations.push('配達希望日は、必ず指定してください。');
    }

    if (error_validations.length) {
        response.error_message  = error_validations;
        return res.status(400).json(response);
    }

    getConnectPageInfo(connect_page_id, user_id, function (check, connect_page) {
        if(check){
            params.connect_page_id = connect_page_id;
            params.connect_id = connect_page.connect_id;
            params.encrypt_flg = connect_page.encrypt_flg;
            params.encrypt_key = connect_page.encrypt_key;
            params.connect_id = connect_page.connect_id;
            params.log_order_id = connect_page.log_order_id;
            params.device = connect_page.device;
            params.user_id = user_id;
            params.include_invoice_flg = include_invoice_flg;

            //by user
            params.address = address;
            params.name = name;
            params.email = email;
            params.tel_num = tel_num;
            params.ship_ymd = ship_ymd;
            params.send_name = send_name;
            params.send_address = send_address;

            // is not require
            params.name_kana = name_kana;
            // params.bill_post_code = bill_post_code;
            // params.bill_address_1 = bill_address_1;
            // params.bill_address_2 = bill_address_2;
            // params.bill_tel_num = bill_tel_num;
            params.send_tel_num = send_tel_num;
console.log('=====params', params);
            getPaymentGatewayCODInfo(params, function (error, gateway) {
                if(error){
                    response.error_message  = "Error occurred.";
                    return res.status(400).json(response);
                }

                params.merchant_code = gateway.merchant_code;
                params.kuroneko_password = gateway.kuroneko_password;
                params.mode = gateway.mode;
                var execTranUrl =(gateway.mode != 'production') ? "https://demo.yamato-credit-finance.jp/kuroneko-atobarai-api/KAARA0010APIAction_execute.action" : "https://yamato-credit-finance.jp/kuroneko-atobarai-api/KAARA0010APIAction_execute.action";

                getAmountOrderCOD(params, function (price) {
                    console.log('=======price', price);
                    execTranKuronekoCOD(params, price, execTranUrl, function (result) {
                        if(result && result.success){
                            response.message_code = "Create request kuroneko COD success.";
                            res.status(200).json(response);
                        }else{
                            if(result.error){
                                response.error_message = result.error;
                            }else{
                                response.error_message = default_error_message;
                            }
                            console.log('response', response);
                            return res.status(400).json(response);
                        }
                    });
                });
            });
        }else{
            response.error_message  = "Error occurred.";
            return res.status(400).json(response);
        }
    });
});

function getAmountOrderCOD(params, callback) {
    var variable_arr = [];
    const check_update_variable = ['product_name', 'product_unit_price', 'order_quantity', 'order_sub_total', 'order_settlement_fee', 'order_shipping_fee', 'order_tax', 'order_total'];
    var index1 = 0;
    var fun1;
    getVariableValueByName2(params, index1, check_update_variable, fun1 = function(next, variable_name, value, variable_id) {
        if (next) {
            if(variable_name){
                if(variable_name == "product_unit_price" && parseInt(value) == 0){
                    return callback([]);
                }

                variable_arr[variable_name] = {value: value, variable_id: variable_id};
            }
            getVariableValueByName2(params, ++index1, check_update_variable, fun1);
        } else {
            // Call api
            callback(variable_arr)
        }
    });
}

function getVariableValueByName2(params, index, arr, callback){
    if(arr[index]){
        var variable_name = arr[index];
        Variable.findOne({connect_page_id: params.connect_page_id, variable_name: variable_name}, function (err, result) {
            if (err) throw err;
            if(result){
                EfoMessageVariable.findOne({connect_page_id: params.connect_page_id, user_id:  params.user_id, variable_id: result._id}, function(err, row) {
                    if (err) throw err;
                    var tmp_value = 0;
                    if (row) {
                        tmp_value = convertVariableValue(params, row);
                    }
                    return callback(true, variable_name, tmp_value, result._id);
                });
            }else{
                return callback(true);
            }
        });
    }else{
        return callback(false);
    }
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

router.post('/payment-status', function (req, res, next) {
    var body = req.body;
    var connect_page_id = body.connect_page_id,
        user_id = body.user_id,
        order_no = body.order_no;

    var response = {};
    var params = {};

    if(
        connect_page_id != ''
        && user_id != ''
        && order_no != ''
    ) {
        getConnectPageInfo(connect_page_id, user_id, function (check, connect_page) {
            if (check) {
                params.connect_page_id = connect_page_id;
                params.user_id = user_id;
                params.order_no = order_no;
                params.connect_id = connect_page.connect_id;
                getPaymentGatewayCODInfo(params, function (error, gateway) {
                    if (error) {
                        response.error_message = "Error occurred.";
                        return res.status(400).json(response);
                    }

                    params.merchant_code = gateway.merchant_code;
                    params.kuroneko_password = gateway.kuroneko_password;
                    params.mode = gateway.mode;
                    var execTranUrl = (gateway.mode != 'production') ? "https://demo.yamato-credit-finance.jp/kuroneko-atobarai-api/KAAST0010APIAction_execute.action" : "https://yamato-credit-finance.jp/kuroneko-atobarai-api/KAAST0010APIAction_execute.action";
                    execGetOrderStatusKuronekoCOD(params, execTranUrl, function (result) {
                        console.log('===================', result);

                        if (result && result.success) {
                            response = result;
                            res.status(200).json(result);
                        } else {
                            response = result;
                            if (result.error) {
                                response.error_message = result.error;
                            } else {
                                response.error_message = default_error_message;
                            }
                            return res.status(400).json(response);
                        }
                    });
                });

            } else{
                response.error_message  = "Error occurred.";
                return res.status(400).json(response);
            }
        });
    } else {
        response.error_message  = "Input data is empty.";
        return res.status(400).json(response);
    }
});

router.post('/payment', function(req, res, next){
    var body = req.body;
    var connect_page_id = body.connect_page_id,
        user_id = body.user_id,
        user_name = body.user_name,
        user_tel = body.user_tel,
        user_email = body.user_email,
        payment_token = body.payment_token;

    var response = {};
    var params = {};

    if(connect_page_id != '' && user_id != '' && user_name != '' && user_tel != '' && user_email != '' && payment_token != ''){
        getConnectPageInfo(connect_page_id, user_id, function (check, connect_page) {
            if(check){
                params.connect_page_id = connect_page_id;
                params.encrypt_flg = connect_page.encrypt_flg;
                params.encrypt_key = connect_page.encrypt_key;
                params.connect_id = connect_page.connect_id;
                params.log_order_id = connect_page.log_order_id;
                params.device = connect_page.device;
                //by user
                params.user_id = user_id;
                params.user_name = user_name;
                params.user_tel = user_tel;
                params.user_email = user_email;
                params.payment_token = payment_token;

                getPaymentGatewayInfo(params, function (error, gateway) {
                    if(error){
                        response.error_message  = "Error occurred.";
                        return res.status(400).json(response);
                    }
                    params.trader_code = gateway.trader_code;
                    params.mode = gateway.mode;
                    var execTranUrl =(gateway.mode != 'production') ? "https://ptwebcollect.jp/test_gateway/creditToken.api" : "https://api.kuronekoyamato.co.jp/api/creditToken";
                    getAmount(params, function (price) {
                        execTranKuroneko(params, price, execTranUrl, function (result) {
                            if(result && result.success){
                                response.message_code = "Payment success";
                                res.status(200).json(response);
                            }else{
                                if(result.error){
                                    response.error_message = result.error;
                                }else{
                                    response.error_message = default_error_message;
                                }
                                console.log('response', response);
                                return res.status(400).json(response);
                            }
                        });
                    });
                });
            }else{
                response.error_message  = "Error occurred.";
                return res.status(400).json(response);
            }
        });

    }else{
        response.error_message  = "Input data is empty.";
        return res.status(400).json(response);
    }
});

function getAmount(params, callback){
    var credit_card_payment_type = false;
    EfoCart.find({cid: params.connect_page_id, uid: params.user_id}, function(err, result) {
        if (err) throw err;
        var amount = 0,
            consumption_tax = 0,
            settlement_fee = 0,
            shipping_fee = 0;
        var variable_value = '';
        var price = {
            amount : amount,
            consumption_tax : consumption_tax,
            settlement_fee : settlement_fee,
            shipping_fee : shipping_fee,
            data: []
        };

        if(result && result.length > 0){
            result.forEach(function (row) {
                var data = row.data;
                //decrypt
                if (params.encrypt_flg != void 0 && params.encrypt_flg == 1 && params.encrypt_key != '') {
                    data = decryptConvertJSON(data, params.encrypt_key);
                }
                if(row.type == "003"){
                    credit_card_payment_type = true;
                    if(data && data.length > 0){
                        price['data'] = data;
                        for(var i = 0; i < data.length; i++){
                            var row1 = data[i];
                            if(row1.amount && row1.unit_price){
                                amount += parseInt(row1.amount) * parseInt(row1.unit_price);
                            }
                        }
                    }
                }else{
                    if(data.amount && data.unit_price){
                        amount += parseInt(data.amount) * parseInt(data.unit_price);
                    }
                }

            });
            if(credit_card_payment_type){
                getPaymentSettingInfo(params, function (data_setting) {
                    if(data_setting.length && data_setting[0] != void 0){
                        data_setting = data_setting[0];
                        getVariableValue(params, function (variable_result) {
                            //settlement fee
                            if(data_setting.settlement_fee_type == IS_A_SETTLEMENT_FEE_TYPE){
                                var settlement_fee_list = data_setting.settlement_fee,
                                    variable_settlement = data_setting.variable_settlement;
                                if(typeof settlement_fee_list !== 'undefined' && typeof variable_settlement !== 'undefined'){
                                    if(variable_result[variable_settlement] != void 0 && variable_result[variable_settlement][0].value != void 0){
                                        variable_value = variable_result[variable_settlement][0].value;
                                        settlement_fee = (settlement_fee_list[variable_value] != void 0) ? settlement_fee_list[variable_value] : 0;
                                    }
                                }
                            }
                            //shipping fee
                            if(data_setting.shipping_fee_type == IS_A_SHIPPING_FEE_TYPE){
                                var shipping_fee_list = data_setting.shipping_fee,
                                    variable_address = data_setting.variable_address;
                                if(typeof shipping_fee_list !== 'undefined' && typeof variable_address !== 'undefined'){
                                    if(variable_result[variable_address] != void 0){
                                        variable_value = variable_result[variable_address][0];
                                        shipping_fee = (shipping_fee_list[variable_value] != void 0) ? shipping_fee_list[variable_value] : 0;
                                    }
                                }
                            }
                            //tax
                            if(data_setting.tax_type == TAX_EXCLUDED_TYPE){
                                consumption_tax = amount * (parseInt(data_setting.tax) / 100);
                                // amount = amount + price['consumption_tax'];
                            }
                            if(data_setting.rounding == ROUND_DOWN_TYPE){
                                // amount = Math.floor(amount);
                                price['consumption_tax'] = Math.floor(amount + consumption_tax) - amount;
                            }else if(data_setting.rounding == ROUND_UP_TYPE){
                                // amount = Math.ceil(amount);
                                price['consumption_tax'] = Math.ceil(amount + consumption_tax) - amount;
                            }

                            price['amount'] = amount;
                            price['settlement_fee'] = settlement_fee;
                            price['shipping_fee'] = shipping_fee;

                            return callback(price);
                        });
                    }else{
                        price['amount'] = amount;
                        return callback(price);
                    }
                });
            }else {
                price['amount'] = amount;
                return callback(price);
            }
        }else{
            return callback(price);
        }
        // return callback(amount);
    });
}

function getPaymentSettingInfo(params, callback) {
    var data_setting = [];
    EfoPOrderSetting.findOne({cpid: params.connect_page_id}, function (err, res) {
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
                'gateway_setting': res.gateway_setting,
            });
        }
        return callback(data_setting);
    });
}

function getConnectPageInfo(connect_page_id, user_id, callback){
    findCryptKeyOfUser(connect_page_id, user_id, function (result_check, encrypt_key) {
        console.log('getConnectPageInfo');
        var data = {};
        ConnectPage.findOne({_id: connect_page_id, deleted_at: null}, function (err, result) {
            if (!err && result) {
                EfoCv.findOne({connect_page_id: connect_page_id, user_id: user_id}, function(errCv, resultPosition) {
                    if (!errCv){
                        if(resultPosition){
                            data.log_order_id = resultPosition._id;
                            data.device = resultPosition.device;
                        }
                        data.connect_id = result.connect_id;
                        data.encrypt_flg = result.encrypt_flg;
                        data.encrypt_key = encrypt_key;
                        return callback(true, data);
                    }
                });
            }else{
                return callback(false);
            }
        });
    });
}

function getPaymentGatewayInfo(params, callback) {
    Connect.findOne({_id: params.connect_id}, function (err, res) {
        if(res){
            PaymentGateway.findOne({user_id: res.user_id, default_flg: 1}, function (e, data_gateway) {
                if(data_gateway){
                    return callback(false, data_gateway);
                }else{
                    return callback(false, default_kuroneko_gateway);
                }
            });
        }else{
            return callback(true);
        }
    });
}

function getPaymentGatewayCODInfo(params, callback) {
    Connect.findOne({_id: params.connect_id}, function (err, res) {
        if (res) {
            PaymentGateway.find({
                user_id: res.user_id,
                provider: PAYMENT_KURONEKO_COD_TYPE
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

                                        return callback(false, select_gateway);
                                    });
                                }
                            } else {
                                return callback(false, select_gateway);
                            }
                        } else {
                            return callback(false, select_gateway);
                        }
                    });
                } else {
                    return callback(false, default_kuroneko_gateway);
                }
            });
        } else {
            return callback(true);
        }
    });
}

function decryptConvertJSON(ciphertext, key) {
    try {
        var decrypted = decrypt(key, ciphertext);
        return JSON.parse(decrypted);
    } catch (err) {
        return {};
    }
}

function convertJSONEncrypt(cipher, key) {
    try {
        var cipher_plain_text = JSON.stringify(cipher);
        return encrypt(key, cipher_plain_text);
    } catch (err) {
        return '';
    }
}

function execGetOrderStatusKuronekoCOD(params, post_url, callback) {
    var options = [];
    var result = {};
    result['success'] = false;
    if(params.merchant_code != undefined){
        var now = new Date();
        var request_date = moment(now).tz(TIMEZONE).format('YYYYMMDDHHmmss');
        options['ycfStrCode'] = params.merchant_code;
        options['password'] = params.kuroneko_password;
        options['orderNo'] = params.order_no;
        options['requestDate'] = request_date;

        request({
            uri: post_url,
            method: 'POST',
            form: options
        }, function (error, response, body) {
            body = xmlParser.xml2js(body, {compact: true, spaces: 4});

            console.log('==========body', body);

            var response = body.return;

            if(response != void 0 && response.returnCode != void 0){
                var returnCode = response.returnCode._text,
                    errorCode = response.errorCode;

                if(returnCode == 1 && errorCode != undefined && errorCode._text != 'Z012000004'){
                    console.log('fail=====');
                    var payment_kuroneko_error = require('../public/locales/payment_kuroneko_error.json');

                    result['success'] = false;
                    result['order_status'] = null;
                    result['error'] = (payment_kuroneko_error[errorCode._text]) ? payment_kuroneko_error[errorCode._text] : default_error_message;
                }else{
                    console.log('success=====');
                    result['order_status'] = response.result._text;
                    result['success'] = true;
                }
            }else{
                return callback(result);
            }

            return callback(result);
        });
    }else {
        return callback(result);
    }
}

function execTranKuronekoCOD(params, price, post_url, callback) {
    // console.log("execTranKuronekoCOD", params, price);
    var options = [];
    var result = [];
    result['success'] = false;
    var order_id = params.log_order_id || '';
    var now = new Date();
    var request_date = moment(now).tz(TIMEZONE).format('YYYYMMDDHHmmss');
    // Last 6 character and time request date is order_id
    order_id = request_date + '-' + order_id.toString().slice(-5).toUpperCase();

    var device_code = (params.device != 'pc') ? 1 : 2;
    if(params.merchant_code != undefined){
        var order_date = moment(now).tz(TIMEZONE).format('YYYYMMDD');

        options['ycfStrCode'] = params.merchant_code;
        options['password'] = params.kuroneko_password;
        options['fraudbuster'] = device_code;
        options['orderNo'] = order_id;
        options['orderYmd'] = order_date;
        options['requestDate'] = request_date;

        options['email'] = params.email;
        var name = params.name ? Common.convertKanjiJapan(params.name) : '';
        options['name'] = name ? name.substr(0, 30) : '';
        options['telNum'] = params.tel_num;
        options['shipYmd'] = params.ship_ymd ? moment(params.ship_ymd, 'YYYY-MM-DD').format('YYYYMMDD') : '';
        options['nameKana'] = params.name_kana ? Common.convertTextKana(params.name_kana) : '';
        // options['billPostCode'] = params.bill_post_code || '';
        // options['billAddress1'] = params.bill_address_1 ? Common.convertKanjiJapan(params.bill_address_1) : '';
        // options['billAddress2'] = params.bill_address_2 ? Common.convertKanjiJapan(params.bill_address_2) : '';
        // options['billTelNum'] = params.bill_tel_num || '';

        if (price !== void 0 && price['product_name'] !== void 0) {
            if (
                price['product_unit_price'] !== void 0
                && price['order_quantity'] !== void 0
                && price['order_sub_total'] !== void 0
                && price['order_total'] !== void 0
            ) {
                var index = 1; // Only 1 product in order
                var product_name = price['product_name'].value ? Common.convertKanjiJapan(price['product_name'].value): '';
                options['itemName' + index] = product_name ? product_name.substr(0, 30) : '';
                options['itemCount' + index] = price['order_quantity'].value;
                options['unitPrice' + index] = price['product_unit_price'].value;
                options['subTotal' + index] = price['order_sub_total'].value;

                if (price['order_tax'].value !== void 0 && price['order_tax'].value > 0) {
                    index += 1;
                    options['itemName' + index] = Common.convertKanjiJapan('消費税');
                    options['itemCount' + index] = 1;
                    options['unitPrice' + index] = price['order_tax'].value;
                    options['subTotal' + index] = price['order_tax'].value;
                }

                if (price['order_settlement_fee'].value !== void 0 && price['order_settlement_fee'].value > 0) {
                    index += 1;
                    options['itemName' + index] = Common.convertKanjiJapan('後払い手数料');
                    options['itemCount' + index] = 1;
                    options['unitPrice' + index] = price['order_settlement_fee'].value;
                    options['subTotal' + index] = price['order_settlement_fee'].value;
                }

                if (price['order_shipping_fee'].value !== void 0 && price['order_shipping_fee'].value > 0) {
                    index += 1;
                    options['itemName' + index] = Common.convertKanjiJapan('送料他');
                    options['itemCount' + index] = 1;
                    options['unitPrice' + index] = price['order_shipping_fee'].value;
                    options['subTotal' + index] = price['order_shipping_fee'].value;
                }

                options['totalAmount'] = price['order_total'].value;
            }
        }

        convertOptionsForRequest(options, params, function (post_data) {
            console.log('==============post_data', post_data);
            request({
                uri: post_url,
                method: 'POST',
                form: post_data
            }, function (error, response, body) {
                body = xmlParser.xml2js(body, {compact: true, spaces: 4});
                var response = body.return;

                if(response != void 0 && response.returnCode != void 0){
                    var returnCode = response.returnCode._text,
                        resultCode = response.result,
                        errorCode = response.errorCode;

                    console.log('returnCode', returnCode, errorCode, response);
                    if (resultCode != void 0 && resultCode._text === '0' ) {
                        console.log('success=====');
                        result['success'] = true;
                        saveHistoryOrder(params, price, order_id, response, true, true);
                    } else {
                        console.log('fail=====');
                        result['success'] = false;
                        if(returnCode == 1 && errorCode != undefined && errorCode._text != 'Z012000004'){
                            var payment_kuroneko_error = require('../public/locales/payment_kuroneko_error.json');
                            result['error'] = (payment_kuroneko_error[errorCode._text]) ? payment_kuroneko_error[errorCode._text] : default_error_message;
                        } else {
                            result['error'] = '現在お客様のお申込みにつきましてはお取扱いできません。<br />別の決済方法をご選択いただけますようお願い致します。';
                        }

                        saveHistoryOrder(params, price, order_id, response, false);
                    }
                }else{
                    return callback(result);
                }

                return callback(result);
            });
        });
    }else{
        return callback(result);
    }
}

function convertOptionsForRequest(options, params, callback) {
    var name = params.name || '';
    var send_name = params.send_name || '';
    var address = params.address || '';
    var send_address = params.send_address || '';
    var include_invoice_flg = params.include_invoice_flg || 0;
    options['sendDiv'] = SEND_DIV_NORMAL;
    if (include_invoice_flg == 1) {
        options['sendDiv'] = SEND_DIV_INCLUDE;
    }

    if ((send_name !== '' && name !== '' && send_name !== name)
        || (send_address !== '' && address !== '' && send_address !== address)) {
        options['sendDiv'] = SEND_DIV_FRIENDS;
    }

    Common.getAddressFromPostcode(address, function (address) {
        options['postCode'] = address.zipcode;
        options['address1'] = address.pref + address.city2;
        var address2 = address.other_address ? Common.convertKanjiJapan(address.other_address) : '';
        options['address2'] = address2 ? address2.substr(0,25) : '';

        if (send_address !== '') {
            options['sendName'] = send_name ? send_name.substr(0,30) : '';
            var send_tel_num = params.send_tel_num || '';
            options['sendTelNum'] = send_tel_num;
            Common.getAddressFromPostcode(send_address, function (send_address) {
                options['sendPostCode'] = send_address.zipcode;
                options['sendAddress1'] = send_address.pref + send_address.city2;
                var sendAddress2 = send_address.other_address ? Common.convertKanjiJapan(send_address.other_address) : '';
                options['sendAddress2'] = sendAddress2 ? sendAddress2.substr(0,25) : '';

                callback(options);
            });
        } else {
            callback(options);
        }
    });
}

function execTranKuroneko(params, price, post_url, callback) {
    // console.log("execTranKuroneko", params, price);
    var options = [];
    var result = [];
    result['success'] = false;
    //
    var min = 100;
    var max = 999;
    var a = Math.floor( Math.random() * (max + 1 - min) ) + min ;
    var order_id = params.log_order_id + a;
    order_id = order_id.slice(0, 20).toUpperCase();

    var device_code = (params.device != 'pc') ? 1 : 2;
    if(params.payment_token != undefined){
        options['function_div'] = 'A08';
        options['trader_code'] = params.trader_code;
        options['device_div'] = device_code;
        options['order_no'] = order_id;
        options['settle_price'] = price.amount + price.consumption_tax + price.settlement_fee + price.shipping_fee;
        options['buyer_name_kanji'] = params.user_name;
        options['buyer_tel'] = params.user_tel;
        options['buyer_email'] = params.user_email;
        options['pay_way'] = 1;
        options['token'] = params.payment_token;

        request({
            uri: post_url,
            method: 'POST',
            form: options
        }, function (error, response, body) {
            body = xmlParser.xml2js(body, {compact: true, spaces: 4});
            var response = body.return;

            if(response != void 0 && response.returnCode != void 0){
                var returnCode = response.returnCode._text,
                    errorCode = response.errorCode;

                if(returnCode == 1 && errorCode != undefined && errorCode._text != 'Z012000004'){
                    console.log('fail=====');
                    var payment_kuroneko_error = require('../public/locales/payment_kuroneko_error.json');

                    result['success'] = false;
                    result['error'] = (payment_kuroneko_error[errorCode._text]) ? payment_kuroneko_error[errorCode._text] : default_error_message;
                    saveHistoryOrder(params, price, order_id, response, false);
                }else{
                    console.log('success=====');
                    result['success'] = true;
                    saveHistoryOrder(params, price, order_id, response, true);
                }
            }else{
                return callback(result);
            }

            return callback(result);
        });
    }else{
        return callback(result);
    }
}

function saveHistoryOrder(params, price, order_id, data_response, status_code, is_need_crawl) {
    console.log("saveHistoryOrder");
    var now = new Date();
    //encrypt
    if (params.encrypt_flg != void 0 && params.encrypt_flg == 1 && params.encrypt_key != '') {
        data_response = convertJSONEncrypt(data_response, params.encrypt_key);
    }
    var efo_order_history_create = {
        p_order_id: order_id,
        amount: price.amount,
        price_tax: price.consumption_tax,
        settlement_fee: price.settlement_fee,
        shipping_fee: price.shipping_fee,
        order_status: status_code ? PAYMENT_SUCCESS : PAYMENT_FAIL,
        payment_status : status_code ? (is_need_crawl ? '1' : '2') : "1", // payment_status is 1 : is not payment | 2 : is payment
        data: data_response,
        mode: (params.mode != 'production') ? '1' : '2',
        updated_at: now
    };
    if (is_need_crawl != void 0 && is_need_crawl) {
        efo_order_history_create['is_crawled'] = false;
    }

    EfoPOrderHistory.findOneAndUpdate({connect_page_id : params.connect_page_id, user_id: params.user_id, order_id: order_id}, {
        $set: efo_order_history_create,
        $setOnInsert: {created_at: now}
    }, {upsert: true, multi: false }, function(err, result) {
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

function getVariableValue(params, callback){
    var variable_result = [];
    EfoMessageVariable.find({connect_page_id: params.connect_page_id, user_id:  params.user_id}, function(err, result) {
        if (err) throw err;
        if (result && result.length > 0) {
            for (var i=0, size = result.length; i < size; i++) {
                var row = result[i];
                var value = row.variable_value;
                if(params.encrypt_flg){
                    value = decryptConvertJSON(value, params.encrypt_key);
                }
                if(value instanceof Array){
                    value = arrayUnique(value);
                }
                variable_result[row.variable_id] =  value;
            }
        }
        return callback(variable_result);
    });
}

function getOneVariableValue(params, callback){
    var variable_result = {};
    EfoMessageVariable.findOne({connect_page_id: params.connect_page_id, user_id:  params.user_id, variable_id: params.variable_id}, function(err, result) {
        if (err) throw err;
        if (result) {
            variable_result[params.variable_id] = convertVariableValue(params, result);
        }
        return callback(variable_result);
    });
}

function arrayUnique(arr){
    if(arr.length > 0) {
        arr = arr.filter(function (x, i, self) {
            return self.indexOf(x) === i;
        });
    }
    return arr;
}

function findCryptKeyOfUser(connect_page_id, user_id, callback) {
    var encrypt_key = '';

    if(connect_page_id != void 0 && user_id != void 0) {
        UserCryptKey.findOne({connect_page_id: connect_page_id, user_id: user_id}, function (err, result) {
            if (err) throw err;
            if(result && result.salt != void 0){
                encrypt_key = result.salt;
                return callback(true, encrypt_key);
            } else {
                return callback(true, encrypt_key);
            }
        })
    }else{
        return callback(true, encrypt_key);
    }
}
// function
module.exports = router;
