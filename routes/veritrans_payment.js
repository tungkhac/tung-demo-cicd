// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var moment = require('moment');
var Parent = require('./parent.class');
const config = require('config');
const Common = require('../modules/common');
const Payment = require('../modules/payment');
const TIMEZONE = config.get('timezone');
const PAYMENT_GMO_COD_TYPE = '017';
const default_payment_type = '2';
const default_pdcompanycode = '11';
var default_error_message = 'カードに誤りがあります。再度確認して入力して下さい。';
const Log4js = require("log4js");
const MerchantConfig_1 = require("../modules/tgMdkNode/tgMdk/MerchantConfig");
const Transaction_1 = require("../modules/tgMdkNode/tgMdk/Transaction");
const CardAuthorizeRequestDto_1 = require("../modules/tgMdkNode/tgMdkDto/Card/CardAuthorizeRequestDto");
const CardAuthorizeResponseDto_1 = require("../modules/tgMdkNode/tgMdkDto/Card/CardAuthorizeResponseDto");

function getConfig(merchan_id, merchant_secret_key) {
    return new MerchantConfig_1.MerchantConfig(merchan_id, merchant_secret_key, "1");
}

function getLogger() {
    // Log4js.configure({
    //     appenders: { system: { type: 'stdout' } }, categories: { default: { appenders: ['system'], level: 'info' } }
    // });
    return Log4js.getLogger("default");
}

class veritransPaymentRouter extends Parent {
    constructor() {
        super();
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/payment', async (req, res, next) => {
            console.log("API checkpayment ---> ", req.body);
            var body = req.body;
            console.log('body', body);
            let {
                cpid,
                uid,
                ship_ymd,
                name,
                address,
                send_name,
                send_address,
                tel_num,
                email,
                payment_type,
                delivery_company_code,
                name_kana,
                send_tel_num,
                card_token,
            } = body;

            var response = {};

            Common.getConnectPageInfo(cpid, uid, (check, connect_page) => {
                if (check) {
                    var params = {};
                    params.connect_page_id = cpid;
                    params.connect_id = connect_page.connect_id;
                    params.encrypt_flg = connect_page.encrypt_flg;
                    params.encrypt_key = connect_page.encrypt_key;
                    params.connect_id = connect_page.connect_id;
                    params.log_order_id = connect_page.log_order_id;
                    params.device = connect_page.device;
                    params.user_id = uid;
                    params.card_token = card_token;
                    //by user
                    params.address = address;
                    params.full_name = name;
                    params.email = email;
                    params.phone = tel_num;
                    params.shop_order_date = ship_ymd;
                    params.send_name = send_name;
                    params.send_address = send_address;
                    params.payment_type = payment_type || default_payment_type;
                    params.pdcompanycode = delivery_company_code || default_pdcompanycode;

                    // is not require
                    params.name_kana = name_kana;
                    params.send_tel_num = send_tel_num;
                    console.log('=====params', params);
                    Payment.getPaymentGatewayCODInfo(PAYMENT_GMO_COD_TYPE, params, (error, gateway) => {
                        if (error) {
                            response.error_message = 'Error occurred.';
                            return res.status(400).json(response);
                        }
                        params.token_key = gateway.token_key;
                        params.merchant_id = gateway.merchant_id;
                        params.merchant_authentication_key = gateway.merchant_authentication_key;
                        params.mode = gateway.mode;
                        Payment.getAmountOrderCOD(params, (price) => {
                            console.log('=======price', price);
                            Payment.checkOrderFailExist(params).then((order_fail) => {
                                console.log('order_fail', order_fail);
                                params.is_update_order = false;
                                if (
                                    order_fail &&
                                    order_fail.data &&
                                    order_fail.data.transactionResult &&
                                    order_fail.data.transactionResult.gmoTransactionId &&
                                    order_fail.data.transactionResult.authorResult === 'NG'
                                ) {
                                    params.is_update_order = true;
                                    params.gmoTransactionId = order_fail.data.transactionResult.gmoTransactionId;
                                }

                                this.execTranGMOCOD(params, price, (result) => {
                                    if (result && result.success) {
                                        response.message_code = 'Create request veritrans 4g success.';
                                        response.order_id = result.orderId;
                                        res.status(200).json(response);
                                    } else {
                                        if (result.error) {
                                            response.error_message = result.error;
                                        } else {
                                            response.error_message = default_error_message;
                                        }
                                        console.log('response', response);
                                        return res.status(500).json(response);
                                    }
                                });
                            });
                        });
                    });
                } else {
                    response.error_message = 'Error occurred.';
                    return res.status(400).json(response);
                }
            });
        });
        this.router.post('/test_infor_card', async (req, res, next) => {
            let transaction;
            let logger = getLogger();
            let {
                merchant_id,
                merchant_authentication_key
            } = req.body;

            let config = getConfig(merchant_id, merchant_authentication_key);
            transaction = new Transaction_1.Transaction(logger, config);
            let request = new CardAuthorizeRequestDto_1.CardAuthorizeRequestDto();
            request.amount = "100";
            // request.token = card_token;
            request.orderId = 'order-' + Math.floor(((new Date()).getTime()) / 1000).toString();
            let order_id = request.orderId;
            request.cardNumber = '4111111111111111';
            request.cardExpire = '12/30';
            console.log('order_id test', order_id);
            request.withCapture = "false";
            let responseDto = await transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
            if (responseDto != void 0) {
                if (responseDto.orderId == order_id && responseDto.mstatus == 'success') {
                    res.status(200).json({status:1});
                } else {
                    res.status(200).json({status:0});
                }
            } else {
                res.status(200).json({status:0});
            }
        });
    }

    async execTranGMOCOD(params, price, callback) {
        var result = [];
        result['success'] = false;
        result['data'] = { message: [default_error_message] };
        var order_id = params.log_order_id || '';
        var now = new Date();
        var request_date = moment(now)
            .tz(TIMEZONE)
            .format('YYYYMMDDHHmmss');
        // Last 6 character and time request date is order_id
        order_id =
            request_date +
            '-' +
            order_id
                .toString()
                .slice(-5)
                .toUpperCase();

        if (params.payment_type != undefined) {
            let transaction;
            let logger = getLogger();
            let config = getConfig(params.merchant_id, params.merchant_authentication_key);
            transaction = new Transaction_1.Transaction(logger, config);
            let request = new CardAuthorizeRequestDto_1.CardAuthorizeRequestDto();
            request.amount = price.product_unit_price.value;
            request.token = params.card_token;
            request.orderId = order_id;
            console.log('order_id', order_id);
            request.withCapture = "false";
            let responseDto = await transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto);
            if (responseDto != void 0) {
                if (responseDto.orderId == order_id && responseDto.mstatus == 'success') {
                    console.log('success=====');
                    result['success'] = true;
                    result['orderId'] = order_id;
                    Payment.saveHistoryOrder(params, price, order_id, responseDto, true, true);
                    return callback(result);
                } else {
                    if (responseDto.merrMsg !== void 0) {
                        result['error'] = responseDto.merrMsg;
                    }
                    Payment.saveHistoryOrder(params, price, order_id, responseDto, false);
                    return callback(result);
                }
            } else {
                return callback(result);
            }
        } else {
            return callback(result);
        }
    }
}

module.exports = new veritransPaymentRouter().router;
