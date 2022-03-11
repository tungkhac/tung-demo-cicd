// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
var model = require('../model');

var ConnectPage =  model.ConnectPage;
var UserProfile =  model.UserProfile;

router.post('/set-by-user', function(req, res, next){
    var body = req.body;
    var connect_page_id = body.connect_page_id,
        user_id = body.user_id,
        rich_menu_id = body.rich_menu_id;
    if(connect_page_id != '' && user_id != '' && rich_menu_id != ''){
        getPageAccessToken(connect_page_id, function (check, channel_access_token) {
            if(check){
                callApiSetMenuByUser(channel_access_token, rich_menu_id, user_id, connect_page_id);
                res.json({setting_flg: true});
            }
        });
    }else{
        res.json({setting_flg: false});
    }
});

function getPageAccessToken(connect_page_id, callback){
    console.log('getPageAccessToken');
    ConnectPage.findOne({_id: connect_page_id, deleted_at: null}, function (err, result) {
        if (!err && result) {
            return callback(true, result.channel_access_token);
        }else{
            return callback(false);
        }
    });
}

function callApiSetMenuByUser(channel_access_token, rich_menu_id, user_id, cpid){
    console.log('callApiSetMenuByUser');
    var api_url = 'https://api.line.me/v2/bot/user/' + user_id + '/richmenu/' + rich_menu_id;
    var result = [];
    result['success'] = false;

    if(channel_access_token != undefined && channel_access_token != ''){
        var headers = {
            'Authorization': 'Bearer ' + channel_access_token
        };

        request({
            uri: api_url,
            method: 'POST',
            headers: headers
        }, function (error, response, body) {
            console.log('body response', body);
            if(!error && response && response.statusCode == 200){
                UserProfile.findOneAndUpdate({connect_page_id: cpid, user_id: user_id}, {
                    $set: {
                        rich_menu_id: rich_menu_id,
                        updated_at: new Date()
                    }
                }, { upsert: false }, function (err, result) {
                    if (err) throw err;
                });
            }
        });
    }else{

    }
}

function callApiUnlink(channel_access_token, user_id){
    console.log('callApiSetMenuByUser');
    var api_url = 'https://api.line.me/v2/bot/user/' + user_id + '/richmenu';
    if(channel_access_token != undefined && channel_access_token != ''){
        var headers = {
            'Authorization': 'Bearer ' + channel_access_token
        };
        request({
            uri: api_url,
            method: 'DELETE',
            headers: headers
        }, function (error, response, body) {
            console.log('callApiUnlink response', body);
        });
    }else{

    }
}

router.post('/unlinkMenu', function(req, res, next){
    var body = req.body;
    var connect_page_id = body.connect_page_id,
        user_id = body.user_id;

    if(connect_page_id != '' && user_id != ''){
        getPageAccessToken(connect_page_id, function (check, channel_access_token) {
            if(check){
                callApiUnlink(channel_access_token, user_id);
                res.json({setting_flg: true});
            }
        });
    }else{
        res.json({setting_flg: false});
    }
});

// function
module.exports = router;
