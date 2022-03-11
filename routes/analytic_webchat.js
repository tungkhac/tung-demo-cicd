// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const express = require('express');
const router = express.Router();
const common = require('../modules/common');
const model = require('../model');
const UserProfile = model.UserProfile;
const AnalyticPageview = model.AnalyticPageview;
const AnalyticCv = model.AnalyticCv;
const { increaseCvForUserProfile } = require('../modules/common');


router.get('/pageview', function(req, res) {
    var query = req.query;
    var connect_page_id = query.cpid;
    // console.log('---Analytic Pageview');

    //304: image load from browser cache -> not execute anything
    if(connect_page_id != void 0 && connect_page_id != '') {
        try{
            var now = new Date();
            var current_month = now.getMonth() + 1,
                current_day = now.getDate();
            current_month = (current_month < 10 ? '0' : '') + current_month;
            current_day = (current_day < 10 ? '0' : '') + current_day;
            var ymd = now.getFullYear() + '-' + current_month + '-' + current_day;

            var user_id         = (typeof query.uid != 'undefined') ? query.uid : '',
                current_url     = (typeof query.curl != 'undefined') ? decodeURIComponent(query.curl) : '',
                referer         = (typeof query.ref != 'undefined') ? decodeURIComponent(query.ref) : '',
                title           = (typeof query.title != 'undefined') ? decodeURIComponent(query.title) : '',
                user_agent      = (typeof query.user_agent != 'undefined') ? decodeURIComponent(query.user_agent) : '',
                last_active_at  = (typeof query.t != 'undefined') ? query.t : '';

            AnalyticPageview.findOne({
                cpid: connect_page_id,
                uid: user_id,
                ymd: ymd,
                current_url: current_url,
                referer: referer,
                title: title,
            }, function(err, result) {
                if(err) {
                    console.log('Analytic pageview get document error: ', err);
                }
                var is_update = true;

                //check request 304 from browser. Image API from cache can request -> check by last active at array
                if(result && Array.isArray(result.last_active_at) && result.last_active_at.indexOf(last_active_at) > -1) {
                    is_update = false;
                }

                if(is_update) {
                    var data_insert = {
                        cpid: connect_page_id,
                        uid: user_id,
                        ymd: ymd,
                        current_url: current_url,
                        referer: referer,
                        title: title,
                        user_agent: user_agent,
                    };
                    // console.log('Analytic pageview insert: ', data_insert);

                    AnalyticPageview.findOneAndUpdate(data_insert, {
                        $inc: {pageview_count: 1},
                        $push: {last_active_at: last_active_at},
                        $set: {
                            updated_at : now,
                        },
                        $setOnInsert: {created_at: now}
                    }, { upsert: true }, function(err, result) {
                        if (err) throw err;
                        if(result) {
                            // console.log('Analytic pageview insert/update success');

                        } else if (err) {
                            common.saveException(connect_page_id, "Analytic pageview insert/update error", {
                                requestData: query,
                                error: err
                            });
                        }
                    });
                }
            });

        } catch (e) {
            console.log('Analytic pageview catch: ', e);
            common.saveException(connect_page_id, "Analytic pageview catch", {
                requestData: query,
                error: e
            });
        }
    }
    res.status(200).json({});
});


router.get('/cv', function(req, res) {
    var query = req.query;
    var connect_page_id = query.cpid;
    // console.log('---Analytic CV');

    if(connect_page_id != void 0 && connect_page_id != '') {
        try{
            var now = new Date();
            var current_month = now.getMonth() + 1,
                current_day = now.getDate();
            current_month = (current_month < 10 ? '0' : '') + current_month;
            current_day = (current_day < 10 ? '0' : '') + current_day;
            var ymd = now.getFullYear() + '-' + current_month + '-' + current_day;

            var user_id         = (typeof query.uid != 'undefined') ? query.uid : '',
                current_url     = (typeof query.curl != 'undefined') ? decodeURIComponent(query.curl) : '',
                referer         = (typeof query.ref != 'undefined') ? decodeURIComponent(query.ref) : '',
                last_active_at  = (typeof query.t != 'undefined') ? query.t : '';

            increaseCvForUserProfile(connect_page_id, user_id);

            AnalyticCv.findOne({
                cpid: connect_page_id,
                uid: user_id,
                ymd: ymd,
                current_url: current_url,
                referer: referer,
            }, function(err, result) {
                if(err) {
                    console.log('Analytic CV get document error: ', err);
                }
                var is_update = true;

                //check request 304 from browser. Image API from cache can request -> check by last active at array
                if(result && Array.isArray(result.last_active_at) && result.last_active_at.indexOf(last_active_at) > -1) {
                    is_update = false;
                }

                if(is_update) {
                    var data_insert = {
                        cpid: connect_page_id,
                        uid: user_id,
                        ymd: ymd,
                        current_url: current_url,
                        referer: referer,
                    };
                    // console.log('Analytic CV insert: ', data_insert);

                    AnalyticCv.findOneAndUpdate(data_insert, {
                        $inc: {cv_count: 1},
                        $push: {last_active_at: last_active_at},
                        $set: {
                            updated_at : now,
                        },
                        $setOnInsert: {created_at: now}
                    }, { upsert: true }, function(err, result) {
                        if (err) throw err;
                        if(result) {
                            // console.log('Analytic CV insert success');

                        } else if (err) {
                            common.saveException(connect_page_id, "Analytic CV insert error", {
                                requestData: query,
                                error: err
                            });
                        }
                    });
                }
            });

        } catch (e) {
            console.log('Analytic CV catch: ', e);
            common.saveException(connect_page_id, "Analytic CV catch", {
                requestData: query,
                error: e
            });
        }
    }
    res.status(200).json({});
});



module.exports = router;
