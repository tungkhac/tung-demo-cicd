// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
var moment = require('moment-timezone');
moment.locale('ja');
var JapaneseHolidays = require('japanese-holidays');
const ApiNikibicTime = model.ApiNikibic;
const Exception = model.Exception;

/*GET calendar*/
router.post('/calendar', function(req, res, next){
    var query = req.body;
    var params = {
        store_name: query.store_name
    };
    var result_json = {
        "type": "009",
        "mode": "unavailable",
        "date": [],
        "list_date_disable" : []
    };

    getListDateDisable(params, function (list_date_not_work) {
        result_json['date'] = list_date_not_work;
        res.json(result_json);
    });

});

/*GET pulldown time*/
router.post('/timeList', function(req, res, next){
    // var date = req.query.date;
    var query = req.body;
    var date = query.date;
    var params = {
        date: date,
        store_name: query.store_name
    };
    var result_json = {
        type: "006",
        name: 'pulldown_time',
        data: []
    };

    var list = [];
    pulldownTime(params, function (result_check, data) {
        if(result_check && data){
            for (var date in data) {
                if (data.hasOwnProperty(date)) {
                    if(data[date]){
                        for (var time in data[date]) {
                            if (data[date].hasOwnProperty(time)) {
                                list.push({
                                    value: data[date][time],
                                    text: data[date][time]
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

function pulldownTime(params, callback) {
    var data = {};
    var condition = {store_name: params.store_name, date: params.date, working_flg: 1};

    ApiNikibicTime.find(condition, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data[row.date] === void 0){
                    data[row.date] = [];
                }
                data[row.date].push(row.time);
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function getListDateDisable(params, callback) {
    var list_date = [];
    var count_time_not_work = [];
    var list_date_not_work = [];
    var list_date_time = [];
    for(var i = 0; i <= 90; i++){
        var today = new Date();
        today.setDate(today.getDate() + i);
        var year = today.getFullYear();
        var month = ("0" + (today.getMonth() + 1)).slice(-2);
        var date = ("0" + today.getDate()).slice(-2);
        var ymd = year + '-' + month + '-' + date;
        list_date.push(ymd);
    }

    var condition = {store_name: params.store_name, date: {$in: list_date}};

    ApiNikibicTime.find(condition, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(row.working_flg == 0){
                    if(count_time_not_work[row.date] === void 0){
                        count_time_not_work[row.date] = 1;
                    }else{
                        count_time_not_work[row.date] += 1;
                    }
                }
                //all time sheet
                if(list_date_time[row.date] === void 0){
                    list_date_time[row.date] = 1;
                }else{
                    list_date_time[row.date] += 1;
                }
            });
            if(Object.keys(count_time_not_work).length > 0){
                Object.keys(count_time_not_work).forEach(function(date) {
                    if(count_time_not_work[date] == list_date_time[date]){
                        list_date_not_work.push(date);
                    }
                });
            }

            return callback(list_date_not_work);
        }else{
            return callback(list_date_not_work);
        }
    });
}
module.exports = router;
