// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by Dell on 2019-10-03.
 */
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
var TestCvTracking = model.TestCvTracking;
var EfoCv = model.EfoCv;
var PuppeteerOrderClick = model.PuppeteerOrderClick;
var Variable = model.Variable;
var EfoMessageVariable = model.EfoMessageVariable;


var moment = require('moment-timezone');
moment.locale('ja');


//Fjnext pulldown job
router.get('/checkstatus.js', function(req, res, next){
    var query = req.query;
    console.log(query);
    var bot_id = ( typeof query.bot_id !== 'undefined') ? query.bot_id : '';
    var user_id = ( typeof query.user_id !== 'undefined') ? query.user_id : '';
    var status = ( typeof query.status !== 'undefined') ? parseInt(query.status) : 0;
    var error_message = ( typeof query.error_message !== 'undefined') ? query.error_message : '';
    var order_id = ( typeof query.order_id !== 'undefined') ? query.order_id : '';
    var name = ( typeof query.name !== 'undefined') ? query.name : '';
    var order_type = ( typeof query.order_type !== 'undefined') ? query.order_type : '';

    res.setHeader('content-type', 'text/javascript');
    res.send(null);

    if(mongoose.Types.ObjectId.isValid(bot_id)){
        if(parseInt(status) == 1){
            if(name == "" || order_type == "number"){
                var matches = order_id.match(/(\d+)/);
                console.log(matches);
                if (matches) {
                    order_id = matches[0] + "";
                    EfoCv.update({connect_page_id: bot_id, user_id: user_id, order_id: null}, {$set: {order_id: order_id}}, {upsert: false, multi: false}, function (err) {
                        console.log("err1", err);
                    });

                    Variable.findOne({connect_page_id: bot_id, variable_name: "order_id", deleted_at: null}, function (err, result) {
                        if (err) throw err;
                        if(result) {
                            console.log(result._id);
                            var now = new Date();
                            EfoMessageVariable.update({
                                    connect_page_id: bot_id,
                                    user_id: user_id,
                                    variable_id: result._id
                                }, {$set: {variable_value: order_id, type: "001", created_at: now, updated_at: now}},
                                {upsert: true, multi: false}, function (err) {
                                    console.log("EfoMessageVariable=", err);
                                });
                        }
                    });
                }else{
                    order_id = "";
                }
            }
            else {
                EfoCv.update({connect_page_id: bot_id, user_id: user_id, order_id: null}, {$set: {order_id: order_id}}, {upsert: false, multi: false}, function (err) {
                    console.log("err1", err);
                });

                Variable.findOne({connect_page_id: bot_id, variable_name: "order_id", deleted_at: null}, function (err, result) {
                    if (err) throw err;
                    if(result) {
                        console.log(result._id);
                        var now = new Date();
                        EfoMessageVariable.update({
                                connect_page_id: bot_id,
                                user_id: user_id,
                                variable_id: result._id
                            }, {$set: {variable_value: order_id, type: "001", created_at: now, updated_at: now}},
                            {upsert: true, multi: false}, function (err) {
                                console.log("EfoMessageVariable=", err);
                            });
                    }
                });
            }
        }else{
            order_id = "";
        }
        PuppeteerOrderClick.update({cpid: bot_id, uid: user_id}, {$set: {order_status_flg: status, error_message: error_message, order_id: order_id}}, {upsert: false, multi: false}, function (err) {
            console.log("err2", err);
        });
    }
});

module.exports = router;
