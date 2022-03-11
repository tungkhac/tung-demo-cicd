// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();
var model = require('../model');
const Exception = model.Exception;
var UserProfile = model.UserProfile;
var ReportCampaign = model.ReportCampaign;
var Campaign = model.Campaign;
const { increaseCvForUserProfile } = require('../modules/common');


router.get('/facebook', function (req, res) {
    var query = req.query;
    var current_url = req.headers.referer;
    console.log('Fb CV update from referer: ', current_url);
    if(query && current_url) {
        var connect_page_id = query.cid;
        try{
            console.log('CV query: ', query);

            var user_token = query['bclid'];
            var now = new Date();

            UserProfile.findOne({
                connect_page_id: connect_page_id,
                user_token: user_token
            }, function (err, userResult) {
                if (err) {
                    saveException(connect_page_id, {
                        requestData: query,
                        error: err
                    });
                }
                if (userResult) {
                    if(userResult.campaign_current != void 0) {
                        var user_id = userResult.user_id;
                        var campaign_current_id = userResult.campaign_current;

                        increaseCvForUserProfile(connect_page_id, user_id);

                        Campaign.findOne({ _id: campaign_current_id}, function(err, campaignResult) {
                            if (err) throw err;
                            if(campaignResult) {
                                var current_month = now.getMonth() + 1,
                                    current_day = now.getDate();
                                current_month = (current_month < 10 ? '0' : '') + current_month;
                                current_day = (current_day < 10 ? '0' : '') + current_day;
                                var ymd = now.getFullYear() + '-' + current_month + '-' + current_day;

                                //add / update a record to report campaign
                                ReportCampaign.findOneAndUpdate({cid: connect_page_id, uid: user_id, campaign_id: campaign_current_id},
                                    {
                                        $set: {
                                            cv_flg : 1,
                                            current_url : current_url,
                                            ymd : ymd,
                                            updated_at : now
                                        },
                                        $setOnInsert: {created_at: now}
                                    },
                                    {upsert: true, multi: false}, function(err, result) {
                                        if (err) throw err;
                                        console.log('c result: ', result);
                                    });

                            } else {
                                saveException(connect_page_id, {
                                    requestData: query,
                                    error: {"message" : "Campaign ID: " + campaign_current_id + " does not exist."}
                                });
                            }
                        });
                    } else {
                        saveException(connect_page_id, {
                            requestData: query,
                            error: {"message" : "User profile: campaign_current field does not exist."}
                        });
                    }

                } else {
                    saveException(connect_page_id, {
                        requestData: query,
                        error: {"message" : "User with user token does not exist."}
                    });
                }
            });
        } catch (e) {
            console.log('Facebook update CV catch: ', e);
            saveException(connect_page_id, {
                requestData: query,
                error: e
            });
        }
    }
    res.send(null);
});

function saveException(cpid, err){
    var now = new Date();
    var exception = new Exception({
        err: err,
        cpid: cpid,
        push_chatwork_flg: 0,
        created_at : now,
        updated_at : now
    });
    exception.save(function(err) {
    });
}


module.exports = router;
