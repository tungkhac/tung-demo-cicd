// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by datlt on 27/05/2019.
 */
const request = require('request');
var express = require('express');
var moment = require('moment');
var validator = require('validator');
var router = express.Router();
var model = require('../model');

const LogChatMessage = model.LogChatMessage;
const ConnectPage = model.ConnectPage;
const Exception = model.Exception;
const URL_LINE_SWITCHER_SWITCH = 'https://api.line.me/v2/bot/admin/switcher/switch';
const LOG_MESSAGE_LIMIT = 100;
const USER_TYPE = 1;
const BOT_TYPE = 2;
const USER_F5_TYPE = 'lineUser';
const BOT_F5_TYPE = 'auto';

var googleMapModule = require('../modules/googleMap');
var nojimaModule = require('../modules/nojima');
const
	SNS_TYPE_FACEBOOK = '001',
	SNS_TYPE_LINE = '002';

router.post('/switch', function(req, res, next) {
	var body = req.body;

	var now = new Date();

	console.log('====nojima body switch', body);
	console.log("from_time_of_message=", now.getTime());
	let {destinationId, userId, cpid, from_time_of_message} = body;

	var response = {};

	// Validation inputs
	var error_validations = [];

	if (!destinationId) {
		error_validations.push('Missing destination destinationId');
	}
	if (!userId) {
		error_validations.push('Missing destination userId');
	}

	if (!cpid) {
		error_validations.push('Missing destination cpid');
	}

	getConnectPage(cpid, function (next, channelAccessToken) {
		if (!next) {
			error_validations.push('Missing channel channelAccessToken');
		}
		if (error_validations.length) {
			console.log("error_validations", error_validations);
			response.error_message = error_validations;
			return res.status(400).json(response);
		}

		(async () => {
			try {
				let query = {
					connect_page_id: cpid,
					user_id: userId,
					background_flg: null,
					error_flg: null
				};

				// Check if filter follow time_of_message
				if (from_time_of_message) {
					from_time_of_message = parseInt(from_time_of_message);
					query.time_of_message2 = { $gte: from_time_of_message };
				}
				console.log('query', query);

				let log_messages = await LogChatMessage.find(
					query,
					{},
					{ sort: { time_of_message2: -1 }, limit: LOG_MESSAGE_LIMIT }
				);

				let messages = [];
				if (log_messages && log_messages.length) {
					for(var i = log_messages.length -1 ; i >= 0; i--) {
						var log = log_messages[i];
						let { type, message, time_of_message2, content} = log;
						if (type == USER_TYPE) {
							if (content) {
								if(content.postback && content.postback.data){
									if(message && message.text){
										content.postback.data = message.text;
									}else{
										content.postback.data = message;
									}
									console.log(content.postback.data);
								}

								let item = {
									userType: "lineUser",
									time: time_of_message2
								};
								item.content = content;
								messages.push(item);
							}
						} else {
							if (message && Array.isArray(message)) {
								message.forEach((msg) => {
									let item = {
										userType: "auto",
										time: time_of_message2
									};
									item.content = msg;
									messages.push(item);
								});
							}
						}
					}
				}


				//var result1 = {
				//	success: false,
				//	from_time_of_message: from_time_of_message
				//};
				//
				//result1.from_time_of_message = now.getTime().toString();
				//result1.success = true;
				//console.log(messages);
				//return res.status(200).json(result1);

				let data_note = {
					fromType: 'auto',
					params: {},
					reason: 'escalate',
					messages: messages
				};
				var body_request = {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: 'Bearer ' + channelAccessToken,
					},
					uri: URL_LINE_SWITCHER_SWITCH,
					method: 'POST',
					json: {
						destinationId: destinationId,
						userId: userId,
						note: data_note
					}
				};
				//console.log(JSON.stringify(body_request, 0, 4));
				//var result1 = {};
				//
				//result1.from_time_of_message = now.getTime().toString();
				//return res.status(200).json(result1);

				request(
					body_request,
					function(error, response, body) {
						var result = {
							success: false,
							from_time_of_message: from_time_of_message
						};
						if (response != void 0 && response.statusCode === 200 && body !== void 0) {
							result.from_time_of_message = now.getTime().toString();
							result.success = true;
						}
						console.log("result", result);
						return res.status(200).json(result);
					}
				);
			} catch (error) {
				console.log('error', error);
				var result = {
					success: false,
					from_time_of_message: from_time_of_message
				};
				return res.status(400).json(result);
			}
		})();
	});

});

function getConnectPage(cpid, callback){
	ConnectPage.findOne({_id: cpid, deleted_at: null}, function (err, result) {
		//console.log(result);
		if (result) {
			return callback(true, result.channel_access_token);
		}else {
			return callback(false);
		}
	});
}

//東京都渋谷区
router.post('/getShopByAddress', function(req, res, next) {
	var body = req.body;
	console.log("getShopByAddress", body);
	if(body && body.address !== undefined){
		var sns_type = body.sns_type !== undefined ? body.sns_type : '001';

		googleMapModule.googleMapGetLocation(body, function (result) {
			console.log(result);
			if(result.status == "True"){
				var req_param = {
					lat: result.lat,
					lng: result.long,
					city_name: result.city_name,
					sns_type: sns_type,
					detail_btn_title: body.detail_btn_title,
					no_shop_message: body.no_shop_message,
					load_more: body.load_more,
					device: body.device,
					detail_btn_map: body.detail_btn_map
				};
				var carousel = [];
				nojimaModule.nojimaGetShop(carousel, req_param, function (result) {
					res.json(carousel[0]);
				});
			}else{
				var carousel1 = [];
				if(sns_type == SNS_TYPE_FACEBOOK){
					carousel1.push({
						message:{
							text: body.no_shop_message !== undefined ? body.no_shop_message :"もうしわけありません。ご希望の近隣には店舗がございません。"
						},
						count: 0
					});
				}else if(sns_type == SNS_TYPE_LINE){
					carousel1.push({
						message:{
							type: "text",
							text: body.no_shop_message !== undefined ? body.no_shop_message :"もうしわけありません。ご希望の近隣には店舗がございません。"
						},
						count: 0
					});
				}
				if(carousel1.length > 0){
					res.json(carousel1[0]);
				}else{
					res.json({});
				}

			}
		});
	}else{
		res.json({});
	}
});

router.post('/getShop', function(req, res, next) {
	var body = req.body;
	var req_param = {
		lat: body.lat,
		lng: body.lng,
		city_name: body.city_name,
		sns_type: body.sns_type !== undefined ? body.sns_type : '001',
		detail_btn_title: body.detail_btn_title,
		no_shop_message: body.no_shop_message,
		load_more: body.load_more,
		device: body.device,
		detail_btn_map: body.detail_btn_map
	};
	var carousel = [];
	if(body && body.lat !== undefined && body.lng !== undefined){
		nojimaModule.nojimaGetShop(carousel, req_param, function (result) {
			res.json(carousel[0]);
		});
	}else{
		res.json({});
	}
});

// function
module.exports = router;
