// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
const ApiMenkyo = model.ApiMenkyo;
const Exception = model.Exception;
const config = require('config');
var moment = require('moment-timezone');
/* GET pulldown Ares. */
router.post('/pulldownArea', function(req, res, next){
    var body = req.body;
    var current_url_title = getInfoSchool(body.current_url_title);
    var pref_default = current_url_title.pref;
    var area_default = '';
    var result_json = {
        type: "006",
        data: [],
        default_value: [area_default],
        name:"pulldown_area"
    };
    var list = [];
    pulldownArea(function (result_check, data) {
        if(result_check && data){
            for (var ind in data) {
                if(data[ind]){
                    list.push({
                        value: data[ind],
                        text: data[ind]
                    });
                }
            }
            ApiMenkyo.findOne({pref: pref_default},function(err1, result1) {
                if (err1) throw err1;
                if(result1){
                    area_default = result1.area;
                }
                result_json['default_value'] = [area_default];
                result_json['data'] = list;
                res.json(result_json);
            });
        }else{
            res.json(result_json);
        }
    });
});
/* GET pulldown Pref. */
router.post('/pulldownPref', function(req, res, next){
    var body = req.body;
    var current_url_title = getInfoSchool(body.current_url_title);
    var area_param = body.area;
    var pref_default = current_url_title.pref;
    var result_json = {
        type: "006",
        data: [],
        default_value: [pref_default],
        name:"pulldown_pref"
    };
    var list = [];
    pulldownPref(area_param, function (result_check, data) {
        if(result_check && data){
            for (var ind in data) {
                if(data[ind]){
                    list.push({
                        value: data[ind],
                        text: data[ind]
                    });
                }
            }
            result_json['data'] = list;
            res.json(result_json);
        }else{
            res.json(result_json);
        }
    });
});
/* GET pulldown School. */
router.post('/pulldownSchool', function(req, res, next){
    var body = req.body;
    var current_url_title = getInfoSchool(body.current_url_title);
    var pref_param = body.pref;
    var school_default = current_url_title.school_name;
    var result_json = {
        type: "006",
        data: [],
        default_value: [school_default],
        name:"pulldown_school"
    };
    var list = [];
    pulldownSchool(pref_param, function (result_check, data) {
        if(result_check && data){
            for (var ind in data) {
                if(data[ind]){
                    list.push({
                        value: data[ind],
                        text: data[ind]
                    });
                }
            }
            result_json['data'] = list;
            res.json(result_json);
        }else{
            res.json(result_json);
        }
    });
});
/*GET pulldown Room type*/
router.post('/pulldownRoomType', function(req, res, next){
    var body = req.body;
    var school_name_param = body.school_name;
    var result_json = {
        type: "006",
        data: []
    };
    var list = [];
    pulldownRoomOfSchool(school_name_param, function (result_check, room_list) {
        if(result_check && room_list){
            for (var ind in room_list) {
                if(room_list[ind]){
                    list.push({
                        value: room_list[ind],
                        text: room_list[ind]
                    });
                }
            }
            result_json['data'] = list;
            res.json(result_json);
        }else{
            res.json(result_json);
        }
    });
});

function getInfoSchool(current_url_title){
    var result = {};
    if(typeof current_url_title !== "undefined"){
        current_url_title = decodeURI(current_url_title);
        current_url_title = current_url_title.split('-');
        var school_name = (current_url_title[0] != void 0) ? current_url_title[0].trim() : '';
        var pref = (current_url_title[1] != void 0) ? current_url_title[1].trim() : '';
        result = {
            'school_name' : school_name,
            'pref' : pref
        };
    }
    return result;
}

function pulldownArea(callback){
    var data = [];
    ApiMenkyo.find({},function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data.indexOf(row.area) == -1){
                    data.push(row.area);
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }

    });
}

function pulldownPref(area_param, callback){
    var data = [];
    ApiMenkyo.find({area: area_param},function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data.indexOf(row.pref) == -1){
                    data.push(row.pref);
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }

    });
}

function pulldownSchool(pref_param, callback){
    var data = [];
    ApiMenkyo.find({pref: pref_param},function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data.indexOf(row.school_name) == -1){
                    data.push(row.school_name);
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }

    });
}

function pulldownRoomOfSchool(school_name_param, callback) {
    var data = [];
    ApiMenkyo.find({school_name: school_name_param},function(err, result) {
        if (err) throw err;
        if(result){
            result.forEach(function (row) {
                if(data.indexOf(row.room_type) == -1){
                    data.push(row.room_type);
                }
            });
            return callback(true, data);
        }else{
            return callback(false);
        }

    });
}

module.exports = router;
