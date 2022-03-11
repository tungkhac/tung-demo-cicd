// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
const config = require('config');
var request = require('request');
var fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const readline = require('readline');
var once = require('once');
var model = require('../model');
const apiEfoEc = model.ApiEfoEc;
const puppeteerRequest = model.PuppeteerRequest;
const puppeteerException = model.PuppeteerException;
const puppeteerEmailRegister = model.PuppeteerEmailRegister;
var moment = require('moment');
var TIMEZONE = config.get('timezone');

const default_error_msg = "エラーが発生しました。再度お試しください。";
const msg_order_again = 'セッションがタイムアウトになりました。最初から再度お試しください。';
const payment_error_msg = "クレジット決済は完了していません。</br>誠に申し訳ございませんがカード情報をご確認の上、再度入力をお願いします";

const api_header = {
    'Content-type': 'application/json'
};

// const cnt_payment = {
//     "クレジットカード決済": 1
// };

const merumaga = {
    '受け取る' : 0,
    '受け取らない': 2,
};

const g_login_value = {
    guest: 0,
    register: 1,
    login: 2,
};

const g_shipping_type = {
    shipping: 0,
    shipping_new: 1,
};

//call API from FID
class efoEcCart {
    constructor() {
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/auth', async(req, res, next) => {
            console.log("auth==>", req.body);
            var request_body = req.body;
            try {
                var request_url = request_body.request_url + "/rest/v2/auth/auth.json";
                var cpid = request_body.cpid;
                var user_id = request_body.user_id;
                var client_id = request_body.client_id;
                var client_secret = request_body.client_secret;
                console.log("request_url==", request_url);
                var now = new Date();
                apiEfoEc.findOneAndUpdate({cpid: cpid, user_id: user_id}, {
                    $set: {
                        update_at: now
                    },
                    $setOnInsert: {
                        cpid: cpid,
                        user_id: user_id,
                        client_id: client_id,
                        client_secret: client_secret,
                        request: request_body,
                        created_at: now
                    }
                }, {upsert: true, multi: false, new: true}, (err, result) => {
                    if (result) {
                       console.log("result", result);
                        var _index = result._id;

                        var data = JSON.stringify({
                            "client_id": client_id,
                            "client_secret": client_secret
                        });

                        request({
                            uri: request_url,
                            method: 'POST',
                            headers: api_header,
                            body: data
                        }, (error, response, body) => {
                            var body1 = this.validateParseJSON(body);
                            console.log("body1==", body1);
                            if(typeof body1 === 'object' && body1 !== null) {
                                if (body1.result == 'OK') {
                                    apiEfoEc.findOneAndUpdate({_id: _index}, {
                                        $set: {
                                            authentication_token: body1.authentication_token,
                                            response: body1,
                                            result: body1.result,
                                            updated_at: new Date()
                                        }
                                    }, {upsert: false, multi: false}, function (err, result) {

                                    });

                                    res.status(200).json(body1);
                                } else {
                                    apiEfoEc.findOneAndUpdate({_id: _index}, {
                                        $set: {
                                            result: body1.result,
                                            error_code: body1.error_code,
                                            error_message: body1.error_message,
                                            error_info: body1.error_info,
                                            updated_at: new Date()
                                        }
                                    }, {upsert: false, multi: false}, function (err, result) {

                                    });

                                    res.status(500).json({'error_message': body1.error_message});
                                }
                            } else {
                                console.log("Response not object", body);
                                var exception = {
                                    cpid: cpid,
                                    user_id: user_id,
                                    status: 3,
                                    error_message: "Response not object",
                                    index: 0,
                                    request_body: body
                                };
                                this.savePuppeteerException(exception);
                                res.status(500).json({'error_message': default_error_msg});
                            }
                        })
                    }
                });
            } catch (err) {
                console.error(err);
                var exception = {
                    cpid: request_body.cpid,
                    user_id: request_body.user_id,
                    status: 3,
                    error_message: err,
                    index: 0,
                    request_body: request_body
                };
                this.savePuppeteerException(exception);
                res.status(500).json({'error_message': default_error_msg});
            }
        });

        this.router.post('/validateEmail', async(req, res, next) => {
            var request_body = req.body;
            var user_id = request_body.user_id;
            var cpid = request_body.cpid;
            var mail_address = request_body.mail_address;
            var client_id = request_body.client_id;
            var client_secret = request_body.client_secret;
            console.log("validateEmail=>", request_body);
            try {
                puppeteerRequest.remove({cpid: cpid, user_id: user_id, action: 'validate_email'}, async(err) => {
                    var authentication_token = await this.getAuthToken(client_id, client_secret, cpid, user_id);
                    if (authentication_token) {
                        var savePuppeteer = {
                            cpid: cpid,
                            user_id: user_id,
                            status: 0,
                            error_message: "",
                            request_body: request_body,
                            action: 'validate_email'
                        };

                        var saveData = new puppeteerRequest(savePuppeteer);
                        saveData.save((err, result) => {
                            if (result) {
                                console.log("result=>", result);
                                var _index = result._id;

                                var request_url = request_body.request_url + '/rest/v2/user/users.json';
                                var data = {
                                    "authentication_token": authentication_token,
                                    "mail_address": mail_address
                                };

                                data = JSON.stringify(data);
                                console.log("validate email request body====>", JSON.stringify({
                                    uri: request_url,
                                    method: 'POST',
                                    headers: api_header,
                                    body: data
                                }, null, 2));

                                request({
                                    uri: request_url,
                                    method: 'POST',
                                    headers: api_header,
                                    body: data
                                }, (error, response, body) => {
                                    console.log("body===", body);
                                    var obj_body = this.validateParseJSON(body);

                                    if(typeof obj_body === 'object' && obj_body !== null) {
                                        var response = {};
                                        // console.log("obj_body===", obj_body);
                                        if (obj_body.result == 'OK') {
                                            puppeteerRequest.findOneAndUpdate({_id: _index}, {
                                                $set: {
                                                    status: 1,
                                                    param: obj_body,
                                                    updated_at: new Date()
                                                }
                                            }, {upsert: false, multi: false}, function (err, result) {
                                            });
                                            response.register_flg = 1;
                                            res.status(200).json(response);
                                        } else {
                                            puppeteerRequest.findOneAndUpdate({_id: _index}, {
                                                $set: {
                                                    status: 1,
                                                    param: obj_body,
                                                    updated_at: new Date()
                                                }
                                            }, {upsert: false, multi: false}, function (err, result) {
                                            });

                                            response.register_flg = 0;
                                            res.status(200).json(response);
                                        }
                                    } else {
                                        console.log("Response not object", body);
                                        var exception = {
                                            cpid: cpid,
                                            user_id: user_id,
                                            status: 3,
                                            error_message: "Response not object",
                                            request_body: body
                                        };
                                        this.savePuppeteerException(exception);
                                        res.status(500).json({'error_message': default_error_msg});
                                    }
                                })
                            }
                        });
                    } else {
                        console.log("Can not get Authentication_token");
                        var exception = {
                            cpid: cpid,
                            user_id: user_id,
                            status: 3,
                            error_message: "Authentication_token Expire",
                            request_body: request_body
                        };
                        this.savePuppeteerException(exception);
                        res.status(500).json({'error_message': default_error_msg});
                    }
                });
            } catch (err) {
                console.error("Validate Mail Exception", err);
                var exception1 = {
                    cpid: cpid,
                    user_id: user_id,
                    status: 3,
                    error_message: err,
                    request_body: request_body
                };
                this.savePuppeteerException(exception1);
                res.status(500).json({'error_message': default_error_msg});
            }
        });

        this.router.post('/register', async(req, res, next) => {
            var request_body = req.body;
            var cpid = request_body.cpid;
            var user_id = request_body.user_id;
            var client_id = request_body.client_id;
            var client_secret = request_body.client_secret;
            var mail_address = request_body.mail_address;
            var request_url = request_body.request_url + '/rest/v2/user/push.json';
            try {
                var authentication_token = await this.getAuthToken(client_id, client_secret, cpid, user_id);
                if (authentication_token) {
                    var saveEmail = {
                        cpid: cpid,
                        uid: user_id,
                        email: mail_address,
                        registered_flg: 0,
                        request: request_body,
                    };

                    var saveData = new puppeteerEmailRegister(saveEmail);
                    saveData.save(function (err, result) {
                        if (result) {
                            var _index = result._id;
                            var data = {
                                "authentication_token": authentication_token,
                                "mail_address": request_body.mail_address,
                                "name": request_body.name,
                                "sex": request_body.sex,
                                "birthday": request_body.birthday,
                                "merumaga_flag": request_body.merumaga_flag,
                                "dm_flag": request_body.dm_flag,
                                "carrier": request_body.carrier,
                                "regist_flag": request_body.regist_flag
                            };

                            data = JSON.stringify(data);
                            request({
                                uri: request_url,
                                method: 'POST',
                                headers: api_header,
                                body: data
                            }, function (error, response, body) {
                                body = JSON.parse(body);
                                console.log("body===", body);
                                if (body.result == 'OK') {
                                    puppeteerEmailRegister.findOneAndUpdate({_id: _index}, {
                                        $set: {
                                            response: body,
                                            updated_at: new Date()
                                        }
                                    }, {upsert: false, multi: false}, function (err, result) {
                                    });

                                    res.status(200).json(body);
                                } else {
                                    puppeteerEmailRegister.findOneAndUpdate({_id: _index}, {
                                        $set: {
                                            response: body,
                                            updated_at: new Date()
                                        }
                                    }, {upsert: false, multi: false}, function (err, result) {

                                    });

                                    res.status(500).json({'error_message': body.error_message});
                                }
                            })
                        }
                    });
                } else {
                    var exception = {
                        cpid: request_body.cpid,
                        user_id: request_body.user_id,
                        status: 3,
                        error_message: "authentication_token Expire",
                        index: 0,
                        request_body: request_body
                    };
                    this.savePuppeteerException(exception);
                    res.status(500).json({'error_message': "Authentication_token Expire"});
                }
            } catch (err) {
                console.error("register Exception", err);
                var exception1 = {
                    cpid: request_body.cpid,
                    user_id: request_body.user_id,
                    status: 3,
                    error_message: err,
                    index: 0,
                    request_body: request_body
                };
                this.savePuppeteerException(exception1);
                res.status(500).json({'error_message': err});
            }
        });

        this.router.post('/login', async(req, res, next) => {
            var request_body = req.body;
            console.log("login==>", request_body);
            var client_id = request_body.client_id;
            var client_secret = request_body.client_secret;
            var cpid = request_body.cpid;
            var user_id = request_body.user_id;
            var mail_address = request_body.mail_address;
            var password = request_body.password;
            var now = new Date();
            var request_url = request_body.request_url + '/rest/v2/user/verify.json';
            try {
                var authentication_token = await this.getAuthToken(client_id, client_secret, cpid, user_id);
                if (authentication_token) {
                    puppeteerEmailRegister.findOneAndUpdate({cpid: cpid, uid: user_id, email: mail_address}, {
                        $set: {
                            updated_at: now
                        },
                        $setOnInsert: {
                            cpid: cpid,
                            uid: user_id,
                            email: mail_address,
                            registered_flg: 1,
                            data: request_body,
                            request: request_body,
                            created_at: now
                        }
                    }, {upsert: true, multi: false, new: true}, (err, result) => {
                        // console.log("result==>", result);
                        if (result) {
                            var _index = result._id;
                            var data = {
                                "authentication_token": authentication_token,
                                "mail_address": mail_address,
                                "password": password,
                            };

                            data = JSON.stringify(data);
                            console.log("data==", data);
                            request({
                                uri: request_url,
                                method: 'POST',
                                headers: api_header,
                                body: data
                            }, (error, response, body) => {
                                var obj_login = this.validateParseJSON(body);
                                console.log("obj_login==", obj_login);
                                if(typeof obj_login === 'object' && obj_login !== null) {
                                    if (obj_login.result == 'OK') {
                                        obj_login.login_value = g_login_value.login;
                                        puppeteerEmailRegister.findOneAndUpdate({_id: _index}, {
                                            $set: {
                                                response: obj_login,
                                                updated_at: new Date()
                                            }
                                        }, {upsert: false, multi: false}, function (err, result) {
                                        });

                                        res.status(200).json(obj_login);
                                    } else {
                                        puppeteerEmailRegister.findOneAndUpdate({_id: _index}, {
                                            $set: {
                                                response: obj_login,
                                                updated_at: new Date()
                                            }
                                        }, {upsert: false, multi: false}, function (err, result) {
                                        });

                                        res.status(500).json({'error_message': obj_login.error_message});
                                    }
                                } else {
                                    console.log("Response not object", body);
                                    var exception = {
                                        cpid: cpid,
                                        user_id: user_id,
                                        status: 3,
                                        error_message: "Response not object",
                                        index: 0,
                                        request_body: body
                                    };
                                    this.savePuppeteerException(exception);
                                    res.status(500).json({'error_message': default_error_msg});
                                }
                            })
                        } else {
                            console.log("Email not register==");
                            res.status(500).json({'error_message': default_error_msg});
                        }
                    });
                } else {
                    var exception = {
                        cpid: request_body.cpid,
                        user_id: request_body.user_id,
                        status: 3,
                        error_message: "Can't get auth token",
                        index: 0,
                        request_body: request_body
                    };
                    this.savePuppeteerException(exception);
                    res.status(500).json({'error_message': default_error_msg});
                }
            } catch (err) {
                console.error("Login Exception=", err);
                var exception1 = {
                    cpid: request_body.cpid,
                    user_id: request_body.user_id,
                    status: 3,
                    error_message: err,
                    index: 0,
                    request_body: request_body
                };
                this.savePuppeteerException(exception1);
                res.status(500).json({'error_message': default_error_msg});
            }
        });

        this.router.post('/get-user-info', async(req, res, next) => {
            var request_body = req.body,
                cpid = request_body.cpid,
                user_id = request_body.user_id,
                client_id = request_body.client_id,
                client_secret = request_body.client_secret;

            try {
                var authentication_token = await this.getAuthToken(client_id, client_secret, cpid, user_id);
                if (authentication_token) {
                    var savePuppeteer = {
                        cpid: request_body.cpid,
                        user_id: request_body.user_id,
                        action: 'get-user-info'
                    };

                    var saveData = new puppeteerRequest(savePuppeteer);
                    saveData.save(function (err, result) {
                        if (result) {
                            var _index = result._id;
                            puppeteerEmailRegister.findOne({cpid: request_body.cpid, uid: request_body.user_id, email: request_body.mail}, function(err, result) {
                                if(result) {
                                    var user_id_get = result.response.user_id;
                                    var request_url = request_body.request_url + `/rest/v2/user/${user_id_get}.json`;
                                    var data = {
                                        "authentication_token": authentication_token
                                    };

                                    data = JSON.stringify(data);
                                    request({
                                        uri: request_url,
                                        method: 'GET',
                                        headers: api_header,
                                        body: data
                                    }, function (error, response, body) {
                                        body = JSON.parse(body);
                                        console.log("body===", body);
                                        if (body.result == 'OK') {
                                            puppeteerRequest.findOneAndUpdate({_id: _index}, {
                                                $set: {
                                                    response: body,
                                                    updated_at: new Date()
                                                }
                                            }, {upsert: false, multi: false}, function (err, result) {
                                            });

                                            res.status(200).json(body);
                                        } else {
                                            puppeteerRequest.findOneAndUpdate({_id: _index}, {
                                                $set: {
                                                    response: body,
                                                    updated_at: new Date()
                                                }
                                            }, {upsert: false, multi: false}, function (err, result) {
                                            });

                                            res.status(500).json({'error_message': body.error_message});
                                        }
                                    })
                                }
                            });
                        }
                    });
                } else {
                    console.log("Can not get Authentication_token");
                    var exception = {
                        cpid: request_body.cpid,
                        user_id: request_body.user_id,
                        status: 3,
                        error_message: "Authentication_token Expire",
                        index: 0,
                        request_body: request_body
                    };
                    this.savePuppeteerException(exception);
                    res.status(500).json({'error_message': default_error_msg});
                }
            } catch (err) {
                console.error("Get user info Exception", err);
                var exception1 = {
                    cpid: request_body.cpid,
                    user_id: request_body.user_id,
                    status: 3,
                    error_message: err,
                    index: 0,
                    request_body: request_body
                };
                this.savePuppeteerException(exception1);
                res.status(500).json({'error_message': default_error_msg});
            }
        });

        this.router.post('/get-address', async(req, res, next) => {
            var request_body = req.body;
            var user_id = request_body.user_id;
            var cpid = request_body.cpid;
            var mail = request_body.mail;
            var client_id = request_body.client_id;
            var client_secret = request_body.client_secret;
            console.log("get-address=>", request_body);
            try {
                puppeteerRequest.remove({cpid: cpid, user_id: user_id, index: 0}, async(err) => {
                    var authentication_token = await this.getAuthToken(client_id, client_secret, cpid, user_id);
                    if (authentication_token) {
                        var savePuppeteer = {
                            cpid: cpid,
                            user_id: user_id,
                            status: 0,
                            error_message: "",
                            index: 0,
                            action: 'get-address'
                        };

                        var saveData = new puppeteerRequest(savePuppeteer);
                        saveData.save((err, result) => {
                            if (result) {
                                var _index = result._id;
                                puppeteerEmailRegister.findOne({cpid: cpid, uid: user_id, email: mail}, (err, result) => {
                                    if(result) {
                                        console.log("result=>", result);
                                        var user_id_get = result.response.user_id;
                                        console.log("user_id_get=>", user_id_get);
                                        var request_url = request_body.request_url + '/rest/v2/address/addresses.json';
                                        var data = {
                                            "authentication_token": authentication_token,
                                            "user_id": user_id_get
                                        };

                                        data = JSON.stringify(data);
                                        request({
                                            uri: request_url,
                                            method: 'POST',
                                            headers: api_header,
                                            body: data
                                        }, (error, response, body) => {
                                            var obj_address = this.validateParseJSON(body);
                                            if(typeof obj_address === 'object' && obj_address !== null) {
                                                console.log("obj_address===", obj_address);
                                                if (obj_address.result == 'OK') {
                                                    puppeteerRequest.findOneAndUpdate({_id: _index}, {
                                                        $set: {
                                                            status: 1,
                                                            param: obj_address,
                                                            updated_at: new Date()
                                                        }
                                                    }, {upsert: false, multi: false}, function (err, result) {
                                                    });

                                                    res.status(200).json(obj_address);
                                                } else {
                                                    puppeteerRequest.findOneAndUpdate({_id: _index}, {
                                                        $set: {
                                                            status: 3,
                                                            param: obj_address,
                                                            updated_at: new Date()
                                                        }
                                                    }, {upsert: false, multi: false}, function (err, result) {
                                                    });

                                                    res.status(500).json({'error_message': obj_address.error_message});
                                                }
                                            } else {
                                                console.log("Response not object", body);
                                                var exception = {
                                                    cpid: cpid,
                                                    user_id: user_id,
                                                    status: 3,
                                                    error_message: "Response not object",
                                                    index: 0,
                                                    request_body: body
                                                };
                                                this.savePuppeteerException(exception);
                                                res.status(500).json({'error_message': default_error_msg});
                                            }
                                        })
                                    } else {
                                        console.log("Get address Fail");
                                        res.status(500).json({'error_message': default_error_msg});
                                    }
                                });
                            }
                        });
                    } else {
                        console.log("Can not get Authentication_token");
                        var exception = {
                            cpid: request_body.cpid,
                            user_id: request_body.user_id,
                            status: 3,
                            error_message: "Authentication_token Expire",
                            index: 0,
                            request_body: request_body
                        };
                        this.savePuppeteerException(exception);
                        res.status(500).json({'error_message': default_error_msg});
                        // res.status(500).json({'error_message': "Authentication_token Expire"});
                    }
                });
            } catch (err) {
                console.error("Get-address Exception", err);
                var exception1 = {
                    cpid: request_body.cpid,
                    user_id: request_body.user_id,
                    status: 3,
                    error_message: err,
                    index: 0,
                    request_body: request_body
                };
                this.savePuppeteerException(exception1);
                res.status(500).json({'error_message': default_error_msg});
            }
        });

        this.router.post('/order', async(req, res, next) => {
            var request_body = req.body;
            console.log("order==>", request_body);
            var cpid = request_body.cpid;
            var user_id = request_body.user_id;
            var client_id = request_body.client_id;
            var client_secret = request_body.client_secret;
            var request_url = request_body.request_url + '/rest/v2/order/order.json';
            var user_agent = request_body.user_agent;
            try {
                puppeteerRequest.remove({cpid: cpid, user_id: user_id, index: 1}, (err) => {
                    var requestData = {
                        cpid: cpid,
                        user_id: user_id,
                        status: 0,
                        error_message: "",
                        index: 1,
                        request_body: request_body,
                        action: 'api_ec_order'
                    };

                    var puppeteerSave = new puppeteerRequest(requestData);
                    puppeteerSave.save(async(err, result) => {
                        if (err) throw  err;
                        if (result) {
                            var puppeteer_index = result._id;
                            var authentication_token = await this.getAuthToken(client_id, client_secret, cpid, user_id);
                            if (authentication_token) {
                                var data_input = await this.getOrderData(authentication_token, request_body);
                                if(data_input.status === true) {
                                    data_input = data_input.data;
                                } else {
                                    console.log("Data error==", data_input.data.join());
                                    var error_msg = default_error_msg + data_input.data.join();
                                    res.status(500).json({'error_message': error_msg});
                                    return;
                                }

                                var data = JSON.stringify(data_input);

                                var header = {
                                    'Content-type': 'application/json',
                                    'User-Agent': user_agent
                                };

                                console.log("Order Request body====>", JSON.stringify({
                                    uri: request_url,
                                    method: 'POST',
                                    headers: header,
                                    body: data_input
                                }, null, 2));

                                // console.log("body===>", data);
                                request({
                                    uri: request_url,
                                    method: 'POST',
                                    headers: header,
                                    body: data
                                }, (error, response, body) => {
                                    var body1 = this.validateParseJSON(body);
                                    console.log("Response===", typeof body1);
                                    console.log("body===", body1);
                                    if(typeof body1 === 'object' && body1 !== null) {
                                        var cnt_order = 0;
                                        var intervalOrder = setInterval(function () {
                                            if(body1) {
                                                clearInterval(intervalOrder);
                                                if (body1 && body1.result == 'OK') {
                                                    puppeteerRequest.findOneAndUpdate({_id: puppeteer_index}, {
                                                        $set: {
                                                            status: 1,
                                                            response_body: body1,
                                                            updated_at: new Date()
                                                        }
                                                    }, {upsert: false, multi: false}, (err, result) => {
                                                        if (err) throw err;
                                                    });
                                                    res.status(200).json(body1);
                                                } else {
                                                    console.log("call api NG=>", body1.error_message);
                                                    res.status(500).json({'error_message': body1.error_message});
                                                    puppeteerRequest.findOneAndUpdate({_id: puppeteer_index}, {
                                                        $set: {
                                                            status: 3,
                                                            response_body: body1,
                                                            error_message: body1.error_message,
                                                            updated_at: new Date()
                                                        }
                                                    }, {upsert: false, multi: false}, (err, result) => {
                                                        if (err) throw err;
                                                    });
                                                }
                                            } else {
                                                cnt_order++;
                                                console.log("cnt_order==>", cnt_order);
                                                if(cnt_order > 20){
                                                    clearInterval(intervalOrder);
                                                    res.status(500).json({"error_message": msg_order_again});
                                                }
                                            }
                                        }, 1000);
                                    } else {
                                        console.log("Response not object", body);
                                        var exception2 = {
                                            cpid: cpid,
                                            user_id: user_id,
                                            status: 3,
                                            error_message: body,
                                            index: 1,
                                            request_body: body
                                        };
                                        this.savePuppeteerException(exception2);
                                        res.status(500).json({'error_message': default_error_msg});
                                    }
                                })
                            } else {
                                console.log("Order: not get Auth token");
                                var exception = {
                                    cpid: cpid,
                                    user_id: user_id,
                                    status: 3,
                                    error_message: "Can't get Auth token",
                                    index: 1,
                                    request_body: request_body
                                };
                                this.savePuppeteerException(exception);
                                res.status(500).json({'error_message': default_error_msg});
                            }
                        } else {
                            console.log("Order: Puppeteer request not save");
                            var exception1 = {
                                cpid: cpid,
                                user_id: user_id,
                                status: 3,
                                error_message: "PuppeteerSave not success",
                                index: 1,
                                request_body: request_body
                            };
                            this.savePuppeteerException(exception1);
                            res.status(500).json({'error_message': default_error_msg});
                        }
                    })
                });
            } catch (err) {
                console.error("API order exception", err);
                var exception1 = {
                    cpid: cpid,
                    user_id: user_id,
                    status: 3,
                    error_message: "Order exception==>" + err,
                    index: 1,
                    request_body: request_body
                };
                this.savePuppeteerException(exception1);
                res.status(500).json({'error_message': default_error_msg});
            }
        })
    }

    async getOrderData(authentication_token, request_body) {
        var user_id = request_body.user_id,
            cpid = request_body.cpid,
            mail_address = request_body.mail_address,
            password = request_body.password,
            shipping_type = parseInt(request_body.shipping_type),
            login_value = parseInt(request_body.login_value);

        var error_message = [];
        var order_data =  await new Promise(async(resolve, reject) => {
            var result = {
                authentication_token: '',
                mail_address: '',
                items : [{
                    item_code: '',
                    item_num: '',
                }],
                deli_info: {},
                dm_flag: 1,
                mail_send: 1
            };

            if(mail_address) {
                result.mail_address = mail_address;
            }

            if(password) {
                result.password = password;
            }

            if(authentication_token) {
                result.authentication_token = authentication_token;
            } else {
                error_message.push('authentication_token');
            }

            //Set address
            var objAddress = {};
            if(login_value == g_login_value.login) {//Login
                var user_login = await this.getUserLogin(cpid, user_id, mail_address);
                if(user_login) {
                    result.user_id = user_login.response.user_id;
                }
                objAddress = await this.getAddress(cpid, user_id);
            } else { //register and guest
                result.user_entry_flag = login_value;
                objAddress = request_body;
            }

            console.log("objAddress===", objAddress);
            if(Object.keys(objAddress).length > 0) {
                result.deli_info = await this.setAddress(login_value, shipping_type, objAddress);
            } else {
                console.log("Address empty");
                error_message.push('deli_info');
            }

            //Set product item
            if(request_body.item_code) {
                result.items[0].item_code = request_body.item_code;
            } else {
                error_message.push('item_code');
            }

            if(request_body.item_num) {
                result.items[0].item_num = request_body.item_num;
            } else  {
                error_message.push('item_num');
            }

            if(request_body.sex) {
                result.sex = request_body.sex;
            }

            if(request_body.birthday) {
                result.birthday = moment(request_body.birthday).format('YYYY-MM-DD');
            }

            if(request_body.coupon_code) {
                result.coupon_code = request_body.coupon_code;
            }

            //Set delivery date, time
            if(request_body.delivery_date) {
                result.deli_date = moment(request_body.delivery_date).format('YYYY-MM-DD');
            }

            if(request_body.delivery_time) {
                result.deli_hour = request_body.delivery_time;
            }

            if(request_body.mail_magazine) {
                result.merumaga_flag = merumaga[request_body.mail_magazine];
            }

            if(request_body.gender = "男性") {
                result.sex = 1;
            } else if(request_body.gender = "⼥性"){
                result.sex = 2;
            } else {
                result.sex = 0;
            }

            //Set  credit card info
            if(request_body.payment_method) {
                result.payment_id = parseInt(request_body.payment_method);
            } else {
                error_message.push('payment_id');
            }

            if(request_body.payment_method == 1) {
                result.credit_info = {};
                result.credit_info.credit_token = request_body.payment_token + ',' + request_body.payment_token1;
            }

            var response = {};
            if(error_message.length > 0) {
                response.status = false;
                response.data = error_message;
                resolve(response);
            } else {
                response.status = true;
                response.data = result;
                resolve(response);
            }
        });

        console.log("after input result===", order_data);
        return order_data;
    }

    async getUserLogin(cpid, user_id, mail) {
        var user = await new Promise((resolve, reject) => {
            puppeteerEmailRegister.findOne({cpid: cpid, uid: user_id, email: mail}, (err, result1) => {
                console.log("result1===", result1);
                if (result1 && result1.response.result == 'OK') {
                    resolve(result1);
                } else {
                    resolve(false);
                }
            })
        });

        return user;
    }

    async getAuthToken(client_id, client_secret, cpid, user_id) {
        var auth_key = await new Promise((resolve, reject) => {
                apiEfoEc.findOne({cpid: cpid, user_id: user_id, client_id: client_id, client_secret: client_secret}, (err, result) => {
                if (result) {
                    resolve(result.authentication_token);
                } else {
                    resolve(false);
                }
            })
        });

        return auth_key;
    }

    async setAddress(login_value, shipping_type, objAddress) {
        var result_address = {};
        login_value = parseInt(login_value);
        shipping_type = parseInt(shipping_type);
        console.log("shipping_type===", shipping_type);
        console.log("login_value===", login_value);

        if(shipping_type === g_shipping_type.shipping) {
            //login
            if(login_value == g_login_value.login) {
                result_address.first_name = objAddress.first_name;
                result_address.last_name = objAddress.last_name;
                result_address.first_name_kana = objAddress.first_name_kana;
                result_address.last_name_kana = objAddress.last_name_kana;
                result_address.postal_code = objAddress.postal_code;
                result_address.pref = objAddress.pref;
                result_address.address1 = objAddress.address1;
                result_address.address2 = objAddress.address2 + objAddress.address3;
                result_address.phone = objAddress.phone;
            }
            // register and guest
            else {
                result_address.first_name = objAddress.first_name;
                result_address.last_name = objAddress.last_name;
                result_address.first_name_kana = objAddress.furigana_first;
                result_address.last_name_kana = objAddress.furigana_last;
                result_address.postal_code = objAddress.zipcode;
                result_address.pref = objAddress.pref;
                result_address.address1 = objAddress.address1;
                result_address.address2 = objAddress.address2 + (objAddress.address3) != void(0) ? objAddress.address3 : '';
                result_address.phone = objAddress.phone;
            }
        }
        // have shipping
        else if(shipping_type === g_shipping_type.shipping_new){
            result_address.first_name = objAddress.shipping_first_name;
            result_address.last_name = objAddress.shipping_last_name;
            result_address.first_name_kana = objAddress.shipping_furigana_first;
            result_address.last_name_kana = objAddress.shipping_furigana_last;
            result_address.postal_code = objAddress.shipping_zipcode;
            result_address.pref = objAddress.shipping_pref;
            result_address.address1 = objAddress.shipping_address1;
            result_address.address2 = objAddress.shipping_address2 + (objAddress.shipping_address3) != void(0) ? objAddress.shipping_address3 : '';
            result_address.phone = objAddress.shipping_phone_number;
        }

        return result_address;
    }

    async getAddress(cpid, user_id) {
        var address = await new Promise((resolve, reject) => {
            puppeteerRequest.findOne({cpid: cpid, user_id: user_id, index: 0, action: 'get-address', status: 1}, (err, result) => {
                console.log("result2===>", result);
                if (result) {
                    resolve(result.param.addresses[0]);
                } else {
                    resolve(false);
                }
            })
        });

        return address;
    }

    savePuppeteerException(data) {
        var exception_data = new puppeteerException(data);
        exception_data.save(function (err) {
        });
    };

    validateParseJSON(jsonString){
        try {
            var o = JSON.parse(jsonString);
            if (o && typeof o === "object") {
                return o;
            }
        } catch (e) {

        }

        return false;
    };

}

module.exports = new efoEcCart().router;