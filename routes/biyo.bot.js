// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var model = require('../model');
const config = require('config');
const appEnv = config.get('appEnv');
var Connect = model.Connect;
var ConnectPage = model.ConnectPage;
var Variable = model.Variable;
var Scenario = model.Scenario;
var BotMessage = model.BotMessage;
var Exception = model.Exception;
var EfoUserProfile = model.EfoUserProfile;
var Api = model.Api;
const api_url_1 = "https://api.botchan.chat/api/biyo/addPointFromEfo";
const api_url_2 = "https://api.botchan.chat/api/biyo/checkAnswer";
const api_url_5 = "https://api.botchan.chat/api/biyo/anketConfirm";

const request = require('request');
const sns_type = "006";
const app_id_root = {
    'local': 12,
    'botchan': 7,
};
const user_app_id = 8;
const user_app_token = "v0uerOENnLNTY9plZUIb6KSHz0pmtzPmSeCsqSBp";
const max_app_line = 30;
const app_token_root = {
    'local': "FpUHdmLFEW4L7fUs8zqcAmCALdfR8fOwwwXRC2z5",
    'botchan': "dCxCytU1jvB3hmV3uop31P7i8HbSdBYqvo4TXLN2",
}
const user_pass_b64 = 'cy53YXRhbmFiZUBqYWJzLm9yLmpwOnlhbWFtb3Rva2F0b3V3YXRhbmFiZTIwMTk=';
const line_token = 'BDGDWdx4ItqBifCVkIBNB68UYwTTrScR0uNMTFJns6CQPlWH3QeFpMHyLsbVfWHR6TWOqNNdRR+aRUkwWwXPmZWZevfvn5Wi8pZ5is9fRXANHOCCoX2ctlv7Xmtls85MeNW0fplFNlQMxqhfBwAvy1GUYhWQfeY8sLGRXgo3xvw=';
const picture_name = "biyo_logo.png";
const timezone_code = "021";
const timezone_value = "Asia/Tokyo";
const url_liff = {
    "local": "https://embot.local.vn/efo?connect_page_id=",
    "botchan": "https://app.botchan.chat/efo?connect_page_id="
}
const url_bot = {
    "local": "http://embot.local.vn/bot/",
    "botchan": "https://admin.botchan.chat/bot/"
}
const user_info = {
    "local": {
        user_id: '594caab0a787bbb9b61cea4c'
    },
    "botchan": {
        user_id: '5d2d2a0ea24a61078e734e47'
    }
}
const user_name = 's.watanabe@jabs.or.jp';
const last_message = 'アンケートにご回答いただき、ありがとうございしました。';
const line_message = 'ご回答いただきありがとうございます👍✨';
const efo_web_embed_iframe_setting = {
    "lang": "ja",
    "title": "",
    "sp_title": "",
    "sub_title": "",
    "color_code": "007",
    "width": "370",
    "height": "550",
    "design_type": "004",
    "show_onload": 0,
    "time_show_onload": "0",
    "close_to_hide": 0,
    "show_chat_avatar": 1,
    "custom_css": "",
    "custom_css_sp": "",
    "sp_display_position": "001",
    "pc_icon_type": "001",
    "sp_icon_type": "001",
    "cv_complete_hide_flg": 0,
    "cv_complete_time": 1,
    "conversation_end_close": 1,
    "conversation_end_close_time": "0",
    "pc_icon_display_type": "001",
    "pc_display_position": "001",
    "pc_icon_left_right": "10",
    "pc_icon_bottom": "10",
    "sp_icon_display_type": "002",
    "sp_icon_left_right": "10",
    "sp_icon_bottom": "10",
    "default_delay_time": 150,
};
var express = require('express');
var getRequest = (request_body_user) => {
    return new Promise((resolve, reject) => {
        request(request_body_user, (error, response, body) => {
            //console.log(error, body);
            if (error) {
                console.log('Have error when request get', error);
                reject(error)
            }
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
        });
    });
}
var postRequest = (url, param, headers) => {
    return new Promise(function (resolve, reject) {
        request.post({
            headers: headers,
            url: url,
            body: JSON.stringify(param)
        }, function (error, response, body) {
            if (error)
                reject(error)
            else {
                console.log('response is', body);
                resolve(JSON.parse(body));
            }
        });
    });
}
var makeSecret = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
var validateInput = (body, key, value_default = "") => {
    let result = value_default;
    if (typeof body[key] !== "undefined") {
        result = body[key];
    } else {
        console.log(" Don't have data input ---> " + key);
    }
    return result;
}
class biyoBot {
    constructor() {
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/checkMasterInquiry', async (req, res, next) => {
            console.log('in hear');
            var list_record = await this.getListRecord();
            var checkLine = await this.checkNumbLine(list_record.records);
            if (checkLine) {
                list_record.records.forEach(record => {
                    var app_id = this.getAppID(record['anket_app_url'].value);
                    var inquiry_master_id = record['レコード番号'] ? record['レコード番号'].value : 0;
                    var is_public = (record['public_status'] && record['public_status'].value == "公開") ? true : false;
                    if (app_id && is_public && (record['efo_status'].value == '再作成' || record['efo_status'].value == '未作成')) {
                        console.log('run ', app_id);
                        this.run(app_id, inquiry_master_id, record);
                    }
                });
            } else {
                console.log('number line app grather than', max_app_line);
            }

            res.status(200).json({
                "message": 'Send ok'
            });
        });
    }

    getAppID(link_url) {
        var result = "";
        if (link_url.includes("https://jabs41.cybozu.com/k/")) {
            var list_result = link_url.split("/");
            if (list_result.length > 5) {
                result = list_result[4];
            }
        }
        return result;
    }

    async getListRecord() {
        return new Promise(async (resolve, reject) => {
            var header_rent = {
                'X-Cybozu-API-Token': app_token_root[appEnv]
            };
            var request_body_user = {
                uri: "https://jabs41.cybozu.com/k/v1/records.json?app=" + app_id_root[appEnv],
                headers: header_rent,
                method: "GET",
                json: true
            };

            //console.log(request_body_user);
            var list_record = await getRequest(request_body_user);
            //console.log(list_record);
            resolve(list_record);
        });
    }

    async run(app_id, inquiry_master_id, record) {
        var header_rent = {
            'X-Cybozu-Authorization': user_pass_b64
        };
        var request_body_user = {
            uri: "https://jabs41.cybozu.com/k/v1/app.json?id=" + app_id,
            headers: header_rent,
            method: "GET",
            json: true
        };
        var app_info = await getRequest(request_body_user);
        request_body_user.uri = "https://jabs41.cybozu.com/k/v1/form.json?app=" + app_id;
        var list_field_info = await getRequest(request_body_user);
        if (app_info.name && list_field_info.properties) {
            this.createBot(app_info.name, list_field_info.properties, inquiry_master_id, app_id, record);
        } else {
            console.log("Can't get info of app and variable", app_id);
        }
    }

    async createBot(app_name, list_field, inquiry_master_id, app_id, record) {
        var connect_exit = await this.checkExitConnect();
        //console.log('connect_exit is', connect_exit);
        if (connect_exit) {
            this.createNewBot(app_name, list_field, connect_exit.id, inquiry_master_id, app_id, record);
        } else {
            var connect_insert = {
                'email': '',
                'sns_id': '',
                'bot_name': 'EFO WebEmbed',
                'type': sns_type,
                'user_id': user_info[appEnv].user_id,
            }
            var connect_data = new Connect(connect_insert);
            connect_data.save((err, result) => {
                if (err) throw err;
                if (result) {
                    this.createNewBot(app_name, list_field, result.id, inquiry_master_id, app_id, record);
                }
            });
        }
    }

    //createNewBot
    async createNewBot(app_name, list_field, connect_id, inquiry_master_id, app_id, record) {
        var exit_bot = await this.checkExitBot(connect_id, app_name, record);
        if (exit_bot) {
            console.log('in exit bot', exit_bot);
            var update_bot = await this.updateBot(exit_bot, record);
            var clear_cookie = await this.clearCookieUser(exit_bot);
            if (clear_cookie) {
                console.log('Cookie bot ' + exit_bot.id + ' is clear');
            }
            //setContentBot
            this.setContentBot(exit_bot, list_field, inquiry_master_id, app_id, record);
        } else {
            let setting_info = efo_web_embed_iframe_setting;
            setting_info.title = record['formName'].value;
            var connect_page_insert = {
                'connect_id': connect_id,
                'page_name': app_name,
                'sns_type': sns_type,
                'picture': picture_name,
                'timezone_code': timezone_code,
                'timezone_value': timezone_value,
                'setting': setting_info,
                'secret_key': makeSecret(32),
            };
            console.log('connect_page_data', connect_page_insert, connect_id);
            //Add variale 
            var connect_page_data = new ConnectPage(connect_page_insert);
            connect_page_data.save((err, result) => {
                if (err) {
                    console.log('Can not create new bot in DB', connect_page_insert)
                } else {
                    console.log('bot is insert', result);
                    this.setContentBot(result, list_field, inquiry_master_id, app_id, record);
                }
            });
        }
    }

    async saveAfterDone(bot, liff_url, inquiry_master_id, record) {
        console.log('liff url is', liff_url);
        let efo_scenario_url = url_bot[appEnv] + bot.id + '/scenario'
        let efo_bot_id = bot.id
        let content_record = {
            liff_url: { value: liff_url },
            efo_status: { value: '作成済' },
            efo_scenario_url: { value: efo_scenario_url },
            efo_bot_id: { value: efo_bot_id }
        };
        //console.log('content update ', content_record);
        var up_record = await this.updateRecord(record, content_record);
        if (up_record && appEnv != 'local') {
            var inquiry_name = (record['formName'] && record['formName'].value) ? record['formName'].value : "";
            this.callSendLinePushAPI(liff_url, inquiry_name, line_token);
        }
    }

    async setLIFF(bot) {
        var connect_page_id = bot.id;
        var bodyData = {
            "view": {
                "type": "tall",
                "url": url_liff[appEnv] + connect_page_id
            }
        };
        var headers = {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + line_token
        };
        var url = 'https://api.line.me/liff/v1/apps';
        var result = await postRequest(url, bodyData, headers);
        console.log('liff result is', result);
        var liff_id = result.liffId ? result.liffId : "";
        var liff_url = liff_id ? 'line://app/' + liff_id : "";
        var liff_setting = {
            'type': '002',
            'liff_id': liff_id,
            'liff_url': liff_url,
            'screen_size': 'tall',
            'channel_access_token': line_token,
            'send_message': "001"
        };
        return new Promise((resolve, reject) => {
            ConnectPage.findOneAndUpdate({ _id: connect_page_id }, {
                $set: {
                    liff_setting: liff_setting,
                    updated_at: new Date()
                }
            }, { upsert: false, multi: false }, function (err, result) {
                if (err) {
                    console.log('Have error whene update liff setting');
                    reject(err);
                } else {
                    console.log('update liff setting ok');
                    resolve(liff_url);
                }
            });
        });
    }

    async updateBot(bot, record) {
        var connect_page_id = bot.id;
        let setting_info = efo_web_embed_iframe_setting;
        setting_info.title = record['formName'].value;
        setting_info.sub_title = "";
        setting_info.color_code = "007";
        setting_info.design_type = "004";
        return new Promise((resolve, reject) => {
            ConnectPage.findOneAndUpdate({ _id: connect_page_id }, {
                $set: {
                    setting: setting_info,
                    picture: picture_name,
                    updated_at: new Date()
                }
            }, { upsert: false, multi: false }, function (err, result) {
                if (err) {
                    console.log('Have error whene update liff setting');
                    reject(err);
                } else {
                    console.log('update liff setting ok');
                    resolve(result);
                }
            });
        });
    }

    async checkNumbLine(list_record) {
        console.log("checkNumbLine");
        var header_rent = {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + line_token
        };
        var request_body_user = {
            uri: "https://api.line.me/liff/v1/apps",
            headers: header_rent,
            method: "GET",
            json: true
        };

        console.log(request_body_user);

        var list_app = await getRequest(request_body_user);
        //console.log(list_app);
        var number_app_line = list_app.apps ? list_app.apps.length : 0;
        //console.log('number app line is ', number_app_line);
        var result = false;
        if (number_app_line >= max_app_line) {
            if (list_record.filter(record => record.end_date && record.end_date.value && record.liff_url && record.liff_url.value).length) {
                var record_oldest = list_record.filter(record => record.end_date && record.end_date.value && record.liff_url && record.liff_url.value).reduce(function (prev, current) {
                    return (prev.end_date.value < current.end_date.value) ? prev : current
                });
                if (record_oldest) {
                    let liff_url = record_oldest.liff_url.value;
                    let liff_id = liff_url.replace("line://app/", "");
                    var de_app_line = await this.deleteAppLine(liff_id);
                    if (de_app_line) {
                        //update record 
                        let content_record = {
                            liff_url: { value: "" }
                        };
                        var up_record = await this.updateRecord(record_oldest, content_record);
                    }
                }
            }
        } else {
            result = true;
        }

        return new Promise((resolve, reject) => {
            resolve(result);
        });
    }

    async clearCookieUser(bot) {
        //console.log('EfoUserProfile', bot.id);
        return new Promise((resolve, reject) => {
            EfoUserProfile.updateMany({ 'connect_page_id': bot.id }, {
                $set: {
                    new_flg: 1,
                    updated_at: new Date()
                }
            }, { upsert: false }, function (err, result) {
                if (err) {
                    console.log('Have error whene update efo user profile ');
                    reject(err);
                } else {
                    //console.log('EfoUserProfile', result);
                    console.log('update efor user profile setting ok');
                    resolve(result);
                }
            });
        });
    }

    deleteAppLine(liff_id) {
        return new Promise((resolve, reject) => {
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + line_token
            };

            var uri = "https://api.line.me/liff/v1/apps/" + liff_id;
            console.log('liff DELETE is ', uri);
            request({
                uri: uri,
                method: 'DELETE',
                headers: headers
            }, (error1, response, body) => {
                console.log('delete liff ok !!!', body);
                resolve(true);
            });
        });
    }

    updateRecord(record, content_record) {
        var inquiry_master_id = record['レコード番号'] ? record['レコード番号'].value : 0;
        var body_request3 = {
            app: app_id_root[appEnv],
            id: Number(inquiry_master_id),
            record: content_record
        };
        var headers3 = {
            'Content-Type': 'application/json',
            'X-Cybozu-Authorization': user_pass_b64
        };

        return new Promise((resolve, reject) => {
            request({
                uri: 'https://jabs41.cybozu.com/k/v1/record.json',
                method: 'PUT',
                headers: headers3,
                json: body_request3
            }, (error1, response, body) => {
                //console.log('update content record done !!!', record);
                resolve(true);
            });
        });
    }

    checkLiffExit(bot) {
        return new Promise((resolve, reject) => {
            ConnectPage.findOne({
                '_id': bot.id
            }, (err, res) => {
                if (err) {
                    console.log('Have error when check connect api', err);
                    reject(err)
                } else {
                    //console.log('res liff is', res);
                    if (res && res.liff_setting && res.liff_setting.liff_url) {
                        resolve(res.liff_setting.liff_url);
                    } else {
                        resolve(false);
                    }
                }
            })
        });
    }

    async setContentBot(bot, list_field, inquiry_master_id, app_id, record) {
        var add_variable = await this.addVariableForBot(bot, list_field, app_id, inquiry_master_id);
        console.log('add variable is', add_variable);
        console.log('start sleep', new Date().toISOString());
        await this.sleep(3000);
        console.log('end sleep', new Date().toISOString());
        var add_scenario = await this.addScenarioForBot(bot);
        var list_variable = await this.getListVariable(bot.id);
        var variable_point_obj = list_variable.find(v => v.variable_name == "inquiry_master_id");
        if (!variable_point_obj) {
            variable_point_obj = add_variable.find(v => v.variable_name == "inquiry_master_id");
        }
        var add_api_2 = await this.addAPI(bot, "addPointFromEfo", {
            variable_point_obj:variable_point_obj,
            url:api_url_1,
            api_type: "001"
        });

        var add_api_3 = await this.addAPI(bot, "checkAnswer", {
            variable_point_obj:variable_point_obj,
            url:api_url_2,
            api_type: "002"
        });
        var add_api_4 = await this.addAPI(bot, "pushMessage", {
            url:"https://api.botchan.chat/api/biyo/pushMessage",
            api_type: "001"
        });
        var add_api_5 = await this.addAPI(bot, "anketConfirm", {
            url: api_url_5,
            api_type: "001"
        });

        //hailt
        var add_api = await this.addAPI(bot, bot.page_name, {
            list_field:list_field,
            app_id: app_id,
            add_variable:add_variable,
            url: "https://jabs41.cybozu.com/k/v1/record.json",
            service_type: "001",
            app_url: `https://jabs41.cybozu.com/k/${app_id}/`
        });
        //Set liff 
        var check_liff = await this.checkLiffExit(bot)
        if (check_liff) {
            var liff_url = check_liff;
        } else {
            var liff_url = await this.setLIFF(bot);
        }
        console.log('liff url is', liff_url);
        //Delete all message
        if (add_scenario && add_scenario != null && add_scenario != '' && add_api && add_api_2 && add_api_3 && add_api_4 && liff_url) {
            var delete_message = await this.deleteOldMessage(add_scenario);
            //Create new message 
            if (delete_message && add_variable && add_scenario && add_api && add_api_2 && add_api_3 && add_api_4 && liff_url) {
                this.addMessageForBot(bot, list_field, add_scenario, add_api, add_api_2, add_api_3, add_api_4, add_api_5, liff_url, inquiry_master_id, record, app_id);
            }
        }
    }

    deleteOldMessage(scenario_id) {
        return new Promise((resolve, reject) => {
            BotMessage.deleteMany({ 'scenario_id': scenario_id }, function (err, res) {
                if (err) {
                    console.log('Can not delete message in bot message  ', err);
                    reject(err);
                } else {
                    resolve(true)
                }

            });
        });
    }

    async getPosition(app_id, list_field) {
        var header_rent = {
            'X-Cybozu-Authorization': user_pass_b64
        };
        var request_body_user = {
            uri: "https://jabs41.cybozu.com/k/v1/app/views.json?app=" + app_id,
            headers: header_rent,
            method: "GET",
            json: true
        };
        var view_info = await getRequest(request_body_user);
        var field_position_info = (view_info.views && view_info.views.efo && view_info.views.efo.fields) ? view_info.views.efo.fields : (view_info.views && view_info.views.EFO && view_info.views.EFO.fields) ? view_info.views.EFO.fields : [];
        var list_position = {};
        var index_set = 0;

        field_position_info.forEach(code => {
            let field_object = list_field.find(field => field.code && field.code == code);
            if (field_object) {
                list_position[code] = index_set;
                index_set++;
            }
        });

        return new Promise((resolve, reject) => {
            resolve(list_position);
        });
    }

    async addMessageForBot(bot, list_field, scenario_id, api_id, api_id_2, api_id_3, api_id_4, api_id_5, liff_url, inquiry_master_id, record, app_id) {
        list_field = list_field.filter(field => field.code);
        var list_variable = await this.getListVariable(bot.id);
        var list_insert = [];
        var list_position = await this.getPosition(app_id, list_field);
        // add api 2
        var position_api_3 = 0;
        var data_api_3 = {
            "scenario_id": scenario_id,
            "cpid": bot.id,
            "position": position_api_3,
            "data": [
                {
                    "message": [
                        {
                            "type": "005",
                            "api": api_id_3,
                            "processing_flg": 0
                        }
                    ]
                }
            ],
            "message_type": "002",
            "filter": [],
            "disable_block_flg": 0
        };

        list_insert.push(this.insertMessage(data_api_3));
        var list_variable_placeholder = [];
        list_field.forEach((field, index) => {
            if(field.code.indexOf("user_") !== -1){
            }else{
                var variable_object = list_variable.find(e => e.variable_name == field.code);
                if (variable_object) {
                    //Create question
                    var variable_id = variable_object.id;
                    var index_field = list_position[field.code] ? list_position[field.code] : index;
                    var position_question = index_field * 2 + 1;
                    //add filter
                    var filter = [];
                    if (field.code.includes("_")) {
                        var field_info_list = field.code.split('_');
                        var variable_filter_code = field_info_list[0];
                        var variable_filter_id_object = list_variable.find(e => e.variable_name == variable_filter_code);
                        if (variable_filter_id_object) {
                            var variable_filter_id = variable_filter_id_object.id;
                            field_info_list.shift();
                            filter = [
                                [
                                    {
                                        "condition": variable_filter_id,
                                        "compare": "including",
                                        "value": field_info_list.join("_")
                                    }
                                ]
                            ];
                        }
                    }
                    var data_message_question = {
                        "scenario_id": scenario_id,
                        "cpid": bot.id,
                        "position": position_question,
                        "data": [
                            {
                                "message": [
                                    {
                                        "type": "001",
                                        "content": field.label
                                    }
                                ]
                            }
                        ],
                        "message_type": "002",
                        "filter": filter,
                        "disable_block_flg": 0
                    };
                    list_insert.push(this.insertMessage(data_message_question));
                    var required_flg = field.required == "true" ? 1 : 0;
                    var position_answear = index_field * 2 + 1 + 1;
                    switch (field.type) {
                        case 'RADIO_BUTTON':
                            var list_option = field.options.map(option => {
                                return {
                                    "value": option,
                                    "text": option
                                }
                            });

                            var data_message_answear = {
                                "scenario_id": scenario_id,
                                "cpid": bot.id,
                                "position": position_answear,
                                "data": [
                                    {
                                        "message": [
                                            {
                                                "type": "004",
                                                "title_flg": "001",
                                                "title": "",
                                                "template_type": "001",
                                                "list": list_option,
                                                "variable_id": variable_id,
                                                "required_flg": required_flg
                                            }
                                        ]
                                    }
                                ],
                                "message_type": "001",
                                "filter": filter,
                                "btn_next": "",
                                "block_name": field.code,
                                "error_flg": 0,
                                "input_requiment_flg": 0,
                                "disable_block_flg": 0
                            };
                            console.log("data_message_answear", data_message_answear);
                            list_insert.push(this.insertMessage(data_message_answear));
                            list_variable_placeholder.push({
                                    value: `${field.code} : {{${field.code}}}`,
                                    position: position_answear
                                }
                            );
                            break;

                        case 'DROP_DOWN':
                            var list_option = field.options.map(option => {
                                return {
                                    "value": option,
                                    "text": option
                                }
                            });

                            var data_message_answear = {
                                "scenario_id": scenario_id,
                                "cpid": bot.id,
                                "position": position_answear,
                                "data": [
                                    {
                                        "message": [
                                            {
                                                "type": "006",
                                                "first_title": "",
                                                "last_title": "",
                                                "default_option_text": "Please select",
                                                "template_type": "001",
                                                "title_flg": "001",
                                                "title": "",
                                                "list": [list_option],
                                                "variable_id": variable_id,
                                                "required_flg": required_flg
                                            }
                                        ]
                                    }
                                ],
                                "message_type": "001",
                                "filter": filter,
                                "btn_next": "",
                                "block_name": field.code,
                                "error_flg": 0,
                                "input_requiment_flg": 0,
                                "disable_block_flg": 0
                            };
                            list_insert.push(this.insertMessage(data_message_answear));
                            list_variable_placeholder.push({
                                    value: `${field.code} : {{${field.code}}}`,
                                    position: position_answear
                                }
                            );
                            break;

                        case 'CHECK_BOX':
                            var list_option = field.options.map(option => {
                                return {
                                    "value": option,
                                    "text": option
                                }
                            });

                            var data_message_answear = {
                                "scenario_id": scenario_id,
                                "cpid": bot.id,
                                "position": position_answear,
                                "data": [
                                    {
                                        "message": [
                                            {
                                                "type": "005",
                                                "option_select_min": "",
                                                "title_flg": "001",
                                                "title": "",
                                                "template_type": "001",
                                                "check_all_flg": 0,
                                                "list": list_option,
                                                "variable_id": variable_id,
                                                "required_flg": required_flg
                                            }
                                        ]
                                    }
                                ],
                                "message_type": "001",
                                "filter": filter,
                                "btn_next": "",
                                "block_name": field.code,
                                "error_flg": 0,
                                "input_requiment_flg": 0,
                                "disable_block_flg": 0
                            };
                            list_insert.push(this.insertMessage(data_message_answear));
                            list_variable_placeholder.push({
                                    value: `${field.code} : {{${field.code}}}`,
                                    position: position_answear
                                }
                            );
                            break;

                        case 'NUMBER':
                            var data_message_answear = {
                                "scenario_id": scenario_id,
                                "cpid": bot.id,
                                "position": position_answear,
                                "data": [
                                    {
                                        "message": [
                                            {
                                                "type": "002",
                                                "comment": "",
                                                "validation_type": "007",
                                                "template_type": "001",
                                                "title_flg": "001",
                                                "title": "",
                                                "list": [
                                                    {
                                                        "placeholder": ""
                                                    }
                                                ],
                                                "variable_id": variable_id,
                                                "api_valid_id": "",
                                                "required_flg": required_flg
                                            }
                                        ]
                                    }
                                ],
                                "message_type": "001",
                                "filter": filter,
                                "btn_next": "",
                                "block_name": field.code,
                                "error_flg": 0,
                                "input_requiment_flg": 0,
                                "disable_block_flg": 0
                            }

                            list_insert.push(this.insertMessage(data_message_answear));
                            list_variable_placeholder.push({
                                    value: `${field.code} : {{${field.code}}}`,
                                    position: position_answear
                                }
                            );
                            break;

                        case 'SINGLE_LINE_TEXT':
                            var data_message_answear = {
                                "scenario_id": scenario_id,
                                "cpid": bot.id,
                                "position": position_answear,
                                "data": [
                                    {
                                        "message": [
                                            {
                                                "type": "002",
                                                "comment": "",
                                                "template_type": "001",
                                                "title_flg": "001",
                                                "title": "",
                                                "list": [
                                                    {
                                                        "placeholder": ""
                                                    }
                                                ],
                                                "variable_id": variable_id,
                                                "api_valid_id": "",
                                                "required_flg": required_flg
                                            }
                                        ]
                                    }
                                ],
                                "message_type": "001",
                                "filter": filter,
                                "btn_next": "",
                                "block_name": field.code,
                                "error_flg": 0,
                                "input_requiment_flg": 0,
                                "disable_block_flg": 0
                            }

                            list_insert.push(this.insertMessage(data_message_answear));
                            list_variable_placeholder.push({
                                    value: `${field.code} : {{${field.code}}}`,
                                    position: position_answear
                                }
                            );
                            break;

                        case 'MULTI_LINE_TEXT':
                            var data_message_answear = {
                                "scenario_id": scenario_id,
                                "cpid": bot.id,
                                "position": position_answear,
                                "data": [
                                    {
                                        "message": [
                                            {
                                                "type": "003",
                                                "template_type": "001",
                                                "title_flg": "001",
                                                "title": "",
                                                "list": [],
                                                "placeholder": "",
                                                "variable_id": variable_id,
                                                "required_flg": required_flg
                                            }
                                        ]
                                    }
                                ],
                                "message_type": "001",
                                "filter": filter,
                                "btn_next": "",
                                "block_name": field.code,
                                "error_flg": 0,
                                "input_requiment_flg": 0,
                                "disable_block_flg": 0
                            }
                            list_insert.push(this.insertMessage(data_message_answear));
                            list_variable_placeholder.push({
                                    value: `${field.code} : {{${field.code}}}`,
                                    position: position_answear
                                }
                            );
                            break;

                        default:
                            var data_exception = {
                                "err": {
                                    "message": "Can not reslove type " + field.type,
                                },
                                "cpid": bot.id,
                                "uid": null,
                                "push_chatwork_flg": 1
                            }
                            list_insert.push(this.insertException(data_exception));
                            break;
                    }
                }
            }

        });
        //Add confirm message 

        var data_api_5 = {
            "scenario_id": scenario_id,
            "cpid": bot.id,
            "position": list_field.length * 2 + 1,
            "data": [
                {
                    "message": [
                        {
                            "type": "003",
                            "api_id": api_id_5,
                            "template_type": "003",
                            "title_flg": "002",
                            "title": "アンケート回答内容確認",
                            "variable_id": "",
                            "required_flg": 0
                        }
                    ]
                }
            ],
            "message_type": "001",
            "filter": [],
            "btn_next": "送信",
            "block_name": "確認",
            "error_flg": 0,
            "input_requiment_flg": 0,
            "disable_block_flg": 0
        };
        console.log(data_api_5);
        list_insert.push(this.insertMessage(data_api_5));


        //var data_confirm_message = {
        //    "scenario_id": scenario_id,
        //    "cpid": bot.id,
        //    "position": list_field.length * 2 + 1,
        //    "data": [
        //        {
        //            "message": [
        //                {
        //                    "type": "003",
        //                    "template_type": "002",
        //                    "title_flg": "002",
        //                    "title": "アンケート回答内容確認",
        //                    "list": [],
        //                    "placeholder": this.getPlaceHolderMessage(list_variable_placeholder),
        //                    "variable_id": "",
        //                    "required_flg": 0
        //                }
        //            ]
        //        }
        //    ],
        //    "message_type": "001",
        //    "filter": [],
        //    "btn_next": "送信",
        //    "block_name": "確認",
        //    "error_flg": 0,
        //    "input_requiment_flg": 0,
        //    "disable_block_flg": 0
        //};

        //list_insert.push(this.insertMessage(data_confirm_message));
        // add api 
        var position_api = list_field.length * 2 + 1 + 1;
        var data_api = {
            "scenario_id": scenario_id,
            "cpid": bot.id,
            "position": position_api,
            "data": [
                {
                    "message": [
                        {
                            "type": "005",
                            "api": api_id,
                            "processing_flg": 0
                        }
                    ]
                }
            ],
            "message_type": "002",
            "filter": [],
            "disable_block_flg": 0
        }
        list_insert.push(this.insertMessage(data_api));

        //add last message 
        var position_last_message = list_field.length * 2 + 1 + 1 + 1;
        var data_message_last = {
            "scenario_id": scenario_id,
            "cpid": bot.id,
            "position": position_last_message,
            "data": [
                {
                    "message": [
                        {
                            "type": "001",
                            "content": last_message
                        }
                    ]
                }
            ],
            "message_type": "002",
            "filter": [],
            "disable_block_flg": 0
        }
        list_insert.push(this.insertMessage(data_message_last));

        // add api 2
        var position_api_2 = list_field.length * 2 + 2 + 1 + 1;
        var data_api_2 = {
            "scenario_id": scenario_id,
            "cpid": bot.id,
            "position": position_api_2,
            "data": [
                {
                    "message": [
                        {
                            "type": "005",
                            "api": api_id_2,
                            "processing_flg": 0
                        }
                    ]
                }
            ],
            "message_type": "002",
            "filter": [],
            "disable_block_flg": 0
        }
        list_insert.push(this.insertMessage(data_api_2));
        // add api 4
        var position_api_4 = list_field.length * 2 + 2 + 2 + 1;
        var data_api_4 = {
            "scenario_id": scenario_id,
            "cpid": bot.id,
            "position": position_api_4,
            "data": [
                {
                    "message": [
                        {
                            "type": "005",
                            "api": api_id_4,
                            "processing_flg": 0
                        }
                    ]
                }
            ],
            "message_type": "002",
            "filter": [],
            "disable_block_flg": 0
        };
        list_insert.push(this.insertMessage(data_api_4));

        Promise.all(list_insert).then(values => {
            this.saveAfterDone(bot, liff_url, inquiry_master_id, record);
        }).catch(err => {
            console.log('Have error when sace list message for bot', err);
        });
    }

    getPlaceHolderMessage(list_variable_placeholder) {
        //**"お名前　：　{{文字列__1行__0}}\nお名前　：　{{文字列__1行__0}}\nお名前　：　{{文字列__1行__0}}\nお名前　：　{{文字列__1行__0}}\nお名前　：　{{文字列__1行__0}}" */
        if (list_variable_placeholder.length) {
            return list_variable_placeholder.sort((a, b) => (a.position > b.position) ? 1 : -1).map((elem) => { return elem.value; }).join("\n");
        } else {
            return "";
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async addVariableForBot(bot, list_field, app_id, inquiry_master_id) {
        console.log("hailt5555_addVariableForBot", list_field);
        return new Promise(async (resolve, reject) => {
            // remove all variable of bot
            await new Promise((resolve, reject)=>{
                if(bot.id && bot.id != undefined){
                    Variable.remove({connect_page_id: bot.id}, function(err) {
                        resolve(true)
                    });
                }
            })
            
            //var last_index = await this.getLastVariable(bot.id);
            var list_insert_all = [];
            var index = 0;
            var yy;
            var cpid = bot.id;
            console.log("hailt5555", list_field);
            var list_position = await this.getPosition(app_id, list_field);
            console.log(list_position);

            this.insertVariable2(index, cpid, list_field, list_position, yy = (next, v_insert) => {
                if (next) {
                    if (v_insert) {
                        list_insert_all.push(v_insert);
                    }
                    this.insertVariable2(++index, cpid, list_field, list_position, yy);
                } else {
                    Variable.findOneAndUpdate({ connect_page_id: cpid, variable_name: "inquiry_master_id" }, { $set: { position: 0, default_value: inquiry_master_id } }, { upsert: true, multi: false, new: true }, function (err, result) {
                        list_insert_all.push({
                            "variable_name": "inquiry_master_id",
                            "id": result.id
                        });
                        //console.log(list_insert_all);
                        if (list_insert_all.length) {
                            Promise.all(list_insert_all).then(values => {
                                resolve(values);
                            }).catch(err => {
                                console.log('Have error when add variable', err);
                                reject(err);
                            });
                        } else {
                            resolve([]);
                        }
                    });
                }
            });
        });
    }

    async addAPI(bot, api_name, data) {
        return new Promise(async (resolve, reject) => {
            var api_insert = {
                "connect_page_id": bot.id,
                "name": api_name,
                "method": "POST",
                "url": "",
                "api_type": "",
                "request": "",
                "response": [],
                "service_type": "",
                "store_name": "",
                "app_url": ""
            };
            let request = [];
            switch (api_name) {
                case bot.page_name:
                    let list_variable = await this.getListVariable(bot.id);
                    data.list_field.forEach(field => {
                        var field_code = field.code;
                        console.log("field_code", field_code, field.type);
                        if(field_code == "user_line_id"){
                            let item = {
                                "param": field.code,
                                "required_flg": field.type == 'RADIO_BUTTON' ? '1' : '0',
                                "param_type": field.type,
                                "variable_type": "001",
                                "value": "liff_user_id",
                                "input_value": ""
                            };
                            request.push(item);
                        }else if(field_code && field_code.indexOf("user_") !== -1){

                        }else{
                            let variable_obj = list_variable.find(v => v.variable_name == field.code);
                            if (!variable_obj) {
                                variable_obj = data.add_variable.find(v => v.variable_name == field.code);
                            }
                            if (variable_obj) {
                                let item = {
                                    "param": field.code,
                                    "required_flg": field.type == 'RADIO_BUTTON' ? '1' : '0',
                                    "param_type": field.type,
                                    "variable_type": "001",
                                    "value": variable_obj.id,
                                    "input_value": ""
                                };
                                request.push(item);
                            }
                        }
                    });
                    api_insert.url = data.url;
                    api_insert.request = request;
                    api_insert.authentication = {
                        "app_id": data.app_id,
                        "authentication_type": "002",
                        "api_token": user_pass_b64,
                        "user_name": user_name
                    };
                    api_insert.service_type = data.service_type;
                    api_insert.app_url = data.app_url;
                    break;

                case "addPointFromEfo":
                case "checkAnswer":
                    request = [
                        {
                            "variable_type": "001",
                            "param": "liff_user_id",
                            "value": "liff_user_id"
                        },
                        {
                            "variable_type": "001",
                            "param": "inquiry_master_id",
                            "value": data.variable_point_obj ? data.variable_point_obj.id : ""
                        }
                    ];
                    api_insert.url = data.url;
                    api_insert.api_type = data.api_type;
                    api_insert.request = request;
                    break;

                case "pushMessage":
                    request = [
                        {
                            "variable_type": "002",
                            "param": "line_token",
                            "value": line_token
                        },
                        {
                            "variable_type": "001",
                            "param": "liff_user_id",
                            "value": "liff_user_id"
                        }
                    ];
                    api_insert.url = data.url;
                    api_insert.api_type = data.api_type;
                    api_insert.request = request;
                    break;

                case "anketConfirm":
                    let list_variable_2 = await this.getListVariable(bot.id);
                    request = [];
                    list_variable_2.forEach(row => {
                        request.push({
                            "variable_type" : "001",
                            "param" : row.variable_name,
                            "value" : row._id.toString()
                        });
                    });
                    api_insert.url = data.url;
                    api_insert.api_type = data.api_type;
                    api_insert.request = request;
                    break;

                default:
                    break;
            }

            if(bot.id && api_name && bot.id != undefined && api_name != undefined){
                Api.findOneAndUpdate({
                    'connect_page_id': bot.id,
                    'name': api_name
                }, {
                    $set: api_insert
                }, { upsert: true , multi: false, new: true }, (err, result) => {
                    if (err) {
                        console.log('Have error whene insert api', api_insert);
                        reject(err);
                    } else {
                        console.log('insert data ok ');
                        resolve(result.id);
                    }
                });
            }
        });
    }

    async addScenarioForBot(bot) {
        var scenaio_name = bot.page_name;
        var scenario_exit = await this.checkExitScenario(bot.id, scenaio_name);
        return new Promise((resolve, reject) => {
            if (!scenario_exit) {
                var scenario_insert = {
                    'connect_page_id': bot.id,
                    'name': scenaio_name,
                    "start_flg": 1
                }
                console.log('scenario inseart is ', scenario_insert);
                var scenario_data = new Scenario(scenario_insert);
                scenario_data.save((err, result) => {
                    if (err) {
                        console.log('Have error when insert scenario', err);
                        reject(err);
                    }
                    if (result) {
                        console.log('save scenario ok', result);
                        resolve(result.id);
                    }
                });
            } else {
                resolve(scenario_exit.id);
            }
        });
    }

    checkExitScenario(connect_page_id, name) {
        return new Promise((resolve, reject) => {
            Scenario.findOne({
                'connect_page_id': connect_page_id,
                'name': name,
                'deleted_at': null
            }, (err, res) => {
                if (err) {
                    console.log('Have error when check scenario exit', err);
                    reject(err)
                } else {
                    resolve(res);
                }
            })
        });
    }

    checkExitConnect() {
        return new Promise((resolve, reject) => {
            Connect.findOne({
                'user_id': user_info[appEnv].user_id,
                'type': sns_type
            }, (err, res) => {
                if (err) {
                    console.log('Have error when check connect exit', err);
                    reject(err)
                } else {
                    resolve(res);
                }
            })
        });
    }

    checkExitBot(connect_id, page_name, record) {
        return new Promise((resolve, reject) => {
            let bot_id = record['efo_bot_id'] ? record['efo_bot_id'].value : "";
            if (!bot_id) {
                resolve(null);
            } else {
                ConnectPage.findOne({
                    _id: bot_id,
                    'deleted_at': null
                }, (err, res) => {
                    if (err) {
                        console.log('Have error when check bot exit', err);
                        reject(err);
                    } else {
                        resolve(res);
                    }
                })
            }
        });
    }

    checkExitVariable(variable_name, connect_page_id) {
        return new Promise((resolve, reject) => {
            Variable.findOne({
                'connect_page_id': connect_page_id,
                'variable_name': variable_name,
            }, (err, res) => {
                if (err) {
                    console.log('Have error when check variable exit', err);
                    reject(err)
                } else {
                    resolve(res);
                }
            })
        });
    }

    getListVariable(connect_page_id) {
        return new Promise((resolve, reject) => {
            Variable.find({
                'connect_page_id': connect_page_id
            }, {}, { sort: { position: 1 } }, (err, res) => {
                if (err) {
                    console.log('Have error when check variable exit', err);
                    reject(err)
                } else {
                    resolve(res);
                }
            })
        });
    }

    insertMessage(message_insert) {
        return new Promise((resolve, reject) => {
            var message_data = new BotMessage(message_insert);
            message_data.save((err, result) => {
                if (err) {
                    console.log('Have error when insert bot message', err);
                    reject(err);
                }
                if (result) {
                    resolve(result);
                }
            });
        });
    }

    insertException(exception_insert) {
        return new Promise((resolve, reject) => {
            var exception_data = new Exception(exception_insert);
            exception_data.save((err, result) => {
                if (err) {
                    console.log('Have error when insert exception message', err);
                    reject(err);
                }
                if (result) {
                    resolve(result);
                }
            });
        });
    }

    insertVariable(variable_insert) {
        return new Promise((resolve, reject) => {
            var variable_data = new Variable(variable_insert);
            variable_data.save((err, result) => {
                if (err) {
                    console.log('Have error when insert variable', err);
                    reject(err);
                }
                if (result) {
                    resolve(
                        {
                            "variable_name": result.variable_name,
                            "id": result.id
                        }
                    );
                }
            });
        });
    }

    insertVariable2(index, cpid, list_field, list_position, callback) {
        if (list_field[index]) {
            var field = list_field[index];
            var variable_name = field.code;
            console.log("hailt66666", field, variable_name, list_position[variable_name]);
            if (list_position[variable_name] !== undefined) {
                if(variable_name.indexOf("user_") !== -1){
                    return callback(true);
                }
                Variable.findOneAndUpdate({ connect_page_id: cpid, variable_name: variable_name }, { $set: { position: list_position[variable_name] } }, { upsert: true, multi: false, new: true }, function (err, result) {
                    return callback(true, {
                        "variable_name": variable_name,
                        "id": result.id
                    });
                });
            } else {
                return callback(true);
            }
        } else {
            return callback(false);
        }
    }

    getLastVariable(connect_page_id) {
        return new Promise((resolve, reject) => {
            Variable.find({
                'connect_page_id': connect_page_id
            }, (err, result) => {
                if (err) {
                    console.log('Have error when ghet last variable', err);
                    reject(err)
                } else {
                    var position = 1;
                    console.log('result is ', result);
                    if (result.length) {
                        var max_position = Math.max.apply(Math, result.map(function (o) { return o.position; }));
                        position = max_position ? max_position + 1 : 1;
                    }
                    resolve(position);
                }
            })
        });
    }

    listLineID() {
        return new Promise(async (resolve, reject) => {
            var header_rent = {
                'X-Cybozu-API-Token': user_app_token
            };
            var request_body_user = {
                uri: "https://jabs41.cybozu.com/k/v1/records.json?app=" + user_app_id,
                headers: header_rent,
                method: "GET",
                json: true
            };

            var list_record = await getRequest(request_body_user);
            var result = [];
            list_record.records.forEach(record => {
                if (record['権限'] && record['権限'].value == "開発者") {
                    let line_id = record['LINE_ID'] ? record['LINE_ID'].value : '';
                    result.push(line_id)
                }
            })
            resolve(result);
        });
    }

    async callSendLinePushAPI(liff_url, inquiry_name, page_access_token) {
        var list_to = await this.listLineID();
        var messageData = {
            to: list_to,
            messages: [{
                "type": "template",
                "altText": "LIFF DEMO",
                "template": {
                    "type": "buttons",
                    "title": "アンケートURL確認",
                    "text": inquiry_name,
                    "actions": [
                        {
                            "type": "uri",
                            "label": "LIFF URL",
                            "uri": liff_url
                        }
                    ]
                }
            }]
        };

        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + page_access_token
        };
        request({
            uri: "https://api.line.me/v2/bot/message/multicast",
            method: 'POST',
            headers: headers,
            json: messageData
        }, function (error, response, body) {
        });
    }

}
module.exports = new biyoBot().router;
