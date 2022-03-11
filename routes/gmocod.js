// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();
var moment = require('moment');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false, trim: true });
const request = require('request');

const mongoose = require('mongoose');
var model = require('../model');
const Exception = model.Exception;
const config = require('config');
const shortBaseUrl = config.get('shortBaseUrl');
const Common = require('../modules/common');
const Payment = require('../modules/payment');
const TIMEZONE = config.get('timezone');

const PAYMENT_GMO_COD_TYPE = '014';

const default_gmo_cod_gateway = {
	gmo_cod_shop_id: '0000000001',
	gmo_cod_shop_code: 'ab008560-00',
	gmo_cod_shop_pass: 'ab00856000',
	mode: 'test',
};

const default_payment_type = '2';
const invoice_payment_type = '3';
const default_pdcompanycode = '11';

var default_error_message = 'カードに誤りがあります。再度確認して入力して下さい。';

router.post('/payment', function(req, res, next) {
	var body = req.body;
	console.log('body', body);
	let {
		cpid,
		uid,
		ship_ymd,
		name,
		address,
		send_name,
		send_address,
		tel_num,
		email,
		payment_type,
		delivery_company_code,
		name_kana,
		send_tel_num,
	} = body;

	var response = {};

	// Validation inputs
	// var error_validations = [];
	// if (gmoAuthenticationId === null || gmoAuthenticationId === void 0 || gmoAuthenticationId.length == 0) {
	// 	error_validations.push('Missing gmoAuthenticationId');
	// }
	// if (gmoShopCode === null || gmoShopCode === void 0 || gmoShopCode.length == 0) {
	// 	error_validations.push('Missing gmoShopCode');
	// }
	// if (gmoSmsPassword === null || gmoSmsPassword === void 0 || gmoSmsPassword.length == 0) {
	// 	error_validations.push('Missing gmoSmsPassword');
	// }
	// if (gmoFullName === null || gmoFullName === void 0 || gmoFullName.length == 0) {
	// 	error_validations.push('氏名は、必ず指定してください。');
	// }
	// if (gmoAddress === null || gmoAddress === void 0 || gmoAddress.length == 0) {
	// 	error_validations.push('住所は、必ず指定してください。');
	// }
	// if (gmoZipCode === null || gmoZipCode === void 0 || gmoZipCode.length == 0) {
	// 	error_validations.push('Missing gmoZipCode');
	// }
	// if (gmoEmail1 === null || gmoEmail1 === void 0 || gmoEmail1.length == 0) {
	// 	error_validations.push('メールアドレスは、必ず指定してください。');
	// }
	// if (gmoTel1 === null || gmoTel1 === void 0 || gmoTel1.length == 0) {
	// 	error_validations.push('電話番号は、必ず指定してください。');
	// }
	// if (ship_ymd === null || ship_ymd === void 0 || ship_ymd.length == 0) {
	// 	error_validations.push('配達希望日は、必ず指定してください。');
	// }

	// if (
	// 	(cpid && !validator.isByteLength(cpid, { min: 0 })) ||
	// 	(uid && !validator.isByteLength(uid, { min: 0 }))
	// ) {
	// 	error_validations.push('Input data is empty.');
	// }
	// if (
	// 	(name && !validator.isByteLength(name, { min: 0, max: 60 })) ||
	// 	(name && !validator.isLength(name, { min: 0, max: 30 }))
	// ) {
	// 	error_validations.push('氏名は、必ず指定してください。');
	// }
	// if (address && !validator.isByteLength(address, { min: 0 })) {
	// 	error_validations.push('住所は、必ず指定してください。');
	// }
	// if (email && !validator.isByteLength(email, { min: 0, max: 64 })) {
	// 	error_validations.push('メールアドレスは、必ず指定してください。');
	// }
	// if (email && !validator.isEmail(email)) {
	// 	error_validations.push('メールアドレスは、有効なメールアドレス形式で指定してください。');
	// }
	// if (tel_num && !validator.isByteLength(tel_num, { min: 0 })) {
	// 	error_validations.push('電話番号は、必ず指定してください。');
	// }
	// if (ship_ymd && !validator.isByteLength(ship_ymd, { min: 0 })) {
	// 	error_validations.push('配達希望日は、必ず指定してください。');
	// }

	// if (error_validations.length) {
	// 	response.error_message = error_validations;
	// 	return res.status(400).json(response);
	// }

	Common.getConnectPageInfo(cpid, uid, function(check, connect_page) {
		if (check) {
			var params = {};
			params.connect_page_id = cpid;
			params.connect_id = connect_page.connect_id;
			params.encrypt_flg = connect_page.encrypt_flg;
			params.encrypt_key = connect_page.encrypt_key;
			params.connect_id = connect_page.connect_id;
			params.log_order_id = connect_page.log_order_id;
			params.device = connect_page.device;
			params.user_id = uid;

			//by user
			params.address = address;
			params.full_name = name;
			params.email = email;
			params.phone = tel_num;
			params.shop_order_date = ship_ymd;
			params.send_name = send_name;
			params.send_address = send_address;
			params.payment_type = payment_type || default_payment_type;
			params.pdcompanycode = delivery_company_code || default_pdcompanycode;

			// is not require
			params.name_kana = name_kana;
			params.send_tel_num = send_tel_num;
			console.log('=====params', params);
			Payment.getPaymentGatewayCODInfo(PAYMENT_GMO_COD_TYPE, params, function(error, gateway) {
				if (error) {
					response.error_message = 'Error occurred.';
					return res.status(400).json(response);
				}

				if (gateway !== void 0 && gateway.length == 0) {
					gateway = default_gmo_cod_gateway;
				}
				params.gmo_cod_shop_id = gateway.gmo_cod_shop_id;
				params.gmo_cod_shop_code = gateway.gmo_cod_shop_code;
				params.gmo_cod_shop_pass = gateway.gmo_cod_shop_pass;
				params.mode = gateway.mode;

				Payment.getAmountOrderCOD(params, function(price) {
					console.log('=======price', price);
					// Check if exist order fail will call api for update order in gmo gateway
					Payment.checkOrderFailExist(params).then((order_fail) => {
						console.log('order_fail', order_fail);
						params.is_update_order = false;
						if (
							order_fail &&
							order_fail.data &&
							order_fail.data.transactionResult &&
							order_fail.data.transactionResult.gmoTransactionId &&
							order_fail.data.transactionResult.authorResult === 'NG'
						) {
							params.is_update_order = true;
							params.gmoTransactionId = order_fail.data.transactionResult.gmoTransactionId;
						}

						let execTranUrl =
							gateway.mode != 'production'
								? 'https://testshop.gmo-ab.com/auto/transaction.do'
								: 'https://shop.gmo-ab.com/auto/transaction.do';
						if (params.is_update_order) {
							execTranUrl =
								gateway.mode != 'production'
									? 'https://testshop.gmo-ab.com/auto/modifycanceltransaction.do'
									: 'https://shop.gmo-ab.com/auto/modifycanceltransaction.do';
						}
						execTranGMOCOD(params, price, execTranUrl, function(result) {
							if (result && result.success) {
								response.message_code = 'Create request kuroneko COD success.';
								res.status(200).json(response);
							} else {
								if (result.error) {
									response.error_message = result.error;
								} else {
									response.error_message = default_error_message;
								}
								console.log('response', response);
								return res.status(500).json(response);
							}
						});
					});
				});
			});
		} else {
			response.error_message = 'Error occurred.';
			return res.status(400).json(response);
		}
	});
});

function convertOptionsForRequest(obj_input, params, callback) {
	Common.getAddressFromPostcode(params.address, function(address) {
		console.log('address======', address);
		obj_input.buyer.zipCode = address.zipcode;
		obj_input.buyer.address = address.address;

		if (params.send_address !== '') {
			obj_input.deliveries.delivery.deliveryCustomer.fullName = params.send_name
				? params.send_name.substr(0, 21)
				: '';
			var send_tel_num = params.send_tel_num || '';
			obj_input.deliveries.delivery.deliveryCustomer.tel = send_tel_num;
			Common.getAddressFromPostcode(params.send_address, function(send_address) {
				obj_input.deliveries.delivery.deliveryCustomer.zipCode = send_address.zipcode;
				obj_input.deliveries.delivery.deliveryCustomer.address = send_address.address;

				callback(obj_input);
			});
		} else {
			callback(obj_input);
		}
	});
}

function getProductsFromPrice(price) {
	let product_details = [];
	if (price !== void 0 && price['product_name'] !== void 0) {
		if (
			price['product_unit_price'] !== void 0 &&
			price['order_quantity'] !== void 0 &&
			price['order_sub_total'] !== void 0 &&
			price['order_total'] !== void 0
		) {
			var product_name = price['product_name'].value
				? Common.convertKanjiJapan(price['product_name'].value)
				: '';

			product_details.push({
				detailName: product_name ? product_name.substr(0, 30) : '',
				detailPrice: price['product_unit_price'].value,
				detailQuantity: price['order_quantity'].value,
			});

			if (price['order_tax'].value !== void 0 && price['order_tax'].value > 0) {
				product_details.push({
					detailName: Common.convertKanjiJapan('消費税'),
					detailPrice: price['order_tax'].value,
					detailQuantity: 1,
				});
			}

			if (
				price['order_settlement_fee'].value !== void 0 &&
				price['order_settlement_fee'].value > 0
			) {
				product_details.push({
					detailName: Common.convertKanjiJapan('後払い手数料'),
					detailPrice: price['order_settlement_fee'].value,
					detailQuantity: 1,
				});
			}

			if (price['order_shipping_fee'].value !== void 0 && price['order_shipping_fee'].value > 0) {
				product_details.push({
					detailName: Common.convertKanjiJapan('送料他'),
					detailPrice: price['order_shipping_fee'].value,
					detailQuantity: 1,
				});
			}
		}
	}

	return product_details;
}

function createInputXML(obj_input) {
	console.log('obj_input', obj_input);
	let xml = '';
	if (obj_input !== void 0 && Object.keys(obj_input).length) {
		var clone_obj_input = Object.assign({}, obj_input);
		var builder = new xml2js.Builder({
			rootName: 'request',
			xmldec: { version: '1.0', encoding: 'UTF-8' },
		});

		xml = builder.buildObject(clone_obj_input);
	}
	console.log('xml return', xml);
	return xml;
}

function execTranGMOCOD(params, price, post_url, callback) {
	// console.log("execTranKuronekoCOD", params, price);
	var result = [];
	result['success'] = false;
	result['data'] = { message: [default_error_message] };
	var order_id = params.log_order_id || '';
	var now = new Date();
	var request_date = moment(now)
		.tz(TIMEZONE)
		.format('YYYYMMDDHHmmss');
	// Last 6 character and time request date is order_id
	order_id =
		request_date +
		'-' +
		order_id
			.toString()
			.slice(-5)
			.toUpperCase();
	let shop_order_date = params.shop_order_date
		? moment(params.shop_order_date, 'YYYY-MM-DD').format('YYYY/MM/DD')
		: '';

	// var device_code = params.device != 'pc' ? 1 : 2;
	if (params.payment_type != undefined) {
		var obj_input = {
			shopInfo: {
				authenticationId: params.gmo_cod_shop_id,
				shopCode: params.gmo_cod_shop_code,
				connectPassword: params.gmo_cod_shop_pass,
			},
			buyer: {
				shopTransactionId: order_id,
				shopOrderDate: shop_order_date,
				fullName: params.full_name || '',
				fullKanaName: params.name_kana || '',
				zipCode: '',
				address: '',
				tel1: params.phone || '',
				email1: params.email || '',
				billedAmount: '',
				paymentType: params.payment_type,
			},
			deliveries: {
				delivery: {
					deliveryCustomer: {
						fullName: params.full_name || '',
						fullKanaName: params.name_kana || '',
						zipCode: '',
						address: '',
						tel1: params.phone || '',
					},
					details: {
						detail: [
							{
								detailName: '',
								detailPrice: '',
								detailQuantity: '',
							},
						],
					},
				},
			},
		};

		// Check if order is need update
		if (params.is_update_order) {
			obj_input.kindInfo = {
				updateKind: 1, // 1: For update order in GMO Gateway, 2: For cancel order
			};
			obj_input.buyer.gmoTransactionId = params.gmoTransactionId;
		}

		// Add total amount for order
		if (price !== void 0 && price['product_name'] !== void 0 && price['order_total'] !== void 0) {
			obj_input.buyer.billedAmount = price['order_total'].value;
		}

		let products = getProductsFromPrice(price);
		if (products.length) {
			obj_input.deliveries.delivery.details.detail = products;
		}

		convertOptionsForRequest(obj_input, params, (options) => {
			let xml = createInputXML(options);

			var request_options = {
				method: 'POST',
				url: post_url,
				headers: {
					'Content-Type': 'text/xml',
				},
				body: xml,
			};

			request(request_options, function(error, response, body) {
				console.log('error', error);
				if (!error) {
					parser.parseString(body, function(err, resp) {
						console.log('resp', JSON.stringify(resp));
						let { response } = resp;

						if (response != void 0 && response.result != void 0) {
							if (response.result === 'OK') {
								// If author is not verify will error
								let { transactionResult } = response;
								if (
									transactionResult.authorResult !== void 0 &&
									transactionResult.authorResult === 'OK'
								) {
									// Check if order need get invoice
									getInvoiceData(result, params, price, order_id, response, (result) => {
										// If result have message error will return error
										if (result.is_continue_callback === false) {
											return callback(result);
										}

										// Select a company delivery
										let deliv_input = {
											shopInfo: {
												authenticationId: params.gmo_cod_shop_id,
												shopCode: params.gmo_cod_shop_code,
												connectPassword: params.gmo_cod_shop_pass,
											},
											transaction: {
												gmoTransactionId: transactionResult.gmoTransactionId,
												pdcompanycode: params.pdcompanycode,
												slipno: order_id,
											},
										};

										let deliv_xml = createInputXML(deliv_input);
										let deliv_post_url =
											params.mode != 'production'
												? 'https://testshop.gmo-ab.com/auto/pdrequest.do'
												: 'https://shop.gmo-ab.com/auto/pdrequest.do';

										var deliv_request_options = {
											method: 'POST',
											url: deliv_post_url,
											headers: {
												'Content-Type': 'text/xml',
											},
											body: deliv_xml,
										};

										request(deliv_request_options, function(err, resp, body) {
											console.log('error', err);
											if (!err) {
												parser.parseString(body, function(err, resp) {
													console.log('resp', JSON.stringify(resp));

													let { response } = resp;
													if (response.result === 'OK') {
														console.log('success=====');
														result['success'] = true;
														Payment.saveHistoryOrder(params, price, order_id, response, true, true);
														return callback(result);
													} else {
														console.log('fail=====');
														result['error'] = default_error_message;
														let errors = response.errors.error;
														console.log('errors', errors);
														if (errors !== void 0) {
															if (errors.errorMessage !== void 0) {
																result['error'] = errors.errorMessage;
															}
															if (errors.length) {
																result['error'] = errors
																	.map((err) => {
																		return err.errorMessage;
																	})
																	.join('<br />');
															}

															Payment.saveHistoryOrder(params, price, order_id, response, false);
															return callback(result);
														}
													}
												});
											}
										});
									});
								} else {
									console.log('fail=====');
									result['error'] = default_error_message;
									Payment.saveHistoryOrder(params, price, order_id, response, false);
									return callback(result);
								}
							} else {
								console.log('fail=====1111');
								result['error'] = default_error_message;
								let errors = response.errors.error;
								console.log('errors', errors);
								if (errors !== void 0) {
									if (errors.errorMessage !== void 0) {
										result['error'] = errors.errorMessage;
									}
									if (errors.length) {
										result['error'] = errors
											.map((err) => {
												return err.errorMessage;
											})
											.join('<br />');
									}

									Payment.saveHistoryOrder(params, price, order_id, response, false);
									return callback(result);
								}
							}
						} else {
							return callback(result);
						}
					});
				}
			});
		});
	} else {
		return callback(result);
	}
}

function getInvoiceData(result, params, price, order_id, prev_resp, callback) {
	result.is_continue_callback = true;
	let { transactionResult } = prev_resp;
	console.log('getInvoiceData===', transactionResult);
	if (params && transactionResult && params.payment_type === invoice_payment_type) {
		// Select a company delivery
		let invoice_input = {
			shopInfo: {
				authenticationId: params.gmo_cod_shop_id,
				shopCode: params.gmo_cod_shop_code,
				connectPassword: params.gmo_cod_shop_pass,
			},
			transaction: {
				gmoTransactionId: transactionResult.gmoTransactionId,
			},
		};

		let invoice_xml = createInputXML(invoice_input);
		let invoice_post_url =
			params.mode != 'production'
				? 'https://testshop.gmo-ab.com/auto/getinvoicedata.do'
				: 'https://shop.gmo-ab.com/auto/getinvoicedata.do';

		var invoice_request_options = {
			method: 'POST',
			url: invoice_post_url,
			headers: {
				'Content-Type': 'text/xml',
			},
			body: invoice_xml,
		};

		request(invoice_request_options, function(err, resp, body) {
			console.log('error', err);
			if (!err) {
				parser.parseString(body, function(err, resp) {
					console.log('resp', JSON.stringify(resp));

					let { response } = resp;
					if (response.result === 'OK') {
						console.log('success=====');
						result['success'] = true;
						Payment.saveHistoryOrder(params, price, order_id, response, true, true);
						return callback(result);
					} else {
						console.log('fail=====');
						result['error'] = default_error_message;
						let errors = response.errors.error;
						console.log('errors', errors);
						if (errors !== void 0) {
							if (errors.errorMessage !== void 0) {
								result['error'] = errors.errorMessage;
							}
							if (errors.length) {
								result['error'] = errors
									.map((err) => {
										return err.errorMessage;
									})
									.join('<br />');
							}

							Payment.saveHistoryOrder(params, price, order_id, response, false);
							// Mark return callback for return error to browser
							result.is_continue_callback = false;

							return callback(result);
						}
					}
				});
			}
		});
	} else {
		return callback(result);
	}
}

module.exports = router;
