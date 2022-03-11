// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const mongoose = require("mongoose");
var model = require('../model');
const url_require = require('url');
const querystring = require('querystring');
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
/*payment method*/
const credit_delivery = 6;
const cash_delivery = 5;
const quantity_default = 1;
const error_message_empty = "Input data is empty.";
const product_code_1 = "001";
const product_code_2 = "002";
const product_code_3 = "003";

const pref_code_list = {
    "北海道":"1",
    "青森県":"2",
    "岩手県":"3",
    "宮城県":"4",
    "秋田県":"5",
    "山形県":"6",
    "福島県":"7",
    "茨城県":"8",
    "栃木県":"9",
    "群馬県":"10",
    "埼玉県":"11",
    "千葉県":"12",
    "東京都":"13",
    "神奈川県":"14",
    "新潟県":"15",
    "富山県":"16",
    "石川県":"17",
    "福井県":"18",
    "山梨県":"19",
    "長野県":"20",
    "岐阜県":"21",
    "静岡県":"22",
    "愛知県":"23",
    "三重県":"24",
    "滋賀県":"25",
    "京都府":"26",
    "大阪府":"27",
    "兵庫県":"28",
    "奈良県":"29",
    "和歌山県":"30",
    "鳥取県":"31",
    "島根県":"32",
    "岡山県":"33",
    "広島県":"34",
    "山口県":"35",
    "徳島県":"36",
    "香川県":"37",
    "愛媛県":"38",
    "高知県":"39",
    "福岡県":"40",
    "佐賀県":"41",
    "長崎県":"42",
    "熊本県":"43",
    "大分県":"44",
    "宮崎県":"45",
    "鹿児島県":"46",
    "沖縄県":"47"
};

router.post('/landing_page', function(req, res, next) {
    var body = req.body;
    var current_url = body.current_url;
    var data = {
        user_id: body.user_id,
        connect_page_id: body.cpid,
        landing_page_url: (current_url.indexOf('admin.botchan.chat/demo') !== -1) ? body.landing_page_url : current_url,
        quantity: (typeof  body.quantity != "undefined") ? body.quantity : quantity_default,
        product_code: body.product_code,
        tamagosamin_flg: false,
        cookie: {}
    };
    console.log("data", data);
    console.log('=====start landing page=====');
    puppeteerRequest.remove({cpid: data.connect_page_id, user_id: data.user_id}, function(err) {
        if (err) throw err;
        var landing_data = {
            cpid: data.connect_page_id,
            user_id: data.user_id,
            url: data.landing_page_url,
            status: 0,
            error_message: "",
            index: 0,
            request_body: body,
            param: data
        };

        var landing_save = new puppeteerRequest(landing_data);
        landing_save.save(function(err, result1) {
            if(err) throw  err;
            data.object_id_index_0 =  result1._id;
            landingPage(body, data, res);
        });
    });
});

router.post('/order', function(req, res, next) {
    console.log("=====call api order======");
    var body = req.body;
    var user_id = body.user_id;
    var quantity = (typeof  body.quantity != "undefined") ? body.quantity : quantity_default;
    var connect_page_id = body.cpid;
    var checkout_url = body.checkout_url;
    var first_name = body.first_name;
    var last_name = body.last_name;
    var furigana_first = body.furigana_first;
    var furigana_last = body.furigana_last;
    var zipcode = body.zipcode;
    var pref = body.pref;
    var address01 = body.address01;
    var address02 = body.address02;
    var phone = body.phone;
    var gender = body.gender;
    var birthday = splitBirthday2(body.birth_day);
    var mail = body.mail;
    var payment_method = body.payment_method;
    var delivery_time = body.delivery_time;
    var card_token = body.card_token;
    var card_name = body.card_name;
    var card_number = body.card_number;
    var card_expire_month = body.card_expire_month;
    var card_expire_year = body.card_expire_year;
    var product_code = body.product_code;
    var response = {};
    console.log("body", body);

    console.log('=====start send data to request=====');
    // if (typeof user_id == "undefined" || user_id == '' || typeof connect_page_id == "undefined" || connect_page_id == '' ||
    //     typeof landing_page_url == "undefined" || landing_page_url == ''
    // ) {
    //     response.error_message = error_message_empty;
    //     return res.status(400).json(response);
    // }

    var token = crypto.randomBytes(64).toString('hex');
    var data = {
        user_id: user_id,
        connect_page_id: connect_page_id,
        quantity: quantity,
        checkout_url: checkout_url,
        user_token: token,
        first_name: first_name,
        last_name: last_name,
        furigana_first: furigana_first,
        furigana_last: furigana_last,
        zipcode: zipcode,
        pref: pref,
        address01: address01,
        address02: address02,
        phone: phone,
        gender: gender,
        year_bd: birthday.year,
        month_bd: birthday.month,
        day_bd: birthday.day,
        mail: mail,
        payment_method: payment_method,
        card_token: card_token,
        delivery_time: delivery_time,
        card_name: card_name,
        card_number: card_number,
        card_expire_month: card_expire_month,
        card_expire_year: card_expire_year,
        product_code: product_code,
        ad_code: (typeof  body.ad_code != "undefined") ? body.ad_code : ''
    };

    puppeteerRequest.remove({cpid: connect_page_id, user_id: user_id,index: {$gte: 1}}, function(err) {
        if (err) throw err;
        var insert_data = {
            cpid: connect_page_id,
            user_id: user_id,
            user_token: token,
            url: checkout_url,
            status: 0,
            error_message: "",
            index: 1,
            request_body: body,
            param: data
        };

        var data_save = new puppeteerRequest(insert_data);
        data_save.save(function(err, result1) {
            if(err) throw  err;
            data.object_id_index_1 =  result1._id;
            // executeOrder(body, data, res);
            checkPrevious(body, data, res);
        });
    });
});

function landingPage(body, data, res){
    var landing_page_url = data.landing_page_url;
    var ad_code_value = getParam('ad_code', landing_page_url);
    var response = {"ad_code": ad_code_value};
    res.status(200).json(response);

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
            var rurl = request.url();

            if(rurl.indexOf("app.botchan.chat") !== -1 || rurl.indexOf("botchan2") !== -1){
                request.abort();
            }else if (rtype === "image") {
                if(rurl.indexOf('/common/img/img_tab01_m_') == -1 &&
                    rurl.indexOf('/common/img/btn001.jpg') == -1 &&
                    rurl.indexOf('common/img/img_tab01.jpg') == -1 &&
                    rurl.indexOf('/common/img/img_tab02_m_') == -1 &&
                    rurl.indexOf('/common/img/btn002.jpg') == -1 &&
                    rurl.indexOf('common/img/img_tab02.jpg') == -1 &&
                    rurl.indexOf('/common/img/img_tab03_m_') == -1 &&
                    rurl.indexOf('/common/img/btn003.jpg') == -1 &&
                    rurl.indexOf('/common/img/img_tab03.jpg') == -1
                ){
                    request.abort();
                }else{
                    console.log('include img url = ', rurl);
                    request.continue();
                }
            }else if (rtype === "xhr" || rtype === "font") {
                // console.log('ignore url === ', request.url());
                request.abort();
            }else if(rtype == "script"){
                if(rurl.indexOf("jquery.validationEngine") !== -1 || rurl.indexOf("pay_token.js") !== -1 || rurl.indexOf("zeus_token.js") !== -1){
                    // console.log(request.url());
                    request.abort();
                }else{
                    request.continue();
                }
            }else {
                request.continue();
            }
        });

        try {
            await page.goto(landing_page_url, {waitUntil: 'networkidle0'});
            // await page.screenshot({path: 'pictures/landing_page_url___' + Date.now() + '.png', fullPage: true});
            var button_select = "";
            var tamagosamin_flg = false;
            if (/iha-tamago/.test(landing_page_url)) {
                tamagosamin_flg = true;
                var tap_select = "";
                console.log('product_code', data.product_code.toString());
                if(data.product_code.toString() === product_code_1) {
                    tap_select  = "#wrap > .cv_box > #tabs01 > li:nth-child(1) > a > img";
                    button_select = "#wrap > .cv_box > #tab01 > p.btn > a > img";
                } else if(data.product_code.toString() === product_code_2) {
                    tap_select  = "#wrap > .cv_box > #tabs01 > li:nth-child(2) > a > img";
                    button_select = "#wrap > .cv_box > #tab02 > p.btn > a > img";
                } else if(data.product_code.toString() === product_code_3){
                    tap_select  = "#wrap > .cv_box > #tabs01 > li:nth-child(3) > a > img";
                    button_select = "#wrap > .cv_box > #tab03 > p.btn > a > img";
                } else {
                    console.log('product_code error', data.product_code.toString());
                }

                await page.waitForSelector(tap_select);
                console.log('tap_select', tap_select);
                await page.click(tap_select);
            } else {
                // sognando landing page
                button_select = "#pagetop > .conBox > .cvBox01 > .btn > a > img";
                // await page.pdf({path: 'pictures/tamagosamin_'+ Date.now() +'.pdf', format: 'A4', printBackground: true});
            }

            console.log('button_select', button_select);
            await page.waitForSelector(button_select);
            if (await page.$(button_select) !== null) {
                console.log("start click submit landing page");
                await Promise.all([
                    page.click(button_select),
                    page.waitForNavigation()
                ]);

                console.log("end  click landing page");
                const cart_url = await page.url();
                console.log("cart_url", cart_url);
                console.log("start insert index 0");
                if (cart_url != landing_page_url) {
                    const cookiesObject = await page.cookies();
                    var cookie = getCookie(cookiesObject);
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_0}, {
                        $set: {
                            status: 1,
                            "param.cookie": cookie,
                            "param.tamagosamin_flg": tamagosamin_flg,
                            updated_at: new Date()
                        }
                    }, {upsert: false}, function (err, result) {
                        if (err) throw err;
                        console.log("end insert index 0 done ");
                    });
                } else {
                    console.log('redirect cart error');
                    var exception = {
                        cpid: data.connect_page_id,
                        user_id: data.user_id,
                        url: cart_url,
                        status: 3,
                        error_message: 'cart_url error',
                        index: 0,
                        request_body: body,
                        param: data
                    };
                    savePuppeteerException(exception);
                }
            } else {
                console.log('can not load landing page');
                var exception = {
                    cpid: data.connect_page_id,
                    user_id: data.user_id,
                    url: landing_page_url,
                    status: 3,
                    error_message: 'can not load landing page',
                    index: 0,
                    request_body: body,
                    param: data
                };
                savePuppeteerException(exception);
            }
        } catch (e) {
            console.log('executeOrder exception', e);
            var exception = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                url: landing_page_url,
                status: 3,
                error_message: e,
                index: 0,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception);
        }
        await browser.close();
    })()
}

function checkPrevious(body, data, res) {
    console.log('checkPrevious');
    var intervalObject = setInterval(function () {
        puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 0, status: 1},function(err, result0) {
            if (result0) {
                var cookie = result0.param.cookie;
                var landing_page_url = result0.param.landing_page_url;
                var tamagosamin_flg = result0.param.tamagosamin_flg;
                data.landing_page_url = landing_page_url;
                data.tamagosamin_flg = tamagosamin_flg;
                puppeteerRequest.findOne({_id: data.object_id_index_1, status: 0},function(err, result1) {
                    if (result1) {
                        result1.status = 2;
                        result1.updated_at = new Date();
                        result1.save(function(err){
                            clearInterval(intervalObject);
                            console.log('start order');
                            executeOrder(body, data, cookie, res);
                        });
                    }
                });
            }
        });
    }, 2000);
}

function executeOrder(body, data, cookie, res) {
    console.log("executeOrder");
    var response = {};
    var landing_page_url = data.landing_page_url;
    // var ad_code_value = getParam('ad_code', data.current_url);
    var ad_code_value = data.ad_code;
    var ad_code_param = (ad_code_value != '') ? ('?ad_code=' + ad_code_value) : '';
    var cart_url = data.checkout_url + ad_code_param;
    var tamagosamin_flg = data.tamagosamin_flg;
    console.log("landing_page_url", landing_page_url);
    console.log("cart_url", cart_url);
    console.log("cookie", cookie);
    console.log("tamagosamin_flg", tamagosamin_flg);
    var is_done = false;

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
            var rurl = request.url();
            if(request.url().indexOf("app.botchan.chat") !== -1 || request.url().indexOf("botchan2") !== -1){
                request.abort();
            } else if (rtype === "image") {
                if(request.url().indexOf('upsell/ranshell/w03a/img09.jpg') == -1 && request.url().indexOf('upsell/ranshell/w03a/img10.jpg') == -1){
                    request.abort();
                }else{
                    console.log('include img url = ', request.url());
                    request.continue();
                }
            } else if (rtype === "xhr" || rtype === "font" || rtype === "stylesheet") {
                // console.log('ignore url === ', request.url());
                request.abort();
            } else {
                if(rtype == "script"){
                    if(request.url().indexOf("jquery.validationEngine") !== -1 || request.url().indexOf("pay_token.js") !== -1 || request.url().indexOf("zeus_token.js") !== -1){
                        // console.log(request.url());
                        request.abort();
                    }else{
                        // console.log('script == ', request.url());
                        if(is_done && rurl.indexOf("googleadservices.com/pagead/conversion.js") !== -1){
                            var thank_url = "https://store.tamagokichi.com/sc/umcart/show_cart?ad_code=" + ad_code_value;
                            response.thank_url = thank_url;
                            res.status(200).json(response);
                        }
                        request.continue();
                    }
                } else {
                    // console.log(request.url());
                    if(rurl.indexOf("checkouts/complete") !== -1){
                        is_done = true;
                    }
                    request.continue();
                }
            }
        });


        try {
            if (typeof cookie != "undefined" && cookie != '') {
                cookie.url = cart_url;
                await page.setCookie(cookie);

                await page.goto(cart_url, {waitUntil: 'networkidle0'});
                // var button_select = "";
                // var tamagosamin_flg = false;
                // if (/iha-tamago/.test(landing_page_url)) {
                // tamagosamin landing page
                // tamagosamin_flg = true;
                await page.waitForSelector('#contents > #frmCstm');
                const form_customer = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > table:nth-child(4) > tbody >';
                console.log("start fill info customer");
                //nonmember_name_name
                const lastname_ele = form_customer + ' tr:nth-child(1) > td.bg_none > input#lastname';
                const firstname_ele = form_customer + ' tr:nth-child(1) > td.bg_none > input#firstname';
                const lastkana_ele = form_customer + ' tr:nth-child(2) > td.bg_none > input#lastkana';
                const firstkana_ele = form_customer + ' tr:nth-child(2) > td.bg_none > input#firstkana';
                const email_ele = form_customer + ' tr:nth-child(3) > td.bg_none > input#email';
                const email_check_ele = form_customer + ' tr:nth-child(3) > td.bg_none > input#email_check';
                const phone_ele = form_customer + ' tr:nth-child(4) > td.bg_none > input#phone';
                const zipcode_ele = form_customer + ' tr:nth-child(5) > td.bg_none > .cf > input#zip';
                const addr01_ele = form_customer + ' tr:nth-child(7) > td.bg_none > p:nth-child(1) > input#addr01';
                const addr02_ele = form_customer + ' tr:nth-child(7) > td.bg_none > p:nth-child(4) > input#addr02';

                await page.evaluate((lastname_ele, firstname_ele, lastkana_ele, firstkana_ele, email_ele,
                                     email_check_ele, phone_ele, zipcode_ele, addr01_ele, addr02_ele) => {
                        document.querySelector(lastname_ele).value = '';
                        document.querySelector(firstname_ele).value = '';
                        document.querySelector(lastkana_ele).value = '';
                        document.querySelector(firstkana_ele).value = '';
                        document.querySelector(email_ele).value = '';
                        document.querySelector(email_check_ele).value = '';
                        document.querySelector(phone_ele).value = '';
                        document.querySelector(zipcode_ele).value = '';
                        document.querySelector(addr01_ele).value = '';
                        document.querySelector(addr02_ele).value = '';
                    }, lastname_ele, firstname_ele, lastkana_ele, firstkana_ele, email_ele, email_check_ele,
                    phone_ele, zipcode_ele, addr01_ele, addr02_ele);

                await page.focus(lastname_ele);
                await page.keyboard.type(data.last_name);
                await page.focus(firstname_ele);
                await page.keyboard.type(data.first_name);

                //nonmember_kana_kana
                await page.focus(lastkana_ele);
                await page.keyboard.type(data.furigana_last);
                await page.focus(firstkana_ele);
                await page.keyboard.type(data.furigana_first);

                //mail
                console.log('data.mail', data.mail);
                await page.focus(email_ele);
                await page.keyboard.type(data.mail);

                //confirm email
                await page.focus(email_check_ele);
                await page.keyboard.type(data.mail);

                //tel
                console.log('data.phone', data.phone);
                await page.focus(phone_ele);
                await page.keyboard.type(data.phone);

                //zipcode
                console.log('data.zipcode', data.zipcode);
                await page.focus(zipcode_ele);
                await page.keyboard.type(data.zipcode);

                //pref
                console.log('data.pref', data.pref);
                const pref_code = pref_code_list[data.pref] != 'undefined' ? pref_code_list[data.pref] : '';
                const pref_elm = form_customer + ' tr:nth-child(6) > td.bg_none > #pref';
                await page.focus(pref_elm);
                await page.select(pref_elm, pref_code);

                //address
                console.log('data.address01', data.address01);
                await page.focus(addr01_ele);
                await page.keyboard.type(data.address01);
                console.log('data.address02', data.address02);
                await page.focus(addr02_ele);
                await page.keyboard.type(data.address02);

                //gender
                console.log('data.gender', data.gender);
                if (data.gender != '') {
                    if (data.gender == '1') {
                        await page.click(form_customer + ' tr:nth-child(8) > td.bg_none > div.block_gender > p:nth-child(1) > input#gender_1');
                    } else {
                        await page.click(form_customer + ' tr:nth-child(8) > td.bg_none > div.block_gender > p:nth-child(2) > input#gender_2');
                    }
                }

                if (data.year_bd != "" && data.month_bd != "" && data.day_bd != "") {
                    //year bd
                    console.log('data.year_bd', data.year_bd);
                    const year_bd = (typeof data.year_bd != 'undefined') ? data.year_bd.toString() : '';
                    const year_elm = form_customer + ' tr:nth-child(9) > td.bg_none > #year';
                    await page.focus(year_elm);
                    await page.select(year_elm, year_bd);

                    //month bd
                    console.log('data.month_bd', data.month_bd);
                    const month_bd = (typeof data.month_bd != 'undefined') ? data.month_bd.toString() : '';
                    const month_elm = form_customer + ' tr:nth-child(9) > td.bg_none > #month';
                    await page.focus(month_elm);
                    await page.select(month_elm, month_bd);

                    //date bd
                    console.log('data.day_bd', data.day_bd);
                    const day_bd = (typeof data.day_bd != 'undefined') ? data.day_bd.toString() : '';
                    const date_elm = form_customer + ' tr:nth-child(9) > td.bg_none > #day';
                    await page.focus(date_elm);
                    await page.select(date_elm, day_bd);
                }

                //payment menthod
                console.log('data.payment_method', data.payment_method);
                const payment_method_elm = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > table#payment > tbody > tr > .bg_none > .block_payment_id > .mr_20 >';
                await page.click(payment_method_elm + ' input[value="' + data.payment_method + '"]');
                await page.waitFor(1000);

                //delivery_time
                console.log('tamagosamin_flg', tamagosamin_flg);
                console.log('delivery_time', data.delivery_time);
                if(typeof (data.delivery_time) === 'undefined' || data.delivery_time == '') {
                    data.delivery_time = 0;
                }
                if (tamagosamin_flg) {
                    if (parseInt(data.payment_method) == cash_delivery) {
                        const delivery_time_elm = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > table#dvr_date > tbody > tr:nth-child(4) > td.bg_none > #payment_time > select[name="dvr_time"]';
                        await page.focus(delivery_time_elm);
                        await page.select(delivery_time_elm, data.delivery_time);
                    }
                } else {
                    const delivery_time_elm = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > table#dvr_date > tbody > tr:nth-child(4) > td.bg_none > #payment_time > select[name="dvr_time"]';
                    if (await page.$(delivery_time_elm) !== null) {
                        await page.focus(delivery_time_elm);
                        await page.select(delivery_time_elm, data.delivery_time);
                    } else {
                        console.log('can not find delivery_time element');
                    }
                }

                if (parseInt(data.payment_method) === credit_delivery) {
                    const card_number = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(1) > td.bg_none > #cc_no';
                    const cc_expire_m = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(2) > td.bg_none > select[name="cc_expire_m"]';
                    const cc_expire_y = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(2) > td.bg_none > select[name="cc_expire_y"]';
                    const cc_owner = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(3) > td.bg_none > input[name="cc_owner"]';

                    // remove class require
                    await page.evaluate((card_number, cc_expire_m, cc_expire_y, cc_owner) => {
                        document.querySelector(card_number).classList.remove('validate[required,custom[integer]]');
                        document.querySelector(cc_expire_m).classList.remove('validate[required,exclamation]');
                        document.querySelector(cc_expire_y).classList.remove('validate[required,exclamation]');
                        document.querySelector(cc_owner).classList.remove('validate[required,custom[onlyLetterCp]]');
                    }, card_number, cc_expire_m, cc_expire_y, cc_owner);

                    var payment_token = data.card_token;
                    const token_elm = '#contents > #frmCstm > input[name="token"]';
                    const pay_token_order = '#contents > #frmCstm > #pay_token_order';
                    const pay_token_customer = '#contents > #frmCstm > #pay_token_customer';
                    const pay_token_error_code = '#contents > #frmCstm > #pay_token_error_code';
                    const tmp_token = await page.$eval(token_elm, el => el.value);
                    console.log("tmp_token", tmp_token);

                    await page.evaluate((pay_token_order, pay_token_customer, pay_token_error_code) => {
                        document.querySelector(pay_token_order).setAttribute('type', 'text');
                        document.querySelector(pay_token_customer).setAttribute('type', 'text');
                        document.querySelector(pay_token_error_code).setAttribute('type', 'text');
                    }, pay_token_order, pay_token_customer, pay_token_error_code);

                    await page.focus(pay_token_order);
                    await page.evaluate((pay_token_order, payment_token) => {
                        document.querySelector(pay_token_order).value = payment_token
                    }, pay_token_order, payment_token);

                    await page.focus(pay_token_customer);
                    await page.evaluate((pay_token_customer, payment_token) => {
                        document.querySelector(pay_token_customer).value = payment_token
                    }, pay_token_customer, payment_token);

                    await page.focus(pay_token_error_code);
                    await page.evaluate((pay_token_error_code) => {
                        document.querySelector(pay_token_error_code).value = 'no_error'
                    }, pay_token_error_code);

                    const new_pay_token_order = await page.$eval(pay_token_order, el => el.value);
                    const new_pay_token_customer = await page.$eval(pay_token_customer, el => el.value);
                    const new_pay_token_error_code = await page.$eval(pay_token_error_code, el => el.value);
                    console.log("new_pay_token_order", new_pay_token_order);
                    console.log("new_pay_token_customer", new_pay_token_customer);
                    console.log("new_pay_token_error_code", new_pay_token_error_code);
                }

                //term of use
                const term_of_use_elm = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > table#pp_heads > tbody > tr > td.bg_none > #privacy_check > #agree';
                if (await page.$(term_of_use_elm) !== null) {
                    const checkbox = await page.$(term_of_use_elm);
                    var is_checked = await (await checkbox.getProperty('checked')).jsonValue();
                    console.log("checkbox------", is_checked);
                    if(!is_checked) {
                        await page.click(term_of_use_elm);
                    }
                } else {
                    console.log('not find term_of_use element');
                }

                await Promise.all([
                    page.click('#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #btn_heads > #btn_next'),
                    page.waitForNavigation()
                ]);
                const checkout_url = await page.url();
                console.log('checkout_url', checkout_url);
                // confirm order
                if (/confirm/.test(checkout_url)) {
                    // await page.screenshot({path: 'pictures/test2' + Date.now() + '.png', fullPage: true});
                    // sognando up sale
                    if (!/iha-tamago/.test(landing_page_url) && data.product_code == product_code_2) {
                        const up_sale_selection = "#container > #contents > .section_wrapper > .section_a > .c_section-npb > #frmCstm > #upsale_section > div > p:nth-child(9) > a > img";
                        if (await page.$(up_sale_selection) !== null) {
                            await Promise.all([
                                page.click(up_sale_selection),
                                page.waitForNavigation()
                            ]);

                            var up_sale_checkout_url = await page.url();
                            console.log('up_sale_checkout_url==', up_sale_checkout_url);
                            if (/checkouts/.test(up_sale_checkout_url)) {
                                if (parseInt(data.payment_method) === credit_delivery) {
                                    const card_number = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(1) > td.bg_none > #cc_no';
                                    const cc_expire_m = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(2) > td.bg_none > select[name="cc_expire_m"]';
                                    const cc_expire_y = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(2) > td.bg_none > select[name="cc_expire_y"]';
                                    const cc_owner = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(3) > td.bg_none > input[name="cc_owner"]';

                                    // remove class require
                                    await page.evaluate((card_number, cc_expire_m, cc_expire_y, cc_owner) => {
                                        document.querySelector(card_number).classList.remove('validate[required,custom[integer]]');
                                        document.querySelector(cc_expire_m).classList.remove('validate[required,exclamation]');
                                        document.querySelector(cc_expire_y).classList.remove('validate[required,exclamation]');
                                        document.querySelector(cc_owner).classList.remove('validate[required,custom[onlyLetterCp]]');
                                    }, card_number, cc_expire_m, cc_expire_y, cc_owner);

                                    var payment_token = data.card_token;
                                    const token_elm = '#contents > #frmCstm > input[name="token"]';
                                    const pay_token_order = '#contents > #frmCstm > #pay_token_order';
                                    const pay_token_customer = '#contents > #frmCstm > #pay_token_customer';
                                    const pay_token_error_code = '#contents > #frmCstm > #pay_token_error_code';
                                    const tmp_token = await page.$eval(token_elm, el => el.value);
                                    console.log("tmp_token", tmp_token);

                                    await page.evaluate((pay_token_order, pay_token_customer, pay_token_error_code) => {
                                        document.querySelector(pay_token_order).setAttribute('type', 'text');
                                        document.querySelector(pay_token_customer).setAttribute('type', 'text');
                                        document.querySelector(pay_token_error_code).setAttribute('type', 'text');
                                    }, pay_token_order, pay_token_customer, pay_token_error_code);

                                    await page.focus(pay_token_order);
                                    await page.evaluate((pay_token_order, payment_token) => {
                                        document.querySelector(pay_token_order).value = payment_token
                                    }, pay_token_order, payment_token);

                                    await page.focus(pay_token_customer);
                                    await page.evaluate((pay_token_customer, payment_token) => {
                                        document.querySelector(pay_token_customer).value = payment_token
                                    }, pay_token_customer, payment_token);

                                    await page.focus(pay_token_error_code);
                                    await page.evaluate((pay_token_error_code) => {
                                        document.querySelector(pay_token_error_code).value = 'no_error'
                                    }, pay_token_error_code);

                                    const new_pay_token_order = await page.$eval(pay_token_order, el => el.value);
                                    const new_pay_token_customer = await page.$eval(pay_token_customer, el => el.value);
                                    const new_pay_token_error_code = await page.$eval(pay_token_error_code, el => el.value);
                                    console.log("new_pay_token_order", new_pay_token_order);
                                    console.log("new_pay_token_customer", new_pay_token_customer);
                                    console.log("new_pay_token_error_code", new_pay_token_error_code);
                                }

                                // await page.pdf({path: 'pictures/sognando_'+ Date.now() +'.pdf', format: 'A4', printBackground: true});
                                await Promise.all([
                                    page.click('#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #btn_heads > #btn_next'),
                                    page.waitForNavigation()
                                ]);

                            } else {
                                console.log('click sale product fail, can not redirect page');
                            }

                        } else {
                            console.log('up sale image not exist');
                        }
                    }

                    // button confirm click
                    const confirm_submit_btn = "#contents > div.section_wrapper > div.section_a > div.c_section-npb >  #frmCstm > div.btn_wrapper > #frmsubmit";
                    if (await page.$(confirm_submit_btn) !== null) {
                        console.time('click_confirm');
                        await Promise.all([
                            page.click(confirm_submit_btn),
                            page.waitForNavigation()
                        ]);
                        console.timeEnd('click_confirm');
                        const complete_url = await page.url();
                        console.log('complete_url', complete_url);
                        if (/complete/.test(complete_url)) {
                            puppeteerRequest.findOneAndUpdate({_id: data.object_id}, {
                                $set: {
                                    status: 1,
                                    url: complete_url,
                                    param: data,
                                    updated_at: new Date()
                                }
                            }, {upsert: false, multi: false}, function (err, result) {
                                if (err) throw err;
                            });

                            // response.message = 'payment success';
                            // res.status(200).json(response);
                        } else {
                            console.log('payment error');
                            var exception = {
                                cpid: data.connect_page_id,
                                user_id: data.user_id,
                                url: cart_url,
                                status: 3,
                                error_message: 'payment error',
                                index: 1,
                                request_body: body,
                                param: data
                            };
                            savePuppeteerException(exception);
                            response.error_message = "クレジット決済は完了していません。</br>誠に申し訳ございませんがカード情報をご確認の上、再度入力をお願いします。";
                            res.status(500).json(response);
                        }
                    } else {
                        console.log('button submit can not find');
                    }
                } else {
                    console.log('confirm error');
                    var exception = {
                        cpid: data.connect_page_id,
                        user_id: data.user_id,
                        url: cart_url,
                        status: 3,
                        error_message: 'confirm error',
                        index: 1,
                        request_body: body,
                        param: data
                    };
                    savePuppeteerException(exception);
                    response.error_message = "エラーが発生しました。再度ご試しください。";
                    res.status(500).json(response);
                }
                // }
            }else {
                console.log("cookie not exist");
                var error_message = "cookie not exist";
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_1, status: 2}, {
                    $set: {
                        status: 3,
                        error_message: error_message,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });
                response.error_message = error_message;
                res.status(500).json(response);
            }
        } catch (e) {
            console.log('executeOrder exception', e);
            var exception = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                url: cart_url,
                status: 3,
                error_message: e,
                index: 1,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }
        console.timeEnd("executeOrder");
        await browser.close();
    })()
}


router.post('/getPrice', function(req, res, next) {
    console.log("start getPrice");
    var body = req.body;
    console.log(body);
    var product_code = body.product_code;
    var payment_method = parseInt(body.payment_method);
    var response = {
        product_unit_price: 0,
        order_tax: 0,
        order_quantity: 0,
        order_sub_total_tax: 0,
        order_settlement_fee: 0,
        order_shipping_fee: 0,
        order_sub_total: 0,
        order_total: 0
    };

    if(product_code) {
        if(product_code == product_code_1) {
            response.product_unit_price = 3488;
            response.order_quantity = 1;
        } else if(product_code == product_code_2) {
            response.product_unit_price = 3694;
            response.order_quantity = 1;
            if(payment_method == cash_delivery) {
                response.order_shipping_fee = 756;
            } else {
                response.order_shipping_fee = 300;
            }
        } else if(product_code == product_code_3) {
            response.product_unit_price = 3899;
            response.order_quantity = 1;
            if(payment_method == cash_delivery) {
                response.order_shipping_fee = 756;
            } else {
                response.order_shipping_fee = 300;
            }
        }

        response.order_sub_total = response.product_unit_price * response.order_quantity;
        response.order_sub_total_tax = response.order_sub_total + response.order_tax;
        response.order_total = response.order_sub_total_tax + response.order_shipping_fee + response.order_settlement_fee;
    } else {
        console.log('product code error');
    }

    console.log(response);
    res.status(200).json(response);
});

router.post('/ranshell', function(req, res, next) {
    console.log("start getPrice");
    var body = req.body;
    console.log(body);
    var product_code = body.product_code;
    var response = {
        product_unit_price: 0,
        order_tax: 0,
        order_quantity: 0,
        order_sub_total_tax: 0,
        order_settlement_fee: 0,
        order_shipping_fee: 0,
        order_sub_total: 0,
        order_total: 0
    };

    if(product_code) {
        if(product_code == product_code_1) {
            response.product_unit_price = 2700;
            response.order_quantity = 1;
        } else if(product_code == product_code_2) {
            response.product_unit_price = 4806;
            response.order_quantity = 1;
        }

        response.order_sub_total = response.product_unit_price * response.order_quantity;
        response.order_sub_total_tax = response.order_sub_total + response.order_tax;
        response.order_total = response.order_sub_total_tax + response.order_shipping_fee + response.order_settlement_fee;
    } else {
        console.log('product code error');
    }

    console.log(response);
    res.status(200).json(response);
});


function getCookie(arr) {
    if(arr) {
        var result = {};
        arr.forEach(function (element) {
            if(element.name == 'umsession' && element.value != '') {
                result.name = 'umsession';
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

function splitBirthday2(birth_day){
    var result = {
        year: '',
        month: '',
        day: ''
    };
    if (typeof birth_day != "undefined" && birth_day != '') {
        var date = new Date(birth_day);
        result['year'] = date.getFullYear();
        result['month'] = ("0" + (date.getMonth() + 1)).slice(-2);
        result['day'] = ("0" + date.getDate()).slice(-2);
    }
    console.log('result---birthday---', result);
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

function getParam(name, url) {
    if (url != void 0) {
        const url_parts = url_require.parse(url);
        console.log(url_parts);
        if(url_parts.query){
            var parsedQs = querystring.parse(url_parts.query);
            console.log(parsedQs);
            console.log('parsedQs[name]', parsedQs[name]);
            if(parsedQs && parsedQs[name]){
                return parsedQs[name];
            }
        }
        return '';
    }else{
        return '';
    }
}

router.post('/getShoppingTimeLabel', function(req, res, next) {
    var body = req.body;
    console.log("getShoppingTimeLabel", body);
    var delivery_time = typeof body.delivery_time !== "undefined" ? body.delivery_time.toString() : "";
    var label_arr = {
        "13": "午前",
        "14": "12:00-14:00",
        "15": "14:00-16:00",
        "16": "16:00-18:00",
        "17": "18:00-20:00",
        "18": "19:00-21:00"
    };
    if(typeof label_arr[delivery_time] !== "undefined"){
        res.status(200).json({"delivery_time_label" : label_arr[delivery_time] });
    }else{
        res.status(200).json({"delivery_time_label" : "指定なし" });
    }
});

module.exports = router;
