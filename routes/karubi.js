// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
moment.locale('ja');
var holiday = require('moment-holiday');
const crypto = require('crypto');
const CustomKarubiProduct = model.CustomKarubiProduct;
const CustomKarubiShowProduct = model.CustomKarubiShowProduct;
const CustomKarubiTrackingShowProduct = model.CustomKarubiTrackingShowProduct;

const Exception = model.Exception;

const ssModule = require('../modules/googleSheet');


const max_item_carousel = 10;
const no_image_url = 'https://www.calbee.co.jp/jagaimo/binout.php?f=';
const no_result1 = {
    message : [
        {
            "type": "text",
            "text": "該当するデータはありません。"
        }
    ]
};
const no_result = {
    message : [
        {
            "type": "text",
            "text": "該当するデータはありません。"
        },
        {
            "type" : "template",
            "altText" : "再度確認して入力してください",
            "template" : {
                "type" : "buttons",
                "text" : "再度確認して入力してください",
                "actions" : []
            }
        }
    ]
};
const months = {
    'B': '01',
    'C': '02',
    'D': '03',
    'E': '04',
    'F': '05',
    'G': '06',
    'H': '07',
    'I': '08',
    'J': '9',
    'K': '10',
    'L': '11',
    'M': '12',
};
const years = {
    '1': '2011',
    '2': '2012',
    '3': '2013',
    '4': '2014',
    '5': '2015',
    '6': '2016',
    '7': '2017',
    '8': '2018',
    '9': '2019',
    '0': '2020'
};
/*SHOW PRODUCT*/
router.post('/show_product', function(req, res, next){
    var body = req.body;
    var loop_cnt = 1;
    var fun;
    var result_json = {
        message : []
    };

    getProductNotDisplay(body, function (list_not_display) {
        getProductFollowDate(body, list_not_display, function (result0_check, product_list, list_not_display1) {
            if(result0_check && product_list){
                randomGetProduct(loop_cnt, body, list_not_display1, product_list, fun = function (next, result_check, data) {
                    if(next){
                        randomGetProduct(++loop_cnt, body, list_not_display1, product_list, fun);
                    }else{
                        if(result_check && data){
                            result_json['message'] = data;
                            res.json(result_json);
                        }else{
                            res.json(no_result1);
                        }
                    }
                });
            }else{
                res.json(no_result1);
            }
        });
        /*randomGetProduct(body, list_not_display, function (next, result_check, data) {
            if(result_check && data){
                result_json['message'] = data;
                res.json(result_json);
            }else{
                res.json(result_json);
            }
        });*/
    });
});
/*TRANSACTION*/
router.get('/transaction', function(req, res, next) {
    var query = req.query;
    var product_code = query.product_code;
    var result_json = {
        creator: '',
        hinshu: '',
        area: '',
        factory: '',
        date: '',
    };
    if(product_code != ''){
        product_code = product_code.replace(/ /g,'');
        var str_length = product_code.length;
        var date_code = product_code.substr(str_length - 4, 4);
        var factory_code = product_code.replace(date_code, '');
        factory_code = factory_code.toUpperCase();
        date_code = date_code.toUpperCase();

        /*call api transaction*/
        var url = `https://www.calbee.co.jp/jagaimo/api/transaction?d=${date_code}&f=${factory_code}`;
        sendApiRequest(url, function (result_check, body) {
            if(result_check){
                if(typeof body.transaction.creator != 'undefined' && body.transaction.creator != null){
                    result_json.creator = (body.transaction.creator).join();
                    result_json.hinshu = (body.transaction.hinshu).join();
                    result_json.area = (body.transaction.area).join();
                    result_json.factory = body.transaction.factory;
                    result_json.date = body.transaction.date;

                    res.json(result_json);
                }else{
                    res.json(result_json);
                }
            }else{
                res.json(result_json);
            }
        });
    }else{
        res.json(result_json);
    }
});
/*CAROUSEL CREATOR*/
router.post('/creator', function(req, res, next) {
    var body = req.body;
    var creator = body.creator;
    var no_result_scenario_id = (typeof body.no_result_scenario_id !== "undefined") ? body.no_result_scenario_id : "-1";
    no_result.message[1].template.actions =  [
        {
            "type" : "postback",
            "label" : "やり直す",
            "data" : `BSCENARIO_-1_${no_result_scenario_id}_-1_44KE44KK55u044GZ`,
            "displayText" : "やり直す"
        }
    ];
    var url = `https://www.calbee.co.jp/jagaimo/api/creator?c=${creator}`;
    var result_json = {
        message : []
    };
    sendApiRequest(url, function (result_check, body1) {
        if(result_check){
            if(typeof body1.creator != 'undefined' && body1.creator.length){
                getLastIndexCreator(body, function (last_index) {
                    body.offset = (typeof body.load_more_flg != 'undefined') ? last_index : 0;
                    createCarouselCreator(body1.creator, body, function (messages) {
                        result_json.message = messages;
                        res.json(result_json);
                    });
                });
            }else{
                res.json(no_result);
            }
        }else{
            res.json(no_result);
        }
    });
});

//生産者応援機能
router.post('/trackingCreater', function(req, res, next) {
    var body = req.body;
    var user_id = typeof body.user_id !== "undefined" ? body.user_id : "";
    var display_name =  typeof body.display_name !== "undefined" ? body.display_name : "";
    var creator =  typeof body.creator !== "undefined" ? body.creator : "";
    var creator_comment =  typeof body.creator_comment !== "undefined" ? body.creator_comment : "";

    console.log("trackingCreater", body);
    res.json({});

    var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD HH:mm");

    var data = [
        current_date,
        creator,
        creator_comment,
        user_id,
        display_name
    ];

    ssModule.fillDataToSS(data);
});

/*CAROUSEL FACTORY*/
router.post('/factory', function(req, res, next) {
    var body = req.body;
    var factory = body.factory;
    var no_result_scenario_id = (typeof body.no_result_scenario_id !== "undefined") ? body.no_result_scenario_id : "-1";
    no_result.message[1].template.actions =  [
        {
            "type" : "postback",
            "label" : "やり直す",
            "data" : `BSCENARIO_-1_${no_result_scenario_id}_-1_44KE44KK55u044GZ`,
            "displayText" : "やり直す"
        }
    ];
    var url = `https://www.calbee.co.jp/jagaimo/api/factory?f=${factory}`;
    var result_json = {
        message : []
    };
    sendApiRequest(url, function (result_check, body1) {
        if(result_check){
            if(typeof body1.factory != 'undefined' && body1.factory.length){
                createCarouselFactory(body1.factory, body, function (messages) {
                    result_json.message = messages;
                    res.json(result_json);
                });
            }else{
                res.json(no_result);
            }
        }else{
            res.json(no_result);
        }
    });
});
/*CAROUSEL HINSHU*/
router.post('/hinshu', function(req, res, next) {
    var body = req.body;
    var hinshu = body.hinshu;
    var no_result_scenario_id = (typeof body.no_result_scenario_id !== "undefined") ? body.no_result_scenario_id : "-1";
    no_result.message[1].template.actions =  [
        {
            "type" : "postback",
            "label" : "やり直す",
            "data" : `BSCENARIO_-1_${no_result_scenario_id}_-1_44KE44KK55u044GZ`,
            "displayText" : "やり直す"
        }
    ];
    var url = `https://www.calbee.co.jp/jagaimo/api/hinshu?h=${hinshu}`;
    var result_json = {
        message : []
    };
    sendApiRequest(url, function (result_check, body1) {
        if(result_check){
            if(typeof body1.hinshu != 'undefined' && body1.hinshu.length){
                createCarouselHinshu(body1.hinshu, body, function (messages) {
                    result_json.message = messages;
                    res.json(result_json);
                });
            }else{
                res.json(no_result);
            }
        }else{
            res.json(no_result);
        }
    });
});
/*CAROUSEL AREA*/
router.post('/area', function(req, res, next) {
    var body = req.body;
    var area = body.area;
    var no_result_scenario_id = (typeof body.no_result_scenario_id !== "undefined") ? body.no_result_scenario_id : "-1";
    no_result.message[1].template.actions =  [
        {
            "type" : "postback",
            "label" : "やり直す",
            "data" : `BSCENARIO_-1_${no_result_scenario_id}_-1_44KE44KK55u044GZ`,
            "displayText" : "やり直す"
        }
    ];
    var url = `https://www.calbee.co.jp/jagaimo/api/area?a=${area}`;
    var result_json = {
        message : []
    };
    sendApiRequest(url, function (result_check, body1) {
        if(result_check){
            if(typeof body1.area != 'undefined' && body1.area.length){
                createCarouselArea(body1.area, body, function (messages) {
                    result_json.message = messages;
                    res.json(result_json);
                });
            }else{
                res.json(no_result);
            }
        }else{
            res.json(no_result);
        }
    });
});

function randomGetProduct1(body, list_not_display, callback) {
    var cpid = body.cpid;
    var line_id = body.line_id;
    var connect_scenario_id = (typeof body.connect_scenario_id !== "undefined") ? body.connect_scenario_id : "-1";
    var current_scenario_id = (typeof body.current_scenario_id !== "undefined") ? body.current_scenario_id : "-1";
    //test
    // cpid = '5def0b6ba24a619db81457db';
    // line_id = 'U9baf31a2b314ce92a403bc11358cc1d9';
    var description_result = {
        "type": "text",
        "text": ""
    };
    var flex_image_result = {
        "type" : "flex",
        "altText" : "カルビー",
        "contents" : []
    };
    var flex_button_result = {
        "type" : "flex",
        "altText" : "カルビー",
        "contents" : []
    };
    var message = [];
    var now = new Date();
    // var condition = {};
    // var code_random = Math.floor(Math.random() * (60 - 1) + 1);
    var code_random = list_not_display[Math.floor(Math.random()*list_not_display.length)];
    var condition = {code: code_random};

    CustomKarubiProduct.findOne(condition, function (err, result) {
        if (result) {
            //update product displayed
            CustomKarubiShowProduct.update({
                    cpid: cpid,
                    line_id: line_id,
                }, {
                    $push: { list_code: result.code },
                    $set: {created_at: now, updated_at: now}
                },
                {upsert: true, multi: false}, function (err) {
                    if (err) throw err;
                });
            //recommend product
            description_result.text = result.description;

            var button = {
                "type": "bubble",
                "styles": {
                    "body": {
                        "backgroundColor": "#EEEEEE"
                    }
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "spacer",
                            "size": "xxl"
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                        {
                            "type": "button",
                            "style": "link",
                            "action": {
                                "type": "postback",
                                "label": "他にも新商品を見る",
                                "data": `BSCENARIO_${connect_scenario_id}_${current_scenario_id}_他にも新商品を見る`
                            }
                        }
                    ]
                }
            };
            var image = {
                "type": "bubble",
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "image",
                            "url": result.image_url,
                            "size": "full",
                            "aspectMode": "cover",
                            "aspectRatio": "1:1",
                            "gravity": "center"
                        },
                        {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "uri",
                                                "label": "詳細を見る",
                                                "uri": result.page_url
                                            },
                                            "style": "link",
                                            "color": "#ffffff"

                                        }
                                    ],
                                    "offsetStart": "60px",
                                    "width": "130px",
                                    "cornerRadius": "xxl",
                                    "backgroundColor": "#000000cc"
                                }
                            ],
                            "position": "absolute",
                            "offsetBottom": "0px",
                            "offsetStart": "0px",
                            "offsetEnd": "0px",
                            "paddingAll": "20px"
                        }
                    ],
                    "paddingAll": "0px"
                }
            };

            flex_image_result.contents = image;
            flex_button_result.contents = button;

            message.push(flex_image_result);
            message.push(description_result);
            message.push(flex_button_result);

            return callback(false, true, message);
        }else{
            return callback(false, false);
        }
    });
}

function getProductNotDisplay(body, callback) {
    var cpid = body.cpid;
    var line_id = body.line_id;
    var now = new Date();
    var constants_code = [];
    for (var i = 1; i <= 60; i++){
        constants_code.push(i);
    }
    //test
    // cpid = '5def0b6ba24a619db81457db';
    // line_id = 'U9baf31a2b314ce92a403bc11358cc1d9';
    CustomKarubiShowProduct.findOne({cpid: cpid, line_id: line_id}, function (err, result) {
        if (result) {
            var list_code = result.list_code;
            if(typeof list_code == 'undefined' || list_code.length >= 60){
                CustomKarubiShowProduct.update({_id : result.id}, {
                    $set: {
                        list_code: [],
                        updated_at: now
                    }
                },{ upsert: false, multi: false }, function (err, result) {
                    return callback(constants_code);
                });
            }else{
                let difference = constants_code.filter(x => !list_code.includes(x));
                return callback(difference);
            }
        }else{
            return callback(constants_code);
        }
    });
}

function getProductFollowDate(body, list_not_display, callback){
    var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD HH:mm");
    var now = new Date();
    var cpid = body.cpid;
    var line_id = body.line_id;
    var product_list = [];
    var constants_code = [];
    for (var i = 1; i <= 60; i++){
        constants_code.push(i);
    }
    var condition = {
        // code: { $in: list_not_display },
        $or: [
            {start_date: { $lte : current_date}, end_date: { $gte: current_date }},
            {start_date: "", end_date: ""},
            {start_date: { $lte : current_date}, end_date: ""}
        ]
    };
    var first_condition = {
        code: { $in: list_not_display },
        $or: [
            {start_date: { $lte : current_date}, end_date: { $gte: current_date }},
            {start_date: "", end_date: ""},
            {start_date: { $lte : current_date}, end_date: ""}
        ]
    }
    // var first_condition = condition;
    // first_condition.code = { $in: list_not_display };
    // console.log(first_condition);
    CustomKarubiProduct.find(first_condition, function (err, result) {
        if (result && result.length) {
            var product_code_list = [];
            result.forEach(function (row) {
                product_list.push({
                    "code" : row.code,
                    "name" : row.name,
                    "description" : row.description,
                    "image_url" : row.image_url,
                    "page_url" : row.page_url
                });
                product_code_list.push(row.code);
            });
            return callback(true, product_list, product_code_list);
        }else{
            CustomKarubiProduct.find(condition, function (err, result1) {
                if (result1 && result1.length) {
                    var product_code1_list = [];
                    result1.forEach(function (row1) {
                        product_list.push({
                            "code" : row1.code,
                            "name" : row1.name,
                            "description" : row1.description,
                            "image_url" : row1.image_url,
                            "page_url" : row1.page_url
                        });
                        product_code1_list.push(row1.code);
                    });
                    //reset product code displayed
                    CustomKarubiShowProduct.update({cpid: cpid, line_id: line_id}, {
                        $set: {
                            list_code: [],
                            updated_at: now
                        }
                    },{ upsert: false, multi: false }, function (err, result) {

                    });

                    return callback(true, product_list, product_code1_list);
                }else{
                    return callback(false);
                }
            });

            // return callback(false);
        }
    });
}

function randomGetProduct(loop_cnt, body, list_not_display, product_list, callback) {
    var cpid = body.cpid;
    var line_id = body.line_id;
    var connect_scenario_id = (typeof body.connect_scenario_id !== "undefined") ? body.connect_scenario_id : "-1";
    var current_scenario_id = (typeof body.current_scenario_id !== "undefined") ? body.current_scenario_id : "-1";
    //test
    // cpid = '5def0b6ba24a619db81457db';
    // line_id = 'U9baf31a2b314ce92a403bc11358cc1d9';
    var description_result = {
        "type": "text",
        "text": ""
    };
    var flex_image_result = {
        "type" : "flex",
        "altText" : "カルビー",
        "contents" : []
    };
    var flex_button_result = {
        "type" : "flex",
        "altText" : "カルビー",
        "contents" : []
    };
    var message = [];
    var now = new Date();
    // var condition = {};
    // var code_random = Math.floor(Math.random() * (60 - 1) + 1);
    var code_random = list_not_display[Math.floor(Math.random()*list_not_display.length)];
    console.log('code random = ', code_random);
    console.log('product_list = ', product_list);
    var product = product_list.find(obj => obj.code == code_random);
    console.log('product = ', product);
    if(typeof product != 'undefined' && Object.keys(product).length){
        console.log('show product');
        //update product displayed
        CustomKarubiShowProduct.update({
                cpid: cpid,
                line_id: line_id,
            }, {
                $push: { list_code: product.code },
                $set: {created_at: now, updated_at: now}
            },
            {upsert: true, multi: false}, function (err) {
                if (err) throw err;
            });
        //recommend product

        var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD");

        CustomKarubiTrackingShowProduct.update({
                cpid: cpid,
                date: current_date,
                code: product.code,
                name: product.name,
                page_url: product.page_url
            }, { $inc: {view_count: 1} },
            { upsert: true, multi: false}, function(err) {
            });


        description_result.text = product.description;

        var button = {
            "type": "bubble",
            "styles": {
                "body": {
                    "backgroundColor": "#EEEEEE"
                }
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "spacer",
                        "size": "xxl"
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "button",
                        "style": "link",
                        "action": {
                            "type": "postback",
                            "label": "他にも新商品を見る",
                            "data": `BSCENARIO_${connect_scenario_id}_${current_scenario_id}_他にも新商品を見る`
                        }
                    }
                ]
            }
        };

        var requestbody = {
            originalUrl:  product.page_url,
            cpid: cpid,
            sid: "5def7610a24a61c67b642113"
        };

        var request_body = {
            uri: "https://st.botchan.chat/api/item",
            method: "POST",
            json: requestbody
        };
        var result = {};
        request(request_body, function (error, response, body) {
            if (!error && response.statusCode == 200){
                console.log(body.shortUrl);
                var image = {
                    "type": "bubble",
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "image",
                                "url": product.image_url,
                                "size": "full",
                                "aspectMode": "cover",
                                "aspectRatio": "1:1",
                                "gravity": "center"
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "button",
                                                "action": {
                                                    "type": "uri",
                                                    "label": "詳細を見る",
                                                    "uri": body.shortUrl
                                                },
                                                "style": "link",
                                                "color": "#ffffff"

                                            }
                                        ],
                                        "offsetStart": "60px",
                                        "width": "130px",
                                        "cornerRadius": "xxl",
                                        "backgroundColor": "#000000cc"
                                    }
                                ],
                                "position": "absolute",
                                "offsetBottom": "0px",
                                "offsetStart": "0px",
                                "offsetEnd": "0px",
                                "paddingAll": "20px"
                            }
                        ],
                        "paddingAll": "0px"
                    }
                };

                flex_image_result.contents = image;
                flex_button_result.contents = button;

                message.push(flex_image_result);
                message.push(description_result);
                message.push(flex_button_result);

                return callback(false, true, message);
            }else{
                return callback(true, false);
            }
        });


    }else if((typeof product == 'undefined' || Object.keys(product).length == 0) && loop_cnt < list_not_display.length){
        //next random code
        console.log('next random');
        return callback(true, false);
    }else{
        //not record
        console.log('not found');
        return callback(false, false);
    }
}

function getLastIndexCreator(body, callback) {
    var cpid = body.cpid;
    var line_id = body.line_id;

    CustomKarubiShowProduct.findOne({cpid: cpid, line_id: line_id}, function (err, result) {
        if (result && typeof result.last_creator_index != 'undefined') {
            return callback(result.last_creator_index);
        }else{
            return callback(0);
        }
    });
}

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

function createCarouselCreator(data, params, callback) {
    var messages = [];
    var columns = [];
    const first_message = {
        "type": "text",
        "text": "生産者をご紹介します。"
    };
    messages.push(first_message);
    var carousel =  {
        "type" : "template",
        "altText" : "カルビー",
        "template" : {
            "type" : "carousel",
            "columns" : []
        }
    };
    var offset = parseInt(params.offset);
    var last_item_load = offset;
    var current_scenario_id = (typeof params.current_scenario_id !== "undefined") ? params.current_scenario_id : "-1";
    var connect_scenario_id = (typeof params.connect_scenario_id !== "undefined") ? params.connect_scenario_id : "-1";
    var detail_connect_scenario_id = (typeof params.detail_connect_scenario_id !== "undefined") ? params.detail_connect_scenario_id : "-1";
    var now = new Date();

    for (var index = offset; index < data.length; index++){
        if(index >= offset && index < offset + max_item_carousel){
            var item = data[index];
            var carousel_text = (item.text != '') ? item.text : item.name;
            var carousel_title = item.name;
            carousel_text = carousel_text.replace(/<br>/g, "\n").replace(/<br \/>/g, "\n");
            if (carousel_title.length > 40) {
                carousel_title = carousel_title.substring(0, 30) + " ...";
            }
            if (carousel_text.length > 60) {
                carousel_text = carousel_text.substring(0, 50) + " ...";
            }

            var column = {
                "text" : carousel_text,
                "thumbnailImageUrl" : (item.image1 != '') ? item.image1 : no_image_url,
                "title" : carousel_title,
                "actions" : [
                    {
                        "type" : "postback",
                        "label" : "応援する",
                        "data" : `BSCENARIO_${current_scenario_id}_${detail_connect_scenario_id}_-1_${encodeBase64('応援する')}`
                    }
                ]
            };
            columns.push(column);
            last_item_load++;
        }
    }
    carousel['template']['columns'] = columns;
    messages.push(carousel);
    //show button load more
    if (data.length > last_item_load) {
        let button_connect = {
            "type": "template",
            "altText": "更に見ますか",
            "template": {
                "type": "buttons",
                "text": "更に見ますか",
                "actions": [
                    {
                        "type": "postback",
                        "label": "更に見ます",
                        "data": `BSCENARIO_${current_scenario_id}_${connect_scenario_id}_-1_${encodeBase64('更に見ます')}`,
                        "displayText": "更に見ます"
                    }
                ]
            }
        };
        messages.push(button_connect);
    }
    //store last show index
    CustomKarubiShowProduct.update({
            cpid: params.cpid,
            line_id: params.line_id
        }, {
            $set: {last_creator_index: last_item_load , updated_at: now}
        },
        {upsert: true, multi: false}, function (err) {
            if (err) throw err;
        });
    return callback(messages);
}

function createCarouselFactory(data, params, callback) {
    var messages = [];
    var columns = [];
    const first_message = {
        "type": "text",
        "text": "生産工場はこちらです。"
    };
    messages.push(first_message);
    var carousel =  {
        "type" : "template",
        "altText" : "カルビー",
        "template" : {
            "type" : "carousel",
            "columns" : []
        }
    };

    var produce_date = params.date;
    var day = produce_date.substr(produce_date.length - 2, 2);
    var month_code = produce_date.substr(produce_date.length - 3, 1);
    var month = months[month_code];
    var year_code = produce_date.replace(month_code + day, '');
    var year = years[year_code];
    var redirect_url = `https://www.calbee.co.jp/jagaimo/index.php?next=result_kigen&YYYY_key=${year}&MM_key=${month}&DD=${day}&KOJYO=${params.factory}#factory_area`;

    for (var index = 0; index < data.length; index++){
        if(index < max_item_carousel){
            var item = data[index];
            var carousel_text = (item.address != '') ? item.address : item.name;
            var carousel_title = item.name;
            carousel_text = carousel_text.replace(/<br>/g, "\n").replace(/<br \/>/g, "\n");
            if (carousel_title.length > 40) {
                carousel_title = carousel_title.substring(0, 30) + " ...";
            }
            if (carousel_text.length > 60) {
                carousel_text = carousel_text.substring(0, 50) + " ...";
            }

            var column = {
                "text" : carousel_text,
                "thumbnailImageUrl" : (item.image != '') ? item.image : no_image_url,
                "title" : carousel_title,
                "actions" : [
                    {
                        "type" : "uri",
                        "label" : "詳しく見る",
                        "uri" : redirect_url
                    }
                ]
            };
            columns.push(column);
        }
    }
    carousel['template']['columns'] = columns;
    messages.push(carousel);

    return callback(messages);
}

function createCarouselHinshu(data, params, callback) {
    var messages = [];
    var columns = [];
    const first_message = {
        "type": "text",
        "text": "この時期に使用されていたじゃがいもの品種をお知らせします。\n工場では１日にいろいろな種類のポテトチップスを生産しており、検索結果には当日使用した全てのじゃがいもの情報が出てきます。"
    };
    messages.push(first_message);
    var carousel =  {
        "type" : "template",
        "altText" : "カルビー",
        "template" : {
            "type" : "carousel",
            "columns" : []
        }
    };

    var produce_date = params.date;
    var day = produce_date.substr(produce_date.length - 2, 2);
    var month_code = produce_date.substr(produce_date.length - 3, 1);
    var month = months[month_code];
    var year_code = produce_date.replace(month_code + day, '');
    var year = years[year_code];
    var redirect_url = `https://www.calbee.co.jp/jagaimo/index.php?next=result_kigen&YYYY_key=${year}&MM_key=${month}&DD=${day}&KOJYO=${params.factory}#breed_area`;

    for (var index = 0; index < data.length; index++){
        if(index < max_item_carousel){
            var item = data[index];
            var carousel_text = (item.text1 != '') ? item.text1 : item.name;
            var carousel_title = item.name;
            carousel_text = carousel_text.replace(/<br>/g, "\n").replace(/<br \/>/g, "\n");
            if (carousel_title.length > 40) {
                carousel_title = carousel_title.substring(0, 30) + " ...";
            }
            if (carousel_text.length > 60) {
                carousel_text = carousel_text.substring(0, 50) + " ...";
            }

            var column = {
                "text" : carousel_text,
                "thumbnailImageUrl" : (item.image != '') ? item.image : no_image_url,
                "title" : carousel_title,
                "actions" : [
                    {
                        "type" : "uri",
                        "label" : "詳しく見る",
                        "uri" : redirect_url
                    }
                ]
            };
            columns.push(column);
        }
    }
    carousel['template']['columns'] = columns;
    messages.push(carousel);

    return callback(messages);
}

function createCarouselArea(data, params, callback) {
    var messages = [];
    var columns = [];
    const first_message = {
        "type": "text",
        "text": "ジャガイモの生産地はこちら！"
    };
    messages.push(first_message);
    var carousel =  {
        "type" : "template",
        "altText" : "カルビー",
        "template" : {
            "type" : "carousel",
            "columns" : []
        }
    };
    var current_scenario_id = (typeof params.current_scenario_id !== "undefined") ? params.current_scenario_id : "-1";
    var creator_scenario_id = (typeof params.creator_scenario_id !== "undefined") ? params.creator_scenario_id : "-1";
    var hinshu_scenario_id = (typeof params.hinshu_scenario_id !== "undefined") ? params.hinshu_scenario_id : "-1";
    var factory_scenario_id = (typeof params.factory_scenario_id !== "undefined") ? params.factory_scenario_id : "-1";

    for (var index = 0; index < data.length; index++){
        if(index < max_item_carousel){
            var item = data[index];
            var carousel_text = item.name;
            var carousel_title = item.name;
            carousel_text = carousel_text.replace(/<br>/g, "\n").replace(/<br \/>/g, "\n");
            if (carousel_title.length > 40) {
                carousel_title = carousel_title.substring(0, 30) + " ...";
            }

            var column = {
                "text" : carousel_text,
                "thumbnailImageUrl" : (item.image != '') ? item.image : no_image_url,
                "title" : carousel_title,
                "actions" : [
                    {
                        "type" : "postback",
                        "label" : "品種について",
                        "data" : `BSCENARIO_${current_scenario_id}_${hinshu_scenario_id}_-1_${encodeBase64('品種について')}`
                    },
                    {
                        "type" : "postback",
                        "label" : "生産者について",
                        "data" : `BSCENARIO_${current_scenario_id}_${creator_scenario_id}_-1_${encodeBase64('生産者について')}`
                    },
                    {
                        "type" : "postback",
                        "label" : "工場について",
                        "data" : `BSCENARIO_${current_scenario_id}_${factory_scenario_id}_-1_${encodeBase64('工場について')}`
                    }
                ]
            };
            columns.push(column);
        }
    }
    carousel['template']['columns'] = columns;
    messages.push(carousel);

    return callback(messages);
}

function encodeBase64(value){
    var encoded = Buffer.from(value).toString('base64');
    return encoded;
}

module.exports = router;
