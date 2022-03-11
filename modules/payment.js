// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const config = require('config');
const model = require('../model');
const cryptor = require('../routes/crypto');

const mongoose = require('mongoose');
var Connect = model.Connect;
var ConnectPage = model.ConnectPage;
var EfoPOrderHistory = model.EfoPOrderHistory;
var EfoPOrderSetting = model.EfoPOrderSetting;

var PaymentGateway = model.PaymentGateway;
var EfoCart = model.EfoCart;
var EfoCv = model.EfoCv;
var EfoMessageVariable = model.EfoMessageVariable;
var UserCryptKey = model.UserCryptKey;
var Variable = model.Variable;

const TAX_EXCLUDED_TYPE = '002',
	ROUND_DOWN_TYPE = '001',
	ROUND_UP_TYPE = '002',
	IS_A_SETTLEMENT_FEE_TYPE = '002',
	IS_A_SHIPPING_FEE_TYPE = '002',
	TYPE_EFO_PAYMENT_METHOD_SETTING_YES = '002';

const PAYMENT_SUCCESS = '001',
	PAYMENT_FAIL = '002';

function getPaymentGatewayCODInfo(provider_type, params, callback) {
	Connect.findOne({ _id: params.connect_id }, function(err, res) {
		if (res && provider_type) {
			PaymentGateway.find(
				{
					user_id: res.user_id,
					provider: provider_type,
				},
				function(e, data_gateways) {
					if (data_gateways !== void 0 && data_gateways.length) {
						var select_gateway = null;
						// Select gateway default or first
						data_gateways.forEach(function(gateway) {
							if (gateway.default_flg == 1) {
								select_gateway = gateway;
							}
						});
						if (select_gateway === null) {
							select_gateway = data_gateways[0];
						}

						getPaymentSettingInfo(params, function(data_setting) {
							if (data_setting.length && data_setting[0] != void 0) {
								data_setting = data_setting[0];

								// payment_gateway_setting
								if (data_setting.payment_gateway_setting == TYPE_EFO_PAYMENT_METHOD_SETTING_YES) {
									var variable_payment_method = data_setting.variable_payment_method;
									var gateway_setting = data_setting.gateway_setting;

									if (
										typeof variable_payment_method !== 'undefined' &&
										mongoose.Types.ObjectId.isValid(variable_payment_method) &&
										typeof gateway_setting !== 'undefined'
									) {
										params.variable_id = variable_payment_method;
										getOneVariableValue(params, function(variable_result) {
											var variable_value = null;
											if (
												variable_result[variable_payment_method] != void 0 &&
												variable_result[variable_payment_method].value != void 0
											) {
												variable_value = variable_result[variable_payment_method].value;
											} else if (
												variable_result[variable_payment_method] != void 0 &&
												variable_result[variable_payment_method] != void 0
											) {
												variable_value = variable_result[variable_payment_method];
											}

											if (variable_value) {
												if (gateway_setting[variable_value] !== void 0) {
													data_gateways.forEach(function(gateway) {
														if (gateway._id == gateway_setting[variable_value]) {
															select_gateway = gateway;
														}
													});
												}
											}
											console.log('select_gateway', select_gateway);

											return callback(false, select_gateway);
										});
									}
								} else {
									return callback(false, select_gateway);
								}
							} else {
								return callback(false, select_gateway);
							}
						});
					} else {
						// return default gateway
						return callback(false, []);
					}
				},
			);
		} else {
			return callback(true);
		}
	});
}

function getVariableValueByName2(params, index, arr, callback) {
	if (arr[index]) {
		var variable_name = arr[index];
		Variable.findOne(
			{ connect_page_id: params.connect_page_id, variable_name: variable_name, deleted_at: null},
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
								tmp_value = convertVariableValue(params, row);
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

function convertVariableValue(params, row) {
	var value = row.variable_value;
	if (params && params.encrypt_flg) {
		value = cryptor.decryptConvertJSON(value, params.encrypt_key);
	}
	var tmp_value_arr = [];
	var tmp_value = value;

	if (Array.isArray(value)) {
		value.forEach(function(element) {
			if (element.value !== undefined) {
				tmp_value_arr.push(element.value);
			} else if (element.text) {
				tmp_value_arr.push(element.text);
			} else {
				tmp_value_arr.push(element);
			}
		});
		tmp_value = tmp_value_arr.join(',');
	}
	return tmp_value;
}

function getPaymentSettingInfo(params, callback) {
	var data_setting = [];
	EfoPOrderSetting.findOne({ cpid: params.connect_page_id }, function(err, res) {
		if (res) {
			data_setting.push({
				tax_type: res.tax_type,
				rounding: res.rounding,
				tax: res.tax,
				settlement_fee_type: res.settlement_fee_type,
				settlement_fee: res.settlement_fee,
				variable_settlement: res.variable_settlement,
				shipping_fee_type: res.shipping_fee_type,
				shipping_fee: res.shipping_fee,
				variable_address: res.variable_address,
				payment_gateway_setting: res.payment_gateway_setting,
				variable_payment_method: res.variable_payment_method,
				gateway_setting: res.gateway_setting,
			});
		}
		return callback(data_setting);
	});
}

async function checkOrderFailExist(params) {
	let { connect_page_id, user_id } = params;
	let result = null;
	try {
		let orderHistory = await EfoPOrderHistory.findOne({
			connect_page_id: connect_page_id,
			user_id: user_id,
			order_status: PAYMENT_FAIL,
		});

		if (orderHistory) {
			result = orderHistory;
		}

		return result;
	} catch (error) {
		console.log('error', error);
		return result;
	}
}

function getAmountOrderCOD(params, callback) {
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
				console.log(next, variable_name, value, variable_id);
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

function getOneVariableValue(params, callback) {
	var variable_result = {};
	EfoMessageVariable.findOne(
		{
			connect_page_id: params.connect_page_id,
			user_id: params.user_id,
			variable_id: params.variable_id,
		},
		function(err, result) {
			if (err) throw err;
			if (result) {
				variable_result[params.variable_id] = convertVariableValue(params, result);
			}
			return callback(variable_result);
		},
	);
}

async function saveHistoryOrder(
	params,
	price,
	order_id,
	data_response,
	status_code,
	is_need_crawl,
) {
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
		await EfoCart.update(
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

exports.checkOrderFailExist = checkOrderFailExist;
exports.saveHistoryOrder = saveHistoryOrder;
exports.getPaymentGatewayCODInfo = getPaymentGatewayCODInfo;
exports.getAmountOrderCOD = getAmountOrderCOD;
