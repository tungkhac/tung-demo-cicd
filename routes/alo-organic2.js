'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
var model = require('../model');
var crypto = require('crypto');
var Zipcode = model.Zipcode;
var puppeteerRequest = model.PuppeteerRequest;
var puppeteerException = model.PuppeteerException;

var config = require('config');
var moment = require('moment-timezone');
var TIMEZONE = config.get('timezone');
var puppeteer = require('puppeteer');
var request = require('request');
var fs = require('fs');

var login_type_member = '1';
var login_type_guest = '2';

var product_code_235 = '235';
var product_code_426 = '426';
var mail_service = '1';

var home_delivery = '9';
var cash_delivery = '5';
var credit_delivery = '1';

var quantity_default = 1;
var shipping_address_type_default = 'same';
var shipping_address_type_new = 'new';
var payment_type_default = '9';
var header_login_success = "マイページ";

var login_list_url = ["shop/customers"];
/*fill info login*/
router.post('/login', function (req, res, next) {
    console.time("login");
    var body = req.body;
    var mail = body.mail;
    var password = body.password;
    var connect_page_id = body.cpid;
    var user_id = body.user_id;
    var url_login = body.url_login;
    console.log('body', body);
    //var login_type =  body.login_type;
    var response = {};
    if (typeof mail == "undefined" || mail == '' || typeof password == "undefined" || password == '' || typeof connect_page_id == "undefined" || connect_page_id == '' || typeof user_id == "undefined" || user_id == '') {
        response.error_message = "Input data is empty.";
        return res.status(400).json(response);
    }

    var token = crypto.randomBytes(64).toString('hex');
    var data = {
        connect_page_id: connect_page_id,
        user_id: user_id,
        mail: mail,
        password: password,
        url_login: url_login,
        user_token: token,
        cookie: {
            name: '',
            value: ''
        }
    };

    puppeteerRequest.remove({ cpid: connect_page_id, user_id: user_id }, function (err) {
        if (err) throw err;
        var organicData = {
            cpid: connect_page_id,
            user_id: user_id,
            url: url_login,
            login_flg: 0,
            status: 0,
            error_message: "",
            index: 0,
            user_token: token,
            request_body: body,
            param: data
        };
        var organic = new puppeteerRequest(organicData);
        organic.save(function (err, result) {
            if (err) throw err;
            data.object_id = result._id;
            organicLogin(data, res);
        });
    });
    console.timeEnd("login");
});

function organicLogin(data, res) {
    var _this = this;

    console.log("start run login", data);
    var response = {};
    (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var browser, page, header_element, curren_login_header, cookiesObject, cookie, email_element, password_element, new_login_header, customer_edit_element, name1_element, name2_element, furigana1_element, furigana2_element, zipcode1_element, zipcode2_element, prefecture_element, address1_element, address2_element, address3_element, phone1_element, phone2_element, phone3_element, _email_element, gender_element, profession_element, year_element, month_element, day_element, magazine_element, name1_value, name2_value, furigana1_value, furigana2_value, zipcode1_value, zipcode2_value, zipcode, prefecture_value, address1_value, address2_value, address3_value, phone1_value, phone2_value, phone3_value, phone, email_value, gender_value, profession_value, year_value, month_value, day_value, magazine_value, birth_day, address, _cookiesObject, error_message, exception_index_3;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return puppeteer.launch({
                            args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process']
                        });

                    case 2:
                        browser = _context.sent;
                        _context.next = 5;
                        return browser.newPage();

                    case 5:
                        page = _context.sent;
                        _context.next = 8;
                        return page.setRequestInterception(true);

                    case 8:
                        page.on('request', function (request) {
                            //console.log(request.resourceType());
                            var rtype = request.resourceType();
                            var request_url = request.url();
                            if (request_url.indexOf("google") !== -1 || request_url.indexOf("ladsp") !== -1 || request_url.indexOf("yahoo") !== -1 || request_url.indexOf("socdm") !== -1 || request_url.indexOf("facebook") !== -1 || request_url.indexOf("kozuchi") !== -1 || request_url.indexOf("kozuchi") !== -1) {
                                //console.log("request_url=", request_url);
                                request.continue();
                            } else if (rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || request.url().indexOf("organic") == -1) {
                                request.abort();
                            } else {
                                //console.log(request.url());
                                request.continue();
                            }
                        });
                        //await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                        _context.prev = 9;
                        _context.next = 12;
                        return page.goto(data.url_login, { waitUntil: 'networkidle0' });

                    case 12:
                        header_element = ".ncontainer > .content-right > .breadcrumb > li:nth-child(2) > span";
                        _context.next = 15;
                        return page.waitForSelector(header_element);

                    case 15:
                        _context.next = 17;
                        return page.$eval(header_element, function (el) {
                            return el.innerText;
                        });

                    case 17:
                        curren_login_header = _context.sent;

                        console.log("curren_login_header", curren_login_header);

                        if (!(curren_login_header == header_login_success)) {
                            _context.next = 30;
                            break;
                        }

                        console.log("===logged===");
                        _context.next = 23;
                        return page.cookies();

                    case 23:
                        cookiesObject = _context.sent;
                        cookie = getCookieGest(cookiesObject);
                        //console.log('cookie===', cookie);

                        puppeteerRequest.findOne({ _id: data.object_id }, function (err, result) {
                            var tmp_param = result.param;
                            tmp_param.cookie = cookie;
                            result.status = 1;
                            result.error_message = '';
                            result.login_flg = 1;
                            result.param = tmp_param;
                            result.updated_at = new Date();
                            result.save(function (err) {
                                if (err) throw err;
                            });
                        });
                        response.login_flg = 1;
                        return _context.abrupt('return', res.status(200).json(response));

                    case 30:
                        console.log("== start login====");
                        email_element = 'form:nth-child(3) > div:nth-child(4) > div.form-group > div.col-md-9 > input';
                        password_element = 'form:nth-child(3) > div:nth-child(5) > div.form-group > div.col-md-9 > input';

                        //input email

                        _context.next = 35;
                        return page.waitForSelector(email_element);

                    case 35:
                        _context.next = 37;
                        return page.click(email_element);

                    case 37:
                        _context.next = 39;
                        return page.focus(email_element);

                    case 39:
                        _context.next = 41;
                        return page.evaluate(function (email_element) {
                            document.querySelector(email_element).value = '';
                        }, email_element);

                    case 41:
                        _context.next = 43;
                        return page.keyboard.type(data.mail);

                    case 43:
                        _context.next = 45;
                        return page.waitForSelector(password_element);

                    case 45:
                        _context.next = 47;
                        return page.click(password_element);

                    case 47:
                        _context.next = 49;
                        return page.focus(password_element);

                    case 49:
                        _context.next = 51;
                        return page.evaluate(function (password_element) {
                            document.querySelector(password_element).value = '';
                        }, password_element);

                    case 51:
                        _context.next = 53;
                        return page.keyboard.type(data.password);

                    case 53:
                        _context.next = 55;
                        return Promise.all([page.click('#customers-sessions-sign-in-view > form:nth-child(3) > div:nth-child(7) > div > div > p > input'), page.waitForNavigation()]);

                    case 55:
                        _context.next = 57;
                        return page.$eval(header_element, function (el) {
                            return el.innerText;
                        });

                    case 57:
                        new_login_header = _context.sent;

                        console.log("new_login_header", new_login_header);

                        if (!(new_login_header == header_login_success)) {
                            _context.next = 161;
                            break;
                        }

                        // get user info
                        customer_edit_element = "body > main > div > div.nav-customer.mb-40 > a:nth-child(6)";
                        _context.next = 63;
                        return Promise.all([page.click(customer_edit_element), page.waitForNavigation()]);

                    case 63:
                        name1_element = '#customer_form > div:nth-child(6) > div.col-md-9 > div.row > div:nth-child(1) > input';
                        name2_element = '#customer_form > div:nth-child(6) > div.col-md-9 > div.row > div:nth-child(2) > input';
                        furigana1_element = '#customer_form > div:nth-child(7) > div > div > div:nth-child(1) > input';
                        furigana2_element = '#customer_form > div:nth-child(7) > div > div > div:nth-child(2) > input';
                        zipcode1_element = '#customer_form > div:nth-child(8) > div > div.form-inline > #customer_billing_address_attributes_zip01';
                        zipcode2_element = '#customer_form > div:nth-child(8) > div > div.form-inline > #customer_billing_address_attributes_zip02';
                        prefecture_element = '#customer_form > div:nth-child(9) > div > #customer_billing_address_attributes_prefecture_name';
                        address1_element = '#customer_form > div:nth-child(10) > div > input';
                        address2_element = '#customer_form > div:nth-child(11) > div > input';
                        address3_element = '#customer_form > div:nth-child(12) > div > input';
                        phone1_element = '#customer_form > div:nth-child(13) > div > div > #customer_billing_address_attributes_tel01';
                        phone2_element = '#customer_form > div:nth-child(13) > div > div > #customer_billing_address_attributes_tel02';
                        phone3_element = '#customer_form > div:nth-child(13) > div > div > #customer_billing_address_attributes_tel03';
                        _email_element = '#customer_form > div:nth-child(14) > div > #customer_email';
                        gender_element = '#customer_form > div:nth-child(15) > div > #customer_sex_id';
                        profession_element = '#customer_form > div:nth-child(16) > div > #customer_job_id';
                        year_element = '#customer_form > div:nth-child(17) > div > div > #customer_birth_1i';
                        month_element = '#customer_form > div:nth-child(17) > div > div > #customer_birth_2i';
                        day_element = '#customer_form > div:nth-child(17) > div > div > #customer_birth_3i';
                        magazine_element = '#customer_form > div:nth-child(18) > div > #customer_optin';
                        _context.next = 85;
                        return page.$eval(name1_element, function (el) {
                            return el.value;
                        });

                    case 85:
                        name1_value = _context.sent;
                        _context.next = 88;
                        return page.$eval(name2_element, function (el) {
                            return el.value;
                        });

                    case 88:
                        name2_value = _context.sent;
                        _context.next = 91;
                        return page.$eval(furigana1_element, function (el) {
                            return el.value;
                        });

                    case 91:
                        furigana1_value = _context.sent;
                        _context.next = 94;
                        return page.$eval(furigana2_element, function (el) {
                            return el.value;
                        });

                    case 94:
                        furigana2_value = _context.sent;
                        _context.next = 97;
                        return page.$eval(zipcode1_element, function (el) {
                            return el.value;
                        });

                    case 97:
                        zipcode1_value = _context.sent;
                        _context.next = 100;
                        return page.$eval(zipcode2_element, function (el) {
                            return el.value;
                        });

                    case 100:
                        zipcode2_value = _context.sent;
                        zipcode = zipcode1_value.toString() + zipcode2_value.toString();
                        _context.next = 104;
                        return page.$eval(prefecture_element, function (el) {
                            return el.value;
                        });

                    case 104:
                        prefecture_value = _context.sent;
                        _context.next = 107;
                        return page.$eval(address1_element, function (el) {
                            return el.value;
                        });

                    case 107:
                        address1_value = _context.sent;
                        _context.next = 110;
                        return page.$eval(address2_element, function (el) {
                            return el.value;
                        });

                    case 110:
                        address2_value = _context.sent;
                        _context.next = 113;
                        return page.$eval(address3_element, function (el) {
                            return el.value;
                        });

                    case 113:
                        address3_value = _context.sent;
                        _context.next = 116;
                        return page.$eval(phone1_element, function (el) {
                            return el.value;
                        });

                    case 116:
                        phone1_value = _context.sent;
                        _context.next = 119;
                        return page.$eval(phone2_element, function (el) {
                            return el.value;
                        });

                    case 119:
                        phone2_value = _context.sent;
                        _context.next = 122;
                        return page.$eval(phone3_element, function (el) {
                            return el.value;
                        });

                    case 122:
                        phone3_value = _context.sent;
                        phone = phone1_value + phone2_value + phone3_value;
                        _context.next = 126;
                        return page.$eval(_email_element, function (el) {
                            return el.value;
                        });

                    case 126:
                        email_value = _context.sent;
                        _context.next = 129;
                        return page.$eval(gender_element, function (el) {
                            return el.value;
                        });

                    case 129:
                        gender_value = _context.sent;
                        _context.next = 132;
                        return page.$eval(profession_element, function (el) {
                            return el.value;
                        });

                    case 132:
                        profession_value = _context.sent;
                        _context.next = 135;
                        return page.$eval(year_element, function (el) {
                            return el.value;
                        });

                    case 135:
                        year_value = _context.sent;
                        _context.next = 138;
                        return page.$eval(month_element, function (el) {
                            return el.value;
                        });

                    case 138:
                        month_value = _context.sent;
                        _context.next = 141;
                        return page.$eval(day_element, function (el) {
                            return el.value;
                        });

                    case 141:
                        day_value = _context.sent;
                        _context.next = 144;
                        return page.$eval(magazine_element, function (el) {
                            return el.value;
                        });

                    case 144:
                        magazine_value = _context.sent;
                        birth_day = year_value + '-' + month_value + '-' + day_value;
                        address = prefecture_value + address1_value + address2_value + address3_value;
                        _context.next = 149;
                        return page.cookies();

                    case 149:
                        _cookiesObject = _context.sent;

                        console.log(_cookiesObject);
                        cookie = getCookieGest(_cookiesObject);

                        console.log(cookie);
                        data.cookie = cookie;
                        data.response = {
                            first_name: name2_value,
                            last_name: name1_value,
                            full_name: name1_value + " " + name2_value,
                            furigana_first: furigana2_value,
                            furigana_last: furigana1_value,
                            full_furigana_name: furigana1_value + " " + furigana2_value,
                            zipcode1: zipcode1_value,
                            zipcode2: zipcode2_value,
                            zipcode: zipcode,
                            prefecture: prefecture_value,
                            address1: address1_value,
                            address2: address2_value,
                            address3: address3_value,
                            phone1: phone1_value,
                            phone2: phone2_value,
                            phone3: phone3_value,
                            mail: email_value,
                            gender: gender_value,
                            profession: profession_value,
                            year: year_value,
                            month: month_value,
                            day: day_value,
                            magazine: magazine_value,
                            phone: phone,
                            birth_day: birth_day,
                            login_flg: 1,
                            address: address
                        };
                        puppeteerRequest.findOneAndUpdate({ _id: data.object_id }, {
                            $set: {
                                status: 1,
                                error_message: '',
                                login_flg: 1,
                                param: data,
                                updated_at: new Date()
                            }
                        }, { upsert: false }, function (err, result) {
                            if (err) throw err;
                        });

                        console.log("login success");
                        response = data.response;
                        res.status(200).json(response);
                        _context.next = 165;
                        break;

                    case 161:
                        error_message = "メールアドレスもしくはパスワードが不正です。";

                        puppeteerRequest.findOneAndUpdate({ _id: data.object_id }, {
                            $set: {
                                status: 3,
                                error_message: error_message,
                                updated_at: new Date()
                            }
                        }, { upsert: false }, function (err, result) {
                            if (err) throw err;
                        });
                        response.error_message = error_message;
                        res.status(500).json(response);

                    case 165:
                        _context.next = 174;
                        break;

                    case 167:
                        _context.prev = 167;
                        _context.t0 = _context['catch'](9);

                        console.log("puppeteerLogin exception", _context.t0);
                        exception_index_3 = {
                            cpid: data.connect_page_id,
                            user_id: data.user_id,
                            status: 3,
                            error_message: _context.t0,
                            index: 0,
                            param: data
                        };

                        savePuppeteerException(exception_index_3);
                        response.error_message = "エラーが発生しました。再度ご試しください。";
                        res.status(500).json(response);

                    case 174:
                        _context.next = 176;
                        return browser.close();

                    case 176:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, _this, [[9, 167]]);
    }))();
}

/*fill info guest*/
router.post('/fill_info_guest', function (req, res, next) {
    console.time("time_guest");
    var body = req.body;

    var product_code = body.product_code;
    var name = body.name;
    var furigana = body.furigana;
    var zipcode = body.zipcode;
    var pref = body.pref;
    var address01 = body.address01;
    var address02 = body.address02;
    var phone_number = typeof body.phone_number != 'undefined' && body.phone_number.indexOf("-") != -1 ? body.phone_number.replace(/-/g, "") : body.phone_number;
    var mail = body.mail;
    var password = body.password;
    var shipping_address_type = typeof body.shipping_address_type !== 'undefined' ? body.shipping_address_type : shipping_address_type_default;
    var payment_type = typeof body.payment_type !== 'undefined' ? body.payment_type : payment_type_default;
    var payment_token = body.payment_token;
    var card_name = typeof body.card_name !== 'undefined' ? body.card_name : 'EFO';
    var card_month = body.card_month;
    var card_year = body.card_year;
    var card_number = body.card_number;
    var card_select = body.card_select;
    var shipping_cycle = body.shipping_cycle;
    var user_id = body.user_id;
    var connect_page_id = body.cpid;
    var login_type = body.login_type;
    var login_flg = parseInt(body.login_flg);
    /*shipping info*/
    var shipping_name = body.shipping_name;
    var shipping_furigana = body.shipping_furigana;
    var shipping_zipcode = body.shipping_zipcode;
    var shipping_pref = body.shipping_pref;
    var shipping_address01 = body.shipping_address01;
    var shipping_address02 = body.shipping_address02;
    var shipping_phone_number = typeof body.shipping_phone_number != 'undefined' && body.shipping_phone_number.indexOf("-") != -1 ? body.shipping_phone_number.replace(/-/g, "") : body.shipping_phone_number;
    var screen_short_flg = parseInt(body.screen_short_flg);

    var response = {};

    var now = new Date();

    var data = {
        url: body.url,
        login_flg: login_flg,
        product_code: product_code,
        name: name,
        furigana: furigana,
        zipcode: zipcode,
        pref: pref,
        address01: address01,
        address02: address02,
        mail: mail,
        phone_number: phone_number,
        password: password,
        payment_type: payment_type,
        payment_token: payment_token,
        card_name: card_name,
        card_month: card_month,
        card_year: card_year,
        card_number: card_number,
        card_select: card_select,
        shipping_cycle: shipping_cycle,
        shipping_address_type: shipping_address_type,
        shipping_name: shipping_name,
        shipping_furigana: shipping_furigana,
        shipping_pref: shipping_pref,
        shipping_address01: shipping_address01,
        shipping_address02: shipping_address02,
        shipping_zipcode: shipping_zipcode,
        shipping_phone_number: shipping_phone_number,
        user_id: user_id,
        connect_page_id: connect_page_id,
        login_type: login_type,
        screen_short_flg: screen_short_flg,
        cookie: {
            name: '',
            value: ''
        }
    };
    // console.log('data=====', data);
    // response.error_message = 'TEST';
    // return res.status(500).json(response);
    var token = crypto.randomBytes(64).toString('hex');
    var condition = { cpid: connect_page_id, user_id: user_id };
    if (login_type === login_type_member) {
        condition = { cpid: connect_page_id, user_id: user_id, index: { $gt: 0 } };
    }
    puppeteerRequest.remove(condition, function (err) {
        if (err) throw err;
        var data_insert = {
            user_token: token,
            cpid: connect_page_id,
            user_id: user_id,
            url: "",
            status: 2,
            error_message: "",
            index: 1,
            param: data,
            request_body: body,
            created_at: now
        };
        var puppeteer_data = new puppeteerRequest(data_insert);
        puppeteer_data.save(function (err, result) {
            if (err) throw err;
            if (result) {
                var idObject = result._id;
                if (login_type === login_type_member) {
                    puppeteerRequest.findOne({ cpid: connect_page_id, user_id: user_id, index: 0 }, function (err, result) {
                        if (result) {
                            data.cookie = result.param.cookie;
                            shoppingNomember(idObject, data, res);
                        }
                    });
                } else {
                    shoppingNomember(idObject, data, res);
                }
            }
        });
    });
    console.timeEnd("time_guest");
});

router.post('/order', function (req, res, next) {
    var body = req.body;
    var user_id = body.user_id,
        connect_page_id = body.cpid,
        screen_short_flg = parseInt(body.screen_short_flg);
    var data = {
        user_id: user_id,
        connect_page_id: connect_page_id,
        screen_short_flg: screen_short_flg
    };
    checkPreviousStep(body, data, res);
});

//注文確認 + 完了
function shoppingNomember(idObject, data, res) {
    var _this2 = this;

    var response = {};
    (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var browser, page, shopping_nonmember_url, cookie, cookie_new1, form_seletor, form_shipping, form_credit_card_payment, credit_card_number_element, credit_card_name_element, name_elm, furigana_elm, pef_option, pef_id, pefs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, pef, item_text, item_val, address1_elm, tel_elm, shipping_type_elm, shipping_pef_option, shipping_pef_id, shipping_pefs, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, shipping_pef, shipping_address1_elm, payment_type_select, payment_type_element, card_m, card_y, token_elm, tmp_token, tmp_token2, shipping_cycle_option, shipping_cycle_id, shipping_cycles, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, shipping_cycle, _item_val, shopping_confirm_url, thank_url, order_id, error_elm, error_message, _error_elm, exception_index_1;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return puppeteer.launch({
                            args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process']
                        });

                    case 2:
                        browser = _context2.sent;
                        _context2.next = 5;
                        return browser.newPage();

                    case 5:
                        page = _context2.sent;
                        _context2.next = 8;
                        return page.setRequestInterception(true);

                    case 8:
                        page.on('request', function (request) {
                            //console.log(request.resourceType());
                            var rtype = request.resourceType();
                            var request_url = request.url();
                            if (request_url.indexOf("google") !== -1 || request_url.indexOf("ladsp") !== -1 || request_url.indexOf("yahoo") !== -1 || request_url.indexOf("socdm") !== -1 || request_url.indexOf("facebook") !== -1 || request_url.indexOf("kozuchi") !== -1 || request_url.indexOf("kozuchi") !== -1) {
                                request.continue().catch(function (err) {
                                    return console.error("");
                                });
                            } else if (rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || request.url().indexOf("organic") == -1 && request.url().indexOf("p01") == -1) {
                                request.abort().catch(function (err) {
                                    return console.error("");
                                });
                            } else {
                                // console.log('url =', request.url());
                                request.continue().catch(function (err) {
                                    return console.error("");
                                });
                            }
                        });

                        _context2.prev = 9;

                        //const page = await browser.newPage();
                        shopping_nonmember_url = data.url;
                        // const shopping_nonmember_url = 'https://www.alo-organic.com/lp?u=hln000_page203_cform';

                        if (!(typeof data.cookie !== 'undefined' && Array.isArray(data.cookie) && data.cookie.length > 0)) {
                            _context2.next = 20;
                            break;
                        }

                        cookie = data.cookie;
                        cookie_new1 = [];


                        cookie.forEach(function (element) {
                            element.url = shopping_nonmember_url;
                            cookie_new1.push(element);
                        });
                        console.log(cookie_new1);
                        cookie.url = shopping_nonmember_url;
                        console.log("shopping_nonmember_url=", shopping_nonmember_url);
                        _context2.next = 20;
                        return page.setCookie.apply(page, cookie_new1);

                    case 20:
                        _context2.next = 22;
                        return page.goto(shopping_nonmember_url, { waitUntil: 'networkidle0' });

                    case 22:
                        // await page.waitForSelector('body > div.form > div#lp-form > form#new-view');
                        form_seletor = 'form#new-view > #view-billing-information > table.landing_form_ec > tbody >';
                        form_shipping = 'form#new-view > #view-shipping-information > #shipping_address_input > table.landing_form_ec > tbody >';
                        form_credit_card_payment = 'form#new-view > #view-payment-information > #view-credit-card-information > table.landing_form_ec > tbody >';
                        credit_card_number_element = 'form#new-view > #view-payment-information > #view-credit-card-information > table.landing_form_ec > tbody > tr.input_card_number_ec > td > div.form_group_ec > #view-input-card-number > p:nth-child(4) > input.input_box_card_number_ec';
                        credit_card_name_element = 'form#new-view > #view-payment-information > #view-credit-card-information > table.landing_form_ec > tbody > tr.input_card_name_ec > td > div.form_group_ec > input.input_box_card_name_ec';


                        console.log('user info no split');
                        //nonmember_name_name
                        name_elm = form_seletor + ' tr.input_name_ec > td > div.form_group_ec > #order_billing_address_attributes_name1';
                        _context2.next = 31;
                        return page.focus(name_elm);

                    case 31:
                        _context2.next = 33;
                        return page.evaluate(function (name_elm) {
                            document.querySelector(name_elm).value = '';
                        }, name_elm);

                    case 33:
                        _context2.next = 35;
                        return page.keyboard.type(data.name);

                    case 35:
                        console.log('data.name_no_split', data.name);
                        //nonmember_kana_kana
                        furigana_elm = form_seletor + ' tr.input_kana_ec > td > div.form_group_ec > #order_billing_address_attributes_kana1';
                        _context2.next = 39;
                        return page.focus(furigana_elm);

                    case 39:
                        _context2.next = 41;
                        return page.evaluate(function (furigana_elm) {
                            document.querySelector(furigana_elm).value = '';
                        }, furigana_elm);

                    case 41:
                        _context2.next = 43;
                        return page.keyboard.type(data.furigana);

                    case 43:
                        console.log('data.furigana_no_split', data.furigana);
                        //nonmember_zipcode
                        _context2.next = 46;
                        return page.focus(form_seletor + ' tr.input_zip_ec > td > div.form_group_ec > p > #order_billing_address_attributes_zip01');

                    case 46:
                        _context2.next = 48;
                        return page.keyboard.type(data.zipcode);

                    case 48:
                        _context2.next = 50;
                        return page.focus(form_seletor + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_billing_address_attributes_prefecture_name');

                    case 50:
                        pef_option = form_seletor + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_billing_address_attributes_prefecture_name > option';
                        pef_id = form_seletor + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_billing_address_attributes_prefecture_name';
                        _context2.next = 54;
                        return page.$$(pef_option);

                    case 54:
                        pefs = _context2.sent;
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context2.prev = 58;
                        _iterator = pefs[Symbol.iterator]();

                    case 60:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context2.next = 74;
                            break;
                        }

                        pef = _step.value;
                        _context2.next = 64;
                        return page.evaluate(function (el) {
                            return el.innerText;
                        }, pef);

                    case 64:
                        item_text = _context2.sent;
                        _context2.next = 67;
                        return page.evaluate(function (el) {
                            return el.value;
                        }, pef);

                    case 67:
                        item_val = _context2.sent;

                        if (!(data.pref == item_text)) {
                            _context2.next = 71;
                            break;
                        }

                        _context2.next = 71;
                        return page.select(pef_id, item_val);

                    case 71:
                        _iteratorNormalCompletion = true;
                        _context2.next = 60;
                        break;

                    case 74:
                        _context2.next = 80;
                        break;

                    case 76:
                        _context2.prev = 76;
                        _context2.t0 = _context2['catch'](58);
                        _didIteratorError = true;
                        _iteratorError = _context2.t0;

                    case 80:
                        _context2.prev = 80;
                        _context2.prev = 81;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 83:
                        _context2.prev = 83;

                        if (!_didIteratorError) {
                            _context2.next = 86;
                            break;
                        }

                        throw _iteratorError;

                    case 86:
                        return _context2.finish(83);

                    case 87:
                        return _context2.finish(80);

                    case 88:

                        //nonmember_address
                        console.log('data.address01', data.address01);
                        address1_elm = form_seletor + ' tr.input_addr01_ec > td > div.form_group_ec > #order_billing_address_attributes_addr01';
                        _context2.next = 92;
                        return page.focus(address1_elm);

                    case 92:
                        _context2.next = 94;
                        return page.evaluate(function (address1_elm) {
                            document.querySelector(address1_elm).value = '';
                        }, address1_elm);

                    case 94:
                        _context2.next = 96;
                        return page.keyboard.type(data.address01);

                    case 96:
                        console.log('data.address02', data.address02);
                        _context2.next = 99;
                        return page.focus(form_seletor + ' tr.input_addr02_ec > td > div.form_group_ec > #order_billing_address_attributes_addr02');

                    case 99:
                        _context2.next = 101;
                        return page.waitFor(1000);

                    case 101:
                        _context2.next = 103;
                        return page.keyboard.type(data.address02);

                    case 103:
                        //nonmember_tel
                        tel_elm = form_seletor + ' tr.input_tel_ec > td > div.form_group_ec > input[name="order[billing_address_attributes][tel01]"]';
                        _context2.next = 106;
                        return page.focus(tel_elm);

                    case 106:
                        _context2.next = 108;
                        return page.evaluate(function (tel_elm) {
                            document.querySelector(tel_elm).value = '';
                        }, tel_elm);

                    case 108:
                        _context2.next = 110;
                        return page.keyboard.type(data.phone_number.trim());

                    case 110:
                        console.log('data.phone_number', data.phone_number);
                        //nonmember_email
                        _context2.next = 113;
                        return page.focus(form_seletor + ' tr.input_email_ec > td > div.form_group_ec > #email');

                    case 113:
                        _context2.next = 115;
                        return page.keyboard.type(data.mail);

                    case 115:

                        //nonmember_shipping_type
                        shipping_type_elm = 'form#new-view > #view-shipping-information > table > tbody > tr > td > div.form_group_ec > #shipping_address_id';
                        _context2.next = 118;
                        return page.focus(shipping_type_elm);

                    case 118:
                        _context2.next = 120;
                        return page.select(shipping_type_elm, data.shipping_address_type);

                    case 120:
                        if (!(data.shipping_address_type == shipping_address_type_new)) {
                            _context2.next = 196;
                            break;
                        }

                        _context2.next = 123;
                        return page.waitFor(1000);

                    case 123:
                        console.log("start fill shipping_address_type_new");
                        console.log('shipping info no split');
                        //nonmember_shipping_name
                        _context2.next = 127;
                        return page.focus(form_shipping + ' tr.input_name_ec > td > div.form_group_ec > #order_shipping_address_attributes_name1');

                    case 127:
                        _context2.next = 129;
                        return page.keyboard.type(data.shipping_name);

                    case 129:
                        _context2.next = 131;
                        return page.focus(form_shipping + ' tr.input_kana_ec > td > div.form_group_ec > #order_shipping_address_attributes_kana1');

                    case 131:
                        _context2.next = 133;
                        return page.keyboard.type(data.shipping_furigana);

                    case 133:
                        _context2.next = 135;
                        return page.focus(form_shipping + ' tr.input_zip_ec > td > div.form_group_ec > p > #order_shipping_address_attributes_zip01');

                    case 135:
                        _context2.next = 137;
                        return page.keyboard.type(data.shipping_zipcode);

                    case 137:
                        _context2.next = 139;
                        return page.focus(form_shipping + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_shipping_address_attributes_prefecture_name');

                    case 139:
                        shipping_pef_option = form_shipping + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_shipping_address_attributes_prefecture_name > option';
                        shipping_pef_id = form_shipping + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_shipping_address_attributes_prefecture_name';
                        _context2.next = 143;
                        return page.$$(shipping_pef_option);

                    case 143:
                        shipping_pefs = _context2.sent;
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context2.prev = 147;
                        _iterator2 = shipping_pefs[Symbol.iterator]();

                    case 149:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context2.next = 163;
                            break;
                        }

                        shipping_pef = _step2.value;
                        _context2.next = 153;
                        return page.evaluate(function (el) {
                            return el.innerText;
                        }, shipping_pef);

                    case 153:
                        item_text = _context2.sent;
                        _context2.next = 156;
                        return page.evaluate(function (el) {
                            return el.value;
                        }, shipping_pef);

                    case 156:
                        item_val = _context2.sent;

                        if (!(data.shipping_pref == item_text)) {
                            _context2.next = 160;
                            break;
                        }

                        _context2.next = 160;
                        return page.select(shipping_pef_id, item_val);

                    case 160:
                        _iteratorNormalCompletion2 = true;
                        _context2.next = 149;
                        break;

                    case 163:
                        _context2.next = 169;
                        break;

                    case 165:
                        _context2.prev = 165;
                        _context2.t1 = _context2['catch'](147);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context2.t1;

                    case 169:
                        _context2.prev = 169;
                        _context2.prev = 170;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 172:
                        _context2.prev = 172;

                        if (!_didIteratorError2) {
                            _context2.next = 175;
                            break;
                        }

                        throw _iteratorError2;

                    case 175:
                        return _context2.finish(172);

                    case 176:
                        return _context2.finish(169);

                    case 177:

                        //nonmember_shipping_address
                        console.log('data.shipping_address01', data.shipping_address01);
                        shipping_address1_elm = form_shipping + ' tr.input_addr01_ec > td > div.form_group_ec > #order_shipping_address_attributes_addr01';
                        _context2.next = 181;
                        return page.focus(shipping_address1_elm);

                    case 181:
                        _context2.next = 183;
                        return page.evaluate(function (shipping_address1_elm) {
                            document.querySelector(shipping_address1_elm).value = '';
                        }, shipping_address1_elm);

                    case 183:
                        _context2.next = 185;
                        return page.keyboard.type(data.shipping_address01);

                    case 185:
                        console.log('data.shipping_address02', data.shipping_address02);
                        _context2.next = 188;
                        return page.focus(form_shipping + ' tr.input_addr02_ec > td > div.form_group_ec > #order_shipping_address_attributes_addr02');

                    case 188:
                        _context2.next = 190;
                        return page.waitFor(1000);

                    case 190:
                        _context2.next = 192;
                        return page.keyboard.type(data.shipping_address02);

                    case 192:
                        _context2.next = 194;
                        return page.focus(form_shipping + ' tr.input_tel_ec > td > div.form_group_ec > input[name="order[shipping_address_attributes][tel01]"]');

                    case 194:
                        _context2.next = 196;
                        return page.keyboard.type(data.shipping_phone_number.trim());

                    case 196:
                        //nonmember_payment_type
                        console.log('data.payment_type = ', data.payment_type);
                        payment_type_select = 'form#new-view > #view-payment-information table:nth-child(1) > tbody > tr > td > div.form_group_ec > #payment_method_id';
                        _context2.next = 200;
                        return page.focus(payment_type_select);

                    case 200:
                        _context2.next = 202;
                        return page.waitFor(1000);

                    case 202:
                        _context2.next = 204;
                        return page.select(payment_type_select, data.payment_type);

                    case 204:
                        _context2.next = 206;
                        return page.waitFor(1000);

                    case 206:
                        if (!(data.payment_type === credit_delivery && data.login_type === login_type_member && typeof data.card_select != "undefined")) {
                            _context2.next = 216;
                            break;
                        }

                        payment_type_element = 'form#new-view > #view-payment-information > #view-credit-card-information > table.landing_form_ec > tbody > tr.input_card_number_ec > td > div.form_group_ec > #card-id';
                        _context2.next = 210;
                        return page.$(payment_type_element);

                    case 210:
                        _context2.t2 = _context2.sent;

                        if (!(_context2.t2 !== null)) {
                            _context2.next = 216;
                            break;
                        }

                        _context2.next = 214;
                        return page.focus(payment_type_element);

                    case 214:
                        _context2.next = 216;
                        return page.select(payment_type_element, data.card_select);

                    case 216:
                        if (!(data.payment_type === credit_delivery)) {
                            _context2.next = 257;
                            break;
                        }

                        if (!(data.login_type === login_type_guest || data.login_type === login_type_member && (typeof data.card_select == "undefined" || typeof data.card_select != "undefined" && data.card_select == '0'))) {
                            _context2.next = 257;
                            break;
                        }

                        if (!(typeof data.payment_token != "undefined" && data.payment_token != '')) {
                            _context2.next = 257;
                            break;
                        }

                        console.log('data.payment_token = ', data.payment_token);
                        //TEST credit card payment
                        _context2.next = 222;
                        return page.focus(form_credit_card_payment + ' tr.input_card_number_ec > td > div.form_group_ec > #view-input-card-number > p:nth-child(4) > #input-cc-number');

                    case 222:
                        _context2.next = 224;
                        return page.keyboard.type('411111111111' + data.card_number);

                    case 224:
                        _context2.next = 226;
                        return page.focus(form_credit_card_payment + ' tr.input_card_name_ec > td > div.form_group_ec > #input-cc-name');

                    case 226:
                        _context2.next = 228;
                        return page.keyboard.type(data.card_name);

                    case 228:
                        card_m = form_credit_card_payment + ' tr.input_card_expiration_ec > td > div.form_group_ec > p > #input-cc-month';
                        _context2.next = 231;
                        return page.focus(card_m);

                    case 231:
                        _context2.next = 233;
                        return page.select(card_m, data.card_month);

                    case 233:
                        card_y = form_credit_card_payment + ' tr.input_card_expiration_ec > td > div.form_group_ec > p > #input-cc-year';
                        _context2.next = 236;
                        return page.focus(card_y);

                    case 236:
                        _context2.next = 238;
                        return page.select(card_y, data.card_year);

                    case 238:
                        _context2.next = 240;
                        return page.waitFor(3500);

                    case 240:
                        token_elm = 'form#new-view > #view-payment-information > #view-credit-card-information > input#input-cc-access-token';
                        _context2.next = 243;
                        return page.$eval(token_elm, function (el) {
                            return el.value;
                        });

                    case 243:
                        tmp_token = _context2.sent;

                        console.log("tmp_token", tmp_token);

                        _context2.next = 247;
                        return page.evaluate(function (token_elm) {
                            document.querySelector(token_elm).setAttribute('type', 'text');
                        }, token_elm);

                    case 247:
                        _context2.next = 249;
                        return page.focus(token_elm);

                    case 249:
                        _context2.next = 251;
                        return page.evaluate(function (token_elm) {
                            document.querySelector(token_elm).value = '';
                        }, token_elm);

                    case 251:
                        _context2.next = 253;
                        return page.keyboard.type(data.payment_token);

                    case 253:
                        _context2.next = 255;
                        return page.$eval(token_elm, function (el) {
                            return el.value;
                        });

                    case 255:
                        tmp_token2 = _context2.sent;

                        console.log("tmp_token2", tmp_token2);

                    case 257:
                        if (!(data.product_code === product_code_426)) {
                            _context2.next = 295;
                            break;
                        }

                        _context2.next = 260;
                        return page.focus('form#new-view > #view-payment-schedule > #container_payment_schedule > #container_delivery_schedule_by_term > table > tbody > tr > td > div.form_group_ec > p > #select_scheduled_to_be_delivered_every_x_day');

                    case 260:
                        shipping_cycle_option = 'form#new-view > #view-payment-schedule > #container_payment_schedule > #container_delivery_schedule_by_term > table > tbody > tr > td > div.form_group_ec > p > #select_scheduled_to_be_delivered_every_x_day > option';
                        shipping_cycle_id = 'form#new-view > #view-payment-schedule > #container_payment_schedule > #container_delivery_schedule_by_term > table > tbody > tr > td > div.form_group_ec > p > #select_scheduled_to_be_delivered_every_x_day';
                        _context2.next = 264;
                        return page.$$(shipping_cycle_option);

                    case 264:
                        shipping_cycles = _context2.sent;
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context2.prev = 268;
                        _iterator3 = shipping_cycles[Symbol.iterator]();

                    case 270:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context2.next = 281;
                            break;
                        }

                        shipping_cycle = _step3.value;
                        _context2.next = 274;
                        return page.evaluate(function (el) {
                            return el.value;
                        }, shipping_cycle);

                    case 274:
                        _item_val = _context2.sent;

                        if (!(data.shipping_cycle == _item_val)) {
                            _context2.next = 278;
                            break;
                        }

                        _context2.next = 278;
                        return page.select(shipping_cycle_id, _item_val);

                    case 278:
                        _iteratorNormalCompletion3 = true;
                        _context2.next = 270;
                        break;

                    case 281:
                        _context2.next = 287;
                        break;

                    case 283:
                        _context2.prev = 283;
                        _context2.t3 = _context2['catch'](268);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context2.t3;

                    case 287:
                        _context2.prev = 287;
                        _context2.prev = 288;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 290:
                        _context2.prev = 290;

                        if (!_didIteratorError3) {
                            _context2.next = 293;
                            break;
                        }

                        throw _iteratorError3;

                    case 293:
                        return _context2.finish(290);

                    case 294:
                        return _context2.finish(287);

                    case 295:
                        if (!(data.screen_short_flg === 1)) {
                            _context2.next = 298;
                            break;
                        }

                        _context2.next = 298;
                        return page.pdf({ path: 'screen_short/medium' + Date.now() + '.pdf', format: 'A4', printBackground: true });

                    case 298:
                        _context2.next = 300;
                        return page.waitFor(1000);

                    case 300:
                        _context2.next = 302;
                        return page.$(form_seletor + ' tr.input_email_ec > td > div.form_group_ec > div.emailformError');

                    case 302:
                        _context2.t4 = _context2.sent;

                        if (!(_context2.t4 !== null)) {
                            _context2.next = 308;
                            break;
                        }

                        response.error_message = 'メールアドレスは既に登録済みです。';
                        res.status(500).json(response);
                        _context2.next = 364;
                        break;

                    case 308:
                        // await page.pdf({path: 'screen_short/medium'+ Date.now() +'.pdf', format: 'A4', printBackground: true});
                        //submit form
                        console.log("start_submit");
                        _context2.next = 311;
                        return Promise.all([page.click('form#new-view > div.submit_ec > center > #submit'), page.waitForNavigation()]);

                    case 311:
                        console.log("end_submit");
                        // await page.click('form#new-view > div.submit_ec > center > #submit');
                        // await page.waitFor(1000);
                        _context2.next = 314;
                        return page.evaluate('location.href');

                    case 314:
                        shopping_confirm_url = _context2.sent;


                        console.log('after submit', shopping_confirm_url);
                        // await page.pdf({path: 'screen_short/medium'+ Date.now() +'.pdf', format: 'A4', printBackground: true});

                        if (!(shopping_confirm_url != shopping_nonmember_url)) {
                            _context2.next = 351;
                            break;
                        }

                        //submit form
                        console.log('start click order');
                        _context2.next = 320;
                        return Promise.all([page.click('div#confirm-view > div.form_container_ec > div.form_confirm_ec > div.block_ec > div.confirm_content_ec > div.center_ec > form.form_inline_ec > input#submit'), page.waitForNavigation()]);

                    case 320:
                        console.log('end click order');

                        _context2.next = 323;
                        return page.evaluate('location.href');

                    case 323:
                        thank_url = _context2.sent;

                        console.log('thank_url = ', thank_url);

                        if (!(thank_url.indexOf('complete') != -1)) {
                            _context2.next = 336;
                            break;
                        }

                        console.log("order success");
                        _context2.next = 329;
                        return page.$eval('div.perform_content_ec > table.table_ec > tbody > tr > td#order-number', function (el) {
                            return el.innerText;
                        });

                    case 329:
                        order_id = _context2.sent;

                        //update puppeteer step2
                        puppeteerRequest.findOneAndUpdate({ _id: idObject }, {
                            $set: {
                                status: 1,
                                url: shopping_confirm_url,
                                response_body: 'DONE',
                                updated_at: new Date()
                            }
                        }, { upsert: false, multi: false }, function (err, result) {
                            if (err) throw err;
                        });
                        response.success = 1;
                        response.order_id = order_id;
                        res.status(200).json(response);
                        _context2.next = 349;
                        break;

                    case 336:
                        console.log("order error");
                        error_message = "order error";
                        error_elm = 'form#new-view > #alert-box > p';
                        _context2.next = 341;
                        return page.$(error_elm);

                    case 341:
                        _context2.t5 = _context2.sent;

                        if (!(_context2.t5 !== null)) {
                            _context2.next = 346;
                            break;
                        }

                        _context2.next = 345;
                        return page.$eval(error_elm, function (el) {
                            return el.innerText;
                        });

                    case 345:
                        error_message = _context2.sent;

                    case 346:
                        puppeteerRequest.findOneAndUpdate({ _id: idObject }, {
                            $set: {
                                status: 3,
                                url: shopping_confirm_url,
                                error_message: error_message,
                                response_body: 'ERROR',
                                updated_at: new Date()
                            }
                        }, { upsert: false, multi: false }, function (err, result) {
                            if (err) throw err;
                        });
                        response.error_message = error_message;
                        res.status(500).json(response);

                    case 349:
                        _context2.next = 364;
                        break;

                    case 351:
                        console.log("入力に不備があります。");
                        error_message = "入力に不備があります。";
                        _error_elm = 'form#new-view > #alert-box > p';
                        _context2.next = 356;
                        return page.$(_error_elm);

                    case 356:
                        _context2.t6 = _context2.sent;

                        if (!(_context2.t6 !== null)) {
                            _context2.next = 361;
                            break;
                        }

                        _context2.next = 360;
                        return page.$eval(_error_elm, function (el) {
                            return el.innerText;
                        });

                    case 360:
                        error_message = _context2.sent;

                    case 361:
                        puppeteerRequest.findOneAndUpdate({ _id: idObject }, {
                            $set: {
                                status: 3,
                                url: shopping_nonmember_url,
                                error_message: error_message,
                                updated_at: new Date()
                            }
                        }, { upsert: false, multi: false }, function (err, result) {
                            if (err) throw err;
                        });
                        response.error_message = error_message;
                        res.status(500).json(response);

                    case 364:
                        _context2.next = 374;
                        break;

                    case 366:
                        _context2.prev = 366;
                        _context2.t7 = _context2['catch'](9);

                        console.log('Confirm exception', _context2.t7);
                        exception_index_1 = {
                            cpid: data.connect_page_id,
                            user_id: data.user_id,
                            status: 3,
                            error_message: _context2.t7,
                            index: 1,
                            param: data
                        };

                        puppeteerRequest.findOneAndUpdate({ _id: idObject }, {
                            $set: {
                                status: 3,
                                url: data.url,
                                error_message: _context2.t7,
                                updated_at: new Date()
                            }
                        }, { upsert: false, multi: false }, function (err, result) {
                            if (err) throw err;
                        });
                        savePuppeteerException(exception_index_1);
                        response.error_message = "エラーが発生しました。再度ご試しください。";
                        res.status(500).json(response);

                    case 374:
                        _context2.next = 376;
                        return browser.close();

                    case 376:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, _this2, [[9, 366], [58, 76, 80, 88], [81,, 83, 87], [147, 165, 169, 177], [170,, 172, 176], [268, 283, 287, 295], [288,, 290, 294]]);
    }))();
}

function checkPreviousStep(body, data, res) {
    var intervalObject = setInterval(function () {
        puppeteerRequest.findOne({ cpid: data.connect_page_id, user_id: data.user_id, index: 1, status: 1 }, function (err, result) {
            if (result) {
                clearInterval(intervalObject);
                puppeteerRequest.findOne({ cpid: data.connect_page_id, user_id: data.user_id, index: 2, status: 0 }, function (err, result2) {
                    if (result2) {
                        var cookie = result2.param.cookie;
                        var idObject = result2._id;
                        data.shopping_confirm_url = result2.url;
                        result2.status = 2;
                        result2.updated_at = new Date();
                        result2.request_body = body;
                        result2.save(function (err) {
                            if (err) throw err;
                            executeOrder(idObject, cookie, data, res);
                        });
                    }
                });
            }
        });
    }, 2000);
}

function executeOrder(idObject, cookie, data, res) {
    var _this3 = this;

    var response = {};
    (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var browser, page, error_message, cookie_new, shopping_confirm_url, error_elm, thank_url, _error_elm2, exception_index_2;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return puppeteer.launch({
                            args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process']
                        });

                    case 2:
                        browser = _context3.sent;
                        _context3.next = 5;
                        return browser.newPage();

                    case 5:
                        page = _context3.sent;
                        _context3.next = 8;
                        return page.setRequestInterception(true);

                    case 8:
                        page.on('request', function (request) {
                            //console.log(request.resourceType());
                            var rtype = request.resourceType();
                            var request_url = request.url();
                            if (request_url.indexOf("google") !== -1 || request_url.indexOf("ladsp") !== -1 || request_url.indexOf("yahoo") !== -1 || request_url.indexOf("socdm") !== -1 || request_url.indexOf("facebook") !== -1 || request_url.indexOf("kozuchi") !== -1 || request_url.indexOf("kozuchi") !== -1) {
                                request.continue().catch(function (err) {
                                    return console.error("");
                                });
                            } else if (rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype === 'script' || request.url().indexOf("organic") == -1) {
                                request.abort().catch(function (err) {
                                    return console.error("");
                                });
                            } else {
                                console.log(request.url());
                                request.continue().catch(function (err) {
                                    return console.error("");
                                });
                            }
                        });

                        _context3.prev = 9;

                        if (!(typeof cookie != "undefined" && Array.isArray(cookie) && cookie.length > 0)) {
                            _context3.next = 67;
                            break;
                        }

                        console.log('start order');
                        error_message = '';
                        cookie_new = [];
                        //const page = await browser.newPage();

                        shopping_confirm_url = data.shopping_confirm_url;

                        cookie.forEach(function (element) {
                            element.url = shopping_confirm_url;
                            cookie_new.push(element);
                        });

                        _context3.next = 18;
                        return page.setCookie.apply(page, cookie_new);

                    case 18:
                        _context3.next = 20;
                        return page.goto(shopping_confirm_url, { waitUntil: 'networkidle0' });

                    case 20:
                        if (!(data.screen_short_flg === 1)) {
                            _context3.next = 23;
                            break;
                        }

                        _context3.next = 23;
                        return page.pdf({ path: 'screen_short/order_' + Date.now() + '.pdf', format: 'A4', printBackground: true });

                    case 23:
                        //check url confirm
                        console.log('page url =', page.url());

                        if (!(page.url() !== shopping_confirm_url)) {
                            _context3.next = 38;
                            break;
                        }

                        error_message = "Common error";
                        error_elm = 'form#new-view > #alert-box > p';
                        _context3.next = 29;
                        return page.$(error_elm);

                    case 29:
                        _context3.t0 = _context3.sent;

                        if (!(_context3.t0 !== null)) {
                            _context3.next = 34;
                            break;
                        }

                        _context3.next = 33;
                        return page.$eval(error_elm, function (el) {
                            return el.innerText;
                        });

                    case 33:
                        error_message = _context3.sent;

                    case 34:
                        response.error_message = error_message;
                        _context3.next = 37;
                        return browser.close();

                    case 37:
                        return _context3.abrupt('return', res.status(500).json(response));

                    case 38:
                        _context3.next = 40;
                        return Promise.all([page.click('div#confirm-view > div.form_container_ec > div.form_confirm_ec > div.block_ec > div.confirm_content_ec > div.center_ec > form.form_inline_ec > input#submit'), page.waitForNavigation()]);

                    case 40:
                        console.log('end order');
                        _context3.next = 43;
                        return page.evaluate('location.href');

                    case 43:
                        thank_url = _context3.sent;

                        console.log('thank_url = ', thank_url);

                        if (!(thank_url.indexOf('complete') != -1)) {
                            _context3.next = 52;
                            break;
                        }

                        console.log("order success");
                        //update puppeteer step2
                        puppeteerRequest.findOneAndUpdate({ _id: idObject }, {
                            $set: {
                                status: 1,
                                url: shopping_confirm_url,
                                response_body: 'DONE',
                                updated_at: new Date()
                            }
                        }, { upsert: false, multi: false }, function (err, result) {
                            if (err) throw err;
                        });
                        response.success = 1;
                        res.status(200).json(response);
                        _context3.next = 65;
                        break;

                    case 52:
                        console.log("order error");
                        error_message = "order error";
                        _error_elm2 = 'form#new-view > #alert-box > p';
                        _context3.next = 57;
                        return page.$(_error_elm2);

                    case 57:
                        _context3.t1 = _context3.sent;

                        if (!(_context3.t1 !== null)) {
                            _context3.next = 62;
                            break;
                        }

                        _context3.next = 61;
                        return page.$eval(_error_elm2, function (el) {
                            return el.innerText;
                        });

                    case 61:
                        error_message = _context3.sent;

                    case 62:
                        puppeteerRequest.findOneAndUpdate({ _id: idObject }, {
                            $set: {
                                status: 3,
                                url: shopping_confirm_url,
                                error_message: error_message,
                                response_body: 'ERROR',
                                updated_at: new Date()
                            }
                        }, { upsert: false, multi: false }, function (err, result) {
                            if (err) throw err;
                        });
                        response.error_message = error_message;
                        res.status(500).json(response);

                    case 65:
                        _context3.next = 71;
                        break;

                    case 67:
                        console.log("Session expired.");
                        puppeteerRequest.findOneAndUpdate({ _id: idObject }, {
                            $set: {
                                status: 3,
                                error_message: "Session expired",
                                updated_at: new Date()
                            }
                        }, { upsert: false, multi: false }, function (err, result) {
                            if (err) throw err;
                        });

                        response.error_message = "エラーが発生しました。再度ご試しください。";
                        res.status(500).json(response);

                    case 71:
                        _context3.next = 81;
                        break;

                    case 73:
                        _context3.prev = 73;
                        _context3.t2 = _context3['catch'](9);

                        console.log('Order exception', _context3.t2);
                        exception_index_2 = {
                            cpid: data.connect_page_id,
                            user_id: data.user_id,
                            status: 3,
                            error_message: _context3.t2,
                            index: 2,
                            param: data
                        };

                        puppeteerRequest.findOneAndUpdate({ _id: idObject }, {
                            $set: {
                                status: 3,
                                error_message: _context3.t2,
                                updated_at: new Date()
                            }
                        }, { upsert: false, multi: false }, function (err, result) {
                            if (err) throw err;
                        });
                        savePuppeteerException(exception_index_2);
                        response.error_message = "エラーが発生しました。再度ご試しください。";
                        res.status(500).json(response);

                    case 81:
                        _context3.next = 83;
                        return browser.close();

                    case 83:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, _this3, [[9, 73]]);
    }))();
}

router.post('/get_payment_card', function (req, res, next) {
    console.time("get_payment_card");
    var body = req.body;
    var connect_page_id = body.cpid;
    var user_id = body.user_id;
    var url_card = body.url_card;

    var data = {
        connect_page_id: connect_page_id,
        user_id: user_id,
        url_card: url_card
    };
    console.log('body', body);
    var response = {};
    puppeteerRequest.findOne({ cpid: connect_page_id, user_id: user_id, index: 0, status: 1 }, function (err, result) {
        //console.log(result);
        if (result) {
            data.cookie = result.param.cookie;
            data.object_id = result._id;
            organicGetPaymentCard(data, res);
        } else {
            response.count = 0;
            res.status(200).json(response);
        }
    });

    console.timeEnd("get_payment_card");
});

function organicGetPaymentCard(data, res) {
    var _this4 = this;

    var cookie = data.cookie;
    //console.log("start organicGetPaymentCard", data);
    var response = {};
    (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var browser, page, cookie_new1, header_element, customer_edit_element, result_json, list, table_element, rows, i, row, card_name_element, card_code_element, card_name, card_name_value, url, card_code, exception_index_3;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return puppeteer.launch({
                            args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process']
                        });

                    case 2:
                        browser = _context4.sent;
                        _context4.next = 5;
                        return browser.newPage();

                    case 5:
                        page = _context4.sent;
                        _context4.next = 8;
                        return page.setRequestInterception(true);

                    case 8:
                        page.on('request', function (request) {
                            //console.log(request.resourceType());
                            var rtype = request.resourceType();
                            var request_url = request.url();
                            if (request_url.indexOf("google") !== -1 || request_url.indexOf("ladsp") !== -1 || request_url.indexOf("yahoo") !== -1 || request_url.indexOf("socdm") !== -1 || request_url.indexOf("facebook") !== -1 || request_url.indexOf("kozuchi") !== -1 || request_url.indexOf("kozuchi") !== -1) {
                                request.continue().catch(function (err) {
                                    return console.error("");
                                });
                            } else if (rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype === 'script' || request.url().indexOf("organic") == -1) {
                                request.abort().catch(function (err) {
                                    return console.error("");
                                });
                            } else {
                                //console.log(request.url());
                                request.continue().catch(function (err) {
                                    return console.error("");
                                });
                            }
                        });
                        //await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                        _context4.prev = 9;

                        if (!(typeof cookie != "undefined" && cookie != '')) {
                            _context4.next = 60;
                            break;
                        }

                        cookie.url = data.url_card;
                        //await page.setCookie(cookie);
                        cookie_new1 = [];

                        cookie.forEach(function (element) {
                            element.url = data.url_card;
                            cookie_new1.push(element);
                        });
                        _context4.next = 16;
                        return page.setCookie.apply(page, cookie_new1);

                    case 16:
                        _context4.next = 18;
                        return page.goto(data.url_card, { waitUntil: 'networkidle0' });

                    case 18:
                        header_element = ".ncontainer > .content-right > .breadcrumb > li:nth-child(2) > span";
                        _context4.next = 21;
                        return page.waitForSelector(header_element);

                    case 21:
                        customer_edit_element = "body > main > div > div.nav-customer.mb-40 > a:nth-child(8)";
                        _context4.next = 24;
                        return Promise.all([page.click(customer_edit_element), page.waitForNavigation()]);

                    case 24:
                        //await page.screenshot({path: 'pictures/' + 'login_' + Date.now() + '.png', fullPage: true});
                        result_json = {
                            type: "006",
                            name: 'pulldown_time',
                            data: []
                        };
                        list = [];
                        table_element = '.content-right > #customers-card-index-view > div.table-responsive > table.table > tbody > tr';
                        _context4.next = 29;
                        return page.$$(table_element);

                    case 29:
                        rows = _context4.sent;
                        i = 2;

                    case 31:
                        if (!(i <= rows.length)) {
                            _context4.next = 51;
                            break;
                        }

                        row = '.content-right > #customers-card-index-view > div.table-responsive > table.table > tbody > tr:nth-child(' + i + ')';
                        card_name_element = row + ' > td:nth-child(1)';
                        card_code_element = row + '> td:nth-child(6) > a:nth-child(2)';
                        _context4.next = 37;
                        return page.$(card_name_element);

                    case 37:
                        card_name = _context4.sent;
                        _context4.next = 40;
                        return card_name.getProperty('textContent');

                    case 40:
                        _context4.next = 42;
                        return _context4.sent.jsonValue();

                    case 42:
                        card_name_value = _context4.sent;
                        _context4.next = 45;
                        return page.$eval(card_code_element, function (a) {
                            return a.href;
                        });

                    case 45:
                        url = _context4.sent;
                        card_code = splitCardUrl(url);
                        //console.log("card_name", card_name);
                        //console.log("card_code", card_code);

                        list.push({
                            value: card_code,
                            text: card_name_value
                        });

                    case 48:
                        i++;
                        _context4.next = 31;
                        break;

                    case 51:

                        console.log("list=", list);
                        response.count = list.length;

                        if (list.length < 5) {
                            list.push({
                                value: "0",
                                text: '新しく登録する'
                            });
                        }

                        result_json['data'] = list;
                        console.log("response=", result_json);
                        response.data = result_json;

                        res.status(200).json(response);
                        _context4.next = 62;
                        break;

                    case 60:
                        response.error_message = "エラーが発生しました。再度ご試しください。";
                        res.status(500).json(response);

                    case 62:
                        _context4.next = 71;
                        break;

                    case 64:
                        _context4.prev = 64;
                        _context4.t0 = _context4['catch'](9);

                        console.log("organicGetPaymentCard exception", _context4.t0);
                        exception_index_3 = {
                            cpid: data.connect_page_id,
                            user_id: data.user_id,
                            status: 3,
                            error_message: _context4.t0,
                            param: data
                        };

                        savePuppeteerException(exception_index_3);
                        response.error_message = "エラーが発生しました。再度ご試しください。";
                        res.status(500).json(response);

                    case 71:
                        _context4.next = 73;
                        return browser.close();

                    case 73:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, _this4, [[9, 64]]);
    }))();
}

router.post('/validate_mail', function (req, res, next) {
    var _this5 = this;

    console.log("start validate_mail");
    var body = req.body;
    var mail = body.mail;
    var url = body.url;
    console.log("======body====", body);
    var response = {};
    (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var browser, page, header_element, name1, name2, katakana1, katakana2, zip01, zip02, pref, addr01, addr02, addr03, tel01, tel02, tel03, customer_sex, year, month, day, password_first, password_second, magazine, mail_element, mail_confirm_element, error_text, error_element, total_err, validate_flg, i, row, _error_element, error_value;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return puppeteer.launch({
                            args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process']
                        });

                    case 2:
                        browser = _context5.sent;
                        _context5.next = 5;
                        return browser.newPage();

                    case 5:
                        page = _context5.sent;
                        _context5.next = 8;
                        return page.setRequestInterception(true);

                    case 8:
                        page.on('request', function (request) {
                            var rtype = request.resourceType();
                            var request_url = request.url();
                            if (request_url.indexOf("google") !== -1 || request_url.indexOf("ladsp") !== -1 || request_url.indexOf("yahoo") !== -1 || request_url.indexOf("socdm") !== -1 || request_url.indexOf("facebook") !== -1 || request_url.indexOf("kozuchi") !== -1 || request_url.indexOf("kozuchi") !== -1) {
                                request.continue().catch(function (err) {
                                    return console.error("");
                                });
                            } else if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype == "script") {
                                request.abort();
                            } else {
                                console.log(rtype);
                                if (rtype == "document") {
                                    if (request.url().indexOf("organic") !== -1) {
                                        console.log(request.url());
                                        request.continue();
                                    } else {
                                        request.abort();
                                    }
                                } else {
                                    console.log(request.url());
                                    request.continue();
                                }
                            }
                        });
                        _context5.prev = 9;

                        console.log("url", url);
                        _context5.next = 13;
                        return page.goto(url, { waitUntil: 'load' });

                    case 13:
                        header_element = ".ncontainer > .content-right > .breadcrumb > li:nth-child(2) > span";
                        _context5.next = 16;
                        return page.waitForSelector(header_element);

                    case 16:
                        name1 = '#new_customer > div > div:nth-child(1) > div > div > div:nth-child(1) > input';
                        name2 = '#new_customer > div > div:nth-child(1) > div > div > div:nth-child(2) > input';
                        katakana1 = '#new_customer > div > div:nth-child(2) > div > div > div:nth-child(1) > #customer_billing_address_attributes_kana01';
                        katakana2 = '#new_customer > div > div:nth-child(2) > div > div > div:nth-child(2) > #customer_billing_address_attributes_kana02';
                        zip01 = '#new_customer > div > div:nth-child(3) > div > div.form-inline > #customer_billing_address_attributes_zip01';
                        zip02 = '#new_customer > div > div:nth-child(3) > div > div.form-inline > #customer_billing_address_attributes_zip02';
                        pref = '#new_customer > div > div:nth-child(4) > div > #customer_billing_address_attributes_prefecture_name';
                        addr01 = '#new_customer > div > div:nth-child(5) > div > #customer_billing_address_attributes_addr01';
                        addr02 = '#new_customer > div > div:nth-child(6) > div > #customer_billing_address_attributes_addr02';
                        addr03 = '#new_customer > div > div:nth-child(7) > div > #customer_billing_address_attributes_addr03';
                        tel01 = '#new_customer > div > div:nth-child(8) > div > div > #customer_billing_address_attributes_tel01';
                        tel02 = '#new_customer > div > div:nth-child(8) > div > div > #customer_billing_address_attributes_tel02';
                        tel03 = '#new_customer > div > div:nth-child(8) > div > div > #customer_billing_address_attributes_tel03';
                        customer_sex = '#new_customer > div > div:nth-child(11) > div > #customer_sex_id';
                        year = '#new_customer > div > div:nth-child(13) > div > div > #customer_birth_1i';
                        month = '#new_customer > div > div:nth-child(13) > div > div > #customer_birth_2i';
                        day = '#new_customer > div > div:nth-child(13) > div > div > #customer_birth_3i';
                        password_first = '#new_customer > div > div:nth-child(14) > div > #customer_password';
                        password_second = '#new_customer > div > div:nth-child(15) > div > #customer_password_confirmation';
                        magazine = '#new_customer > div > div:nth-child(16) > div > #customer_optin';
                        mail_element = '#new_customer > div > div:nth-child(9) > div > #customer_email';
                        mail_confirm_element = '#new_customer > div > div:nth-child(10) > div > #customer_email_confirmation';

                        // remove class require

                        _context5.next = 40;
                        return page.evaluate(function (name1, name2, katakana1, katakana2, zip01, zip02, pref, addr01, addr02, addr03, tel01, tel02, tel03, customer_sex, year, month, day, password_first, password_second, magazine) {
                            document.querySelector(name1).classList.remove('validate[required]');
                            document.querySelector(name2).classList.remove('validate[required]');
                            document.querySelector(katakana1).classList.remove('validate[required,custom[katakana]]');
                            document.querySelector(katakana2).classList.remove('validate[required,custom[katakana]]');
                            document.querySelector(zip01).classList.remove('validate[required,custom[integer],minSize[3]]');
                            document.querySelector(zip02).classList.remove('validate[required,custom[integer],minSize[4]]');
                            document.querySelector(pref).classList.remove('validate[required]');
                            document.querySelector(addr01).classList.remove('validate[required]');
                            document.querySelector(addr02).classList.remove('validate[required]');
                            document.querySelector(addr03).classList.remove('validate[required]');
                            document.querySelector(tel01).classList.remove('validate[required,custom[integer]]');
                            document.querySelector(tel02).classList.remove('validate[required,custom[integer]]');
                            document.querySelector(tel03).classList.remove('validate[required,custom[integer]]');
                            document.querySelector(customer_sex).classList.remove('validate[required]');
                            document.querySelector(year).classList.remove('validate[required]');
                            document.querySelector(month).classList.remove('validate[required]');
                            document.querySelector(day).classList.remove('validate[required]');
                            document.querySelector(password_first).classList.remove('validate[required,minSize[8]]');
                            document.querySelector(password_second).classList.remove('validate[required,equals[customer_password]]');
                            document.querySelector(magazine).classList.remove('validate[required]');
                        }, name1, name2, katakana1, katakana2, zip01, zip02, pref, addr01, addr02, addr03, tel01, tel02, tel03, customer_sex, year, month, day, password_first, password_second, magazine);

                    case 40:
                        _context5.next = 42;
                        return page.click(mail_element);

                    case 42:
                        _context5.next = 44;
                        return page.focus(mail_element);

                    case 44:
                        _context5.next = 46;
                        return page.evaluate(function (mail_element) {
                            document.querySelector(mail_element).value = '';
                        }, mail_element);

                    case 46:
                        _context5.next = 48;
                        return page.keyboard.type(mail);

                    case 48:
                        _context5.next = 50;
                        return page.click(mail_confirm_element);

                    case 50:
                        _context5.next = 52;
                        return page.focus(mail_confirm_element);

                    case 52:
                        _context5.next = 54;
                        return page.evaluate(function (mail_confirm_element) {
                            document.querySelector(mail_confirm_element).value = '';
                        }, mail_confirm_element);

                    case 54:
                        _context5.next = 56;
                        return page.keyboard.type(mail);

                    case 56:

                        //validate
                        error_text = "メールアドレスは既に登録済みです。";
                        error_element = '#new_customer > div.alert.alert-danger > p.text';
                        _context5.next = 60;
                        return page.click('#new_customer > div > div:nth-child(17) > div > input');

                    case 60:
                        _context5.next = 62;
                        return page.waitForSelector(error_element);

                    case 62:
                        _context5.next = 64;
                        return page.screenshot({ path: 'pictures/login1111' + Date.now() + '.png', fullPage: true });

                    case 64:
                        _context5.next = 66;
                        return page.$$(error_element);

                    case 66:
                        total_err = _context5.sent;
                        validate_flg = false;

                        console.log(total_err.length);
                        i = 1;

                    case 70:
                        if (!(i <= total_err.length)) {
                            _context5.next = 87;
                            break;
                        }

                        row = '#new_customer > div.alert.alert-danger > p:nth-child(' + i + ')';
                        _context5.next = 74;
                        return page.$(row);

                    case 74:
                        _error_element = _context5.sent;
                        _context5.next = 77;
                        return _error_element.getProperty('textContent');

                    case 77:
                        _context5.next = 79;
                        return _context5.sent.jsonValue();

                    case 79:
                        error_value = _context5.sent;

                        console.log("error_value=", error_value);

                        if (!(error_value == error_text)) {
                            _context5.next = 84;
                            break;
                        }

                        validate_flg = true;
                        return _context5.abrupt('break', 87);

                    case 84:
                        i++;
                        _context5.next = 70;
                        break;

                    case 87:

                        console.log(validate_flg);
                        if (validate_flg) {
                            response.error_message = 'メールアドレスは既に登録済みです。';
                            res.status(500).json(response);
                        } else {
                            response.message = 'success';
                            res.status(200).json(response);
                        }
                        _context5.next = 96;
                        break;

                    case 91:
                        _context5.prev = 91;
                        _context5.t0 = _context5['catch'](9);

                        console.log(_context5.t0);
                        response.error_message = "エラーが発生しました。再度ご試しください。";
                        res.status(500).json(response);

                    case 96:
                        _context5.next = 98;
                        return browser.close();

                    case 98:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, _this5, [[9, 91]]);
    }))();
});

router.post('/getPrice', function (req, res, next) {
    console.log("start getPrice");
    var body = req.body;
    console.log(body);
    var product_code = body.product_code;
    var payment_type = body.payment_type;
    var product_unit_price = 0;
    var response = {};
    var tax = 8;
    var total = 0;
    var order_settlement_fee = 0;
    var order_shipping_fee = 0;
    if (payment_type == "1") {} else {
        order_settlement_fee = 259;
        total += order_settlement_fee;
    }
    if (product_code == "426" || product_code == "417") {
        product_unit_price = 980;
        total += product_unit_price;
    } else if (product_code == "235") {
        product_unit_price = 3300;
        order_shipping_fee = 600;
        total += product_unit_price + order_shipping_fee;
    }

    var order_tax = Math.floor(total * tax / 100);
    var order_total_amount = total + order_tax;

    response.product_unit_price = product_unit_price;
    response.product_quantity = 1;
    response.order_amount = product_unit_price;
    response.order_shipping_fee = order_shipping_fee;
    response.order_settlement_fee = order_settlement_fee;
    response.order_tax = order_tax;
    response.order_total_amount = order_total_amount;
    response.delivery_company = "佐川急便";
    console.log(response);
    res.status(200).json(response);
});

function splitZipcode(zipcode) {
    var result = {
        zipcode1: '',
        zipcode2: ''
    };
    if (typeof zipcode != "undefined" && zipcode) {
        result['zipcode1'] = zipcode.slice(0, 3);
        result['zipcode2'] = zipcode.slice(3, 8);
    }
    return result;
}

function splitPhoneNumber(phone_number) {
    var result = {
        phone1: '',
        phone2: '',
        phone3: ''
    };
    if (typeof phone_number != "undefined" && phone_number != '') {
        var phone_arr = phone_number.split("-");
        if (phone_arr.length == 3) {
            result['phone1'] = phone_arr[0];
            result['phone2'] = phone_arr[1];
            result['phone3'] = phone_arr[2];
        }
    }
    return result;
}

function splitBirthday(birth_day) {
    var result = {
        year: '',
        month: '',
        day: ''
    };
    if (typeof birth_day != "undefined" && birth_day != '') {
        var date = new Date(birth_day);
        result['year'] = date.getFullYear();
        result['month'] = date.getMonth() + 1;
        result['day'] = date.getDate();
    }
    return result;
}

function getCookieGest(arr) {
    if (arr) {
        var result = [];
        arr.forEach(function (element) {
            if ((element.name == 'guest_token' || element.name == '_ec_force_session') && element.value != '') {
                result.push({
                    name: element.name,
                    value: element.value
                });
            }
        });
        return result;
    }
    return false;
}

function getCookieFormDb(cookie, url) {
    var cookie_new1 = [];
    cookie.forEach(function (element) {
        element.url = url;
        cookie_new1.push(element);
    });
    return cookie_new1;
}

function savePuppeteerException(data) {
    var exception_data = new puppeteerException(data);
    exception_data.save(function (err) {});
}

function splitCardUrl(url) {
    if (url) {
        var result = [];
        result = url.split("/");
        return result.slice(-1)[0];
    }
}

module.exports = router;