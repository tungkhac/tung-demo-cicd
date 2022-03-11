// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
const config = require('config');
var moji = require('moji');
var getAge = require('get-age');
var moment = require('moment-timezone');
moment.locale('ja');

const url_require = require('url');
const querystring = require('querystring');

const EfoMessageVariable = model.EfoMessageVariable;
const EfoCv = model.EfoCv;

const array_url_param = {
    "2lb_ig": "チャットボット_ラクビ_イングリウッド",
    "2lb_ig_zen": "チャットボット_ラクビ_イングリウッド_ゼンクラーク",
    "2lb_pi": "チャットボット_ラクビ_ピアラ",
    "2lb_pi_zen": "チャットボット_ラクビ_ピアラ_ゼンクラーク",
    "2lb_ca": "チャットボット_ラクビ_サイバーエース",
    "2lb_ca_zen": "チャットボット_ラクビ_サイバーエース_ゼンクラーク",
    "2lb_pi_tu_bo": "チャットボット_ラクビ_ピアラ980"
};

const order_id_default = 80000001;

router.post('/convertData', function(req, res, next) {
    var body = req.body;
    var product_code = parseInt(body.product_code);
    var birthDay = body.birth_day;
    var name = body.name;
    var furigana = body.furigana;
    var current_url = body.current_url;
    var user_id = body.user_id;
    var bot_id = body.bot_id;
    var variable_id = body.variable_id;

    console.log("current_url=", current_url);

    var response = {
        product_code : '',
        product_quantity: 0,
        product_name: '',
        age: 0,
        name: '',
        name_zenkaku: '',
        furigana: '',
        furigana_hankaku: '',
        birthday: '',
        申込み媒体内容: '',
        address: ""
    };

    if(name && name != '' && name != 'undefined') {
        response.name = name;
        response.name_zenkaku = convertTextZenka(name);
    }

    if(furigana && furigana != '' && furigana != 'undefined') {
        response.furigana = furigana;
        response.furigana_hankaku = convertTextHanka(furigana);
    }

    if(current_url && current_url != '' && current_url != 'undefined') {
        response.申込み媒体内容 = getParam(current_url);
    }

    if(birthDay && birthDay != '' && birthDay != 'undefined') {
        response.birthday = birthDay;
        response.age = getAge(birthDay);
    }

    if(product_code === 1) {
        response.product_code = product_code;
        response.product_name = '【毎月定期ｺｰｽ】ラクビ';
        response.product_quantity = 1;
    } else if(product_code === 2) {
        response.product_code = product_code;
        response.product_name = '【おまとめ定期ｺｰｽ】ラクビ';
        response.product_quantity = 3;
    }

    var address_pref = typeof body.address_pref !== "undefined" ? body.address_pref : "";
    var address_city = typeof body.address_city !== "undefined" ? body.address_city : "";
    var address_stress = typeof body.address_stress !== "undefined" ? body.address_stress : "";
    response.address = address_pref + address_city + address_stress;


    getMaxOrderId(bot_id, function (order_id) {
        response.order_id = order_id;
        console.log(response);
        res.status(200).json(response);

        //update order_id
        var now = new Date();
        EfoCv.update({ "connect_page_id" : bot_id,
            "user_id" : user_id}, {
            $set: {
                order_id: order_id,
                updated_at: now
            }
        }, {upsert: false, multi: false}, function(err, result) {

        });
    });
});

function getMaxOrderId(bot_id, callback) {
    EfoCv.findOne({connect_page_id: bot_id, cv_flg: 1, order_id: {$ne: null}}, function(err, result) {
        if (result) {
            return callback(parseInt(result.order_id) + 1)
        } else {
            return callback(order_id_default);
        }
    }).sort({order_id: -1});
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

function convertTextZenka(str = '') {
    var result = '';
    try {
        if (str) {
            str = moji(str).convert('HK', 'ZK').toString();
            result = str.replace(/ /g, "　");
        }
    } catch (e) {
        console.log('convertTextZenka', e);
    }

    return result;
}

function getParam(url) {
    if (url != void 0) {
        const url_parts = url_require.parse(url);
        var path_name = url_parts.path;
        var arr_match = [];
        if (path_name) {
            var arr_param = Object.keys(array_url_param);
            for(var i = 0; i < arr_param.length; i++) {
                var match_item = {};
                // console.log("arr_param[i]==", arr_param[i]);
                //--->match text 100%
                // var regex = new RegExp("(^|\\W)" + arr_param[i] + "($|\\W)");
                // var match = path_name.match(regex);
                // if(match && match[0]) {
                //     return array_url_param[arr_param[i]];
                // }
                //--->Match position min
                var match = path_name.search(arr_param[i]);
                if(match != -1) {
                    match_item.index = match + arr_param[i].length;
                    match_item.text = arr_param[i];
                    arr_match.push(match_item);
                }
            }
        }

        console.log("arr_match===", arr_match);
        if(arr_match.length > 0) {
            arr_match.sort((a, b) => (a.index > b.index) ? 1 : -1);
            return array_url_param[arr_match[arr_match.length -1].text];
        }

        return '';
    } else {

        return '';
    }
}



module.exports = router;
