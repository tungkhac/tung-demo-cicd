// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by datlt on 27/05/2019.
 */
const request = require('request');
var express = require('express');
var moment = require('moment');
var validator = require('validator');
var router = express.Router();
var model = require('../model');
const Connect =  model.Connect;
const PaymentGateway =  model.PaymentGateway;
const EfoPOrderSetting =  model.EfoPOrderSetting;
const EfoMessageVariable =  model.EfoMessageVariable;
const EfoPOrderHistory =  model.EfoPOrderHistory;
const EfoCart =  model.EfoCart;
const Variable =  model.Variable;
const mongoose = require('mongoose');
const Common = require('../modules/common');
const cryptor = require('./crypto');
const config = require('config');
const TIMEZONE = config.get('timezone');

const PAYMENT_NP_COD_TYPE = "007",
    TYPE_EFO_PAYMENT_METHOD_SETTING_YES = '002',
    SEND_NP_NORMAL = '02',
    SEND_NP_WIZ = '03';
const PAYMENT_SUCCESS = '001',
    PAYMENT_FAIL = '002';

const default_np_gateway = {
    np_merchant_code: "crp0000150",
    sp_code: 'mpc8613911',
    terminal_id: '5000001600',
    mode: "test"
};

const fee_variable = ['order_settlement_fee', 'order_shipping_fee', 'order_total'];

var default_error_message = 'カードに誤りがあります。再度確認して入力して下さい。';

router.post('/payment-cod', function (req, res, next) {
    var body = req.body;
    var connect_page_id = body.cpid,
        user_id = body.uid,
        include_invoice_flg = body.include_invoice_flg,

        name = body.name,
        address = body.address,
        email = body.email,
        tel_num = body.tel_num,
        dest_name = body.dest_name,
        dest_address = body.dest_address,
        dest_tel_num = body.dest_tel_num,

        name_kana = body.name_kana,
        dest_name_kana = body.dest_name_kana;

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

    if (error_validations.length) {
        response.error_message  = error_validations;
        return res.status(400).json(response);
    }

    Common.getConnectPageInfo(connect_page_id, user_id, function (check, connect_page) {
        if(check){
            params.connect_page_id = connect_page_id;
            params.connect_id = connect_page.connect_id;
            params.encrypt_flg = connect_page.encrypt_flg;
            params.encrypt_key = connect_page.encrypt_key;
            params.connect_id = connect_page.connect_id;
            params.log_order_id = connect_page.log_order_id;
            params.user_id = user_id;
            params.include_invoice_flg = include_invoice_flg;

            //by user
            params.address = address;
            params.name = name;
            params.email = email;
            params.tel_num = tel_num;
            params.dest_name = dest_name;
            params.dest_address = dest_address;
            params.dest_tel_num = dest_tel_num;

            // is not require
            params.name_kana = name_kana;
            params.dest_name_kana = dest_name_kana;
            console.log('=====params', params);
            getPaymentGatewayCODInfo(params, function (error, gateway) {
                if(error){
                    response.error_message  = "Error occurred.";
                    return res.status(400).json(response);
                }

                params.np_merchant_code = gateway.np_merchant_code;
                params.sp_code = gateway.sp_code;
                params.terminal_id = gateway.terminal_id;
                params.mode = gateway.mode;
                var execTranUrl =(gateway.mode != 'production') ? "https://ctcp.np-payment-gateway.com/v1/transactions"
                    : "https://cp.np-payment-gateway.com/v1/transactions";

                getAmountOrderCOD(params, function (price) {
                    console.log('=======price', price);
                    execTranNpCOD(params, price, execTranUrl, function (result) {
                        if(result && result.success){
                            response.message_code = "Create request NP COD success.";
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
            Common.getCodSettingInfo(cpid, PAYMENT_NP_COD_TYPE, function(next, cod_setting){
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
            Common.getCodSettingInfo(cpid, PAYMENT_NP_COD_TYPE, function(next, cod_setting){
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

function execTranNpCOD(params, price, post_url, callback) {
    // console.log("execTranNpCOD", params, price);
    var options = [];
    var result = [];
    result['success'] = false;
    var order_id = params.log_order_id || '';
    var now = new Date();
    var request_date = moment(now).tz(TIMEZONE).format('YYYYMMDDHHmmss');
    // Last 6 character and time request date is order_id
    order_id = request_date + '-' + order_id.toString().slice(-5).toUpperCase();

    if(params.np_merchant_code != undefined && params.sp_code != undefined && params.terminal_id != undefined){
        var order_date = moment(now).tz(TIMEZONE).format('YYYY-MM-DD');

        options['orderNo'] = order_id;
        options['shop_order_date'] = order_date;

        if (price !== void 0 && price['product_name'] !== void 0) {
            if (
                price['product_unit_price'] !== void 0
                && price['order_quantity'] !== void 0
                && price['order_sub_total'] !== void 0
                && price['order_total'] !== void 0
            ) {
                var goods = [];
                var product_name = price['product_name'].value ? Common.convertKanjiJapan(price['product_name'].value): '';

                goods.push({
                    goods_name: product_name ? product_name.substr(0, 15) : '',
                    goods_price: price['product_unit_price'].value,
                    quantity: price['order_quantity'].value,
                });

                if (price['order_tax'].value !== void 0 && price['order_tax'].value > 0) {
                    goods.push({
                        goods_name: Common.convertKanjiJapan('消費税'),
                        goods_price: price['order_tax'].value,
                        quantity: 1,
                    });
                }

                if (price['order_settlement_fee'].value !== void 0 && price['order_settlement_fee'].value > 0) {
                    goods.push({
                        goods_name: Common.convertKanjiJapan('後払い手数料'),
                        goods_price: price['order_settlement_fee'].value,
                        quantity: 1,
                    });
                }

                if (price['order_shipping_fee'].value !== void 0 && price['order_shipping_fee'].value > 0) {
                    goods.push({
                        goods_name: Common.convertKanjiJapan('送料他'),
                        goods_price: price['order_shipping_fee'].value,
                        quantity: 1,
                    });
                }

                options['goods'] = goods;
                options['billed_amount'] = price['order_total'].value;
            }
        }

        convertOptionsForRequest(options, params, function (post_data) {
            if (params.np_merchant_code && params.sp_code && params.terminal_id) {
                var transactions = [];
                if (post_data !== void 0) {
                    transactions.push(post_data);
                }
                var token = Buffer.from(params.np_merchant_code + ':' + params.sp_code).toString('base64');
                request({
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Basic ' + token,
                        'X-NP-Terminal-Id': params.terminal_id,
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
                    if (response != void 0 && response.statusCode === 201 && body !== void 0) {
                        if (body.results !== void 0 && body.results.length) {
                            result['success'] = true;
                            result['body'] = body.results[0];
                            saveHistoryOrder(params, price, order_id, body, true, true);
                        } else {
                            result['success'] = false;
                            result['error'] = '現在お客様のお申込みにつきましてはお取扱いできません。<br />別の決済方法をご選択いただけますようお願い致します。';
                            saveHistoryOrder(params, price, order_id, body, false);
                        }
                    } else {
                        console.log('fail=====');
                        result['success'] = false;
                        result['order_status'] = null;
                        result['error'] = default_error_message;
                        var payment_np_error = require('../public/locales/payment_np_error.json');
                        if (body.errors !== void 0 && body.errors.length) {
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
            }
        });
    }else{
        return callback(result);
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

function saveHistoryOrder(params, price, order_id, data_response, status_code, is_need_crawl) {
    var now = new Date();
    //encrypt
    if (params.encrypt_flg != void 0 && params.encrypt_flg == 1 && params.encrypt_key != '') {
        data_response = convertJSONEncrypt(data_response, params.encrypt_key);
    }
    var efo_order_history_create = {
        connect_page_id: params.connect_page_id,
        user_id: params.user_id,
        order_id: order_id,
        data: data_response,
        amount: price['order_sub_total'] ? price['order_sub_total'].value : 0,
        price_tax: price['order_tax'] ? price['order_tax'].value : 0,
        settlement_fee: price['order_settlement_fee'] ? price['order_settlement_fee'].value : 0,
        shipping_fee: price['order_shipping_fee'] ? price['order_shipping_fee'].value : 0,
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

function convertOptionsForRequest(options, params, callback) {
    var name = params.name ? Common.convertKanjiJapan(params.name) : '';
    var name_kana = params.name_kana ? Common.convertTextKana(params.name_kana) : '';
    var dest_name = params.dest_name || '';
    var address = params.address || '';
    var dest_address = params.dest_address || '';
    var include_invoice_flg = params.include_invoice_flg || 0;
    var post_data = {};

    post_data['settlement_type'] = SEND_NP_NORMAL;
    if (include_invoice_flg == 1) {
        post_data['settlement_type'] = SEND_NP_WIZ;
    }
    post_data['shop_transaction_id'] = options['orderNo'] || '';
    post_data['shop_order_date'] = options['shop_order_date'] || '';

    // For products
    post_data['billed_amount'] = options['billed_amount'] || 0;
    post_data['goods'] = options['goods'] || [];

    // For customer
    post_data['customer'] = {
        customer_name: name ? name.substr(0, 21) : '',
        customer_name_kana: name_kana ? name_kana.substr(0, 25) : '',
        email: params['email'] || '',
        tel: params['tel_num'] || '',
    };

    Common.getAddressFromPostcode(address, function (address) {
        post_data['customer']['zip_code'] = address.zipcode;
        var address1 = address.pref + address.city2;
        post_data['customer']['address'] = address1 ? address1.substr(0,55) : '';

        if (dest_address !== '' && dest_name !== '') {
            // For dest_customer
            post_data['dest_customer'] = {
                customer_name: dest_name ? dest_name.substr(0,21) : '' ,
                customer_name_kana: params['dest_name_kana'] || '',
                tel: params['dest_tel_num'] || '',
            };

            Common.getAddressFromPostcode(dest_address, function (destination) {
                post_data['dest_customer']['zip_code'] = destination.zipcode;
                var dest_address_1 = destination.pref + destination.city2;
                post_data['dest_customer']['address'] = dest_address_1 ? dest_address_1.substr(0,55) : '';

                callback(post_data);
            });
        } else {
            // For dest_customer
            post_data['dest_customer'] = {
                customer_name: name ? name.substr(0, 21) : '',
                customer_name_kana: name_kana ? name_kana.substr(0, 25) : '',
                tel: params['tel_num'] || '',
                zip_code: address.zipcode,
                address: address1 ? address1.substr(0,55) : ''
            };

            callback(post_data);
        }
    });
}

function getPaymentGatewayCODInfo(params, callback) {
    Connect.findOne({_id: params.connect_id}, function (err, res) {
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
                    return callback(false, default_np_gateway);
                }
            });
        } else {
            return callback(true);
        }
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

// function
module.exports = router;