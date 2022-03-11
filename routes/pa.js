// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
var moment = require('moment-timezone');
moment.locale('ja');
var holiday = require('moment-holiday');
const ApiPaTime = model.ApiPaTime;
const Exception = model.Exception;
var none ='なし';

/*GET pulldown area*/
router.get('/areaList', function(req, res, next){
    var result_json = {
        type: "006",
        name:"pulldown_area",
        data: []
    };
    var list = [];
    pulldownData(function (result_check, result_data) {
        if(result_check){
            for (var area in result_data) {
                if (result_data.hasOwnProperty(area)) {
                    list.push({
                        value: area,
                        text: area
                    });
                }
            }
        }
        result_json['data'] = list;
        res.json(result_json);
    });
});
/*GET pulldown store*/
router.get('/storeList', function(req, res, next){
    var result_json = {
        type: "006",
        data: [],
        name:"pulldown_store",
        parent_name:["pulldown_area"]
    };
    var list = [];

    pulldownData(function (result_check, result_data) {
        if(result_check){
            for (var area in result_data) {
                if (result_data.hasOwnProperty(area)) {
                    if(result_data[area]){
                        result_data[area].forEach(function (store) {
                            list.push({
                                value: store,
                                text: store,
                                parent_option : [
                                    {
                                        name: "pulldown_area",
                                        value: area
                                    }
                                ]
                            });
                        });
                    }
                }
            }
            result_json['data'] = list;
            res.json(result_json);
        }
    });
});
/*GET pulldown time*/
router.get('/timeList', function(req, res, next){
    // var date_type_param = req.query.date_type;
    // var store_param = req.query.store;
    var date = req.query.date;
    var date_type = '平日';
    var is_holiday = holiday(date).isHoliday();
    var day = moment(date).weekday();
    if(is_holiday || [0,6].indexOf(day) != -1){
        date_type = '休日';
    }
    var result_json = {
        type: "006",
        name: 'pulldown_time',
        parent_name: ['pulldown_store'],
        data: []
    };
    var list = [];
    pulldownTime(date_type, function (result_check, data) {
        if(result_check && data){
            for (var store_name in data) {
                if (data.hasOwnProperty(store_name)) {
                    if(data[store_name]){
                        for (var time in data[store_name]) {
                            if (data[store_name].hasOwnProperty(time)) {
                                list.push({
                                    value: data[store_name][time],
                                    text: data[store_name][time],
                                    parent_option : [
                                        {
                                            name: "pulldown_store",
                                            value: store_name
                                        }
                                    ]
                                });
                            }
                        }
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
// Modifer : KhoaNT. Date : 02-01-2019

router.post('/partnerRequest', function (req, res, next){
    var body = req.body;
    //var cv_date = (body.cv_datetime ? moment(body.cv_datetime).format("YYYY/MM/DD") : moment().format("YYYY/MM/DD"));
    //if(cv_date == "Invalid date"){
    //    cv_date = moment().format("YYYY/MM/DD");
    //}

    var store_name = (body.store_name != void 0 && body.store_name !='') ? body.store_name : none ,
        comment = (body.comment != void 0 && body.store_name !='') ? body.comment : none ,
        date_1 = (body.date_1 != void 0 && body.date_1 !='') ? moment(body.date_1).format("LL") :none,
        date_2 = (body.date_2 != void 0 && body.date_2 !='') ? moment(body.date_2).format("LL") :none,
        date_3 = (body.date_3 != void 0 && body.date_3 !='') ? moment(body.date_3).format("LL") :none,
        time_1_holiday = (body.time_1_holiday != void 0 && body.time_1_holiday !='') ? body.time_1_holiday : none ,
        time_1_weekday = (body.time_1_weekday != void 0 && body.time_1_weekday !='') ? body.time_1_weekday : none ,
        time_2_holiday = (body.time_2_holiday != void 0 && body.time_2_holiday !='') ? body.time_2_holiday : none ,
        time_2_weekday = (body.time_2_weekday != void 0 && body.time_2_weekday !='') ? body.time_2_weekday : none ,
        time_3_holiday = (body.time_3_holiday != void 0 && body.time_3_holiday !='') ? body.time_3_holiday : none ,
        time_3_weekday = (body.time_3_weekday != void 0 && body.time_3_weekday !='') ? body.time_3_weekday : none ;

    var datetime_1;
    var datetime_2;
    var datetime_3;

    if(date_1 == none && time_1_holiday == none && time_1_weekday == none){
        datetime_1 = none;
    }else{
        datetime_1 = date_1 + (time_1_weekday != none ? time_1_weekday + "（平日）" : '') + (time_1_holiday != none ? time_1_holiday + "（休日）" : '');
    }
    if(date_2 == none && time_2_holiday == none && time_2_weekday == none){
        datetime_2 = none;
    }else{
        datetime_2 = date_2 + (time_2_weekday != none ? time_2_weekday + "（平日）" : '') + (time_2_holiday != none ? time_2_holiday + "（休日）" : '');
    }
    if(date_3 == none && time_3_holiday == none && time_3_weekday == none){
        datetime_3 = none;
    }else{
        datetime_3 = date_3 + (time_3_weekday != none ? time_3_weekday + "（平日）" : '') + (time_3_holiday != none ? time_3_holiday + "（休日）" : '');
    }

    var result = "■来店希望店舗：" + store_name + "   ■来店予約日時：【第一希望】" + datetime_1 + "　【第二希望】" + datetime_2 + "　【第三希望】" + datetime_3 + "　■お客様コメント：" + comment;

    res.json({comment: result});
});


function saveException(err){
    var now = new Date();
    var exception = new Exception({
        err: err,
        type: "002",
        sub_type: "Katsuden",
        push_chatwork_flg: 0,
        created_at : now,
        updated_at : now
    });
    exception.save(function(err) {
    });
}

function pulldownTime(date_type, callback) {
    var data = {};
    ApiPaTime.find({date_type: date_type}, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data[row.store] === void 0){
                    data[row.store] = [];
                }

                data[row.store].push(row.time);
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function pulldownData(callback) {
    var data = {};
    ApiPaTime.find({}, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data[row.area] === void 0){
                    data[row.area] = [];
                }
                if(data[row.area].indexOf(row.store) == -1){
                    data[row.area].push(row.store);
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}
module.exports = router;
