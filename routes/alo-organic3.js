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

    //console.log('body', body);
    //var login_type =  body.login_type;
    var response = {};
    if (typeof mail == "undefined" || mail == '' || typeof password == "undefined" || password == '' || typeof connect_page_id == "undefined" || connect_page_id == '' || typeof user_id == "undefined" || user_id == '') {
        response.error_message = "Input data is empty.";
        return res.status(500).json(response);
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
        var browser, page, header_element, curren_login_header, cookiesObject, cookie, email_element, password_element, new_login_header, customer_edit_element, name_element, furigana_element, zipcode_element, phone_element, name_value, furigana_value, zipcode, phone, prefecture_element, address1_element, address2_element, address3_element, email_element1, gender_element, profession_element, year_element, month_element, day_element, magazine_element, prefecture_value, address1_value, address2_value, address3_value, email_value, gender_value, profession_value, year_value, month_value, day_value, magazine_value, birth_day, address, _cookiesObject, error_message, exception_index_3;

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
                        _context.next = 35;
                        return page.evaluate(function (email_element, password_element) {
                            document.querySelector(email_element).value = '';
                            document.querySelector(password_element).value = '';
                        }, email_element, password_element);

                    case 35:
                        _context.next = 37;
                        return page.focus(email_element);

                    case 37:
                        _context.next = 39;
                        return page.keyboard.type(data.mail);

                    case 39:
                        _context.next = 41;
                        return page.focus(password_element);

                    case 41:
                        _context.next = 43;
                        return page.keyboard.type(data.password);

                    case 43:
                        _context.next = 45;
                        return Promise.all([page.click('#customers-sessions-sign-in-view > form:nth-child(3) > div:nth-child(7) > div > div > p > input'), page.waitForNavigation()]);

                    case 45:
                        _context.next = 47;
                        return page.$eval(header_element, function (el) {
                            return el.innerText;
                        });

                    case 47:
                        new_login_header = _context.sent;

                        console.log("new_login_header", new_login_header);

                        if (!(new_login_header == header_login_success)) {
                            _context.next = 133;
                            break;
                        }

                        // get user info
                        customer_edit_element = "body > main > div > div.nav-customer.mb-40 > a:nth-child(6)";
                        _context.next = 53;
                        return Promise.all([page.click(customer_edit_element), page.waitForNavigation()]);

                    case 53:
                        name_element = '#customer_form > div:nth-child(6) > div.col-md-9 > div.row > div:nth-child(1) > input';
                        furigana_element = '#customer_form > div:nth-child(7) > div > div > div:nth-child(1) > input';
                        zipcode_element = '#customer_form > div:nth-child(8) > div > div.form-inline > #customer_billing_address_attributes_zip01';
                        phone_element = '#customer_form > div:nth-child(13) > div > div > #customer_billing_address_attributes_tel01';
                        _context.next = 59;
                        return page.$eval(name_element, function (el) {
                            return el.value;
                        });

                    case 59:
                        name_value = _context.sent;
                        _context.next = 62;
                        return page.$eval(furigana_element, function (el) {
                            return el.value;
                        });

                    case 62:
                        furigana_value = _context.sent;
                        _context.next = 65;
                        return page.$eval(zipcode_element, function (el) {
                            return el.value;
                        });

                    case 65:
                        zipcode = _context.sent;
                        _context.next = 68;
                        return page.$eval(phone_element, function (el) {
                            return el.value;
                        });

                    case 68:
                        phone = _context.sent;

                        console.log('name', name_value);
                        console.log('furigana', furigana_value);
                        console.log('zipcode', zipcode);
                        console.log('phone', phone);

                        prefecture_element = '#customer_form > div:nth-child(9) > div > #customer_billing_address_attributes_prefecture_name';
                        address1_element = '#customer_form > div:nth-child(10) > div > input';
                        address2_element = '#customer_form > div:nth-child(11) > div > input';
                        address3_element = '#customer_form > div:nth-child(12) > div > input';
                        email_element1 = '#customer_form > div:nth-child(14) > div > #customer_email';
                        gender_element = '#customer_form > div:nth-child(15) > div > #customer_sex_id';
                        profession_element = '#customer_form > div:nth-child(16) > div > #customer_job_id';
                        year_element = '#customer_form > div:nth-child(17) > div > div > #customer_birth_1i';
                        month_element = '#customer_form > div:nth-child(17) > div > div > #customer_birth_2i';
                        day_element = '#customer_form > div:nth-child(17) > div > div > #customer_birth_3i';
                        magazine_element = '#customer_form > div:nth-child(18) > div > #customer_optin';
                        _context.next = 86;
                        return page.$eval(prefecture_element, function (el) {
                            return el.value;
                        });

                    case 86:
                        prefecture_value = _context.sent;
                        _context.next = 89;
                        return page.$eval(address1_element, function (el) {
                            return el.value;
                        });

                    case 89:
                        address1_value = _context.sent;
                        _context.next = 92;
                        return page.$eval(address2_element, function (el) {
                            return el.value;
                        });

                    case 92:
                        address2_value = _context.sent;
                        _context.next = 95;
                        return page.$eval(address3_element, function (el) {
                            return el.value;
                        });

                    case 95:
                        address3_value = _context.sent;
                        _context.next = 98;
                        return page.$eval(email_element1, function (el) {
                            return el.value;
                        });

                    case 98:
                        email_value = _context.sent;
                        _context.next = 101;
                        return page.$eval(gender_element, function (el) {
                            return el.value;
                        });

                    case 101:
                        gender_value = _context.sent;
                        _context.next = 104;
                        return page.$eval(profession_element, function (el) {
                            return el.value;
                        });

                    case 104:
                        profession_value = _context.sent;
                        _context.next = 107;
                        return page.$eval(year_element, function (el) {
                            return el.value;
                        });

                    case 107:
                        year_value = _context.sent;
                        _context.next = 110;
                        return page.$eval(month_element, function (el) {
                            return el.value;
                        });

                    case 110:
                        month_value = _context.sent;
                        _context.next = 113;
                        return page.$eval(day_element, function (el) {
                            return el.value;
                        });

                    case 113:
                        day_value = _context.sent;
                        _context.next = 116;
                        return page.$eval(magazine_element, function (el) {
                            return el.value;
                        });

                    case 116:
                        magazine_value = _context.sent;
                        birth_day = year_value + '-' + month_value + '-' + day_value;
                        address = prefecture_value + address1_value + address2_value + address3_value;
                        _context.next = 121;
                        return page.cookies();

                    case 121:
                        _cookiesObject = _context.sent;

                        console.log(_cookiesObject);
                        cookie = getCookieGest(_cookiesObject);

                        console.log(cookie);
                        data.cookie = cookie;
                        data.response = {
                            name: name_value,
                            furigana: furigana_value,
                            zipcode: zipcode,
                            prefecture: prefecture_value,
                            address1: address1_value,
                            address2: address2_value,
                            address3: address3_value,
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
                        _context.next = 137;
                        break;

                    case 133:
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

                    case 137:
                        _context.next = 146;
                        break;

                    case 139:
                        _context.prev = 139;
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

                    case 146:
                        _context.next = 148;
                        return browser.close();

                    case 148:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, _this, [[9, 139]]);
    }))();
}

/*fill info guest*/
router.post('/fill_info_guest', function (req, res, next) {
    console.time("time_guest");
    var body = req.body;

    var product_code = body.product_code;
    var first_name = body.first_name;
    var last_name = body.last_name;
    var furigana_first = body.furigana_first;
    var furigana_last = body.furigana_last;
    var zipcode = splitZipcode(body.zipcode);
    var pref = body.pref;
    var address01 = body.address01;
    var address02 = body.address02;
    var phone_number = splitPhoneNumber(body.phone_number);
    var mail = body.mail;
    var birthday = splitBirthday(body.birthday);
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
    var shipping_last_name = body.shipping_last_name;
    var shipping_first_name = body.shipping_first_name;
    var shipping_furigana_first = body.shipping_furigana_first;
    var shipping_furigana_last = body.shipping_furigana_last;
    var shipping_zipcode = splitZipcode(body.shipping_zipcode);
    var shipping_pref = body.shipping_pref;
    var shipping_address01 = body.shipping_address01;
    var shipping_address02 = body.shipping_address02;
    var shipping_phone_number = splitPhoneNumber(body.shipping_phone_number);
    var screen_short_flg = parseInt(body.screen_short_flg);
    /*alooganic 2*/
    var name = typeof body.name !== 'undefined' ? body.name : '';
    var furigana = typeof body.furigana !== 'undefined' ? body.furigana : '';
    var shipping_name = typeof body.shipping_name !== 'undefined' ? body.shipping_name : '';
    var shipping_furigana = typeof body.shipping_furigana !== 'undefined' ? body.shipping_furigana : '';

    var response = {};

    var now = new Date();

    var data = {
        url: body.url,
        login_flg: login_flg,
        product_code: product_code,
        first_name: first_name,
        last_name: last_name,
        furigana_first: furigana_first,
        furigana_last: furigana_last,
        zipcode: body.zipcode,
        zipcode1: zipcode.zipcode1,
        zipcode2: zipcode.zipcode2,
        pref: pref,
        address01: address01,
        address02: address02,
        mail: mail,
        phone_number: body.phone_number2,
        phone1: phone_number.phone1,
        phone2: phone_number.phone2,
        phone3: phone_number.phone3,
        year_bd: birthday.year,
        month_bd: birthday.month,
        day_bd: birthday.day,
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
        shipping_last_name: shipping_last_name,
        shipping_first_name: shipping_first_name,
        shipping_furigana_first: shipping_furigana_first,
        shipping_furigana_last: shipping_furigana_last,
        shipping_zipcode: body.shipping_zipcode,
        shipping_pref: shipping_pref,
        shipping_address01: shipping_address01,
        shipping_address02: shipping_address02,
        shipping_zipcode1: shipping_zipcode.zipcode1,
        shipping_zipcode2: shipping_zipcode.zipcode2,
        shipping_phone_number: body.shipping_phone_number2,
        shipping_phone1: shipping_phone_number.phone1,
        shipping_phone2: shipping_phone_number.phone2,
        shipping_phone3: shipping_phone_number.phone3,
        user_id: user_id,
        connect_page_id: connect_page_id,
        login_type: login_type,
        screen_short_flg: screen_short_flg,
        cookie: {
            name: '',
            value: ''
        },
        concat_flg: body.concat_flg,
        name: name,
        furigana: furigana,
        shipping_name: shipping_name,
        shipping_furigana: shipping_furigana
    };
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
        var browser, page, shopping_nonmember_url, cookie, cookie_new1, form_seletor, form_shipping, form_credit_card_payment, credit_card_number_element, credit_card_name_element, selector_option, selector_id, options, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, option, item_val, pef_option, pef_id, pefs, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, pef, item_text, address1_elm, year_bd_option, year_bd_id, years, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, year, month_bd_option, month_bd_id, months, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, month, day_bd_option, day_bd_id, days, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, day, shipping_type_elm, shipping_pef_option, shipping_pef_id, shipping_pefs, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, shipping_pef, _item_text, _item_val, shipping_address1_elm, payment_type_select, payment_type_element, card_m, card_y, token_elm, tmp_token, tmp_token2, shipping_cycle_option, shipping_cycle_id, shipping_cycles, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, shipping_cycle, _item_val2, shopping_confirm_url, thank_url, order_id, error_elm, error_message, _error_elm, exception_index_1;

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
                        //nonmember_product_code

                        _context2.next = 29;
                        return page.focus(form_seletor + ' tr.input_variant_ec > td > div.form_group_ec > #variant_id');

                    case 29:
                        selector_option = form_seletor + ' tr.input_variant_ec > td > div.form_group_ec > #variant_id > option';
                        selector_id = form_seletor + ' tr.input_variant_ec > td > div.form_group_ec > #variant_id';
                        _context2.next = 33;
                        return page.$$(selector_option);

                    case 33:
                        options = _context2.sent;
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context2.prev = 37;
                        _iterator = options[Symbol.iterator]();

                    case 39:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context2.next = 50;
                            break;
                        }

                        option = _step.value;
                        _context2.next = 43;
                        return page.evaluate(function (el) {
                            return el.value;
                        }, option);

                    case 43:
                        item_val = _context2.sent;

                        if (!(data.product_code == item_val)) {
                            _context2.next = 47;
                            break;
                        }

                        _context2.next = 47;
                        return page.select(selector_id, item_val);

                    case 47:
                        _iteratorNormalCompletion = true;
                        _context2.next = 39;
                        break;

                    case 50:
                        _context2.next = 56;
                        break;

                    case 52:
                        _context2.prev = 52;
                        _context2.t0 = _context2['catch'](37);
                        _didIteratorError = true;
                        _iteratorError = _context2.t0;

                    case 56:
                        _context2.prev = 56;
                        _context2.prev = 57;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 59:
                        _context2.prev = 59;

                        if (!_didIteratorError) {
                            _context2.next = 62;
                            break;
                        }

                        throw _iteratorError;

                    case 62:
                        return _context2.finish(59);

                    case 63:
                        return _context2.finish(56);

                    case 64:
                        if (!(data.login_type === login_type_guest)) {
                            _context2.next = 255;
                            break;
                        }

                        _context2.next = 67;
                        return page.focus(form_seletor + ' tr.input_name_ec > td > div.form_group_ec > #order_billing_address_attributes_name1');

                    case 67:
                        _context2.next = 69;
                        return page.keyboard.type(data.name);

                    case 69:
                        _context2.next = 71;
                        return page.focus(form_seletor + ' tr.input_kana_ec > td > div.form_group_ec >  #order_billing_address_attributes_kana1');

                    case 71:
                        _context2.next = 73;
                        return page.keyboard.type(data.furigana);

                    case 73:
                        _context2.next = 75;
                        return page.focus(form_seletor + ' tr.input_zip_ec > td > div.form_group_ec > p > #order_billing_address_attributes_zip01');

                    case 75:
                        _context2.next = 77;
                        return page.keyboard.type(data.zipcode);

                    case 77:
                        _context2.next = 79;
                        return page.focus(form_seletor + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_billing_address_attributes_prefecture_name');

                    case 79:
                        pef_option = form_seletor + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_billing_address_attributes_prefecture_name > option';
                        pef_id = form_seletor + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_billing_address_attributes_prefecture_name';
                        _context2.next = 83;
                        return page.$$(pef_option);

                    case 83:
                        pefs = _context2.sent;
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context2.prev = 87;
                        _iterator2 = pefs[Symbol.iterator]();

                    case 89:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context2.next = 103;
                            break;
                        }

                        pef = _step2.value;
                        _context2.next = 93;
                        return page.evaluate(function (el) {
                            return el.innerText;
                        }, pef);

                    case 93:
                        item_text = _context2.sent;
                        _context2.next = 96;
                        return page.evaluate(function (el) {
                            return el.value;
                        }, pef);

                    case 96:
                        item_val = _context2.sent;

                        if (!(data.pref == item_text)) {
                            _context2.next = 100;
                            break;
                        }

                        _context2.next = 100;
                        return page.select(pef_id, item_val);

                    case 100:
                        _iteratorNormalCompletion2 = true;
                        _context2.next = 89;
                        break;

                    case 103:
                        _context2.next = 109;
                        break;

                    case 105:
                        _context2.prev = 105;
                        _context2.t1 = _context2['catch'](87);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context2.t1;

                    case 109:
                        _context2.prev = 109;
                        _context2.prev = 110;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 112:
                        _context2.prev = 112;

                        if (!_didIteratorError2) {
                            _context2.next = 115;
                            break;
                        }

                        throw _iteratorError2;

                    case 115:
                        return _context2.finish(112);

                    case 116:
                        return _context2.finish(109);

                    case 117:

                        //nonmember_address
                        console.log('data.address01', data.address01);
                        address1_elm = form_seletor + ' tr.input_addr01_ec > td > div.form_group_ec > #order_billing_address_attributes_addr01';
                        _context2.next = 121;
                        return page.focus(address1_elm);

                    case 121:
                        _context2.next = 123;
                        return page.evaluate(function (address1_elm) {
                            document.querySelector(address1_elm).value = '';
                        }, address1_elm);

                    case 123:
                        _context2.next = 125;
                        return page.keyboard.type(data.address01);

                    case 125:
                        console.log('data.address02', data.address02);
                        _context2.next = 128;
                        return page.focus(form_seletor + ' tr.input_addr02_ec > td > div.form_group_ec > #order_billing_address_attributes_addr02');

                    case 128:
                        _context2.next = 130;
                        return page.waitFor(1000);

                    case 130:
                        _context2.next = 132;
                        return page.keyboard.type(data.address02);

                    case 132:
                        _context2.next = 134;
                        return page.focus(form_seletor + ' tr.input_tel_ec > td > div.form_group_ec > input[name="order[billing_address_attributes][tel01]"]');

                    case 134:
                        _context2.next = 136;
                        return page.keyboard.type(data.phone_number);

                    case 136:
                        _context2.next = 138;
                        return page.focus(form_seletor + ' tr.input_email_ec > td > div.form_group_ec > #email');

                    case 138:
                        _context2.next = 140;
                        return page.keyboard.type(data.mail);

                    case 140:
                        _context2.next = 142;
                        return page.focus(form_seletor + ' tr.input_password_ec > td > div.form_group_ec > #password');

                    case 142:
                        _context2.next = 144;
                        return page.keyboard.type(data.password);

                    case 144:
                        _context2.next = 146;
                        return page.focus(form_seletor + ' tr.input_birth_ec > td > div.form_group_ec > #order_customer_attributes_birth_1i');

                    case 146:
                        year_bd_option = form_seletor + ' tr.input_birth_ec > td > div.form_group_ec > #order_customer_attributes_birth_1i > option';
                        year_bd_id = form_seletor + ' tr.input_birth_ec > td > div.form_group_ec > #order_customer_attributes_birth_1i';
                        _context2.next = 150;
                        return page.$$(year_bd_option);

                    case 150:
                        years = _context2.sent;
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context2.prev = 154;
                        _iterator3 = years[Symbol.iterator]();

                    case 156:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context2.next = 167;
                            break;
                        }

                        year = _step3.value;
                        _context2.next = 160;
                        return page.evaluate(function (el) {
                            return el.value;
                        }, year);

                    case 160:
                        item_val = _context2.sent;

                        if (!(data.year_bd == item_val)) {
                            _context2.next = 164;
                            break;
                        }

                        _context2.next = 164;
                        return page.select(year_bd_id, item_val);

                    case 164:
                        _iteratorNormalCompletion3 = true;
                        _context2.next = 156;
                        break;

                    case 167:
                        _context2.next = 173;
                        break;

                    case 169:
                        _context2.prev = 169;
                        _context2.t2 = _context2['catch'](154);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context2.t2;

                    case 173:
                        _context2.prev = 173;
                        _context2.prev = 174;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 176:
                        _context2.prev = 176;

                        if (!_didIteratorError3) {
                            _context2.next = 179;
                            break;
                        }

                        throw _iteratorError3;

                    case 179:
                        return _context2.finish(176);

                    case 180:
                        return _context2.finish(173);

                    case 181:
                        _context2.next = 183;
                        return page.focus(form_seletor + ' tr.input_birth_ec > td > div.form_group_ec > #order_customer_attributes_birth_2i');

                    case 183:
                        month_bd_option = form_seletor + ' tr.input_birth_ec > td > div.form_group_ec > #order_customer_attributes_birth_2i > option';
                        month_bd_id = form_seletor + ' tr.input_birth_ec > td > div.form_group_ec > #order_customer_attributes_birth_2i';
                        _context2.next = 187;
                        return page.$$(month_bd_option);

                    case 187:
                        months = _context2.sent;
                        _iteratorNormalCompletion4 = true;
                        _didIteratorError4 = false;
                        _iteratorError4 = undefined;
                        _context2.prev = 191;
                        _iterator4 = months[Symbol.iterator]();

                    case 193:
                        if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                            _context2.next = 204;
                            break;
                        }

                        month = _step4.value;
                        _context2.next = 197;
                        return page.evaluate(function (el) {
                            return el.value;
                        }, month);

                    case 197:
                        item_val = _context2.sent;

                        if (!(data.month_bd == item_val)) {
                            _context2.next = 201;
                            break;
                        }

                        _context2.next = 201;
                        return page.select(month_bd_id, item_val);

                    case 201:
                        _iteratorNormalCompletion4 = true;
                        _context2.next = 193;
                        break;

                    case 204:
                        _context2.next = 210;
                        break;

                    case 206:
                        _context2.prev = 206;
                        _context2.t3 = _context2['catch'](191);
                        _didIteratorError4 = true;
                        _iteratorError4 = _context2.t3;

                    case 210:
                        _context2.prev = 210;
                        _context2.prev = 211;

                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }

                    case 213:
                        _context2.prev = 213;

                        if (!_didIteratorError4) {
                            _context2.next = 216;
                            break;
                        }

                        throw _iteratorError4;

                    case 216:
                        return _context2.finish(213);

                    case 217:
                        return _context2.finish(210);

                    case 218:
                        _context2.next = 220;
                        return page.focus(form_seletor + ' tr.input_birth_ec > td > div.form_group_ec > #order_customer_attributes_birth_3i');

                    case 220:
                        day_bd_option = form_seletor + ' tr.input_birth_ec > td > div.form_group_ec > #order_customer_attributes_birth_3i > option';
                        day_bd_id = form_seletor + ' tr.input_birth_ec > td > div.form_group_ec > #order_customer_attributes_birth_3i';
                        _context2.next = 224;
                        return page.$$(day_bd_option);

                    case 224:
                        days = _context2.sent;
                        _iteratorNormalCompletion5 = true;
                        _didIteratorError5 = false;
                        _iteratorError5 = undefined;
                        _context2.prev = 228;
                        _iterator5 = days[Symbol.iterator]();

                    case 230:
                        if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                            _context2.next = 241;
                            break;
                        }

                        day = _step5.value;
                        _context2.next = 234;
                        return page.evaluate(function (el) {
                            return el.value;
                        }, day);

                    case 234:
                        item_val = _context2.sent;

                        if (!(data.day_bd == item_val)) {
                            _context2.next = 238;
                            break;
                        }

                        _context2.next = 238;
                        return page.select(day_bd_id, item_val);

                    case 238:
                        _iteratorNormalCompletion5 = true;
                        _context2.next = 230;
                        break;

                    case 241:
                        _context2.next = 247;
                        break;

                    case 243:
                        _context2.prev = 243;
                        _context2.t4 = _context2['catch'](228);
                        _didIteratorError5 = true;
                        _iteratorError5 = _context2.t4;

                    case 247:
                        _context2.prev = 247;
                        _context2.prev = 248;

                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }

                    case 250:
                        _context2.prev = 250;

                        if (!_didIteratorError5) {
                            _context2.next = 253;
                            break;
                        }

                        throw _iteratorError5;

                    case 253:
                        return _context2.finish(250);

                    case 254:
                        return _context2.finish(247);

                    case 255:
                        //nonmember_shipping_type
                        shipping_type_elm = 'form#new-view > #view-shipping-information > table > tbody > tr > td > div.form_group_ec > #shipping_address_id';
                        _context2.next = 258;
                        return page.focus(shipping_type_elm);

                    case 258:
                        _context2.next = 260;
                        return page.select(shipping_type_elm, data.shipping_address_type);

                    case 260:
                        if (!(data.shipping_address_type == shipping_address_type_new)) {
                            _context2.next = 334;
                            break;
                        }

                        _context2.next = 263;
                        return page.waitFor(1000);

                    case 263:
                        _context2.next = 265;
                        return page.focus(form_shipping + ' tr.input_name_ec > td > div.form_group_ec > #order_shipping_address_attributes_name1');

                    case 265:
                        _context2.next = 267;
                        return page.keyboard.type(data.shipping_name);

                    case 267:
                        _context2.next = 269;
                        return page.focus(form_shipping + ' tr.input_kana_ec > td > div.form_group_ec > #order_shipping_address_attributes_kana1');

                    case 269:
                        _context2.next = 271;
                        return page.keyboard.type(data.shipping_furigana);

                    case 271:
                        _context2.next = 273;
                        return page.focus(form_shipping + ' tr.input_zip_ec > td > div.form_group_ec > p > #order_shipping_address_attributes_zip01');

                    case 273:
                        _context2.next = 275;
                        return page.keyboard.type(data.shipping_zipcode);

                    case 275:
                        _context2.next = 277;
                        return page.focus(form_shipping + ' tr.input_tel_ec > td > div.form_group_ec > input[name="order[shipping_address_attributes][tel01]"]');

                    case 277:
                        _context2.next = 279;
                        return page.keyboard.type(data.shipping_phone_number);

                    case 279:
                        _context2.next = 281;
                        return page.focus(form_shipping + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_shipping_address_attributes_prefecture_name');

                    case 281:
                        shipping_pef_option = form_shipping + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_shipping_address_attributes_prefecture_name > option';
                        shipping_pef_id = form_shipping + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_shipping_address_attributes_prefecture_name';
                        _context2.next = 285;
                        return page.$$(shipping_pef_option);

                    case 285:
                        shipping_pefs = _context2.sent;
                        _iteratorNormalCompletion6 = true;
                        _didIteratorError6 = false;
                        _iteratorError6 = undefined;
                        _context2.prev = 289;
                        _iterator6 = shipping_pefs[Symbol.iterator]();

                    case 291:
                        if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                            _context2.next = 305;
                            break;
                        }

                        shipping_pef = _step6.value;
                        _context2.next = 295;
                        return page.evaluate(function (el) {
                            return el.innerText;
                        }, shipping_pef);

                    case 295:
                        _item_text = _context2.sent;
                        _context2.next = 298;
                        return page.evaluate(function (el) {
                            return el.value;
                        }, shipping_pef);

                    case 298:
                        _item_val = _context2.sent;

                        if (!(data.shipping_pref == _item_text)) {
                            _context2.next = 302;
                            break;
                        }

                        _context2.next = 302;
                        return page.select(shipping_pef_id, _item_val);

                    case 302:
                        _iteratorNormalCompletion6 = true;
                        _context2.next = 291;
                        break;

                    case 305:
                        _context2.next = 311;
                        break;

                    case 307:
                        _context2.prev = 307;
                        _context2.t5 = _context2['catch'](289);
                        _didIteratorError6 = true;
                        _iteratorError6 = _context2.t5;

                    case 311:
                        _context2.prev = 311;
                        _context2.prev = 312;

                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }

                    case 314:
                        _context2.prev = 314;

                        if (!_didIteratorError6) {
                            _context2.next = 317;
                            break;
                        }

                        throw _iteratorError6;

                    case 317:
                        return _context2.finish(314);

                    case 318:
                        return _context2.finish(311);

                    case 319:

                        //nonmember_shipping_address
                        console.log('data.shipping_address01', data.shipping_address01);
                        shipping_address1_elm = form_shipping + ' tr.input_addr01_ec > td > div.form_group_ec > #order_shipping_address_attributes_addr01';
                        _context2.next = 323;
                        return page.focus(shipping_address1_elm);

                    case 323:
                        _context2.next = 325;
                        return page.evaluate(function (shipping_address1_elm) {
                            document.querySelector(shipping_address1_elm).value = '';
                        }, shipping_address1_elm);

                    case 325:
                        _context2.next = 327;
                        return page.keyboard.type(data.shipping_address01);

                    case 327:
                        console.log('data.shipping_address02', data.shipping_address02);
                        _context2.next = 330;
                        return page.focus(form_shipping + ' tr.input_addr02_ec > td > div.form_group_ec > #order_shipping_address_attributes_addr02');

                    case 330:
                        _context2.next = 332;
                        return page.waitFor(1000);

                    case 332:
                        _context2.next = 334;
                        return page.keyboard.type(data.shipping_address02);

                    case 334:
                        //nonmember_payment_type
                        console.log('data.payment_type = ', data.payment_type);
                        payment_type_select = 'form#new-view > #view-payment-information table:nth-child(1) > tbody > tr > td > div.form_group_ec > #payment_method_id';
                        _context2.next = 338;
                        return page.focus(payment_type_select);

                    case 338:
                        _context2.next = 340;
                        return page.waitFor(1000);

                    case 340:
                        _context2.next = 342;
                        return page.select(payment_type_select, data.payment_type);

                    case 342:
                        _context2.next = 344;
                        return page.waitFor(1000);

                    case 344:
                        if (!(data.payment_type === credit_delivery && data.login_type === login_type_member && typeof data.card_select != "undefined")) {
                            _context2.next = 354;
                            break;
                        }

                        payment_type_element = 'form#new-view > #view-payment-information > #view-credit-card-information > table.landing_form_ec > tbody > tr.input_card_number_ec > td > div.form_group_ec > #card-id';
                        _context2.next = 348;
                        return page.$(payment_type_element);

                    case 348:
                        _context2.t6 = _context2.sent;

                        if (!(_context2.t6 !== null)) {
                            _context2.next = 354;
                            break;
                        }

                        _context2.next = 352;
                        return page.focus(payment_type_element);

                    case 352:
                        _context2.next = 354;
                        return page.select(payment_type_element, data.card_select);

                    case 354:
                        if (!(data.payment_type === credit_delivery)) {
                            _context2.next = 395;
                            break;
                        }

                        if (!(data.login_type === login_type_guest || data.login_type === login_type_member && (typeof data.card_select == "undefined" || typeof data.card_select != "undefined" && data.card_select == '0'))) {
                            _context2.next = 395;
                            break;
                        }

                        if (!(typeof data.payment_token != "undefined" && data.payment_token != '')) {
                            _context2.next = 395;
                            break;
                        }

                        console.log('data.payment_token = ', data.payment_token);
                        //TEST credit card payment
                        _context2.next = 360;
                        return page.focus(form_credit_card_payment + ' tr.input_card_number_ec > td > div.form_group_ec > #view-input-card-number > p:nth-child(4) > #input-cc-number');

                    case 360:
                        _context2.next = 362;
                        return page.keyboard.type('411111111111' + data.card_number);

                    case 362:
                        _context2.next = 364;
                        return page.focus(form_credit_card_payment + ' tr.input_card_name_ec > td > div.form_group_ec > #input-cc-name');

                    case 364:
                        _context2.next = 366;
                        return page.keyboard.type(data.card_name);

                    case 366:
                        card_m = form_credit_card_payment + ' tr.input_card_expiration_ec > td > div.form_group_ec > p > #input-cc-month';
                        _context2.next = 369;
                        return page.focus(card_m);

                    case 369:
                        _context2.next = 371;
                        return page.select(card_m, data.card_month);

                    case 371:
                        card_y = form_credit_card_payment + ' tr.input_card_expiration_ec > td > div.form_group_ec > p > #input-cc-year';
                        _context2.next = 374;
                        return page.focus(card_y);

                    case 374:
                        _context2.next = 376;
                        return page.select(card_y, data.card_year);

                    case 376:
                        _context2.next = 378;
                        return page.waitFor(3500);

                    case 378:
                        token_elm = 'form#new-view > #view-payment-information > #view-credit-card-information > input#input-cc-access-token';
                        _context2.next = 381;
                        return page.$eval(token_elm, function (el) {
                            return el.value;
                        });

                    case 381:
                        tmp_token = _context2.sent;

                        console.log("tmp_token", tmp_token);

                        _context2.next = 385;
                        return page.evaluate(function (token_elm) {
                            document.querySelector(token_elm).setAttribute('type', 'text');
                        }, token_elm);

                    case 385:
                        _context2.next = 387;
                        return page.focus(token_elm);

                    case 387:
                        _context2.next = 389;
                        return page.evaluate(function (token_elm) {
                            document.querySelector(token_elm).value = '';
                        }, token_elm);

                    case 389:
                        _context2.next = 391;
                        return page.keyboard.type(data.payment_token);

                    case 391:
                        _context2.next = 393;
                        return page.$eval(token_elm, function (el) {
                            return el.value;
                        });

                    case 393:
                        tmp_token2 = _context2.sent;

                        console.log("tmp_token2", tmp_token2);

                    case 395:
                        if (!(data.product_code === product_code_426)) {
                            _context2.next = 433;
                            break;
                        }

                        _context2.next = 398;
                        return page.focus('form#new-view > #view-payment-schedule > #container_payment_schedule > #container_delivery_schedule_by_term > table > tbody > tr > td > div.form_group_ec > p > #select_scheduled_to_be_delivered_every_x_day');

                    case 398:
                        shipping_cycle_option = 'form#new-view > #view-payment-schedule > #container_payment_schedule > #container_delivery_schedule_by_term > table > tbody > tr > td > div.form_group_ec > p > #select_scheduled_to_be_delivered_every_x_day > option';
                        shipping_cycle_id = 'form#new-view > #view-payment-schedule > #container_payment_schedule > #container_delivery_schedule_by_term > table > tbody > tr > td > div.form_group_ec > p > #select_scheduled_to_be_delivered_every_x_day';
                        _context2.next = 402;
                        return page.$$(shipping_cycle_option);

                    case 402:
                        shipping_cycles = _context2.sent;
                        _iteratorNormalCompletion7 = true;
                        _didIteratorError7 = false;
                        _iteratorError7 = undefined;
                        _context2.prev = 406;
                        _iterator7 = shipping_cycles[Symbol.iterator]();

                    case 408:
                        if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                            _context2.next = 419;
                            break;
                        }

                        shipping_cycle = _step7.value;
                        _context2.next = 412;
                        return page.evaluate(function (el) {
                            return el.value;
                        }, shipping_cycle);

                    case 412:
                        _item_val2 = _context2.sent;

                        if (!(data.shipping_cycle == _item_val2)) {
                            _context2.next = 416;
                            break;
                        }

                        _context2.next = 416;
                        return page.select(shipping_cycle_id, _item_val2);

                    case 416:
                        _iteratorNormalCompletion7 = true;
                        _context2.next = 408;
                        break;

                    case 419:
                        _context2.next = 425;
                        break;

                    case 421:
                        _context2.prev = 421;
                        _context2.t7 = _context2['catch'](406);
                        _didIteratorError7 = true;
                        _iteratorError7 = _context2.t7;

                    case 425:
                        _context2.prev = 425;
                        _context2.prev = 426;

                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }

                    case 428:
                        _context2.prev = 428;

                        if (!_didIteratorError7) {
                            _context2.next = 431;
                            break;
                        }

                        throw _iteratorError7;

                    case 431:
                        return _context2.finish(428);

                    case 432:
                        return _context2.finish(425);

                    case 433:
                        if (!(data.screen_short_flg === 1)) {
                            _context2.next = 436;
                            break;
                        }

                        _context2.next = 436;
                        return page.pdf({ path: 'screen_short/medium' + Date.now() + '.pdf', format: 'A4', printBackground: true });

                    case 436:
                        _context2.next = 438;
                        return page.waitFor(1000);

                    case 438:
                        _context2.next = 440;
                        return page.$(form_seletor + ' tr.input_email_ec > td > div.form_group_ec > div.emailformError');

                    case 440:
                        _context2.t8 = _context2.sent;

                        if (!(_context2.t8 !== null)) {
                            _context2.next = 446;
                            break;
                        }

                        response.error_message = 'メールアドレスは既に登録済みです。';
                        res.status(500).json(response);
                        _context2.next = 502;
                        break;

                    case 446:
                        // await page.pdf({path: 'screen_short/medium'+ Date.now() +'.pdf', format: 'A4', printBackground: true});
                        //submit form
                        console.log("start_submit");
                        _context2.next = 449;
                        return Promise.all([page.click('form#new-view > div.submit_ec > center > #submit'), page.waitForNavigation()]);

                    case 449:
                        console.log("end_submit");
                        // await page.click('form#new-view > div.submit_ec > center > #submit');
                        // await page.waitFor(1000);
                        _context2.next = 452;
                        return page.evaluate('location.href');

                    case 452:
                        shopping_confirm_url = _context2.sent;


                        console.log('after submit', shopping_confirm_url);
                        // await page.pdf({path: 'screen_short/medium'+ Date.now() +'.pdf', format: 'A4', printBackground: true});

                        if (!(shopping_confirm_url != shopping_nonmember_url)) {
                            _context2.next = 489;
                            break;
                        }

                        //submit form
                        console.log('start click order');
                        _context2.next = 458;
                        return Promise.all([page.click('div#confirm-view > div.form_container_ec > div.form_confirm_ec > div.block_ec > div.confirm_content_ec > div.center_ec > form.form_inline_ec > input#submit'), page.waitForNavigation()]);

                    case 458:
                        console.log('end click order');

                        _context2.next = 461;
                        return page.evaluate('location.href');

                    case 461:
                        thank_url = _context2.sent;

                        console.log('thank_url = ', thank_url);

                        if (!(thank_url.indexOf('complete') != -1)) {
                            _context2.next = 474;
                            break;
                        }

                        console.log("order success");
                        _context2.next = 467;
                        return page.$eval('div.perform_content_ec > table.table_ec > tbody > tr > td#order-number', function (el) {
                            return el.innerText;
                        });

                    case 467:
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
                        _context2.next = 487;
                        break;

                    case 474:
                        console.log("order error");
                        error_message = "order error";
                        error_elm = 'form#new-view > #alert-box > p';
                        _context2.next = 479;
                        return page.$(error_elm);

                    case 479:
                        _context2.t9 = _context2.sent;

                        if (!(_context2.t9 !== null)) {
                            _context2.next = 484;
                            break;
                        }

                        _context2.next = 483;
                        return page.$eval(error_elm, function (el) {
                            return el.innerText;
                        });

                    case 483:
                        error_message = _context2.sent;

                    case 484:
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

                    case 487:
                        _context2.next = 502;
                        break;

                    case 489:
                        console.log("入力に不備があります。");
                        error_message = "入力に不備があります。";
                        _error_elm = 'form#new-view > #alert-box > p';
                        _context2.next = 494;
                        return page.$(_error_elm);

                    case 494:
                        _context2.t10 = _context2.sent;

                        if (!(_context2.t10 !== null)) {
                            _context2.next = 499;
                            break;
                        }

                        _context2.next = 498;
                        return page.$eval(_error_elm, function (el) {
                            return el.innerText;
                        });

                    case 498:
                        error_message = _context2.sent;

                    case 499:
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

                    case 502:
                        _context2.next = 512;
                        break;

                    case 504:
                        _context2.prev = 504;
                        _context2.t11 = _context2['catch'](9);

                        console.log('Confirm exception', _context2.t11);
                        exception_index_1 = {
                            cpid: data.connect_page_id,
                            user_id: data.user_id,
                            status: 3,
                            error_message: _context2.t11,
                            index: 1,
                            param: data
                        };

                        puppeteerRequest.findOneAndUpdate({ _id: idObject }, {
                            $set: {
                                status: 3,
                                url: data.url,
                                error_message: _context2.t11,
                                updated_at: new Date()
                            }
                        }, { upsert: false, multi: false }, function (err, result) {
                            if (err) throw err;
                        });
                        savePuppeteerException(exception_index_1);
                        response.error_message = "エラーが発生しました。再度ご試しください。";
                        res.status(500).json(response);

                    case 512:
                        _context2.next = 514;
                        return browser.close();

                    case 514:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, _this2, [[9, 504], [37, 52, 56, 64], [57,, 59, 63], [87, 105, 109, 117], [110,, 112, 116], [154, 169, 173, 181], [174,, 176, 180], [191, 206, 210, 218], [211,, 213, 217], [228, 243, 247, 255], [248,, 250, 254], [289, 307, 311, 319], [312,, 314, 318], [406, 421, 425, 433], [426,, 428, 432]]);
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
                                request.continue();
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
                                request.continue();
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
        var browser, page, header_element, name1, katakana1, zip01, pref, addr01, addr02, addr03, tel01, customer_sex, year, month, day, password_first, password_second, magazine, mail_element, mail_confirm_element, error_text, error_element, total_err, validate_flg, i, row, _error_element, error_value;

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
                                request.continue();
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
                        // const name2 = '#new_customer > div > div:nth-child(1) > div > div > div:nth-child(2) > input';

                        katakana1 = '#new_customer > div > div:nth-child(2) > div > div > div:nth-child(1) > #customer_billing_address_attributes_kana01';
                        // const katakana2 = '#new_customer > div > div:nth-child(2) > div > div > div:nth-child(2) > #customer_billing_address_attributes_kana02';

                        zip01 = '#new_customer > div > div:nth-child(3) > div > div.form-inline > #customer_billing_address_attributes_zip01';
                        // const zip02 = '#new_customer > div > div:nth-child(3) > div > div.form-inline > #customer_billing_address_attributes_zip02';

                        pref = '#new_customer > div > div:nth-child(4) > div > #customer_billing_address_attributes_prefecture_name';
                        addr01 = '#new_customer > div > div:nth-child(5) > div > #customer_billing_address_attributes_addr01';
                        addr02 = '#new_customer > div > div:nth-child(6) > div > #customer_billing_address_attributes_addr02';
                        addr03 = '#new_customer > div > div:nth-child(7) > div > #customer_billing_address_attributes_addr03';
                        tel01 = '#new_customer > div > div:nth-child(8) > div > div > #customer_billing_address_attributes_tel01';
                        // const tel02 = '#new_customer > div > div:nth-child(8) > div > div > #customer_billing_address_attributes_tel02';
                        // const tel03 = '#new_customer > div > div:nth-child(8) > div > div > #customer_billing_address_attributes_tel03';

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

                        _context5.next = 35;
                        return page.evaluate(function (name1, katakana1, zip01, pref, addr01, addr02, addr03, tel01, customer_sex, year, month, day, password_first, password_second, magazine) {
                            document.querySelector(name1).classList.remove('validate[required]');
                            // document.querySelector(name2).classList.remove('validate[required]');
                            document.querySelector(katakana1).classList.remove('validate[required,custom[katakana]]');
                            // document.querySelector(katakana2).classList.remove('validate[required,custom[katakana]]');
                            document.querySelector(zip01).classList.remove('validate[required,custom[integer],minSize[3]]');
                            // document.querySelector(zip02).classList.remove('validate[required,custom[integer],minSize[4]]');
                            document.querySelector(pref).classList.remove('validate[required]');
                            document.querySelector(addr01).classList.remove('validate[required]');
                            document.querySelector(addr02).classList.remove('validate[required]');
                            document.querySelector(addr03).classList.remove('validate[required]');
                            document.querySelector(tel01).classList.remove('validate[required,custom[integer]]');
                            // document.querySelector(tel02).classList.remove('validate[required,custom[integer]]');
                            // document.querySelector(tel03).classList.remove('validate[required,custom[integer]]');
                            document.querySelector(customer_sex).classList.remove('validate[required]');
                            document.querySelector(year).classList.remove('validate[required]');
                            document.querySelector(month).classList.remove('validate[required]');
                            document.querySelector(day).classList.remove('validate[required]');
                            document.querySelector(password_first).classList.remove('validate[required,minSize[8]]');
                            document.querySelector(password_second).classList.remove('validate[required,equals[customer_password]]');
                            document.querySelector(magazine).classList.remove('validate[required]');
                        }, name1, katakana1, zip01, pref, addr01, addr02, addr03, tel01, customer_sex, year, month, day, password_first, password_second, magazine);

                    case 35:
                        _context5.next = 37;
                        return page.evaluate(function (mail_element, mail_confirm_element) {
                            document.querySelector(mail_element).value = '';
                            document.querySelector(mail_confirm_element).value = '';
                        }, mail_element, mail_confirm_element);

                    case 37:
                        _context5.next = 39;
                        return page.focus(mail_element);

                    case 39:
                        _context5.next = 41;
                        return page.keyboard.type(mail);

                    case 41:
                        _context5.next = 43;
                        return page.focus(mail_confirm_element);

                    case 43:
                        _context5.next = 45;
                        return page.keyboard.type(mail);

                    case 45:

                        //validate
                        error_text = "メールアドレスは既に登録済みです。";
                        error_element = '#new_customer > div.alert.alert-danger > p.text';
                        _context5.next = 49;
                        return page.click('#new_customer > div > div:nth-child(17) > div > input');

                    case 49:
                        _context5.next = 51;
                        return page.waitForSelector(error_element);

                    case 51:
                        _context5.next = 53;
                        return page.screenshot({ path: 'pictures/login1111' + Date.now() + '.png', fullPage: true });

                    case 53:
                        _context5.next = 55;
                        return page.$$(error_element);

                    case 55:
                        total_err = _context5.sent;

                        console.log('total_err---', total_err);
                        validate_flg = false;

                        console.log(total_err.length);
                        i = 1;

                    case 60:
                        if (!(i <= total_err.length)) {
                            _context5.next = 77;
                            break;
                        }

                        row = '#new_customer > div.alert.alert-danger > p:nth-child(' + i + ')';
                        _context5.next = 64;
                        return page.$(row);

                    case 64:
                        _error_element = _context5.sent;
                        _context5.next = 67;
                        return _error_element.getProperty('textContent');

                    case 67:
                        _context5.next = 69;
                        return _context5.sent.jsonValue();

                    case 69:
                        error_value = _context5.sent;

                        console.log("error_value=", error_value);

                        if (!(error_value == error_text)) {
                            _context5.next = 74;
                            break;
                        }

                        validate_flg = true;
                        return _context5.abrupt('break', 77);

                    case 74:
                        i++;
                        _context5.next = 60;
                        break;

                    case 77:

                        console.log(validate_flg);
                        if (validate_flg) {
                            response.error_message = 'メールアドレスは既に登録済みです。';
                            res.status(500).json(response);
                        } else {
                            response.message = 'success';
                            res.status(200).json(response);
                        }
                        _context5.next = 86;
                        break;

                    case 81:
                        _context5.prev = 81;
                        _context5.t0 = _context5['catch'](9);

                        console.log(_context5.t0);
                        response.error_message = "エラーが発生しました。再度ご試しください。";
                        res.status(500).json(response);

                    case 86:
                        _context5.next = 88;
                        return browser.close();

                    case 88:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, _this5, [[9, 81]]);
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
    if (product_code == "426" || product_code == "417" || product_code == "263") {
        product_unit_price = 980;
        total += product_unit_price;
    } else if (product_code == "235" || product_code == "302") {
        product_unit_price = 3300;
        order_shipping_fee = 600;
        total += product_unit_price + order_shipping_fee;
    } else if (product_code == "257") {
        product_unit_price = 4980;
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