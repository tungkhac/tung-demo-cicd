// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
const request = require('request');
var Parent = require('./parent.class');
var model = require('../model');
const Zipcode = model.Zipcode;
const Variable = model.Variable;
const MessageVariable = model.MessageVariable;
const EfoMessageVariable = model.EfoMessageVariable;

const aut_token = 'Basic d2V2bmFsLWFwaTppN1E4NThPdw==';
const base_url_info = "https://stgkatekyo.kuraveil.jp/api/v1/line/getClients";
const base_url_register = "https://stgkatekyo.kuraveil.jp/api/v1/line/postConversion";
const list_image_url = {
    "A": "https://botchan.blob.core.windows.net/production/uploads/5d1dd148a24a619db701d4b2/5d3827bb46b52.jpg",
    "B": "https://botchan.blob.core.windows.net/production/uploads/5d1dd148a24a619db701d4b2/5d3827bb4c4ad.jpg",
    "C": "https://botchan.blob.core.windows.net/production/uploads/5d1dd148a24a619db701d4b2/5d3827bb4dfb2.jpg",
    "D": "https://botchan.blob.core.windows.net/production/uploads/5d1dd148a24a619db701d4b2/5d3827bb6119e.jpg",
    "E": "https://botchan.blob.core.windows.net/production/uploads/5d1dd148a24a619db701d4b2/5d3827bb63c8e.jpg",
    "F": "https://botchan.blob.core.windows.net/production/uploads/5d1dd148a24a619db701d4b2/5d3827bb5801a.jpg",
    "G": "https://botchan.blob.core.windows.net/production/uploads/5d1dd148a24a619db701d4b2/5d3827bcce9bd.jpg"
};
const noImageUrl = "https://botchan.blob.core.windows.net/production/uploads/5d1dd148a24a619db701d4b2/5d38305d06f69.png";
const cpid_bot = "5d1dd148a24a619db701d4b2";

const pref_code_list = {
    "北海道": "01",
    "青森県": "02",
    "岩手県": "03",
    "宮城県": "04",
    "秋田県": "05",
    "山形県": "06",
    "福島県": "07",
    "茨城県": "08",
    "栃木県": "09",
    "群馬県": "10",
    "埼玉県": "11",
    "千葉県": "12",
    "東京都": "13",
    "神奈川県": "14",
    "新潟県": "15",
    "富山県": "16",
    "石川県": "17",
    "福井県": "18",
    "山梨県": "19",
    "長野県": "20",
    "岐阜県": "21",
    "静岡県": "22",
    "愛知県": "23",
    "三重県": "24",
    "滋賀県": "25",
    "京都府": "26",
    "大阪府": "27",
    "兵庫県": "28",
    "奈良県": "29",
    "和歌山県": "30",
    "鳥取県": "31",
    "島根県": "32",
    "岡山県": "33",
    "広島県": "34",
    "山口県": "35",
    "徳島県": "36",
    "香川県": "37",
    "愛媛県": "38",
    "高知県": "39",
    "福岡県": "40",
    "佐賀県": "41",
    "長崎県": "42",
    "熊本県": "43",
    "大分県": "44",
    "宮崎県": "45",
    "鹿児島県": "46",
    "沖縄県": "47"
};
const list_school = {
    "小学生": 1,
    "中学生": 2,
    "高校生": 3,
};

const list_style = {
    "受験対策": 1,
    "学力向上": 2,
    "苦手意識": 3,
    "不登校": 4
}

const list_a1 = {
    "高い": "A",
    "普通": "B",
    "低い": "C"
}

const list_a2 = {
    "3時間以上": "A",
    "1〜2時間くらい": "B",
    "1時間未満": "C"
}
const list_a3 = {
    "高い": "A",
    "同じくらい": "B",
    "低い": "C",
    "まだ受験のことは考えていない": "D"
}

var getPrefecture = async (zipcode) => {
    return new Promise((resolve, reject) => {
        Zipcode.findOne({ "zipcode": zipcode }, function (err, result) {
            if (err) {
                console.log('have error when get list zipcode', err);
                reject(err);
            }
            if (result) {
                let name_city = result.pref ? result.pref : "";
                let r = pref_code_list[name_city] ? Number(pref_code_list[name_city]) : "";
                resolve(r);
            } else {
                resolve("");
            }
        });
    });
}

class kateikyoushiRouter extends Parent {
    constructor() {
        super();
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/get_type', async (req, res, next) => {
            var body = req.body;
            let val1 = this.validateInput(body, 'answer01');
            val1 = list_a1[val1] ? list_a1[val1] : val1;
            let val2 = this.validateInput(body, 'answer02');
            val2 = list_a2[val2] ? list_a2[val2] : val1;
            let val3 = this.validateInput(body, 'answer03');
            val3 = list_a3[val3] ? list_a3[val3] : val3;
            var url_image = "";
            var shindan_type = "";
            if (val1 == "A" && val2 != "C" && val3 == "A") {
                url_image = list_image_url["A"];
                shindan_type = "A";
            } else if (val1 == "A" && val2 != "C" && val3 != "A") {
                url_image = list_image_url["B"];
                shindan_type = "B";
            } else if (val1 != "C" && val2 == "C") {
                url_image = list_image_url["C"];
                shindan_type = "C";
            } else if (val1 != "A" && val2 == "A") {
                url_image = list_image_url["D"];
                shindan_type = "D";
            } else if (val1 == "B" && val2 == "B") {
                url_image = list_image_url["E"];
                shindan_type = "E";
            } else if (val1 == "C" && val2 == "B") {
                url_image = list_image_url["F"];
                shindan_type = "F";
            } else if (val1 == "C" && val2 == "C") {
                url_image = list_image_url["G"];
                shindan_type = "G";
            }

            let prefecture = this.validateInput(body, 'zipcode');
            prefecture = await getPrefecture(prefecture);
            let school = this.validateInput(body, 'school');
            school = list_school[school] ? list_school[school] : '';
            let style = this.validateInput(body, 'style');
            style = list_style[style] ? list_style[style] : '';

            var liff_url = this.validateInput(body, 'liff_url');

            let bodyData = {
                "prefecture": prefecture,
                "school": school,
                "style": style
            };
            console.log('body data is', bodyData);
            bodyData = JSON.stringify(bodyData);
            let headers = {
                'Authorization': aut_token,
                'content-type': 'application/json'
            };

            let rurl = this.validateInput(body, 'url', base_url_info);
            let user_id = this.validateInput(body, 'user_id', "-1");
            var current_scenario = typeof body.current_scenario !== "undefined" ? body.current_scenario : -1;
            var connect_scenario_yes = typeof body.connect_scenario_yes !== "undefined" ? body.connect_scenario_yes : -1;
            var connect_scenario_watch = typeof body.connect_scenario_watch !== "undefined" ? body.connect_scenario_watch : -1;
            var type = typeof body.type !== "undefined" ? body.type : 1;
            var data_return = [];

            this.postRequest(rurl, bodyData, headers)
                .then(body => {
                    var data_colum = [];
                    if (body && body.result && body.result.success && body.result.data && body.result.data.length) {
                        body.result.data.forEach(e => {
                            if (e.name) {
                                let element_input = {
                                    "thumbnailImageUrl": e.image_url ? e.image_url : noImageUrl,
                                    "imageBackgroundColor": "#FFFFFF",
                                    "title": e.name,
                                    "text": e.tags ? e.tags.join("・") : "",
                                    "actions": [
                                        {
                                            "type": "uri",
                                            "label": "資料請求を申し込む",
                                            "uri": liff_url
                                        }
                                    ]
                                };
                                data_return.push(
                                    [
                                        {
                                            "image_url": e.image_url ? e.image_url : noImageUrl,
                                            "value": e.id,
                                            "text": e.name
                                        }
                                    ]
                                );
                                data_colum.push(element_input);
                            }
                        });
                    }
                    var now = new Date();

                    let data_message = [];
                    if (data_colum.length) {
                        if(type == 1){
                            Variable.findOneAndUpdate({connect_page_id: cpid_bot, variable_name: "type"},
                                {
                                    $setOnInsert: {created_at: now, updated_at: now}
                                },
                                {upsert: true, multi: false, new: true}, function (err, new_val) {
                                    MessageVariable.update({connect_page_id: cpid_bot, user_id: user_id, variable_id: new_val._id},
                                        {$set: {variable_value: shindan_type, created_at : now, updated_at : now}},
                                        {upsert: true, multi: false}, function (err) {
                                            if (err) throw err;
                                        });
                                });

                            data_message = [
                                {
                                    "type": "image",
                                    "originalContentUrl": url_image,
                                    "previewImageUrl": url_image
                                },
                                {
                                    "type": "text",
                                    "text": "お子様にピッタリの家庭教師センターはこちら！",
                                    "quickReply": {
                                        "items": [
                                            {
                                                "type": "action",
                                                "action": {
                                                    "type": "postback",
                                                    "label": "見る",
                                                    "displayText": "見る",
                                                    "data": "BQUICK_REPLIES_" + current_scenario + "_" + connect_scenario_watch + "_-1_6KaL44KL_0"
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }else{


                            Variable.findOneAndUpdate({connect_page_id: cpid_bot, variable_name: "pulldown"},
                                {
                                    $setOnInsert: {created_at: now, updated_at: now}
                                },
                                {upsert: true, multi: false, new: true}, function (err, new_val) {
                                    MessageVariable.update({connect_page_id: cpid_bot, user_id: user_id, variable_id: new_val._id},
                                        {$set: {variable_value: data_return, created_at : now, updated_at : now}},
                                        {upsert: true, multi: false}, function (err) {
                                            if (err) throw err;
                                        });
                                });

                            data_message = [
                                {
                                    "type": "template",
                                    "altText": "家庭教師センター",
                                    "template": {
                                        "type": "carousel",
                                        "columns": data_colum,
                                        "imageAspectRatio": "rectangle",
                                        "imageSize": "contain"
                                    }
                                },
                                {
                                    "type": "text",
                                    "text": "診断結果に基づいた家庭教師を探しますか",
                                    "quickReply": {
                                        "items": [
                                            {
                                                "type": "action",
                                                "action": {
                                                    "type": "postback",
                                                    "label": "はい",
                                                    "displayText": "はい",
                                                    "data": "BQUICK_REPLIES_" + current_scenario + "_" + connect_scenario_yes + "_-1_44Gv44GE_0"
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    } else {
                        Variable.findOneAndUpdate({connect_page_id: cpid_bot, variable_name: "pulldown"},
                            {
                                $setOnInsert: {created_at: now, updated_at: now}
                            },
                            {upsert: true, multi: false, new: true}, function (err, new_val) {
                                MessageVariable.update({connect_page_id: cpid_bot, user_id: user_id, variable_id: new_val._id},
                                    {$set: {variable_value: [], created_at : now, updated_at : now}},
                                    {upsert: true, multi: false}, function (err) {
                                        if (err) throw err;
                                    });
                            });

                        data_message = [
                            {
                                "type": "image",
                                "originalContentUrl": url_image,
                                "previewImageUrl": url_image
                            },
                            {
                                "type": "text",
                                "text": "該当の家庭教師センターがございません。"
                            }
                        ]
                    }

                    res.json(
                        {
                            "message": data_message
                        }
                    );
                })
                .catch(error => {
                    console.log('vao error');
                    this.errorResolve(res, error);
                })
        });

        this.router.post('/register', async (req, res, next) => {
            var body = req.body;
            //console.log("body register", body);
            //console.log(req.headers['user-agent']);
            let line_user_id = this.validateInput(body, 'line_user_id');
            let client_ids = this.validateInput(body, 'client_ids');
            let client_id_list = client_ids.split(",");
            let slname = this.validateInput(body, 'slname');
            let sfname = this.validateInput(body, 'sfname');
            let slkana = this.validateInput(body, 'slkana');
            let sfkana = this.validateInput(body, 'sfkana');
            let zipcode = this.validateInput(body, 'zipcode');
            let prefecture = await getPrefecture(zipcode);
            let addr1 = this.validateInput(body, 'addr1');
            let addr2 = this.validateInput(body, 'addr2');
            let addr3 = this.validateInput(body, 'addr3');
            let tel = this.validateInput(body, 'tel');
            let email = this.validateInput(body, 'email');
            let grade = this.validateInput(body, 'grade');
            let style = this.validateInput(body, 'style');
            style = list_style[style] ? list_style[style] + "" : "1";
            let optin = this.validateInput(body, 'optin', "1");
            let memo = this.validateInput(body, 'memo');
            let url = this.validateInput(body, 'url', base_url_register);
            let user_agent = this.validateInput(body, 'user_agent', "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'");
            console.log("user_agent=", user_agent);

            let bodyData = {
                "line_user_id": line_user_id,
                "client_ids": client_id_list,
                "slname": slname,
                "sfname": sfname,
                "slkana": slkana,
                "sfkana": sfkana,
                "zip": zipcode,
                "prefecture": prefecture,
                "addr1": addr1,
                "addr2": addr2,
                "addr3": addr3,
                "tel": tel,
                "email": email,
                "grade": grade,
                "postedStyle": style,
                "optin": optin,
                "memo": memo
              };
               console.log('body data input ', bodyData);
            // bodyData = JSON.stringify(bodyData);
            let headers = {
                'Authorization': aut_token,
                'content-type': 'application/json',
                'user-agent' : user_agent
            };

            var options = {
                uri: url,
                headers: headers,
                method: "POST",
                json: bodyData
            };

            console.log('body data input ', options);
            request(options, function (error, response, body) {
                console.log('body out put', body);
                if(body && body.result){
                    if (body.result.success) {
                        res.json({
                            success: 1
                        });
                    } else {
                        res.status(500).json({
                            success: 0,
                            error_message: body.result.message
                        });
                    }
                }else{
                    res.status(500).json({
                        success: 0,
                        error_message: "データが保存できませんでした。"
                    });
                }
            });
             //this.postRequest(base_url_register, bodyData, headers)
             //    .then(body => {
             //        console.log('result return is', body);
             //        if (body && body.result && body.result.success ) {
             //            res.json({
             //                "status": true,
             //                "message": "Register ok",
             //            });
             //        }else{
             //            res.json({
             //                "status": false,
             //                "message": body.result ? body.result.message : ""
             //            });
             //        }
             //    })
             //    .catch(error => {
             //        this.errorResolve(res, error);
             //    })
        });

        this.router.post('/get_data_pulldown', async (req, res, next) => {
            var body = req.body;
            let school = this.validateInput(body, 'school');
            var data_return = [];
            if (school == "小学生") {
                data_return = [
                    { value: "11", text: "小1" },
                    { value: "12", text: "小2" },
                    { value: "13", text: "小3" },
                    { value: "14", text: "小4" },
                    { value: "15", text: "小5" },
                    { value: "16", text: "小6" }
                ];
            } else if (school == "中学生") {
                data_return = [
                    { value: "21", text: "中1" },
                    { value: "22", text: "中2" },
                    { value: "23", text: "中3" }
                ]
            } else if (school == "高校生") {
                data_return = [
                    { value: "31", text: "高1" },
                    { value: "32", text: "高2" },
                    { value: "33", text: "高3" }
                ];
            }

            res.json({
                data: data_return
            });
        
        });

        this.router.post('/get_answear', async (req, res, next) => {
            var body = req.body;
            var user_id = typeof body.user_id !== "undefined" ? body.user_id : [];
            Variable.findOne({connect_page_id: "5d1de122a24a61078f025cc3", variable_name: "REF_pulldown"}, function (err, new_val) {
                    if(new_val){
                        EfoMessageVariable.findOne({connect_page_id: "5d1de122a24a61078f025cc3", user_id: user_id, variable_id: new_val._id}, function(err, result) {
                            if (err) throw err;
                            var data = [];
                            if (result) {
                                var variable_value = result.variable_value;
                                if(Array.isArray(variable_value) && variable_value.length > 0){
                                    data = variable_value[0];
                                }
                            }
                            res.json({
                                template_type: "002",
                                data: data
                            });
                        });
                    }else{
                        res.json({
                            template_type: "002",
                            data: []
                        });
                    }

                });

            //let prefecture = this.validateInput(body, 'zipcode');
            //let school = this.validateInput(body, 'school');
            //let style = this.validateInput(body, 'style');
            //prefecture = await getPrefecture(prefecture);
            //school = list_school[school] ? list_school[school] : '';
            //style = list_style[style] ? list_style[style] : '';
            //
            //let bodyData = {
            //    "prefecture": prefecture,
            //    "school": school,
            //    "style": style
            //}
            //bodyData = JSON.stringify(bodyData);
            //let headers = {
            //    'Authorization': aut_token,
            //    'content-type': 'application/json'
            //};
            //let rurl = this.validateInput(body, 'url', base_url_info);
            //
            //this.postRequest(rurl, bodyData, headers)
            //    .then(body => {
            //        var data_return = [];
            //        if (body && body.result && body.result.success && body.result.data && body.result.data.length) {
            //            body.result.data.forEach(e => {
            //                if (e.name) {
            //                    data_return.push(
            //                        [
            //                            {
            //                                "image_url": e.image_url ? e.image_url : noImageUrl,
            //                                "value": e.id,
            //                                "text": e.name
            //                            }
            //                        ]
            //                    );
            //                }
            //            });
            //        }
            //        res.json({
            //            template_type: "002",
            //            data: data_return
            //        });
            //    })
            //    .catch(error => {
            //        this.errorResolve(res, error);
            //    })
        });
    }
}

module.exports = new kateikyoushiRouter().router;
