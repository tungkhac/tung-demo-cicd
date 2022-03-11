// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
var model = require('../model');
var xmlParser = require('xml-js');

var Connect =  model.Connect;
var ConnectPage =  model.ConnectPage;
var EfoPOrderHistory =  model.EfoPOrderHistory;
var EfoPOrderSetting =  model.EfoPOrderSetting;
var PaymentGateway =  model.PaymentGateway;
var EfoCart =  model.EfoCart;
var EfoCv =  model.EfoCv;
var EfoMessageVariable = model.EfoMessageVariable;
var UserCryptKey = model.UserCryptKey;

const TAX_EXCLUDED_TYPE = '002',
    ROUND_DOWN_TYPE = '001',
    ROUND_UP_TYPE = '002',
    IS_A_SETTLEMENT_FEE_TYPE = '002',
    IS_A_SHIPPING_FEE_TYPE = '002';
const PAYMENT_SUCCESS = '001',
      PAYMENT_FAIL = '002';
const default_zeus_gateway = {clientip : "2019001201"};

var default_error_message = 'カードに誤りがあります。再度確認して入力して下さい。';

router.post('/payment', function(req, res, next){
    var body = req.body;
    var connect_page_id = body.connect_page_id,
        user_id = body.user_id,
        user_tel = body.user_tel,
        user_email = body.user_email,
        payment_token = body.payment_token;

    var response = {};
    var params = {};

    if(connect_page_id != '' && user_id != '' && user_tel != '' && user_email != '' && payment_token != ''){
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
                params.user_tel = user_tel;
                params.user_email = user_email;
                params.payment_token = payment_token;

                getPaymentGatewayInfo(params, function (error, gateway) {
                    if(error){
                        response.error_message  = "Error occurred.";
                        return res.status(400).json(response);
                    }
                    params.clientip = gateway.clientip;

                    var execTranUrl = "https://linkpt.cardservice.co.jp/cgi-bin/secure.cgi";
                    getAmount(params, function (price) {
                        execTranZeus(params, price, execTranUrl, function (result) {
                            if(result && result.success){
                                response.message_code = "Payment success";
                                res.status(200).json(response);
                            }else{
                                response.error_message = result.error;
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
    console.log('getAmount');
    var credit_card_payment_type = false;
    EfoCart.find({cid: params.connect_page_id, uid: params.user_id, order_id: null}, function(err, result) {
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
            shipping_fee : shipping_fee
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
                    return callback(false, default_zeus_gateway);
                }
            });
        }else{
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

function execTranZeus(params, price, post_url, callback) {
    // console.log("execTranZeus", params, price);
    var options = [];
    var result = [];
    result['success'] = false;

    if(params.payment_token != undefined){
        options['clientip'] = params.clientip;
        options['token_key'] = params.payment_token;
        options['money'] = price.amount + price.consumption_tax + price.consumption_tax + price.settlement_fee + price.shipping_fee;
        options['send'] = 'mall';
        options['telno'] = params.user_tel;
        options['email'] = params.user_email;

        request({
            uri: post_url,
            method: 'POST',
            form: options
        }, function (error, response, body) {
            console.log('body response', body);

            if(body == 'Success_order'){
                result['success'] = true;
                saveHistoryOrder(params, price, params.log_order_id, body, true);
            }else{
                result['success'] = false;
                result['error'] = default_error_message;
                saveHistoryOrder(params, price, params.log_order_id, body, false);
            }
            return callback(result);
        });
    }else{
        return callback(result);
    }
}

function saveHistoryOrder(params, price, order_id, data_response, status_code) {
    console.log("saveHistoryOrder");
    var now = new Date();
    //encrypt
    if (params.encrypt_flg != void 0 && params.encrypt_flg == 1 && params.encrypt_key != '') {
        data_response = convertJSONEncrypt(data_response, params.encrypt_key);
    }
    EfoPOrderHistory.findOneAndUpdate({connect_page_id : params.connect_page_id, user_id: params.user_id, order_id: order_id}, {
        $set: {
            p_order_id: order_id,
            amount: price.amount,
            price_tax: price.consumption_tax,
            settlement_fee: price.settlement_fee,
            shipping_fee: price.shipping_fee,
            order_status: status_code ? PAYMENT_SUCCESS : PAYMENT_FAIL,
            payment_status : status_code ? "2" : "1",
            data: data_response,
            mode: '2',
            updated_at: now
        },
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
