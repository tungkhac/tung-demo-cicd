// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");
var model = require('../model');
var crypto = require('crypto');
const Zipcode = model.Zipcode;
const puppeteerRequest = model.PuppeteerRequest;
const puppeteerException = model.PuppeteerException;

const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');

const login_type_member = '1';
const login_type_guest = '2';

const product_code_235 = '235';
const product_code_426 = '426';
const mail_service = '1';

const home_delivery = '9';
const cash_delivery = '5';
const credit_delivery = '1';

const quantity_default = 1;
const shipping_address_type_default = 'same';
const shipping_address_type_new = 'new';
const payment_type_default = '9';
const header_login_success = "マイページ";

const login_list_url = [
    "shop/customers"
];
/*fill info login*/
router.post('/login', function(req, res, next) {
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
    if (typeof mail == "undefined" || mail == '' ||
        typeof password == "undefined" ||  password == '' ||
        typeof connect_page_id == "undefined" || connect_page_id == '' ||
        typeof user_id == "undefined" || user_id == '') {
        response.error_message = "Input data is empty.";
        return res.status(400).json(response);
    }

    var token = crypto.randomBytes(64).toString('hex');
    var data = {
        connect_page_id : connect_page_id,
        user_id : user_id,
        mail: mail,
        password : password,
        url_login : url_login,
        user_token: token,
        cookie: {
            name: '',
            value: ''
        }
    };

    puppeteerRequest.remove({cpid: connect_page_id, user_id: user_id}, function(err) {
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
        organic.save(function(err, result) {
            if(err) throw  err;
            data.object_id = result._id;
            organicLogin(data, res);
        });
    });
    console.timeEnd("login");
});

function organicLogin(data, res) {
    console.log("start run login", data);
    var response = {};
    (async () => {
        const browser =
            await puppeteer.launch({
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--no-sandbox',
                    '--no-zygote',
                    '--single-process'
                ]
            });

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', request => {
            //console.log(request.resourceType());
            var rtype = request.resourceType();
    var request_url = request.url();
        if(request_url.indexOf("google") !== -1
            || request_url.indexOf("ladsp") !== -1
            || request_url.indexOf("yahoo") !== -1
            || request_url.indexOf("socdm") !== -1
            || request_url.indexOf("facebook") !== -1
            || request_url.indexOf("kozuchi") !== -1
            || request_url.indexOf("kozuchi") !== -1
        ){
            //console.log("request_url=", request_url);
            request.continue();
        }
        else if (rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || request.url().indexOf("organic") == -1) {
                request.abort();
            } else {
                //console.log(request.url());
                request.continue();

            }
        });
        //await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        try {
            await page.goto(data.url_login, {waitUntil: 'networkidle0'});
            const header_element = ".ncontainer > .content-right > .breadcrumb > li:nth-child(2) > span";
            await page.waitForSelector(header_element);
            const curren_login_header = await page.$eval(header_element, el => el.innerText);
            console.log("curren_login_header", curren_login_header);
            if(curren_login_header == header_login_success) {
                console.log("===logged===");
                const cookiesObject = await page.cookies();
                var cookie = getCookieGest(cookiesObject);
                //console.log('cookie===', cookie);
                puppeteerRequest.findOne({_id: data.object_id}, function (err, result) {
                    var tmp_param = result.param;
                    tmp_param.cookie = cookie;
                    result.status = 1;
                    result.error_message = '';
                    result.login_flg = 1;
                    result.param = tmp_param;
                    result.updated_at = new Date();
                    result.save(function (err) {
                        if(err) throw  err;
                    });
                });
                response.login_flg = 1;
                return res.status(200).json(response);
            } else {
                console.log("== start login====");
                const email_element = 'form:nth-child(3) > div:nth-child(4) > div.form-group > div.col-md-9 > input';
                const password_element = 'form:nth-child(3) > div:nth-child(5) > div.form-group > div.col-md-9 > input';

                //input email
                await page.waitForSelector(email_element);
                await page.click(email_element);
                await page.focus(email_element);
                await page.evaluate((email_element) => {
                    document.querySelector(email_element).value = ''
                }, email_element);
                await page.keyboard.type(data.mail);

                //input password
                await page.waitForSelector(password_element);
                await page.click(password_element);
                await page.focus(password_element);
                await page.evaluate((password_element) => {
                    document.querySelector(password_element).value = ''
                }, password_element);
                await page.keyboard.type(data.password);

                await Promise.all([
                    page.click('#customers-sessions-sign-in-view > form:nth-child(3) > div:nth-child(7) > div > div > p > input'),
                    page.waitForNavigation()
                ]);

                const new_login_header = await page.$eval(header_element, el => el.innerText );
                console.log("new_login_header", new_login_header);
                if (new_login_header == header_login_success) {
                    // get user info
                    const customer_edit_element = "body > main > div > div.nav-customer.mb-40 > a:nth-child(6)";
                    await Promise.all([
                        page.click(customer_edit_element),
                        page.waitForNavigation()
                    ]);

                    const name1_element = '#customer_form > div:nth-child(6) > div.col-md-9 > div.row > div:nth-child(1) > input';
                    const name2_element = '#customer_form > div:nth-child(6) > div.col-md-9 > div.row > div:nth-child(2) > input';
                    const furigana1_element = '#customer_form > div:nth-child(7) > div > div > div:nth-child(1) > input';
                    const furigana2_element = '#customer_form > div:nth-child(7) > div > div > div:nth-child(2) > input';
                    const zipcode1_element = '#customer_form > div:nth-child(8) > div > div.form-inline > #customer_billing_address_attributes_zip01';
                    const zipcode2_element = '#customer_form > div:nth-child(8) > div > div.form-inline > #customer_billing_address_attributes_zip02';
                    const prefecture_element = '#customer_form > div:nth-child(9) > div > #customer_billing_address_attributes_prefecture_name';
                    const address1_element = '#customer_form > div:nth-child(10) > div > input';
                    const address2_element = '#customer_form > div:nth-child(11) > div > input';
                    const address3_element = '#customer_form > div:nth-child(12) > div > input';
                    const phone1_element = '#customer_form > div:nth-child(13) > div > div > #customer_billing_address_attributes_tel01';
                    const phone2_element = '#customer_form > div:nth-child(13) > div > div > #customer_billing_address_attributes_tel02';
                    const phone3_element = '#customer_form > div:nth-child(13) > div > div > #customer_billing_address_attributes_tel03';
                    const email_element = '#customer_form > div:nth-child(14) > div > #customer_email';
                    const gender_element = '#customer_form > div:nth-child(15) > div > #customer_sex_id';
                    const profession_element = '#customer_form > div:nth-child(16) > div > #customer_job_id';
                    const year_element = '#customer_form > div:nth-child(17) > div > div > #customer_birth_1i';
                    const month_element = '#customer_form > div:nth-child(17) > div > div > #customer_birth_2i';
                    const day_element = '#customer_form > div:nth-child(17) > div > div > #customer_birth_3i';
                    const magazine_element = '#customer_form > div:nth-child(18) > div > #customer_optin';

                    var name1_value = await page.$eval(name1_element, el => el.value );
                    var name2_value = await page.$eval(name2_element, el => el.value );
                    var furigana1_value = await page.$eval(furigana1_element, el => el.value );
                    var furigana2_value = await page.$eval(furigana2_element, el => el.value );
                    var zipcode1_value = await page.$eval(zipcode1_element, el => el.value );
                    var zipcode2_value = await page.$eval(zipcode2_element, el => el.value );
                    var zipcode = zipcode1_value.toString() + zipcode2_value.toString();
                    var prefecture_value = await page.$eval(prefecture_element, el => el.value );
                    var address1_value = await page.$eval(address1_element, el => el.value );
                    var address2_value = await page.$eval(address2_element, el => el.value );
                    var address3_value = await page.$eval(address3_element, el => el.value );
                    var phone1_value = await page.$eval(phone1_element, el => el.value );
                    var phone2_value = await page.$eval(phone2_element, el => el.value );
                    var phone3_value = await page.$eval(phone3_element, el => el.value );
                    var phone = phone1_value + phone2_value + phone3_value;
                    var email_value = await page.$eval(email_element, el => el.value );
                    var gender_value = await page.$eval(gender_element, el => el.value );
                    var profession_value = await page.$eval(profession_element, el => el.value );
                    var year_value = await page.$eval(year_element, el => el.value);
                    var month_value = await page.$eval(month_element, el => el.value);
                    var day_value = await page.$eval(day_element, el => el.value);
                    var magazine_value = await page.$eval(magazine_element, el => el.value);
                    var birth_day = year_value + '-' + month_value + '-' + day_value;
                    var address = prefecture_value + address1_value + address2_value + address3_value;

                    const cookiesObject = await page.cookies();
                    console.log(cookiesObject);
                    var cookie = getCookieGest(cookiesObject);
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
                        birth_day : birth_day,
                        login_flg: 1,
                        address: address,
                    };
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id}, {
                        $set: {
                            status: 1,
                            error_message: '',
                            login_flg: 1,
                            param: data,
                            updated_at: new Date()
                        }
                    }, {upsert: false}, function (err, result) {
                        if (err) throw err;
                    });

                    console.log("login success");
                    response = data.response;
                    res.status(200).json(response);
                } else {
                    var error_message = "メールアドレスもしくはパスワードが不正です。";
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id}, {
                        $set: {
                            status: 3,
                            error_message: error_message,
                            updated_at: new Date()
                        }
                    }, {upsert: false}, function (err, result) {
                        if (err) throw err;
                    });
                    response.error_message = error_message;
                    res.status(500).json(response);
                }
            }
        } catch (e) {
            console.log("puppeteerLogin exception", e);
            var exception_index_3 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                status: 3,
                error_message: e,
                index: 0,
                param: data
            };
            savePuppeteerException(exception_index_3);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }
        await browser.close();
    })()
}



/*fill info guest*/
router.post('/fill_info_guest', function(req, res, next) {
    console.time("time_guest");
    var body = req.body;

    var product_code = body.product_code;
    var name = body.name;
    var furigana = body.furigana;
    var zipcode = body.zipcode;
    var pref = body.pref;
    var address01 = body.address01;
    var address02 = body.address02;
    var phone_number = (typeof body.phone_number != 'undefined' && body.phone_number.indexOf("-") != -1) ? body.phone_number.replace(/-/g,"") : body.phone_number;
    var mail = body.mail;
    var password = body.password;
    var shipping_address_type = (typeof body.shipping_address_type !== 'undefined') ? body.shipping_address_type : shipping_address_type_default;
    var payment_type = (typeof body.payment_type !== 'undefined') ? body.payment_type : payment_type_default;
    var payment_token =  body.payment_token;
    var card_name = (typeof body.card_name !== 'undefined') ? body.card_name : 'EFO';
    var card_month =  body.card_month;
    var card_year =  body.card_year;
    var card_number =  body.card_number;
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
    var shipping_phone_number = (typeof body.shipping_phone_number != 'undefined' && body.shipping_phone_number.indexOf("-") != -1) ? body.shipping_phone_number.replace(/-/g,"") : body.shipping_phone_number;
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
    var condition = {cpid: connect_page_id, user_id: user_id};
    if(login_type === login_type_member){
        condition = {cpid: connect_page_id, user_id: user_id, index: {$gt: 0 }};
    }
    puppeteerRequest.remove(condition, function(err) {
        if (err) throw err;
        var data_insert =  {
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
        puppeteer_data.save(function(err, result) {
            if (err) throw err;
            if(result){
                var idObject = result._id;
                if(login_type === login_type_member){
                    puppeteerRequest.findOne({cpid : connect_page_id, user_id: user_id, index: 0},function(err, result) {
                        if(result) {
                            data.cookie = result.param.cookie;
                            shoppingNomember(idObject, data, res);
                        }
                    });
                }else{
                    shoppingNomember(idObject, data, res);
                }
            }
        });
    });
    console.timeEnd("time_guest");
});

router.post('/order', function(req, res, next) {
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
    var response = {};
    (async () => {

        const browser =
            await puppeteer.launch({
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--no-sandbox',
                    '--no-zygote',
                    '--single-process'
                ]
            });

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', request => {
            //console.log(request.resourceType());
            var rtype = request.resourceType();
            var request_url = request.url();
            if(request_url.indexOf("google") !== -1
                || request_url.indexOf("ladsp") !== -1
                || request_url.indexOf("yahoo") !== -1
                || request_url.indexOf("socdm") !== -1
                || request_url.indexOf("facebook") !== -1
                || request_url.indexOf("kozuchi") !== -1
                || request_url.indexOf("kozuchi") !== -1
            ){
                request.continue().catch(err => console.error(""));
            }
            else if (rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || (request.url().indexOf("organic") == -1 && request.url().indexOf("p01") == -1)) {
                request.abort().catch(err => console.error(""));
            } else {
                // console.log('url =', request.url());
                request.continue().catch(err => console.error(""));
            }
        });

        try {
            //const page = await browser.newPage();
            const shopping_nonmember_url = data.url;
            // const shopping_nonmember_url = 'https://www.alo-organic.com/lp?u=hln000_page203_cform';
            if(typeof data.cookie !== 'undefined' && Array.isArray(data.cookie) &&  data.cookie.length > 0){
                var cookie = data.cookie;
                var cookie_new1 = [];

                cookie.forEach(function (element) {
                    element.url = shopping_nonmember_url;
                    cookie_new1.push(element);
                });
                console.log(cookie_new1);
                cookie.url = shopping_nonmember_url;
                console.log("shopping_nonmember_url=", shopping_nonmember_url);
                await page.setCookie(...cookie_new1);
            }
            await page.goto(shopping_nonmember_url, {waitUntil: 'networkidle0'});
            // await page.waitForSelector('body > div.form > div#lp-form > form#new-view');
            let form_seletor = 'form#new-view > #view-billing-information > table.landing_form_ec > tbody >';
            let form_shipping = 'form#new-view > #view-shipping-information > #shipping_address_input > table.landing_form_ec > tbody >';
            let form_credit_card_payment = 'form#new-view > #view-payment-information > #view-credit-card-information > table.landing_form_ec > tbody >';
            let credit_card_number_element = 'form#new-view > #view-payment-information > #view-credit-card-information > table.landing_form_ec > tbody > tr.input_card_number_ec > td > div.form_group_ec > #view-input-card-number > p:nth-child(4) > input.input_box_card_number_ec';
            let credit_card_name_element = 'form#new-view > #view-payment-information > #view-credit-card-information > table.landing_form_ec > tbody > tr.input_card_name_ec > td > div.form_group_ec > input.input_box_card_name_ec';

            console.log('user info no split');
            //nonmember_name_name
            const name_elm = form_seletor + ' tr.input_name_ec > td > div.form_group_ec > #order_billing_address_attributes_name1';
            await page.focus(name_elm);
            await page.evaluate((name_elm) => {
                document.querySelector(name_elm).value = ''
            }, name_elm);
            await page.keyboard.type(data.name);
            console.log('data.name_no_split', data.name);
            //nonmember_kana_kana
            const furigana_elm = form_seletor + ' tr.input_kana_ec > td > div.form_group_ec > #order_billing_address_attributes_kana1';
            await page.focus(furigana_elm);
            await page.evaluate((furigana_elm) => {
                document.querySelector(furigana_elm).value = ''
            }, furigana_elm);
            await page.keyboard.type(data.furigana);
            console.log('data.furigana_no_split', data.furigana);
            //nonmember_zipcode
            await page.focus(form_seletor + ' tr.input_zip_ec > td > div.form_group_ec > p > #order_billing_address_attributes_zip01');
            await page.keyboard.type(data.zipcode);
            //nonmember_pref
            await page.focus(form_seletor + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_billing_address_attributes_prefecture_name');
            const pef_option = form_seletor + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_billing_address_attributes_prefecture_name > option';
            const pef_id = form_seletor + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_billing_address_attributes_prefecture_name';
            const pefs = await page.$$(pef_option);
            for (const pef of pefs) {
                const item_text = await page.evaluate(el => el.innerText, pef);
                const item_val = await page.evaluate(el => el.value, pef);
                if (data.pref == item_text) {
                    await page.select(pef_id, item_val);
                }
            }

            //nonmember_address
            console.log('data.address01', data.address01);
            const address1_elm = form_seletor + ' tr.input_addr01_ec > td > div.form_group_ec > #order_billing_address_attributes_addr01';
            await page.focus(address1_elm);
            await page.evaluate((address1_elm) => {
                document.querySelector(address1_elm).value = ''
            }, address1_elm);
            await page.keyboard.type(data.address01);
            console.log('data.address02', data.address02);
            await page.focus(form_seletor + ' tr.input_addr02_ec > td > div.form_group_ec > #order_billing_address_attributes_addr02');
            await page.waitFor(1000);
            await page.keyboard.type(data.address02);
            //nonmember_tel
            const tel_elm = form_seletor + ' tr.input_tel_ec > td > div.form_group_ec > input[name="order[billing_address_attributes][tel01]"]';
            await page.focus(tel_elm);
            await page.evaluate((tel_elm) => {
                document.querySelector(tel_elm).value = ''
            }, tel_elm);
            await page.keyboard.type(data.phone_number.trim());
            console.log('data.phone_number', data.phone_number);
            //nonmember_email
            await page.focus(form_seletor + ' tr.input_email_ec > td > div.form_group_ec > #email');
            await page.keyboard.type(data.mail);

            //nonmember_shipping_type
            const shipping_type_elm = 'form#new-view > #view-shipping-information > table > tbody > tr > td > div.form_group_ec > #shipping_address_id';
            await page.focus(shipping_type_elm);
            await page.select(shipping_type_elm, data.shipping_address_type);

            if(data.shipping_address_type == shipping_address_type_new){
                await page.waitFor(1000);
                console.log("start fill shipping_address_type_new");
                console.log('shipping info no split');
                //nonmember_shipping_name
                await page.focus(form_shipping + ' tr.input_name_ec > td > div.form_group_ec > #order_shipping_address_attributes_name1');
                await page.keyboard.type(data.shipping_name);
                //nonmember_shipping_kana
                await page.focus(form_shipping + ' tr.input_kana_ec > td > div.form_group_ec > #order_shipping_address_attributes_kana1');
                await page.keyboard.type(data.shipping_furigana);
                //nonmember_shipping_zipcode
                await page.focus(form_shipping + ' tr.input_zip_ec > td > div.form_group_ec > p > #order_shipping_address_attributes_zip01');
                await page.keyboard.type(data.shipping_zipcode);
                //nonmember_shipping_pref
                await page.focus(form_shipping + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_shipping_address_attributes_prefecture_name');
                const shipping_pef_option = form_shipping + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_shipping_address_attributes_prefecture_name > option';
                const shipping_pef_id = form_shipping + ' tr.input_prefecture_ec > td > div.form_group_ec > #order_shipping_address_attributes_prefecture_name';
                const shipping_pefs = await page.$$(shipping_pef_option);
                for (const shipping_pef of shipping_pefs) {
                    const item_text = await page.evaluate(el => el.innerText, shipping_pef);
                    const item_val = await page.evaluate(el => el.value, shipping_pef);
                    if (data.shipping_pref == item_text) {
                        await page.select(shipping_pef_id, item_val);
                    }
                }

                //nonmember_shipping_address
                console.log('data.shipping_address01', data.shipping_address01);
                const shipping_address1_elm = form_shipping + ' tr.input_addr01_ec > td > div.form_group_ec > #order_shipping_address_attributes_addr01';
                await page.focus(shipping_address1_elm);
                await page.evaluate((shipping_address1_elm) => {
                    document.querySelector(shipping_address1_elm).value = ''
                }, shipping_address1_elm);
                await page.keyboard.type(data.shipping_address01);
                console.log('data.shipping_address02', data.shipping_address02);
                await page.focus(form_shipping + ' tr.input_addr02_ec > td > div.form_group_ec > #order_shipping_address_attributes_addr02');
                await page.waitFor(1000);
                await page.keyboard.type(data.shipping_address02);

                //nonmember_shipping_tel
                await page.focus(form_shipping + ' tr.input_tel_ec > td > div.form_group_ec > input[name="order[shipping_address_attributes][tel01]"]');
                await page.keyboard.type(data.shipping_phone_number.trim());
            }
            //nonmember_payment_type
            console.log('data.payment_type = ', data.payment_type);
            const payment_type_select = 'form#new-view > #view-payment-information table:nth-child(1) > tbody > tr > td > div.form_group_ec > #payment_method_id';
            await page.focus(payment_type_select);
            await page.waitFor(1000);
            await page.select(payment_type_select, data.payment_type);
            await page.waitFor(1000);

            //select credit card payment
            if(data.payment_type === credit_delivery && data.login_type === login_type_member && typeof data.card_select != "undefined"){
                const payment_type_element = 'form#new-view > #view-payment-information > #view-credit-card-information > table.landing_form_ec > tbody > tr.input_card_number_ec > td > div.form_group_ec > #card-id';
                if(await page.$(payment_type_element) !== null){
                    await page.focus(payment_type_element);
                    await page.select(payment_type_element, data.card_select);
                }
            }
            if(data.payment_type === credit_delivery){
                if(data.login_type === login_type_guest || (data.login_type === login_type_member && (typeof data.card_select == "undefined" || (typeof data.card_select != "undefined" && data.card_select == '0')))){
                    if(typeof data.payment_token != "undefined" && data.payment_token != ''){
                        console.log('data.payment_token = ', data.payment_token);
                        //TEST credit card payment
                        await page.focus(form_credit_card_payment + ' tr.input_card_number_ec > td > div.form_group_ec > #view-input-card-number > p:nth-child(4) > #input-cc-number');
                        await page.keyboard.type('411111111111' + data.card_number);
                        await page.focus(form_credit_card_payment + ' tr.input_card_name_ec > td > div.form_group_ec > #input-cc-name');
                        await page.keyboard.type(data.card_name);
                        const card_m = form_credit_card_payment + ' tr.input_card_expiration_ec > td > div.form_group_ec > p > #input-cc-month';
                        await page.focus(card_m);
                        await page.select(card_m, data.card_month);
                        const card_y = form_credit_card_payment + ' tr.input_card_expiration_ec > td > div.form_group_ec > p > #input-cc-year';
                        await page.focus(card_y);
                        await page.select(card_y, data.card_year);
                         await page.waitFor(3500);
                        const token_elm = 'form#new-view > #view-payment-information > #view-credit-card-information > input#input-cc-access-token';

                        const tmp_token = await page.$eval(token_elm, el => el.value );
                        console.log("tmp_token", tmp_token);

                        await page.evaluate((token_elm) => {
                            document.querySelector(token_elm).setAttribute('type', 'text')
                    }, token_elm);
                    await page.focus(token_elm);
                    await page.evaluate((token_elm) => {
                        document.querySelector(token_elm).value = ''
                }, token_elm);
                await page.keyboard.type(data.payment_token);
                const tmp_token2 =  await page.$eval(token_elm, el => el.value );
                console.log("tmp_token2", tmp_token2);
                    }
                }
            }
            //nonmember_payment_schedule
            if(data.product_code === product_code_426){
                await page.focus('form#new-view > #view-payment-schedule > #container_payment_schedule > #container_delivery_schedule_by_term > table > tbody > tr > td > div.form_group_ec > p > #select_scheduled_to_be_delivered_every_x_day');
                const shipping_cycle_option = 'form#new-view > #view-payment-schedule > #container_payment_schedule > #container_delivery_schedule_by_term > table > tbody > tr > td > div.form_group_ec > p > #select_scheduled_to_be_delivered_every_x_day > option';
                const shipping_cycle_id = 'form#new-view > #view-payment-schedule > #container_payment_schedule > #container_delivery_schedule_by_term > table > tbody > tr > td > div.form_group_ec > p > #select_scheduled_to_be_delivered_every_x_day';
                const shipping_cycles = await page.$$(shipping_cycle_option);
                for (const shipping_cycle of shipping_cycles) {
                    const item_val = await page.evaluate(el => el.value, shipping_cycle);
                    if (data.shipping_cycle == item_val) {
                        await page.select(shipping_cycle_id, item_val);
                    }
                }
            }
            if(data.screen_short_flg === 1){
                await page.pdf({path: 'screen_short/medium'+ Date.now() +'.pdf', format: 'A4', printBackground: true});
            }
            await page.waitFor(1000);
            //validate email
            if (await page.$(form_seletor + ' tr.input_email_ec > td > div.form_group_ec > div.emailformError') !== null){
                response.error_message = 'メールアドレスは既に登録済みです。';
                res.status(500).json(response);
            }else{
                // await page.pdf({path: 'screen_short/medium'+ Date.now() +'.pdf', format: 'A4', printBackground: true});
                //submit form
                console.log("start_submit");
                await Promise.all([
                    page.click('form#new-view > div.submit_ec > center > #submit'),
                    page.waitForNavigation()
                ]);
                console.log("end_submit");
                // await page.click('form#new-view > div.submit_ec > center > #submit');
                // await page.waitFor(1000);
                const shopping_confirm_url = await page.evaluate('location.href');

                console.log('after submit', shopping_confirm_url);
                // await page.pdf({path: 'screen_short/medium'+ Date.now() +'.pdf', format: 'A4', printBackground: true});
                if(shopping_confirm_url != shopping_nonmember_url){
                    //submit form
                    console.log('start click order');
                    await Promise.all([
                        page.click('div#confirm-view > div.form_container_ec > div.form_confirm_ec > div.block_ec > div.confirm_content_ec > div.center_ec > form.form_inline_ec > input#submit'),
                        page.waitForNavigation()
                    ]);
                    console.log('end click order');

                    const thank_url = await page.evaluate('location.href');
                    console.log('thank_url = ',thank_url);
                    if(thank_url.indexOf('complete') != -1) {
                        console.log("order success");
                        const order_id = await page.$eval('div.perform_content_ec > table.table_ec > tbody > tr > td#order-number', el => el.innerText);
                        //update puppeteer step2
                        puppeteerRequest.findOneAndUpdate({_id: idObject}, {
                            $set: {
                                status: 1,
                                url: shopping_confirm_url,
                                response_body: 'DONE',
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {
                            if (err) throw err;
                        });
                        response.success = 1;
                        response.order_id = order_id;
                        res.status(200).json(response);
                    } else {
                        console.log("order error");
                        error_message = "order error";
                        const error_elm = 'form#new-view > #alert-box > p';
                        if(await page.$(error_elm) !== null){
                            error_message = await page.$eval(error_elm, el => el.innerText);
                        }
                        puppeteerRequest.findOneAndUpdate({_id: idObject}, {
                            $set: {
                                status: 3,
                                url: shopping_confirm_url,
                                error_message: error_message,
                                response_body: 'ERROR',
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {
                            if (err) throw err;
                        });
                        response.error_message = error_message;
                        res.status(500).json(response);
                    }
                }else {
                    console.log("入力に不備があります。");
                    var error_message = "入力に不備があります。";
                    const error_elm = 'form#new-view > #alert-box > p';
                    if(await page.$(error_elm) !== null){
                        error_message = await page.$eval(error_elm, el => el.innerText);
                    }
                    puppeteerRequest.findOneAndUpdate({_id: idObject}, {
                        $set: {
                            status: 3,
                            url: shopping_nonmember_url,
                            error_message: error_message,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });
                    response.error_message = error_message;
                    res.status(500).json(response);
                }
            }
        } catch (e) {
            console.log('Confirm exception', e);
            var exception_index_1 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                status: 3,
                error_message: e,
                index: 1,
                param: data
            };
            puppeteerRequest.findOneAndUpdate({_id: idObject}, {
                $set: {
                    status: 3,
                    url: data.url,
                    error_message: e,
                    updated_at: new Date()
                }
            }, {upsert: false, multi: false}, function (err, result) {
                if (err) throw err;
            });
            savePuppeteerException(exception_index_1);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }
        await browser.close();
    })()
}

function checkPreviousStep(body, data, res) {
    var intervalObject = setInterval(function () {
        puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 1, status: 1},function(err, result) {
            if (result) {
                clearInterval(intervalObject);
                puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 2, status: 0},function(err, result2) {
                    if (result2) {
                        var cookie = result2.param.cookie;
                        var idObject = result2._id;
                        data.shopping_confirm_url = result2.url;
                        result2.status = 2;
                        result2.updated_at = new Date();
                        result2.request_body = body;
                        result2.save(function(err){
                            if(err) throw err;
                            executeOrder(idObject, cookie, data, res);
                        });
                    }
                })
            }
        });
    }, 2000);
}

function executeOrder(idObject, cookie, data, res) {
    var response = {};
    (async () => {
        //const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

        const browser =
            await puppeteer.launch({
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--no-sandbox',
                    '--no-zygote',
                    '--single-process'
                ]
            });

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', request => {
            //console.log(request.resourceType());
            var rtype = request.resourceType();
        var request_url = request.url();
        if(request_url.indexOf("google") !== -1
            || request_url.indexOf("ladsp") !== -1
            || request_url.indexOf("yahoo") !== -1
            || request_url.indexOf("socdm") !== -1
            || request_url.indexOf("facebook") !== -1
            || request_url.indexOf("kozuchi") !== -1
            || request_url.indexOf("kozuchi") !== -1
        ){
            request.continue().catch(err => console.error(""));
        } else if (rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype === 'script' || request.url().indexOf("organic") == -1) {
                request.abort().catch(err => console.error(""));
            } else {
                console.log(request.url());
                request.continue().catch(err => console.error(""));

            }
        });

        try {
            if (typeof cookie != "undefined" && Array.isArray(cookie) &&  cookie.length > 0) {
                console.log('start order');
                var error_message = '';
                const cookie_new = [];
                //const page = await browser.newPage();
                const shopping_confirm_url = data.shopping_confirm_url;
                cookie.forEach(function (element) {
                    element.url = shopping_confirm_url;
                    cookie_new.push(element);
                });

                await page.setCookie(...cookie_new)
                await page.goto(shopping_confirm_url, {waitUntil: 'networkidle0'});
                if(data.screen_short_flg === 1){
                    await page.pdf({path: 'screen_short/order_'+ Date.now() +'.pdf', format: 'A4', printBackground: true});
                }
                //check url confirm
                console.log('page url =',page.url());
                if(page.url() !== shopping_confirm_url){
                    error_message = "Common error";
                    const error_elm = 'form#new-view > #alert-box > p';
                    if(await page.$(error_elm) !== null){
                        error_message = await page.$eval(error_elm, el => el.innerText);
                    }
                    response.error_message = error_message;
                    await browser.close();
                    return res.status(500).json(response);
                }
                //submit form
                await Promise.all([
                    page.click('div#confirm-view > div.form_container_ec > div.form_confirm_ec > div.block_ec > div.confirm_content_ec > div.center_ec > form.form_inline_ec > input#submit'),
                    page.waitForNavigation()
                ]);
                console.log('end order');
                const thank_url = await page.evaluate('location.href');
                console.log('thank_url = ',thank_url);
                if(thank_url.indexOf('complete') != -1) {
                    console.log("order success");
                    //update puppeteer step2
                    puppeteerRequest.findOneAndUpdate({_id: idObject}, {
                        $set: {
                            status: 1,
                            url: shopping_confirm_url,
                            response_body: 'DONE',
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });
                    response.success = 1;
                    res.status(200).json(response);
                } else {
                    console.log("order error");
                    error_message = "order error";
                    const error_elm = 'form#new-view > #alert-box > p';
                    if(await page.$(error_elm) !== null){
                        error_message = await page.$eval(error_elm, el => el.innerText);
                    }
                    puppeteerRequest.findOneAndUpdate({_id: idObject}, {
                        $set: {
                            status: 3,
                            url: shopping_confirm_url,
                            error_message: error_message,
                            response_body: 'ERROR',
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });
                    response.error_message = error_message;
                    res.status(500).json(response);
                }
            } else {
                console.log("Session expired.");
                puppeteerRequest.findOneAndUpdate({_id: idObject}, {
                    $set: {
                        status: 3,
                        error_message: "Session expired",
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });

                response.error_message = "エラーが発生しました。再度ご試しください。";
                res.status(500).json(response);
            }
        } catch (e) {
            console.log('Order exception', e);
            var exception_index_2 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                status: 3,
                error_message: e,
                index: 2,
                param: data
            };
            puppeteerRequest.findOneAndUpdate({_id: idObject}, {
                $set: {
                    status: 3,
                    error_message: e,
                    updated_at: new Date()
                }
            }, {upsert: false, multi: false}, function (err, result) {
                if (err) throw err;
            });
            savePuppeteerException(exception_index_2);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }
        await browser.close();
    })()
}

router.post('/get_payment_card', function(req, res, next) {
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
    puppeteerRequest.findOne({cpid : connect_page_id, user_id: user_id, index: 0, status: 1},function(err, result) {
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
    var cookie = data.cookie;
    //console.log("start organicGetPaymentCard", data);
    var response = {};
    (async () => {
        const browser =
            await puppeteer.launch({
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--no-sandbox',
                    '--no-zygote',
                    '--single-process'
                ]
            });
        //const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', request => {
            //console.log(request.resourceType());
            var rtype = request.resourceType();
            var request_url = request.url();
            if(request_url.indexOf("google") !== -1
                || request_url.indexOf("ladsp") !== -1
                || request_url.indexOf("yahoo") !== -1
                || request_url.indexOf("socdm") !== -1
                || request_url.indexOf("facebook") !== -1
                || request_url.indexOf("kozuchi") !== -1
                || request_url.indexOf("kozuchi") !== -1
            ){
                request.continue().catch(err => console.error(""));
            }else if (rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype === 'script' || request.url().indexOf("organic") == -1) {
                request.abort().catch(err => console.error(""));
            } else {
                //console.log(request.url());
                request.continue().catch(err => console.error(""));

            }
        });
        //await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        try {
            if (typeof cookie != "undefined" && cookie != '') {
                cookie.url = data.url_card;
                //await page.setCookie(cookie);
                var cookie_new1 = [];
                cookie.forEach(function (element) {
                    element.url = data.url_card;
                    cookie_new1.push(element);
                });
                await page.setCookie(...cookie_new1);


                await page.goto(data.url_card, {waitUntil: 'networkidle0'});
                const header_element = ".ncontainer > .content-right > .breadcrumb > li:nth-child(2) > span";
                await page.waitForSelector(header_element);
                const customer_edit_element = "body > main > div > div.nav-customer.mb-40 > a:nth-child(8)";
                await Promise.all([
                    page.click(customer_edit_element),
                    page.waitForNavigation()
                ]);
                //await page.screenshot({path: 'pictures/' + 'login_' + Date.now() + '.png', fullPage: true});
                var result_json = {
                    type: "006",
                    name: 'pulldown_time',
                    data: []
                };
                var list = [];
                const table_element = '.content-right > #customers-card-index-view > div.table-responsive > table.table > tbody > tr';
                const rows = await page.$$(table_element);
                for (let i = 2; i <= rows.length; i++) {
                    const row = '.content-right > #customers-card-index-view > div.table-responsive > table.table > tbody > tr:nth-child('+ i +')';
                    const card_name_element =  row + ' > td:nth-child(1)';
                    const card_code_element =  row + '> td:nth-child(6) > a:nth-child(2)';
                    const card_name = await page.$(card_name_element);
                    const card_name_value = await (await card_name.getProperty('textContent')).jsonValue();
                    const url = await page.$eval(card_code_element, a => a.href);
                    var card_code = splitCardUrl(url);
                    //console.log("card_name", card_name);
                    //console.log("card_code", card_code);
                    list.push({
                        value: card_code,
                        text: card_name_value
                    });
                }

                console.log("list=", list);
                response.count = list.length;

                if(list.length < 5) {
                    list.push({
                        value: "0",
                        text: '新しく登録する'
                    });
                }

                result_json['data'] = list;
                console.log("response=", result_json);
                response.data = result_json;

                res.status(200).json(response);
            }else {
                response.error_message = "エラーが発生しました。再度ご試しください。";
                res.status(500).json(response);
            }
        } catch (e) {
            console.log("organicGetPaymentCard exception", e);
            var exception_index_3 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                status: 3,
                error_message: e,
                param: data
            };
            savePuppeteerException(exception_index_3);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }
        await browser.close();
    })()
}

router.post('/validate_mail', function(req, res, next) {
    console.log("start validate_mail");
    var body = req.body;
    var mail = body.mail;
    var url = body.url;
    console.log("======body====", body);
    var response = {};
    (async () => {
        // const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const browser =
            await puppeteer.launch({
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--no-sandbox',
                    '--no-zygote',
                    '--single-process'
                ]
        });

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', request => {
            var rtype = request.resourceType();
    var request_url = request.url();
    if(request_url.indexOf("google") !== -1
        || request_url.indexOf("ladsp") !== -1
        || request_url.indexOf("yahoo") !== -1
        || request_url.indexOf("socdm") !== -1
        || request_url.indexOf("facebook") !== -1
        || request_url.indexOf("kozuchi") !== -1
        || request_url.indexOf("kozuchi") !== -1
    ){
        request.continue().catch(err => console.error(""));
    } else if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype == "script") {
                request.abort();
            } else {
                console.log(rtype);
                if(rtype == "document"){
                    if(request.url().indexOf("organic") !== -1){
                        console.log(request.url());
                        request.continue();
                    }else{
                        request.abort();
                    }
                }else{
                    console.log(request.url());
                    request.continue();
                }
            }
        });
        try {
            console.log("url", url);
            await page.goto(url, {waitUntil: 'load'});
            const header_element = ".ncontainer > .content-right > .breadcrumb > li:nth-child(2) > span";
            await page.waitForSelector(header_element);

            const name1 = '#new_customer > div > div:nth-child(1) > div > div > div:nth-child(1) > input';
            const name2 = '#new_customer > div > div:nth-child(1) > div > div > div:nth-child(2) > input';
            const katakana1 = '#new_customer > div > div:nth-child(2) > div > div > div:nth-child(1) > #customer_billing_address_attributes_kana01';
            const katakana2 = '#new_customer > div > div:nth-child(2) > div > div > div:nth-child(2) > #customer_billing_address_attributes_kana02';
            const zip01 = '#new_customer > div > div:nth-child(3) > div > div.form-inline > #customer_billing_address_attributes_zip01';
            const zip02 = '#new_customer > div > div:nth-child(3) > div > div.form-inline > #customer_billing_address_attributes_zip02';
            const pref = '#new_customer > div > div:nth-child(4) > div > #customer_billing_address_attributes_prefecture_name';
            const addr01 = '#new_customer > div > div:nth-child(5) > div > #customer_billing_address_attributes_addr01';
            const addr02 = '#new_customer > div > div:nth-child(6) > div > #customer_billing_address_attributes_addr02';
            const addr03 = '#new_customer > div > div:nth-child(7) > div > #customer_billing_address_attributes_addr03';
            const tel01 = '#new_customer > div > div:nth-child(8) > div > div > #customer_billing_address_attributes_tel01';
            const tel02 = '#new_customer > div > div:nth-child(8) > div > div > #customer_billing_address_attributes_tel02';
            const tel03 = '#new_customer > div > div:nth-child(8) > div > div > #customer_billing_address_attributes_tel03';
            const customer_sex = '#new_customer > div > div:nth-child(11) > div > #customer_sex_id';
            const year = '#new_customer > div > div:nth-child(13) > div > div > #customer_birth_1i';
            const month = '#new_customer > div > div:nth-child(13) > div > div > #customer_birth_2i';
            const day = '#new_customer > div > div:nth-child(13) > div > div > #customer_birth_3i';
            const password_first = '#new_customer > div > div:nth-child(14) > div > #customer_password';
            const password_second = '#new_customer > div > div:nth-child(15) > div > #customer_password_confirmation';
            const magazine = '#new_customer > div > div:nth-child(16) > div > #customer_optin';
            const mail_element = '#new_customer > div > div:nth-child(9) > div > #customer_email';
            const mail_confirm_element = '#new_customer > div > div:nth-child(10) > div > #customer_email_confirmation';

            // remove class require
            await page.evaluate((name1, name2, katakana1, katakana2, zip01, zip02, pref, addr01, addr02, addr03, tel01, tel02, tel03,
                customer_sex, year, month, day, password_first, password_second, magazine) => {
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
            }, name1, name2, katakana1, katakana2, zip01, zip02, pref, addr01, addr02, addr03, tel01, tel02, tel03,
                customer_sex, year, month, day, password_first, password_second, magazine);

            //input mail
            await page.click(mail_element);
            await page.focus(mail_element);
            await page.evaluate((mail_element) => {
                document.querySelector(mail_element).value = ''
            }, mail_element);
            await page.keyboard.type(mail);

            await page.click(mail_confirm_element);
            await page.focus(mail_confirm_element);
            await page.evaluate((mail_confirm_element) => {
                document.querySelector(mail_confirm_element).value = ''
            }, mail_confirm_element);
            await page.keyboard.type(mail);

            //validate
            const error_text = "メールアドレスは既に登録済みです。";
            const error_element = '#new_customer > div.alert.alert-danger > p.text';
            await page.click('#new_customer > div > div:nth-child(17) > div > input');
            await page.waitForSelector(error_element);
            await page.screenshot({path: 'pictures/login1111' + Date.now() + '.png', fullPage: true});
            var total_err = await page.$$(error_element);
            var validate_flg = false;
            console.log(total_err.length);
            for (let i = 1; i <= total_err.length; i++) {
                const row = '#new_customer > div.alert.alert-danger > p:nth-child('+ i +')';
                const error_element = await page.$(row);
                const error_value = await (await error_element.getProperty('textContent')).jsonValue();
                console.log("error_value=", error_value);
                if(error_value == error_text) {
                    validate_flg = true;
                    break;
                }
            }

            console.log(validate_flg);
            if(validate_flg) {
                response.error_message = 'メールアドレスは既に登録済みです。';
                res.status(500).json(response);
            } else {
                response.message = 'success';
                res.status(200).json(response);
            }
        } catch (e) {
            console.log(e);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }

        await browser.close();
    })()
});

router.post('/getPrice', function(req, res, next) {
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
    if(payment_type == "1"){

    }else{
        order_settlement_fee = 259;
        total += order_settlement_fee;
    }
    if(product_code == "426" || product_code == "417"){
        product_unit_price = 980;
        total += product_unit_price;

    }else if(product_code == "235"){
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

function splitZipcode(zipcode){
    var result = {
        zipcode1: '',
        zipcode2: '',
    };
    if (typeof zipcode != "undefined" && zipcode) {
        result['zipcode1'] = zipcode.slice(0,3);
        result['zipcode2'] = zipcode.slice(3,8);
    }
    return result;
}

function splitPhoneNumber(phone_number){
    var result = {
        phone1: '',
        phone2: '',
        phone3: '',
    };
    if (typeof phone_number != "undefined" && phone_number != '') {
        var phone_arr = phone_number.split("-");
        if(phone_arr.length == 3){
            result['phone1'] = phone_arr[0];
            result['phone2'] = phone_arr[1];
            result['phone3'] = phone_arr[2];
        }
    }
    return result;
}

function splitBirthday(birth_day){
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
    if(arr) {
        var result = [];
        arr.forEach(function (element) {
            if((element.name == 'guest_token' || element.name == '_ec_force_session') && element.value != '') {
                result.push({
                    name: element.name,
                    value: element.value
                });
            }
        });
        return result
    }
    return false;
}

function getCookieFormDb(cookie, url){
    var cookie_new1 = [];
    cookie.forEach(function (element) {
        element.url = url;
        cookie_new1.push(element);
    });
    return cookie_new1;
}

function savePuppeteerException(data){
    var exception_data = new puppeteerException(data);
    exception_data.save(function(err) {});
}

function splitCardUrl(url) {
    if(url) {
        var result  = [];
        result = url.split("/");
        return result.slice(-1)[0];
    }
}

module.exports = router;
