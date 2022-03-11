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
const puppeteerOrderClick = model.PuppeteerOrderClick;

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
const product_code_4 = "004";
const Util = require('../modules/util');
const cart_newmo = "https://store.tamagokichi.com/sc/products/product_connect/YToyOntzOjM6Im54diI7czoxOiIyIjtzOjc6InByb2R1Y3QiO2E6MTp7aTowO2E6Mjp7czoyOiJpZCI7czozOiI3MzIiO3M6MzoicXR5IjtzOjE6IjEiO319fQ";
const cart_ranshell = "https://store.tamagokichi.com/sc/products/product_connect/YToyOntzOjM6Im54diI7czoxOiIyIjtzOjc6InByb2R1Y3QiO2E6MTp7aTowO2E6Mjp7czoyOiJpZCI7czozOiI2NDMiO3M6MzoicXR5IjtzOjE6IjEiO319fQ";

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
    console.log('current_url===', current_url);
    var landing_page_url = (current_url.indexOf('admin.botchan.chat') !== -1) ? body.landing_page_url : current_url;
    var user_device = body.user_device;
    landing_page_url = getLpUrl(landing_page_url, user_device);
    console.log('landing_page_url_new===', landing_page_url);

    var data = {
        user_id: body.user_id,
        connect_page_id: body.cpid,
        landing_page_url: landing_page_url,
        quantity: (typeof  body.quantity != "undefined") ? body.quantity : quantity_default,
        product_code: body.product_code,
        user_agent: body.user_agent,
        user_device: user_device,
        tamagosamin_flg: false,
        cookie: {}
    };
    puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 0},function(err, result) {
        //if(result){
        //    data.ebis_cookie = result.ebis_cookie;
        //}
        //console.log("data", data);
        //console.log('=====start landing page=====');
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
});

router.post('/confirm', function(req, res, next) {
    //console.log("=====call api confirm======");
    var body = req.body;
    var user_id = body.user_id;
    var quantity = (typeof  body.quantity != "undefined") ? body.quantity : quantity_default;
    var connect_page_id = body.cpid;
    var checkout_url = body.checkout_url;
    var first_name = body.first_name;
    var last_name = body.last_name;

    first_name = Util.chk_Char(first_name);
    last_name = Util.chk_Char(last_name);

    var furigana_first = body.furigana_first;
    var furigana_last = body.furigana_last;
    var zipcode = body.zipcode;
    var pref = body.pref;
    var address01 = body.address01;
    var address02 = body.address02;
    var address03 =  (typeof  body.address03 != "undefined") ? body.address03 : "";
    address02 = address02 + address03;
    address02 = Util.chk_Char(address02);
    console.log("address02", address02);
    var phone = body.phone;
    var gender = typeof body.gender != 'undefined' ? body.gender : '';

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
    var user_device = body.user_device;
    var response = {};
    //console.log("body", body);

    //console.log('=====start send data to request=====');
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
        ad_code: (typeof  body.ad_code != "undefined") ? body.ad_code : '',
        user_agent: body.user_agent,
        user_device: user_device
    };
    res.status(200).json({});

    puppeteerOrderClick.remove({cpid: connect_page_id, uid: user_id}, function(err) {
        var jsondata = {
            cpid: connect_page_id,
            uid: user_id,
            status_puppeteer: "processing",
            status_order: "new",
            error_message: "",
            updated_at: new Date(),
            created_at: new Date()
        };

        var model = new puppeteerOrderClick(jsondata);
        model.save(function(err, result_order) {
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
                    data.puppeteerOrderClickId = result_order._id;
                    checkPrevious(body, data, res);
                });
            });
        });
    });


});

router.post('/order', function(req, res, next) {
    console.log("=====call api order======");
    var body = req.body;
    var user_id = body.user_id;
    var connect_page_id = body.cpid;
    var confirm_url = body.confirm_url;
    var token = crypto.randomBytes(64).toString('hex');
    var user_device = body.user_device;
    var data = {
        user_id: user_id,
        connect_page_id: connect_page_id,
        confirm_url: confirm_url,
        user_token: token,
        ad_code: (typeof  body.ad_code != "undefined") ? body.ad_code : '',
        product_code: (typeof  body.product_code != "undefined") ? body.product_code : '',
        payment_method: (typeof  body.payment_method != "undefined") ? body.payment_method : '',
        card_token: (typeof  body.card_token != "undefined") ? body.card_token : '',
        user_agent: body.user_agent,
        user_device: user_device
    };
    console.log("data", data);

    puppeteerRequest.remove({cpid: connect_page_id, user_id: user_id, index: {$gte: 2}}, function(err) {
        if (err) throw err;
        var insert_data = {
            cpid: connect_page_id,
            user_id: user_id,
            user_token: token,
            url: confirm_url,
            status: 0,
            error_message: "",
            index: 2,
            request_body: body,
            param: data
        };

        var data_save = new puppeteerRequest(insert_data);
        data_save.save(function(err, result1) {
            if(err) throw  err;
            data.object_id_index_2 =  result1._id;
            checkPreviousOrder(body, data, res);
        });
    });
});

function landingPageBak(body, data, res){
    var landing_page_url = data.landing_page_url;
    //console.log("landing_page_url=", landing_page_url);
    var ad_code_value = getAllParam(landing_page_url);
    //console.log("ad_code_value=", ad_code_value);
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
            if(rurl.indexOf("ebis") !== -1){
                //console.log(rurl + "  " + rtype);
                //request.continue();
                request.abort();
            }
            else if(rurl.indexOf("app.botchan.chat") !== -1 || rurl.indexOf("botchan2") !== -1){
                request.abort();
            }else if (rtype === "image") {
                if(rurl.indexOf('newmo') != -1 ) {
                    if(rurl.indexOf('btn01.jpg') == -1){
                        request.abort();
                    }else{
                        request.continue();
                    }
                }
                else if(rurl.indexOf('ranshell/07') != -1 ) {
                    if(rurl.indexOf('img/btn01.jpg') == -1){
                        request.abort();
                    }else{
                        request.continue();
                    }
                }
                else if(rurl.indexOf('ranshell/m001') != -1 ) {
                    if(rurl.indexOf('img/btn02.jpg') == -1){
                        request.abort();
                    }else{
                        request.continue();
                    }
                }
                else {
                    if(rurl.indexOf("/sp/") !== -1) {
                        if(rurl.indexOf('img/cv01_btn.jpg') == -1 &&
                            rurl.indexOf('common/images/img_tab01_m_') == -1 &&
                            rurl.indexOf('common/images/img_tab01a.jpg') == -1 &&
                            rurl.indexOf('common/images/img_tab01_btn.jpg') == -1 &&
                            rurl.indexOf('common/images/img_tab02_m_') == -1 &&
                            rurl.indexOf('common/images/img_tab02a.jpg') == -1 &&
                            rurl.indexOf('common/images/img_tab02_btn.jpg') == -1 &&
                            rurl.indexOf('common/images/img_tab03_m_') == -1 &&
                            rurl.indexOf('common/images/img_tab03a.jpg') == -1 &&
                            rurl.indexOf('common/images/img_tab03_btn.jpg') == -1
                        ){
                            request.abort();
                        }else{
                            //console.log('include img url = ', rurl);
                            request.continue();
                        }
                    } else {
                        if(rurl.indexOf('/common/img/img_tab01_m_') == -1 &&
                            rurl.indexOf('/common/img/btn001.jpg') == -1 &&
                            rurl.indexOf('common/img/img_tab01.jpg') == -1 &&
                            rurl.indexOf('/common/img/img_tab02_m_') == -1 &&
                            rurl.indexOf('/common/img/btn002.jpg') == -1 &&
                            rurl.indexOf('common/img/img_tab02.jpg') == -1 &&
                            rurl.indexOf('/common/img/img_tab03_m_') == -1 &&
                            rurl.indexOf('/common/img/btn003.jpg') == -1 &&
                            rurl.indexOf('/common/img/img_tab03.jpg') == -1 &&
                            rurl.indexOf('/common/img/img_tab03.jpg') == -1

                        ){
                            request.abort();
                        }else{
                            //console.log('include img url = ', rurl);
                            request.continue();
                        }
                    }
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

        page.on("error", async () => {
            await browser.close();
            var exception = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                url: landing_page_url,
                status: 3,
                error_message: 'page crash',
                index: 0,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception);
        });

        try {
            //console.log("data.ebis_cookie", data.ebis_cookie);
            //if(data.ebis_cookie){
            //    await page.setCookie(data.ebis_cookie);
            //}
            //console.log(data.user_agent);
            if(data.user_agent){
                await page.setUserAgent(data.user_agent);
            }
            console.log("hailt landing_page_url", landing_page_url);
            await page.waitFor(1000);
            await page.goto(landing_page_url, {waitUntil: 'load'});
            console.log("hailt done load");
            var button_select = "";
            var tamagosamin_flg = false;
            if (/iha-tamago/.test(landing_page_url)) {
                tamagosamin_flg = true;
                var tap_select = "";
                //console.log('product_code', data.product_code.toString());
                if(data.product_code.toString() === product_code_1) {
                    if (/sp/.test(landing_page_url)) {
                        tap_select  = "#wrapper > .cv_box > #tabs01 > li:nth-child(1) > a > img";
                        button_select = "#wrapper > .cv_box > #tab01 > p:nth-child(2) > a > img";
                    } else {
                        tap_select  = "#wrap > .cv_box > #tabs01 > li:nth-child(1) > a > img";
                        button_select = "#wrap > .cv_box > #tab01 > p.btn > a > img";
                    }
                } else if(data.product_code.toString() === product_code_2) {
                    if (/sp/.test(landing_page_url)) {
                        tap_select  = "#wrapper > .cv_box > #tabs01 > li:nth-child(2) > a > img";
                        button_select = "#wrapper > .cv_box > #tab02 > p:nth-child(2) > a > img";
                    } else {
                        tap_select  = "#wrap > .cv_box > #tabs01 > li:nth-child(2) > a > img";
                        button_select = "#wrap > .cv_box > #tab02 > p.btn > a > img";
                    }
                } else if(data.product_code.toString() === product_code_3){
                    if (/sp/.test(landing_page_url)) {
                        tap_select  = "#wrapper > .cv_box > #tabs01 > li:nth-child(3) > a > img";
                        button_select = "#wrapper > .cv_box > #tab03 > p:nth-child(2) > a > img";
                    } else {
                        tap_select  = "#wrap > .cv_box > #tabs01 > li:nth-child(3) > a > img";
                        button_select = "#wrap > .cv_box > #tab03 > p.btn > a > img";
                    }
                } else {
                    console.log('product_code error', data.product_code.toString());
                }

                await page.waitForSelector(tap_select);
                //console.log('tap_select', tap_select);
                await page.click(tap_select);
            } else {
                console.log("landing_page_url=", landing_page_url);
                if(landing_page_url.indexOf("newmo") !== -1){
                    console.log("newmo");
                    if(landing_page_url.indexOf("10chat") !== -1){
                        if (/sp/.test(landing_page_url)) {
                            button_select = "#wrapper > div:nth-child(3) > p:nth-child(2) > a";
                        }  else {
                            button_select = "#wrap > div > div:nth-child(3) > p.btn01 > a";
                        }
                    }else{
                        if (/sp/.test(landing_page_url)) {
                            button_select = "#wrapper > div:nth-child(2) > p:nth-child(2) > a";
                        }  else {
                            button_select = "#wrap > div > div:nth-child(2) > p.btn01 > a";
                        }
                    }
                }
                else if(landing_page_url.indexOf("ranshell/m001") !== -1){
                    if (/sp/.test(landing_page_url)) {
                        button_select = "#contents > div:nth-child(2) > div > p.btn > a";
                    }  else {
                        button_select = "#pagetop > .conBox > .cvBox01 > .btn > a";
                    }
                }
                else if(landing_page_url.indexOf("ranshell/07") !== -1){
                    if (/sp/.test(landing_page_url)) {
                        button_select = "#contents > div:nth-child(5) > p:nth-child(2) > a";
                    }  else {
                        button_select = "#pagetop > div.conBox > div:nth-child(17) > p.btn > a";
                    }
                }else{
                    if (/sp/.test(landing_page_url)) {
                        button_select = "#contents > .cvBox > .btn > a";
                    }  else {
                        button_select = "#pagetop > .conBox > .cvBox01 > .btn > a";
                    }
                }
            }

            //console.log('button_select', button_select);
            await page.waitForSelector(button_select);
            if (await page.$(button_select) !== null) {
                //console.log("start click submit landing page");
                if(landing_page_url.indexOf("iha-tamago") !== -1){
                    await Promise.all([
                        page.click(button_select),
                        page.waitForNavigation()
                    ]);
                } else if(landing_page_url.indexOf("ranshell") !== -1 || landing_page_url.indexOf("newmo") !== -1){
                    const ranshell_url = await page.evaluate((button_select) => {
                        return document.querySelector(button_select).getAttribute('data-href');
                    }, button_select);
                    console.log('landing_page_url-----', landing_page_url);
                    console.log('ranshell_url', ranshell_url);
                    if(ranshell_url !== null) {
                        await page.goto(ranshell_url, {waitUntil: 'load'});
                        await page.waitFor(2000);
                    } else {
                        await Promise.all([
                            page.click(button_select),
                            page.waitForNavigation()
                        ]);
                    }
                } else {
                    console.log('===Landing_page_url not installed====');
                }

                const cart_url = await page.url();
                console.log("End landing page");
                console.log("===cart_url===", cart_url);
                if (cart_url.indexOf("checkouts") !== -1) {
                    console.log("===Checkouts page loaded===");
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
                    });
                } else {
                    console.log('===Redirect cart error===');
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
                console.log('===Can not load landing page===');
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
            console.log('===LandingPage exception===', e);
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

function landingPage(body, data, res){
    var landing_page_url = data.landing_page_url;
    //console.log("landing_page_url=", landing_page_url);
    var ad_code_value = getAllParam(landing_page_url);
    //console.log("ad_code_value=", ad_code_value);
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
            if(rurl.indexOf("ebis") !== -1){
                //console.log(rurl + "  " + rtype);
                //request.continue();
                request.abort();
            }
            else if(rurl.indexOf("app.botchan.chat") !== -1 || rurl.indexOf("botchan2") !== -1){
                request.abort();
            }else if (rtype === "image") {
                request.abort();
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

        page.on("error", async () => {
            await browser.close();
            var exception = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                url: landing_page_url,
                status: 3,
                error_message: 'page crash',
                index: 0,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception);
        });

        try {
            if(data.user_agent){
                await page.setUserAgent(data.user_agent);
            }
            await page.waitFor(1000);
            await page.goto(landing_page_url, {waitUntil: 'load'});

            var cart_url = cart_ranshell;
            if(landing_page_url.indexOf("newmo")){
                cart_url = cart_newmo;
            }
            await page.goto(cart_url, {waitUntil: 'load'});
            await page.waitFor(2000);

            console.log("hailt done load");
            const cart_url = await page.url();
            console.log("End landing page");
            console.log("===cart_url===", cart_url);
            if (cart_url.indexOf("checkouts") !== -1) {
                console.log("===Checkouts page loaded===");
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
                });
            } else {
                console.log('===Redirect cart error===');
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
        } catch (e) {
            console.log('===LandingPage exception===', e);
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
    //console.log('checkPrevious');
    var cnt = 0;
    var intervalObject = setInterval(function () {
        puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 0},function(err, result) {
            if (result) {
                if(result.status == 1){
                    var cookie = result.param.cookie;
                    //var ebis_cookie = result.ebis_cookie;

                    var landing_page_url = result.param.landing_page_url;
                    var tamagosamin_flg = result.param.tamagosamin_flg;
                    data.landing_page_url = landing_page_url;
                    data.tamagosamin_flg = tamagosamin_flg;
                    //data.ebis_cookie = ebis_cookie;
                    puppeteerRequest.findOne({_id: data.object_id_index_1},function(err, result1) {
                        if (result1) {
                            result1.status = 2;
                            result1.updated_at = new Date();
                            result1.save(function(err){
                                clearInterval(intervalObject);
                                //console.log('start confirm');
                                executeConfirm(body, data, cookie, res);
                            });
                        }
                    });
                }else{
                    //continue loop
                    cnt++;
                    if(cnt > 60){
                        console.log('===Previous step not success===');
                        clearInterval(intervalObject);
                        puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                            $set: {
                                status_puppeteer: "error",
                                error_message: "エラーが発生しました。再度ご試しください。",
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {

                        });
                    }
                }
            }else{
                //error
                clearInterval(intervalObject);
            }
        });
    }, 1000);
}

function checkPreviousOrder(body, data, res) {
    //console.log('checkPreviousOrder');
    var cnt = 0;
    var intervalObject2 = setInterval(function () {
        puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 1},function(err, result) {
            if (result) {
                if(result.status == 1){
                    var cookie = result.param.cookie;
                    //var ebis_cookie = result.ebis_cookie;
                    var landing_page_url = result.param.landing_page_url;
                    var tamagosamin_flg = result.param.tamagosamin_flg;
                    data.landing_page_url = landing_page_url;
                    data.tamagosamin_flg = tamagosamin_flg;
                    //data.ebis_cookie = ebis_cookie;
                    puppeteerRequest.findOne({_id: data.object_id_index_2, status: 0},function(err, result1) {
                        if (result1) {
                            result1.status = 2;
                            result1.updated_at = new Date();
                            result1.save(function(err){
                                clearInterval(intervalObject2);
                                console.log('start order');
                                executeOrder(body, data, cookie, res);
                            });
                        }
                    });
                }else{
                    //continue loop
                    cnt++;
                    if(cnt > 15){
                        clearInterval(intervalObject2);
                        var response = {};
                        response.error_message = "エラーが発生しました。";
                        res.status(500).json(response);
                    }
                }
            }else{
                //error
                clearInterval(intervalObject2);
                var response2 = {};
                response2.error_message = "エラーが発生しました。";
                res.status(500).json(response2);
            }
        });
    }, 700);
}

function executeConfirm(body, data, cookie, res) {
    console.time('confirm_done');
    console.time("executeConfirm");
    data.cookie = cookie;
    var landing_page_url = data.landing_page_url;
    var ad_code_value = data.ad_code;
    var ad_code_param = (ad_code_value != '') ? ('?' + ad_code_value) : '';
    var cart_url = data.checkout_url + ad_code_param;
    var tamagosamin_flg = data.tamagosamin_flg;
    var ebis_complete_url = "";

    console.log("landing_page_url", landing_page_url);
    var is_done = false;
    var is_end_ebis = false;
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
            var rurl = request.url();
            if(rurl.indexOf("ebis") !== -1){
                //console.log("ebis", rurl);
                if(rurl.indexOf("rec.php") !== -1 && is_done){
                    ebis_complete_url = rurl;
                    ebis_complete_url = ebis_complete_url.replace(/&js=cb/g,'');
                    console.log("ebis_complete_url", ebis_complete_url);
                    var thank_url = "https://store.tamagokichi.com/sc/umcart/show_cart" + ad_code_param;
                    puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                        $set: {
                            status_puppeteer: "complete",
                            thank_url: thank_url,
                            ebis_complete_url: ebis_complete_url,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {

                    });

                    request.abort();
                }else{
                    if(is_done && !is_end_ebis){
                        //console.log("ebis_url", rurl);
                        request.continue();
                        is_end_ebis = true;
                    }else{
                        request.abort();
                    }
                }

            }
            else if(rurl.indexOf("app.botchan.chat") !== -1 || rurl.indexOf("botchan2") !== -1){
                request.abort();
            } else if (rtype === "image") {
                if(rurl.indexOf('upsell/ranshell/w03a/img09.jpg') == -1 && rurl.indexOf('upsell/ranshell/w03a/img10.jpg') == -1){
                    if(is_done){
                        request.continue();
                    }else{
                        request.abort();
                    }
                }else{
                    //console.log('include img url = ', request.url());
                    request.continue();
                }
            } else if (rtype === "xhr" || rtype === "font" || rtype === "stylesheet") {
                // console.log('ignore url === ', request.url());
                request.abort();
            } else {
                if(rtype == "script"){
                    if(rurl.indexOf("jquery.validationEngine") !== -1 || rurl.indexOf("pay_token.js") !== -1 || rurl.indexOf("zeus_token.js") !== -1){
                        // console.log(request.url());
                        request.abort();
                    }else{
                        //if(is_done){
                        //    console.log("script = ", rurl);
                        //}
                        request.continue();
                    }
                } else {
                    //console.log("doc url confirm = ", rurl);
                    if(rurl.indexOf("checkouts/complete") !== -1){
                        is_done = true;
                    }
                    if(rurl.indexOf("/sc/error") !== -1){
                        is_done = false;
                    }
                    request.continue();
                }
            }
        });
        page.on("error", async () => {
            await browser.close();
            var exception = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                url: cart_url,
                status: 3,
                error_message: 'page crash',
                index: 0,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception);
        });
        try {
            if (typeof cookie != "undefined" && cookie != '') {
                cookie.url = cart_url;
                await page.setCookie(cookie);

                if(data.user_agent){
                    await page.setUserAgent(data.user_agent);
                }

                await page.goto(cart_url, {waitUntil: 'load'});

                const confirm_url2 = await page.url();
                console.log('confirm_url2', confirm_url2);

                if(await page.$('#frmCstm') !==  null) {
                    console.log('===Form exist===');
                } else {
                    console.log('===Form not exist form===');
                    var error_message_2 = "セッションがタイムアウトになりました。</br>「電話番号」質問から再度ご入力ください。";
                    puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                        $set: {
                            status_puppeteer: "error",
                            error_message: error_message_2,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {

                    });

                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_1}, {
                        $set: {
                            status: 3,
                            url: confirm_url2,
                            error_message: error_message_2,
                            param: data,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });
                    await browser.close();
                    return;
                }

                var lastname_ele = 'input#lastname',
                    firstname_ele =  'input#firstname',
                    lastkana_ele = 'input#lastkana',
                    firstkana_ele = 'input#firstkana',
                    email_ele = 'input#email',
                    phone_ele =  'input#phone',
                    zipcode_ele =  'input#zip',
                    pref_elm =  '#pref',
                    addr01_ele = 'input#addr01',
                    addr02_ele =  'input#addr02',
                    gender_1_ele =  'input#gender_1',
                    gender_2_ele = 'input#gender_2',
                    delivery_time_elm = 'select[name="dvr_time"]',
                    card_number = '#cc_no',
                    cc_expire_m = '#cc_expire_m',
                    cc_expire_y = '#cc_expire_y',
                    cc_owner = '#cc_owner',
                    token_elm = '#frmCstm > input[name="token"]',
                    pay_token_order = '#pay_token_order',
                    pay_token_customer = '#pay_token_customer',
                    pay_token_error_code = '#pay_token_error_code',
                    term_of_use_elm = '#agree',
                    btn_submit = '#btn_next',
                    btn_submit_sp = '#btns_cart > li:nth-child(1) > input.btn_cart',
                    up_sale_selection = "#frmCstm > #upsale_section > div > p:nth-child(9) > a > img",
                    btn_order = "input#frmsubmit",
                    payment_method_elm = 'input[name="payment_id"][value="'+ data.payment_method + '"]';
                var email_check_ele = (await page.$('input#email_check') !== null) ? 'input#email_check' : '';

                await page.evaluate((lastname_ele, firstname_ele, lastkana_ele, firstkana_ele,
                                     email_ele, phone_ele, zipcode_ele, addr01_ele, addr02_ele, email_check_ele) => {
                        document.querySelector(lastname_ele).value = '';
                        document.querySelector(firstname_ele).value = '';
                        document.querySelector(lastkana_ele).value = '';
                        document.querySelector(firstkana_ele).value = '';
                        document.querySelector(email_ele).value = '';
                        document.querySelector(phone_ele).value = '';
                        document.querySelector(zipcode_ele).value = '';
                        document.querySelector(addr01_ele).value = '';
                        document.querySelector(addr02_ele).value = '';
                        if(email_check_ele != '' ) {
                            document.querySelector(email_check_ele).value = '';
                        }
                    }, lastname_ele, firstname_ele, lastkana_ele, firstkana_ele, email_ele,
                    phone_ele, zipcode_ele, addr01_ele, addr02_ele, email_check_ele);

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
                //console.log('data.mail', data.mail);
                await page.focus(email_ele);
                await page.keyboard.type(data.mail);

                //confirm email
                if(email_check_ele != '') {
                    await page.focus(email_check_ele);
                    await page.keyboard.type(data.mail);
                }

                //tel
                await page.focus(phone_ele);
                await page.keyboard.type(data.phone);

                //zipcode
                await page.focus(zipcode_ele);
                await page.keyboard.type(data.zipcode);

                //pref
                const pref_code = pref_code_list[data.pref] != 'undefined' ? pref_code_list[data.pref] : '';
                await page.focus(pref_elm);
                await page.select(pref_elm, pref_code);

                //address
                await page.focus(addr01_ele);
                await page.keyboard.type(data.address01);
                await page.focus(addr02_ele);
                await page.keyboard.type(data.address02);

                //gender
                if (data.gender != '') {
                    if (data.gender == '1') {
                        await page.click(gender_1_ele);
                    } else {
                        await page.click(gender_2_ele);
                    }
                }

                await page.click(payment_method_elm);
                await page.waitFor(1000);

                if(await page.$(delivery_time_elm) !== null) {
                    data.delivery_time = (typeof (data.delivery_time) === 'undefined' || data.delivery_time == '') ? '0' : data.delivery_time;
                    console.log('delivery_time==',  data.delivery_time);
                    if (tamagosamin_flg) {
                        if (parseInt(data.payment_method) == cash_delivery) {
                            await page.select(delivery_time_elm, data.delivery_time);
                        }
                    } else {
                        await page.select(delivery_time_elm, data.delivery_time);
                    }
                } else {
                    console.log('== Not find delivery_time_elm element ==');
                }

                if (parseInt(data.payment_method) === credit_delivery) {
                    // remove class require
                    await page.evaluate((card_number, cc_expire_m, cc_expire_y, cc_owner) => {
                        document.querySelector(card_number).classList.remove('validate[required,custom[integer]]');
                        document.querySelector(cc_expire_m).classList.remove('validate[required,exclamation]');
                        document.querySelector(cc_expire_y).classList.remove('validate[required,exclamation]');
                        document.querySelector(cc_owner).classList.remove('validate[required,custom[onlyLetterCp]]');
                    }, card_number, cc_expire_m, cc_expire_y, cc_owner);

                    var payment_token = data.card_token;
                    const tmp_token = await page.$eval(token_elm, el => el.value);

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
                if (await page.$(term_of_use_elm) !== null) {
                    const checkbox = await page.$(term_of_use_elm);
                    var is_checked = await (await checkbox.getProperty('checked')).jsonValue();
                    if(!is_checked) {
                        await page.click(term_of_use_elm);
                    }
                } else {
                    console.log('not find term_of_use element');
                }

                var btn_click_submit = '';
                if(await page.$(btn_submit) !== null) {
                    btn_click_submit = btn_submit;
                } else if(await page.$(btn_submit_sp) !== null) {
                    btn_click_submit = btn_submit_sp;
                } else {
                    console.log('btn_click_submit not exist');
                }

                if(btn_click_submit != '') {
                    await Promise.all([
                        page.click(btn_click_submit),
                        page.waitForNavigation()
                    ]);
                }

                const confirm_url = await page.url();
                console.log('confirm_url', confirm_url);
                // confirm order
                if (/confirm/.test(confirm_url)) {

                    if (!/iha-tamago/.test(landing_page_url) && data.product_code == product_code_2) {
                        // const up_sale_selection = "#container > #contents > .section_wrapper > .section_a > .c_section-npb > #frmCstm > #upsale_section > div > p:nth-child(9) > a > img";
                        // const up_sale_selection = "#frmCstm > #upsale_section > div > p:nth-child(9) > a > img";
                        if (await page.$(up_sale_selection) !== null) {
                            await Promise.all([
                                page.click(up_sale_selection),
                                page.waitForNavigation()
                            ]);

                            var up_sale_checkout_url = await page.url();
                            console.log('up_sale_checkout_url==', up_sale_checkout_url);
                            if (/checkouts/.test(up_sale_checkout_url)) {
                                if (parseInt(data.payment_method) === credit_delivery) {
                                    // const card_number = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(1) > td.bg_none > #cc_no';
                                    // const cc_expire_m = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(2) > td.bg_none > select[name="cc_expire_m"]';
                                    // const cc_expire_y = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(2) > td.bg_none > select[name="cc_expire_y"]';
                                    // const cc_owner = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(3) > td.bg_none > input[name="cc_owner"]';

                                    // remove class require
                                    await page.evaluate((card_number, cc_expire_m, cc_expire_y, cc_owner) => {
                                        document.querySelector(card_number).classList.remove('validate[required,custom[integer]]');
                                        document.querySelector(cc_expire_m).classList.remove('validate[required,exclamation]');
                                        document.querySelector(cc_expire_y).classList.remove('validate[required,exclamation]');
                                        document.querySelector(cc_owner).classList.remove('validate[required,custom[onlyLetterCp]]');
                                    }, card_number, cc_expire_m, cc_expire_y, cc_owner);

                                    var payment_token = data.card_token;
                                    // const token_elm = '#contents > #frmCstm > input[name="token"]';
                                    // const pay_token_order = '#contents > #frmCstm > #pay_token_order';
                                    // const pay_token_customer = '#contents > #frmCstm > #pay_token_customer';
                                    // const pay_token_error_code = '#contents > #frmCstm > #pay_token_error_code';
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
                                    page.click(btn_submit),
                                    page.waitForNavigation()
                                ]);

                            } else {
                                console.log('click sale product fail, can not redirect page');
                            }
                        } else {
                            console.log('up sale image not exist');
                        }
                    }
                    //if(data.ebis_cookie){
                    //
                    //}else{
                    //    var all_cookie = await page._client.send('Network.getAllCookies');
                    //    data.ebis_cookie = getCookieEbis(all_cookie);
                    //}

                    console.timeEnd('confirm_done');

                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_1}, {
                        $set: {
                            status: 1,
                            url: confirm_url,
                            param: data,
                            //ebis_cookie: data.ebis_cookie,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });

                    puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                        $set: {
                            status_puppeteer: "confirm_done",
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        var cnt2 = 0;
                        var intervalObject = setInterval(async () => {
                            var result = await puppeteerOrderClick.findOne({_id: data.puppeteerOrderClickId});
                            if (result) {
                                //click order
                                if(result.status_order == "order"){
                                    clearInterval(intervalObject);

                                    var remove = await puppeteerRequest.remove({cpid: data.connect_page_id, user_id: data.user_id, index: {$gte: 2}});
                                    var insert_data = {
                                        cpid: data.connect_page_id,
                                        user_id: data.user_id,
                                        url: confirm_url,
                                        status: 2,
                                        error_message: "",
                                        index: 2,
                                        request_body: body,
                                        param: data
                                    };

                                    var data_save = new puppeteerRequest(insert_data);

                                    var result1 = await data_save.save();
                                    data.object_id_index_2 =  result1._id;

                                    // button confirm click
                                    // const confirm_submit_btn = "#contents > div.section_wrapper > div.section_a > div.c_section-npb >  #frmCstm > div.btn_wrapper > #frmsubmit";
                                    console.log("btn_order=", btn_order);
                                    if (await page.$(btn_order) !== null) {
                                        console.log('===start_click_confirm===', product_code_4);

                                        if(data.product_code != product_code_4){
                                            await Promise.all([
                                                page.click(btn_order),
                                                page.waitForNavigation()
                                            ]);
                                        }else{
                                            await page.evaluate((btn_order) => {
                                                var btn = btn_order;
                                                var btn_length = document.querySelectorAll(btn_order).length;
                                                btn_length = parseInt(btn_length);
                                                if(btn_length >= 1){
                                                    btn = document.querySelectorAll(btn_order)[btn_length - 1];
                                                }
                                                btn.click();
                                            }, btn_order);
                                            await  page.waitForNavigation();
                                        }

                                        console.log('===end_click_confirm===');
                                        console.timeEnd('click_confirm');
                                        const complete_url = await page.url();
                                        console.log('complete_url', complete_url);
                                        if (/complete/.test(complete_url)) {
                                            puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
                                                $set: {
                                                    status: 1,
                                                    url: complete_url,
                                                    param: data,
                                                    updated_at: new Date()
                                                }
                                            }, {upsert: false, multi: false}, function (err, result) {
                                                if (err) throw err;
                                            });

                                            //const html = await page.content();
                                            // response.message = 'payment success';
                                            // res.status(200).json(response);
                                            console.timeEnd("executeConfirm");
                                            await browser.close();
                                        } else {

                                            puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                                                $set: {
                                                    status_puppeteer: "error",
                                                    error_message: "クレジット決済は完了していません。</br>誠に申し訳ございませんがカード情報をご確認の上、再度入力をお願いします。",
                                                    updated_at: new Date()
                                                }
                                            }, {upsert: false, multi: false}, function (err, result) {

                                            });

                                            puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
                                                $set: {
                                                    status: 3,
                                                    error_message: "クレジット決済は完了していません。</br>誠に申し訳ございませんがカード情報をご確認の上、再度入力をお願いします。",
                                                    param: data,
                                                    updated_at: new Date()
                                                }
                                            }, {upsert: false, multi: false}, function (err, result) {
                                                if (err) throw err;
                                            });

                                            //console.log('payment error');
                                            //var exception = {
                                            //    cpid: data.connect_page_id,
                                            //    user_id: data.user_id,
                                            //    url: cart_url,
                                            //    status: 3,
                                            //    error_message: "クレジット決済は完了していません。</br>誠に申し訳ございませんがカード情報をご確認の上、再度入力をお願いします。",
                                            //    index: 1,
                                            //    request_body: body,
                                            //    param: data
                                            //};
                                            //savePuppeteerException(exception);
                                            console.timeEnd("executeConfirm");
                                            await browser.close();
                                        }
                                    } else {
                                        console.log('button submit can not find');
                                        clearInterval(intervalObject);
                                        puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                                            $set: {
                                                status_puppeteer: "error",
                                                error_message: "エラーが発生しました。再度ご試しください。",
                                                updated_at: new Date()
                                            }
                                        }, {upsert: false, multi: false}, function (err, result) {

                                        });
                                        console.timeEnd("executeConfirm");
                                        await browser.close();
                                    }
                                }
                                else{
                                    //continue loop
                                    cnt2++;
                                    //console.log("wait cnt2", cnt2);

                                    if(cnt2 > 60){
                                        clearInterval(intervalObject);
                                        puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                                            $set: {
                                                timeout_flg: 1,
                                                updated_at: new Date()
                                            }
                                        }, {upsert: false, multi: false}, function (err, result) {

                                        });
                                        console.timeEnd("executeConfirm");
                                        await browser.close();
                                    }
                                }
                            }else{
                                clearInterval(intervalObject);
                                puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                                    $set: {
                                        status_puppeteer: "error",
                                        error_message: "エラーが発生しました。再度ご試しください。",
                                        updated_at: new Date()
                                    }
                                }, {upsert: false, multi: false}, function (err, result) {

                                });
                                console.timeEnd("executeConfirm");
                                await browser.close();
                            }
                        }, 1500);
                    });
                    //res.status(200).json(response);
                } else {
                    var validate_element = '.alert_danger';
                    var validate_message = 'エラーが発生しました。再度ご試しください。';
                    if(await page.$(validate_element) !== null) {
                        validate_message =  await page.evaluate((validate_element) => {
                            var elements = Array.from(document.querySelectorAll(validate_element));
                            var message = elements.map(element => {
                                return element.innerText;
                            });
                            return message;
                        }, validate_element);

                        if(validate_message.length > 0) {
                            validate_message = validate_message.join("</br>");
                        }
                        console.log('validate_message-----', validate_message);
                    }

                    puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                        $set: {
                            status_puppeteer: "error",
                            error_message: validate_message,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {

                    });

                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_1}, {
                        $set: {
                            status: 3,
                            url: confirm_url,
                            error_message: validate_message,
                            param: data,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });

                    console.log('=== Confirm error ====');
                    // await page.screenshot({path: 'pictures/' + 'ranshell_000__' + Date.now() + '.png', fullPage: true});

                    // var exception = {
                    //     cpid: data.connect_page_id,
                    //     user_id: data.user_id,
                    //     url: cart_url,
                    //     status: 3,
                    //     error_message: validate_message,
                    //     index: 1,
                    //     param: data
                    // };
                    // savePuppeteerException(exception);
                    // response.error_message = validate_message;
                    // res.status(500).json(response);
                    console.timeEnd("executeConfirm");
                    await browser.close();
                }
                // }
            }else {
                console.log("cookie not exist");
                var error_message = "cookie not exist";

                puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                    $set: {
                        status_puppeteer: "error",
                        error_message: "エラーが発生しました。再度ご試しください。",
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {

                });

                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_1}, {
                    $set: {
                        status: 3,
                        error_message: error_message,
                        param: data,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });
                //response.error_message = error_message;
                //res.status(500).json(response);
                console.timeEnd("executeConfirm");
                await browser.close();
            }
        } catch (e) {
            console.log('executeOrder exception', e);

            puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                $set: {
                    status_puppeteer: "error",
                    error_message: "エラーが発生しました。再度ご試しください。",
                    updated_at: new Date()
                }
            }, {upsert: false, multi: false}, function (err, result) {

            });

            puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_1}, {
                $set: {
                    status: 3,
                    error_message: "エラーが発生しました。再度ご試しください。",
                    param: data,
                    updated_at: new Date()
                }
            }, {upsert: false, multi: false}, function (err, result) {
                if (err) throw err;
            });

            var exception2 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                url: cart_url,
                status: 3,
                error_message: e,
                index: 1,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception2);
            console.timeEnd("executeConfirm");
            await browser.close();
            //response.error_message = "エラーが発生しました。再度ご試しください。";
            //res.status(500).json(response);
        }

    })()
}

function executeOrder(body, data, cookie, res) {
    console.time("executeOrder");
    var response = {};
    // var ad_code_value = getParam('ad_code', data.current_url);
    var ad_code_value = data.ad_code;
    var ad_code_param = (ad_code_value != '') ? ('?' + ad_code_value) : '';
    var cart_url = data.confirm_url + ad_code_param;
    //var cart_url = data.confirm_url;

    var tamagosamin_flg = data.tamagosamin_flg;
    var landing_page_url = data.landing_page_url;
    var user_device = data.user_device;
    var ebis_complete_url = "";
    //console.log("landing_page_url", landing_page_url);
    //console.log("cart_url", cart_url);
    //console.log("cookie", cookie);
    //console.log("tamagosamin_flg", tamagosamin_flg);
    var is_done = false;
    var is_end_ebis = false;

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
            if(rurl.indexOf("ebis") !== -1){
                if(rurl.indexOf("rec.php") !== -1 && is_done){
                    ebis_complete_url = rurl;
                    ebis_complete_url = ebis_complete_url.replace(/&js=cb/g,'');
                    response.thank_url = "https://store.tamagokichi.com/sc/umcart/show_cart" + ad_code_param;
                    response.ebis_complete_url = ebis_complete_url;
                    res.status(200).json(response);
                    console.log("ebis_complete_url", ebis_complete_url);
                    request.abort();
                }else{
                    if(is_done && !is_end_ebis){
                        //console.log("ebis_url", rurl);
                        request.continue();
                        is_end_ebis = true;
                    }else{
                        request.abort();
                    }
                }
            }
            else if(request.url().indexOf("app.botchan.chat") !== -1 || request.url().indexOf("botchan2") !== -1){
                request.abort();
            } else if (rtype === "image") {
                if(request.url().indexOf('upsell/ranshell/w03a/img09.jpg') == -1 && request.url().indexOf('upsell/ranshell/w03a/img10.jpg') == -1){
                    if(is_done){
                        request.continue();
                    }else{
                        request.abort();
                    }
                    //request.abort();
                }else{
                    //console.log('include img url = ', request.url());
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
                        request.continue();
                    }
                } else {
                    //console.log("doc ", rurl);
                    if(rurl.indexOf("checkouts/complete") !== -1){
                        is_done = true;
                    }
                    if(rurl.indexOf("/sc/error") !== -1){
                        is_done = false;
                    }
                    request.continue();
                }
            }
        });
        page.on("error", async () => {
            await browser.close();
            var exception = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                url: cart_url,
                status: 3,
                error_message: 'page crash',
                index: 0,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception);
        });

        var error_message = "セッションがタイムアウトになりました。</br>「電話番号」質問から再度ご入力ください。";
        try {
            if (typeof cookie != "undefined" && cookie != '') {
                cookie.url = cart_url;
                await page.setCookie(cookie);

                //if(data.ebis_cookie){
                //    await page.setCookie(data.ebis_cookie);
                //}

                if(data.user_agent){
                    await page.setUserAgent(data.user_agent);
                }

                //console.log(data.ebis_cookie);
                //data.ebis_cookie.url = "https://taj1.ebis.ne.jp";
                //await page.setCookie(data.ebis_cookie);

                await page.goto(cart_url, {waitUntil: 'load'});

                var current_url = await page.url();
                console.log("curren_url reorder", current_url);

                //console.log("landing_page_url", landing_page_url);
                //console.log("data.product_code", data.product_code);

                var card_number = '#cc_no',
                    cc_expire_m = '#cc_expire_m',
                    cc_expire_y = '#cc_expire_y',
                    cc_owner = '#cc_owner',
                    token_elm = '#frmCstm > input[name="token"]',
                    pay_token_order = '#pay_token_order',
                    pay_token_customer = '#pay_token_customer',
                    pay_token_error_code = '#pay_token_error_code',
                    btn_submit = '#btn_next',
                    up_sale_selection = "#frmCstm > #upsale_section > div > p:nth-child(9) > a > img",
                    btn_order = "input#frmsubmit";

                console.log("timeout landing_page_url", landing_page_url);
                if (!/iha-tamago/.test(landing_page_url) && data.product_code == product_code_2){
                    console.log("click up_sale_selection");
                    if (await page.$(up_sale_selection) !== null) {
                        await Promise.all([
                            page.click(up_sale_selection),
                            page.waitForNavigation()
                        ]);

                        var up_sale_checkout_url = await page.url();
                        console.log('up_sale_checkout_url==', up_sale_checkout_url);
                        if (/checkouts/.test(up_sale_checkout_url)) {
                            if (parseInt(data.payment_method) === credit_delivery) {
                                // const card_number = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(1) > td.bg_none > #cc_no';
                                // const cc_expire_m = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(2) > td.bg_none > select[name="cc_expire_m"]';
                                // const cc_expire_y = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(2) > td.bg_none > select[name="cc_expire_y"]';
                                // const cc_owner = '#contents > #frmCstm > div.section_wrapper > div.section_a > div.c_section-npb > #credit_toggle_area > table.table_form > tbody > tr:nth-child(3) > td.bg_none > input[name="cc_owner"]';

                                // remove class require
                                await page.evaluate((card_number, cc_expire_m, cc_expire_y, cc_owner) => {
                                    document.querySelector(card_number).classList.remove('validate[required,custom[integer]]');
                                    document.querySelector(cc_expire_m).classList.remove('validate[required,exclamation]');
                                    document.querySelector(cc_expire_y).classList.remove('validate[required,exclamation]');
                                    document.querySelector(cc_owner).classList.remove('validate[required,custom[onlyLetterCp]]');
                                }, card_number, cc_expire_m, cc_expire_y, cc_owner);

                                var payment_token = data.card_token;
                                // const token_elm = '#contents > #frmCstm > input[name="token"]';
                                // const pay_token_order = '#contents > #frmCstm > #pay_token_order';
                                // const pay_token_customer = '#contents > #frmCstm > #pay_token_customer';
                                // const pay_token_error_code = '#contents > #frmCstm > #pay_token_error_code';
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
                                page.click(btn_submit),
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
                // const confirm_submit_btn = "#contents > div.section_wrapper > div.section_a > div.c_section-npb >  #frmCstm > div.btn_wrapper > #frmsubmit";
                if (await page.$(btn_order) !== null) {
                    console.time('click_confirm');

                    if(data.product_code != product_code_4){
                        await Promise.all([
                            page.click(btn_order),
                            page.waitForNavigation()
                        ]);
                    }else{
                        await page.evaluate((btn_order) => {
                            var btn = btn_order;
                            var btn_length = document.querySelectorAll(btn_order).length;
                            btn_length = parseInt(btn_length);
                            if(btn_length >= 1){
                                btn = document.querySelectorAll(btn_order)[btn_length - 1];
                            }
                            btn.click();
                        }, btn_order);
                        await  page.waitForNavigation();
                    }


                    console.timeEnd('click_confirm');
                    const complete_url = await page.url();
                    console.log('complete_url', complete_url);
                    if (/complete/.test(complete_url)) {
                        puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
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
                        error_message = "クレジット決済は完了していません。</br>誠に申し訳ございませんがカード情報をご確認の上、再度入力をお願いします。";

                        puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                            $set: {
                                status_puppeteer: "error",
                                timeout_flg: 0,
                                error_message: error_message,
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {

                        });

                        puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
                            $set: {
                                status: 3,
                                error_message: error_message,
                                param: data,
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {
                            if (err) throw err;
                        });

                        var exception = {
                            cpid: data.connect_page_id,
                            user_id: data.user_id,
                            url: cart_url,
                            status: 3,
                            error_message: error_message,
                            index: 1,
                            request_body: body,
                            param: data
                        };
                        savePuppeteerException(exception);
                        response.error_message = error_message;
                        res.status(500).json(response);
                    }
                } else {
                    console.log('button submit can not find');
                    response.error_message = error_message;
                    res.status(500).json(response);

                    puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                        $set: {
                            status_puppeteer: "error",
                            timeout_flg: 0,
                            error_message: error_message,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {

                    });
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
                        $set: {
                            status: 3,
                            error_message: error_message,
                            param: data,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });
                }
            }else {
                console.log("cookie not exist");
                //error_message = "cookie not exist";
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
                    $set: {
                        status: 3,
                        error_message: "エラーが発生しました。",
                        param: data,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });
                response.error_message = error_message;
                res.status(500).json(response);
            }
        } catch (e) {

            puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
                $set: {
                    status: 3,
                    error_message: error_message,
                    param: data,
                    updated_at: new Date()
                }
            }, {upsert: false, multi: false}, function (err, result) {
                if (err) throw err;
            });

            console.log('executeOrder exception', e);
            var exception2 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                url: cart_url,
                status: 3,
                error_message: e,
                index: 1,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception2);
            response.error_message = error_message;
            res.status(500).json(response);
        }
        console.timeEnd("executeOrder");
        await browser.close();
    })()
}


router.post('/getPrice', function(req, res, next) {
    //console.log("start getPrice");
    var body = req.body;
    //console.log(body);
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
        console.log("product_code", product_code);
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
        }else if(product_code == product_code_4){
            response.product_unit_price = 2475;
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
        }else if(product_code == product_code_4){
            response.product_unit_price = 2475;
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

function getCookieEbis(arr) {
    if(arr && arr.cookies) {
        var result = null;
        arr = arr.cookies;
        for(var i = 0; i < arr.length; i++){
            var element = arr[i];
            if(element.name == 'TRACKING_DATA' && element.value != '') {
                result = element;
                break;
            }
        }
        return result
    }
    return null;
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

function getAllParam(url) {
    if (url != void 0) {
        const url_parts = url_require.parse(url);
        //console.log(url_parts);
        if(url_parts.query){
            return url_parts.query;
        }
        return '';
    }else{
        return '';
    }
}

function getLpUrl(url, user_device) {
    if (url != void 0) {
        var url_parts = url_require.parse(url);
        if(url_parts && url_parts.pathname){
            var pathname = url_parts.pathname;
            if(pathname.indexOf("sp") == -1 && user_device == "mobile"){
                var new_pathname = pathname + "sp/";
                console.log("new_pathname=", new_pathname);
                url = url.replace(pathname, new_pathname);
            }
        }
    }
    return url;
}


router.post('/getShoppingTimeLabel', function(req, res, next) {
    var body = req.body;
    //console.log("getShoppingTimeLabel", body);
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

router.post('/orderClick', function(req, res, next) {
    var body = req.body;
    var cpid = body.cpid;
    var uid = body.user_id;
    var response2 = {};
    response2.error_message = "エラーが発生しました。";

    puppeteerOrderClick.findOne({
        cpid: cpid,
        uid: uid
    }, function (err, result) {
        //console.log(result);
        if(result){
            puppeteerOrderClick.findOneAndUpdate({_id: result._id}, {
                $set: {
                    status_order: "order",
                    updated_at: new Date()
                }
            }, {upsert: false}, function (err, result) {
                var cnt = 0;
                var intervalObject = setInterval(function () {
                    puppeteerOrderClick.findOne({cpid : cpid, uid: uid},function(err, result) {
                        if (result) {
                            if(result.timeout_flg){
                                console.log("timeout_flgtimeout_flgtimeout_flg");
                                clearInterval(intervalObject);
                                //puppeteerOrderClick.remove({_id: result._id}, function(err) {
                                //
                                //});
                                var confirm_url = body.confirm_url;
                                var data = {
                                    user_id: uid,
                                    connect_page_id: cpid,
                                    confirm_url: confirm_url,
                                    ad_code: (typeof  body.ad_code != "undefined") ? body.ad_code : '',
                                    product_code: (typeof  body.product_code != "undefined") ? body.product_code : '',
                                    payment_method: (typeof  body.payment_method != "undefined") ? body.payment_method : '',
                                    card_token: (typeof  body.card_token != "undefined") ? body.card_token : '',
                                    user_agent: body.user_agent,
                                    user_device: body.user_device
                                };
                                console.log("data", data);

                                puppeteerRequest.remove({cpid: cpid, user_id: uid, index: {$gte: 2}}, function(err) {
                                    if (err) throw err;
                                    var insert_data = {
                                        cpid: cpid,
                                        user_id: uid,
                                        url: confirm_url,
                                        status: 0,
                                        error_message: "",
                                        index: 2,
                                        request_body: body,
                                        param: data
                                    };

                                    var data_save = new puppeteerRequest(insert_data);
                                    data_save.save(function(err, result1) {
                                        if(err) throw  err;
                                        data.object_id_index_2 =  result1._id;
                                        data.puppeteerOrderClickId = result._id;
                                        checkPreviousOrder(body, data, res);
                                    });
                                });
                            }
                            else if(result.status_puppeteer == "complete"){
                                clearInterval(intervalObject);
                                res.status(200).json({"thank_url": result.thank_url, "ebis_complete_url": result.ebis_complete_url});
                            }
                            else if(result.status_puppeteer == "error"){
                                clearInterval(intervalObject);
                                var response = {};
                                response.error_message = result.error_message;
                                res.status(500).json(response);
                            }else{
                                //continue loop
                                cnt++;
                                console.log("wait cnt", cnt);
                                if(cnt > 70){
                                    clearInterval(intervalObject);
                                    res.status(500).json(response2);
                                }
                            }
                        }else{
                            res.status(500).json(response2);
                        }
                    });
                }, 1000);
            });
        }else {
            res.status(500).json(response2);
        }
    });
});

module.exports = router;
