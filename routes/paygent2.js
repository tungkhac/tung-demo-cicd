const request = require('request');
var express = require('express');
var router = express.Router();
var model = require('../model');
var xmlParser = require('xml-js');
const crypto = require('crypto');
var moji = require('moji');
const DEFAULT_DOMAIN = 'test.payment-agent.paygent.co.jp';
var default_error_message = 'カードに誤りがあります。再度確認して入力して下さい。';

router.post('/payment', function(req, res, next){
    var body = req.body;
    console.log('payment body', body);
    var domain = (typeof body.domain != 'undefined') ? body.domain : DEFAULT_DOMAIN;
    var response = {};

    var execTranUrl = `https://${domain}/payment-agent/api/chatbot/instruct_payment`;
    execTranPaygent(body, execTranUrl, function (result) {
        if(result && result.success){
            response.message = result.message;
            res.status(200).json(response);
        }else{
            response.error_message = result.error;
            console.log('response', response);
            return res.status(500).json(response);
        }
    });
});

router.post('/transaction_infor', function(req, res, next){
    var body = req.body;
    var domain = (typeof body.domain != 'undefined') ? body.domain : DEFAULT_DOMAIN;
    var onetimeHashcode = (typeof body.onetimeHashcode != 'undefined') ? body.onetimeHashcode : '';
    var response = {
        "customerId": "",
        "customerTranId": "",
        "transferAmount": 0
    };

    if(onetimeHashcode != ''){
        var url = `https://${domain}/payment-agent/api/chatbot/fetch_traninfo`;
        var headers = {
            'Accept':'application/json',
            'Content-Type':'application/json'
        };
        var request_body = {
            "onetimeHashcode": onetimeHashcode
        };
        console.log('Api url ', url);
        request({
            uri: url,
            method: 'POST',
            headers: headers,
            json: request_body
        }, function (error, response0, body) {
            console.log('body = ', body);
            console.log('error = ', error);
            if(!error && body.data != null){
                var transaction_info = body.data.customerTranInfo;
                if(body.data.resultCode == '00' && transaction_info != null){
                    response.customerId = transaction_info.customerId;
                    response.customerTranId = transaction_info.customerTranId;
                    response.transferAmount = transaction_info.transferAmount;
                }else{
                    response.error_message = (typeof body.data.resultMessage != 'undefined' && body.data.resultMessage != '') ?
                        body.data.resultMessage : "エラーが発生しました。";
                }
                console.log('response', response);
                return res.status(200).json(response);
            }else{
                response.error_message = (typeof body.resultMessage != 'undefined' && body.resultMessage != '') ?
                    body.resultMessage : "エラーが発生しました。";
                return res.status(200).json(response);
            }
        });
    }else{
        response.error_message = "URLが有効ではありません。";
        return res.status(200).json(response);
    }
});
/*pulldown bank*/
router.post('/bank', function(req, res, next){
    var url = 'https://bankcode-api.appspot.com/api/bank/JP';
    var result_json = {
        type: "006",
        name: 'pulldown_bank',
        data: []
    };
    var list = [];
    sendApiRequest(url, function (result_check, body) {
        if(result_check && typeof body.data != 'undefined'){
            var  data = body.data;
            for (var index in data) {
                if (data.hasOwnProperty(index)) {
                    if(data[index]){
                        list.push({
                            value: data[index]['code'],
                            text: data[index]['name']
                        });
                    }
                }
            }
            result_json['data'] = list;
            res.json(result_json);
        }else{
            res.json(result_json);
        }
    });
});
/*pulldown branch*/
router.post('/branch', function(req, res, next){
    var body = req.body;
    var url = 'https://bankcode-api.appspot.com/api/bank/JP/' + body.bank_code;
    var result_json = {
        type: "006",
        name: 'pulldown_branch',
        data: []
    };
    var list = [];
    sendApiRequest(url, function (result_check, body) {
        if(result_check  && typeof body.data != 'undefined'){
            var  data = body.data;
            for (var index in data) {
                if (data.hasOwnProperty(index)) {
                    if(data[index]){
                        list.push({
                            value: data[index]['code'],
                            text: data[index]['name']
                        });
                    }
                }
            }
            result_json['data'] = list;
            res.json(result_json);
        }else{
            res.json(result_json);
        }
    });
});
/*generate request number*/
router.post('/generate_request_number', function(req, res, next){
    var body = req.body;
    var user_id = body.user_id;
    var min = 100;
    var max = 999;
    var a = Math.floor( Math.random() * (max + 1 - min) ) + min;
    var today = new Date();
    var current_time = today.getTime();
    var random_no = current_time + a + user_id;
    var request_number = "EFO" + random_no.substr(0, 16);
    console.log('request_number', request_number);
    return res.status(200).json({
        request_number: request_number
    });
});

function sendApiRequest(url, callback) {
    try{
        request({
            uri: url,
            method: 'GET'
        },function (error, response, body) {
            if (!error && response.statusCode == 200){
                body = JSON.parse(body);
                return callback(true, body);
            }else{
                return callback(false);
            }
        });
    }catch(e){
        console.log('Send request api error: ', e);
        return callback(false);
    }
}

function execTranPaygent(params, post_url, callback) {
    // console.log("execTranPaygent", params, price);
    var result = [];
    result['success'] = false;
    result['message'] = "";
    // var min = 100;
    // var max = 999;
    // var a = Math.floor( Math.random() * (max + 1 - min) ) + min;
    // var today = new Date();
    // var current_time = today.getTime();
    try{
        // var user_id = params.user_id;
        // var random_no = current_time + a + user_id;

        var salt_value = params.salt_value; //iJkVXwA?tkR_Y9yMBGWs
        var company_id = params.company_id;
        var customer_id = params.customer_id;
        var transition_id = params.transition_id;
        // var request_number = "EFO" + random_no.substr(0, 17); //QA
        var request_number = params.request_number; //QA
        var request_type = (typeof params.request_type !== "undefined") ? params.request_type : "13"; //QA
        // var error_message_field = (typeof params.error_message_field !== "undefined") ? params.error_message_field : "receivedResultMessage";
        // var ordering_customer_name = params.ordering_customer_name; //QA
        var bank_code = params.bank_code;
        var branch_code = params.branch_code;
        var account_type = params.account_type;
        var account_number = params.account_number; //QA
        var beneficiary_customer_name = convertTextHanka(params.beneficiary_customer_name); //QA
        //Test data
        // branch_code = "001";
        // account_type = "2";
        // account_number = "1234560";
        //end test data
        // var amount = parseInt(params.amount);
        // var identity_flg = (amount > 100000) ? "1" : "0"; //0：本人未確認; 1：本人確認済

        // var str = customer_id + request_number + ordering_customer_name + bank_code + branch_code + account_type + account_number + beneficiary_customer_name + amount + identity_flg;
        // var str = company_id + customer_id + transition_id + request_number + bank_code + branch_code + account_type + account_number + beneficiary_customer_name + salt_value;
        var str = request_type + company_id + customer_id + transition_id + request_number + bank_code + branch_code + account_type + account_number + beneficiary_customer_name + salt_value;
        var hash = crypto.createHash('sha256').update(str.toString()).digest('hex');
        hash = hash.toUpperCase();
        var request_body = {
            "requestType": request_type,
            "allianceCompanyId": company_id,
            "customerPaymentInfo":{
                "customerId": customer_id, //0000000001
                "customerTranId": transition_id, //"TRN0000000000001"
                // "requestNumber": request_number,
                "transferRequestInfo": {
                    "transferRequestNumber": request_number
                },
                "transferToInfo":{
                    "bankCode": bank_code,
                    "branchCode": branch_code,
                    "accountType": account_type,
                    "accountNumber": account_number,
                    "beneficiaryCustomerName": beneficiary_customer_name
                }
            },
            "hash": hash
        };
        console.log('request_body ', request_body);

        var headers = {
            'Accept':'application/json',
            'Content-Type':'application/json'
        };
        request({
            uri: post_url,
            method: 'POST',
            headers: headers,
            json: request_body
        }, function (error, response, body) {
            // console.log('body = ', body);
            console.log(JSON.stringify(body, null, 2));
            console.log('error = ', error, params.user_id);
            console.log('response.statusCode = ', response.statusCode, params.user_id);
            var error_message = default_error_message;
            // var transferResultInfo = body.responseInfo.transferResultInfo;
            var transferReceivedInfo = null;
            var transferResultInfo = null;
            if(typeof body.responseInfo != 'undefined'){
                transferReceivedInfo = body.responseInfo.transferReceivedInfo;
                transferResultInfo = (typeof body.responseInfo.transferResultInfo !== 'undefined') ? body.responseInfo.transferResultInfo : null;
            }else if(typeof body.transferReceivedInfo != 'undefined'){
                transferReceivedInfo = body.transferReceivedInfo;
            }
            // var transferReceivedInfo = (typeof body.responseInfo != 'undefined') ?
            //     body.responseInfo.transferReceivedInfo : body.transferReceivedInfo;
            if(transferReceivedInfo){
                if(!error && response.statusCode == 200 && transferReceivedInfo.receivedResultCode == "00"){
                    result['success'] = true;
                    error_message = "";
                }else if(transferResultInfo !== null &&
                    typeof transferResultInfo.transferResultCode != 'undefined' &&
                    transferResultInfo.transferResultCode != '00' &&
                    typeof transferResultInfo.transferResultMessage != 'undefined' &&
                    transferResultInfo.transferResultMessage != ''
                ){
                    error_message = transferResultInfo.transferResultMessage;
                    if(transferResultInfo.transferResultCode == 'W01'){
                        result['success'] = true;
                        result['message'] = transferResultInfo.transferResultMessage;
                    }
                }else if(typeof transferReceivedInfo.receivedResultCode != 'undefined' &&
                    transferReceivedInfo.receivedResultCode != '00' &&
                    typeof transferReceivedInfo.receivedResultMessage != 'undefined' &&
                    transferReceivedInfo.receivedResultMessage != ''
                ){
                    error_message = transferReceivedInfo.receivedResultMessage;
                    if(transferReceivedInfo.receivedResultCode == 'W01'){
                        result['success'] = true;
                        result['message'] = transferReceivedInfo.receivedResultMessage;
                    }
                }
            }else{
                error_message = "エラーが発生しました。";
            }
            result['error'] = error_message;
            console.log(result);
            return callback(result);
        });
    }catch (error){
        console.log('exp error ', error, params.user_id);
        result['error'] = default_error_message;
        return callback(result);
    }
}

function convertTextHanka(str = '') {
    var result = '';
    try {
        if (str) {
            str = moji(str).convert('ZK', 'HK').toString();
            result = str.replace(/　/g, " ");
        }
    } catch (e) {
        console.log('convertTextHaka', e);
    }

    return result;
}

// function
module.exports = router;
