// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
const Zipcode = model.Zipcode;
const PinCodeAuth = model.PinCodeAuth;

const BiyoHistory = model.BiyoHistory;
const BiyoUser = model.BiyoUser;
const BiyoMasterAnket = model.BiyoMasterAnket;
const Variable = model.Variable;
const MessageVariable = model.MessageVariable;
const UserProfile = model.UserProfile;

const config = require('config');
var azure = require('azure-storage');
var moment = require('moment-timezone');
const request = require('request');
var urlencode = require('urlencode');
const fs      = require('fs');

var emailValidator = require("email-validator");

const currencyFormatter = require('currency-formatter');

const connect_page_id = "5d1b2601a24a61078e733f04";
const user_app_id = 8;
const user_app_token = "v0uerOENnLNTY9plZUIb6KSHz0pmtzPmSeCsqSBp";

const point_app_id = 11;
const point_app_token = "HiYsc8a7qXpJQLMkp6ih5ioSK8030dy9ZNabstFd";

const inquiry_app_id = 7;
const inquiry_app_token = "dCxCytU1jvB3hmV3uop31P7i8HbSdBYqvo4TXLN2";

const inquiry_history_app_id = 13;
const inquiry_history_app_token = "XC3WOZraNE7BbR0DHMg1CSXl0kEzpZfovaVZfY0O";
const line_message = 'ご回答いただきありがとうございます👍✨';


const kifu_app_id = 39;
const kifu_app_token = "kw0jcXdYHLE1KPUAhBR1gkoIhuCTRQ3oclKxi8M2";
const user_pass_b64 = 'cy53YXRhbmFiZUBqYWJzLm9yLmpwOnlhbWFtb3Rva2F0b3V3YXRhbmFiZTIwMTk=';

const TIMEZONE = config.get('timezone');

const next_image = "https://app2.blob.core.windows.net/botchan2/plus-circle-solid.svg";
var fileType = require('file-type');

const variable_user_profile = [
    "user_record_id", "current_point", "email", "last_name", "first_name", "amazon_gift_flg", "status",
    "building", "stress", "city", "pref", "zipcode",
    "license", "birthday", "gender", "type", "store_type",
    "area", "store_num", "gender_rate", "staff_num", "salon_name"
];

//エラーが発生時、チャットワークに通知する
var pushMessageToChatwork = "https://api.chatwork.com/v2/rooms/199848858/messages";


//https://jabs41.cybozu.com/k/9/
const answer_9_flg_id = "5ddcc772a24a6144675a5e33";

//https://jabs41.cybozu.com/k/24/
const answer_24_flg_id = "5e3a2f7ca24a613f85027ab9";

//https://jabs41.cybozu.com/k/8/
const register_flg_id = "5de9ae56a24a619db33e4184";
const license_flg = "5e14809ca24a61446537cc26";

const deleted_flg_id = "5ddcd411a24a619db8144e04";
const line_bot_id = "5d1b2601a24a61078e733f04";
const line_page_access_token = "BDGDWdx4ItqBifCVkIBNB68UYwTTrScR0uNMTFJns6CQPlWH3QeFpMHyLsbVfWHR6TWOqNNdRR+aRUkwWwXPmZWZevfvn5Wi8pZ5is9fRXANHOCCoX2ctlv7Xmtls85MeNW0fplFNlQMxqhfBwAvy1GUYhWQfeY8sLGRXgo3xvw=";
const LINE_MAX_USER_PUSH = 150;


router.post('/removeEmail', function(req, res, next){
    var body = req.body;
    console.log("body=", body);
    var cpid = body.cpid;
    var uid = body.uid;
    PinCodeAuth.remove({cpid: cpid, uid: uid}, function (err, result){

    });
    res.status(200).json({});
});


/* GET home page. */
router.post('/validateEmail', function(req, res, next){
    var body = req.body;
    console.log("validateEmail", body);
    var email = typeof body.email !== "undefined" ? body.email.trim() : "";
    var headers = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var request_body = {
        uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + user_app_id + "&query=email=" + '"' + email + '"',
        headers: headers,
        method: "GET",
        json: true
    };

    var result = {};
    request(request_body, function (error, response, body) {
        console.log("error=", error);
        //console.log("response.statusCode=", response.statusCode);
        //console.log(body.totalCount);
        console.log(body);
        if (!error && response.statusCode == 200){
            if(body.totalCount > 0){
                result.error_message = '入力されたメールアドレスは既に使用されています。</br>他のメールアドレスを入力してください。';
                res.status(500).json(result);
            }else{
                res.status(200).json(result);
            }
        }else {
            result.error_message = 'エラーが発生しました。';
            res.status(500).json(result);
        }
    });
});

router.post('/validateLineId', function(req, res, next){
    var body = req.body;
    console.log("validateLineId", body);
    var liff_user_id = typeof body.liff_user_id !== "undefined" ? body.liff_user_id.trim() : "";

    if(liff_user_id == ""){
        pushChatwork("API validateLineId liff_user_id 空白" + body.user_id);
    }

    var headers = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var request_body = {
        uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + user_app_id + "&query=LINE_ID=" + '"' + liff_user_id + '"',
        headers: headers,
        method: "GET",
        json: true
    };
    var result = {};
    request(request_body, function (error, response, body) {
        if (!error && response.statusCode == 200){
            if(body.totalCount > 0){
                result.error_message = 'このLINEアカウントは既に使用されています。';
                res.status(500).json(result);
            }else{
                res.status(200).json(result);
            }
        }else {
            result.error_message = 'エラーが発生しました。';
            pushChatwork("API validateLineId エラーが発生しました。" + body.user_id);
            res.status(500).json(result);
        }
    });
});

router.post('/validateLineIdFromLine', function(req, res, next){
    var body = req.body;
    console.log("validateLineIdFromLine", body);
    var liff_user_id = typeof body.user_id !== "undefined" ? body.user_id.toString().trim() : "";
    var headers = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var request_body = {
        uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + user_app_id + "&query=LINE_ID=" + '"' + liff_user_id + '"',
        headers: headers,
        method: "GET",
        json: true
    };

    request(request_body, function (error, response, body) {
        //console.log("response.statusCode=", response.statusCode);
        //console.log(body.totalCount);
        //console.log(body);
        if (!error && response.statusCode == 200){
            if(body.totalCount > 0){
                var records = body.records;
                var user = records[0];
                var user_record_id = user["$id"].value;
                res.status(200).json({"user_record_id": user_record_id, "user_create_flg": "1"});
            }else{
                res.status(200).json({"user_create_flg": "0"});
            }
        }else {
            res.status(200).json({"user_create_flg": "0"});
        }
    });
});

router.post('/userWebhook', function(req, res, next){
    console.log("hailtuserWebhook1");
    var data = req.body;
    var record = data.record;
    var user_id = record["$id"].value;

    console.log(record);


    var user_line_id = record.LINE_ID.value;
    console.log("user_line_id", user_line_id);
    saveRegisterFlg(8, user_line_id);

    var license = record.免許.value;


    console.log("hailtgogo");
    var update_time = moment().tz(TIMEZONE).format("YYYY-MM-DDTHH:mm:00Z");
    var body_request2 = {
        app: point_app_id,
        record: {
            UserID: {value : user_id},
            Change: {value : 100},
            Event: {value : "会員登録"},
            Balance: {value : 100},
            LastUpdate: {value : update_time}
        }
    };
    //console.log(body_request2);
    var headers2 = {
        'X-Cybozu-API-Token' : point_app_token,
        'Content-type': 'application/json'
    };
    //add rent
    request({
        uri: 'https://jabs41.cybozu.com/k/v1/record.json',
        method: 'POST',
        headers: headers2,
        json: body_request2
    }, function (error1, response2, body2) {
        console.log("point_app_id", error1, body2);
    });

    var body_request3 = {
        app: user_app_id,
        id: user_id,
        record: {
            current_point: {value : 100}
        }
    };
    var headers3 = {
        'X-Cybozu-API-Token' : user_app_token
    };
    request({
        uri: 'https://jabs41.cybozu.com/k/v1/record.json',
        method: 'PUT',
        headers: headers3,
        json: body_request3
    }, function (error1, response, body2) {
        console.log("user_app_id", body2);
    });

    console.log(license);
    if(license == "有り" || license == "持っている"){
        saveLicenseFlg(8, user_line_id, "1");
    }else{
        saveLicenseFlg(8, user_line_id, "0");
    }

    res.status(200).json({});
});

router.post('/updateUser', function(req, res, next){
    var body = req.body;
    console.log("updateUser=", body);
    var LINE_ID = body.LINE_ID;
    var fields = ["免許", "性別", "姓", "名", "生年月日", "都道府県",
        "市区町村", "種類", "番地", "建物名", "email", "salon_name", "staff_num", "gender_rate", "store_num",
        "area", "store_type", "zipcode"
    ];
    var 免許 =  typeof body.免許 !== "undefined" ? body.免許 : "";
    var 性別 =  typeof body.性別 !== "undefined" ? body.性別 : "";
    var 姓 =  typeof body.姓 !== "undefined" ? body.姓 : "";
    var 名 =  typeof body.名 !== "undefined" ? body.名 : "";

    var 生年月日 =  typeof body.生年月日 !== "undefined" ? body.生年月日 : "";
    var email =  typeof body.email !== "undefined" ? body.email : "";

    var zipcode =  typeof body.zipcode !== "undefined" ? body.zipcode : "";
    var 都道府県 =  typeof body.都道府県 !== "undefined" ? body.都道府県 : "";
    var 市区町村 =  typeof body.市区町村 !== "undefined" ? body.市区町村 : "";
    var 番地 =  typeof body.番地 !== "undefined" ? body.番地 : "";
    var 建物名 =  typeof body.建物名 !== "undefined" ? body.建物名 : "";
    var 種類 =  typeof body.種類 !== "undefined" ? body.種類 : "";
    種類 = 種類.replace(/美容室経営者/g,'サロン経営者');

    var salon_name =  typeof body.salon_name !== "undefined" ? body.salon_name : "";
    var staff_num =  typeof body.staff_num !== "undefined" ? body.staff_num : "";
    var gender_rate =  typeof body.gender_rate !== "undefined" ? body.gender_rate : "";
    var store_num =  typeof body.store_num !== "undefined" ? body.store_num : "";
    var area =  typeof body.area !== "undefined" ? body.area : "";
    var store_type =  typeof body.store_type !== "undefined" ? body.store_type : "";


    var header_user = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var query = 'LINE_ID = "' + LINE_ID + '"';

    console.log("query=", query);
    var request_body = {
        uri: "https://jabs41.cybozu.com/k/v1/records.json?app=" + user_app_id + "&query=" + query,
        headers: header_user,
        method: "GET",
        json: true
    };

    var res_result = {
        "error_message" : "エラーが発生しました。"
    };


    request(request_body, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var row = records[0];
                var record_id = row["$id"].value;

                var update_data = {};
                for(var j = 0 ; j < fields.length; j++){
                    var field_name = fields[j];
                    var field_value = eval(field_name);
                    if(field_value && field_value.length > 0){
                        if(field_name == "種類" || field_name == "store_type"){
                            field_value = field_value.split(",");
                        }
                        update_data[field_name] = {value: field_value};
                    }
                    //console.log("eval===", eval(field_name));
                }
                var body_request1 = {
                    app: user_app_id,
                    id: record_id,
                    record: update_data
                };
                console.log("body_request1", body_request1);
                var headers1 = {
                    'X-Cybozu-API-Token' : user_app_token,
                    'Content-type': 'application/json'
                };
                //update WatchState
                request({
                    uri: 'https://jabs41.cybozu.com/k/v1/record.json',
                    method: 'PUT',
                    headers: headers1,
                    json: body_request1
                }, function (error1, response, body2) {
                    //console.log("response", response);
                    if (!error1 && response.statusCode == 200){
                        res.status(200).json({});
                    }else{
                        res.status(500).json(res_result);
                    }
                });
            }else{
                res.status(500).json(res_result);
            }
        }else {
            res.status(500).json(res_result);
        }
    });
});

router.post('/checkUserIdForLiff', function(req, res, next){
    var body = req.body;
    var user_id = body.liff_user_id;

    var result_error1 = {
        error_message: "エラーが発生しました。"
    };

    var result_error2 = {
        error_message: "まだ会員登録手続きをされていません。"
    };

    var header_user = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var query_user = 'LINE_ID = "' + user_id + '"';
    var request_body_user = {
        uri: "https://jabs41.cybozu.com/k/v1/records.json?app=" + user_app_id + "&query=" + query_user,
        headers: header_user,
        method: "GET",
        json: true
    };
    request(request_body_user, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                res.status(200).json({});
            }else{
                res.status(500).json(result_error2);
            }
        }else {
            res.status(500).json(result_error1);
        }
    });
});

router.post('/getUserProfile', function(req, res, next){
    var body = req.body;
    var user_id = body.user_id;
    var bot_id = typeof body.bot_id !== "undefined" ? body.bot_id : "";
    console.log(body);
    var result = {};
    result.first_name = "";
    result.last_name = "";
    result.gender = "";
    result.email = "";
    result.birthday = "";
    result.license = "";
    result.zipcode = "";
    result.pref = "";
    result.city = "";
    result.stress = "";
    result.building = "";
    result.status = "";
    result.current_point = 0;
    result.user_record_id = -1;
    result.amazon_gift_flg = 0;

    result.salon_name =  "";
    result.staff_num =  "";
    result.gender_rate = "";
    result.store_num = "";
    result.area = "";
    result.store_type ="";
    result.type ="";

    BiyoUser.findOne({line_id: user_id}, function(err, row){
        if(row){
            var user = row.data;
            result.user_record_id = row.record_id;
            result.last_name = user.姓.value;
            result.first_name = user.名.value;
            result.gender = user.性別.value;
            result.birthday = user.生年月日.value;
            result.email = user.email.value;
            result.license = user.免許.value;

            if(bot_id == "5f605f19a24a61efc929f5cb"){
                if(result.license == "有り") {
                    result.license = "持っている";
                }else if(result.license == "無し") {
                    result.license = "持っていない";
                }
            }
            result.zipcode = toPostFmt(user.zipcode.value);
            result.pref = user.都道府県.value;
            result.city = user.市区町村.value;
            result.stress = user.番地.value;
            result.building = user.建物名.value;
            result.type = user.種類.value.join(",");

            result.current_point = parseInt(user.current_point.value);
            result.status = user.status.value;
            if(result.current_point >= 500){
                result.amazon_gift_flg = 1;
            }
            result.salon_name =  user.salon_name.value;
            result.staff_num =  user.staff_num.value;
            result.gender_rate =user.gender_rate.value;
            result.store_num = user.store_num.value;
            result.area = user.area.value;
            result.store_type = user.store_type.value.join(",");
        }
        console.log(result);
        res.status(200).json(result);
    });
});

router.post('/addPointFromEfo', function(req, res, next){
    var body = req.body;
    console.log("addPointFromEfo", body);
    res.status(200).json({});
    var liff_user_id = typeof body.liff_user_id !== "undefined" ? body.liff_user_id.trim() : "";
    var inquiry_master_id = typeof body.inquiry_master_id !== "undefined" ? body.inquiry_master_id : "";
    var headers = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var request_body = {
        uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + user_app_id + "&query=LINE_ID=" + '"' + liff_user_id + '"',
        headers: headers,
        method: "GET",
        json: true
    };
    request(request_body, function (error, response, body){
        if (!error && response.statusCode == 200){
            if(body.totalCount > 0){
                var records = body.records;
                var row = records[0];
                var user_id = row["$id"].value;
                var user_point = 0;
                if(row.current_point.value){
                    user_point = parseInt(row.current_point.value);
                }
                console.log("user_point", user_point);

                var header_history = {
                    'X-Cybozu-API-Token' : inquiry_history_app_token
                };

                var request_body_history = {
                    uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + inquiry_history_app_id + "&query=anket_master_id=" + '"' + inquiry_master_id + '" and user_id="' + user_id + '"',
                    headers: header_history,
                    method: "GET",
                    json: true
                };
                request(request_body_history, function (error, response, body) {
                    if(body.totalCount > 0){
                        console.log("traloiduplicate");
                    }else{
                        var headers = {
                            'X-Cybozu-API-Token' : inquiry_app_token
                        };

                        var request_body = {
                            uri: "https://jabs41.cybozu.com/k/v1/record.json?app=" + inquiry_app_id + "&id=" + inquiry_master_id,
                            headers: headers,
                            method: "GET",
                            json: true
                        };
                        request(request_body, function (error, response, body) {
                            if(body && body.record){
                                var record  = body.record;
                                var add_point = 0;
                                if(record.point.value){
                                    add_point =  parseInt(record.point.value);
                                }
                                var inquiry_url = "";
                                if(record.anket_app_url && record.anket_app_url.value){
                                    inquiry_url = record.anket_app_url.value;
                                }
                                console.log("add_point=", add_point);

                                var body_request5 = {
                                    app: inquiry_history_app_id,
                                    record: {
                                        user_id: {value : user_id},
                                        anket_master_id: {value : inquiry_master_id},
                                        anket_app_url: {value : inquiry_url}
                                    }
                                };
                                console.log(body_request5);
                                //console.log(body_request2);
                                var headers5 = {
                                    'X-Cybozu-API-Token' : inquiry_history_app_token,
                                    'Content-type': 'application/json'
                                };
                                //add rent
                                request({
                                    uri: 'https://jabs41.cybozu.com/k/v1/record.json',
                                    method: 'POST',
                                    headers: headers5,
                                    json: body_request5
                                }, function (error1, response2, body2) {
                                    console.log(error1);
                                });

                                if(add_point > 0){
                                    var update_time = moment().tz(TIMEZONE).format("YYYY-MM-DDTHH:mm:00Z");

                                    var body_request2 = {
                                        app: point_app_id,
                                        record: {
                                            UserID: {value : user_id},
                                            Change: {value : add_point},
                                            Event: {value : "アンケート回答"},
                                            Balance: {value : user_point + add_point},
                                            LastUpdate: {value : update_time},
                                            anket_app_url: {value : inquiry_url}
                                        }
                                    };
                                    //console.log(body_request2);
                                    var headers2 = {
                                        'X-Cybozu-API-Token' : point_app_token,
                                        'Content-type': 'application/json'
                                    };
                                    //add rent
                                    request({
                                        uri: 'https://jabs41.cybozu.com/k/v1/record.json',
                                        method: 'POST',
                                        headers: headers2,
                                        json: body_request2
                                    }, function (error1, response2, body2) {
                                        if (!error1 && response2.statusCode == 200){

                                        }
                                    });

                                    var body_request3 = {
                                        app: user_app_id,
                                        id: user_id,
                                        record: {
                                            current_point: {value : user_point + add_point}
                                        }
                                    };
                                    var headers3 = {
                                        'X-Cybozu-API-Token' : user_app_token
                                    };
                                    request({
                                        uri: 'https://jabs41.cybozu.com/k/v1/record.json',
                                        method: 'PUT',
                                        headers: headers3,
                                        json: body_request3
                                    }, function (error1, response, body2) {

                                    });

                                }
                            }
                        });
                    }
                });
            }
        }
    });
});

router.post('/checkAnswer', function(req, res, next){
    var body = req.body;
    console.log("checkAnswer", body);
    var liff_user_id = typeof body.liff_user_id !== "undefined" ? body.liff_user_id.trim() : "";
    var result = {};
    if(liff_user_id == ""){
        result.error_message = 'LINEアプリからリンクを開いてください。';
        res.status(500).json(result);
    }else{
        var inquiry_master_id = typeof body.inquiry_master_id !== "undefined" ? body.inquiry_master_id : "";

        var headers = {
            'X-Cybozu-API-Token' : user_app_token
        };
        var request_body = {
            uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + user_app_id + "&query=LINE_ID=" + '"' + liff_user_id + '"',
            headers: headers,
            method: "GET",
            json: true
        };

        request(request_body, function (error, response, body) {
            if (!error && response.statusCode == 200){
                if(body.totalCount > 0){
                    var records = body.records;
                    var row = records[0];
                    var user_id = row["$id"].value;

                    var headers = {
                        'X-Cybozu-API-Token' : inquiry_history_app_token
                    };

                    var request_body = {
                        uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + inquiry_history_app_id + "&query=anket_master_id=" + '"' + inquiry_master_id + '" and user_id="' + user_id + '"',
                        headers: headers,
                        method: "GET",
                        json: true
                    };
                    request(request_body, function (error, response, body) {
                        if(body.totalCount > 0){
                            result.error_message = 'すでにこのアンケートに回答しました。';
                            res.status(500).json(result);
                        }else{
                            res.status(200).json({});
                        }
                    });
                }else{
                    result.error_message = 'このLINEアカウントは存在しません。';
                    res.status(500).json(result);
                }
            }else {
                result.error_message = 'エラーが発生しました。';
                res.status(500).json(result);
            }
        });
    }
});

router.post('/getRemainAnket', function(req, res, next){
    var body = req.body;
    console.log(body);
    var user_id = typeof body.user_id !== "undefined" ? body.user_id : "";
    var line_user_id = typeof body.line_user_id !== "undefined" ? body.line_user_id.trim() : "";
    var res_result = {
        remain: 0,
        total: 0
    };
    getUserId(user_id, line_user_id, function (user_id) {
        res_result.user_record_id = user_id;
        var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD");
        BiyoMasterAnket.find({start_date: { $lte : current_date}, end_date: { $gt: current_date }, public_status : "公開"}, function(err, rows){
            if(rows && rows.length > 0){
                //console.log(rows);
                var arr = [];
                rows.forEach(function(row) {
                    arr.push(row.record_id);
                });
                res_result.total = arr.length;
                BiyoHistory.find({user_id: user_id, anket_master_id: { $in: arr }}, function(err, rows){
                    if(rows && rows.length > 0){
                        res_result.remain = arr.length - rows.length;
                    }else{
                        res_result.remain = arr.length;
                    }
                    res.status(200).json(res_result);
                });
            }else{
                res.status(200).json(res_result);
            }
        });
    });
});

router.post('/getRemainAnketBak', function(req, res, next){
    var body = req.body;
    console.log(body);
    var user_id = typeof body.user_id !== "undefined" ? body.user_id : "";
    var line_user_id = typeof body.line_user_id !== "undefined" ? body.line_user_id.trim() : "";

    getUserId(user_id, line_user_id, function (user_id) {
        var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD");
        var headers = {
            'X-Cybozu-API-Token' : inquiry_app_token
        };
        var query = 'start_date <= "' + current_date + '" and end_date >= "' + current_date + '" and public_status in ("公開")';
        query = urlencode(query);
        var request_body = {
            uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + inquiry_app_id + "&query=" + query,
            headers: headers,
            method: "GET",
            json: true
        };

        var res_result = {
            remain: 0,
            total: 0
        };

        request(request_body, function (error, response, body) {
            var totalCount = body.totalCount;
            if (!error && response.statusCode == 200){
                if(totalCount > 0){
                    var records = body.records;
                    var arr = [];
                    for(var i = 0; i < records.length; i++) {
                        var row = records[i];
                        var record_id = row["$id"].value;
                        arr.push(record_id);
                    }
                    var query2 = 'user_id = "' + user_id + '" and anket_master_id in (' + arr.join(",") + ')';
                    console.log(query2);
                    headers = {
                        'X-Cybozu-API-Token' : inquiry_history_app_token
                    };
                    request_body = {
                        uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + inquiry_history_app_id + "&query=" + query2,
                        headers: headers,
                        method: "GET",
                        json: true
                    };
                    request(request_body, function (error, response, body) {
                        var answer_total = body.totalCount;
                        console.log("answer_total=", answer_total);
                        res_result.remain = totalCount - answer_total;
                        res_result.total = totalCount;
                        res_result.user_record_id = user_id;
                        res.status(200).json(res_result);
                    });
                }else{
                    res.status(200).json(res_result);
                }
            }else {
                res.status(200).json(res_result);
            }
        });
    });
});

function getUserId(user_id, line_user_id, callback){
    console.log("getUserId=");
    if(user_id != "-1"){
        return callback(user_id);
    }
    BiyoUser.findOne({line_id: line_user_id}, function(err, row){
        if(row){
            return callback(row.record_id);
        }else{
            return callback(user_id);
        }
    });
}

function getUserIdBak(user_id, line_user_id, callback){
    console.log("getUserId=");
    if(user_id != "-1"){
        return callback(user_id);
    }
    var header_user = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var query_user = 'LINE_ID = "' + line_user_id + '"';
    var request_body_user = {
        uri: "https://jabs41.cybozu.com/k/v1/records.json?app=" + user_app_id + "&query=" + query_user,
        headers: header_user,
        method: "GET",
        json: true
    };

    request(request_body_user, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var user = records[0];
                //console.log("user=", user);
                user_id = user["$id"].value;
            }
        }
        console.log("user_id=", user_id);
        return callback(user_id);
    });
}

function getAnswerAnket(user_id, callback){
    var arr = [];
    BiyoHistory.find({user_id: user_id}, function(err, rows){
        if(rows && rows.length > 0){
            rows.forEach(function(row) {
                arr.push(row.anket_master_id);
            });
        }
        return callback(arr);
    });
}

router.post('/getNewAnket', function(req, res, next){
    var body = req.body;
    var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD");
    var user_id = typeof body.user_id !== "undefined" ? body.user_id : "";
    var user_record_id = typeof body.user_record_id !== "undefined" ? body.user_record_id : "";

    var no_result = {
        "type": "text",
        "text": "未回答のアンケートはありません😊"
    };

    var first_result = {
        "type": "text",
        "text": "BIYOのアンケートにぜひご協力ください🙇‍🙇‍♀️"
    };

    var remain_result = {
        "type": "text",
        "text": "未回答のアンケートがanket_remain個あります😅💦"
    };

    var remain_cnt = 0;

    getUserId(user_record_id, user_id, function (user_record_id) {
        getAnswerAnket(user_record_id, function (arr) {
            var query = {start_date: { $lte : current_date}, end_date: { $gte: current_date }, public_status : "公開"};
            if(arr.length > 0){
                query =  {start_date: { $lte : current_date}, end_date: { $gte: current_date }, public_status : "公開", record_id : {$nin: arr}};
            }
            BiyoMasterAnket.find(query, {}, {sort: {start_date: 1}, limit: 10}, function(err, rows){
                if(rows && rows.length > 0){
                    remain_cnt = rows.length;
                    remain_result.text = remain_result.text.replace("anket_remain", remain_cnt);

                    var columns = [];
                    for(var i = 0; i < rows.length; i++){
                        var row = rows[i];
                        var start_date = row.start_date;
                        var end_date = row.end_date;
                        var formName = row.formName;
                        var liff_url = row.liff_url;
                        var point = row.point;
                        var result = {};
                        if(row.record_id != 8){
                            result.text = start_date + " ～ " + end_date + "\n獲得ポイント：" + point;
                        }else{
                            result.text = "獲得ポイント：" + point;
                        }
                        result.title = formName;
                        result.actions = [
                            {
                                "type" : "uri",
                                "label" : "アンケートを回答する",
                                "uri" : liff_url
                            }
                        ];
                        columns.push(result);
                    }

                    var message = [];
                    var carousel =  {
                        "type" : "template",
                        "altText" : "アンケートリスト",
                        "template" : {
                            "type" : "carousel",
                            "columns" : columns
                            //"imageAspectRatio": "square"
                        }
                    };
                    message.push(first_result);
                    message.push(remain_result);
                    message.push(carousel);
                    res.json({
                        message: message,
                        count: rows.length
                    });
                }else{
                    var message2 = [];
                    message2.push(first_result);
                    message2.push(no_result);
                    res.json({
                        message: message2,
                        count: 0
                    });
                }
            });
        });
    });

});

router.post('/getNewAnketBak', function(req, res, next){
    var body = req.body;
    console.log(body);
    var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD");
    var user_id = typeof body.user_id !== "undefined" ? body.user_id : "";
    var user_record_id = typeof body.user_record_id !== "undefined" ? body.user_record_id : "";

    var headers = {
        'X-Cybozu-API-Token' : inquiry_app_token
    };

    var no_result = {
        message: {
            "type": "text",
            "text": "未回答のアンケートはありません😊"
        },
        count: 0
    };

    getUserId(user_record_id, user_id, function (user_record_id) {
        getAnswerAnket(user_record_id, function (arr) {
            console.log(arr);
            var query = 'start_date <= "' + current_date + '" and end_date >= "' + current_date + '" and public_status in ("公開") order by start_date asc limit 10';
            if(arr.length > 0){
                query = 'start_date <= "' + current_date + '" and end_date >= "' + current_date + '" and public_status in ("公開") and レコード番号 not in (' + arr.join(",") + ')  order by start_date asc limit 10';
            }

            query = urlencode(query);
            console.log(query);
            var request_body = {
                uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + inquiry_app_id + "&query=" + query,
                headers: headers,
                method: "GET",
                json: true
            };
            console.log(request_body);
            request(request_body, function (error, response, body) {
                if (!error && response.statusCode == 200){
                    var totalCount = body.totalCount;
                    if(totalCount > 0){
                        var records = body.records;
                        var columns = [];
                        for(var i = 0; i < records.length; i++){
                            var row = records[i];
                            var start_date = row.start_date.value;
                            var end_date = row.end_date.value;
                            var formName = row.formName.value;
                            var liff_url = row.liff_url.value;
                            var point = parseInt(row.point.value);

                            var result = {};
                            //var  result = {
                            //    "thumbnailImageUrl" : row.CoverPicture1_azure_link.value
                            //};
                            result.text = start_date + " ～ " + end_date + "\n獲得ポイント：" + point;
                            result.title = formName;
                            result.actions = [
                                {
                                    "type" : "uri",
                                    "label" : "アンケートを回答する",
                                    "uri" : liff_url
                                }
                            ];
                            columns.push(result);
                        }

                        var message = [];
                        var carousel =  {
                            "type" : "template",
                            "altText" : "アンケートリスト",
                            "template" : {
                                "type" : "carousel",
                                "columns" : columns
                                //"imageAspectRatio": "square"
                            }
                        };
                        message.push(carousel);
                        res.json({
                            message: message,
                            count: totalCount
                        });

                    }else{
                        res.status(200).json(no_result);
                    }
                }else {
                    res.status(200).json(no_result);
                }
            });
        });
    });

});

router.post('/dsadas', function(req, res, next){
    //removeData(user_app_token, user_app_id);
    //removeData(point_app_token, point_app_id);
    //removeData(inquiry_history_app_token, inquiry_history_app_id);
    res.status(200).json({});
});

router.post('/webhookAsyncHistory', function(req, res, next){
    var body = req.body;
    console.log(body);
    var app = typeof body.app !== "undefined" ? body.app : "";
    var type = typeof body.type !== "undefined" ? body.type : "";
    var record =  typeof body.record !== "undefined" ? body.record : {};
    console.log(app, type);
    if(app){
        var app_id = app.id;
        console.log(app_id, type);
        if(app_id == inquiry_history_app_id){
            if(type == "DELETE_RECORD"){
                BiyoHistory.remove({record_id: body.recordId}, function(err) {
                });
            }else{
                var id = record["$id"].value;
                var user_id = record.user_id.value;
                var anket_master_id = record.anket_master_id.value;
                var last_update = record.LastUpdate.value;
                BiyoHistory.findOneAndUpdate({record_id: id}, {$set: {user_id: user_id, anket_master_id: anket_master_id, last_update: last_update}},
                    {upsert: true}, function (err, result) {
                        if (err) throw err;
                    });
            }
        }
    }
    res.status(200).json({});
});


router.post('/webhookAsyncAnswerAnket', function(req, res, next){
    var body = req.body;
    var app = typeof body.app !== "undefined" ? body.app : "";
    var type = typeof body.type !== "undefined" ? body.type : "";
    var record =  typeof body.record !== "undefined" ? body.record : {};
    console.log(app, type);
    if(app){
        var app_id = app.id;
        console.log(app_id, type);
        //console.log(record);
        if(type == "ADD_RECORD"){
            var record_line_id = record["$id"].value;
            var user_line_id = record.user_line_id.value;
            //saveAnswerFlg(app_id, user_line_id);
            saveAnswerFlgFromKintone(app_id, user_line_id);

            var headers = {
                'X-Cybozu-API-Token' : 'v0uerOENnLNTY9plZUIb6KSHz0pmtzPmSeCsqSBp'
            };
            var query = 'LINE_ID="' + user_line_id + '"' ;
            query = urlencode(query);
            var request_body = {
                uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=8&query=" + query,
                headers: headers,
                method: "GET",
                json: true
            };
            request(request_body, function (error, response, body) {
                if (!error && response.statusCode == 200){
                    var totalCount = body.totalCount;
                    console.log(totalCount);
                    if(totalCount > 0){
                        var rows = body.records;
                        var row = rows[0];
                        console.log(row);
                        var 種類 = row.種類.value;
                        var store_type = row.store_type.value;

                        var body_request3 = {
                            app: app_id,
                            id: record_line_id,
                            record: {
                                user_種類: {value : 種類},
                                user_業態: {value : store_type}
                            }
                        };
                        //console.log(body_request3);
                        var headers3 = {
                            'X-Cybozu-Authorization' : user_pass_b64,
                            'Content-type' : 'application/json'
                        };
                        request({
                            uri: 'https://jabs41.cybozu.com/k/v1/record.json',
                            method: 'PUT',
                            headers: headers3,
                            json: body_request3
                        }, function (error1, response, body2) {
                            console.log("body4", body2);
                        });
                    }
                }
            });
        }
    }
    res.status(200).json({});
});

router.post('/kifuPoint', function(req, res, next){
    var body = req.body;
    var user_id = typeof body.user_id !== "undefined" ? body.user_id : "";

    console.log("user_id", user_id);

    var no_result = {
        "type": "text",
        "text": "まだ会員登録手続きをされていません。"
    };

    var not_enough_point = {
        "type": "text",
        "text": "BIYOポイントは100未満です。"
    };

    var exist_kifu_point = {
        "type": "text",
        "text": "寄付受付完了しております。ご協力頂き誠にありがとうございます。寄付先が確定しましたらBIYOまたはJABSのWEBサイトにてご報告致します。"
    };

    var success_result = {
        "type": "text",
        "text": "寄付受付致しました❗️ご協力頂き誠にありがとうございます✨医療現場に必要な物資または現金を寄付致します🎁寄付先が確定しましたらBIYOまたはJABSのWEBサイトにてご報告致します。"
    };

    var headers = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var request_body = {
        uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + user_app_id + "&query=LINE_ID=" + '"' + user_id + '"',
        headers: headers,
        method: "GET",
        json: true
    };
    var response_message = [];

    request(request_body, function (error, response, body) {
        console.log("error=", error);
        //console.log("response.statusCode=", response.statusCode);
        //console.log(body.totalCount);
        console.log(body);
        if (!error && response.statusCode == 200){
            if(body.totalCount > 0){
                getKifuRecord(user_id, function (next) {
                    if(next){
                        var rows = body.records;
                        var record = rows[0];
                        var user_record_id = record["$id"].value;
                        var current_point = parseInt(record.current_point.value);
                        if(current_point >= 100){
                            response_message.push(success_result);
                            res.json({
                                message: response_message
                            });

                            //minus 100 point
                            request_body = {
                                app: user_app_id,
                                id: user_record_id,
                                record: {
                                    current_point: {value : (current_point - 100)}
                                }
                            };

                            headers = {
                                'X-Cybozu-API-Token' : user_app_token
                            };
                            request({
                                uri: 'https://jabs41.cybozu.com/k/v1/record.json',
                                method: 'PUT',
                                headers: headers,
                                json: request_body
                            }, function (error1, response, body2) {

                            });

                            //add 寄付ポイント
                            request_body = {
                                app: kifu_app_id,
                                record: {
                                    user_line_id: {value : user_id},
                                    寄付ポイント: {value : 100}
                                }
                            };

                            headers = {
                                'X-Cybozu-Authorization' : user_pass_b64,
                                'Content-type': 'application/json'
                            };
                            //add rent
                            request({
                                uri: 'https://jabs41.cybozu.com/k/v1/record.json',
                                method: 'POST',
                                headers: headers,
                                json: request_body
                            }, function (error1, response2, body2) {

                            });

                            //add history point
                            var update_time = moment().tz(TIMEZONE).format("YYYY-MM-DDTHH:mm:00Z");
                            request_body = {
                                app: point_app_id,
                                record: {
                                    UserID: {value : user_record_id},
                                    Change: {value : -100},
                                    Event: {value : "寄付ポイント"},
                                    Balance: {value :  (current_point - 100)},
                                    LastUpdate: {value : update_time}
                                }
                            };

                            headers = {
                                'X-Cybozu-API-Token' : point_app_token,
                                'Content-type': 'application/json'
                            };
                            //add rent
                            request({
                                uri: 'https://jabs41.cybozu.com/k/v1/record.json',
                                method: 'POST',
                                headers: headers,
                                json: request_body
                            }, function (error1, response2, body2) {

                            });
                        }else{
                            response_message.push(not_enough_point);
                            res.json({
                                message: response_message
                            });
                        }
                    }else{
                        response_message.push(exist_kifu_point);
                        res.json({
                            message: response_message
                        });
                    }
                });
            }else{
                response_message.push(no_result);
                res.json({
                    message: response_message
                });
            }
        }else {
            response_message.push(no_result);
            res.json({
                message: response_message
            });
        }
    });
});

function saveAnswerFlg(app_id, line_id){
    console.log("hhsaveAnswerFlg", app_id, line_id);
    var now = new Date();
    if(app_id == 9){
        MessageVariable.updateOne({
                connect_page_id: line_bot_id,
                user_id: line_id,
                variable_id: answer_9_flg_id
            }, {$set: {variable_value: "1", created_at: now, updated_at: now}},
            {upsert: true}, function (err) {

            });
    }else if(app_id == 24){
        MessageVariable.updateOne({
                connect_page_id: line_bot_id,
                user_id: line_id,
                variable_id: answer_24_flg_id
            }, {$set: {variable_value: "1", created_at: now, updated_at: now}},
            {upsert: true}, function (err) {

            });
    }
}

function saveAnswerFlgFromKintone(app_id, line_id){
    var variable_name = "answer_" + app_id + "_flg";
    console.log("saveAnswerFlgFromKintone", variable_name, app_id, line_id);

    var now = new Date();
    Variable.findOneAndUpdate({
        "connect_page_id" : line_bot_id,
        "variable_name" : variable_name
    }, {
        $set: {
            created_at: now,
            updated_at: now
        }
    }, {upsert: true, multi: false, new: true}, function (err, result) {
        MessageVariable.updateOne({
                connect_page_id: line_bot_id,
                user_id: line_id,
                variable_id: result._id
            }, {$set: {variable_value: "1", created_at: now, updated_at: now}},
            {upsert: true}, function (err) {

            });
    });
}

function saveDeletedFlg(app_id, line_id, deleted_flg){
    console.log("saveAnswerFlg");
    if(app_id == 9){
        var now = new Date();
        if(deleted_flg && deleted_flg.length > 0){
            MessageVariable.updateOne({
                    connect_page_id: line_bot_id,
                    user_id: line_id,
                    variable_id: deleted_flg_id
                }, {$set: {variable_value: 1, created_at: now, updated_at: now}},
                {upsert: true}, function (err) {

                });
        }else{
            MessageVariable.updateOne({
                    connect_page_id: line_bot_id,
                    user_id: line_id,
                    variable_id: deleted_flg_id
                }, {$set: {variable_value: 0, created_at: now, updated_at: now}},
                {upsert: true}, function (err) {

                });
        }

    }
}

//migrationAnketApp(9, 0);
function migrationAnketApp(app_id, index){
    console.log("migrationAnketApp");
    var headers = {
        'X-Cybozu-API-Token' : 'byiBvAOjrAseGYPneIHUdwsXoEQ6BylVjSjXeUV5'
    };

    var query = 'order by レコード番号 desc limit 500 offset ' + index*500;

    if(index == 0){
        query = 'order by レコード番号 desc limit 500';
    }
    query = urlencode(query);

    request({
        uri: 'https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=' + app_id + "&query=" + query,
        method: 'GET',
        headers: headers,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var rows = body.records;
            console.log(rows.length);
            if(rows.length > 0){
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    var user_line_id = row.user_line_id.value;
                    saveAnswerFlg(app_id, user_line_id);
                }
            }
        }
    });
}

//migrationAnketApp24(24, 0);
function migrationAnketApp24(app_id, index){
    console.log("migrationAnketApp24");
    var headers = {
        'X-Cybozu-API-Token' : 'FOTtm6taDMnNezZwY1I08mxWOlak31jdCbBTblYr'
    };

    var query = 'order by 更新日時 asc limit 500 offset ' + index*500;

    if(index == 0){
        query = 'order by 更新日時 asc limit 500';
    }
    query = urlencode(query);
console.log(query);
    request({
        uri: 'https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=' + app_id + "&query=" + query,
        method: 'GET',
        headers: headers,
        json: true
    }, function (error, response, body) {
        //console.log(body);
        if (!error && response.statusCode == 200){
            var rows = body.records;
            if(rows.length > 0){
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    var user_line_id = row.user_line_id.value;
                    saveAnswerFlg(app_id, user_line_id);
                }
            }
        }
    });
}


//migrationAnketApp24(38, 0);
function migrationAnketApp38(app_id, index){
    console.log("migrationAnketApp38");
    var headers = {
        'X-Cybozu-API-Token' : '37lp9H4Yi1KxAhOh0xNJyeqOSE0ScGhtAqtK9wXL'
    };

    var query = 'order by 更新日時 asc limit 500 offset ' + index*500;

    if(index == 0){
        query = 'order by 更新日時 asc limit 500';
    }
    query = urlencode(query);
    console.log(query);
    request({
        uri: 'https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=' + app_id + "&query=" + query,
        method: 'GET',
        headers: headers,
        json: true
    }, function (error, response, body) {
        //console.log(body);
        if (!error && response.statusCode == 200){
            var rows = body.records;
            if(rows.length > 0){
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    var user_line_id = row.user_line_id.value;
                    saveAnswerFlgFromKintone(app_id, user_line_id);
                }
            }
        }
    });
}

//migrationAnketApp45(45, 0);
function migrationAnketApp45(app_id, index){
    console.log("migrationAnketApp45");
    var headers = {
        'X-Cybozu-API-Token' : 'uYaCRO0toWjMGA9msrXbqwfgBtNMFhYSdrNjEOuy'
    };

    var query = 'order by 更新日時 asc limit 500 offset ' + index*500;

    if(index == 0){
        query = 'order by 更新日時 asc limit 500';
    }
    query = urlencode(query);
    console.log(query);
    request({
        uri: 'https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=' + app_id + "&query=" + query,
        method: 'GET',
        headers: headers,
        json: true
    }, function (error, response, body) {
        //console.log(body);
        //return;

        if (!error && response.statusCode == 200){
            var rows = body.records;
            //console.log("rows", rows.length);
            //return;
            if(rows.length > 0){
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    var user_line_id = row.user_line_id.value;
                    saveAnswerFlgFromKintone(app_id, user_line_id);
                }
            }
        }
    });
}

//migrationAnketApp39(39, 0);
function migrationAnketApp39(app_id, index){
    console.log("migrationAnketApp39");
    var headers = {
        'X-Cybozu-API-Token' : 'kw0jcXdYHLE1KPUAhBR1gkoIhuCTRQ3oclKxi8M2'
    };

    var query = 'order by 更新日時 asc limit 500 offset ' + index*500;

    if(index == 0){
        query = 'order by 更新日時 asc limit 500';
    }
    query = urlencode(query);
    console.log(query);
    request({
        uri: 'https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=' + app_id + "&query=" + query,
        method: 'GET',
        headers: headers,
        json: true
    }, function (error, response, body) {
        //console.log(body);
        if (!error && response.statusCode == 200){
            var rows = body.records;
            if(rows.length > 0){
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    var user_line_id = row.user_line_id.value;
                    saveAnswerFlgFromKintone(app_id, user_line_id);
                }
            }
        }
    });
}


//40
//migrationAnketApp40(40, 0);
function migrationAnketApp40(app_id, index){
    console.log("migrationAnketApp40");
    var headers = {
        'X-Cybozu-API-Token' : 'PaM3OyDspxigq4B2g2kC4JIQSgts5w8J1zhzqf42'
    };

    var query = 'order by 更新日時 asc limit 500 offset ' + index*500;

    if(index == 0){
        query = 'order by 更新日時 asc limit 500';
    }
    query = urlencode(query);
    console.log(query);
    request({
        uri: 'https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=' + app_id + "&query=" + query,
        method: 'GET',
        headers: headers,
        json: true
    }, function (error, response, body) {
        //console.log(body);
        if (!error && response.statusCode == 200){
            var rows = body.records;
            if(rows.length > 0){
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    var user_line_id = row.user_line_id.value;
                    saveAnswerFlgFromKintone(app_id, user_line_id);
                }
            }
        }
    });
}

router.post('/webhookAsyncUser', function(req, res, next){
    console.log("hailtwebhookAsyncUser");
    var body = req.body;
    var app = typeof body.app !== "undefined" ? body.app : "";
    var type = typeof body.type !== "undefined" ? body.type : "";
    var record =  typeof body.record !== "undefined" ? body.record : {};
    if(app){
        var app_id = app.id;
        if(app_id == user_app_id){
            if(type == "DELETE_RECORD"){
                BiyoUser.remove({record_id: body.recordId}, function(err) {
                });
                //for(var i = 0; i < variable_user_profile.length; i++){
                //    var variable_name = variable_user_profile[i];
                //    var variable_value = "";
                //    if(variable_name == "amazon_gift_flg"){
                //        variable_value = 0;
                //    }else if(variable_name == "user_record_id"){
                //        variable_value = -1;
                //    }
                //    console.log(variable_name, variable_value);
                //    updateMessageVariable(connect_page_id, line_id, variable_name, variable_value);
                //}
            }else{

                var id = record["$id"].value;
                var line_id = record.LINE_ID.value;
                var email = record.email.value;
                delete record["$id"];
                delete record["$revision"];
                console.log(record);
                //saveRegisterFlg(app_id, line_id);
                saveDeletedFlg(app_id, line_id, record.deleted_flg.value);
                BiyoUser.findOneAndUpdate({record_id: id}, {$set: {line_id: line_id, email: email, data: record}},
                    {upsert: true, multi: false, new: true}, function (err, user) {
                        console.log(err);
                        var result = {};
                        result.user_record_id = record.レコード番号.value;
                        result.last_name = record.姓.value;
                        result.first_name = record.名.value;
                        result.gender = record.性別.value;
                        result.birthday = record.生年月日.value;
                        result.email = record.email.value;
                        result.license = record.免許.value;

                        result.zipcode = toPostFmt(record.zipcode.value);
                        result.pref = record.都道府県.value;
                        result.city = record.市区町村.value;
                        result.stress = record.番地.value;
                        result.building = record.建物名.value;
                        result.type = record.種類.value.join(",");

                        result.current_point = parseInt(record.current_point.value);
                        result.status = record.status.value;
                        if(result.current_point >= 500){
                            result.amazon_gift_flg = 1;
                        }
                        result.salon_name =  record.salon_name.value;
                        result.staff_num =  record.staff_num.value;
                        result.gender_rate =record.gender_rate.value;
                        result.store_num = record.store_num.value;
                        result.area = record.area.value;
                        result.store_type = record.store_type.value.join(",");

                        var variable_value_arr = [];

                        variable_value_arr.push();

                        for(var i = 0; i < variable_user_profile.length; i++){
                            var variable_name = variable_user_profile[i];
                            var variable_value = typeof result[variable_name] !== "undefined" ? result[variable_name] : "";
                            console.log(variable_name, variable_value);
                            updateMessageVariable(connect_page_id, line_id, variable_name, variable_value);
                        }
                    });


            }
        }
    }
    res.status(200).json({});
});

function updateMessageVariable(connect_page_id, user_id, variable_name, variable_value){
    Variable.findOne({connect_page_id: connect_page_id, variable_name: variable_name}, function (err, result) {
        if (err) throw err;
        // console.log(result);
        if(result) {
            var now = new Date();
            MessageVariable.update({
                    connect_page_id: connect_page_id,
                    user_id: user_id,
                    variable_id: result._id
                }, {$set: {variable_value: variable_value, created_at: now, updated_at: now}},
                {upsert: true, multi: false}, function (err) {
                    if (err) throw err;
                });
        }else{
            console.log("error updateMessageVariable", variable_name, variable_value);
        }
    });
}

router.post('/webhookAsyncMasterAnket', function(req, res, next){
    var body = req.body;
    var app = typeof body.app !== "undefined" ? body.app : "";
    var type = typeof body.type !== "undefined" ? body.type : "";
    var record =  typeof body.record !== "undefined" ? body.record : {};
    if(app){
        var app_id = app.id;
        if(app_id == inquiry_app_id){
            if(type == "DELETE_RECORD"){
                BiyoMasterAnket.remove({record_id: body.recordId}, function(err) {
                });
            }else{
                var id = record["$id"].value;
                var start_date = record.start_date.value;
                var end_date = record.end_date.value;
                var campaign_flg = record.campaign_flg.value;
                var public_status = record.public_status.value;
                var liff_url = record.liff_url.value;
                var formName = record.formName.value;
                var point = 0;
                if(record.point && record.point.value){
                    point = parseInt(record.point.value);
                }
                delete record["$id"];
                delete record["$revision"];
                BiyoMasterAnket.findOneAndUpdate({record_id: id}, {$set: {formName: formName, start_date: start_date, end_date: end_date, campaign_flg: campaign_flg, public_status: public_status, point: point, liff_url: liff_url, data: record}},
                    {upsert: true}, function (err, result) {
                        if (err) throw err;
                    });
            }
        }
    }
    res.status(200).json({});
});

function removeData(app_token, app_id){
    var headers = {
        'X-Cybozu-API-Token' : app_token
    };
    var request_body = {
        uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + app_id,
        headers: headers,
        method: "GET",
        json: true
    };
    var result = {};
    request(request_body, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var totalCount = body.totalCount;
            if(totalCount > 0){
                var records = body.records;
                var ids = [];
                for(var i = 0; i < records.length; i++){
                    var row = records[i];
                    var user_record_id = row["$id"].value;
                    ids.push(user_record_id);
                }

                console.log(ids);
                var body_request3 = {
                    app: app_id,
                    ids: ids
                };
                var headers3 = {
                    'X-Cybozu-API-Token' : app_token
                };
                request({
                    uri: 'https://jabs41.cybozu.com/k/v1/records.json',
                    method: 'DELETE',
                    headers: headers3,
                    json: body_request3
                }, function (error1, response, body2) {
                    console.log(body2);
                });
            }

        }
    });
}

router.post('/getCampaignAnket', function(req, res, next){
    var body = req.body;
    var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD");
    var user_id = typeof body.user_id !== "undefined" ? body.user_id.trim() : "";
    var user_record_id = typeof body.user_record_id !== "undefined" ? body.user_record_id : "";

    getUserId(user_record_id, user_id, function (user_record_id) {
        var no_result = {
            message: {
                "type": "text",
                "text": "キャンペーンは現在実施しておりません😥キャンペーン実施時は、会員皆さまにお知らせしますので、楽しみにしててください✨🎉"
            },
            count: 0
        };

        getAnswerAnket(user_record_id, function (arr) {
            console.log(arr);
            var query = {start_date: { $lte : current_date}, end_date: { $gte: current_date }, public_status : "公開", campaign_flg : "Yes"};
            if(arr.length > 0){
                query =  {start_date: { $lte : current_date}, end_date: { $gte: current_date }, public_status : "公開", campaign_flg : "Yes", record_id : {$nin: arr}};
            }
            BiyoMasterAnket.find(query, {}, {sort: {start_date: 1}, limit: 10}, function(err, rows){
                if(rows && rows.length > 0){
                    var columns = [];
                    for(var i = 0; i < rows.length; i++){
                        var row = rows[i];
                        var start_date = row.start_date;
                        var end_date = row.end_date;
                        var formName = row.formName;
                        var liff_url = row.liff_url;
                        var point = row.point;
                        var result = {};
                        result.text = start_date + " ～ " + end_date + "\n獲得ポイント：" + point;
                        result.title = formName;
                        result.actions = [
                            {
                                "type" : "uri",
                                "label" : "アンケートを回答する",
                                "uri" : liff_url
                            }
                        ];
                        columns.push(result);
                    }

                    var message = [];
                    var carousel =  {
                        "type" : "template",
                        "altText" : "キャンペーン",
                        "template" : {
                            "type" : "carousel",
                            "columns" : columns
                            //"imageAspectRatio": "square"
                        }
                    };
                    message.push(carousel);
                    res.json({
                        message: message,
                        count: rows.length
                    });
                }else{
                    res.status(200).json(no_result);
                }
            });
        });
    });
});

router.post('/getCampaignAnketBak', function(req, res, next){
    var body = req.body;
    var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD");
    var user_id = typeof body.user_id !== "undefined" ? body.user_id.trim() : "";
    var user_record_id = typeof body.user_record_id !== "undefined" ? body.user_record_id : "";

    getUserId(user_record_id, user_id, function (user_record_id) {
        var headers = {
            'X-Cybozu-API-Token' : inquiry_app_token
        };
        var no_result = {
            message: {
                "type": "text",
                "text": "キャンペーンは現在実施しておりません😥キャンペーン実施時は、会員皆さまにお知らせしますので、楽しみにしててください✨🎉"
            },
            count: 0
        };

        getAnswerAnket(user_record_id, function (arr) {
            console.log(arr);
            var query = 'start_date <= "' + current_date + '" and end_date >= "' + current_date + '" and public_status in ("公開") and campaign_flg in ("Yes") order by start_date asc limit 10';
            if (arr.length > 0) {
                query = 'start_date <= "' + current_date + '" and end_date >= "' + current_date + '" and public_status in ("公開") and campaign_flg in ("Yes") and レコード番号 not in (' + arr.join(",") + ')  order by start_date asc limit 10';
            }
            query = urlencode(query);
            var request_body = {
                uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + inquiry_app_id + "&query=" + query,
                headers: headers,
                method: "GET",
                json: true
            };
            request(request_body, function (error, response, body) {
                if (!error && response.statusCode == 200){
                    var totalCount = body.totalCount;
                    if(totalCount > 0){
                        var records = body.records;
                        var columns = [];
                        for(var i = 0; i < records.length; i++){
                            var row = records[i];
                            var start_date = row.start_date.value;
                            var end_date = row.end_date.value;
                            var formName = row.formName.value;
                            var liff_url = row.liff_url.value;
                            var point = 0;
                            if(row.point.value){
                                point = row.point.value;
                            }
                            var result = {};
                            //var  result = {
                            //    "thumbnailImageUrl" : row.CoverPicture1_azure_link.value
                            //};
                            result.text = start_date + " ～ " + end_date + "\n獲得ポイント：" + point;
                            result.title = formName;
                            result.actions = [
                                {
                                    "type" : "uri",
                                    "label" : "アンケートを回答する",
                                    "uri" : liff_url
                                }
                            ];
                            columns.push(result);
                        }

                        var message = [];
                        var carousel =  {
                            "type" : "template",
                            "altText" : "キャンペーン",
                            "template" : {
                                "type" : "carousel",
                                "columns" : columns
                                //"imageAspectRatio": "square"
                            }
                        };
                        message.push(carousel);
                        res.json({
                            message: message,
                            count: totalCount
                        });

                    }else{
                        res.status(200).json(no_result);
                    }
                }else {
                    res.status(200).json(no_result);
                }
            });

        });
    });





});

router.post('/pushMessage', function(req, res, next){
    res.status(200).json({});
    var body = req.body;
    console.log("pushMessage=", body);
    var liff_user_id = body.liff_user_id;
    var line_token = body.line_token;
    var message = typeof body.message !== "undefined" ? body.message.trim() : line_message;
    console.log(message);
    var messageData = {
        to: liff_user_id,
        messages: [
            {
                "type":　"text",
                "text":　message
            }
        ]
    };
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + line_token
    };
    setTimeout(function() {
        request({
            uri: "https://api.line.me/v2/bot/message/push",
            method: 'POST',
            headers: headers,
            json: messageData
        }, function (error, response, body) {
            if(!error && response.statusCode == 200){

            }else{
                var msg = typeof body !== "undefined" ? body.message : "";
                pushChatwork("pushMessage " + msg + " " + body.user_id);
            }
            console.log(body);
        });
    }, 1200);


    if(body.setting_rich_menu == 1){
        var api_url = 'https://api.line.me/v2/bot/user/' + liff_user_id + '/richmenu/' + body.rich_menu_id;
        var headers2 = {
            'Authorization': 'Bearer ' + line_token
        };
        request({
            uri: api_url,
            method: 'POST',
            headers: headers2
        }, function (error, response, body) {
            console.log('body response', body);
        });
    }
});

router.post('/anketConfirm', function(req, res, next){
    var body = req.body;
    console.log("anketConfirm=", body);
    var data = [];
    var index = 0;

    for (var key in body) {
        var value = typeof body[key] !== "undefined" ? body[key] : "";
        if(key == "inquiry_master_id" || key == "session"){
            continue;
        }
        else if(key.indexOf("_") !== -1){
            if(value.length > 0){
                if(index > 0){
                    data[index -1] = data[index -1] + " " + value;
                }
                //data.push(key + "：" + value);
            }
        }else{
            data.push(key + "：" + value);
            index++;
        }
    }
    console.log( {
        template_type: '002',
        data: data.join("\n")
    });
    res.status(200).json(  {
        template_type: '002',
        data: data.join("\n")
    });
});


function base64Encode(string, default_value) {
    //encode base 64
    if(string != void 0 && string != '') {
        string = string.replace(/[\\]/g, '');
        return Buffer.from(string).toString('base64');
    } else {
        if(default_value == void 0) {
            default_value = '';
        }
        return default_value;
    }
}
var encode = function(value){
    var buffer = new Buffer(value);
    var encoded = buffer.toString('base64');
    return encoded;
};

function toPostFmt(text){
    if(typeof text !== "undefined" && text.length >= 7){
        text = text.substr(0,7);
        var h = text.substr(0,3);
        var m = text.substr(3);
        text = h + "-" + m;
    }
    return text;
}

//migrationRegisterApp(8, 0);
function migrationRegisterApp(app_id, index){
    console.log("migrationRegisterApp");
    var headers = {
        'X-Cybozu-API-Token' : 'v0uerOENnLNTY9plZUIb6KSHz0pmtzPmSeCsqSBp'
    };

    var query = 'order by レコード番号 desc limit 500 offset ' + index*500;

    if(index == 0){
        query = 'order by レコード番号 desc limit 500';
    }
    query = urlencode(query);

    request({
        uri: 'https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=' + app_id + "&query=" + query,
        method: 'GET',
        headers: headers,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var rows = body.records;
            if(rows.length > 0){
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    var user_line_id = row.LINE_ID.value;
                    saveRegisterFlg(app_id, user_line_id);
                }
            }
        }
    });
}

function saveRegisterFlg(app_id, line_id){
    console.log("hailthailtsaveRegisterFlg", line_id);
    if(app_id == 8){
        var now = new Date();
        console.log(line_id);
        MessageVariable.updateOne({
                connect_page_id: line_bot_id,
                user_id: line_id,
                variable_id: register_flg_id
            }, {$set: {variable_value: "1", updated_at: now}},
            {upsert: true}, function (err) {

            });
    }
}

function saveLicenseFlg(app_id, line_id, value){
    console.log("saveLicenseFlg", line_id);
    if(app_id == 8){
        var now = new Date();
        //console.log(line_id);
        MessageVariable.updateOne({
                connect_page_id: line_bot_id,
                user_id: line_id,
                variable_id: license_flg
            }, {$set: {variable_value: value, updated_at: now}},
            {upsert: true}, function (err) {

            });
    }
}


var user_list_new = [];
var push_user_id_no_register = [];
var push_user_no_anket = [];

//getAllUserNoRegister(register_flg_id);
//getNoAnswerUserId(answer_9_flg_id);

function getNoAnswerUserId(variable_id){
    user_list_new = [];
    UserProfile.find({"connect_page_id" : line_bot_id}, function(err, users) {
        //CustomDrillUser.find({is_pass: {$ne: 1}, is_finish : {$ne: 1},push_status: null}, {}, {skip: 0, limit: 100, sort: {_id : 1}}, function(err, users) {
        //console.log('rows.length', users.length);
        if(users && users.length > 0){
            var index = 0;
            var y;
            user_list_new = users;
            getUserNoStatus2(index, variable_id, y = function (next) {
                if(next){
                    //console.log("index=", index);
                    getUserNoStatus2(++index, variable_id, y);
                }else{
                    console.log("push user push_user_no_anket", push_user_no_anket.length);

                    var cnt = Math.ceil(push_user_no_anket.length / LINE_MAX_USER_PUSH);
                    //cnt = 1;
                    for(var i = 0; i < cnt; i++){
                        var multicast_user_ids = push_user_no_anket.slice(i * LINE_MAX_USER_PUSH, (i*LINE_MAX_USER_PUSH) + LINE_MAX_USER_PUSH);
                        //multicast_user_ids = ["U10be05b7af9e8485fe573b978f94481f"];
                        setTimeout(function(index, list) {
                            console.log("push index", index);
                            //callSendLineMulticastAPI(list, message_data_push_no_anket);
                        }, i * 5000, i, multicast_user_ids);
                    }
                }
            });
        }
    });
}

function getAllUserNoRegister(variable_id){
    user_list_new = [];
    UserProfile.find({"connect_page_id" : line_bot_id}, function(err, users) {
        //CustomDrillUser.find({is_pass: {$ne: 1}, is_finish : {$ne: 1},push_status: null}, {}, {skip: 0, limit: 100, sort: {_id : 1}}, function(err, users) {
        //console.log('rows.length', users.length);
        if(users && users.length > 0){
            var index = 0;
            var y;
            user_list_new = users;
            getUserNotRegister(index, variable_id, y = function (next) {
                if(next){
                    //console.log("index=", index);
                    getUserNotRegister(++index, variable_id, y);
                }else{
                    console.log("push user push_user_id_no_register", push_user_id_no_register.length);

                    var cnt = Math.ceil(push_user_id_no_register.length / LINE_MAX_USER_PUSH);
                    //cnt = 1;
                    for(var i = 0; i < cnt; i++){
                        var multicast_user_ids = push_user_id_no_register.slice(i * LINE_MAX_USER_PUSH, (i*LINE_MAX_USER_PUSH) + LINE_MAX_USER_PUSH);
                        //multicast_user_ids = ["U10be05b7af9e8485fe573b978f94481f"];
                        setTimeout(function(index, list) {
                            console.log("push index", index);
                            //callSendLineMulticastAPI(list, message_data_push_no_register);
                        }, i * 5000, i, multicast_user_ids);
                    }
                }
            });
        }
    });
}

function getKifuRecord(line_id, callback){
    var headers = {
        'X-Cybozu-API-Token' : kifu_app_token
    };
    request({
        uri: "https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=" + kifu_app_id + "&query=LINE_ID=" + '"' + line_id + '"',
        method: 'GET',
        headers: headers,
        json: true
    }, function (error, response, body) {
        console.log(error, body);
        if (!error && response.statusCode == 200){
            var rows = body.records;
            if(rows.length > 0){
                return callback(false);
            }else {
                return callback(true);
            }
        }else{
            return callback(true);
        }
    });
}

function getUserNoStatus2(index, variable_id, callback){
    if(user_list_new && user_list_new[index]) {
        var user = user_list_new[index];
        var user_id = user.user_id;
        MessageVariable.findOne({"connect_page_id" : line_bot_id, user_id: user_id, variable_id: variable_id}, function(err, row) {
            if(row){
                return callback(true);
            }else{
                MessageVariable.findOne({"connect_page_id" : line_bot_id, user_id: user_id, variable_id: register_flg_id}, function(err, row2) {
                    if(row2){
                        push_user_no_anket.push(user_id);
                    }else{

                    }
                    return callback(true);
                });
            }
        });
    }else{
        return callback(false);
    }
}

function getUserNotRegister(index, variable_id, callback){
    if(user_list_new && user_list_new[index]) {
        var user = user_list_new[index];
        var user_id = user.user_id;
        MessageVariable.findOne({"connect_page_id" : line_bot_id, user_id: user_id, variable_id: variable_id}, function(err, row) {
            if(row){

            }else{
                push_user_id_no_register.push(user_id);
            }
            return callback(true);
        });
    }else{
        return callback(false);
    }
}


const message_data_push_no_register = [
    {
        "type" : "text",
        "text" : "LINE@BIYOの友達登録ありがとうございます。BIYOは美容師や美容業界に携わる方の声を集めるLINE公式アカウントです。BIYOは入会・年会費無料です。"
    },
    {
        "type" : "template",
        "altText" : "登録開始",
        "template" : {
            "type" : "buttons",
            "text" : "BIYOに会員登録して、アンケートに答えるとポイントがもらえます。ポイントをギフト券と交換しましょう！",
            "actions" : [
                {
                    "type" : "uri",
                    "label" : "登録開始",
                    "uri" : "line://app/1568632507-LN0EEQzP"
                }
            ]
        }
    }
];

const message_data_push_no_anket = [
    {
        "type" : "text",
        "text" : "BIYOのご登録ありがとうございます。まだ未回答のアンケートがあります。回答いただいた会員さまには、BIYOポイントプレゼントしてます🎁 ぜひアンケートにお答えください。よろしくお願いします‼️"
    }
];

//callSendLineMulticastAPI();
function callSendLineMulticastAPI(list, message_data) {
    var messageData = {
        to: list,
        messages: message_data
    };

    var headers = {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + line_page_access_token
    };
    request({
        uri: "https://api.line.me/v2/bot/message/multicast",
        method: 'POST',
        headers: headers,
        json: messageData
    }, function (error, response, body) {
        console.log(error, body);
    });
}

//migrationLicenseApp(8, 0);
function migrationLicenseApp(app_id, index){
    console.log("migrationLicenseApp");
    var headers = {
        'X-Cybozu-API-Token' : 'v0uerOENnLNTY9plZUIb6KSHz0pmtzPmSeCsqSBp'
    };

    var query = 'order by レコード番号 desc limit 500 offset ' + index*500;

    if(index == 0){
        query = 'order by レコード番号 desc limit 500';
    }
    query = urlencode(query);

    request({
        uri: 'https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=' + app_id + "&query=" + query,
        method: 'GET',
        headers: headers,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var rows = body.records;
            if(rows.length > 0){
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    var user_line_id = row.LINE_ID.value;
                    var license = row.免許.value;
                    if(license == "有り"){
                        saveLicenseFlg(8, user_line_id, "1");
                    }else{
                        saveLicenseFlg(8, user_line_id, "0");
                    }
                }
            }
        }
    });
}

//fixPointRegister(0);
function fixPointRegister(index){
    console.log("fixPointRegister");
    var headers = {
        'X-Cybozu-API-Token' : user_app_token
    };

    var query = 'order by $id desc limit 500 offset ' + index*500;

    if(index == 0){
        query = 'order by $id desc limit 500';
    }
    query = urlencode(query);

    request({
        uri: 'https://jabs41.cybozu.com/k/v1/records.json?totalCount=true&app=' + user_app_id + "&query=" + query,
        method: 'GET',
        headers: headers,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var rows = body.records;
            if(rows.length > 0){
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    setTimeout(function(row1) {

                        var user_line_id = row1.LINE_ID.value;
                        var user_record_id = row1["$id"].value;
                        //1112
                        if(parseInt(user_record_id) >= 1124){
                            var current_point = 100;
                            if(row1.current_point.value){
                                current_point += parseInt(row1.current_point.value);
                            }
                            var body_request3 = {
                                app: user_app_id,
                                id: user_record_id,
                                record: {
                                    current_point: {value : current_point}
                                }
                            };
                            console.log(body_request3);
                            var headers3 = {
                                'X-Cybozu-API-Token' : user_app_token
                            };
                            request({
                                uri: 'https://jabs41.cybozu.com/k/v1/record.json',
                                method: 'PUT',
                                headers: headers3,
                                json: body_request3
                            }, function (error1, response, body2) {
                                console.log("user_app_id", body2);
                            });
                            //break;
                        }
                    }, i*1000, row);


                }
            }
        }
    });
}

var header_chatwork = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-ChatWorkToken': "a92f92b38d175f3cd2985829e38af252"
};

function pushChatwork(msg){
    request.post({url: pushMessageToChatwork, form: {
        body: "[To:2167578] " +
        "\n " + msg
    },
        headers: header_chatwork,  method: 'POST'}, function (error, response, body){
        if (!error && response.statusCode == 200) {
        }else{
            console.log(body);
        }
    });
}
module.exports = router;
