// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
const ApiPalSchool = model.ApiPalSchool;
const ApiPalSchoolStartTime = model.ApiPalSchoolStartTime;
const ApiPalSchoolPrice = model.ApiPalSchoolPrice;
const Exception = model.Exception;
const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
moment.locale('ja');
/*GET radio license type*/
router.get('/radioLicenseType', function(req, res, next){
    var result_json = {
        type: "004",
        name:"radio_license_type",
        data: []
    };
    var list = [];
    var all_license_type = ["普通車AT", "普通車MT", "その他"];

    getLicenseTypeEnable(function (result_check, license_type_list) {
        if(result_check && license_type_list.length){
            if(license_type_list.indexOf('その他') == -1){
                license_type_list.push('その他');
            }
            all_license_type.forEach(function (license_type) {
                if(license_type_list.indexOf(license_type) != -1){
                    list.push({
                        value: license_type,
                        text: license_type
                    });
                }
            });
            result_json['data'] = list;
            res.json(result_json);
        }else{
            res.json(result_json);
        }
    });
});
/*GET radio school type*/
router.get('/radioSchoolType', function(req, res, next){
    var result_json = {
        type: "004",
        name:"radio_school_type",
        data: [
            { "value" : "合宿","text" : "合宿"},
            { "value" : "通学","text" : "通学"}
        ]
    };
    res.json(result_json);
});
/* GET pulldown Area. */
router.get('/pulldownArea', function(req, res, next){
    var current_url_title = getInfoSchool(req.query.current_url_title);
    var school_type_param = req.query.school_type;
    var pref_param = current_url_title.pref;
    var area_default = '';
    var result_json = {
        type: "006",
        data: [],
        default_value: [area_default],
        name:"pulldown_area",
        parent_name:["radio_school_type"]
    };
    var list = [];
    pulldownAreaAndSchool(school_type_param, function (result_check, data) {
        if(result_check && data){
            for (var school_type in data) {
                if (data.hasOwnProperty(school_type)) {
                    if(data[school_type]){
                        for (var area in data[school_type]) {
                            if (data[school_type].hasOwnProperty(area)) {
                                if(data[school_type][area]){
                                    list.push({
                                        value: area,
                                        text: area,
                                        parent_option : [
                                            {
                                                name: "radio_school_type",
                                                value: school_type
                                            }
                                        ]
                                    });
                                }
                            }
                        }
                    }
                }
            }
            ApiPalSchool.findOne({pref:pref_param, school_type:school_type_param},function(err1, result1) {
                if (err1) throw err1;
                if(result1){
                    area_default = result1.area;
                }
                result_json['default_value'] = [area_default];
                result_json['data'] = list;
                console.log('result_json', result_json);
                res.json(result_json);
            });
        }else{
            res.json(result_json);
        }
    });
});
/* GET pulldown School. */
router.get('/pulldownSchool', function(req, res, next){
    var current_url_title = getInfoSchool(req.query.current_url_title);
    var school_type_param = req.query.school_type;
    var area_param = req.query.area;
    var school_default = current_url_title.school_name;
    var result_json = {
        type: "006",
        data: [],
        default_value: [school_default],
        name:"pulldown_school",
        parent_name:["pulldown_area", "radio_school_type"]
    };
    var list = [];
    prefOfSchool(function (result_check1, data_pref) {
        if(result_check1){
            pulldownAreaAndSchool(school_type_param, function (result_check, data) {
                if(result_check && data){
                    for (var school_type in data) {
                        var school_pref = data_pref[school_type];
                        if (data.hasOwnProperty(school_type)) {
                            if(data[school_type]){
                                for (var area in data[school_type]) {
                                    if (data[school_type].hasOwnProperty(area)) {
                                        if(data[school_type][area]){
                                            for (var school_name in data[school_type][area]) {
                                                if (data[school_type][area].hasOwnProperty(school_name)) {
                                                    var pref_name = (school_pref[data[school_type][area][school_name]] != void 0) ? school_pref[data[school_type][area][school_name]] : '';
                                                    list.push({
                                                        value: data[school_type][area][school_name],
                                                        text: data[school_type][area][school_name] + '（' + pref_name + '）',
                                                        parent_option : [
                                                            {
                                                                name: "pulldown_area",
                                                                value: area
                                                            },
                                                            {
                                                                name: "radio_school_type",
                                                                value: school_type
                                                            }
                                                        ]
                                                    });
                                                }
                                            }
                                        }
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
        }else{
            res.json(result_json);
        }
    });
});
/* GET pulldown School start month. */
router.get('/pulldownSchoolStartMonth', function(req, res, next){
    var school_name_param = req.query.school_name;
    var license_type_param = req.query.license_type;
    var result_json = {
        type: "006",
        name: 'pulldown_school_start_month',
        parent_name: ['pulldown_school', 'radio_license_type'],
        data: []
    };
    var list = [];
    pulldownStartMonth(function (result_check, data) {
        if(result_check && data){
            for (var school_name in data) {
                if (data.hasOwnProperty(school_name)) {
                    if(data[school_name]){
                        for (var license_type in data[school_name]) {
                            if (data[school_name].hasOwnProperty(license_type)) {
                                if(data[school_name][license_type]){
                                    for (var month in data[school_name][license_type]) {
                                        if (data[school_name][license_type].hasOwnProperty(month)) {
                                            list.push({
                                                value: data[school_name][license_type][month],
                                                text: data[school_name][license_type][month],
                                                parent_option : [
                                                    {
                                                        name: "pulldown_school",
                                                        value: school_name
                                                    },
                                                    {
                                                        name: "radio_license_type",
                                                        value: license_type
                                                    }
                                                ]
                                            });
                                        }
                                    }
                                }
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
    /*if(school_name_param != void 0 && license_type_param != void 0){
        ApiPalSchoolStartTime.findOne({school_name:school_name_param, license_type:license_type_param},function(err, result) {
            if (err) throw err;
            if(result){
                result_json['data'] = result.start_m;
                res.json(result_json);
            }else{
                res.json(result_json);
            }
        });
    }else{
        res.json(result_json);
    }*/
});
/*GET available Calendar school start time. */
router.get('/calendarSchoolStartTime', function (req, res) {
    var school_name_param = req.query.school_name;
    var license_type_param = req.query.license_type;
    var result_json = {
        parent_name: ['pulldown_school', 'radio_license_type'],
        // mode: "available",
        // date: []
        input_follow_month: "pulldown_school_start_month",
        option_date: []
    };
    var list = [];
    calendarAvailableData(function (result_check, data) {
        if(result_check && data){
            for (var school_name in data) {
                if (data.hasOwnProperty(school_name)) {
                    if(data[school_name]){
                        for (var license_type in data[school_name]) {
                            if (data[school_name].hasOwnProperty(license_type)) {
                                list.push({
                                     "mode": "available",
                                     date: data[school_name][license_type],
                                     parent_option : [
                                         {
                                             name: "pulldown_school",
                                             value: school_name
                                         },
                                         {
                                             name: "radio_license_type",
                                             value: license_type
                                         }
                                     ]
                                 });
                            }
                        }
                    }
                }
            }
            result_json['option_date'] = list;
            res.json(result_json);
        }else{
            res.json(result_json);
        }
    });
    //end test
    /*if(school_name_param != void 0 && license_type_param != void 0){
        ApiPalSchoolStartTime.findOne({school_name:school_name_param, license_type:license_type_param},function(err, result) {
            if (err) throw err;
            if(result){
                result_json['date'] = result.start_time;
                res.json(result_json);
            }else{
                res.json(result_json);
            }
        });
    }else{
        res.json(result_json);
    }*/
});
/*GET pulldown Room type*/
router.get('/pulldownRoomType', function(req, res, next){
    var school_name_param = req.query.school_name;
    var result_json = {
        type: "006",
        parent_name:["pulldown_school"],
        data: []
    };
    var list = [];
    pulldownRoomOfSchool(function (result_check, room_list) {
        if(result_check && room_list){
            for (var school_name in room_list) {
                if (room_list.hasOwnProperty(school_name)) {
                    if(room_list[school_name]){
                        console.log(school_name);
                        for (var room_name in room_list[school_name]) {
                            list.push({
                                value: room_list[school_name][room_name],
                                text: room_list[school_name][room_name],
                                parent_option : [
                                    {
                                        name: "pulldown_school",
                                        value: school_name
                                    }
                                ]
                            });
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
/*GET price*/
router.get('/getPrice', function(req, res, next){
    var school_name_param = req.query.school_name;
    var room_name_param = req.query.room_name;
    var license_type_param = req.query.license_type;
    var start_time_param = req.query.start_time;

    var result_json = {
        end_time: "",
        price_total: ""
    };
    if(school_name_param != void 0 && room_name_param != void 0 && license_type_param != void 0 && start_time_param != void 0){
        getSchoolEndTime(school_name_param, license_type_param, start_time_param, function (result_check, end_time) {
            if(result_check){
                ApiPalSchoolPrice.findOne({school_name:school_name_param, room_name:room_name_param, season_start: {$lte: start_time_param}, season_end: {$gte: start_time_param}},function(err, result) {
                    if(result){
                        result_json['end_time'] = end_time;
                        var price_total = "";
                        if(result.price_total != void 0){
                            price_total = (license_type_param == '普通車MT') ? (result.price_total + result.mt_fee) : result.price_total;
                        }
                        result_json['price_total'] = price_total.toString();
                        console.log('result_json', result_json);
                        res.json(result_json);
                    }else{
                        res.json(result_json);
                    }
                });
            }else{
                res.json(result_json);
            }
        });
    }else{
        res.json(result_json);
    }
});
/*GET create description salesforce*/
router.get('/descriptionSalesforce', function(req, res, next){
    var commitment_param = (req.query.commitment != void 0) ? req.query.commitment : "";
    var number_people_param = (req.query.number_people != void 0) ? req.query.number_people : "";
    var request_param = (req.query.request != void 0) ? req.query.request : "";
    var question_param = (req.query.question != void 0) ? req.query.question : "";
    var room_type_param = (req.query.room_type != void 0) ? req.query.room_type : "";
    var result_json = {
        description: "こだわり：" + commitment_param + "; 人数：" + number_people_param + "; 問合せ内容：" + request_param + "; 質問：" + question_param + "; 部屋タイプ：" + room_type_param
    };

    res.json(result_json);
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

function getInfoSchool(current_url_title){
    var result = {};
    if(typeof current_url_title !== "undefined"){
        current_url_title = decodeURI(current_url_title);
        current_url_title = current_url_title.split(' ');
        current_url_title = current_url_title[0];
        var school_name = current_url_title.substr(0, current_url_title.indexOf('（')).trim();
        var pref = current_url_title.substr(current_url_title.indexOf('（') + 1).replace('）', '').trim();
        result = {
            'school_name' : school_name,
            'pref' : pref
        };
    }
    return result;
}

function pulldownAreaAndSchool(school_type, callback) {
    var data = {};
    if(school_type == "通学"){
        ApiPalSchool.find({},function(err, result) {
            if (err) throw err;
            if(result){
                result.forEach(function (row) {
                    if(data[row.school_type] === void 0){
                        data[row.school_type] = {};
                    }
                    if(data[row.school_type][row.area] === void 0){
                        data[row.school_type][row.area] = [row.school_name];
                    }else{
                        if(data[row.school_type][row.area].indexOf(row.school_name) == -1){
                            data[row.school_type][row.area].push(row.school_name);
                        }
                    }
                });
                return callback(true, data);
            }else{
                return callback(false);
            }

        });
    }else{
        getSchoolEnable(function (result_check, school_list) {
            if(result_check && school_list.length){
                ApiPalSchool.find({school_name: {$in: school_list}},function(err, result) {
                    if (err) throw err;
                    if(result){
                        result.forEach(function (row) {
                            if(data[row.school_type] === void 0){
                                data[row.school_type] = {};
                            }
                            if(data[row.school_type][row.area] === void 0){
                                data[row.school_type][row.area] = [row.school_name];
                            }else{
                                if(data[row.school_type][row.area].indexOf(row.school_name) == -1){
                                    data[row.school_type][row.area].push(row.school_name);
                                }
                            }
                        });
                        return callback(true, data);
                    }else{
                        return callback(false);
                    }

                });
            }
        });
    }
}

function prefOfSchool(callback) {
    var data = {};
    ApiPalSchool.find({},function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data[row.school_type] === void 0){
                    data[row.school_type] = {};
                }
                if(data[row.school_type][row.school_name] === void 0){
                    data[row.school_type][row.school_name] = row.pref;
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function removeDuplicates(arr) {
    var newArr = [];
    var unique = {};
    arr.forEach(function(item) {
        if (!unique[item.value]) {
            newArr.push(item);
            unique[item.value] = item;
        }
    });
    return newArr;
}

function calendarAvailableData(callback) {
    var data = {};
    var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD");
    console.log('current_Date', current_date);
    ApiPalSchoolStartTime.find({start_time: { $gt : current_date}}, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data[row.school_name] === void 0){
                    data[row.school_name] = {};
                }
                if(data[row.school_name][row.license_type] === void 0){
                    data[row.school_name][row.license_type] = [row.start_time];
                }else{
                    data[row.school_name][row.license_type].push(row.start_time);
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function pulldownStartMonth(callback) {
    var data = {};
    var now = new Date();
    var year = now.getFullYear();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    ApiPalSchoolStartTime.find({start_y:{$gte : year}}, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data[row.school_name] === void 0){
                    data[row.school_name] = {};
                }
                if(row.start_y > year || (row.start_y == year && row.start_m >= month)){
                    if(data[row.school_name][row.license_type] === void 0){
                        data[row.school_name][row.license_type] = [row.start_m];
                    }else{
                        if(data[row.school_name][row.license_type].indexOf(row.start_m) == -1){
                            data[row.school_name][row.license_type].push(row.start_m);
                        }
                    }
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function getSchoolEndTime(school_name, license_type, start_time, callback){
    ApiPalSchoolStartTime.findOne({school_name: school_name, license_type: license_type, start_time: start_time}, function(err, result) {
        if (err) throw err;
        if(result){
            return callback(true, result.end_time);
        }else{
            return callback(false, '');
        }
    });
}

function getSchoolEnable(callback){
    var data = {};
    var school_list = [];
    ApiPalSchoolStartTime.find({}, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data[row.school_name] === void 0){
                    data[row.school_name] = {};
                    school_list.push(row.school_name);
                }
            });
            if(school_list.indexOf('中央バス自動車学校') == -1){
                school_list.push('中央バス自動車学校');
            }
            return callback(true, school_list);
        }else{
            return callback(false);
        }
    });
}

function pulldownRoomOfSchool(callback) {
    var data = {};
    ApiPalSchoolPrice.find({},function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data[row.school_name] === void 0){
                    data[row.school_name] = [];
                }
                if(data[row.school_name].indexOf(row.room_name) == -1){
                    data[row.school_name].push(row.room_name);
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }
    });
}

function getLicenseTypeEnable(callback){
    var data = {};
    var license_type_list = [];
    ApiPalSchoolStartTime.find({}, function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data[row.license_type] === void 0){
                    data[row.license_type] = {};
                    license_type_list.push(row.license_type);
                }
            });
            return callback(true, license_type_list);
        }else{
            return callback(false);
        }
    });
}

module.exports = router;
