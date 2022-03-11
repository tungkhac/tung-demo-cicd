// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
var moment = require('moment-timezone');
moment.locale('ja');
var holiday = require('moment-holiday');
const crypto = require('crypto');
var geolib = require('geolib');
const ApiDeli = model.ApiDeli;
const ApiDeliRegion = model.ApiDeliRegion;
const Exception = model.Exception;
const  NO_RECOMMEND_MESSAGE = "検索条件に該当するデータはありません。";
/*GET REGION*/
router.post('/region', function(req, res, next){
    var body = req.body;
    var result_json = {
        data: [],
        btn_next : "次へ"
    };
    var list = [];
    getRegion(function (result_check, data) {
        if(result_check && data){
            for (var ind in data) {
                if (data.hasOwnProperty(ind)) {
                    if(data[ind]){
                        list.push({
                            value: "",
                            text: data[ind]
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
/*GET AREA*/
router.post('/area', function(req, res, next){
    var body = req.body;
    var pref_code = body.pref_code;

    var result_json = {
        data: [],
        btn_next : "次へ"
    };
    var list = [];
    getArea(pref_code, function (result_check, data) {
        if(result_check && data){
            for (var area_code in data) {
                if (data.hasOwnProperty(area_code)) {
                    if(data[area_code]){
                        list.push({
                            value: area_code,
                            text: data[area_code]
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
/*GET PREF*/
router.post('/pref', function(req, res, next){
    var body = req.body;
    var region = body.region;
    var result_json = {
        data: [],
        btn_next : "次へ"
    };
    var list = [];
    getPref(region, function (result_check, data) {
        if(result_check && data){
            for (var pref_code in data) {
                if (data.hasOwnProperty(pref_code)) {
                    if(data[pref_code]){
                        list.push({
                            value: pref_code,
                            text: data[pref_code]
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
/*GET CITY*/
router.post('/city', function(req, res, next){
    var body = req.body;
    var area_code = body.area_code;
    var result_json = {
        data: [],
        btn_next : "次へ"
    };
    var list = [];
    getCity(area_code, function (result_check, data) {
        if(result_check && data){
            for (var city_code in data) {
                if (data.hasOwnProperty(city_code)) {
                    if(data[city_code]){
                        list.push({
                            value: city_code,
                            text: data[city_code]
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
/*RECOMMEND GIRL*/
router.post('/recommend_girl', function(req, res, next){
    var body = req.body;
    var result_json = {
        message: [],
        count: 0
    };
    var reload_connect_scenario_id = (typeof body.reload_connect_scenario_id !== "undefined") ? body.reload_connect_scenario_id : "-1";
    var no_result_json = {
        message:[
            {
                "attachment" : {
                    "type" : "template",
                    "payload" : {
                        "template_type" : "button",
                        "text" : "該当する店舗が見つかりませんでした。条件を変えて再度検索してください",
                        "buttons" : [
                            {
                                "type" : "postback",
                                "title" : "再度検索する",
                                "payload" : `BSCENARIO_-1_${reload_connect_scenario_id}_-1_${encodeBase64("再度検索する")}`
                            }
                        ]
                    }
                }
            }
        ],
        count: 0
    };

    recommendGirl(body, function (result_check, data, count_all_item_load) {
        if(result_check && data){
            result_json['message'] = data;
            result_json['count'] = count_all_item_load;
            res.json(result_json);
        }else{
            res.json(no_result_json);
        }
    });
});
/*GET TIME*/
router.get('/time', function (req, res) {
    var result_json = {
        data: [
            {value: "", text: "特になし"},
            {value: "0-30", text: "～30分"},
            // {value: "30-45", text: "30分～45分"},
            {value: "30-60", text: "30分～60分"},
            {value: "60-75", text: "60分～75分"},
            {value: "75-90", text: "75分～90分"},
            {value: "90-", text: "90分～"}
        ],
        btn_next : "次へ"
    };

    res.json(result_json);
});
/*GET PRICE*/
router.get('/price', function (req, res) {
    var result_json = {
        data: [
            {value: "0-10000", text: "10,000円以下"},
            {value: "10000-13000", text: "10,000円～13,000円"},
            {value: "13000-16000", text: "13,000円～16,000円"},
            {value: "16000-20000", text: "16,000円～20,000円"},
            {value: "20000-30000", text: "20,000円～30,000円"},
            {value: "30000-", text: "30000円以上"},
        ],
        btn_next : "次へ"
    };

    res.json(result_json);
});
/*GET STYLE*/
router.get('/style', function (req, res) {
    var result_json = {
        data: [
            {value: "0", text: "デリヘル"},
            {value: "1", text: "ホテヘル"},
            {value: "3", text: "箱ヘルス"},
            {value: "4", text: "ピンサロ"},
            {value: "6", text: "メンズエステ"},
            {value: "5", text: "ソープ"},

        ],
        btn_next : "次へ"
    };

    res.json(result_json);
});
/*GET GENRE*/
router.get('/genre_id', function (req, res) {
    var result_json = {
        data: [
            {value: "23", text: "AV女優在籍"},
            {value: "14", text: "巨乳・爆乳"},
            {value: "6", text: "人妻・熟女"},
            {value: "1", text: "回春性感"},
            {value: "22", text: "ギャル"},
            {value: "13", text: "素人・未経験"},
            {value: "20", text: "ロリ・妹系"},
            {value: "15", text: "ぽちゃ・デブ"},
            {value: "21", text: "OL・お姉さん"},
            {value: "7", text: "韓ﾃﾞﾘ・アジアン"},
            {value: "9", text: "金髪・ﾌﾞﾛﾝﾄﾞ"},
            {value: "17", text: "学園・教師"}
        ],
        btn_next : "次へ"
    };

    res.json(result_json);
});
/*GET VALUE IN CURRENT URL*/
router.get('/get_param', function (req, res) {
    var query = req.query;
    var current_url = query.current_url;
    var style_id = '';
    var pref_id = '';
    const style_list = {
        "styleなし": "0",
        "style1": "1",
        "style3": "3",
        "style5": "5",
        "style4": "4",
        "style6": "6",
    };
    /*get style id*/
    for (var style_text in style_list) {
        if (style_list.hasOwnProperty(style_text)) {
            if(style_list[style_text] && current_url.indexOf(style_text) != -1){
                style_id = style_list[style_text];
            }
        }
    }
    /*get pref id*/
    for (var i = 1; i <= 47; i++){
        if( /ranking-deli.jp/.test(current_url)  && (current_url.indexOf(`/${i}/`) != -1 || current_url.indexOf(`/${i}`) != -1) ){
            pref_id = i;
            if(!/fuzoku/.test(current_url)){
                style_id = "0"
            }
        }
    }

    var result_json = {
        style_id: [style_id],
        pref_id: [pref_id]
    };

    res.json(result_json);
});
/*GET LOCAL ADDRESS*/
router.post('/get_local_address', function(req, res, next){
    var body = req.body;
   /* var lat = body.lat;
    var long = body.long;
    var latlng = lat + ',' + long;*/
console.log('body get_local_address', body);
    /*request({
       uri: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&language=ja&sensor=false&key=AIzaSyDDxqvFQAP5hMxxEF96LkTHxbbtJXyb0Nc`,
       // uri: "https://maps.googleapis.com/maps/api/geocode/json?latlng=35.4622861,139.632353&language=ja&sensor=false&key=AIzaSyDDxqvFQAP5hMxxEF96LkTHxbbtJXyb0Nc",
       method: 'GET',
       json: true
    }, function (error, response, body) {
       if(body.results[0] && body.results[0].address_components){
           var address_components = body.results[0].address_components;
           if (typeof address_components != 'undefined' && Array.isArray(address_components) && address_components.length > 0) {
                getAddressComponent(address_components, function (address) {
                    getAddressCode(address, function (address_code) {
                        res.json(address_code);
                    });
                });
           }
       }else{
           res.json({});
       }
    });*/
    getAddressCode(body, function (address_code) {
        res.json(address_code);
    });
});
/*Convert condition*/
router.post('/convert_condition', function(req, res, next) {
    var body = req.body;
    
    var city_code = body.city_code;
    var pref_code = body.pref_code;
    var area_code = body.area_code;
    var style_id = body.style_id;
    var response = {
        city_text: '',
        pref_text: '',
        area_text: '',
        style_text: '',
    };
    var style_list = {
        "0" : "デリヘル",
        "1" : "ホテヘル",
        "3" : "箱ヘルス",
        "4" : "ピンサロ",
        "5" : "ソープ",
        "6" : "メンズエステ",
    };
    var condition = {};
    if(typeof style_id != 'undefined' && typeof style_list[style_id] != 'undefined'){
        response.style_text = style_list[style_id];
    }
    if(typeof city_code != 'undefined' && city_code != ''){
        condition['city_code'] = city_code;
    }
    if(typeof pref_code != 'undefined' && pref_code != ''){
        condition['pref_code'] = pref_code;
    }
    if(typeof city_code != 'undefined' && city_code != ''){
        condition['area_code'] = area_code;
    }
    console.log('condition = ', condition);
    getInfoShop(condition, function (result_check, data) {
        if(result_check){
            response.city_text = data.city;
            response.pref_text = data.pref;
            response.area_text = data.area;
            res.json(response);
        }else{
            res.json(response);
        }
    });
});
function getRegion(callback) {
    var data = [];
    ApiDeliRegion.find({}, function(err, result) {
        if (err) throw err;
        if(result){
            console.log(result.length);
            result.forEach(function (row) {
                if(data.indexOf(row.region) == -1){
                    data.push(row.region);
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function getArea(pref_code, callback) {
    var data = {};
    ApiDeli.find({pref_code: pref_code}, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(typeof data[row.area_code] == 'undefined'){
                    data[row.area_code] = row.area;
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function getPref(region, callback) {
    var data = {};
    ApiDeli.find({region: region}, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(typeof data[row.pref_code] == 'undefined'){
                    data[row.pref_code] = row.pref;
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function getCity(area_code, callback) {
    var data = {};
    ApiDeli.find({area_code: area_code}, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(typeof data[row.city_code] == 'undefined'){
                    data[row.city_code] = row.city;
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function encodeBase64(value){
    var encoded = Buffer.from(value).toString('base64');
    return encoded;
}

function decodeBase64(string) {
    try {
        if (typeof Buffer.from === "function") {
            return Buffer.from(string, 'base64');
        } else {
            return new Buffer(string, 'base64');
        }
    } catch(e) {
        console.log('Base 64 decode error: ', e);
    }
    return string;
}

function recommendGirl(param, callback) {
    try{
        var limit = 10;
        var pref_code = param.pref_code;
        var time = param.service_time;
        var all_time = ["0-30", "30-60","60-75","75-90", "90-"];
        var result = [];
        var carousel = [];
        var button_arr = [];
        console.log('===pref_code===', pref_code);
        pref_code = (typeof pref_code !== "undefined" && Array.isArray(pref_code) && pref_code.length) ? parseInt(pref_code.join(",")) : "";
        time = (typeof time !== "undefined" && time.indexOf("特になし") != -1) ? all_time : time;
        var area_code = (typeof param.area_code !== "undefined") ? convertToInteger(param.area_code) : "",
            city_code = (typeof param.city_code !== "undefined") ? convertToInteger(param.city_code) : "",
            style_id = (typeof param.style_id !== "undefined") ? convertToInteger(param.style_id) : "",
            genre_id = (typeof param.genre_id !== "undefined") ? convertToInteger(param.genre_id) : "",
            // time = (typeof param.service_time !== "undefined") ? service_time : "",
            price = (typeof param.price !== "undefined") ? param.price : "",
            user_device = param.user_device,
            load_more = param.load_more;
        var load_more_connect_scenario_id = (typeof param.load_more_connect_scenario_id !== "undefined") ? param.load_more_connect_scenario_id : "-1";
        var load_more_current_scenario_id = (typeof param.load_more_current_scenario_id !== "undefined") ? param.load_more_current_scenario_id : "-1";
        var genre_connect_scenario_id = (typeof param.genre_connect_scenario_id !== "undefined") ? param.genre_connect_scenario_id : "-1";
        var genre_current_scenario_id = (typeof param.genre_current_scenario_id !== "undefined") ? param.genre_current_scenario_id : "-1";
        var first_text = (typeof param.first_text !== "undefined") ? param.first_text : "このエリアに派遣できるオススメ店舗はこちらです。";
        var offset = (typeof load_more == 'undefined') ? 0 : parseInt(load_more);
        var count_all_item_load = offset;
        //call api get list recommend girl
        var request_body = {
            pref_id: pref_code,
            area_id: area_code,
            // local_id: city_code,
            style_id: style_id,
            time: time,
            price: price,
            hit_per_page: 5
        };
        /*var request_body = {
            "pref_id": 8,
            "area_id": [27],
            "style_id": [0],
            "local_id": [155],
            "time": ["60-75"],
            "price": ["0-15000"]
        };*/
        var first_result = {
            "type": "text",
            "text": first_text
        };
        var carousel_result = {
            attachment: {
                payload: {
                    template_type: "generic",
                    elements: [],
                    text_short_flg: 0
                },
                type: "template"
            }
        };
        if(genre_id != ''){
            request_body.genre_id = genre_id;
        }
        if(city_code != ''){
            request_body.local_id = city_code;
        }

        request_body = JSON.stringify(request_body);
        var token = "Bfne+ygvLp2IZBaPFV2z51e6Bk+IsI14BPwieRoSQNU=";
        var key = decodeBase64(token);
        var signature = crypto.createHmac('sha256', key).update(request_body).digest('base64');
        console.log('request_body', request_body);
        var headers = {
            'Content-type': 'application/json',
            'X-Ekichika-Signature': signature
        };
        request({
            uri: 'https://ranking-deli.jp/api/chatbot/shops/',
            method: 'POST',
            headers: headers,
            body: request_body
        }, function (error, response, body) {
            body = JSON.parse(body);

           if (!error && response.statusCode == 200){
                if(typeof body.shops != 'undefined'){
                    var shops = body.shops;
                    if(typeof load_more == 'undefined'){
                        result.push(first_result);
                    }
                    shops.forEach(function (shop, index) {
                        if(index >= offset && index < offset + limit){
                            var girls = shop.girls;
                            var price = shop.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                            // var local_name = (!shop.local_name || shop.local_name  == null || shop.local_name == undefined)  ? shop.area_name : shop.local_name;
                            var subtitle = '<p>' + shop.area_name + ' / ' + shop.businesstype_name + '</p>' +
                                '<ul><li><span class="set_time"></span><p>' + shop.business_hours + '</p></li>' +
                                '<li><span class="set_price"></span><p>' + shop.time + '分 ￥' + price + '</p></li></ul>';
                            if(girls.length){
                                var item_image_arr = [];
                                var buttons = [];
                                girls.forEach(function (girl) {
                                    if(item_image_arr.length < 3){
                                        item_image_arr.push(girl.image);
                                    }else{
                                        return;
                                    }
                                });
                                buttons.push(
                                    {
                                        "title" : "詳細を見る",
                                        "type" : "web_url",
                                        "url" : shop.url
                                    }
                                );
                                if(user_device == 'mobile'){
                                    buttons.push(
                                        {
                                            "title": "お店に電話する",
                                            "type": "tel",
                                            "tel": shop.tel,
                                            "data" : {
                                                "store_name": shop.name,
                                                "store_id": shop.id,
                                                "area": shop.area_name,
                                                "job_type": shop.businesstype_name
                                            }
                                        }
                                    );
                                }
                                carousel.push({
                                    "title" : shop.name,
                                    "subtitle" : subtitle,
                                    "item_url" : shop.url,
                                    "image_url" : item_image_arr[0],
                                    "image_url_sub" : item_image_arr,
                                    "header": {
                                        "label_left": "本日出勤",
                                        "label_right": shop.working_girls_count + '人'
                                    },
                                    "buttons" : buttons
                                });
                            }

                            count_all_item_load++;
                        }
                    });
                    /*Push item carousel*/
                    carousel_result['attachment']['payload']['elements'] = carousel;
                    result.push(carousel_result);
                    /*Add button load more*/
                    if(shops.length - count_all_item_load > limit){
                        button_arr.push({
                            "type" : "postback",
                            "title" : "もっと見る",
                            "payload" : `BSCENARIO_${load_more_current_scenario_id}_${load_more_connect_scenario_id}_-1_${encodeBase64("もっと見る")}`
                        });
                    }
                    button_arr.push({
                        "type" : "postback",
                        "title" : "条件を変える",
                        "payload" : `BSCENARIO_${genre_current_scenario_id}_${genre_connect_scenario_id}_-1_${encodeBase64("条件を変える")}`
                    });
                    var button_result = {
                        "attachment" : {
                            "type" : "template",
                            "payload" : {
                                "template_type" : "button",
                                "text" : "▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ",
                                "buttons" : button_arr
                            }
                        }
                    };
                    result.push(button_result);

                    return callback(true, result, count_all_item_load);
                }else{
                    return callback(false);
                }
           }else{
               return callback(false);
           }
        });
    }catch(e){
        console.log('Recommend error: ', e);
        return callback(false);
    }
}

function convertToInteger(arr) {
    if(Array.isArray(arr) && arr.length > 0){
        var result = arr.map(function (num) {
            return parseInt(num);
        });
        return result;
    }else{
        return "";
    }

}

function getAddressComponent(address_components, callback) {
    var result = {
        locality: '',
        sublocality_level_1: '',
        administrative_area_level_2: ''
    };
    for (var ind in address_components) {
        if (address_components.hasOwnProperty(ind)) {
            if(address_components[ind]){
                var types = address_components[ind].types;
                if(types.indexOf('locality') != -1){
                    result.locality = address_components[ind].long_name;
                }
                if(types.indexOf('sublocality_level_1') != -1){
                    result.sublocality_level_1 = address_components[ind].long_name;
                }
                if(types.indexOf('administrative_area_level_2') != -1){
                    result.administrative_area_level_2 = address_components[ind].long_name;
                }
            }
        }
    }
    return callback (result);
}

function getAddressCodeBak(address, callback) {
    var result = {
        city_code: '',
        pref_code: '',
        area_code: ''
    };
    if(address.locality != ''){
        var city_search = address.locality;
        console.log('locality = ', city_search);
        ApiDeli.find({city: {$regex: city_search}},function(err, result0) {
            if (err) throw err;
            // console.log(result0);
            if(result0.length == 1){
                result0.forEach(function (row) {
                    result.city_code = [row.city_code];
                    result.pref_code = [row.pref_code];
                    result.area_code = [row.area_code];
                });
                return callback(result);
            }else if(result0.length == 0 && address.administrative_area_level_2 != ''){
                var city_search_2 = address.administrative_area_level_2;
                console.log('administrative_area_level_2 = ', city_search_2);
                ApiDeli.find({city: {$regex: city_search_2}},function(err, result1) {
                    if (err) throw err;
                    if(result1.length == 1){
                        result1.forEach(function (row1) {
                            result.city_code = [row1.city_code];
                            result.pref_code = [row1.pref_code];
                            result.area_code = [row1.area_code];
                        });
                        return callback(result);
                    }else if(result0.length > 1 && address.sublocality_level_1 != ''){
                        var sublocality_1 = address.sublocality_level_1;
                        console.log('sublocality_1 = ', sublocality_1);
                        ApiDeli.find({$and: [{city: {$regex: city_search}}, {city: {$regex: sublocality_1}}]},function(err, result1_2) {
                            if (err) throw err;
                            if(result1_2.length == 1){
                                result1_2.forEach(function (row1_2) {
                                    result.city_code = [row1_2.city_code];
                                    result.pref_code = [row1_2.pref_code];
                                    result.area_code = [row1_2.area_code];
                                });
                                return callback(result);
                            }else{
                                return callback(result);
                            }
                        });
                    }else{
                        return callback(result);
                    }
                });
            }else if(result0.length > 1 && address.sublocality_level_1 != ''){
                var sublocality = address.sublocality_level_1;
                console.log('sublocality = ', sublocality);
                ApiDeli.find({$and: [{city: {$regex: city_search}}, {city: {$regex: sublocality}}]},function(err, result2) {
                    if (err) throw err;
                    if(result2.length == 1){
                        result2.forEach(function (row2) {
                            result.city_code = [row2.city_code];
                            result.pref_code = [row2.pref_code];
                            result.area_code = [row2.area_code];
                        });
                        return callback(result);
                    }else{
                        return callback(result);
                    }
                });
            }else{
                return callback(result);
            }
        });
    }
}

function getAddressCode(params, callback) {
    var no_result = {
        city_code: [],
        pref_code: [],
        area_code: []
    };
    var result = [];
    var test_result = [];
    var param_lat = params.lat;
    var param_lng = params.long;
    var init_radius = 50;

    ApiDeli.find({},function(err, shops) {
        if (err) throw err;
        if(shops){
            shops.forEach(function (shop) {
                var distance_between_shop = geolib.getDistance(
                    {latitude: shop.lat, longitude: shop.long},
                    {latitude: param_lat, longitude: param_lng}
                );
                distance_between_shop = geolib.convertUnit('km', distance_between_shop);
                if(distance_between_shop <= init_radius){
                    result.push({
                        distance: distance_between_shop,
                        city_code: [shop.city_code],
                        pref_code: [shop.pref_code],
                        area_code: [shop.area_code]
                    });
                }
            });
            if(result.length){
                result.sort(function(a, b){
                    return a.distance - b.distance;
                });
                return callback(result[0]);
            }else{
                return callback(no_result);
            }
        }else{
            return callback(no_result);
        }
    });
}

function getInfoShop(condition, callback) {
    var data = {
        area: "",
        pref: "",
        city: "",
    };
    ApiDeli.findOne(condition, function(err, result) {
        if (err) throw err;
        if(result){
            data.area = result.area;
            data.pref = result.pref;
            data.city = result.city;
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}
module.exports = router;
