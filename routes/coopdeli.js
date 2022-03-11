// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
var model = require('../model');
const Exception = model.Exception;
var moment = require('moment-timezone');
moment.locale('ja');
//const TIMEZONE = config.get('timezone');

const gmo_shop_arr = [
    {
        "shop_name": "コープダイレクト（みらい）",
        "shop_id": "9100070838551",
        "shop_password": "f5d8md3b",
        "pref": [
            "東京都",
            "千葉県",
            "埼玉県"
        ]
    },
    {
        "shop_name": "コープダイレクト（いばらき）",
        "shop_id": "9100070838552",
        "shop_password": "m6szek6h",
        "pref": [
            "茨城県"
        ]
    },
    {
        "shop_name": "コープダイレクト（とちぎ）",
        "shop_id": "9100070838553",
        "shop_password": "4mfky3rt",
        "pref": [
            "栃木県"
        ]
    },
    {
        "shop_name": "コープダイレクト（ぐんま）",
        "shop_id": "9100070838554",
        "shop_password": "45hy6w66",
        "pref": [
            "群馬県"
        ]
    },
    {
        "shop_name": "コープダイレクト（ながの）",
        "shop_id": "9100070838555",
        "shop_password": "3e3c6m2w",
        "pref": [
            "長野県"
        ]
    },
    {
        "shop_name": "コープダイレクト（にいがた）",
        "shop_id": "9100070838556",
        "shop_password": "wcmztshn",
        "pref": [
            "新潟"
        ]
    }
];

router.post('/shiryou', function(req, res, next){
    var body = req.body;

    var shiryou = body.shiryou;
    shiryou = shiryou.split(',');

    var result_json = {
        shiryou1: [],
        shiryou2: []
    };

    if(shiryou){
        if(shiryou.indexOf('1') != -1 && shiryou.indexOf('2') != -1){
            result_json['shiryou1'].push({value: "1", text: '資料請求する'});
            result_json['shiryou2'].push({value: "1", text: '資料請求する'});
        }else if(shiryou.indexOf('1') != -1){
            result_json['shiryou1'].push({value: "1", text: '資料請求する'});
            result_json['shiryou2'].push({value: "2", text: '資料請求しない'});
        }else if(shiryou.indexOf('2') != -1){
            result_json['shiryou1'].push({value: "2", text: '資料請求しない'});
            result_json['shiryou2'].push({value: "1", text: '資料請求する'});
        }
    }
    console.log(result_json);
    res.json(result_json);
});

router.post('/getGmoPG', function(req, res, next){
    var body = req.body;
    var token = body.token;
    var pref_name = body.pref_name;
    var mode = body.mode;
    console.log(body);
    if(token == "AeOd7PxFTFklRo12CtOKiTIjYdsZDZqJ"){
        if(mode != "production"){
            res.json({
                "shop_name": "株式会社wevnalテストのGMOPG",
                "shop_id": "tshop00037792",
                "shop_password": "atr5tqym",
                "mode": "test",
                "provider": "004"
            });
            return;
        }
        var result_json = {
            "shop_name": "コープダイレクト（みらい）",
            "shop_id": "9100070838551",
            "shop_password": "f5d8md3b",
            "mode": "production",
            "provider": "004"
        };
        for(var i = 0; i < gmo_shop_arr.length; i++){
            var tmp = gmo_shop_arr[i];
            var pref = tmp.pref;
            if(pref.indexOf(pref_name) > -1){
                result_json = {
                    "shop_name": tmp.shop_name,
                    "shop_id": tmp.shop_id,
                    "shop_password": tmp.shop_password,
                    "mode": "production",
                    "provider": "004"
                };
                break;
            }
        }
        res.json(result_json);
    }else{
        res.json({
            "shop_name": "未定",
            "shop_id": "",
            "shop_password": "",
            "mode": "unknown"
        });
    }
});

router.get('/getPrice', function (req, res) {
    var query = req.query;
    var total_price = query.total_price;
    var result_json = {
        order_tax: 0,
        order_sub_total: 0
    };
    if(total_price > 0){
        var order_sub_total = Math.ceil(parseInt(total_price) / 1.08);
        result_json['order_tax'] = parseInt(total_price) - order_sub_total;
        result_json['order_sub_total'] = order_sub_total;
    }
    res.json(result_json);
});

router.post('/getNewDate', function (req, res) {
    var body = req.body;
    console.log(body);
    var date = (typeof body.date !== "undefined") ? body.date : "";
    var time = (typeof body.time !== "undefined") ? body.time : "";

    var delivery_date = (typeof body.delivery_date !== "undefined") ? body.delivery_date : "";
    var delivery_time = (typeof body.delivery_time !== "undefined") ? body.delivery_time : "";


    var result_json = {};

    if(date !== ""){
        var date_new = moment(date).format("MM月DD日（ddd）");
        result_json = {
            datetime: "説明希望日【" + date_new + "】説明希望時間【" + time + "】",
            date: date_new
        };
    }

    if(delivery_date !== ""){
        var delivery_date_new = moment(delivery_date).format("MM月DD日(ddd)");
        result_json.delivery_datetime =  "【訪問希望日】" + delivery_date_new + "【訪問希望時間】" + delivery_time;
        result_json.delivery_date =  delivery_date_new;
    }

    console.log(result_json);
    res.json(result_json);
});

module.exports = router;
