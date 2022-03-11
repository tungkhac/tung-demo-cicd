// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
const Zipcode = model.Zipcode;
const Scenario = model.Scenario;
const BotMessage = model.BotMessage;
const UserProfile = model.UserProfile;
const Variable = model.Variable;
const MessageVariable = model.MessageVariable;
var LogChatMessage = model.LogChatMessage;

const config = require('config');
var azure = require('azure-storage');
var moment = require('moment-timezone');
const request = require('request');
var urlencode = require('urlencode');
const fs      = require('fs');
var container = "matchwatchprod";
var blobServiceImage = azure.createBlobService(config.get('azure_connectstring'));
const AZURE_STORAGE_URL = 'https://' + config.get('azure_storage_name') + '.blob.core.windows.net/matchwatchprod' + container;
var emailValidator = require("email-validator");

const currencyFormatter = require('currency-formatter');

const user_app_id = 48;
const user_app_token = "v6TIPIQGXnbX1ENFjl66XLO3sdIMfvlsY6r1OCOX";
const model_app_id = 42;
const model_app_token = "T7rpWWaId1Gki8rTEdbrpZTXHIRQii0IuxSw0AN9";
const profile_app_id = 43;
const profile_app_token = "P1mp9pJrOvXO4QDlOtQIxxUvM4HoqXqQabl5ZWai";
const favorite_app_id = 53;
const favorite_app_token = "7x7O8LNYQIKkp36RIKOFaGqvCAu5ofS1mnAoja78";

const brand_app_id = 41;
const brand_app_token = "nDsbBlMp2iXmOgdmeoX5A7Usv1OSspb1yGTNLPCe";

const watch_state_app_id = 44;
const watch_state_app_token = "NP1iN5fc5HnCp1wgkt2YGBNdzGyRpvMVu7ESXpIN";

const rent_app_id = 52;
const rent_app_token = "hk0DanSoc5JyCfyUETj3UgygENm0l2fIFsyqN6qF";

const borrower_insurance_app_id = 49;
const borrower_insurance_app_token = "wrrll7sobCQL1K9JbjeusUqwuUh5kE3cOvtmymLV";

const auth_log_app_id = 50;
const auth_log_app_token = "oZsc0JtaEGai0QYJC4ubmOvbsOoIGZI0vmlMRHaj";

const preference_app_id = 54;
const preference_app_token = "5u1ZJiYvhySbxxHFZNAGpYu1FNeQUfPZyZD38KIu";

const point_app_id = 51;
const point_app_token = "jdTppXlAhVJptborUMKxEuLPVX1r26oDX5l5470X";

const queue_app_id = 59;
const queue_app_token = "NKHdBw8ASxPcib3h5AV3RJRizmMYhBS6mEvru3Jx";

const bot_id = "5d1e0914a24a61366b601547";
//const bot_id = "5ac2d9519a8920796d40004a";

const line_access_token = "Txq4atxOtvreoVFMcPH6sIB08ALYrcN/RJ//JEm9B1ZyfHt2I8dMBpHATbnpLYuAoztL6aGJ/TON+DmZ2R7MzYERd74OjChW6SRF7UXc4ritoP9JTx5em0jHi3/OdhRJe6tcd5AaZ41SL/Yom02Z6gdB04t89/1O/w1cDnyilFU=";
const default_variable = ["liff_user_id", "liff_user_display_name", "user_browser", "user_agent", "current_url_param", "user_screen_name", "user_name", "cv_datetime", "current_url_title", "user_device", "user_ip_address", "user_country", "user_city", "current_url", "user_first_name", "user_last_name", "user_full_name", "user_gender", "user_locale", "user_timezone", "user_referral", "user_address", "user_lat", "user_long", "user_display_name", "user_id", "preview_flg", "ref", "user_referer_current", "user_referer_firstopen", "user_token"];
const
    LINE_USER_TEXT = "001",
    LINE_USER_IMAGE = "002",
    LINE_USER_STICKER = "003",
    LINE_USER_LOCATION =  "004",
    LINE_USER_VIDEO =  "005",
    SLOT_ACTION_SCENARIO = "001",
    SLOT_ACTION_API = "002",
    SLOT_ACTION_MAIL = "003",
    API_TYPE_DIRECT = "001",
    API_TYPE_VARIABLE = "002",
    MESSAGE_USER_TEXT = "001",
    MESSAGE_USER_PAYLOAD = "003",
    MESSAGE_USER_ATTACHMENT = "004",
    USER_TYPE = 1,
    BOT_TYPE = 2,
    SNS_TYPE_FACEBOOK = '001',
    SNS_TYPE_LINE = '002',
    SNS_TYPE_WEBCHAT = '005',
    SNS_TYPE_EFO = '006',
    SNS_TYPE_CHATWORK = '007',
    SNS_TYPE_TWITTER = '008',
    MESSAGE_USER = '001',
    MESSAGE_BOT = '002',
    USER_TYPE_TEXT = "001",
    USER_TYPE_LIBRARY = "002",
    USER_TYPE_API = "003",
    FB_PUSH_MESSAGE_FILTER_VARIABLE = '001',
    FB_PUSH_MESSAGE_FILTER_EXECUTED_SCENARIO = '002',
    FB_PUSH_MESSAGE_FILTER_EXITED_SCENARIO = '003',
    FB_PUSH_MESSAGE_FILTER_CAMPAIGN = '004',
    BOT_TYPE_ATTACHMENT = "004",
    BOT_TYPE_QUICK_REPLIES = "005",
    BOT_TYPE_CHECKBOX_WC = "009",
    BOT_TYPE_QUICK_REPLIES_LINE = "030",
    BOT_TYPE_API = "006",
    BOT_TYPE_SCENARIO = "007",
    BOT_TYPE_TEXT = "001",
    BOT_TYPE_BUTTON = "002",
    BOT_TYPE_GENERIC = "003",
    BOT_TYPE_UPLOAD = "008",
    BOT_TYPE_STICKER = "009",
    BOT_TYPE_MAIL = "020",
    LIBRARY_TEXT = "001",
    LIBRARY_SCENARIO = "002",
    MENU_TYPE_URL = "1",
    MENU_TYPE_SCENARIO = "2",
    MENU_TYPE_SUBMENU = "3",


    EFO_USER_INPUT_TEXT = "002",
    EFO_USER_INPUT_TEXTAREA = "003",
    EFO_USER_RADIO_BUTTON = "004",
    EFO_USER_CHECKBOX = "005",
    EFO_USER_PULLDOWN = "006",
    EFO_USER_POSTAL_CODE = "007",
    EFO_USER_FILE = "008",
    EFO_USER_CALENDAR = "009",
    EFO_USER_TERMS = "010",
    EFO_USER_CAROUSEL = "012",
    EFO_USER_CREDITCARD = "013",
    EFO_USER_PRODUCT_LIST = "017",
    EFO_USER_PULLDOWN_PREF = "111",
    EFO_USER_PULLDOWN_STATION = "112",
    EFO_USER_PIN_CODE_AUTH = "020",
    EFO_BOT_TEXT = "001",
    EFO_BOT_FILE = "002",
    EFO_BOT_MAIL = "003",
    EFO_BOT_API = "005",
    EFO_BOT_SCRIPT = "006",
    EFO_BOT_DELAY = "100",
    EFO_BOT_BUTTON_LINK = "111",

    CALENDAR_TYPE_INPUT = "001",
    CALENDAR_TYPE_EMBED = "002",
    CALENDAR_TYPE_PERIOD = "003";

const TIMEZONE = config.get('timezone');

const next_image = "https://app2.blob.core.windows.net/botchan2/plus-circle-solid.svg";
var fileType = require('file-type');

const api_new_list_url = "https://app-prod.matchwatch.jp/api/v1/new_list";

const  rentStatus = {
    "Requested": "承認待ち",
    "InRent": "貸出中",
    "Rejected": "却下済み",
    "Returned": "返却済み"
};

router.post('/webhookAsyncQueue', function(req, res, next){
    var body = req.body;
    console.log(body);
    var app = typeof body.app !== "undefined" ? body.app : "";
    var type = typeof body.type !== "undefined" ? body.type : "";
    var record =  typeof body.record !== "undefined" ? body.record : {};
    console.log(app, type);
    if(app){
        var app_id = app.id;
        console.log(app_id, type);
        if(app_id == queue_app_id){
            if(type == "DELETE_RECORD"){

            }else{
                var id = record["$id"].value;
                //var UserID = record.UserID.value;
                var LINE_ID = record.LINE_ID.value;
                var ScenarioID = record.ScenarioID.value;
                var Status = record.Status.value;
                console.log(Status, ScenarioID, LINE_ID);
                //Status == "Processing"
                if(Status == "Processing"){
                    if(mongoose.Types.ObjectId.isValid(ScenarioID)){
                        Scenario.findOne({_id: ScenarioID, connect_page_id: bot_id, deleted_at: null}, function(err, result) {
                            console.log(result);
                            if(result){
                                var new_position = 0;
                                BotMessage.find({scenario_id: result.id, message_type: MESSAGE_BOT, position: {$gte: new_position}, deleted_at: null}, {}, {sort: {position: 1}}, function(err, result) {
                                    if(result && result.length > 0 && result[0].position == new_position){
                                        //sendBroadcastMessage(row, scenarioResult, botResult, result);
                                        var system_param = createParameterDefault(SNS_TYPE_LINE, bot_id, LINE_ID, ScenarioID);
                                        system_param.record_id = id;
                                        sendMultiMessageLine(system_param, result, 0);
                                    }else{
                                        updateStatusPush(id, "Failed");
                                    }
                                });
                            }else{
                                updateStatusPush(id, "Failed");
                            }
                        });
                    }else{
                        updateStatusPush(id, "Failed");
                    }
                }
            }
        }
    }
    res.status(200).json({});
});

function updateStatusPush(record_id, status){
    var body_request1 = {
        app: queue_app_id,
        id: record_id,
        record: {
            Status: {value : status}
        }
    };
    var headers1 = {
        'X-Cybozu-API-Token' : queue_app_token,
        'Content-type': 'application/json'
    };
    request({
        uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
        method: 'PUT',
        headers: headers1,
        json: body_request1
    }, function (error1, response, body2) {
    });
}

function callSendLinePushAPI(params, messageData) {
    console.log(messageData);
    var headers = {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + line_access_token
    };
    console.log(headers);
    request({
        uri: "https://api.line.me/v2/bot/message/push",
        method: 'POST',
        headers: headers,
        json: messageData
    }, function (error, response, body) {
        console.log(body);
        console.log("response.statusCode", response.statusCode);
        if (!error && response.statusCode == 200) {
            saveLogChatMessage(params, "001", BOT_TYPE, messageData.messages, new Date());
            updateStatusPush(params.record_id, "Sent");
        } else {
            updateStatusPush(params.record_id, "Failed");
            saveLogChatMessage(params, "001", BOT_TYPE, messageData.messages, new Date(), '', 1, body);
        }
    });
}

function saveLogChatMessage(params, message_type, type, message, time_of_message, payload, error_flg, error_message){
    var now = new Date();
    var insert_data = {
        connect_page_id: params.connect_page_id + "",
        page_id: params.page_id,
        user_id: params.user_id,
        scenario_id: params.current_scenario_id,
        message_type: message_type,
        type: type,
        message: message,
        input_requiment_flg:  (( typeof params.input_requiment_flg !== 'undefined') ? params.input_requiment_flg : undefined),
        time_of_message: time_of_message,
        payload:  (( typeof payload !== 'undefined') ? payload : ''),
        error_flg: error_flg,
        background_flg: (message_type == BOT_TYPE_MAIL) ? 1 : params.background_flg,
        user_said: ((typeof params.user_said !== 'undefined') ? params.user_said : undefined),
        bid: ((typeof params.bid !== 'undefined') ? params.bid : undefined),
        b_position: ((typeof params.b_position    !== 'undefined') ? params.b_position : undefined),
        error_message: error_message,
        btn_next: ((typeof params.btn_next !== 'undefined') ? params.btn_next : undefined),
        created_at : now,
        updated_at : now
    };
    params.background_flg = undefined;
    logChatMessage = new LogChatMessage(insert_data);
    if(params.sns_type == SNS_TYPE_LINE){
        if(type == USER_TYPE){
            logChatMessage.time_of_message2 = time_of_message;
        }else{
            logChatMessage.time_of_message2 = Date.now();
        }
    }
    logChatMessage.save(function(err) {
    });

}

function sendMultiMessageLine(params, data, new_position, messages){
    var msg_arr = getBotMessage(data, new_position);
    if(msg_arr.length == 0){
        updateStatusPush(params.record_id, "Failed");
        return;
    }
    getAllVariableValue(params, function (err, result1) {
        if (!err) {
            if(!messages){
                messages = [];
            }
            params.user_variable = result1.variable_result;
            params.preview_flg = result1.preview_flg;
            for (var i=0; i < msg_arr.length; i++) {
                if(messages.length == 5) break;
                var msg = msg_arr[i];
                var row = msg.data[0];
                if(row.type == BOT_TYPE_TEXT){
                    if(row.message && row.message.text){
                        row.message.text = variableTextToValue(row.message.text, params.user_variable);
                        messages.push(
                            row.message
                        );
                    }
                }else if(row.type == BOT_TYPE_API){

                }
                else if(row.type == BOT_TYPE_SCENARIO){

                }else if(row.type == BOT_TYPE_MAIL){

                }
                //confirm
                else if(row.type == BOT_TYPE_QUICK_REPLIES || row.type == BOT_TYPE_QUICK_REPLIES_LINE){
                    var message = row.message;
                    if (row.type == BOT_TYPE_QUICK_REPLIES_LINE) {
                        message = convertMessageQuickRepliesLineFormat(row.message, params.user_variable);
                    }
                    messages.push(
                        message
                    );
                }
                else if(row.type == BOT_TYPE_GENERIC){
                    messages.push(
                        row.message
                    );
                }
                else{
                    messages.push(
                        row.message
                    );
                }
            }
            if(messages.length > 0){
                messageData = {
                    to: params.user_id,
                    messages: messages
                };
                console.log(messageData);
                console.log(params);
                callSendLinePushAPI(params, messageData);
            }else{
                updateStatusPush(params.record_id, "Failed");
            }
        }});
}

function convertMessageQuickRepliesLineFormat(message, user_variable) {
    var result = {};
    if (message !== void 0 && message !== null) {
        if (message.text !== void 0 && message.text !== null) {
            result.type = 'text';
            result.text = variableTextToValue(message.text, user_variable);
        }

        if (message.quick_replies !== void 0 && message.quick_replies !== null && message.quick_replies.length) {
            var quickReply = [];
            message.quick_replies.forEach(function (quick_reply) {
                if (quick_reply.content_type === 'text') {
                    var is_post_back_message = false;
                    // Check if payload have scenario_id for next scenario => is post back message
                    if (quick_reply.payload !== void 0 && quick_reply.payload !== null && quick_reply.payload !== '') {
                        var current_payload = quick_reply.payload.replace(/BQUICK_REPLIES_/g, "");
                        var arr_index = current_payload.split("_");
                        if(arr_index[1] !== undefined && parseInt(arr_index[1]) != -1 && mongoose.Types.ObjectId.isValid(arr_index[1])){
                            is_post_back_message = true;
                        }
                    }

                    var push_message = {};
                    if (is_post_back_message) {
                        push_message = {
                            type: 'action',
                            action: {
                                type: "postback",
                                label: variableTextToValue(quick_reply.title, user_variable),
                                data: quick_reply.payload,
                                displayText: variableTextToValue(quick_reply.displayText, user_variable)
                            }
                        };
                    } else {
                        push_message = {
                            type: 'action',
                            action: {
                                type: 'message',
                                label: variableTextToValue(quick_reply.title, user_variable),
                                text: variableTextToValue(quick_reply.text, user_variable),
                                displayText: variableTextToValue(quick_reply.displayText, user_variable)
                            }
                        };
                    }

                    // If message have icon
                    if (quick_reply.image_url !== void 0 && quick_reply.image_url !== null && quick_reply.image_url !== '') {
                        push_message.imageUrl = quick_reply.image_url;
                    }

                    quickReply.push(push_message);
                } else if (quick_reply.content_type === 'location') {
                    quickReply.push({
                        type: 'action',
                        action: {
                            type: "location",
                            label: variableTextToValue(quick_reply.title, user_variable)
                        }
                    });
                } else if (quick_reply.content_type === 'camera') {
                    quickReply.push({
                        type: 'action',
                        action: {
                            type: "camera",
                            label: variableTextToValue(quick_reply.title, user_variable)
                        }
                    });
                } else if (quick_reply.content_type === 'camera_roll') {
                    quickReply.push({
                        type: 'action',
                        action: {
                            type: "cameraRoll",
                            label: variableTextToValue(quick_reply.title, user_variable)
                        }
                    });
                }
            });

            if (quickReply.length) {
                result.quickReply = {
                    items: quickReply
                };
            }
        }
    }

    return result;
}

function variableTextToValue(text, variable_arr){
    ////console.log("variableTextToValue");
    if(!text || typeof text === "undefined" || text.length == 0){
        return '';
    }
    for(var variable in variable_arr){
        var tmp = "{{" + variable + "}}";
        text = text.replace(new RegExp(preg_quote(tmp), 'g'), variable_arr[variable]);
    }
    text = text.replace(/\{\{[^\}]+\}\}/gi, '');
    return text;
}

function preg_quote (str, delimiter) {
    // Quote regular expression characters plus an optional character
    //
    // version: 1107.2516
    // discuss at: http://phpjs.org/functions/preg_quote
    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

function getAllVariableValue(params, callback) {
    var preview_flg = undefined;
    var variable_result = [];
    var user_token = '';
    UserProfile.findOne({connect_page_id: params.connect_page_id, user_id:  params.user_id}, function(err, result) {
        if (err) throw err;
        if (result) {
            preview_flg = result.preview_flg;
            user_token = result.user_token;
            default_variable.forEach(function (variable) {
                if (result[variable]) {
                    variable_result[variable] =  result[variable];
                }
            });
        }
        Variable.find({connect_page_id: params.connect_page_id}, function(err, result) {
            if (err) throw err;
            if (result && result.length > 0) {
                var variable_id_arr = [];
                for (var i=0, size = result.length; i < size; i++) {
                    variable_id_arr[result[i]._id] = result[i].variable_name;
                }
                MessageVariable.find({ connect_page_id: params.connect_page_id, user_id:  params.user_id}, function(err, result) {
                    if (err) throw err;
                    if (result && result.length > 0) {
                        for (var i=0, size = result.length; i < size; i++) {
                            var variable = variable_id_arr[result[i].variable_id];
                            variable_result[variable] = result[i].variable_value;
                            var tmp_variable = result[i].variable_value;
                            if(tmp_variable instanceof Array){
                                tmp_variable = arrayUnique(tmp_variable);
                            }
                            variable_result[result[i].variable_id] = tmp_variable;
                        }
                    }
                    return callback(null, {"variable_result" : variable_result, "preview_flg" : preview_flg, "user_token" : user_token});
                });
            }else{
                return callback(null, {"variable_result" : variable_result, "preview_flg" : preview_flg, "user_token" : user_token});
            }
        });
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

function getBotMessage(data, position){
    var msg_arr =[];
    if (data !== void 0) {
        var size = data.length;
        //console.log(data);
        for (var i=0; i < size; i++) {
            var msg = data[i];
            if(msg.position != position){
                break;
            }
            position++;
            msg_arr.push(msg);
        }
    }

    return msg_arr;
}

function createParameterDefault(sns_type, connect_page_id, user_id, current_scenario_id){
    var params = {};
    params.sns_type = sns_type;
    params.connect_page_id = connect_page_id;
    params.user_id = user_id;
    params.current_scenario_id = current_scenario_id;
    return params;
}

/* GET home page. */
router.post('/validateNickname', function(req, res, next){
    var body = req.body;
    var nickname = typeof body.nickname !== "undefined" ? body.nickname.trim() : "";
    var headers = {
        'X-Cybozu-API-Token' : user_app_token
    };
    nickname = urlencode(nickname);
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app=" + user_app_id + "&query=Nickname=" + '"' + nickname + '"',
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
                result.error_message = 'ニックネームが既存情報と重複しています。別のニックネームを入れ直してください。';
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

router.post('/validateWrist', function(req, res, next){
    var body = req.body;
    var wrist = typeof body.Wrist !== "undefined" ? body.Wrist.toString().trim() : "";
    wrist = wrist.toLowerCase() ;
    wrist = wrist.replace(/cm/g, "");
    var new_wrist = parseFloat(wrist);
    var result = {};
    if(new_wrist == wrist && new_wrist >= 10 && new_wrist <= 20){
        res.status(200).json({"status" : 1, "tmp_wrist": new_wrist});
    }else{
        result.error_message = '10cm〜20cmの英数字を入力してください。';
        res.status(500).json(result);
    }
});


router.post('/validateWristLine', function(req, res, next){
    var body = req.body;
    var wrist = typeof body.Wrist !== "undefined" ? body.Wrist.toString().trim() : "";
    wrist = wrist.toLowerCase() ;
    wrist = wrist.replace(/cm/g, "");
    var new_wrist = parseFloat(wrist);
    if(new_wrist == wrist && wrist >= 10 && wrist <= 20){
        res.status(200).json({"status" : 1, "tmp_wrist": new_wrist});
    }else{
        res.status(200).json({"status" : 0});
    }
});

router.post('/validateNicknameUpdate', function(req, res, next){
    var body = req.body;
    console.log("validateNicknameUpdate", body);
    var nickname = typeof body.nickname !== "undefined" ? body.nickname.trim() : "";
    var liff_user_id = typeof body.liff_user_id !== "undefined" ? body.liff_user_id.trim() : "";
    if(nickname.length > 0){
        var headers = {
            'X-Cybozu-API-Token' : user_app_token
        };
        nickname = urlencode(nickname);
        var request_body = {
            uri: "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app=" + user_app_id + "&query=Nickname=" + '"' + nickname + '" and LINE_ID != "' + liff_user_id + '"',
            headers: headers,
            method: "GET",
            json: true
        };

        var result = {};
        request(request_body, function (error, response, body) {
            console.log("error=", error);
            //console.log("response.statusCode=", response.statusCode);
            //console.log(body.totalCount);
            //console.log(body);
            if (!error && response.statusCode == 200){
                if(body.totalCount > 0){
                    result.error_message = 'ニックネームが既存情報と重複しています。別のニックネームを入れ直してください。';
                    res.status(500).json(result);
                }else{
                    res.status(200).json(result);
                }
            }else {
                result.error_message = 'エラーが発生しました。';
                res.status(500).json(result);
            }
        });
    }else{
        res.status(200).json({});
    }

});

router.post('/authGen', function(req, res, next){
    var body = req.body;
    console.log("validateNicknameUpdate", body);
    var email = typeof body.email !== "undefined" ? body.email.trim() : "";
    var url = typeof body.url !== "undefined" ? body.url.trim() : "";

    var header_update = {
        'Content-type': 'application/json'
    };

    var body_request = {
        email: email
    };

    var request_body = {
        uri: url,
        headers: headers,
        method: "POST",
        json: body_request
    };

    request(request_body, function (error, response, body) {
        console.log("error=", error);
        //console.log("response.statusCode=", response.statusCode);
        //console.log(body.totalCount);
        //console.log(body);
        if (!error && response.statusCode == 200){
            if(body.totalCount > 0){
                result.error_message = 'ニックネームが既存情報と重複しています。別のニックネームを入れ直してください。';
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

router.post('/getWatchId', function(req, res, next){
    var body = req.body;
    console.log("getWatchId", body);
    var text =  typeof body.text !== "undefined" ? body.text.toString().trim() : "";
    var regexp11 = /\(.*?\)/;
    var tmp1 = text.match(regexp11);
    if(tmp1){
        tmp1 = tmp1[0];
        tmp1 = tmp1.replace(/\(|\)/g, "");
        res.status(200).json({"WatchID" : tmp1});
    }else{
        res.status(200).json({"WatchID" : text});
    }
    //res.status(200).json({"WatchID" : text});
    //
    //var arr = text.split("-");
    //if(arr.length == 2){
    //    res.status(200).json({"WatchID" : arr[1]});
    //}else{
    //    res.status(200).json({"WatchID" : text});
    //}
});

router.post('/AddAuthLog', function(req, res, next){
    var body = req.body;
    console.log(body);
    var liff_user_id = body.user_id;
    var EMailAddress = typeof body.email !== "undefined" ? body.email.trim() : "";
    if(!emailValidator.validate(EMailAddress)){
        res.status(200).json({
            message: {
                "type": "text",
                "text": "有効なメールアドレス形式で指定してください。"
            }
        });
        return;
    }

    var result_error1 = {
        message: {
            "type": "text",
            "text": "エラーが発生しました。"
        }
    };

    var result_error2 = {
        message: {
            "type": "text",
            "text": "まだ会員登録手続きをされていません。"
        }
    };

    var result_error3 = {
        message: {
            "type": "text",
            "text": "既に登録されています。"
        }
    };

    var header_user = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var query_user = 'LINE_ID = "' + liff_user_id + '"';
    var request_body_user = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + user_app_id + "&query=" + query_user,
        headers: header_user,
        method: "GET",
        json: true
    };
    request(request_body_user, function (error, response, body) {
        //console.log("error=", error);
        //console.log("response.statusCode=", response.statusCode);
        //console.log(body);
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var user = records[0];
                var user_record_id = user["$id"].value;
                var header_auth = {
                    'X-Cybozu-API-Token' : auth_log_app_token
                };
                var query_pref = 'UserID = "' + user_record_id + '"';
                var request_body = {
                    uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + auth_log_app_id + "&query=" + query_pref,
                    headers: header_auth,
                    method: "GET",
                    json: true
                };
                request(request_body, function (error, response, body) {
                    if (!error && response.statusCode == 200){
                        var records = body.records;
                        if(records.length > 0){
                            var row = records[0];
                            var status = row.Status.value;

                            var body_request_update = {
                                app: auth_log_app_id,
                                id: row["$id"].value,
                                record: {
                                    EMailAddress: {value : EMailAddress},
                                    Status: {value : "Provisional"}
                                }
                            };
                            var header_update = {
                                'X-Cybozu-API-Token' : auth_log_app_token,
                                'Content-type': 'application/json'
                            };
                            request({
                                uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
                                method: 'PUT',
                                headers: header_update,
                                json: body_request_update
                            }, function (error1, response, body2) {
                                if (!error1 && response.statusCode == 200){
                                    res.status(200).json({});
                                }else{
                                    res.status(200).json(result_error1);
                                }
                            });

                            //if(status == "Active") {
                            //    res.status(200).json(result_error3);
                            //}else{
                            //    var body_request_update = {
                            //        app: auth_log_app_id,
                            //        id: row["$id"].value,
                            //        record: {
                            //            EMailAddress: {value : EMailAddress},
                            //            Status: {value : "Provisional"}
                            //        }
                            //    };
                            //    var header_update = {
                            //        'X-Cybozu-API-Token' : auth_log_app_token,
                            //        'Content-type': 'application/json'
                            //    };
                            //    request({
                            //        uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
                            //        method: 'PUT',
                            //        headers: header_update,
                            //        json: body_request_update
                            //    }, function (error1, response, body2) {
                            //        if (!error1 && response.statusCode == 200){
                            //            res.status(200).json({});
                            //        }else{
                            //            res.status(200).json(result_error1);
                            //        }
                            //    });
                            //}
                        }else{
                            var body_request = {
                                app: auth_log_app_id,
                                record: {
                                    UserID: {value : user_record_id},
                                    EMailAddress: {value : EMailAddress}
                                }
                            };
                            var headers = {
                                'X-Cybozu-API-Token' : auth_log_app_token,
                                'Content-type': 'application/json'
                            };
                            request({
                                uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
                                method: 'POST',
                                headers: headers,
                                json: body_request
                            }, function (error1, response, body2) {
                                if (!error1 && response.statusCode == 200){
                                    res.status(200).json({});
                                }else{
                                    res.status(200).json(result_error1);
                                }
                            });
                        }
                    }else{
                        res.status(200).json(result_error1);
                    }
                });
            }else{
                res.status(200).json(result_error2);
            }
        }else {
            res.status(200).json(result_error1);
        }
    });
});

router.post('/validateLineId', function(req, res, next){
    var body = req.body;
    console.log("validateLineId", body);
    var liff_user_id = typeof body.liff_user_id !== "undefined" ? body.liff_user_id.trim() : "";
    var headers = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app=" + user_app_id + "&query=LINE_ID=" + '"' + liff_user_id + '"',
        headers: headers,
        method: "GET",
        json: true
    };

    var result = {};
    request(request_body, function (error, response, body) {
        console.log("error=", error);
        //console.log("response.statusCode=", response.statusCode);
        //console.log(body.totalCount);
        //console.log(body);
        if (!error && response.statusCode == 200){
            if(body.totalCount > 0){
                result.error_message = 'このLINE IDは登録済みです。';
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

router.post('/validateLineIdFromLine', function(req, res, next){
    var body = req.body;
    console.log("validateLineIdFromLine", body);
    var liff_user_id = typeof body.user_id !== "undefined" ? body.user_id.toString().trim() : "";
    var headers = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app=" + user_app_id + "&query=LINE_ID=" + '"' + liff_user_id + '"',
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

router.post('/updateUser', function(req, res, next){
    var body = req.body;
    console.log("updateUser=", body);
    var LINE_ID = body.LINE_ID;
    var fields = ["LastName", "FirstName", "Nickname", "LastNamePhonetic", "FirstNamePhonetic", "Wrist", "ZIP_Code", "Prefecture", "City", "StreetNumber", "ApartmentRoomNumber", "Phone", "LINE_DISPLAY_NAME", "Comment"];
    var LastName =  typeof body.LastName !== "undefined" ? body.LastName : "";
    var FirstName =  typeof body.FirstName !== "undefined" ? body.FirstName : "";
    var Nickname =  typeof body.Nickname !== "undefined" ? body.Nickname : "";
    var LastNamePhonetic =  typeof body.LastNamePhonetic !== "undefined" ? body.LastNamePhonetic : "";
    var FirstNamePhonetic =  typeof body.FirstNamePhonetic !== "undefined" ? body.FirstNamePhonetic : "";
    var Wrist =  typeof body.Wrist !== "undefined" ? body.Wrist : "";
    Wrist = Wrist.toLowerCase() ;
    Wrist = Wrist.replace(/cm/g, "");
    Wrist = parseFloat(Wrist);

    var ZIP_Code =  typeof body.ZIP_Code !== "undefined" ? body.ZIP_Code : "";
    var Prefecture =  typeof body.Prefecture !== "undefined" ? body.Prefecture : "";
    var City =  typeof body.City !== "undefined" ? body.City : "";
    var StreetNumber =  typeof body.StreetNumber !== "undefined" ? body.StreetNumber : "";
    var ApartmentRoomNumber =  typeof body.ApartmentRoomNumber !== "undefined" ? body.ApartmentRoomNumber : "";
    var Phone =  typeof body.Phone !== "undefined" ? body.Phone : "";
    var LINE_DISPLAY_NAME =  typeof body.LINE_DISPLAY_NAME !== "undefined" ? body.LINE_DISPLAY_NAME : "";
    var Comment =  typeof body.Comment !== "undefined" ? body.Comment : "";

    var header_user = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var query = 'LINE_ID = "' + LINE_ID + '"';

    console.log("query=", query);
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + user_app_id + "&query=" + query,
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
                    uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
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

router.post('/updateWrist', function(req, res, next){
    var body = req.body;
    console.log("updateWrist=", body);
    var LINE_ID = body.LINE_ID;
    var Wrist = typeof body.Wrist !== "undefined" ? body.Wrist.toString().trim() : "";
    Wrist = Wrist.toLowerCase() ;
    Wrist = Wrist.replace(/cm/g, "");
    Wrist = parseFloat(Wrist);

    if(Wrist >= 10 && Wrist <= 20){

    }else{
        res.status(200).json({"status" : 0});
        return;
    }
    var header_user = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var query = 'LINE_ID = "' + LINE_ID + '"';

    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + user_app_id + "&query=" + query,
        headers: header_user,
        method: "GET",
        json: true
    };

    var res_result = {
        "status" : "0"
    };

    request(request_body, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var row = records[0];
                var record_id = row["$id"].value;

                var update_data = {};
                update_data["Wrist"] = {value: Wrist};
                var body_request1 = {
                    app: user_app_id,
                    id: record_id,
                    record: update_data
                };
                var headers1 = {
                    'X-Cybozu-API-Token' : user_app_token,
                    'Content-type': 'application/json'
                };
                //update WatchState
                request({
                    uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
                    method: 'PUT',
                    headers: headers1,
                    json: body_request1
                }, function (error1, response, body2) {
                    //console.log("response", response);
                    if (!error1 && response.statusCode == 200){
                        res.status(200).json({"status" : 1, "Wrist" : Wrist});
                    }else{
                        res.status(200).json(res_result);
                    }
                });
            }else{
                res.status(200).json(res_result);
            }
        }else {
            res.status(200).json(res_result);
        }
    });
});

router.post('/addRent', function(req, res, next){
    var body = req.body;
    console.log("addRent=", body);
    var UserID = body.UserID;
    var WatchID = body.WatchID;
    var rentWeek =  typeof body.order_dur !== "undefined" ? parseInt(body.order_dur) : 4;

    var header_user = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var request_body_user = {
        uri: "https://matchwatch.cybozu.com/k/v1/record.json?app=" + user_app_id + "&id=" + UserID,
        headers: header_user,
        method: "GET",
        json: true
    };
    var res_success = {
        "success" : 1
    };
    var res_error = {
        "success" : 0
    };

    request(request_body_user, function (error, response, body) {
        console.log("error=", error);
        console.log("response.statusCode=", response.statusCode);
        //console.log(body);
        if (!error && response.statusCode == 200){
            var user = body.record;
            if(user){
                var ZIP_Code = user.ZIP_Code.value;
                var Prefecture = user.Prefecture.value;
                var City = user.City.value;
                var StreetNumber = user.StreetNumber.value;
                var ApartmentRoomNumber = user.ApartmentRoomNumber.value;

                var header_watch_state = {
                    'X-Cybozu-API-Token' : watch_state_app_token
                };
                var query = 'WatchID = "' + WatchID + '" and WatchStatus in ("InStock") ';

                console.log("query=", query);
                var request_body = {
                    uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + watch_state_app_id + "&query=" + query,
                    headers: header_watch_state,
                    method: "GET",
                    json: true
                };
                request(request_body, function (error, response, body) {
                    if (!error && response.statusCode == 200){
                        var records = body.records;
                        if(records.length > 0){
                            var row = records[0];
                            var watch_state_id = row["$id"].value;
                            var rentW = "Rent" + rentWeek + "w";
                            var RentwFee = row[rentW].value;


                            //getPoint
                            var header_point = {
                                'X-Cybozu-API-Token' : point_app_token
                            };
                            var query_point = 'UserID = "' + UserID + '" order by LastUpdate desc limit 1';

                            console.log("query_point=", query_point);
                            var request_point_body = {
                                uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + point_app_id + "&query=" + query_point,
                                headers: header_point,
                                method: "GET",
                                json: true
                            };
                            var point = 0;
                            var current_point = 0;
                            var TransactionID = 0;
                            request(request_point_body, function (error, response, body) {
                                if (!error && response.statusCode == 200){
                                    var records = body.records;
                                    if(records.length > 0){
                                        var row = records[0];
                                        //console.log(row);
                                        if(row.Balance.value){
                                            TransactionID = parseInt(row.TransactionID.value) + 1;
                                            point = parseInt(row.Balance.value);
                                            current_point = point;
                                            if(point > RentwFee){
                                                point = RentwFee;
                                            }
                                        }
                                    }
                                }

                                var body_request1 = {
                                    app: watch_state_app_id,
                                    id: watch_state_id,
                                    record: {
                                        WatchStatus: {value : "InRentRequest"}
                                    }
                                };
                                var headers1 = {
                                    'X-Cybozu-API-Token' : watch_state_app_token,
                                    'Content-type': 'application/json'
                                };
                                //update WatchState
                                request({
                                    uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
                                    method: 'PUT',
                                    headers: headers1,
                                    json: body_request1
                                }, function (error1, response, body2) {
                                    if (!error1 && response.statusCode == 200){
                                        var StartDate = moment().tz(TIMEZONE).add(5, 'd').format("YYYY-MM-DD");
                                        var EndDate = moment().tz(TIMEZONE).add(5 + rentWeek * 7, 'd').format("YYYY-MM-DD");
                                        var body_request = {
                                            app: rent_app_id,
                                            record: {
                                                BorrowerID: {value : UserID},
                                                WatchID: {value : WatchID},
                                                NominalFee: {value : RentwFee},
                                                PointApplied: {value : point},
                                                StartDate: {value : StartDate},
                                                EndDate: {value : EndDate},
                                                Duration: {value : rentWeek},
                                                ZIP_Code: {value : ZIP_Code},
                                                Prefecture: {value : Prefecture},
                                                City: {value : City},
                                                StreetNumber: {value : StreetNumber},
                                                ApartmentRoomNumber: {value : ApartmentRoomNumber},
                                                PaymentSuccess: {value: "Unconfirmed"}
                                            }
                                        };
                                        var headers = {
                                            'X-Cybozu-API-Token' : rent_app_token,
                                            'Content-type': 'application/json'
                                        };
                                        //add rent
                                        request({
                                            uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
                                            method: 'POST',
                                            headers: headers,
                                            json: body_request
                                        }, function (error1, response2, body2) {
                                            if (!error1 && response2.statusCode == 200){
                                                res.status(200).json(res_success);
                                            }else{
                                                res.status(200).json(res_error);
                                            }
                                        });

                                        if(point > 0){
                                            var update_time = moment().tz(TIMEZONE).format("YYYY-MM-DDTHH:mm:00Z");

                                            var body_request2 = {
                                                app: point_app_id,
                                                record: {
                                                    UserID: {value : UserID},
                                                    Change: {value : point * -1},
                                                    Event: {value : "Applied for Watch Rent"},
                                                    Balance: {value : current_point - point},
                                                    LastUpdate: {value : update_time},
                                                    TransactionID: {value : TransactionID}
                                                }
                                            };
                                            //console.log(body_request2);
                                            var headers2 = {
                                                'X-Cybozu-API-Token' : point_app_token,
                                                'Content-type': 'application/json'
                                            };
                                            //add rent
                                            request({
                                                uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
                                                method: 'POST',
                                                headers: headers2,
                                                json: body_request2
                                            }, function (error1, response2, body2) {
                                                if (!error1 && response2.statusCode == 200){

                                                }else{
                                                    console.log(body2);
                                                }
                                            });
                                        }


                                    }else{
                                        res.status(200).json(res_error);
                                    }
                                });

                            });
                        }else{
                            res.status(200).json(res_error);
                        }
                    }else {
                        res.status(200).json(res_error);
                    }
                });
            }else{
                res.status(200).json(res_error);
            }
        }else {
            res.status(200).json(res_error);
        }
    });


});

router.post('/addPreference', function(req, res, next){
    var body = req.body;
    var liff_user_id = body.liff_user_id;
    var GenderFor = typeof body.GenderFor !== "undefined" ? body.GenderFor : "";
    GenderFor = GenderFor.split(",");
    var AvilableWatchOnly =  typeof body.AvilableWatchOnly !== "undefined" ? body.AvilableWatchOnly : "False";
    var WristFit = typeof body.WristFit !== "undefined" ? body.WristFit : "False";

    var result_error1 = {
        error_message: "エラーが発生しました。"
    };

    var result_error2 = {
        error_message: "まだ会員登録手続きをされていません。"
    };

    var header_user = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var query_user = 'LINE_ID = "' + liff_user_id + '"';
    var request_body_user = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + user_app_id + "&query=" + query_user,
        headers: header_user,
        method: "GET",
        json: true
    };
    request(request_body_user, function (error, response, body) {
        //console.log("error=", error);
        //console.log("response.statusCode=", response.statusCode);
        //console.log(body);
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var user = records[0];
                var user_record_id = user["$id"].value;
                var header_pref = {
                    'X-Cybozu-API-Token' : preference_app_token
                };
                var query_pref = 'UserID = "' + user_record_id + '"';
                var request_body_user = {
                    uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + preference_app_id + "&query=" + query_pref,
                    headers: header_pref,
                    method: "GET",
                    json: true
                };
                request(request_body_user, function (error, response, body) {
                    if (!error && response.statusCode == 200){
                        var records = body.records;
                        if(records.length > 0){
                            var pref = records[0];
                            var pref_id = pref["$id"].value;
                            var body_request1 = {
                                app: preference_app_id,
                                id: pref_id,
                                record: {
                                    GenderFor: {value : GenderFor},
                                    AvilableWatchOnly: {value : AvilableWatchOnly},
                                    WristFit: {value : WristFit}
                                }
                            };
                            var headers1 = {
                                'X-Cybozu-API-Token' : preference_app_token,
                                'Content-type': 'application/json'
                            };
                            request({
                                uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
                                method: 'PUT',
                                headers: headers1,
                                json: body_request1
                            }, function (error1, response, body2) {
                                if (!error1 && response.statusCode == 200){
                                    res.status(200).json({});
                                }else{
                                    console.log(body2);
                                    res.status(500).json(result_error1);
                                }
                            });
                        }else{
                            var body_request = {
                                app: preference_app_id,
                                record: {
                                    UserID: {value : user_record_id},
                                    GenderFor: {value : GenderFor},
                                    AvilableWatchOnly: {value : AvilableWatchOnly},
                                    WristFit: {value : WristFit}
                                }
                            };
                            var headers = {
                                'X-Cybozu-API-Token' : preference_app_token,
                                'Content-type': 'application/json'
                            };
                            request({
                                uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
                                method: 'POST',
                                headers: headers,
                                json: body_request
                            }, function (error1, response, body2) {
                                if (!error1 && response.statusCode == 200){
                                    res.status(200).json({});
                                }else{
                                    res.status(500).json(result_error1);
                                }
                            });
                        }
                    }else{
                        res.status(500).json(result_error1);
                    }
                });
            }else{
                res.status(500).json(result_error2);
            }
        }else {
            res.status(500).json(result_error1);
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
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + user_app_id + "&query=" + query_user,
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

router.post('/checkAddRent', function(req, res, next){
    var body = req.body;
    var BorrowerID = body.BorrowerID;
    var res_success = {
        "rent_available_flg" : 1
    };
    var res_error = {
        "rent_available_flg" : 0
    };

    var header_user = {
        'X-Cybozu-API-Token' : rent_app_token
    };
    var query = 'BorrowerID = "' + BorrowerID + '" and ApplicationStatus in ("Requested", "InRent")';

    var request_body_user = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + rent_app_id + "&query=" + query,
        headers: header_user,
        method: "GET",
        json: true
    };
    request(request_body_user, function (error, response, body){
        if(!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                res.status(200).json(res_error);
            }else{
                res.status(200).json(res_success);
            }
        }else{
            res.status(200).json(res_success);
        }
    });
});

router.post('/getRent', function(req, res, next){
    var body = req.body;
    console.log("getRent", body);
    var BorrowerID = body.BorrowerID;
    var no_result = {
        message: {
            "type": "text",
            "text": "借りている時計はありません。"
        }
    };
    var query = 'BorrowerID = "' + BorrowerID + '" and ApplicationStatus in ("Requested", "InRent")';
    var header_rent = {
        'X-Cybozu-API-Token' : rent_app_token
    };
    var request_body_user = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + rent_app_id + "&query=" + query,
        headers: header_rent,
        method: "GET",
        json: true
    };

    request(request_body_user, function (error, response, body) {
        console.log("error=", error);
        console.log("response.statusCode=", response.statusCode);
        //console.log(body);
        if(!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var list_watch_id = [];
                var ReturnDateArr = {};

                for(var i = 0; i < records.length; i++){
                    var row = records[i];


                    var address = "〒" + toPostFmt(row.ZIP_Code.value) + " " + row.Prefecture.value + row.City.value + row.StreetNumber.value + row.ApartmentRoomNumber.value;


                    var WatchID = row.WatchID.value;
                    var EndDate = row.EndDate.value;
                    var ActualFee = 0;
                    if(row.ActualFee && row.ActualFee.value){
                        ActualFee = row.ActualFee.value;
                    }

                    var ApplicationStatus = row.ApplicationStatus.value;
                    if(rentStatus[ApplicationStatus]){
                        ApplicationStatus = rentStatus[ApplicationStatus];
                    }else {
                        ApplicationStatus = "";
                    }
                    var Duration = row.Duration.value;
                    list_watch_id.push('"' + WatchID +'"');
                    ReturnDateArr[WatchID] = {
                        EndDate: EndDate, Duration: Duration, ActualFee: ActualFee,
                        ApplicationStatus: ApplicationStatus,
                        ChargeTransactionTime: row.ChargeTransactionTime.value,
                        address: address
                    };
                    break;
                }
                getProfileDataFromWatchIdRent(list_watch_id, function (next, columns, totalCount) {
                    if(next){
                        var arr = [];

                        var flex = {
                            "type": "bubble",
                            "header": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "明細書"
                                    }
                                ]
                            },
                            "hero": {
                                "type": "image",
                                "url": "https://botchan.blob.core.windows.net/matchwatch/kintone_images/20190520140508D59E31C2465347BCB23616E42DBDB9F4241_00000000986134_01.jpg",
                                "size": "3xl",
                                "aspectRatio": "1:1"
                            },
                            "body": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "時計名称",
                                        "weight": "bold",
                                        "wrap": true
                                    },
                                    {
                                        "type": "text",
                                        "text": "レンタル状況："
                                    },
                                    {
                                        "type": "text",
                                        "text": "貸出期間（Durationから取得）"
                                    },
                                    {
                                        "type": "text",
                                        "text": "返却期日（EndDateから取得）"
                                    },
                                    {
                                        "type": "text",
                                        "text": "課金額（ActualFeeから取得）"
                                    },
                                    {
                                        "type": "text",
                                        "text": "決済日時",
                                        "wrap": true
                                    },
                                    {
                                        "type": "text",
                                        "text": "送付先：",
                                        "wrap": true
                                    }
                                ]
                            }
                        };

                        Object.keys(columns).forEach(function(WatchID) {
                            var tmp = columns[WatchID];
                            flex.hero.url = tmp.thumbnailImageUrl;
                            flex.body.contents[0].text = tmp.text;
                            flex.body.contents[1].text = "レンタル状況：" + ReturnDateArr[WatchID].ApplicationStatus;
                            flex.body.contents[2].text = "貸出期間：" + ReturnDateArr[WatchID].Duration + "週";
                            flex.body.contents[3].text = "返却期日：" + moment(ReturnDateArr[WatchID].EndDate).tz(TIMEZONE).format("YYYY年MM月DD日 (ddd)");
                            flex.body.contents[4].text = "課金額：" + currencyFormatter.format(ReturnDateArr[WatchID].ActualFee, { code: 'JPY' });

                            var pay_date = moment(ReturnDateArr[WatchID].ChargeTransactionTime).tz(TIMEZONE).format("YYYY年MM月DD日 HH:mm (ddd)");
                            if(pay_date == "Invalid date"){
                                pay_date = "";
                            }
                            flex.body.contents[5].text = "決済日時：" + pay_date;
                            flex.body.contents[6].text = "送付先：" + ReturnDateArr[WatchID].address;

                            //tmp.title = ReturnDateArr[WatchID] + "までにご返送ください";
                            //tmp.actions =  [
                            //    {
                            //        "type" : "uri",
                            //        "label" : "商品詳細を表示する",
                            //        "uri" : url1 + WatchID
                            //    },
                            //    {
                            //        "type" : "uri",
                            //        "label" : "返却方法について",
                            //        "uri" : url2
                            //    }
                            //];
                            //arr.push(tmp);
                        });

                        res.json({
                            message: {
                                "type" : "flex",
                                "altText" : "貸出中",
                                "contents" : flex
                            }
                        });
                        //res.json({
                        //    message: {
                        //        "type" : "template",
                        //        "altText" : "貸し出し状況",
                        //        "template" : {
                        //            "type" : "carousel",
                        //            "columns" : arr,
                        //            "imageAspectRatio": "square"
                        //        }
                        //    }
                        //});
                    }else{
                        res.status(200).json(no_result);
                    }
                });

            }else{
                res.status(200).json(no_result);
            }
        }
    });
});

router.post('/getWatchState', function(req, res, next){
    var body = req.body;
    var WatchID = body.WatchID;
    var header_user = {
        'X-Cybozu-API-Token' : watch_state_app_token
    };
    var query = 'WatchID = "' + WatchID + '"';
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + watch_state_app_id + "&query=" + query,
        headers: header_user,
        method: "GET",
        json: true
    };
    var result = {};

    result.Rent4w = "";
    result.Rent8w = "";
    result.Rent12w = "";

    request(request_body, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var row = records[0];
                result.Rent4w = currencyFormatter.format(row.Rent4w.value, { code: 'JPY' });
                result.Rent8w = currencyFormatter.format(row.Rent8w.value, { code: 'JPY' });
                result.Rent12w = currencyFormatter.format(row.Rent12w.value, { code: 'JPY' });
            }
            res.status(200).json(result);
        }else {
            res.status(200).json(result);
        }
    });
});

router.post('/getWatchState2', function(req, res, next){
    var body = req.body;
    console.log("getWatchState2", body);
    var current_scenario = (typeof body.current_scenario !== "undefined") ? body.current_scenario : -1;
    var connect_scenario = (typeof body.connect_scenario !== "undefined") ? body.connect_scenario : -1;
    var variable_id = (typeof body.variable_id !== "undefined") ? body.variable_id : -1;

    var WatchID = body.WatchID;
    var header_user = {
        'X-Cybozu-API-Token' : watch_state_app_token
    };
    var query = 'WatchID = "' + WatchID + '"';
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + watch_state_app_id + "&query=" + query,
        headers: header_user,
        method: "GET",
        json: true
    };
    var result = {
        "type": "text",
        "text" : "貸出期間を選択してください",
        "quickReply" : {
            "items" :  [
                {
                    "type": "action",
                    "action": {
                        "type": "postback",
                        "label": "4週間 xxxxxx円",
                        "displayText": "4週間 xxxxxx円",
                        "data" : "BQUICK_REPLIES_" + current_scenario + "_" + connect_scenario + "_" + variable_id + "_NA==_0"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "postback",
                        "label": "8週間 xxxxxx円",
                        "displayText": "8週間 xxxxxx円",
                        "data" : "BQUICK_REPLIES_" + current_scenario + "_" + connect_scenario + "_" + variable_id + "_OA==_0"
                    }
                },
                {
                    "type": "action",
                    "action": {
                        "type": "postback",
                        "label": "12週間 xxxxxx円",
                        "displayText": "12週間 xxxxxx円",
                        "data" : "BQUICK_REPLIES_" + current_scenario + "_" + connect_scenario + "_" + variable_id + "_MTI==_0"
                    }
                }
            ]
        }
    };

    request(request_body, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var row = records[0];
                result.quickReply.items[0].action.label = "4週間 " + currencyFormatter.format(row.Rent4w.value, { code: 'JPY' });
                result.quickReply.items[1].action.label = "8週間 " + currencyFormatter.format(row.Rent8w.value, { code: 'JPY' });
                result.quickReply.items[2].action.label = "12週間 " + currencyFormatter.format(row.Rent12w.value, { code: 'JPY' });


                result.quickReply.items[0].action.displayText = result.quickReply.items[0].action.label;
                result.quickReply.items[1].action.displayText = result.quickReply.items[1].action.label;
                result.quickReply.items[2].action.displayText = result.quickReply.items[2].action.label;
            }
            res.json({
                message: result
            });
        }else {
            res.json({
                message: result
            });
        }
    });
});

router.post('/getUserId', function(req, res, next){
    var body = req.body;
    console.log("getUserId", body);
    var user_id = body.user_id;
    var auth_log_status = typeof body.auth_log_status !== "undefined" ? body.auth_log_status : 0;
    var header_user = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var query_user = 'LINE_ID = "' + user_id + '"';
    var request_body_user = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + user_app_id + "&query=" + query_user,
        headers: header_user,
        method: "GET",
        json: true
    };
    var result = {};

    result.user_record_id = -1;
    result.ZIP_Code = "";
    result.ZIP_Code_hyphen = "";
    result.Prefecture = "";
    result.City = "";
    result.StreetNumber = "";
    result.ApartmentRoomNumber = "";
    result.auth_log_status = 0;

    result.LastName = "";
    result.FirstName = "";
    result.Nickname = "";
    result.Wrist = "";
    result.Phone = "";
    result.EMailAddress = "";
    result.Black = "False";
    request(request_body_user, function (error, response, body) {
        console.log("error=", error);
        console.log("response.statusCode=", response.statusCode);
        //console.log(body);
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var user = records[0];
                //console.log("user=", user);
                result.user_record_id = user["$id"].value;

                result.ZIP_Code = user.ZIP_Code.value;
                result.ZIP_Code_hyphen = toPostFmt(user.ZIP_Code.value);
                result.Prefecture = user.Prefecture.value;
                result.City = user.City.value;
                result.StreetNumber = user.StreetNumber.value;
                result.ApartmentRoomNumber = user.ApartmentRoomNumber.value;

                result.LastName = user.LastName.value;
                result.FirstName = user.FirstName.value;
                result.Nickname = user.Nickname.value;
                result.Wrist = user.Wrist.value;
                result.Phone = user.Phone.value;
                result.Black = user.Black.value;
                if(auth_log_status !== 0){
                    var header2 = {
                        'X-Cybozu-API-Token' : auth_log_app_token
                    };
                    var query = 'UserID = "' + result.user_record_id + '"';
                    var request_body = {
                        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + auth_log_app_id + "&query=" + query,
                        headers: header2,
                        method: "GET",
                        json: true
                    };
                    request(request_body, function (error, response, body) {
                        //console.log("error=", error);
                        //console.log("response.statusCode=", response.statusCode);
                        //console.log(body);
                        if (!error && response.statusCode == 200) {
                            var records = body.records;
                            if(records.length > 0) {
                                var row = records[0];
                                result.auth_log_status = row.Status.value;
                                result.EMailAddress = row.EMailAddress.value;
                            }
                        }
                        console.log(result);
                        res.status(200).json(result);
                    });

                }else{
                    res.status(200).json(result);
                }

            }else{
                res.status(200).json(result);
            }


        }else {
            res.status(200).json(result);
        }
    });
});

router.post('/checkWrist', function(req, res, next){
    var body = req.body;
    var user_id = body.user_id;
    var WatchID = body.WatchID;
    var header_user = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var query_user = 'LINE_ID = "' + user_id + '"';
    var request_body_user = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + user_app_id + "&query=" + query_user,
        headers: header_user,
        method: "GET",
        json: true
    };
    var Wrist = 0;
    request(request_body_user, function (error, response, body) {
        //console.log(body);
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var user = records[0];
                Wrist = user.Wrist.value;
                if(Wrist && Wrist.length > 0){
                    Wrist =  parseFloat(Wrist) * 100;
                    getOneWatchProfile(WatchID, function (next, result) {

                        if(result.MaximumBandLength == result.MinimumBandLength){
                            if(Wrist <= (result.MinimumBandLength + 50) && Wrist >= (result.MinimumBandLength - 50)){
                                res.status(200).json({meet_flg: 1});
                            }else{
                                res.status(200).json({meet_flg: 0});
                            }
                        }else {
                            if(Wrist <= result.MaximumBandLength && Wrist >= result.MinimumBandLength){
                                res.status(200).json({meet_flg: 1});
                            }else{
                                res.status(200).json({meet_flg: 0});
                            }
                        }

                    });
                }else{
                    res.status(200).json({meet_flg: 2});
                }
            }
        }else {
            res.status(200).json({meet_flg: 0});
        }
    });
});

router.post('/checkBorrowerInsurance', function(req, res, next){
    var body = req.body;
    var UserID = body.UserID;
    var header = {
        'X-Cybozu-API-Token' : borrower_insurance_app_token
    };
    var query_user = 'UserID = "' + UserID + '"';
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + borrower_insurance_app_id + "&query=" + query_user,
        headers: header,
        method: "GET",
        json: true
    };
    var borrower_insurance_status = 2;
    request(request_body, function (error, response, body) {
        //console.log(body);
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                borrower_insurance_status = 0;
                for(var i = 0; i < records.length; i++){
                    var user = records[i];
                    var IsActive = user.IsActive.value;
                    var ExpiryDate = user.ExpiryDate.value;
                    ExpiryDate  = moment(ExpiryDate).tz(TIMEZONE).format("YYYY-MM-DD HH:mm:ss");
                    var now = moment().tz(TIMEZONE).format("YYYY-MM-DD HH:mm:ss");
                    if(IsActive == "True" && (ExpiryDate > now || ExpiryDate == "Invalid date")){
                        borrower_insurance_status = 1;
                        break;
                    }
                    console.log("ExpiryDate", ExpiryDate);
                    console.log("now", now);
                    console.log("IsActive", IsActive);
                }
                res.status(200).json({status: borrower_insurance_status});
            }else{
                res.status(200).json({status: borrower_insurance_status});
            }

        }else {
            res.status(200).json({status: borrower_insurance_status});
        }
    });
});

router.post('/removeFavorites', function(req, res, next){
    var body = req.body;
    console.log("removeFavorites", body);

    var UserID = body.UserID;
    var WatchID = body.WatchID;
    var result1 = {
        message: {
            "type": "text",
            "text": "お気に入りから削除しました"
        }
    };

    var result3 = {
        message: {
            "type": "text",
            "text": "エラーが発生しました。"
        }
    };

    var headers = {
        'X-Cybozu-API-Token' : favorite_app_token
    };
    var query = 'UserID = "' + UserID + '" and WatchID = "' + WatchID + '"';
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + favorite_app_id + "&query=" + query,
        headers: headers,
        method: "GET",
        json: true
    };

    request(request_body, function (error, response, body) {
        console.log("error=", error);
        console.log("response.statusCode=", response.statusCode);
        //console.log(body);
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var record = records[0];
                var body_request = {
                    app: favorite_app_id,
                    ids: [record["$id"].value]
                };
                var headers = {
                    'X-Cybozu-API-Token' : favorite_app_token,
                    'Content-type': 'application/json'
                };
                request({
                    uri: 'https://matchwatch.cybozu.com/k/v1/records.json',
                    method: 'DELETE',
                    headers: headers,
                    json: body_request
                }, function (error1, response2, body2) {
                    if (!error1 && response2.statusCode == 200){
                        res.status(200).json(result1);
                    }else{
                        res.status(200).json(result3);
                    }
                });
            }else{
                res.status(200).json(result1);
            }
        }else {
            res.status(200).json(result3);
        }
    });
});

router.post('/addFavorites', function(req, res, next){
    var body = req.body;
    console.log("addFavorites", body);
    var UserID = body.UserID;
    var WatchID = body.WatchID;
    var result1 = {
        message: {
            "type": "text",
            "text": "すでにお気に入りに登録されています。"
        }
    };

    var result2 = {
        message: {
            "type": "text",
            "text": "お気に入りに登録しました。"
        }
    };

    var result3 = {
        message: {
            "type": "text",
            "text": "エラーが発生しました。"
        }
    };

    var headers = {
        'X-Cybozu-API-Token' : favorite_app_token
    };
    var query = 'UserID = "' + UserID + '" and WatchID = "' + WatchID + '"';
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + favorite_app_id + "&query=" + query,
        headers: headers,
        method: "GET",
        json: true
    };

    request(request_body, function (error, response, body) {
        console.log("error=", error);
        //console.log(body);
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                res.status(200).json(result1);
            }else{
                var body_request = {
                    app: favorite_app_id,
                    record: {
                        UserID: {value : UserID},
                        WatchID: {value : WatchID}
                    }
                };
                var headers = {
                    'X-Cybozu-API-Token' : favorite_app_token,
                    'Content-type': 'application/json'
                };
                request({
                    uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
                    method: 'POST',
                    headers: headers,
                    json: body_request
                }, function (error1, response2, body2) {
                    if (!error1 && response2.statusCode == 200){
                        res.status(200).json(result2);
                    }else{
                        res.status(200).json(result1);
                    }
                });
            }
        }else {
            res.status(200).json(result3);
        }
    });
});

router.post('/getFavorites', function(req, res, next){
    var body = req.body;
    console.log("getFavorites", body);
    var UserID = body.UserID;
    var current_scenario = typeof body.current_scenario !== "undefined" ? body.current_scenario : -1;
    var connect_scenario_yes = typeof body.connect_scenario_yes !== "undefined" ? body.connect_scenario_yes : -1;
    var connect_scenario_no = typeof body.connect_scenario_no !== "undefined" ? body.connect_scenario_no : -1;

    var connect_scenario_rent = typeof body.connect_scenario_rent !== "undefined" ? body.connect_scenario_rent : -1;
    var connect_scenario_removebookmark = typeof body.connect_scenario_removebookmark !== "undefined" ? body.connect_scenario_removebookmark : -1;
    var variable_id = (typeof body.variable_id !== "undefined") ? body.variable_id : -1;
    var variable_mension_id = (typeof body.variable_mension_id !== "undefined") ? body.variable_mension_id : -1;

    var liff_url = (typeof body.liff_url !== "undefined") ? body.liff_url : "";
    var offset = (typeof body.offset != 'undefined') ? body.offset : 0;
    var result = {
        message: {
            "type": "text",
            "text": "お気に入り時計はまだありません。"
        },
        count: 0
    };

    var header_favorite = {
        'X-Cybozu-API-Token' : favorite_app_token
    };
    var query_favorite = 'UserID = "' + UserID + '"';
    var request_body_favorite = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + favorite_app_id + "&query=" + query_favorite,
        headers: header_favorite,
        method: "GET",
        json: true
    };

    request(request_body_favorite, function (error, response, body) {
        console.log("error=", error);
        console.log("response.statusCode=", response.statusCode);
        //console.log(body);
        if(!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var WatchIDArr = [];
                for(var i = 0; i < records.length; i++){
                    var row = records[i];
                    var WatchID = row.WatchID.value;
                    WatchIDArr.push('"' + WatchID +'"');
                }
                //var next_result = {
                //    "type" : "template",
                //    "altText" : "続きを見る",
                //    "template" : {
                //        "type" : "confirm",
                //        "text" : "続きを見る",
                //        "actions" : [
                //            {
                //                "type" : "postback",
                //                "label" : "はい",
                //                "data" : "BSCENARIO_" + current_scenario +"_" + connect_scenario_yes + "_-1_44Gv44GE"
                //            },
                //            {
                //                "type" : "postback",
                //                "label" : "いいえ",
                //                "data" : "BSCENARIO_" + current_scenario +"_" + connect_scenario_no + "_-1_44Gv44GE"
                //            }
                //        ]
                //    }
                //};

                getAllBrand(function (brandArr) {
                    getWatchProfile(WatchIDArr, offset, function (next, profileArr, ModelIDArr, totalCount) {
                        if(next){
                            getWatchState(WatchIDArr, function (stateArr) {
                                getWatchModel(ModelIDArr, function (modelArr) {
                                    var msg_arr = [];
                                    Object.keys(profileArr).forEach(function(WatchID) {
                                        var column = {};
                                        var tmp = profileArr[WatchID];

                                        var CoverPicture1_azure_link = "https://botchan.blob.core.windows.net/production/uploads/5d1e0914a24a61366b601547/5d6e78f2137d2.png";
                                        if(tmp.CoverPicture1_azure_link && tmp.CoverPicture1_azure_link.value && tmp.CoverPicture1_azure_link.value.length > 0){
                                            CoverPicture1_azure_link = tmp.CoverPicture1_azure_link.value;
                                        }

                                        column.thumbnailImageUrl = CoverPicture1_azure_link;
                                        var base64_watchid = base64Encode(WatchID, '-1');
                                        column.actions = [
                                            {
                                                "type" : "uri",
                                                "label" : "詳細を表示する",
                                                "uri" : liff_url + WatchID
                                            }
                                            //{
                                            //    "type" : "postback",
                                            //    "label" : "この商品を借りる",
                                            //    "data" : "BSCENARIO_" + current_scenario + "_" + connect_scenario_rent + "_" + variable_mension_id + "_" + base64_watchid
                                            //},
                                            //{
                                            //    "type" : "postback",
                                            //    "label" : "お気に入りを削除する",
                                            //    "data" : "BSCENARIO_" + current_scenario + "_" + connect_scenario_removebookmark + "_" + variable_id + "_" + base64_watchid
                                            //}
                                        ];
                                        var ModelID = tmp.ModelID;
                                        var name = "";
                                        var Rent4w = "";
                                        if(modelArr[ModelID]){
                                            var model = modelArr[ModelID];
                                            var BrandID = model.BrandID;
                                            name = model.name;
                                            if(brandArr[BrandID]){
                                                column.title = brandArr[BrandID];
                                            }else{
                                                column.title = "その他";
                                            }
                                        }
                                        if(stateArr[WatchID]){
                                            var state = stateArr[WatchID];
                                            Rent4w = state.Rent4w;
                                        }
                                        column.text = name.substr(0,30) + " | " +  "¥" + Rent4w;
                                        msg_arr.push(column);
                                    });


                                    var isPaging = false;
                                    if(totalCount > 5 && parseInt(offset) +5 < totalCount){
                                        offset = parseInt(offset) +5;
                                        isPaging = true;
                                    }else{
                                        offset = 0;
                                    }

                                    if(isPaging){
                                        var next_action = {
                                            "thumbnailImageUrl": next_image,
                                            "imageBackgroundColor": "#FFFFFF",
                                            "title": "続きを見る",
                                            "text": "次の商品を見ます",
                                            "actions": [
                                                {
                                                    "type": "postback",
                                                    "label": "続きを見る",
                                                    "displayText": "続きを見る",
                                                    "data" : "BSCENARIO_current_connect_続きを見る"
                                                }
                                            ]
                                        };
                                        var returnedTarget = Object.assign({}, next_action);
                                        returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("current", current_scenario);
                                        returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("connect", connect_scenario_yes);
                                        msg_arr.push(returnedTarget);
                                    }

                                    var message = [];
                                    var carousel =  {
                                        "type" : "template",
                                        "altText" : "お気に入り時計",
                                        "template" : {
                                            "type" : "carousel",
                                            "columns" : msg_arr,
                                            "imageAspectRatio": "square"
                                        }
                                    };
                                    message.push(carousel);
                                    //if(isPaging){
                                    //    message.push(next_result);
                                    //}
                                    console.log('new offset===', offset);
                                    res.json({
                                        message: message,
                                        count: offset
                                    });
                                });
                            });
                        }else{
                            res.status(200).json(result);
                        }
                    });
                });
            }else{
                res.status(200).json(result);
            }
        }
    });
});

router.post('/getItemByBrand', function(req, res, next){
    var body = req.body;
    console.log("body getItemByBrand", body);
    var BrandID = typeof body.BrandID !== "undefined" ? parseInt(body.BrandID) : -1;
    var offset = (typeof body.offset != 'undefined') ? body.offset : 0;

    var current_scenario = typeof body.current_scenario !== "undefined" ? body.current_scenario : -1;
    var connect_scenario_yes = typeof body.connect_scenario_yes !== "undefined" ? body.connect_scenario_yes : -1;
    var connect_scenario_no = typeof body.connect_scenario_no !== "undefined" ? body.connect_scenario_no : -1;

    var connect_scenario_rent = typeof body.connect_scenario_rent !== "undefined" ? body.connect_scenario_rent : -1;
    var connect_scenario_bookmark = typeof body.connect_scenario_bookmark !== "undefined" ? body.connect_scenario_bookmark : -1;
    var variable_id = (typeof body.variable_id !== "undefined") ? body.variable_id : -1;
    var variable_mension_id = (typeof body.variable_mension_id !== "undefined") ? body.variable_mension_id : -1;
    var liff_url = (typeof body.liff_url !== "undefined") ? body.liff_url : "";

    var headers = {
        'X-Cybozu-API-Token' : model_app_token
    };
    var query = 'BrandID = "' + BrandID + '"';
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + model_app_id + "&query=" + query,
        headers: headers,
        method: "GET",
        json: true
    };

    console.log(request_body);
    var result = {
        message: {
            "type": "text",
            "text": "ただいま貸し出しできる時計はございません。"
        }
    };

    var next_result = {
        "type" : "template",
        "altText" : "続きを見る",
        "template" : {
            "type" : "confirm",
            "text" : "続きを見る",
            "actions" : [
                {
                    "type" : "postback",
                    "label" : "はい",
                    "data" : "BSCENARIO_" + current_scenario +"_" + connect_scenario_yes + "_-1_44Gv44GE"
                },
                {
                    "type" : "postback",
                    "label" : "いいえ",
                    "data" : "BSCENARIO_" + current_scenario +"_" + connect_scenario_no + "_-1_44Gv44GE"
                }
            ]
        }
    };

    request(request_body, function (error, response, body) {
        console.log("error=", error);
        console.log("response.statusCode=", response.statusCode);
        //console.log(body);
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var columns = [];
                var ModelIDArr = [];
                for(var i = 0; i < records.length; i++){
                    var row = records[i];
                    var modelID = row.ModelID.value;
                    ModelIDArr.push('"' + modelID +'"');
                }
                getProfileData(ModelIDArr, offset, function (next, profileArr, WatchIDArr, totalCount) {
                    if(next){
                        getAllBrand(function (brandArr) {
                            getWatchState(WatchIDArr, function (stateArr) {
                                getWatchModel(ModelIDArr, function (modelArr) {
                                    Object.keys(profileArr).forEach(function(WatchID) {
                                        var column = {};
                                        var tmp = profileArr[WatchID];

                                        var CoverPicture1_azure_link = "https://botchan.blob.core.windows.net/production/uploads/5d1e0914a24a61366b601547/5d6e78f2137d2.png";
                                        if(tmp.CoverPicture1_azure_link && tmp.CoverPicture1_azure_link.value && tmp.CoverPicture1_azure_link.value.length > 0){
                                            CoverPicture1_azure_link = tmp.CoverPicture1_azure_link.value;
                                        }

                                        column.thumbnailImageUrl = CoverPicture1_azure_link;
                                        var base64_watchid = base64Encode(WatchID, '-1');
                                        column.actions = [
                                            {
                                                "type" : "uri",
                                                "label" : "詳細を表示する",
                                                "uri" : liff_url + WatchID
                                            }
                                            //{
                                            //    "type" : "postback",
                                            //    "label" : "この商品を借りる",
                                            //    "data" : "BSCENARIO_" + current_scenario + "_" + connect_scenario_rent + "_" + variable_mension_id + "_" + base64_watchid
                                            //},
                                            //{
                                            //    "type" : "postback",
                                            //    "label" : "お気に入りへ追加",
                                            //    "data" : "BSCENARIO_" + current_scenario + "_" + connect_scenario_bookmark + "_" + variable_id + "_" + base64_watchid
                                            //}
                                        ];
                                        var ModelID = tmp.ModelID;
                                        var name = "";
                                        var Rent4w = "";
                                        if(modelArr[ModelID]){
                                            var model = modelArr[ModelID];
                                            var BrandID = model.BrandID;
                                            name = model.name;
                                            if(brandArr[BrandID]){
                                                column.title = brandArr[BrandID];
                                            }else{
                                                column.title = "その他";
                                            }
                                        }
                                        if(stateArr[WatchID]){
                                            var state = stateArr[WatchID];
                                            Rent4w = state.Rent4w;
                                        }
                                        column.text = name.substr(0,30) + " | " +  "¥" + Rent4w;
                                        columns.push(column);
                                    });


                                    var isPaging = false;
                                    if(totalCount > 5 && parseInt(offset) +5 < totalCount){
                                        offset = parseInt(offset) +5;
                                        isPaging = true;
                                    }else{
                                        offset = 0;
                                    }
                                    if(isPaging){
                                        var next_action = {
                                            "thumbnailImageUrl": next_image,
                                            "imageBackgroundColor": "#FFFFFF",
                                            "title": "続きを見る",
                                            "text": "次の商品を見ます",
                                            "actions": [
                                                {
                                                    "type": "postback",
                                                    "label": "続きを見る",
                                                    "displayText": "続きを見る",
                                                    "data" : "BSCENARIO_current_connect_続きを見る"
                                                }
                                            ]
                                        };
                                        var returnedTarget = Object.assign({}, next_action);
                                        returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("current", current_scenario);
                                        returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("connect", connect_scenario_yes);
                                        columns.push(returnedTarget);
                                    }
                                    var message = [];
                                    var carousel =  {
                                        "type" : "template",
                                        "altText" : "商品リスト",
                                        "template" : {
                                            "type" : "carousel",
                                            "columns" : columns,
                                            "imageAspectRatio": "square"
                                        }
                                    };
                                    message.push(carousel);
                                    //if(isPaging){
                                    //    message.push(next_result);
                                    //}
                                    console.log('new offset===', offset);
                                    res.json({
                                        message: message,
                                        count: offset
                                    });
                                });
                            });
                        });
                    }else{
                        res.status(200).json(result);
                    }
                });
            }else{
                res.status(200).json(result);
            }
        }else {
            res.status(200).json(result);
        }
    });
});

router.post('/getNewItem', function(req, res, next){
    var body = req.body;
    console.log("getNewItem", body);
    var offset = (typeof body.offset != 'undefined') ? body.offset : 0;

    var current_scenario = typeof body.current_scenario !== "undefined" ? body.current_scenario : -1;
    var connect_scenario_yes = typeof body.connect_scenario_yes !== "undefined" ? body.connect_scenario_yes : -1;
    var connect_scenario_no = typeof body.connect_scenario_no !== "undefined" ? body.connect_scenario_no : -1;

    var connect_scenario_rent = typeof body.connect_scenario_rent !== "undefined" ? body.connect_scenario_rent : -1;
    var connect_scenario_bookmark = typeof body.connect_scenario_bookmark !== "undefined" ? body.connect_scenario_bookmark : -1;
    var variable_id = (typeof body.variable_id !== "undefined") ? body.variable_id : -1;
    var variable_mension_id = (typeof body.variable_mension_id !== "undefined") ? body.variable_mension_id : -1;
    var liff_url = (typeof body.liff_url !== "undefined") ? body.liff_url : "";

    var headers = {
        'X-Cybozu-API-Token' : profile_app_token
    };
    var query = 'order by RegistrationDate desc limit 5 offset ' + offset;
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app=" + profile_app_id + "&query=" + query,
        headers: headers,
        method: "GET",
        json: true
    };

    var no_result = {
        message: {
            "type": "text",
            "text": "データーがありません。"
        },
        count: 0
    };
    var next_result = {
        "type" : "template",
        "altText" : "続きを見る",
        "template" : {
            "type" : "confirm",
            "text" : "続きを見る",
            "actions" : [
                {
                    "type" : "postback",
                    "label" : "はい",
                    "displayText": "はい",
                    "data" : "BSCENARIO_" + current_scenario +"_" + connect_scenario_yes + "_-1_44Gv44GE"
                },
                {
                    "type" : "postback",
                    "label" : "いいえ",
                    "displayText": "いいえ",
                    "data" : "BSCENARIO_" + current_scenario +"_" + connect_scenario_no + "_-1_44Gv44GE"
                }
            ]
        }
    };

    getAllBrand(function (brandArr) {
        request(request_body, function (error, response, body) {
            console.log("error=", error);
            console.log("response.statusCode=", response.statusCode);
            console.log('Total===========', body.totalCount);
            //console.log(body);
            var totalCount = body.totalCount;
            if (!error && response.statusCode == 200){
                if(totalCount > 0){
                    var records = body.records;
                    var columns = [];
                    var WatchIDArr = [];
                    var ModelIDArr = [];
                    for(var i = 0; i < records.length; i++){
                        var row = records[i];
                        var ModelID = row.ModelID.value;
                        var WatchID = row.WatchID.value;
                        console.log("WatchID=", WatchID);
                        WatchIDArr.push(WatchID);
                        ModelIDArr.push(ModelID);

                        var base64_watchid = base64Encode(WatchID, '-1');
                        var image_url = "https://botchan.blob.core.windows.net/production/uploads/5d1e0914a24a61366b601547/5d6e78f2137d2.png";
                        if(row.CoverPicture1_azure_link && row.CoverPicture1_azure_link.value && row.CoverPicture1_azure_link.value.length > 0){
                            image_url = row.CoverPicture1_azure_link.value;
                        }
                        var  result = {
                            "thumbnailImageUrl" : image_url
                        };
                        result.actions = [
                            {
                                "type" : "uri",
                                "label" : "詳細を表示する",
                                "uri" : liff_url + WatchID
                            }
                            //{
                            //    "type" : "postback",
                            //    "label" : "この商品を借りる",
                            //    "data" : "BSCENARIO_" + current_scenario + "_" + connect_scenario_rent + "_" + variable_mension_id + "_" + base64_watchid
                            //},
                            //{
                            //    "type" : "postback",
                            //    "label" : "お気に入りへ追加",
                            //    "data" : "BSCENARIO_" + current_scenario + "_" + connect_scenario_bookmark + "_" + variable_id + "_" + base64_watchid
                            //}
                        ];

                        var index_result = WatchID + "_" + ModelID;
                        columns[index_result] = result;

                    }
                    getWatchState(WatchIDArr, function (stateArr) {
                        getWatchModel(ModelIDArr, function (modelArr) {
                            var msg_arr = [];
                            Object.keys(columns).forEach(function(key) {
                                var tmp = columns[key];
                                console.log("key=", key);
                                var arr = key.split("_");
                                var WatchID = arr[0];
                                var ModelID = arr[1];
                                var name = "";
                                var Rent4w = "";
                                if(modelArr[ModelID]){
                                    var model = modelArr[ModelID];
                                    var BrandID = model.BrandID;
                                    name = model.name;
                                    if(brandArr[BrandID]){
                                        tmp.title = brandArr[BrandID];
                                    }else{
                                        tmp.title = "その他";
                                    }
                                }
                                if(stateArr[WatchID]){
                                    var state = stateArr[WatchID];
                                    Rent4w = state.Rent4w;
                                }
                                tmp.text = name.substr(0,25) + " | " +  "¥" + Rent4w;
                                msg_arr.push(tmp);
                            });


                            var isPaging = false;
                            if(totalCount > 5 && parseInt(offset) +5 < totalCount){
                                offset = parseInt(offset) +5;
                                isPaging = true;
                            }else{
                                offset = 0;
                            }
                            if(isPaging){
                                var next_action = {
                                    "thumbnailImageUrl": next_image,
                                    "imageBackgroundColor": "#FFFFFF",
                                    "title": "続きを見る",
                                    "text": "次の商品を見ます",
                                    "actions": [
                                        {
                                            "type": "postback",
                                            "label": "続きを見る",
                                            "displayText": "続きを見る",
                                            "data" : "BSCENARIO_current_connect_続きを見る"
                                        }
                                    ]
                                };
                                var returnedTarget = Object.assign({}, next_action);
                                returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("current", current_scenario);
                                returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("connect", connect_scenario_yes);
                                msg_arr.push(returnedTarget);
                            }

                            var message = [];
                            var carousel =  {
                                "type" : "template",
                                "altText" : "新着リスト",
                                "template" : {
                                    "type" : "carousel",
                                    "columns" : msg_arr,
                                    "imageAspectRatio": "square"
                                }
                            };
                            message.push(carousel);
                            //if(isPaging){
                            //    message.push(next_result);
                            //}
                            console.log('new offset===', offset);
                            res.json({
                                message: message,
                                count: offset
                            });
                        });
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

router.post('/getNewItemApi', function(req, res, next){
    var body = req.body;
    //console.log("getNewItem", body);
    var offset = (typeof body.offset != 'undefined') ? body.offset : 0;

    var current_scenario = typeof body.current_scenario !== "undefined" ? body.current_scenario : -1;
    var connect_scenario_yes = typeof body.connect_scenario_yes !== "undefined" ? body.connect_scenario_yes : -1;
    var connect_scenario_no = typeof body.connect_scenario_no !== "undefined" ? body.connect_scenario_no : -1;

    var connect_scenario_rent = typeof body.connect_scenario_rent !== "undefined" ? body.connect_scenario_rent : -1;
    var connect_scenario_bookmark = typeof body.connect_scenario_bookmark !== "undefined" ? body.connect_scenario_bookmark : -1;
    var variable_id = (typeof body.variable_id !== "undefined") ? body.variable_id : -1;
    var variable_mension_id = (typeof body.variable_mension_id !== "undefined") ? body.variable_mension_id : -1;
    var liff_url = (typeof body.liff_url !== "undefined") ? body.liff_url : "";
    var lineid = (typeof body.lineid !== "undefined") ? body.lineid : "";

    var headers = {
        'Content-Type' : "application/json"
    };
    var body_request = {
        lineid: lineid,
        offset: offset
    };


    var request_body = {
        uri: api_new_list_url,
        headers: headers,
        method: "POST",
        json: body_request
    };

    var no_result = {
        message: {
            "type": "text",
            "text": "データーがありません。"
        },
        count: 0
    };
    request(request_body, function (error, response, body) {
        //console.log("error=", error);
        //console.log("response.statusCode=", response.statusCode);
        if (!error && response.statusCode == 200){
            var data = body.data;
            var isPaging = body.next_flg;
            //console.log(data);
            if(data.length > 0){
                var msg_arr = [];
                for(var i = 0; i < data.length; i++){
                    //{"brand_name":"FRANCK MULLER","model_name":"カサブランカ","rent_42":"15000","image_url":"https://staging.matchwatch.jp/filex/watches/53/0053a.jpg","watch_id":"53"}
                    var row = data[i];
                    //console.log(row);
                    var  result = {
                         title: row.brand_name,
                         text: row.model_name.substr(0,25) + " | " +  currencyFormatter.format(row.rent_42, { code: 'JPY' }),
                         thumbnailImageUrl: row.image_url
                    };
                    result.actions = [
                        {
                            "type" : "uri",
                            "label" : "詳細を表示する",
                            "uri" : liff_url + row.watch_id
                        }
                    ];
                    msg_arr.push(result);
                }


                if(isPaging){
                    var next_action = {
                        "thumbnailImageUrl": next_image,
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "続きを見る",
                        "text": "次の商品を見ます",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "続きを見る",
                                "displayText": "続きを見る",
                                "data" : "BSCENARIO_current_connect_続きを見る"
                            }
                        ]
                    };
                    var returnedTarget = Object.assign({}, next_action);
                    returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("current", current_scenario);
                    returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("connect", connect_scenario_yes);
                    msg_arr.push(returnedTarget);
                }

                var message = [];
                var carousel =  {
                    "type" : "template",
                    "altText" : "新着リスト",
                    "template" : {
                        "type" : "carousel",
                        "columns" : msg_arr,
                        "imageAspectRatio": "square"
                    }
                };
                message.push(carousel);
                //if(isPaging){
                //    message.push(next_result);
                //}
                //console.log('new offset===', offset);
                if(isPaging){
                    offset = parseInt(offset) + data.length;
                }else{
                    offset = 0;
                }
                res.json({
                    message: message,
                    count: offset
                });
            }else{
                res.status(200).json(no_result);
            }
        }else {
            res.status(200).json(no_result);
        }
    });


});

router.post('/getRecomendItem', function(req, res, next){
    var body = req.body;
    console.log("getNewItem", body);
    var offset = (typeof body.offset != 'undefined') ? body.offset : 0;

    var current_scenario = typeof body.current_scenario !== "undefined" ? body.current_scenario : -1;
    var connect_scenario_yes = typeof body.connect_scenario_yes !== "undefined" ? body.connect_scenario_yes : -1;
    var connect_scenario_no = typeof body.connect_scenario_no !== "undefined" ? body.connect_scenario_no : -1;

    var connect_scenario_rent = typeof body.connect_scenario_rent !== "undefined" ? body.connect_scenario_rent : -1;
    var connect_scenario_bookmark = typeof body.connect_scenario_bookmark !== "undefined" ? body.connect_scenario_bookmark : -1;
    var variable_id = (typeof body.variable_id !== "undefined") ? body.variable_id : -1;
    var variable_mension_id = (typeof body.variable_mension_id !== "undefined") ? body.variable_mension_id : -1;
    var liff_url = (typeof body.liff_url !== "undefined") ? body.liff_url : "";

    var headers = {
        'X-Cybozu-API-Token' : profile_app_token
    };
    var query = 'Recommend in ("True") order by RegistrationDate desc limit 5 offset ' + offset;
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app=" + profile_app_id + "&query=" + query,
        headers: headers,
        method: "GET",
        json: true
    };

    var no_result = {
        message: {
            "type": "text",
            "text": "データーがありません。"
        },
        count: 0
    };
    //var next_result = {
    //    "type" : "template",
    //    "altText" : "続きを見る",
    //    "template" : {
    //        "type" : "confirm",
    //        "text" : "続きを見る",
    //        "actions" : [
    //            {
    //                "type" : "postback",
    //                "label" : "はい",
    //                "data" : "BSCENARIO_" + current_scenario +"_" + connect_scenario_yes + "_-1_44Gv44GE"
    //            },
    //            {
    //                "type" : "postback",
    //                "label" : "いいえ",
    //                "data" : "BSCENARIO_" + current_scenario +"_" + connect_scenario_no + "_-1_44Gv44GE"
    //            }
    //        ]
    //    }
    //};

    getAllBrand(function (brandArr) {
        request(request_body, function (error, response, body) {
            console.log("error=", error);
            console.log("response.statusCode=", response.statusCode);
            console.log('Total===========', body.totalCount);
            //console.log(body);
            var totalCount = body.totalCount;
            if (!error && response.statusCode == 200){
                if(totalCount > 0){
                    var records = body.records;
                    var columns = [];
                    var WatchIDArr = [];
                    var ModelIDArr = [];
                    for(var i = 0; i < records.length; i++){
                        var row = records[i];
                        var ModelID = row.ModelID.value;
                        var WatchID = row.WatchID.value;
                        console.log("WatchID=", WatchID);
                        WatchIDArr.push(WatchID);
                        ModelIDArr.push(ModelID);

                        var base64_watchid = base64Encode(WatchID, '-1');

                        var image_url = "https://botchan.blob.core.windows.net/production/uploads/5d1e0914a24a61366b601547/5d6e78f2137d2.png";
                        if(row.CoverPicture1_azure_link && row.CoverPicture1_azure_link.value && row.CoverPicture1_azure_link.value.length > 0){
                            image_url = row.CoverPicture1_azure_link.value;
                        }

                        var  result = {
                            "thumbnailImageUrl" : image_url
                        };
                        result.actions = [
                            {
                                "type" : "uri",
                                "label" : "詳細を表示する",
                                "uri" : liff_url + WatchID
                            }
                            //{
                            //    "type" : "postback",
                            //    "label" : "この商品を借りる",
                            //    "data" : "BSCENARIO_" + current_scenario + "_" + connect_scenario_rent + "_" + variable_mension_id + "_" + base64_watchid
                            //},
                            //{
                            //    "type" : "postback",
                            //    "label" : "お気に入りへ追加",
                            //    "data" : "BSCENARIO_" + current_scenario + "_" + connect_scenario_bookmark + "_" + variable_id + "_" + base64_watchid
                            //}
                        ];

                        var index_result = WatchID + "_" + ModelID;
                        columns[index_result] = result;

                    }
                    getWatchState(WatchIDArr, function (stateArr) {
                        getWatchModel(ModelIDArr, function (modelArr) {
                            var msg_arr = [];
                            Object.keys(columns).forEach(function(key) {
                                var tmp = columns[key];
                                console.log("key=", key);
                                var arr = key.split("_");
                                var WatchID = arr[0];
                                var ModelID = arr[1];
                                var name = "";
                                var Rent4w = "";
                                if(modelArr[ModelID]){
                                    var model = modelArr[ModelID];
                                    var BrandID = model.BrandID;
                                    name = model.name;
                                    if(brandArr[BrandID]){
                                        tmp.title = brandArr[BrandID];
                                    }else{
                                        tmp.title = "その他";
                                    }
                                }
                                if(stateArr[WatchID]){
                                    var state = stateArr[WatchID];
                                    Rent4w = state.Rent4w;
                                }
                                tmp.text = name.substr(0,25) + " | " +  "¥" + Rent4w;
                                msg_arr.push(tmp);
                            });


                            var isPaging = false;
                            if(totalCount > 5 && parseInt(offset) + 5 < totalCount){
                                offset = parseInt(offset) +5;
                                isPaging = true;
                            }else{
                                offset = 0;
                            }
                            var message = [];
                            if(isPaging){
                                var next_action = {
                                    "thumbnailImageUrl": next_image,
                                    "imageBackgroundColor": "#FFFFFF",
                                    "title": "続きを見る",
                                    "text": "次の商品を見ます",
                                    "actions": [
                                        {
                                            "type": "postback",
                                            "label": "続きを見る",
                                            "displayText": "続きを見る",
                                            "data" : "BSCENARIO_current_connect_続きを見る"
                                        }
                                    ]
                                };
                                var returnedTarget = Object.assign({}, next_action);
                                returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("current", current_scenario);
                                returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("connect", connect_scenario_yes);
                                msg_arr.push(returnedTarget);
                            }
                            var carousel =  {
                                "type" : "template",
                                "altText" : "おすすめリスト",
                                "template" : {
                                    "type" : "carousel",
                                    "columns" : msg_arr,
                                    "imageAspectRatio": "square"
                                }
                            };
                            message.push(carousel);

                            console.log('new offset===', offset);
                            res.json({
                                message: message,
                                count: offset
                            });
                        });
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

router.post('/getBrand', function(req, res, next){
    var body = req.body;
    var offset = (typeof body.offset != 'undefined') ? body.offset : 0;
    var current_scenario = typeof body.current_scenario !== "undefined" ? body.current_scenario : -1;
    var connect_scenario_yes = typeof body.connect_scenario_yes !== "undefined" ? body.connect_scenario_yes : -1;
    var connect_scenario_no = typeof body.connect_scenario_no !== "undefined" ? body.connect_scenario_no : -1;

    var variable_id = (typeof body.variable_id != 'undefined') ? body.variable_id : -1;
    var connect_scenario =  (typeof body.connect_scenario != 'undefined') ? body.connect_scenario : -1;


    var no_result = {
        message: {
            "type": "text",
            "text": "データーがありません。"
        },
        count: 0
    };
    //var next_result = {
    //    "type" : "template",
    //    "altText" : "続きを見る",
    //    "template" : {
    //        "type" : "confirm",
    //        "text" : "続きを見る",
    //        "actions" : [
    //            {
    //                "type" : "postback",
    //                "label" : "はい",
    //                "data" : "BSCENARIO_" + current_scenario +"_" + connect_scenario_yes + "_-1_44Gv44GE"
    //            },
    //            {
    //                "type" : "postback",
    //                "label" : "いいえ",
    //                "data" : "BSCENARIO_" + current_scenario +"_" + connect_scenario_no + "_-1_44Gv44GE"
    //            }
    //        ]
    //    }
    //};

    var headers = {
        'X-Cybozu-API-Token' : brand_app_token
    };
    var query = 'order by BrandID asc limit 5 offset ' + offset;
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app=" + brand_app_id + "&query=" + query,
        headers: headers,
        method: "GET",
        json: true
    };

    request(request_body, function (error, response, body) {
        console.log("error=", error);
        console.log("response.statusCode=", response.statusCode);
        console.log('Total===========', body.totalCount);

        var totalCount = body.totalCount;
        if (!error && response.statusCode == 200){
            if(totalCount > 0){
                var records = body.records;
                var columns = [];
                for(var i = 0; i < records.length; i++){
                    var row = records[i];
                    var brand_id = base64Encode(row.BrandID.value, '-1');
                    var text_carousel = row.NameLong.value;
                    var title_carousel = row.NameShort.value;

                    var  result = {
                        "text" : text_carousel,
                        "thumbnailImageUrl" : row.BrandLogoImage_azure_link.value,
                        "title" : title_carousel
                    };
                    result.actions = [
                        {
                            "type" : "postback",
                            "label" : "商品を見る",
                            "displayText": "商品を見る",
                            "data" : "BSCENARIO_" + current_scenario + "_" + connect_scenario + "_" + variable_id + "_" + brand_id
                        }
                    ];
                    columns.push(result);
                }
                var isPaging = false;
                if(totalCount > 5 && parseInt(offset) + 5 < totalCount){
                    offset = parseInt(offset) + 5;
                    isPaging = true;
                }else{
                    offset = 0;
                }
                if(isPaging){
                    var next_action = {
                        "thumbnailImageUrl": next_image,
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "続きを見る",
                        "text": "次の商品を見ます",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "続きを見る",
                                "displayText": "続きを見る",
                                "data" : "BSCENARIO_current_connect_続きを見る"
                            }
                        ]
                    };
                    var returnedTarget = Object.assign({}, next_action);
                    returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("current", current_scenario);
                    returnedTarget.actions[0].data = returnedTarget.actions[0].data.replace("connect", connect_scenario_yes);
                    columns.push(returnedTarget);
                }

                var message = [];
                var carousel =  {
                    "type" : "template",
                    "altText" : "ブランドリスト",
                    "template" : {
                        "type" : "carousel",
                        "columns" : columns,
                        "imageAspectRatio": "square"
                    }
                };
                message.push(carousel);
                //if(isPaging){
                //    message.push(next_result);
                //}
                console.log('new offset===', offset);
                res.json({
                    message: message,
                    count: offset
                });
            }else{
                res.status(200).json(no_result);
            }
        }else {
            res.status(200).json(no_result);
        }
    });
});

router.post('/getSampleFlex', function(req, res, next){
    var arr =  {
        "type": "bubble",
        "header": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": "明細書"
                }
            ]
        },
        "hero": {
            "type": "image",
            "url": "https://botchan.blob.core.windows.net/matchwatch/kintone_images/20190520140508D59E31C2465347BCB23616E42DBDB9F4241_00000000986134_01.jpg",
            "size": "4xl",
            "aspectRatio": "1:1"
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": "時計名称"
                },
                {
                    "type": "text",
                    "text": "貸出期間（Durationから取得）"
                },
                {
                    "type": "text",
                    "text": "返却期日（EndDateから取得）"
                },
                {
                    "type": "text",
                    "text": "課金額（ActualFeeから取得）"
                },
                {
                    "type": "text",
                    "text": "決済日時"
                }
            ]
        },
        "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": "お客さんへの送付先住所"
                }
            ]
        }
    };
    res.json({
        message: {
            "type" : "flex",
            "altText" : "貸出中",
            "contents" : arr
        }
    });
});

router.post('/addInsurance', function(req, res, next){

    var body = req.body;
    console.log("addInsurance",  body);
    var line_access_token = (typeof body.line_access_token !== 'undefined') ? body.line_access_token : "";
    var media_id = (typeof body.media_id !== 'undefined') ? body.media_id : "";
    var user = (typeof body.username !== 'undefined') ? body.username : "";
    var password  = (typeof body.password !== 'undefined') ? body.password : "";
    var UserID  = (typeof body.UserID !== 'undefined') ? body.UserID : "";

    if(UserID.length == 0){
        res.status(200).json({});
        return;
    }

    var headers = {
        'Authorization': 'Bearer ' + line_access_token
    };

    var get_content_url = "https://api.line.me/v2/bot/message/" + media_id + "/content";
    var kintone_upload_url = "https://matchwatch.cybozu.com/k/v1/file.json";

    request({
        uri: get_content_url,
        method: 'GET',
        headers: headers,
        encoding: null
    }, function (error, response, body) {
        console.log(error);
        console.log(response.statusCode);
        if(!error && response.statusCode && response.statusCode == 200){
            //upload content file to Kintone

            //fs.writeFileSync(`./image11333.png`, new Buffer(body), 'binary');
            //console.log('file saved');
            //res.status(200).json({});
            var type = fileType(Buffer.from(body, 'binary'));
            if(!type){
                res.status(200).json({});
                return;
            }
            var filename = 'matchwatch/' + UserID + type.ext;
            var now = new Date();
            fs.writeFile(filename, new Buffer.from(body), 'binary', function (err) {
                if (err) throw err;
                var api_token = base64Encode(user + ':' + password, '-1');
                var kintone_headers = {
                    'x-cybozu-authorization': api_token,
                    'content-type': 'multipart/form-data'
                };
                var options = {
                    method: 'POST',
                    url: kintone_upload_url,
                    headers: kintone_headers,
                    formData:{
                        file:{
                            value: fs.createReadStream(filename),
                            options: {
                                filename: now.getTime() + "." +  type.ext,
                                contentType: type.mine
                            }
                        }
                    },
                    json: true
                };
                request(options, function (error1, response1, body1) {
                    //console.log(error1);
                    //console.log(response1.statusCode);
                    if(!error && response1.statusCode && response1.statusCode == 200){
                        console.log('body = ', body1);
                        if(body1.fileKey){
                            var body_request = {
                                app: borrower_insurance_app_id,
                                record: {
                                    UserID: {value : UserID},
                                    InsuranceCertificate: {value :
                                        [
                                            {fileKey: body1.fileKey}
                                        ]
                                    }
                                }
                            };
                            var headers = {
                                'X-Cybozu-Authorization' : api_token,
                                'Content-type': 'application/json'
                            };
                            request({
                                uri: 'https://matchwatch.cybozu.com/k/v1/record.json',
                                method: 'POST',
                                headers: headers,
                                json: body_request
                            }, function (error2, response2, body2) {
                                if (!error2 && response2.statusCode && response2.statusCode == 200){
                                    res.status(200).json({});
                                }else{
                                    res.status(200).json({});
                                }
                            });
                        }else{
                            res.status(200).json({});
                        }
                    }else{
                        res.status(200).json({});
                    }
                });
            });
        }else{
            res.status(200).json({});
        }
    });

});

router.post('/getUserSetting', function(req, res, next){
    var body = req.body;
    var user_id = (typeof body.user_id !== 'undefined') ? body.user_id : "";
    var auth_log_status = 1;

    var header_user = {
        'X-Cybozu-API-Token' : user_app_token
    };
    var query_user = 'LINE_ID = "' + user_id + '"';
    var request_body_user = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + user_app_id + "&query=" + query_user,
        headers: header_user,
        method: "GET",
        json: true
    };
    var result = {};
    result.rent_change_address_flg = 0;
    result.user_record_id = -1;
    result.ZIP_Code = "";
    result.ZIP_Code_hyphen = "";
    result.Prefecture = "";
    result.City = "";
    result.StreetNumber = "";
    result.ApartmentRoomNumber = "";
    result.auth_log_status = 0;

    result.LastName = "";
    result.FirstName = "";
    result.Nickname = "";
    result.Wrist = "";
    result.Phone = "";
    result.EMailAddress = "";
    result.Black = "False";
    request(request_body_user, function (error, response, body) {
        console.log("error=", error);
        console.log("response.statusCode=", response.statusCode);
        //console.log(body);
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var user = records[0];
                //console.log("user=", user);
                result.user_record_id = user["$id"].value;

                result.ZIP_Code = user.ZIP_Code.value;
                result.ZIP_Code_hyphen = toPostFmt(user.ZIP_Code.value);
                result.Prefecture = user.Prefecture.value;
                result.City = user.City.value;
                result.StreetNumber = user.StreetNumber.value;
                result.ApartmentRoomNumber = user.ApartmentRoomNumber.value;

                result.LastName = user.LastName.value;
                result.FirstName = user.FirstName.value;
                result.Nickname = user.Nickname.value;
                result.Wrist = user.Wrist.value;
                result.Phone = user.Phone.value;
                result.Black = user.Black.value;
                if(auth_log_status !== 0){
                    var header2 = {
                        'X-Cybozu-API-Token' : auth_log_app_token
                    };
                    var query = 'UserID = "' + result.user_record_id + '"';
                    var request_body = {
                        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + auth_log_app_id + "&query=" + query,
                        headers: header2,
                        method: "GET",
                        json: true
                    };
                    request(request_body, function (error, response, body) {
                        //console.log("error=", error);
                        //console.log("response.statusCode=", response.statusCode);
                        //console.log(body);
                        if (!error && response.statusCode == 200) {
                            var records = body.records;
                            if(records.length > 0) {
                                var row = records[0];
                                result.auth_log_status = row.Status.value;
                                result.EMailAddress = row.EMailAddress.value;
                            }
                        }
                        console.log(result);
                        res.status(200).json(result);
                    });

                }else{
                    res.status(200).json(result);
                }

            }else{
                res.status(200).json(result);
            }
        }else {
            res.status(200).json(result);
        }
    });


});


router.post('/validatePref', function(req, res, next){
    var body = req.body;
    console.log("variadationPref", body);
    var zipcode = typeof body.zipcode !== "undefined" ? body.zipcode.trim() : "";
    Zipcode.findOne({"zipcode" : zipcode},function(err, result) {
        if (result) {
            var prefs = ["東京都", "埼玉県", "千葉県" , "神奈川県"];
            var cities = ["大島町","利島村","新島","神津島村","三宅村","御蔵島村","八丈町","青ヶ島村","小笠原村"];
            var pref = result.pref;
            var city = result.city;
            if(prefs.indexOf(result.pref) == -1){
                res.status(500).json({
                    "error_message" : "もうしわけございません。サービス提供地域外です。現在1都3県に限定サービス中です。"
                });
            }else if(pref == "東京都" && cities.indexOf(city) !== -1){
                res.status(500).json({
                    "error_message" : "もうしわけございません。サービス提供地域外です。現在1都3県に限定サービス中です。"
                });
            }else{
                res.status(200).json({});
            }
        }else{
            res.status(200).json({});
        }
    });
});

router.post('/validateBirthDay', function(req, res, next){
    var body = req.body;
    console.log("validateBirthDay=>", body);
    var birthDay = body.birth_day;
    if(birthDay && birthDay != '' && birthDay != 'undefined') {
        var age = getAge(birthDay);
        console.log("age=>", age);
        if(parseInt(age) >= 25) {
            res.status(200).json({"success" : "success"});
        } else {
            res.status(500).json({
                "error_message" : "Age less than 25 years old"
            });
        }
    } else {
        res.status(500).json({
            "error_message" : "Birth day not exist"
        });
    }
});


function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function getProfileData(ModelIDArr, offset, callback){
    var profileArr = {};
    var WatchIDArr = [];
    var header_profile = {
        'X-Cybozu-API-Token' : profile_app_token
    };
    var query = 'ModelID in (' + ModelIDArr.join(",") + ') order by RegistrationDate desc limit 5 offset ' + offset;
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app=" + profile_app_id + "&query=" + query,
        headers: header_profile,
        method: "GET",
        json: true
    };
    //console.log(request_body);
    request(request_body, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            var totalCount = body.totalCount;
            if(records.length > 0){
                for(var i = 0; i < records.length; i++){
                    var row = records[i];
                    var WatchID = row.WatchID.value;
                    WatchIDArr.push(WatchID);
                    var ModelID = row.ModelID.value;

                    var CoverPicture1_azure_link = "https://botchan.blob.core.windows.net/production/uploads/5d1e0914a24a61366b601547/5d6e78f2137d2.png";
                    if(row.CoverPicture1_azure_link && row.CoverPicture1_azure_link.value && row.CoverPicture1_azure_link.value.length > 0){
                        CoverPicture1_azure_link = row.CoverPicture1_azure_link.value;
                    }
                    //var CoverPicture1_azure_link = row.CoverPicture1_azure_link.value;
                    profileArr[WatchID] = {ModelID: ModelID, CoverPicture1_azure_link: CoverPicture1_azure_link};
                }
                return callback(true, profileArr, WatchIDArr, totalCount);
            }else{
                return callback(false);
            }
        }else{
            return callback(false);
        }
    });
}

function getProfileDataFromWatchIdRent(list_id, callback){
    var query_profile = 'WatchID in (' + list_id.join(",") + ') order by RegistrationDate desc limit 1 offset ' + 0;
    var header_profile = {
        'X-Cybozu-API-Token' : profile_app_token
    };
    var request_body_profile = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app=" + profile_app_id + "&query=" + query_profile,
        headers: header_profile,
        method: "GET",
        json: true
    };

    request(request_body_profile, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            var totalCount = body.totalCount;
            if(records.length > 0){
                var columns = {};
                var ModelIDArr = [];

                for(var i = 0; i < records.length; i++){
                    var row = records[i];
                    var ModelID = row.ModelID.value;
                    var WatchID = row.WatchID.value;
                    ModelIDArr.push('"' + ModelID +'"');

                    var CoverPicture1_azure_link = "https://botchan.blob.core.windows.net/production/uploads/5d1e0914a24a61366b601547/5d6e78f2137d2.png";
                    if(row.CoverPicture1_azure_link && row.CoverPicture1_azure_link.value && row.CoverPicture1_azure_link.value.length > 0){
                        CoverPicture1_azure_link = row.CoverPicture1_azure_link.value;
                    }

                    var  result = {
                        "thumbnailImageUrl" : CoverPicture1_azure_link
                    };
                    var index_result = WatchID + "_" + ModelID;
                    columns[index_result] = result;

                }

                var data = {};

                getWatchModel(ModelIDArr, function (modelArr) {
                    Object.keys(columns).forEach(function(key) {
                        var column = columns[key];
                        var arr = key.split("_");
                        var ModelID = arr[1];
                        var WatchID = arr[0];

                        if(modelArr[ModelID]){
                            var model = modelArr[ModelID];
                            var name = model.name;
                            column.text = name.substr(0,60);
                        }
                        data[WatchID] = column;
                    });
                    return callback(true, data, totalCount);
                });
            }else{
                return callback(false);
            }
        }else{
            return callback(false);
        }
    });
}

function getAllBrand(callback){
    var brandArr = {};
    var headers = {
        'X-Cybozu-API-Token' : brand_app_token
    };
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + brand_app_id,
        headers: headers,
        method: "GET",
        json: true
    };
    request(request_body, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            for(var i = 0; i < records.length; i++){
                var row = records[i];
                var BrandID = row.BrandID.value;
                brandArr[BrandID] = row.NameLong.value;
            }
            return callback(brandArr);
        }else {
            return callback(brandArr);
        }
    });
}

function getWatchState(WatchIDArr, callback) {
    var headers = {
        'X-Cybozu-API-Token' : watch_state_app_token
    };

    var query = 'WatchID in (' + WatchIDArr.join(",") + ')';

    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + watch_state_app_id + "&query=" + query,
        headers: headers,
        method: "GET",
        json: true
    };

    var stateArr = {};
    request(request_body, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                for(var i = 0; i < records.length; i++){
                    var row = records[i];
                    var WatchID = row.WatchID.value;
                    stateArr[WatchID] = {Rent4w: row.Rent4w.value};
                }
            }
        }else {
            console.log('getWatchState エラーが発生しました。');
        }
        return callback(stateArr);
    });
}

function getWatchModel(ModelIDArr, callback) {
    var headers = {
        'X-Cybozu-API-Token' : model_app_token
    };
    var query = 'ModelID in (' + ModelIDArr.join(",") + ')';
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + model_app_id + "&query=" + query,
        headers: headers,
        method: "GET",
        json: true
    };

    var modelArr = {};

    request(request_body, function (error, response, body) {

        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                for(var i = 0; i < records.length; i++){
                    var row = records[i];
                    var ModelID = row.ModelID.value;
                    var BrandID = row.BrandID.value;
                    var name = row.Name.value;
                    modelArr[ModelID] = {name: name, BrandID: BrandID};
                }
            }
        }else {
            console.log('getWatchState エラーが発生しました。');
        }
        return callback(modelArr);
    });
}

function getOneWatchProfile(WatchID, callback) {
    var headers = {
        'X-Cybozu-API-Token' : profile_app_token
    };
    var query = 'WatchID = "' + WatchID +'"';
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + profile_app_id + "&query=" + query,
        headers: headers,
        method: "GET",
        json: true
    };
    var result = {};
    var status = false;
    result.MinimumBandLength = 0;
    result.MaximumBandLength = 0;

    request(request_body, function (error, response, body){
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                status = true;
                var row = records[0];
                if(row.MaximumBandLength.value && row.MaximumBandLength.value.length > 0){
                    result.MaximumBandLength =  parseFloat(row.MaximumBandLength.value) * 100;
                }
                if(row.MinimumBandLength.value && row.MinimumBandLength.value.length > 0){
                    result.MinimumBandLength =  parseFloat(row.MinimumBandLength.value) * 100;
                }
            }
        }
        return callback(status, result);
    });
}

function getWatchProfile(WatchIDArr, offset, callback) {
    var query_profile = 'WatchID in (' + WatchIDArr.join(",") + ') order by RegistrationDate desc limit 5 offset ' + offset;
    var header_profile = {
        'X-Cybozu-API-Token' : profile_app_token
    };
    var request_body_profile = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app=" + profile_app_id + "&query=" + query_profile,
        headers: header_profile,
        method: "GET",
        json: true
    };
    var profileArr = {};
    var modelArr = [];
    request(request_body_profile, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            var totalCount = body.totalCount;
            if(records.length > 0){
                for(var i = 0; i < records.length; i++){
                    var row = records[i];
                    var WatchID = row.WatchID.value;
                    var ModelID = row.ModelID.value;
                    modelArr.push(ModelID);
                    //var CoverPicture1_azure_link = row.CoverPicture1_azure_link.value;

                    var CoverPicture1_azure_link = "https://botchan.blob.core.windows.net/production/uploads/5d1e0914a24a61366b601547/5d6e78f2137d2.png";
                    if(row.CoverPicture1_azure_link && row.CoverPicture1_azure_link.value && row.CoverPicture1_azure_link.value.length > 0){
                        CoverPicture1_azure_link = row.CoverPicture1_azure_link.value;
                    }

                    profileArr[WatchID] = {ModelID: ModelID, CoverPicture1_azure_link: CoverPicture1_azure_link};
                }
                return callback(true, profileArr, modelArr, totalCount);
            }else{
                return callback(false);
            }
        }else{
            return callback(false);
        }
    });
}

function getTitle(model_id, callback) {
    var headers = {
        'X-Cybozu-API-Token' : model_app_token
    };
    var request_body = {
        uri: "https://matchwatch.cybozu.com/k/v1/records.json?app=" + model_app_id + "&query=ModelID=" + '"' + model_id + '"',
        headers: headers,
        method: "GET",
        json: true
    };

    var name = '';
    var brand_id = '';
    request(request_body, function (error, response, body) {
        if (!error && response.statusCode == 200){
            var records = body.records;
            if(records.length > 0){
                var row = records[0];
                name = row.Name.value.substr(0,40);
                brand_id = row.BrandID.value;
            }
        }else {
            console.log('エラーが発生しました。');
        }
        return callback(name, brand_id);
    });
}

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

// insuranceCertificate("1");
function insuranceCertificate(params){
    var messageId = params.messageId;
    var access_token  = params.access_token;
    var user  = params.user;
    var password  = params.password;
    var api_token = base64Encode(user + ':' + password, '-1');
    //test
    messageId = "10014913554273";
    access_token  = "AZJAaBFLXx8MuY/EpBy4zXxMW8X0edNO5qfhmC79Mo2cr59l5qzKRZiMpEjOt3EjbekrEMHt7r9B+UkMR5oHWX8wp/DGZSaYWYqRE8lo1SemXqBhPwdfvlfMfQBm2F4zI3Us9HNO/atYyg8q4+uirQdB04t89/1O/w1cDnyilFU=";
    api_token = base64Encode('t-kiso@wevnal.co.jp:Dogbert0', '-1');
    //get message content
    var headers = {
        'Authorization': 'Bearer ' + access_token
    };
    var kintone_headers = {
        'x-cybozu-authorization': api_token,
        'content-type': 'multipart/form-data'
    };
    var get_content_url = "https://api.line.me/v2/bot/message/" + messageId + "/content";
    var kintone_upload_url = "https://matchwatch.cybozu.com/k/v1/file.json";
    var result = {
        status: false,
        fileKey: ''
    };

    request({
        uri: get_content_url,
        method: 'GET',
        headers: headers
    }, function (error, response, body) {
        if(!error){
            //upload content file to Kintone
            fs.writeFile('matchwatch_content.txt', body, function (err) {
                if (err) throw err;
                var options = {
                    method: 'POST',
                    url: kintone_upload_url,
                    headers: kintone_headers,
                    formData:{
                        file:{
                            value: fs.createReadStream("matchwatch_content.txt"),
                            options: {
                                filename: 'matchwatch_content.txt',
                                contentType: null
                            }
                        }
                    }
                };

                request(options, function (error1, response1, body1) {
                    if (error1) throw new Error(error);
                    body1 = JSON.parse(body1);
                    console.log('body = ', body1);
                    if(body1.fileKey){
                        result.status = true;
                        result.fileKey = body1.fileKey;
                    }
                    console.log('result', result);
                    return result;
                });
            });
        }
    });
}
module.exports = router;
