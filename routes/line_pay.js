// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
const uuid = require('uuid/v4');
const cache = require('memory-cache');
var express = require('express');
var router = express.Router();
var model = require('../model');
const Common = require('../modules/common');

var ConnectPage = model.ConnectPage;
var EfoPOrderHistory = model.EfoPOrderHistory;
var EfoMessageVariable = model.EfoMessageVariable;
var UserCryptKey = model.UserCryptKey;
var Variable = model.Variable;
var EfoCart = model.EfoCart;

const config = require('config');
const LINE_PAY_CONFIRM_URL = config.get('appURL') + '/api/line-pay/confirm';
const PAYMENT_SUCCESS = '001',
	PAYMENT_FAIL = '002';

// Instanticate LINE Pay API SDK.
const line_pay = require('line-pay');

const error_message = 'エラーが発生しました。再度ご試しください。';

router.post('/payment', async function(req, res, next) {
	var body = req.body;
	let {
		cpid,
		uid,
		product_name,
		product_image_url,
		total_price,
		channel_id,
		channel_secret,
	} = body;
	let result = {
		success: false,
	};

	let options = {
		productName: product_name ? Common.convertKanjiJapan(product_name) : '',
		productImageUrl: product_image_url,
		amount: total_price || 1,
		currency: 'JPY',
		orderId: uuid(),
		confirmUrl: LINE_PAY_CONFIRM_URL,
		capture: false,
	};
	try {
		let line_pay = initLinePay(channel_id, channel_secret);
		if (line_pay) {
			let params = {
				cpid: cpid,
				uid: uid,
				amount: options.amount,
			};
			let response = await line_pay.reserve(options);
			if (response) {
				let reservation = options;
				reservation.transactionId = response.info.transactionId;
				reservation.channel_id = channel_id;
				reservation.channel_secret = channel_secret;
				console.log(`Reservation was made. Detail is following.`, response);
				console.log(reservation);

				// Save order information
				cache.put(reservation.transactionId, reservation);

				// Save order history
				// saveHistoryOrder(params, options.orderId, reservation, true, true);

				result.transaction_id = response.info.transactionId;
				result.payment_url = response.info.paymentUrl.web;
				result.line_payment_url = response.info.paymentUrl.app;
				result.success = true;

				return res.json(result);
			} else {
				console.log('====payment faile');
				// When payment get error
				// saveHistoryOrder(params, options.orderId, {}, false);

				result.error_message = error_message;
				return res.status(500).json(result);
			}
		} else {
			result.error_message = error_message;
			return res.status(500).json(result);
		}
	} catch (error) {
		console.log('error', error);
		result.error_message = error_message;
		return res.status(500).json(result);
	}
});

router.get('/confirm', async function(req, res, next) {
	var query = req.query;
	let result = {
		success: false,
	};
		try {
			let { transactionId } = query;
			if (!transactionId) {
				throw new Error('Transaction Id not found.');
			}

			// Retrieve the reservation from database.
			let reservation = cache.get(transactionId);
			if (!reservation) {
				throw new Error('Reservation not found.');
			}

			let confirmation = {
				transactionId: transactionId,
				amount: reservation.amount,
				currency: reservation.currency,
			};

			console.log(`Going to confirm payment with following options.`);
			console.log(confirmation);
			let line_pay = initLinePay(reservation.channel_id, reservation.channel_secret);
			if (line_pay) {
				let response = await line_pay.confirm(confirmation);
				if (response) {
					return res.render('line_pay_success');
				}
			} else {
				return res.json(result);
			}
		} catch (error) {
			console.log('error=======================', error);
			result.error_message = error_message;
			return res.json(result);
		}
});

router.post('/capture', async function(req, res, next) {
	var body = req.body;
	console.log('body', body);
	let { cpid, uid, transaction_id, channel_id, channel_secret } = body;
	if (!transaction_id) {
		throw new Error('Transaction Id not found.');
	}

	let result = {
		success: false,
	};

	Common.getConnectPageInfo(cpid, uid, function(check, connect_page) {
		if (check) {
			let params = {};
			params.connect_page_id = cpid;
			params.connect_id = connect_page.connect_id;
			params.encrypt_flg = connect_page.encrypt_flg;
			params.encrypt_key = connect_page.encrypt_key;
			params.connect_id = connect_page.connect_id;
			params.log_order_id = connect_page.log_order_id;
			params.user_id = uid;

			// get price of order and payment
			getAmountOrder(params, async (price) => {
				console.log('=======price', price);

				if (price) {
					let confirmation = {
						transactionId: transaction_id,
						amount: price.order_sub_total ? price.order_sub_total.value : 0,
						currency: 'JPY',
					};
					console.log('confirmation', confirmation);

					try {
						let line_pay = initLinePay(channel_id, channel_secret);
						if (line_pay) {
							let response = await line_pay.capture(confirmation);
							console.log('response', response);

							if (response && response.returnCode === '0000') {
								result.success = true;
								result.data = response;
								let order_id = response.info.orderId;
								// let order_id = params.log_order_id || '';

								// Save order history
								await saveHistoryOrder(params, price, order_id, response, true, false);

								return res.json(result);
							} else {
								let order_id = params.log_order_id || '';
								await saveHistoryOrder(params, price, order_id, response, false);
								result.error_message = (response && response.returnMessage) ? response.returnMessage : error_message;
								return res.status(500).json(result);
							}
						} else {
							result.error_message = error_message;
							return res.status(500).json(result);
						}
					} catch (error) {
						console.log('error', error);
						result.error_message = error_message;
						return res.status(500).json(result);
					}
				}
			});
		}
	});
});

function getAmountOrder(params, callback) {
	var variable_arr = [];
	const check_update_variable = [
		'product_name',
		'product_unit_price',
		'order_quantity',
		'order_sub_total',
		'order_settlement_fee',
		'order_shipping_fee',
		'order_tax',
		'order_total',
	];
	var index1 = 0;
	var fun1;
	getVariableValueByName2(
		params,
		index1,
		check_update_variable,
		(fun1 = function(next, variable_name, value, variable_id) {
			if (next) {
				if (variable_name) {
					if (variable_name == 'product_unit_price' && parseInt(value) == 0) {
						return callback([]);
					}

					variable_arr[variable_name] = { value: value, variable_id: variable_id };
				}
				getVariableValueByName2(params, ++index1, check_update_variable, fun1);
			} else {
				// Call api
				callback(variable_arr);
			}
		}),
	);
}

function getVariableValueByName2(params, index, arr, callback) {
	if (arr[index]) {
		var variable_name = arr[index];
		Variable.findOne(
			{ connect_page_id: params.connect_page_id, variable_name: variable_name },
			function(err, result) {
				if (err) throw err;
				if (result) {
					EfoMessageVariable.findOne(
						{
							connect_page_id: params.connect_page_id,
							user_id: params.user_id,
							variable_id: result._id,
						},
						function(err, row) {
							if (err) throw err;
							var tmp_value = 0;
							if (row) {
								tmp_value = Common.convertVariableValue(params, row);
							}
							return callback(true, variable_name, tmp_value, result._id);
						},
					);
				} else {
					return callback(true);
				}
			},
		);
	} else {
		return callback(false);
	}
}

function initLinePay(channel_id, channel_secret) {
	let pay = null;
	if (channel_id && channel_secret) {
		pay = new line_pay({
			channelId: channel_id,
			channelSecret: channel_secret,
			isSandbox: true,
		});
	}

	return pay;
}

function buildQueryString(params) {
	var queryString = '';
	if (params && Object.keys(params).length) {
		queryString = Object.keys(params)
			.map((key) => key + '=' + params[key])
			.join('&');
	}

	return queryString;
}

async function saveHistoryOrder(params, price, order_id, data_response, status_code, is_need_crawl) {
	console.log('saveHistoryOrder', status_code, status_code ? (is_need_crawl ? '1' : '2') : '1');
	var now = new Date();

	var efo_order_history_create = {
		p_order_id: order_id,
		amount: price.order_sub_total ? price.order_sub_total.value : 0,
		price_tax: price.order_tax ? price.order_tax.value : 0,
		settlement_fee: price.order_settlement_fee ? price.order_settlement_fee.value : 0,
		shipping_fee: price.order_shipping_fee ? price.order_shipping_fee.value : 0,
		order_status: status_code ? PAYMENT_SUCCESS : PAYMENT_FAIL,
		payment_status: status_code ? (is_need_crawl ? '1' : '2') : '1', // payment_status is 1 : is not payment | 2 : is payment
		data: data_response,
		mode: params.mode != 'production' ? '1' : '2',
		updated_at: now,
	};
	if (is_need_crawl != void 0 && is_need_crawl) {
		efo_order_history_create['is_crawled'] = false;
	}

	let result = await EfoPOrderHistory.findOneAndUpdate(
		{ connect_page_id: params.connect_page_id, user_id: params.user_id, order_id: order_id },
		{
			$set: efo_order_history_create,
			$setOnInsert: { created_at: now },
		},
		{ upsert: true, multi: false, new: true },
	);

	if (result && result.order_status == PAYMENT_SUCCESS) {
		let efo_cart = await EfoCart.update(
			{ cid: params.connect_page_id, uid: params.user_id },
			{
				$set: {
					order_id: order_id,
					status: result.order_status,
					updated_at: now,
				},
			},
			{ upsert: false, multi: true },
		);
	}
}

// function
module.exports = router;
