// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
var moment = require('moment-timezone');
moment.locale('ja');
var holiday = require('moment-holiday');
const ApiAcneTime = model.ApiAcneSchema;
const Exception = model.Exception;
var none ='なし';

/*GET pulldown time*/
router.get('/timeList', function(req, res, next){
    var date = req.query.date;
    var result_json = {
        type: "006",
        name: 'pulldown_time',
        data: []
    };
    var list = [];
    pulldownTime(date, function (result_check, data) {
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

function pulldownTime(date, callback) {
    var data = {};
    ApiAcneTime.find({date: date, working_flg: 1}, function(err, result) {
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
module.exports = router;
