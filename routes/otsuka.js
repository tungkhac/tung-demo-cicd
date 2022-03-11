// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
var moment = require('moment-timezone');
moment.locale('ja');
var JapaneseHolidays = require('japanese-holidays');
const ApiOtsukaTime = model.ApiOtsukaSchema;
const Exception = model.Exception;
var none ='なし';
var holidays = {
    "東京都　大塚院": {
        holiday: 0,
        thursday: 0,
        sunday: 0,
    },
    "北海道　札幌院": {
        holiday: 0,
        thursday: 0,
        sunday: 1,
    },
    "埼玉県　大宮院": {
        holiday: 1,
        thursday: 0,
        sunday: 1,
    },
    "神奈川県　横浜院": {
        holiday: 0,
        thursday: 1,
        sunday: 1,
    },
    "石川県　金沢院": {
        holiday: 1,
        thursday: 0,
        sunday: 1,
    },
    "京都府　京都院": {
        holiday: 1,
        thursday: 0,
        sunday: 1,
    }
};
var day_of_week = {
    "1": 'monday',
    "2": 'tuesday',
    "3": 'wednesday',
    "4": 'thursday',
    "5": 'friday',
    "6": 'saturday',
    "0": 'sunday',
};
/*GET calendar*/
router.get('/calendar', function(req, res, next){
    var query = req.query;
    var store_name = query.store_name;
    var params = {
        store_name: query.store_name,
        department: query.department
    };
    var result_json = {
        "type": "009",
        "mode": "unavailable",
        "date": [],
        "list_date_disable" : []
    };
    var list_date_disable = [];
    var list_holidays = [];

    getListDateDisable(params, function (list_date_not_work) {
        /*if(list_date_not_work){
            list_holidays = list_holidays.concat(list_date_not_work);
        }
        //get all japanese holiday
        var today = new Date();
        var getFullYear = today.getFullYear();
        for (var y = getFullYear; y < getFullYear + 10; y ++){
            var holiday_lists = JapaneseHolidays.getHolidaysOf(y);
            holiday_lists.forEach(function(holiday) {
                var date = (holiday.date < 10) ? '0' + holiday.date : holiday.date;
                var month = (holiday.month < 10) ? '0' + holiday.month : holiday.month;
                var ymd = y + '-' + month + '-' + date;
                list_holidays.push(ymd);
            });
        }

        if(holidays[store_name] != void 0){
            var day_off = holidays[store_name];
            if(day_off.holiday){
                result_json['date'] = list_holidays;
            }else{
                result_json['date'] = list_date_not_work;
            }
            if(day_off.thursday){
                list_date_disable.push('114');
            }
            if(day_off.sunday){
                list_date_disable.push('110');
            }
            result_json['list_date_disable'] = list_date_disable;
        }*/
        result_json['date'] = list_date_not_work;

        res.json(result_json);
    });

});

/*GET pulldown time*/
router.get('/timeList', function(req, res, next){
    // var date = req.query.date;
    var query = req.query;
    var date = query.date;
    var params = {
        date: date,
        store_name: query.store_name,
        department: query.department
    };
    var result_json = {
        type: "006",
        name: 'pulldown_time',
        data: []
    };
    /*var day_code = moment(date).day();
    var is_holidays = false;
    var now = new Date(date);
    var is_holiday = JapaneseHolidays.isHoliday(now);
    if(holidays[query.store_name] != void 0){
        var day_off = holidays[query.store_name];
        if(is_holiday) {
            if(day_off.holiday){
                is_holidays = true;
            }
        } else {
            if(day_of_week[day_code] != void 0){
                var day = day_of_week[day_code];
                if(day_off[day]){
                    is_holidays = true;
                }
            }
        }
    }
    if(is_holidays){
        res.json(result_json);
        return;
    }*/
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
    var is_department_arr = ['東京都　大塚院'];
    if(is_department_arr.indexOf(params.store_name) != -1){
        condition = {store_name: params.store_name, department: params.department, date: params.date, working_flg: 1};
    }
    ApiOtsukaTime.find(condition, {}, {sort: {time: 1}}, function(err, result) {
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
        // var month = String(today.getMonth() + 1).padStart(2, '0');
        // var date = String(today.getDate()).padStart(2, '0');
        var month = ("0" + (today.getMonth() + 1)).slice(-2);
        var date = ("0" + today.getDate()).slice(-2);
        var ymd = year + '-' + month + '-' + date;
        list_date.push(ymd);
    }
    // var condition = {store_name: params.store_name, date: {$in: list_date}, working_flg: 0};
    var condition = {store_name: params.store_name, date: {$in: list_date}};
    var is_department_arr = ['東京都　大塚院'];
    if(is_department_arr.indexOf(params.store_name) != -1){
        condition.department = params.department;
    }

    ApiOtsukaTime.find(condition, function(err, result) {
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
                    // if(count_time_not_work[date] == 13){
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
