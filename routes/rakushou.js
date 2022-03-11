// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
var moment = require('moment-timezone');
moment.locale('ja');
// var holiday = require('moment-holiday');
var JapaneseHolidays = require('japanese-holidays');

const ApiRakushouTime = model.ApiRakushouTime;

var saturday = '土曜日',
    sunday = '日曜日',
    weekend = '土日',
    public_holiday = '祝日',
    weekday = '平日';

/*GET calendar*/
router.get('/calendar', function(req, res, next){
    var clinic_name = getClinicName(req.query.clinic_name);
    var result_json = {
        "type": "009",
        "mode": "unavailable",
        "date": [],
        "list_date_disable" : []
    };
    var list_date_disable = [];
    var list_holidays = [];
    calendarDisable(clinic_name, function (result_check, data) {
        if(result_check && data){
            //get all japanese holiday
            var today = new Date();
            var getFullYear = today.getFullYear();
            for (var y = getFullYear; y < getFullYear + 10; y ++){
                var holidays = JapaneseHolidays.getHolidaysOf(y);
                holidays.forEach(function(holiday) {
                    var date = (holiday.date < 10) ? '0' + holiday.date : holiday.date;
                    var month = (holiday.month < 10) ? '0' + holiday.month : holiday.month;
                    var ymd = y + '-' + month + '-' + date;
                    list_holidays.push(ymd);
                });
            }
            //weekend
            var relax_for_week = false;
            if(typeof data[weekend] !== 'undefined' && data[weekend].length == 1 && data[weekend][0] === '定休日'){
                relax_for_week = true;
            }else if(typeof data[weekend] !== 'undefined' && data[weekend].length > 1 && data[weekend][0] !== '定休日'){
                relax_for_week = false;
            }else{
                if(typeof data[saturday] !== 'undefined' && data[saturday].length == 1 && data[saturday][0] === '定休日' &&
                    typeof data[sunday] !== 'undefined' && data[sunday].length == 1 && data[sunday][0] === '定休日'){
                    relax_for_week = true;
                }else if(typeof data[saturday] === 'undefined' && typeof data[sunday] === 'undefined'){
                    relax_for_week = true;
                }else if(typeof data[saturday] === 'undefined' && typeof data[sunday] !== 'undefined' && data[sunday].length == 1 && data[sunday][0] === '定休日'){
                    relax_for_week = true;
                }else if(typeof data[saturday] !== 'undefined' && data[saturday].length == 1 && data[saturday][0] === '定休日' && typeof data[sunday] === 'undefined'){
                    relax_for_week = true;
                }else if(typeof data[saturday] === 'undefined' || (typeof data[saturday] !== 'undefined' && data[saturday].length == 1 && data[saturday][0] === '定休日')){
                    list_date_disable = ['116'];
                }else if(typeof data[sunday] === 'undefined' || (typeof data[sunday] !== 'undefined' && data[sunday].length == 1 && data[sunday][0] === '定休日')){
                    list_date_disable = ['110'];
                }else{
                    list_date_disable = [];
                }
            }
            if(relax_for_week){
                list_date_disable = ['116', '110'];
            }
            //holiday
            if(typeof data[public_holiday] === 'undefined' || (typeof data[public_holiday] !== 'undefined' && data[public_holiday].length == 1 && data[public_holiday][0] === '定休日')){
                result_json['date'] = list_holidays;
            }
            /*for (var date_type in data) {
                var date_code = '';
                if (data.hasOwnProperty(date_type)) {
                    if(typeof data[weekend] !== 'undefined' && data[weekend].length == 1 && data[weekend][0] === '定休日'){
                        list_date_disable = ['116', '110'];
                    }else if(typeof data[weekend] !== 'undefined' && data[weekend].length > 1 && data[weekend][0] !== '定休日'){
                        list_date_disable = [];
                    }else{
                        if(typeof data[saturday] !== 'undefined' && data[saturday].length == 1 && data[saturday][0] === '定休日'){
                            date_code = '116';
                        }else if(typeof data[sunday] !== 'undefined' && data[sunday].length == 1 && data[sunday][0] === '定休日'){
                            date_code = '110';
                        }else if(typeof data[saturday] === 'undefined'){
                            date_code = '116';
                        }else if(typeof data[sunday] === 'undefined'){
                            date_code = '110';
                        }
                        if(list_date_disable.indexOf(date_code) === -1){
                            list_date_disable.push(date_code);
                        }
                    }
                    if(typeof data[public_holiday] === 'undefined' || (typeof data[public_holiday] !== 'undefined' && data[public_holiday].length == 1 && data[public_holiday][0] === '定休日')){
                        result_json['date'] = list_holidays;
                    }
                }
            }*/
            
            result_json['list_date_disable'] = list_date_disable;
            res.json(result_json);
        }else{
            res.json(result_json);
        }
    });
});

/*GET pulldown time*/
router.get('/timeList', function(req, res, next){
    var clinic_name = getClinicName(req.query.clinic_name);
    var date = req.query.date;
    var date_type = [weekday];
    var now = new Date(date);
    var is_holiday = JapaneseHolidays.isHoliday(now);
    if(is_holiday) {
        date_type = public_holiday;
    } else {
        var day = moment(date).weekday();
        if(day === 0){
            date_type = [sunday, weekend];
        }else if(day === 6){
            date_type = [saturday, weekend];
        }else{
            date_type = [weekday];
        }
    }

    var result_json = {
        type: "006",
        name: 'pulldown_time',
        data: []
    };
    var list = [];

    pulldownTime(clinic_name, date_type, function (result_check, data) {
        if(result_check && data){
            console.log(data);
            if(data[0] !== '定休日'){
                data.forEach(function (time) {
                    list.push({
                        value: time,
                        text: time
                    });
                });
                result_json['data'] = list;
                res.json(result_json);
            }else{
                res.json(result_json);
            }
        }else{
            res.json(result_json);
        }
    });
});

function pulldownTime(clinic_name, date_type, callback) {
    var data = [];
    ApiRakushouTime.find({clinic_name: clinic_name, date_type: {$in: date_type}}, {}, {sort: {created_at: 1}}, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                data.push(row.time);
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function calendarDisable(clinic_name, callback){
    var data = {};
    ApiRakushouTime.find({clinic_name: clinic_name}, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data[row.date_type] === void 0){
                    data[row.date_type] = [];
                }
                data[row.date_type].push(row.time);
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function getClinicName(clinic_name){
    if(typeof clinic_name !== "undefined"){
        clinic_name = decodeURI(clinic_name);
        clinic_name = clinic_name.substr(0, clinic_name.indexOf('（')).trim();
    }
    return clinic_name;
}

module.exports = router;
