// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const mongoose = require("mongoose");
var model = require('../model');
const Zipcode = model.Zipcode;
const puppeteerRequest = model.PuppeteerRequest;
const puppeteerException = model.PuppeteerException;
const EfoMessageVariable = model.EfoMessageVariable;
const Variable = model.Variable;

const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');
const login_type_member = '1';
/*payment method*/
const credit_delivery = '2';
const r_pay_delivery = '17';

const quantity_default = 1;
const error_message_empty = "Input data is empty.";

const other_shipping_address = '2';
const variable_card_info = ["card_count", "card_list"];
const variable_login_info = ["login_flg"];
const variable_user_profile = ["first_name", "last_name", "furigana_first", "furigana_last", "zipcode", "address", "phone_number"];

router.post('/login', function(req, res, next) {
    console.time("login");
    console.log("=========call api login==========");
    var body = req.body;
    console.log("body=", body);
    var mail = body.mail;
    var password = body.password;
    var connect_page_id = body.cpid;
    var user_id = body.user_id;
    var login_type =  body.login_type;

    var response = {};
    if (typeof mail == "undefined" || mail == '' ||
        typeof password == "undefined" ||  password == '' ||
        typeof connect_page_id == "undefined" || connect_page_id == '' ||
        typeof user_id == "undefined" || user_id == '') {
        response.error_message = error_message_empty;
        return res.status(400).json(response);
    }
    var data = {connect_page_id : connect_page_id, user_id : user_id, mail: mail, password : password, login_type: login_type, url_login: body.url_login};
    var login_data = {
        cpid: connect_page_id,
        user_id: user_id,
        url: body.url_login,
        status: 0,
        error_message: "",
        index: 0,
        login_type: login_type,
        request_body: body,
        param: {
            mail: mail,
            password : password,
            cookie: {
                name: '',
                value: ''
            }
        },
    };

    puppeteerRequest.remove({cpid : connect_page_id, user_id: user_id, index: 0},function(err) {
        if(err) throw err;
        var puppeteer_data = new puppeteerRequest(login_data);
        puppeteer_data.save(function(err, result){
            if(err) throw err;
            data.object_id_index_0 = result._id;
            handleLogin(body, data, res);
        });
    });
    console.timeEnd("login");
});

router.post('/getPrice', function(req, res, next) {
    console.log("start getPrice");
    var body = req.body;
    console.log(body);
    var order_quantity = body.order_quantity;
    var product_unit_price = 6454;
    var discount = 1020;
    var response = {};
    var tax = 10;
    var order_settlement_fee = 0;
    var order_shipping_fee = 0;
    var total = product_unit_price * parseInt(order_quantity);

    var order_tax = Math.floor(total * tax / 100);
    var order_total_amount = total - discount + order_tax;

    response.product_unit_price = product_unit_price;
    response.product_quantity = order_quantity;
    response.order_amount = product_unit_price;
    response.order_shipping_fee = order_shipping_fee;
    response.order_settlement_fee = order_settlement_fee;
    response.order_tax = order_tax;
    response.order_total_amount = order_total_amount;

    console.log(response);
    res.status(200).json(response);

});

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
    if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype == "script") {
        request.abort();
    } else {
        console.log(rtype);
        if(rtype == "document"){
            if(request.url().indexOf("pure-medical") !== -1){
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
        await page.goto(url, {waitUntil: 'load'});
        const entry_email = '#cart_body > #cart > form > table > tbody > tr:nth-child(16) > td:nth-child(2) > #user_email';
        //input mail
        await page.click(entry_email);
        await page.focus(entry_email);
        await page.evaluate((entry_email) => {
            document.querySelector(entry_email).value = ''
        }, entry_email);
        await page.keyboard.type(mail);
        // check validate
        const error_element = '#cart_body > #cart > form > table > tbody > tr:nth-child(16) > td:nth-child(2) > div.formError';
        await Promise.all([
            page.click('#cart_body > #cart > form > p > span#hide_display3 > input#hide_display3'),
            page.waitForNavigation()
        ]);

        if(await page.$(error_element) !== null){
            response.error_message = '既に登録されているメールアドレスです。';
            res.status(500).json(response);
        }else{
            console.log('success');
            res.status(200).json({});
        }

    } catch (e) {
        response.error_message = "エラーが発生しました。再度ご試しください。";
        res.status(500).json(response);
    }

    await browser.close();
})()
});

router.post('/get_list_payment_card', function(req, res, next) {
    console.log("start get_list_payment_card");
    var body = req.body;
    var connect_page_id = body.cpid;
    var user_id = body.user_id;
    var landing_page_url = body.landing_page_url;

    var data = {
        connect_page_id: connect_page_id,
        user_id: user_id,
        landing_page_url: landing_page_url
    };
    console.log('body', body);

    var intervalObject = setInterval(function () {
        puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 0, status: 1},function(err, result2) {
            if (result2) {
                var cookie = result2.param.cookie;
                clearInterval(intervalObject);
                getListPaymentCard(body, cookie, data, res);
            }
        });
    }, 500);
});

router.post('/get_user_profile', function(req, res, next) {
    console.time("get_user_info");
    console.log("=========call api get_user_info==========");
    var body = req.body;
    console.log("body=", body);
    var connect_page_id = body.cpid;
    var user_id = body.user_id;
    var url =  body.url;
    var response = {};
    if (typeof connect_page_id == "undefined" || connect_page_id == '' ||
        typeof user_id == "undefined" || user_id == '' ||
        typeof url == "undefined" || url == '') {
        response.error_message = error_message_empty;
        return res.status(400).json(response);
    }

    var data = {
        connect_page_id: connect_page_id,
        user_id: user_id,
        url: url
    };
    var intervalObject = setInterval(function () {
        puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 0, status: 1},function(err, result2) {
            if (result2) {
                data.cookie = result2.param.cookie;
                clearInterval(intervalObject);
                getUserProfile(body, data, res);
            }
        });
    }, 2000);
    console.timeEnd("get_user_info");
});

router.post('/order', function(req, res, next) {
    console.log("time");
    console.log("=====call api order======");
    var body = req.body;
    var user_id = body.user_id;
    var quantity = (typeof  body.quantity != "undefined") ? body.quantity : quantity_default;
    var connect_page_id = body.cpid;
    var landing_page_url = body.landing_page_url;
    var login_type = body.login_type;
    /*new customer info*/
    var first_name = body.first_name;
    var last_name = body.last_name;
    var furigana_first = body.furigana_first;
    var furigana_last = body.furigana_last;
    var zipcode = body.zipcode;
    var pref = body.pref;
    var address01 = body.address01;
    var address02 = body.address02;
    var phone_number = body.phone_number;
    var gender = body.gender;
    var birthday = splitBirthday(body.birthday);
    var mail = body.mail;
    var password = body.password;
    /*shipping info*/
    var shipping_address_type = body.shipping_address_type;
    var shipping_last_name = body.shipping_last_name;
    var shipping_first_name = body.shipping_first_name;
    var shipping_furigana_first = body.shipping_furigana_first;
    var shipping_furigana_last = body.shipping_furigana_last;
    var shipping_zipcode = body.shipping_zipcode;
    var shipping_pref = body.shipping_pref;
    var shipping_address01 = body.shipping_address01;
    var shipping_address02 = body.shipping_address02;
    var shipping_phone_number = body.shipping_phone_number;
    var delivery_date = (typeof body.delivery_date != 'undefined') ? moment(body.delivery_date).format('YYYY-MM-DD') : '';
    var delivery_time = (typeof body.delivery_time != 'undefined') ? body.delivery_time : '';
    /*payment info*/
    var payment_method = body.payment_method;
    var card_token = body.card_token;
    var card_name = (typeof body.card_name !== 'undefined') ? body.card_name : 'EFO';
    var card_month =  body.card_month;
    var card_year =  body.card_year;
    var card_number =  body.card_number;
    var card_select = body.card_select;

    var response = {};

    console.log('=====start send data to request=====');
    // console.log("body", body);
    if (typeof user_id == "undefined" || user_id == '' || typeof connect_page_id == "undefined" || connect_page_id == '' ||
        typeof landing_page_url == "undefined" || landing_page_url == ''
    ) {
        response.error_message = error_message_empty;
        return res.status(400).json(response);
    }

    var token = crypto.randomBytes(64).toString('hex');
    var data = {
        user_id: user_id,
        connect_page_id: connect_page_id,
        quantity: quantity,
        landing_page_url: landing_page_url,
        user_token: token,
        first_name: first_name,
        last_name: last_name,
        furigana_first: furigana_first,
        furigana_last: furigana_last,
        zipcode: zipcode,
        pref: pref,
        address01: address01,
        address02: address02,
        phone_number: phone_number,
        gender: gender,
        year_bd: birthday.year,
        month_bd: birthday.month,
        day_bd: birthday.day,
        mail: mail,
        password: password,
        shipping_address_type: shipping_address_type,
        shipping_last_name: shipping_last_name,
        shipping_first_name: shipping_first_name,
        shipping_furigana_first: shipping_furigana_first,
        shipping_furigana_last: shipping_furigana_last,
        shipping_pref: shipping_pref,
        shipping_address01: shipping_address01,
        shipping_address02: shipping_address02,
        shipping_zipcode: shipping_zipcode,
        shipping_phone_number: shipping_phone_number,
        delivery_date: delivery_date,
        delivery_time: delivery_time,
        payment_method: payment_method,
        card_token: card_token,
        card_name: card_name,
        card_month: card_month,
        card_year: card_year,
        card_number: card_number,
        card_select: card_select
    };

    puppeteerRequest.remove({cpid: connect_page_id, user_id: user_id,index: {$gte: 1}}, function(err) {
        if (err) throw err;
        var landing_data = {
            cpid: connect_page_id,
            user_id: user_id,
            user_token: token,
            url: landing_page_url,
            status: 0,
            error_message: "",
            index: 1,
            request_body: body,
            param: data
        };

        var landing_save = new puppeteerRequest(landing_data);
        landing_save.save(function(err, result1) {
            data.object_id_index_1 =  result1._id;
            if(login_type === login_type_member){
                puppeteerRequest.findOne({cpid : connect_page_id, user_id: user_id, index: 0, status: 1},function(err, result) {
                    if(result) {
                        data.cookie = result.param.cookie;
                        executeOrder(body, data, res);
                    }
                });
            }else{
                executeOrder(body, data, res);
            }
        });
    });
    console.timeEnd("time");
});

function executeOrder(body, data, res) {
    var response = {};
    var landing_page_url = data.landing_page_url;
    var login_type = body.login_type;
    var checkout_url = '',
        thank_url = '';
    console.log("call executeOrder", data);
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
            var rtype = request.resourceType();
            if ((rtype === "xhr" && request.url().indexOf("cart.pure-medical.jp/shop/total_price_cal") == -1) || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || (rtype == "script" && request.url().indexOf("prototype.js") == -1)) {
                // console.log('ignore url === ', request.url());
                request.abort();
            } else {
                // console.log(rtype);
                if(rtype == "document"){
                    if(request.url().indexOf("pure-medical") !== -1){
                        // console.log(request.url());
                        request.continue();
                    }else{
                        request.abort();
                    }
                }else{
                    // console.log(request.url());
                    request.continue();
                }
            }
        });

        try {
            console.log(landing_page_url);
            // await page.goto(landing_page_url, {waitUntil: 'networkidle0'});
            if(login_type == login_type_member && typeof data.cookie != "undefined"){
                var cookie_new = data.cookie;
                // cookie_new.url = landing_page_url;
                cookie_new.url = "https://cart.pure-medical.jp/account/my_page_login";
                await page.setCookie(cookie_new);
            }
            await page.goto(landing_page_url, {waitUntil: 'networkidle0'});

            const button_select = 'body > div.ellest-bg1:nth-child(12) > .ellest-cart-v1 > .ellest-cart-v1-btn > a';
            await page.waitForSelector(button_select);
            console.log("start click submit");
            await Promise.all([
                page.click(button_select),
                page.waitForNavigation()
            ]);
            console.log("end  click submit");
            const cart_url = await page.evaluate('location.href');
            console.log("cart_url", cart_url);
            // console.log("start insert index 1 done ");
            if(cart_url != landing_page_url){
                await page.waitForSelector('form > #cart_body');
                const quantity_elm = 'form > #cart_body > #cart > #item_detail > table > tbody > tr:nth-child(4) > td#select_periodically_order_qty_0 > #periodically_order_order_qty_0';
                await page.focus(quantity_elm);
                await page.select(quantity_elm, data.quantity);
                await page.waitFor(2000);
                console.log("start click buy product");
                await Promise.all([
                    page.click('form > #cart_body > #cart_submit > #hide_cart_btn > #hide_display > input'),
                    page.waitForNavigation()
                ]);
                console.log("end click buy product");
                var info_customer_url = await page.evaluate('location.href');
                console.log("info_customer_url", info_customer_url);
                if(info_customer_url.indexOf('confirm') != -1){
                    console.log('2nd purchase');
                    if(info_customer_url.indexOf('order/confirm_credit') == -1){
                        //change set payment
                        const change_setting_btn = 'form > #cart >  .alignR:nth-child(13) > a > img';
                        await page.waitForSelector(change_setting_btn);
                        await Promise.all([
                            page.click(change_setting_btn),
                            page.waitForNavigation()
                        ]);
                        const after_url = await page.evaluate('location.href');
                        if(after_url.indexOf('order/select_order_method') != -1){
                            const payment_method_frm1 = '#cart_body > #cart > form > #expected_arrival >';
                            console.log('Coupon code');
                            const coupon_code_elm = payment_method_frm1 + ' table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(2) > #cart_coupon_code';
                            await page.focus(coupon_code_elm);
                            await page.waitFor(1000);
                            await page.keyboard.type('エレスト');
                            console.log('data.payment_method', data.payment_method);
                            const payment_method1 = payment_method_frm1 + ' #payment_method > table > tbody > tr > td > div > label >';
                            await page.click(payment_method1 + ' input[value="'+data.payment_method+'"]');
                            console.log("end change payment setting");
                            await Promise.all([
                                page.click('#cart_body > #cart > form > p > span#hide_display > input#hide_display'),
                                page.waitForNavigation()
                            ]);
                            info_customer_url = await page.evaluate('location.href');
                        }
                        //end change setting
                    }
                    //screen short
                    // await page.screenshot({path: 'screen_short/2nd_payment_' + Date.now() + '.png', fullPage: true});
                    //end screen short
                    // if(data.payment_method == credit_delivery){
                    if(info_customer_url.indexOf('order/confirm_credit') != -1){
                        if(login_type == login_type_member && typeof data.card_select != "undefined" && data.card_select != "new"){
                            console.log('2nd - start select card');
                            //select card payment
                            await Promise.all([
                                page.click('#credit_exist > table > tbody > tr > th > span#hide_display1 > input#hide_display1'),
                                page.waitForNavigation()
                            ]);
                            console.log('2nd - end select card');
                        }else{
                            const payment_btn = '#cart_body > #cart > form#check_new_credit > p > span#hide_display > input#hide_display';
                            if (typeof data.card_token != "undefined" && data.card_token != "") {
                                //DEMO credit card payment
                                const card_frm = '#cart_body > #cart > form#check_new_credit > div#credit_new > table > tbody >';
                                //     await page.focus(card_frm + ' tr > td > input#new_credit_card_number');
                                //     await page.keyboard.type('466885018348' + data.card_number);
                                //     await page.focus(card_frm + ' tr > td > input#new_credit_card_name');
                                //     await page.keyboard.type(data.card_name);
                                //     const card_m = card_frm + ' tr > td > #new_credit_effective_date_2i';
                                //     await page.focus(card_m);
                                //     await page.select(card_m, data.card_month);
                                //     const card_y = card_frm + ' tr > td > #new_credit_effective_date_1i';
                                //     await page.focus(card_y);
                                //     await page.select(card_y, data.card_year);
                                //     await page.focus(card_frm + ' tr > td > input#new_credit_security_code');
                                //     await page.waitFor(2000);
                                //     await page.keyboard.type('999');
                                await page.click(card_frm + ' tr > td > #new_credit_card_brand_other');
                                //END

                                const token_elm = '#cart_body > #cart > form#check_new_credit > #credit_token';
                                await page.focus(token_elm);
                                //test
                                await page.evaluate((token_elm) => {
                                    document.querySelector(token_elm).setAttribute('type', 'text')
                                }, token_elm);
                                //end
                                const card_token = data.card_token;
                                console.log('2nd card_token===', card_token);
                                await page.evaluate((token_elm, card_token) => {
                                    document.querySelector(token_elm).value = card_token
                                }, token_elm, card_token);

                                const tmp_token = await page.$eval(token_elm, el => el.value);
                                console.log("2nd tmp_token====", tmp_token);

                                const frm_elm = '#cart_body > #cart > form#check_new_credit';
                                await page.evaluate((frm_elm) => {
                                    document.querySelector('#cart_body > #cart > form#check_new_credit').removeAttribute('onsubmit');
                                }, frm_elm);

                                //screen short
                                // await page.screenshot({path: 'screen_short/set_payment_token_' + Date.now() + '.png', fullPage: true});
                                //end screen short

                                await page.waitFor(2000);
                                await Promise.all([
                                    page.click(payment_btn),
                                    page.waitForNavigation()
                                ]);
                            }
                        }
                        await page.waitFor(4000);
                    }
                    // await page.screenshot({path: 'screen_short/payment_2_' + Date.now() + '.png', fullPage: true});
                    await page.waitForSelector('#cart_body > form > #cart > p.clr > span#hide_display1 > input#hide_display1');
                    console.log("start click payment");
                    //ignore order
                    // response.error_message = 'TEST FILL DATA';
                    // return res.status(500).json(response);
                    await Promise.all([
                        page.click('#cart_body > form > #cart > p.clr > span#hide_display1 > input#hide_display1'),
                        page.waitForNavigation()
                    ]);
                    thank_url = await page.evaluate('location.href');
                    console.log("end click payment");

                    if(thank_url != '' && thank_url != info_customer_url){
                        console.log("payment success!");
                        const order_id = await page.$eval('#order_infobox > #order_no', el => el.innerText);
                        console.log('order_id=====', order_id);
                        puppeteerRequest.update({_id: data.object_id_index_1}, {
                            $set: {
                                status: 1,
                                url: thank_url,
                                updated_at: new Date()
                            }
                        }, {upsert: false}, function (err, result) {
                            if (err) throw err;
                        });
                        response.success = 1;
                        response.order_id = order_id;
                        res.status(200).json(response);
                    }
                }else{
                    console.log('the first purchase');
                    if(info_customer_url != cart_url){
                        console.log("start fill info customer");
                        if(login_type == login_type_member){
                            if(data.shipping_address_type == other_shipping_address){
                                console.log('start new shipping address');
                                const shipping_address_frm = '#cart_body > #cart > form > table > tbody >';
                                //nonmember_name_name
                                await page.focus(shipping_address_frm + ' tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > #shipping_address_family_name');
                                await page.keyboard.type(data.shipping_last_name);
                                await page.focus(shipping_address_frm + ' tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td:nth-child(4) > #shipping_address_first_name');
                                await page.keyboard.type(data.shipping_first_name);

                                //nonmember_kana_kana
                                await page.focus(shipping_address_frm + ' tr:nth-child(6) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > #shipping_address_family_name_kana');
                                await page.keyboard.type(data.shipping_furigana_last);
                                await page.focus(shipping_address_frm + ' tr:nth-child(6) > td:nth-child(2) > table > tbody > tr > td:nth-child(4) > #shipping_address_first_name_kana');
                                await page.keyboard.type(data.shipping_furigana_first);

                                //zipcode
                                console.log('data.shipping_zipcode', data.shipping_zipcode);
                                await page.focus(shipping_address_frm + ' tr:nth-child(8) > td:nth-child(2) > table > tbody > tr > td > #shipping_address_zip > #shipping_address_zip');
                                await page.keyboard.type(data.shipping_zipcode);

                                //pref
                                console.log('data.shipping_pref', data.shipping_pref);
                                const pref_elm = shipping_address_frm + ' tr:nth-child(10) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr > td#shipping_address_pref > #shipping_address_pref';
                                await page.focus(pref_elm);
                                await page.select(pref_elm, data.shipping_pref);

                                //address
                                console.log('data.shipping_address01', data.shipping_address01);
                                await page.focus(shipping_address_frm + ' tr:nth-child(10) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr:nth-child(2) > td#shipping_address_city > #shipping_address_city');
                                await page.keyboard.type(data.shipping_address01);
                                console.log('data.shipping_address02', data.shipping_address02);
                                await page.focus(shipping_address_frm + ' tr:nth-child(10) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr:nth-child(3) > td#shipping_address_address > #shipping_address_address');
                                await page.keyboard.type(data.shipping_address02);

                                //tel
                                console.log('data.shipping_phone_number', data.shipping_phone_number);
                                await page.focus(shipping_address_frm + ' tr:nth-child(12) > td:nth-child(2) > #shipping_address_tel');
                                await page.keyboard.type(data.shipping_phone_number);

                                await Promise.all([
                                    page.click('#cart_body > #cart > form > p > span#hide_display_main > input#hide_display'),
                                    page.waitForNavigation()
                                ]);
                                checkout_url = await page.evaluate('location.href');
                                console.log('end new shipping address');
                            }else{
                                console.log('use address register');
                                //screen short
                                // await page.screenshot({path: 'screen_short/' + data.connect_page_id + '_' + data.user_id + '_select_product_' + Date.now() + '.png', fullPage: true});
                                //end screen short
                                await Promise.all([
                                    page.click('#cart_body > #cart > div > div > span#hide_display > a'),
                                    page.waitForNavigation()
                                ]);
                                checkout_url = await page.evaluate('location.href');
                            }
                        }else{
                            const form_customer = 'form#new_signup > table > tbody >';
                            //nonmember_name_name
                            await page.focus(form_customer + ' tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > #shipping_address_family_name');
                            await page.keyboard.type(data.last_name);
                            await page.focus(form_customer + ' tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(4) > #shipping_address_first_name');
                            await page.keyboard.type(data.first_name);

                            //nonmember_kana_kana
                            await page.focus(form_customer + ' tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > #shipping_address_family_name_kana');
                            await page.keyboard.type(data.furigana_last);
                            await page.focus(form_customer + ' tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td:nth-child(4) > #shipping_address_first_name_kana');
                            await page.keyboard.type(data.furigana_first);

                            //zipcode
                            console.log('data.zipcode', data.zipcode);
                            await page.focus(form_customer + ' tr:nth-child(6) > td:nth-child(2) > table > tbody > tr > td > #shipping_address_zip > #shipping_address_zip');
                            await page.keyboard.type(data.zipcode);

                            //pref
                            console.log('data.pref', data.pref);
                            const pref_elm = form_customer + ' tr:nth-child(8) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr > td#shipping_address_pref > #shipping_address_pref';
                            await page.focus(pref_elm);
                            await page.select(pref_elm, data.pref);

                            //address
                            console.log('data.address01', data.address01);
                            await page.focus(form_customer + ' tr:nth-child(8) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr:nth-child(2) > td#shipping_address_city > #shipping_address_city');
                            await page.keyboard.type(data.address01);
                            console.log('data.address02', data.address02);
                            await page.focus(form_customer + ' tr:nth-child(8) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr:nth-child(3) > td#shipping_address_address > #shipping_address_address');
                            await page.keyboard.type(data.address02);

                            //shipping method
                            const shipping_method = form_customer + ' tr:nth-child(8) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr:nth-child(5) > td:nth-child(2) >';
                            await page.click(shipping_method + ' input[value="'+data.shipping_address_type+'"]');

                            //tel
                            console.log('data.phone_number', data.phone_number);
                            await page.focus(form_customer + ' tr:nth-child(10) > td:nth-child(2) > #shipping_address_tel');
                            await page.keyboard.type(data.phone_number);

                            //gender
                            console.log('data.gender', data.gender);
                            if(data.gender == '1') {
                                await page.click(form_customer + ' tr:nth-child(12) > td:nth-child(2) > #sex_1');
                            } else {
                                await page.click(form_customer + ' tr:nth-child(12) > td:nth-child(2) > #sex_2');
                            }

                            //year bd
                            console.log('data.year_bd', data.year_bd);
                            const year_elm = form_customer + ' tr:nth-child(14) > td:nth-child(2) > #user_birthday_1i';
                            await page.focus(year_elm);
                            await page.select(year_elm, data.year_bd.toString());

                            //month bd
                            console.log('data.month_bd', data.month_bd);
                            const month_elm = form_customer + ' tr:nth-child(14) > td:nth-child(2) > #user_birthday_2i';
                            await page.focus(month_elm);
                            await page.select(month_elm, data.month_bd.toString());

                            //date bd
                            console.log('data.day_bd', data.day_bd);
                            const date_elm = form_customer + ' tr:nth-child(14) > td:nth-child(2) > #user_birthday_3i';
                            await page.focus(date_elm);
                            await page.select(date_elm, data.day_bd.toString());

                            //mail
                            console.log('data.mail', data.mail);
                            await page.focus(form_customer + ' tr:nth-child(16) > td:nth-child(2) > #user_email');
                            await page.keyboard.type(data.mail);

                            //password
                            console.log('data.password', data.password);
                            await page.focus('form#new_signup > table:nth-child(4) > tbody > tr > td:nth-child(2) > div > #user_password');
                            await page.keyboard.type(data.password.toString());
                            await page.focus('form#new_signup > table:nth-child(4) > tbody > tr > td:nth-child(2) > #user_password_confirmation');
                            await page.keyboard.type(data.password.toString());

                            console.log('start click new user');
                            await Promise.all([
                                page.click('form#new_signup > p > span#hide_display2 > input#hide_display2'),
                                page.waitForNavigation()
                            ]);
                            checkout_url = await page.evaluate('location.href');
                            console.log('end click new user');
                            //other shipping address
                            if(data.shipping_address_type == other_shipping_address){
                                console.log('start new shipping address');
                                const shipping_address_frm = '#cart_body > #cart > form > table > tbody >';
                                //nonmember_name_name
                                await page.focus(shipping_address_frm + ' tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > #shipping_address_family_name');
                                await page.keyboard.type(data.shipping_last_name);
                                await page.focus(shipping_address_frm + ' tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td:nth-child(4) > #shipping_address_first_name');
                                await page.keyboard.type(data.shipping_first_name);

                                //nonmember_kana_kana
                                await page.focus(shipping_address_frm + ' tr:nth-child(6) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > #shipping_address_family_name_kana');
                                await page.keyboard.type(data.shipping_furigana_last);
                                await page.focus(shipping_address_frm + ' tr:nth-child(6) > td:nth-child(2) > table > tbody > tr > td:nth-child(4) > #shipping_address_first_name_kana');
                                await page.keyboard.type(data.shipping_furigana_first);

                                //zipcode
                                console.log('data.shipping_zipcode', data.shipping_zipcode);
                                await page.focus(shipping_address_frm + ' tr:nth-child(8) > td:nth-child(2) > table > tbody > tr > td > #shipping_address_zip > #shipping_address_zip');
                                await page.keyboard.type(data.shipping_zipcode);

                                //pref
                                console.log('data.shipping_pref', data.shipping_pref);
                                const pref_elm = shipping_address_frm + ' tr:nth-child(10) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr > td#shipping_address_pref > #shipping_address_pref';
                                await page.focus(pref_elm);
                                await page.select(pref_elm, data.shipping_pref);

                                //address
                                console.log('data.shipping_address01', data.shipping_address01);
                                await page.focus(shipping_address_frm + ' tr:nth-child(10) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr:nth-child(2) > td#shipping_address_city > #shipping_address_city');
                                await page.keyboard.type(data.shipping_address01);
                                console.log('data.shipping_address02', data.shipping_address02);
                                await page.focus(shipping_address_frm + ' tr:nth-child(10) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr:nth-child(3) > td#shipping_address_address > #shipping_address_address');
                                await page.keyboard.type(data.shipping_address02);

                                //tel
                                console.log('data.shipping_phone_number', data.shipping_phone_number);
                                await page.focus(shipping_address_frm + ' tr:nth-child(12) > td:nth-child(2) > #shipping_address_tel');
                                await page.keyboard.type(data.shipping_phone_number);

                                await Promise.all([
                                    page.click('#cart_body > #cart > form > p > span#hide_display_main > input#hide_display'),
                                    page.waitForNavigation()
                                ]);
                                checkout_url = await page.evaluate('location.href');
                                console.log('end new shipping address');
                            }
                        }
                        console.log("end fill info customer", checkout_url);
                        if(checkout_url != '' && checkout_url != info_customer_url){
                            console.log("start select delivery datetime and payment method");
                            console.log('data.delivery_date', data.delivery_date);
                            const payment_method_frm = '#cart_body > #cart > form > #expected_arrival >';
                            if(data.delivery_date != ''){
                                const delivery_date_elm = payment_method_frm + ' table > tbody > tr > td:nth-child(2) > #delivery_date > #order_expected_arrival_date';
                                await page.focus(delivery_date_elm);
                                await page.select(delivery_date_elm, data.delivery_date);
                            }
                            if(data.delivery_time != ''){
                                const delivery_time_elm = payment_method_frm + ' table > tbody > tr:nth-child(3) > td:nth-child(2) > #delivery_time_zone > #order_expected_arrival_time_zone';
                                await page.focus(delivery_time_elm);
                                await page.select(delivery_time_elm, data.delivery_time);
                            }
                            console.log('Coupon code');
                            const coupon_code_elm = payment_method_frm + ' table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(2) > #cart_coupon_code';
                            await page.focus(coupon_code_elm);
                            await page.keyboard.type('エレスト');
                            console.log('data.payment_method', data.payment_method);
                            const payment_method = payment_method_frm + ' #payment_method > table > tbody > tr > td > div > label >';
                            await page.click(payment_method + ' input[value="'+data.payment_method+'"]');
                            console.log("end select delivery datetime and payment method");
                            //
                            // await page.screenshot({path: 'screen_short/set_code_' + Date.now() + '.png', fullPage: true});
                            console.log("start click redirect page payment");
                            await Promise.all([
                                page.click('#cart_body > #cart > form > p > span#hide_display > input#hide_display'),
                                page.waitForNavigation()
                            ]);
                            const checkout_url1 = await page.evaluate('location.href');
                            console.log("end click redirect page payment");
                            if(checkout_url1 != checkout_url){
                                // await page.screenshot({path: 'screen_short/confirm_' + Date.now() + '.png', fullPage: true});
                                if(data.payment_method == credit_delivery){
                                    const payment_btn = '#cart_body > #cart > form#check_new_credit > p > span#hide_display > input#hide_display';
                                    await page.waitForSelector(payment_btn);
                                    console.log("start click credit card payment");
                                    if(login_type == login_type_member && typeof data.card_select != "undefined" && data.card_select != "new"){
                                        console.log('start select card');
                                        //select card payment
                                        await Promise.all([
                                            page.click('#credit_exist > table > tbody > tr > th > span#hide_display1 > input#hide_display1'),
                                            page.waitForNavigation()
                                        ]);
                                        console.log('end select card');
                                    }else {
                                        if (typeof data.card_token != "undefined" && data.card_token != "") {
                                        //DEMO credit card payment
                                            const card_frm = '#cart_body > #cart > form#check_new_credit > div#credit_new > table > tbody >';
                                            // await page.focus(card_frm + ' tr > td > input#new_credit_card_number');
                                            // await page.keyboard.type('466885018348' + data.card_number);
                                            // await page.focus(card_frm + ' tr > td > input#new_credit_card_name');
                                            // await page.keyboard.type(data.card_name);
                                            // const card_m = card_frm + ' tr > td > #new_credit_effective_date_2i';
                                            // await page.focus(card_m);
                                            // await page.select(card_m, data.card_month);
                                            // const card_y = card_frm + ' tr > td > #new_credit_effective_date_1i';
                                            // await page.focus(card_y);
                                            // await page.select(card_y, data.card_year);
                                            // await page.focus(card_frm + ' tr > td > input#new_credit_security_code');
                                            // await page.waitFor(2000);
                                            // await page.keyboard.type('999');
                                            await page.click(card_frm + ' tr > td > #new_credit_card_brand_other');
                                        //END
                                            const token_elm = '#cart_body > #cart > form#check_new_credit > #credit_token';
                                            await page.focus(token_elm);
                                            //test
                                            await page.evaluate((token_elm) => {
                                                document.querySelector(token_elm).setAttribute('type', 'text')
                                            }, token_elm);
                                            //end
                                            const card_token = data.card_token;
                                            console.log('card_token===', card_token);
                                            await page.evaluate((token_elm, card_token) => {
                                                document.querySelector(token_elm).value = card_token
                                            }, token_elm, card_token);

                                            const tmp_token = await page.$eval(token_elm, el => el.value);
                                            console.log("tmp_token====", tmp_token);

                                            const frm_elm = '#cart_body > #cart > form#check_new_credit';
                                            await page.evaluate((frm_elm) => {
                                                document.querySelector('#cart_body > #cart > form#check_new_credit').removeAttribute('onsubmit');
                                            }, frm_elm);

                                            //screen short
                                            // await page.screenshot({path: 'screen_short/set_payment_token_' + Date.now() + '.png', fullPage: true});
                                            //end screen short

                                            await page.waitFor(2000);
                                            await Promise.all([
                                                page.click(payment_btn),
                                                page.waitForNavigation()
                                            ]);
                                        }
                                    }
                                    console.log("end click credit card payment");
                                    await page.waitFor(4000);
                                }
                                // else{
                                //     await page.waitForSelector('#cart_body > form > #cart > p.clr > span#hide_display1 > input#hide_display1');
                                //     console.log("start click payment");
                                //     //screen short
                                //     await page.screenshot({path: 'screen_short/' + data.connect_page_id + '_' + data.user_id + '_payment_' + Date.now() + '.png', fullPage: true});
                                //     //end screen short
                                //     // response.error_message = "TEST FILL DATA";
                                //     // return res.status(500).json(response);
                                //
                                //     // await Promise.all([
                                //     //     page.click('#cart_body > form > #cart > p.clr > span#hide_display1 > input#hide_display1'),
                                //     //     page.waitForNavigation()
                                //     // ]);
                                //     // thank_url = await page.evaluate('location.href');
                                //     // console.log("end click payment");
                                // }

                                //screen short
                                // await page.screenshot({path: 'screen_short/payment_' + Date.now() + '.png', fullPage: true});
                                //end screen short
                                //ignore order
                                // response.error_message = 'TEST FILL DATA';
                                // return res.status(500).json(response);
                                await page.waitForSelector('#cart_body > form > #cart > p.clr > span#hide_display1 > input#hide_display1');
                                console.log("start click payment");
                                // await page.screenshot({path: 'screen_short/payment_1_' + Date.now() + '.png', fullPage: true});
                                await Promise.all([
                                    page.click('#cart_body > form > #cart > p.clr > span#hide_display1 > input#hide_display1'),
                                    page.waitForNavigation()
                                ]);
                                thank_url = await page.evaluate('location.href');
                                console.log("end click payment");

                                if(thank_url != '' && thank_url != checkout_url1){
                                    console.log("payment success!");
                                    const order_id = await page.$eval('#order_infobox > #order_no', el => el.innerText);
                                    console.log('order_id=====', order_id);
                                    puppeteerRequest.update({_id: data.object_id_index_1}, {
                                        $set: {
                                            status: 1,
                                            url: thank_url,
                                            updated_at: new Date()
                                        }
                                    }, {upsert: false}, function (err, result) {
                                        if (err) throw err;
                                    });
                                    response.success = 1;
                                    response.order_id = order_id;
                                    res.status(200).json(response);
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log('executeOrder exception', e);
            var exception_index_1 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                url: landing_page_url,
                status: 3,
                error_message: e,
                index: 1,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception_index_1);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }
        await browser.close();
    })()
}

function handleLogin(body, data, res) {
    console.log("start run handleLogin", data);
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
            var rtype = request.resourceType();
            if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype == "script") {
                request.abort();
            } else {
                console.log(rtype);
                if(rtype == "document"){
                    if(request.url().indexOf("pure-medical") !== -1){
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
            const url_login = (typeof data.url_login != 'undefined') ? data.url_login : "https://cart.pure-medical.jp/account/my_page_login";
            //const page = await browser.newPage();
            // cookie.url = url_login;
            // await page.setCookie(cookie);
            await page.goto(url_login, {waitUntil: 'networkidle0'});
            const redirect_url = page.url();
            // const header_element = "#contents > div.wrap > #main_middle > h1.page-heading";
            // await page.waitForSelector(header_element);
            // const curren_login_header = await page.$eval(header_element, el => el.innerText );
            // console.log("curren_login_header", curren_login_header);
            if(redirect_url.indexOf('my_page_menu') != -1) {
                console.log("===logged===");
                puppeteerRequest.findOneAndUpdate({_id:data.object_id_index_0}, {
                    $set: {
                        status: 1,
                        updated_at: new Date()
                    }
                }, {upsert: false}, function (err) {
                    if (err) throw err;
                });
                // response.login_flg = 1;
                res.status(200).json(response);
            } else {
                console.log("== start login====");
                const email_element = 'form > #loginbox > #account_login > table > tbody > tr:nth-child(1) > td:nth-child(2) > #user_email';
                const password_element = 'form > #loginbox > #account_login > table > tbody > tr:nth-child(2) > td:nth-child(2) > #user_password';
                //email
                await page.click(email_element);
                await page.focus(email_element);
                await page.evaluate((email_element) => {
                    document.querySelector(email_element).value = ''
                }, email_element);
                await page.keyboard.type(data.mail);
                // password
                await page.click(password_element);
                await page.focus(password_element);
                await page.evaluate((password_element) => {
                    document.querySelector(password_element).value = ''
                }, password_element);
                await page.keyboard.type(data.password);
                /*click button login*/
                await Promise.all([
                    page.click('form > #loginbox > #account_login > table > tbody > tr:nth-child(1) > td:nth-child(3) > span > input'),
                    page.waitForNavigation()
                ]);
                //screen short
                // await page.screenshot({path: 'screen_short/' + data.connect_page_id + '_' + data.user_id + '_login_' + Date.now() + '.png', fullPage: true});
                //end screen short
                const my_page_url =  await page.evaluate('location.href');

                if (my_page_url.indexOf('my_page_menu') != -1) {
                    const cookiesObject = await page.cookies();
                    var cookie_login = getCookie(cookiesObject);
                    console.log('cookie_login:', cookie_login);
                    puppeteerRequest.update({_id:data.object_id_index_0}, {
                        $set: {
                            status: 1,
                            "param.cookie": cookie_login,
                            updated_at: new Date()
                        }
                    }, {upsert: false}, function (err, result) {
                        if (err) throw err;
                    });
                    console.log("login success");
                    // response.login_flg = 1;
                    res.status(200).json(response);
                    var variable_value_arr = [];
                    variable_value_arr.push("1");
                    setTimeout(function () {
                        console.log("start setting");
                        for(var k = 0; k < variable_login_info.length; k++){
                            updateMessageVariable(data.connect_page_id, data.user_id, variable_login_info[k], variable_value_arr[k]);
                        }
                    }, 7000);
                } else {
                    var error_message = "メールアドレスが存在しないか、パスワードが誤っています。";
                    puppeteerRequest.update({_id: data.object_id_index_0}, {
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
            console.log("handleLogin exception", e);
            var exception_index_3 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                status: 3,
                error_message: e,
                index: 0,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception_index_3);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }

        await browser.close();
    })()
}

function getListPaymentCard(body, cookie, data, res) {
    console.log("start get_list_payment_card");
    var landing_page_url = data.landing_page_url;
    var response = {"count" : 0, "card_list": []};
    // res.status(200).json(response);

    // var response = {};
    var variable_value_arr = [];
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
        var rtype = request.resourceType();
        if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype == "script") {
            request.abort();
        } else {
            console.log(rtype);
            if(rtype == "document"){
                if(request.url().indexOf("pure-medical") !== -1){
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
        if (typeof cookie != "undefined" && cookie != '') {
            console.log('landing_page_url', landing_page_url);
            cookie.url = "https://cart.pure-medical.jp/account/my_page_login";
            await page.setCookie(cookie);
            await page.goto(landing_page_url, {waitUntil: 'networkidle0'});

            const button_select = 'body > div.ellest-bg1:nth-child(12) > .ellest-cart-v1 > .ellest-cart-v1-btn > a';
            await page.waitForSelector(button_select);
            console.log("start buy product submit");
            await Promise.all([
                page.click(button_select),
                page.waitForNavigation()
            ]);
            console.log("end  buy product submit");
            const cart_url = await page.evaluate('location.href');
            console.log("cart_url", cart_url);
            if(cart_url != landing_page_url){
                console.log("start submit");
                await Promise.all([
                    page.click('form > #cart_body > #cart_submit > #hide_cart_btn > #hide_display > input'),
                    page.waitForNavigation()
                ]);
                console.log("end submit");
                const confirm_credit_url = await page.evaluate('location.href');
                console.log("confirm_credit_url", confirm_credit_url);
                if(confirm_credit_url.indexOf('confirm_credit') != -1){
                    const button_select_card ='#credit_exist > table > tbody > tr > th > span#hide_display1 > input#hide_display1';
                    if(await page.$(button_select_card) !== null){
                        const card_number_elm =  '#credit_exist > table > tbody > tr:nth-child(5) > td:nth-child(2)';
                        var card_number = await page.$eval(card_number_elm, el => el.innerText);
                        card_number = card_number.split('\n');

                        var result_json = {
                            type: "006",
                            name: 'card_list',
                            data: []
                        };
                        var list = [
                            {
                                value: "0",
                                text: card_number[1]
                            },
                            {
                                value: "new",
                                text: '新しく登録する'
                            }
                        ];
                        result_json['data'] = list;
                        variable_value_arr.push("1" + "");
                        response.count = "1";
                        response.card_list = result_json;
                        // result_json['data'] = list;

                        variable_value_arr.push(result_json);
                    }else{
                        response.count = '0';
                        response.card_list = [];
                        console.log("response=", response);
                        variable_value_arr.push('0');
                        variable_value_arr.push([]);
                    }
                }else{
                    response.count = '0';
                    response.card_list = [];
                    variable_value_arr.push('0');
                    variable_value_arr.push([]);
                }
                //store variable value
                // for(var k = 0; k < variable_value_arr.length; k++){
                //     updateMessageVariable(data.connect_page_id, data.user_id, variable_card_info[k], variable_value_arr[k]);
                // }
                // res.status(200).json(response);
            }
            console.log('reponse get list card===========: ', response);
            res.status(200).json(response);
        } else {
            console.log("cookie not exist");
        }
    } catch (e) {
        console.log("getListPaymentCard exception", e);
        var exception = {
            cpid: data.connect_page_id,
            user_id: data.user_id,
            status: 3,
            error_message: e,
            request_body: body,
            param: data
        };
        savePuppeteerException(exception);
        response.error_message = "エラーが発生しました。再度ご試しください。";
        res.status(500).json(response);
    }
    await browser.close();
})()
}

function getUserProfile(body, data, res) {
    console.log('getUserProfile', data);
    // var response = {"data": []};
    // res.status(200).json(response);

    var response = {};
    var variable_value_arr = [];
    var cookie = data.cookie;
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
        var rtype = request.resourceType();
    if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype == "script") {
        request.abort();
    } else {
        console.log(rtype);
        if(rtype == "document"){
            if(request.url().indexOf("pure-medical") !== -1){
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
        if (typeof cookie != "undefined" && cookie != '') {
            cookie.url = "https://cart.pure-medical.jp/account/my_page_login";
            await page.setCookie(cookie);
            await page.goto(data.url, {waitUntil: 'load'});

            //get info
            // await page.screenshot({path: 'screen_short/profile_' + Date.now() + '.png', fullPage: true});
            const detail_box__body_inner = '#cart_body > #cart > form > table > tbody >';
            const last_name_elm = detail_box__body_inner + ' tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > #shipping_address_family_name';
            const first_name_elm = detail_box__body_inner + ' tr:nth-child(2) > td:nth-child(2) > table > tbody > tr > td:nth-child(4) > #shipping_address_first_name';
            const furigana_last_elm = detail_box__body_inner + ' tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > #shipping_address_family_name_kana';
            const furigana_first_elm = detail_box__body_inner + ' tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td:nth-child(4) > #shipping_address_first_name_kana';
            const zipcode_elm = detail_box__body_inner + ' tr:nth-child(6) > td:nth-child(2) > table > tbody > tr > td > #shipping_address_zip > #shipping_address_zip';
            const pref_elm = detail_box__body_inner + ' tr:nth-child(8) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr > td#shipping_address_pref > #shipping_address_pref';
            const addr01_elm = detail_box__body_inner + ' tr:nth-child(8) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr:nth-child(2) > td#shipping_address_city > #shipping_address_city';
            const addr02_elm = detail_box__body_inner + ' tr:nth-child(8) > td:nth-child(2) > #address_table_shipping_address > table > tbody > tr:nth-child(3) > td#shipping_address_address > #shipping_address_address';
            const tel_eml = detail_box__body_inner + ' tr:nth-child(10) > td:nth-child(2) > #shipping_address_tel';

            var last_name_value = await page.$eval(last_name_elm, el => el.value );
            var first_name_value = await page.$eval(first_name_elm, el => el.value );
            var last_kana_value = await page.$eval(furigana_last_elm, el => el.value );
            var first_kana_value = await page.$eval(furigana_first_elm, el => el.value );
            var zipcode_value = await page.$eval(zipcode_elm, el => el.value );
            var pref_value = await page.$eval(pref_elm, el => el.value);
            var addr01_value = await page.$eval(addr01_elm, el => el.value );
            var addr02_value = await page.$eval(addr02_elm, el => el.value );
            var tel01_value = await page.$eval(tel_eml, el => el.value );

            var pref_concat = pref_value + addr01_value + addr02_value;
            // variable_value_arr.push(first_name_value, last_name_value, first_kana_value, last_kana_value, zipcode_value, pref_concat, tel01_value);
            console.log('start set profile', variable_value_arr);
            // for(var i = 0; i < variable_value_arr.length; i++){
            //     updateMessageVariable(data.connect_page_id, data.user_id, variable_user_profile[i], variable_value_arr[i]);
            // }
            response.first_name = first_name_value;
            response.last_name = last_name_value;
            response.first_kana = first_kana_value;
            response.last_kana = last_kana_value;
            response.zipcode = zipcode_value;
            response.address = pref_concat;
            response.tel = tel01_value;
            res.status(200).json(response);
        } else {
            console.log("cookie not exist");
        }
    } catch (e) {
        console.log("getUserProfile exception", e);
        var exception = {
            cpid: data.connect_page_id,
            user_id: data.user_id,
            status: 3,
            error_message: e,
            request_body: body,
            param: data
        };
        savePuppeteerException(exception);
        response.error_message = "エラーが発生しました。再度ご試しください。";
        // res.status(500).json(response);
    }

    await browser.close();
})();
}

function getCookie(arr) {
    if(arr) {
        var result = {};
        arr.forEach(function (element) {
            if(element.name == '_session_id' && element.value != '') {
                result.name = '_session_id';
                result.value = element.value;
            }
        });
        return result
    }
    return false;
}

function savePuppeteerException(data){
    var exception_data = new puppeteerException(data);
    exception_data.save(function(err) {});
}

function splitBirthday(birth_day){
    console.log('=======birth_day======', birth_day);
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
    console.log('====result====', result);
    return result;
}

function updateMessageVariable(connect_page_id, user_id, variable_name, variable_value){
    Variable.findOne({connect_page_id: connect_page_id, variable_name: variable_name}, function (err, result) {
        if (err) throw err;
        console.log(result);
        if(result) {
            var now = new Date();
            EfoMessageVariable.update({
                    connect_page_id: connect_page_id,
                    user_id: user_id,
                    variable_id: result._id
                }, {$set: {variable_value: variable_value, type: "001", created_at: now, updated_at: now}},
                {upsert: true, multi: false}, function (err) {
                    if (err) throw err;
                });
        }
    });
}

module.exports = router;
