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

var moment = require('moment-timezone');
moment.locale('ja');

//Fjnext pulldown job
router.get('/cvtracking.js', function(req, res, next){
    var query = req.query;
    console.log(query);
    var type = ( typeof query.type !== 'undefined') ? query.type : '';
    var order_id = ( typeof query.order_id !== 'undefined') ? query.order_id : '';
    var headers = req.headers;
    var referer = ( typeof req.headers !== 'undefined' && req.headers.referer) ? req.headers.referer : '';
    var now = new Date();
    var ymd = moment().format("YYYY-MM-DD");

    var insert_data = {
        source: "mbhonline",
        type: type,
        order_id: order_id,
        headers: headers,
        referer: referer,
        query: query,
        ymd: ymd,
        created_at : now,
        updated_at : now
    };
    //console.log(insert_data);
    var testCvTracking = new TestCvTracking(insert_data);
    testCvTracking.save(function(err) {
        setTimeout(function(order_id2, ymd2) {
            EfoCv.findOne({connect_page_id: "5d3a57d5a24a619db5748fe4", order_id: order_id2}, function(err, result) {
                //console.log("result", result);
                if(result){
                    if(type == "smartnews5"){
                        result.test_tracking_flg2 = 1;
                    }else{
                        result.test_tracking_flg = 1;
                    }
                    result.save();
                }
            });

        }, 3000, order_id, ymd, type);


    });


    res.setHeader('content-type', 'text/javascript');
    res.send(null);
});

module.exports = router;
