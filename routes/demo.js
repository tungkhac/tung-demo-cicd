// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");
var model = require('../model');
const Zipcode = model.Zipcode;

const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');

var request = require('request');

/* GET home page. */
router.get('/loopup/pulldown', function(req, res, next){
    res.json({"type" : "200",  list: [
        {
            value: "001", text: "LE THANH HAI", related:[
            {
                "name" : "Công ty",
                "value": "Miyatsu"
            },
            {
                "name" : "Bộ phận",
                "value": "Developer"
            },
            {
                "name" : "Nhóm",
                "value": "Wevnal"
            }
        ]
        },
        {
            value: "002", text: "Nguyen Khac Tung", related:[
            {
                "name" : "Công ty",
                "value": "Miyatsu"
            }
        ]
        },
        {
            value: "003", text: "Vu Thi My Linh", related:[
            {
                "name" : "Công ty",
                "value": "Miyatsu"
            },
            {
                "name" : "Bộ phận",
                "value": "Developer"
            }
        ]
        },
        {
            value: "004", text: "Bui Viet An"
        }
    ]
    });
});

router.get('/sample/pulldown', function(req, res, next){
    res.json({
        type : "006",
        first_option_remove_flg : 1,
        default_value : ['3'],
        data: [
            {
                value: "0",
                text: 'Option 1'
            },
            {
                value: "2",
                text: 'Option 2'
            },
            {
                value: "3",
                text: 'Option 3'
            },
            {
                value: "4",
                text: 'Option 4'
            },
        ]
    });
});

router.get('/sample/calendar1', function (req, res) {
    var new_date1 = moment().add(2, 'days').format("YYYY-MM-DD");
    var new_date2 = moment().add(4, 'days').format("YYYY-MM-DD");
    var new_date3 = moment().add(6, 'days').format("YYYY-MM-DD");
    res.json({"mode": "unavailable", "date": [new_date1, new_date2, new_date3]});
});

router.get('/sample/calendar2', function (req, res) {
    var new_date1 = moment().add(2, 'days').format("YYYY-MM-DD");
    var new_date2 = moment().add(4, 'days').format("YYYY-MM-DD");
    var new_date3 = moment().add(6, 'days').format("YYYY-MM-DD");
    res.json({"mode": "available", "date": [new_date1, new_date2, new_date3]});
});

router.get('/sample/checkbox', function (req, res) {
    res.json({data: [{value: "001", text: "text1"}, {value: "002", text: "text2"}, {value: "003", text: "text3"}]});
});

router.post('/sample/checkboxImage', function (req, res) {
    res.json({
        template_type: "002",
        data: [
            [
                {
                    "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5c205bfd1cc24.jpeg",
                    "value" : "001",
                    "text" : "Option 1"
                },
                {
                    "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5c205beab1b80.jpeg",
                    "value" : "002",
                    "text" : "Option 1.2"
                },
                {
                    "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5bc450a004993.jpeg",
                    "value" : "003",
                    "text" : "Option 1.3"
                }
            ],
            [
                {
                    "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5b4439c99ab41.jpeg",
                    "value" : "004",
                    "text" : "Option 2.1"
                },
                {
                    "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5d2ed5a9130c7.jpg",
                    "value" : "005",
                    "text" : "Option 2.2"
                }
            ],
            [
                {
                    "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5a729ec837b18.jpeg",
                    "value" : "006",
                    "text" : "Option 3"
                }
            ]
        ]
    });
});

router.get('/sample/checkbox2', function (req, res) {
    res.json(
        {
            error_message: "該当データーがありません",
            data: []
        }
    );
});

router.get('/sample/webchat/Checkbox', function (req, res) {
    //Checkbox api format:
    /*"data" : [
        {
            "variable" : "5992abfe9a892046be0cbd0e",
            "required_flg" : 1,
            "type" : "009",
            "message" : {
                "type" : "009",
                "option_select_min" : "",
                "option_select_max" : "1",
                "title_flg" : "002",
                "title" : "abc",
                "template_type" : "001",
                "scenario_id" : "5b47065e9a89201d792e4bc9",
                "list" : [
                    {
                        "value" : "",
                        "text" : "option 1"
                    },
                    {
                        "value" : "",
                        "text" : "option  2"
                    }
                ]
            }
        }
    ],
    "btn_next" : "Next 111",
    "message_type" : "002",*/

    res.json({
        data: [
            {
                value: "001", text: "text1"
            },
            {
                value: "002", text: "text2"
            },
            {
                value: "003", text: "text3"
            }
        ],
        btn_next : "Next custom",
    });
});

router.get('/sample/radio', function (req, res) {
    res.json({
        data: [
            {value: "001", text: "text1"},
            {value: "002", text: "text2", default_select_flg: 1},
            {value: "003", text: "text3"}
        ]
    });
});

router.get('/sample/radioImage', function (req, res) {
    res.json({
        template_type: "002",
        data: [
            [
                {
                    image_url : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5c205bfd1cc24.jpeg",
                    value : "v1",
                    text : "1"
                },
                {
                    image_url : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5bc4509e18a3c.jpeg",
                    value : "v2",
                    text : "2",
                    default_select_flg: 1
                }
            ],
            [
                {
                    image_url : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5c205beab1b80.jpeg",
                    value : "v3",
                    text : "3",

                }
            ],
            [
                {
                    image_url : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5bc4509e18a3c.jpeg",
                    value : "v4",
                    text : "4"
                }
            ]
        ]
    });
});

router.get('/sample/radioImage2', function (req, res) {
    res.json({
        template_type: "002",
        data: [
            {
                image_url : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5c205bfd1cc24.jpeg",
                value : "1",
                text : "text1"
            },
            {
                image_url : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5bc4509e18a3c.jpeg",
                value : "2",
                text : "text2",
                default_select_flg: 1
            }
        ]
    });
});

router.get('/sample/radioError', function (req, res) {
    res.json(
        {
            error_message: "該当データーがありません",
            data: []
        }
    );
});

router.get('/sample/validation', function (req, res) {
    if(req.query.type == "001"){
        res.json({
            "status":"valid"
        });
    } else if (req.query.email) {
        if (req.query.email === 'linh@gmail.com') {
            res.json({
                "status":"invalid",
                "message":"重複しています。別のメールアドレスを使ってください。"
            });
        } else {
            res.json({
                "status":"valid"
            });
        }
    } else {
        if(req.query.username){
            res.json({
                "status":"invalid",
                "message":"重複しています。別のユーザー名を使ってください。"
            });
        }else{
            res.json({
                "status":"invalid",
                "message":"重複しています。別のメールアドレスを使ってください。"
            });
        }
    }

});

router.get('/check/resourceIp', function (req, res) {
    request({
        uri: "https://admin.botchan.chat/",
        method: 'GET'
    },function (error, response, body) {

    });

    res.json(
        {
            error_message: "該当データーがありません",
            data: []
        }
    );
});



router.get('/sample/carousel', function(req, res, next){
    res.json({
        type : "012",
        data: [
            {
                "title" : "Carousel API item 1",
                "subtitle" : "sub tittle item 1",
                "item_url" : "https://admin.botchan.chat/demo/5c10c42aa24a6109ed6bf92f",
                "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5a5449d5059408c5f50f0bb3/5bc4509e18a3c.jpeg",
                "button" : {
                    "title" : "Detail",
                    "link" : "https://www.google.com/",
                    "type" : "link"
                }
            },
            {
                "title" : "Carousel API item 2",
                "subtitle" : "sub tittle item 2",
                "item_url" : "https://admin.botchan.chat/demo/5c10c42aa24a6109ed6bf92f",
                "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5a5449d5059408c5f50f0bb3/5c205bfd1cc24.jpeg",
                "button" : {
                    "title" : "",
                    "type" : "select"
                }
            },
            {
                "title" : "Carousel API item 3",
                "subtitle" : "sub tittle item 3",
                "item_url" : "",
                "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5a5449d5059408c5f50f0bb3/5c205beab1b80.jpeg",
                "button" : {
                    "title" : "",
                    "type" : "select"
                }
            }
            ]
    });
});

router.get('/line/carousel', function(req, res, next){
    res.json({
        data: [
            {
                type: "003",
                message: {
                    "type" : "template",
                    "altText" : "carousel demo a",
                    "template" : {
                        "type" : "carousel",
                        "columns" : [
                            {
                                "text" : "This is demo carousel message a",
                                "thumbnailImageUrl" : "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/399d58558728942d110f.jpeg",
                                "title" : "carousel demo a",
                                "actions" : [
                                    {
                                        "type" : "uri",
                                        "label" : "Button URL (google)",
                                        "uri" : "https://www.google.com/"
                                    },
                                    {
                                        "type" : "message",
                                        "label" : "Button message",
                                        "text" : "Have a nice day!"
                                    },
                                    {
                                        "type" : "postback",
                                        "label" : "Other scenario",
                                        "data" : "BSCENARIO_5b88f15009c6335c990ee844_5b55a88109c6332ca420a2cc_Other scenario"
                                    }
                                ]
                            },
                            {
                                "text" : "This is demo carousel message b",
                                "thumbnailImageUrl" : "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/62c3f65d6942c82eec6c.jpeg",
                                "title" : "carousel demo b",
                                "actions" : [
                                    {
                                        "type" : "uri",
                                        "label" : "Button link chatwork",
                                        "uri" : "https://www.chatwork.com"
                                    },
                                    {
                                        "type" : "uri",
                                        "label" : "Button link youtube",
                                        "uri" : "https://www.youtube.com/"
                                    },
                                    {
                                        "type" : "uri",
                                        "label" : "Button link (acebook",
                                        "uri" : "http://www.facebook.com/"
                                    }
                                ]
                            },
                            {
                                "text" : "This is demo carousel message c",
                                "thumbnailImageUrl" : "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/3c8b1e06f0e0fa9e01ab.png",
                                "title" : "carousel demo c",
                                "actions" : [
                                    {
                                        "type" : "uri",
                                        "label" : "Button link youtube",
                                        "uri" : "https://www.youtube.com/"
                                    },
                                    {
                                        "type" : "uri",
                                        "label" : "Button link youtubeutube",
                                        "uri" : "https://www.youtube.com/"
                                    },
                                    {
                                        "type" : "uri",
                                        "label" : "Button link youtube",
                                        "uri" : "https://www.youtube.com/"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        ],
    });
});

router.get('/line/carousel2', function(req, res, next){
    res.json({message: {
        "type" : "template",
            "altText" : "carousel demo a",
            "template" : {
            "type" : "carousel",
                "columns" : [
                {
                    "text" : "This is demo carousel message a",
                    "thumbnailImageUrl" : "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/399d58558728942d110f.jpeg",
                    "title" : "carousel demo a",
                    "actions" : [
                        {
                            "type" : "uri",
                            "label" : "Button URL (google)",
                            "uri" : "https://www.google.com/"
                        },
                        {
                            "type" : "message",
                            "label" : "Button message",
                            "text" : "Have a nice day!"
                        },
                        {
                            "type" : "postback",
                            "label" : "Other scenario",
                            "data" : "BSCENARIO_5b88f15009c6335c990ee844_5b55a88109c6332ca420a2cc_Other scenario"
                        }
                    ]
                },
                {
                    "text" : "This is demo carousel message b",
                    "thumbnailImageUrl" : "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/62c3f65d6942c82eec6c.jpeg",
                    "title" : "carousel demo b",
                    "actions" : [
                        {
                            "type" : "uri",
                            "label" : "Button link chatwork",
                            "uri" : "https://www.chatwork.com"
                        },
                        {
                            "type" : "uri",
                            "label" : "Button link youtube",
                            "uri" : "https://www.youtube.com/"
                        },
                        {
                            "type" : "uri",
                            "label" : "Button link (acebook",
                            "uri" : "http://www.facebook.com/"
                        }
                    ]
                },
                {
                    "text" : "This is demo carousel message c",
                    "thumbnailImageUrl" : "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/3c8b1e06f0e0fa9e01ab.png",
                    "title" : "carousel demo c",
                    "actions" : [
                        {
                            "type" : "uri",
                            "label" : "Button link youtube",
                            "uri" : "https://www.youtube.com/"
                        },
                        {
                            "type" : "uri",
                            "label" : "Button link youtubeutube",
                            "uri" : "https://www.youtube.com/"
                        },
                        {
                            "type" : "uri",
                            "label" : "Button link youtube",
                            "uri" : "https://www.youtube.com/"
                        }
                    ]
                }
            ]
        }
    }});
});

router.post('/buttonLinkLevtech', function(req, res, next){
    var body = req.body;
    var url1 = body.url1;
    var url2 = body.url2;
    var url3 = body.url3;
    var type = body.type; //フリーランス 001  クリエイター 002  キャリア 003
    var url1_text = "エンジニアの方はこちら";
    var url2_text = "クリエイターの方はこちら";
    var url3_text = "未経験の方はこちら";

    if(type == "002"){
        url1_text = "クリエイターの方はこちら";
    }

    var arr_message_radio = [];
    if(typeof url1 != 'undefined' && url1 != '' ){
        var item = {
            "type" : "uri",
            "label" : url1_text,
            "uri" : url1
        };
        arr_message_radio.push(item)
    }

    if(typeof url2 != 'undefined' && url2 != '' ){
        var item = {
            "type" : "uri",
            "label" : url2_text,
            "uri" : url2
        };
        arr_message_radio.push(item)
    }

    if(typeof url3 != 'undefined' && url3 != '' ){
        var item = {
            "type" : "uri",
            "label" : url3_text,
            "uri" : url3
        };
        arr_message_radio.push(item)
    }

    console.log('arr_message_radio', arr_message_radio);
    res.json({message_radio: arr_message_radio});
});

router.get('/buttonLink', function(req, res, next){
    res.json({message_radio: [
                {
                    "type" : "uri",
                    "label" : "テスト1",
                    "uri" : "https://vnexpress.net"
                },
                {
                    "type" : "uri",
                    "label" : "テスト2",
                    "uri" : "https://dantri.com.vn"
                },
                {
                    "type" : "uri",
                    "label" : "テスト3",
                    "uri" : "https://news.zing.vn"
                }
            ]
    });
});

router.get('/sample/productPurchase', function (req, res) {
    /*view_type:
    * 001: default (thumbnail + text)
    * 002: image + text
    * */
    res.json({
        // view_type : "001",
        data: [
            [
                {
                    "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5c205beab1b80.jpeg",
                    "unit_price" : "1000",
                    "text" : "Product 1",
                    "product_code" : "001",
                    "default_select_flg" : 0,
                    "quantity_max" : "2",
                    "set_quantity_flg" : 1,
                    "custom_price_text" : ""
                }
            ],
            [
                {
                    "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5c205bfd1cc24.jpeg",
                    "unit_price" : "2000",
                    "text" : "Product 2",
                    "product_code" : "002",
                    "default_select_flg" : 1,
                    "quantity_max" : "",
                    "set_quantity_flg" : 0,
                    "custom_price_text" : "Contact"
                }
            ],
            [
                {
                    "image_url" : "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5bc4509e18a3c.jpeg",
                    "unit_price" : "3000",
                    "text" : "Product 3",
                    "product_code" : "003",
                    "default_select_flg" : 0,
                    "quantity_max" : "",
                    "set_quantity_flg" : 0,
                    "custom_price_text" : "Contact"
                }
            ]
        ]
    });
});

router.get('/sample/productPurchaseError', function (req, res) {
    res.json({
        error_message: "該当データーがありません",
        data: []
    });
});

router.get('/sample/textareaReadonly', function(req, res, next){
    res.json({
        template_type: '002', //001 (input) | 002 (readonly)
        data: 'This is demo Textarea readonly API message \nDemo variable: {{efo var 1}}'
    });
});

router.get('/testTimeout', function(req, res, next){
    setTimeout(function() {
        res.json({});
    }, 10000);
});

router.get('/testTimeout2', function(req, res, next){

});

router.get('/test/timeoutError', function(req, res, next){
    var query = req.query,
        time_delay = (query.time_delay != void 0 && !isNaN(query.time_delay)) ? parseFloat(query.time_delay) : 5;

    setTimeout(function () {
        res.json(
            {
                error_message: "該当データーがありません",
                data: []
            }
        );
    }, time_delay * 1000);
});
router.get('/test/timeoutSuccess', function(req, res, next){
    var query = req.query,
        time_delay = (query.time_delay != void 0 && !isNaN(query.time_delay)) ? parseFloat(query.time_delay) : 5;

    setTimeout(function () {
        res.json(
            {
                data: []
            }
        );
    }, time_delay * 1000);
});

router.get('/menuApi1', function(req, res, next){
    var content = '<p>2019/3/22 <span>In sem convallis vitae ullamcorper 1</span></p>' +
        '<p>2019/3/22 <span>In sem convallis vitae ullamcorper 2</span></p>' +
        '<p>2019/3/22 <span>In sem convallis vitae ullamcorper 3</span></p>' +
        '<p>2019/3/22 <span>In sem convallis vitae ullamcorper 4</span></p>' +
        '<p>2019/3/22 <span>In sem convallis vitae ullamcorper 5</span></p>' +
        '<p>2019/3/22 <span>In sem convallis vitae ullamcorper 6</span></p>' +
        '<p>2019/3/22 <span>In sem convallis vitae ullamcorper 7</span></p>' +
        '<p>2019/3/22 <span>In sem convallis vitae ullamcorper 8</span></p>' +
        '<p>2019/3/22 <span>In sem convallis vitae ullamcorper 9</span></p>';
    res.json({content: content});
});
router.get('/menuApi2', function(req, res, next){
    var content = '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 1</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 2</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 3</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 4</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 5</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 6</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 7</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 8</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 9</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 10</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 11</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 12</p>' +
        '<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 13</p>';
    res.json({content: content});
});


router.post('/settingKentaku', function(req, res, next){
    var body = req.body;
    console.log(body);
    var application_detail = (typeof body.application_detail !== "undefined") ? body.application_detail : "";

    if(application_detail == 1){
        res.status(200).send({
            "data" : "資料請求"
        });
    }else if(application_detail == 2){
        res.status(200).send({
            "data" : "問い合わせ"
        });
    }else{
        res.status(200).send({
            "data" : ""
        });
    }
});


module.exports = router;
