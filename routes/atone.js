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
var PaymentGateway =  model.PaymentGateway;
var EfoCart =  model.EfoCart;
var EfoCv =  model.EfoCv;
var EfoMessageVariable = model.EfoMessageVariable;
var UserCryptKey = model.UserCryptKey;
var Variable = model.Variable;

const TAX_EXCLUDED_TYPE = '002',
    ROUND_DOWN_TYPE = '001',
    ROUND_UP_TYPE = '002',
    PAYMENT_ATONE_TYPE = '008',
    IS_A_SETTLEMENT_FEE_TYPE = '002',
    IS_A_SHIPPING_FEE_TYPE = '002',
    TYPE_EFO_PAYMENT_METHOD_SETTING_YES = '002';
const PAYMENT_SUCCESS = '001',
      PAYMENT_FAIL = '002';
const SEND_DIV_NORMAL = 0,
    SEND_DIV_FRIENDS = 1;

const default_atone_gateway = {
    mode : "test",
    merchant_code: "ctn00103",
    user_shop_code: "owner00103",
    atone_pub_key: 'DLLRutluP9STTrVCIS46NA',
    atone_secret_key: 'NOj9Qd95WJcZFvtw5W3Uiw'
};

var default_error_message = 'カードに誤りがあります。再度確認して入力して下さい。';

router.post('/payment-create', function (req, res, next) {
    var body = req.body;

    var connect_page_id = body.cpid,
        user_id = body.uid,

        customer_name = body.name || '',
        address = body.address || '',
        email = body.email || '',
        tel_num = body.tel_num || '',
        dest_name = body.dest_name || '',
        dest_address = body.dest_address || '',
        dest_tel_num = body.dest_tel || '';

    var name_kana = body.name_kana || '';
    var dest_name_kana = body.dest_name_kana || '';

    var response = {};
    var params = {};

    // Validation inputs
    // var error_validations = [];
    // if (name === null || name === void 0 || name.length == 0) {
    //     error_validations.push('氏名は、必ず指定してください。');
    // }
    // if (address === null || address === void 0 || address.length == 0) {
    //     error_validations.push('住所は、必ず指定してください。');
    // }
    // if (email === null || email === void 0 || email.length == 0) {
    //     error_validations.push('メールアドレスは、必ず指定してください。');
    // }
    // if (tel_num === null || tel_num === void 0 || tel_num.length == 0) {
    //     error_validations.push('電話番号は、必ず指定してください。');
    // }
    // if (ship_ymd === null || ship_ymd === void 0 || ship_ymd.length == 0) {
    //     error_validations.push('出荷予定日は、必ず指定してください。');
    // }
    // if (send_div === null || send_div === void 0 || send_div.length == 0) {
    //     error_validations.push('送り先区分は、必ず指定してください。');
    // }
    //
    // if ((connect_page_id && !validator.isByteLength(connect_page_id, {min: 0}))
    //     || (user_id && !validator.isByteLength(user_id, {min: 0}))) {
    //     error_validations.push('Input data is empty.');
    // }
    // if ((name && !validator.isByteLength(name, {min: 0, max: 60}))
    //     || (name && !validator.isLength(name, {min: 0, max: 30}))) {
    //     error_validations.push('氏名は、必ず指定してください。');
    // }
    // if (address && !validator.isByteLength(address, {min: 0})) {
    //     error_validations.push('住所は、必ず指定してください。');
    // }
    // if (email && !validator.isByteLength(email, {min: 0, max: 64})) {
    //     error_validations.push('メールアドレスは、必ず指定してください。');
    // }
    // if (email && !validator.isEmail(email)) {
    //     error_validations.push('メールアドレスは、有効なメールアドレス形式で指定してください。');
    // }
    // if (tel_num && !validator.isByteLength(tel_num, {min: 0})) {
    //     error_validations.push('電話番号は、必ず指定してください。');
    // }
    // if (ship_ymd && !validator.isByteLength(ship_ymd, {min: 0})) {
    //     error_validations.push('出荷予定日は、必ず指定してください。');
    // }
    // if (send_div && !validator.isByteLength(send_div, {min: 0})) {
    //     error_validations.push('送り先区分は、必ず指定してください。');
    // }
    //
    // if (error_validations.length) {
    //     response.error_message  = error_validations;
    //     return res.status(400).json(response);
    // }

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

            //by user
            params.address = address;
            params.customer_name = customer_name;
            params.name_kana = name_kana;
            params.email = email;
            params.tel_num = tel_num || '';

            // by dest_user
            params.dest_name = dest_name;
            params.dest_address = dest_address;
            params.dest_name_kana = dest_name_kana;
            params.dest_tel_num = dest_tel_num || '';

            getPaymentGatewayCODInfo(params, function (error, gateway) {
                if(error){
                    response.error_message  = "Error occurred.";
                    return res.status(400).json(response);
                }

                params.merchant_code = gateway.merchant_code;
                params.user_shop_code = gateway.user_shop_code;
                params.atone_pub_key = gateway.atone_pub_key;
                params.atone_secret_key = gateway.atone_secret_key;
                params.mode = gateway.mode;
                getVariablesOrderCOD(params, function (price) {
                    console.log('=====inputexecTranAtone', params, price);
                    execTranAtone(params, price, function (result) {
                        if(result && result.success){
                            response = {
                                atone_np_data: result['np_data'],
                                atone_pub_key: result['atone_pub_key'],
                                success: result.success
                            };
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

function getVariablesOrderCOD(params, callback) {
    var variable_arr = [];
    const check_update_variable = ['product_name', 'transaction_options','product_unit_price', 'order_quantity', 'order_sub_total', 'order_settlement_fee', 'order_shipping_fee', 'order_tax', 'order_total'];
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
    if(params.encrypt_flg){
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
                    return callback(false, default_atone_gateway);
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
                provider: PAYMENT_ATONE_TYPE
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
                    return callback(false, default_atone_gateway);
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

function execTranAtone(params, price, callback) {
    var options = {};
    var result = {};
    result['success'] = false;
    var order_id = params.log_order_id || '';
    var now = new Date();
    var request_date = moment(now).tz(TIMEZONE).format('YYYYMMDDHHmmss');
    // Last 6 character and time request date is order_id
    order_id = request_date + '-' + order_id.toString().slice(-5).toUpperCase();

    if (params.atone_pub_key != void 0) {
        options['amount'] = 0; // 課⾦額
        options['sales_settled'] = false; // 売上確定
        options['livemode'] = (params.mode === 'production' ? true : false); // 売上確定

        // For items
        var items = [];
        var index = 1;
        var order_total = 0;
        if (price !== void 0 && price['product_name'] !== void 0) {
            if (
                price['product_unit_price'] !== void 0
                && price['order_quantity'] !== void 0
                && price['order_sub_total'] !== void 0
            ) {
                var item = Common.sortObjectByKey({
                    shop_item_id: index,
                    item_name: price['product_name'].value ? price['product_name'].value: '',
                    item_price: price['product_unit_price'].value || '',
                    item_count: price['order_quantity'].value || '',
                    item_url: ''
                });
                items.push(item);
                order_total += parseInt(price['order_sub_total'].value);
            }
        }

        if (price !== void 0 && price['order_tax'] !== void 0
            && price['order_tax'].value !== void 0 && price['order_tax'].value > 0) {
            index += 1;
            var item = Common.sortObjectByKey({
                shop_item_id: index,
                item_name: '消費税',
                item_price: price['order_tax'].value ? price['order_tax'].value: 0,
                item_count: 1,
                item_url: ''
            });
            items.push(item);
            order_total += parseInt(price['order_tax'].value);
        }

        if (price !== void 0 && price['order_settlement_fee'] !== void 0
            && price['order_settlement_fee'].value !== void 0 && price['order_settlement_fee'].value > 0) {
            index += 1;
            var item = Common.sortObjectByKey({
                shop_item_id: index,
                item_name: '後払い手数料',
                item_price: price['order_settlement_fee'].value ? price['order_settlement_fee'].value: 0,
                item_count: 1,
                item_url: ''
            });
            items.push(item);
            order_total += parseInt(price['order_settlement_fee'].value);
        }

        if (price !== void 0 && price['order_shipping_fee'] !== void 0
            && price['order_shipping_fee'].value !== void 0 && price['order_shipping_fee'].value > 0) {
            index += 1;
            var item = Common.sortObjectByKey({
                shop_item_id: index,
                item_name: '送料他',
                item_price: price['order_shipping_fee'].value ? price['order_shipping_fee'].value: 0,
                item_count: 1,
                item_url: ''
            });
            items.push(item);
            order_total += parseInt(price['order_shipping_fee'].value);
        }
        options['items'] = items;
        options['amount'] = order_total;

        if (params.address) {
            Common.getAddressFromPostcode(params.address, function (address) {
                var customer = {
                    email: params.email || '',
                    customer_name: params.customer_name ? params.customer_name : '',
                    customer_name_kana: params.name_kana ? params.name_kana : '',
                    tel: params.tel_num || '',
                    address: '',
                    zip_code: ''
                };
                customer['zip_code'] = address.zipcode;
                var address1 = address.pref + address.city2;
                customer['address'] = address1 ? address1.substr(0,55) : '';
                options['customer'] = Common.sortObjectByKey(customer);

                var dest_address = params.dest_address || params.address;
                Common.getAddressFromPostcode(dest_address, function (dest_address) {
                    var dest_customers = [];
                    var dest_customer = {
                        dest_customer_name: params.dest_name || customer['customer_name'],
                        dest_customer_name_kana: params.dest_name_kana || customer['customer_name_kana'],
                        dest_zip_code: '',
                        dest_address: '',
                        dest_tel: params.dest_tel_num || customer['tel'],
                    };

                    dest_customer['dest_zip_code'] = dest_address.zipcode;
                    var dest_address1 = dest_address.pref + dest_address.city2;
                    dest_customer['dest_address'] = dest_address1 ? dest_address1.substr(0,55) : '';
                    var sort_dest_customer = Common.sortObjectByKey(dest_customer);
                    dest_customers.push(sort_dest_customer);
                    options['dest_customers'] = dest_customers;
                    options = Common.sortObjectByKey(options);

                    console.log('===generateChecksumAftee', options);
                    var checksum = Common.generateChecksumAftee(options, params.atone_secret_key);
                    if (checksum !== void 0 && checksum) {
                        options['checksum'] = checksum;
                        options['shop_transaction_no'] = order_id;
                        if (price['transaction_options'] !== void 0 && price['transaction_options'].value) {
                            var transaction_options = [];
                            transaction_options.push(parseInt(price['transaction_options'].value));
                            options['transaction_options'] = transaction_options;
                        }
                        result['np_data'] = options;
                        result['atone_pub_key'] = params.atone_pub_key;
                        result['success'] = true;
                    }

                    return callback(result);
                });
            });
        } else {
            return callback(result);
        }
    } else {
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
