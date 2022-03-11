// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by nguyen.duc.quyet on 26/06/2019.
 */
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const puppeteer = require('puppeteer');
var model = require('../model');

const puppeteerRequest = model.PuppeteerRequest;
const puppeteerException = model.PuppeteerException;
const puppeteerOrderClick = model.PuppeteerOrderClick;
const puppeteerEmailRegister = model.PuppeteerEmailRegister;

const quantity_default = 1;
const credit_delivery = 5;
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

router.post('/validate_email', function(req, res, next) {
    var body = req.body;
    var mail = body.mail;
    var landing_page_url = body.landing_page_url;
    var response = {};
    console.time('validate_email');

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
            if(rurl.indexOf("app.botchan.chat") !== -1 || rurl.indexOf("botchan2") !== -1){
                request.abort();
            } else if (rtype === "xhr" || rtype === "font" || rtype === "stylesheet" || rtype === "image" || rtype === "script") {
                request.abort();
            } else if (rtype === "document") {
                if(request.url().indexOf("minorinomi") !== -1){
                    request.continue();
                }else{
                    request.abort();
                }
            } else {
                request.continue();
            }
        });

        try {
            var result_registered = await puppeteerEmailRegister.findOne({cpid : body.cpid, uid: body.user_id, email: mail});
            if(result_registered && result_registered.registered_flg == 1){
                res.status(200).json({});
                return;
            }
            console.log('start validate_email');
            await page.goto(landing_page_url, {waitUntil: 'networkidle0'});
            await page.waitForSelector('.form_area > form');
            const form_customer = '.form_area > form > table:nth-child(15) > tbody >';
            const payment_method_tbl = '.form_area > form > table#payment > tbody > tr > td >';
            const term_of_use_elm = 'input#teiki_doui';

            console.log("start fill email");
            const email_elm = form_customer + ' tr:nth-child(9) > td > p > input[name="order_email"]';
            //mail
            await page.focus(email_elm);
            await page.keyboard.type(mail);
            await page.click(payment_method_tbl + ' input[value="6"]');
            await page.waitFor(1000);
            //term of use
            if (await page.$(term_of_use_elm) !== null) {
                const checkbox = await page.$(term_of_use_elm);
                var is_checked = await (await checkbox.getProperty('checked')).jsonValue();
                console.log("checkbox term of use------", is_checked);
                if(!is_checked) {
                    await page.click(term_of_use_elm);
                }
            } else {
                console.log('not find term_of_use element');
            }
            await page.$eval('.form_area > form', form => form.submit());
            console.time('submit_form');
            const header_confirm_page_elm = '.form_area > form > h3:nth-child(4)';
            await page.waitForSelector(header_confirm_page_elm,  {waitUntil: 'load', timeout: 5000}).then(() => {

            }).catch(e => {

            });
            console.timeEnd('submit_form');
            await page.screenshot({path: 'pictures/_validate_email_' + Date.now() + '.png', fullPage: true});
            const error_mail = form_customer + ' tr:nth-child(9) > td div.attention';
            if(await page.$(error_mail) !== null){
                response.error_message = '※ すでに会員登録で使用されているメールアドレスです。';
                res.status(500).json(response);
            }else{
                res.status(200).json(response);
            }
            console.timeEnd("validate_email");
            await browser.close();
        } catch (e) {
            console.log('Validate email exception', e);
            console.timeEnd("validate_email");
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
            await browser.close();
        }
    })()
});

router.post('/confirm', function(req, res, next) {
    var body = req.body;
    var user_id = body.user_id;
    var connect_page_id = body.cpid;
    var quantity = (typeof  body.quantity != "undefined") ? body.quantity : quantity_default;
    var address03 =  (typeof  body.address03 != "undefined") ? body.address03 : "";
    var phone = splitPhoneNumber(body.phone);
    var birthday = splitBirthday(body.birth_day);

    res.status(200).json({});
    var data = {
        user_id: user_id,
        user_agent: body.user_agent,
        connect_page_id: connect_page_id,
        quantity: quantity.toString(),
        landing_page_url: body.landing_page_url,
        first_name: body.first_name,
        last_name: body.last_name,
        furigana_first: body.furigana_first,
        furigana_last: body.furigana_last,
        zipcode1: body.zipcode1,
        zipcode2: body.zipcode2,
        pref: body.pref,
        address01: body.address01,
        address02: body.address02 + address03,
        phone1: phone.phone1,
        phone2: phone.phone2,
        phone3: phone.phone3,
        gender: body.gender,
        year_bd: birthday.year,
        month_bd: birthday.month,
        day_bd: birthday.day,
        mail: body.mail,
        payment_method: body.payment_method,
        card_token: body.card_token
    };
    console.log("===confirm data===", data);

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
            puppeteerRequest.remove({cpid: connect_page_id, user_id: user_id}, function(err) {
                if (err) throw err;
                var insert_data = {
                    cpid: connect_page_id,
                    user_id: user_id,
                    url: data.landing_page_url,
                    status: 2,
                    error_message: "",
                    index: 1,
                    param: data
                };

                var data_save = new puppeteerRequest(insert_data);
                data_save.save(function(err, result1) {
                    if(err) throw  err;
                    data.object_id_index_1 =  result1._id;
                    data.puppeteerOrderClickId = result_order._id;
                    puppeteerEmailRegister.findOne({cpid : data.connect_page_id, uid: data.user_id, email: data.mail},function(err, result_registered) {
                        if (result_registered && result_registered.registered_flg == 1) {
                            data.cookie_registered = result_registered.cookie;
                        }
                        executeConfirm(data, res);
                    });
                    // executeConfirm(data, res);
                });
            });
        });
    });
});

router.post('/orderClick', function(req, res, next) {
    var body = req.body;
    var cpid = body.cpid;
    var uid = body.user_id;
    var quantity = (typeof  body.quantity != "undefined") ? body.quantity : quantity_default;
    var address03 =  (typeof  body.address03 != "undefined") ? body.address03 : "";
    var phone = splitPhoneNumber(body.phone);
    var birthday = splitBirthday(body.birth_day);
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
                                clearInterval(intervalObject);
                                puppeteerOrderClick.remove({_id: result._id}, function(err) {
                                    var landing_page_url = body.landing_page_url;
                                    var data = {
                                        user_id: uid,
                                        user_agent: body.user_agent,
                                        connect_page_id: cpid,
                                        quantity: quantity.toString(),
                                        landing_page_url: landing_page_url,
                                        first_name: body.first_name,
                                        last_name: body.last_name,
                                        furigana_first: body.furigana_first,
                                        furigana_last: body.furigana_last,
                                        zipcode1: body.zipcode1,
                                        zipcode2: body.zipcode2,
                                        pref: body.pref,
                                        address01: body.address01,
                                        address02: body.address02 + address03,
                                        phone1: phone.phone1,
                                        phone2: phone.phone2,
                                        phone3: phone.phone3,
                                        gender: body.gender,
                                        year_bd: birthday.year,
                                        month_bd: birthday.month,
                                        day_bd: birthday.day,
                                        mail: body.mail,
                                        payment_method: body.payment_method,
                                        card_token: body.card_token
                                    };
                                    console.log("data", data);

                                    puppeteerRequest.remove({cpid: cpid, user_id: uid, index: {$gte: 2}}, function(err) {
                                        if (err) throw err;
                                       /* var insert_data = {
                                            cpid: cpid,
                                            user_id: uid,
                                            url: landing_page_url,
                                            status: 0,
                                            error_message: "",
                                            index: 1,
                                            param: data
                                        };

                                        var data_save = new puppeteerRequest(insert_data);
                                        data_save.save(function(err, result1) {
                                            if(err) throw  err;
                                            data.object_id_index_1 =  result1._id;
                                            executeOrder(data, res);
                                        });*/
                                        puppeteerRequest.findOne({cpid: cpid, user_id: uid, index: 1, status: 1},function(err, result1) {
                                            if (result1) {
                                                var cookie = result1.cookie;
                                                data.object_id_index_1 = result1._id;
                                                data.cookie = cookie;
                                                data.confirm_url = result1.url;
                                                var insert_data = {
                                                    cpid: data.connect_page_id,
                                                    user_id: data.user_id,
                                                    url: result1.url,
                                                    status: 2,
                                                    error_message: "",
                                                    index: 2,
                                                    param: data
                                                };
                                                var data_save = new puppeteerRequest(insert_data);
                                                data_save.save(function(err, result2) {
                                                    if(err) throw  err;
                                                    data.object_id_index_2 =  result2._id;
                                                    executeOrder(data, res);
                                                });
                                            }
                                        });
                                    });
                                });
                            }
                            else if(result.status_puppeteer == "complete"){
                                clearInterval(intervalObject);
                                res.status(200).json({"thank_url": result.thank_url});
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
                }, 500);
            });
        }else {
            res.status(500).json(response2);
        }
    });
});

function executeConfirm(data, res) {
    console.time("executeConfirm");
    var landing_page_url = data.landing_page_url;
    var is_done = false;
    var cookie_registered = data.cookie_registered;
    console.log("landing_page_url", landing_page_url);

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
        if(data.user_agent){
            await page.setUserAgent(data.user_agent);
        }
        await page.setRequestInterception(true);
        page.on('request', request => {
            var rtype = request.resourceType();
            var rurl = request.url();
            if(rurl.indexOf("app.botchan.chat") !== -1 || rurl.indexOf("botchan2") !== -1){
                request.abort();
            // } else if (rtype === "xhr" || rtype === "font" || rtype === "stylesheet" || rtype === "image" || rtype === "script") {
            } else if (rtype === "xhr" || rtype === "font" || rtype === "image" || rtype === "script") {
            //     console.log('url 1===', request.url());
                request.abort();
            } else if (rtype === "document") {
                if(request.url().indexOf("minorinomi") !== -1){
                    console.log('url 2===', rurl);
                    if(rurl.indexOf("https://ec.minorinomi.jp/shopping/complete.php?transactionid") !== -1){
                        var complete_url = rurl;
                        puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                            $set: {
                                status_puppeteer: "complete",
                                thank_url: complete_url,
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {

                        });
                    }
                    request.continue();
                }else{
                    // console.log('url 3===', rurl);
                    request.abort();
                }
            } else {
                request.continue();
            }
        });

        try {
            if(typeof cookie_registered != "undefined" && cookie_registered != ''){
                await page.setCookie(cookie_registered);
            }
            await page.goto(landing_page_url, {waitUntil: 'networkidle0'});
            await page.waitForSelector('.form_area > form');
            const quantity_elm = ".form_area > form > table:nth-child(11) > tbody > tr:nth-child(2) > td:nth-child(4) > select[name='quantity']";
            const form_customer = '.form_area > form > table:nth-child(15) > tbody >';
            const payment_method_tbl = '.form_area > form > table#payment > tbody > tr > td >';
            // const term_of_use_elm = '.form_area > form > div:nth-child(21) > input#teiki_doui';
            const term_of_use_elm = 'input#teiki_doui';
            /*set quantity*/
            // await page.select(quantity_elm, data.quantity);
            console.log("start fill info customer");
            const last_name_elm = form_customer + ' tr:nth-child(1) > td > input[name="order_name01"]';
            const first_name_elm = form_customer + ' tr:nth-child(1) > td > input[name="order_name02"]';
            const last_kana_elm = form_customer + ' tr:nth-child(2) > td > input[name="order_kana01"]';
            const first_kana_elm = form_customer + ' tr:nth-child(2) > td > input[name="order_kana02"]';
            const zipcode1_elm = form_customer + ' tr:nth-child(4) > td > p > input[name="order_zip01"]';
            const zipcode2_elm = form_customer + ' tr:nth-child(4) > td > p > input[name="order_zip02"]';
            const pref_elm = form_customer + ' tr:nth-child(5) > td > select[name="order_pref"]';
            const addr01_elm = form_customer + ' tr:nth-child(6) > td > p > input[name="order_addr01"]';
            const addr02_elm = form_customer + ' tr:nth-child(7) > td > p > input[name="order_addr02"]';
            const phone1_elm = form_customer + ' tr:nth-child(8) > td > p > input[name="order_tel01"]';
            const phone2_elm = form_customer + ' tr:nth-child(8) > td > p > input[name="order_tel02"]';
            const phone3_elm = form_customer + ' tr:nth-child(8) > td > p > input[name="order_tel03"]';
            const email_elm = form_customer + ' tr:nth-child(9) > td > p > input[name="order_email"]';
            const gender_elm = form_customer + ' tr:nth-child(10) > td > p > select[name="order_sex"]';
            const year_elm = form_customer + ' tr:nth-child(11) > td > select[name="year"]';
            const month_elm = form_customer + ' tr:nth-child(11) > td > select[name="month"]';
            const day_elm = form_customer + ' tr:nth-child(11) > td > select[name="day"]';

            await page.evaluate((last_name_elm, first_name_elm, last_kana_elm, first_kana_elm, email_elm,
                                 phone1_elm, phone2_elm, phone3_elm, zipcode1_elm, zipcode2_elm, addr01_elm, addr02_elm) => {
                    document.querySelector(last_name_elm).value = '';
                    document.querySelector(first_name_elm).value = '';
                    document.querySelector(last_kana_elm).value = '';
                    document.querySelector(first_kana_elm).value = '';
                    document.querySelector(email_elm).value = '';
                    document.querySelector(phone1_elm).value = '';
                    document.querySelector(phone2_elm).value = '';
                    document.querySelector(phone3_elm).value = '';
                    document.querySelector(zipcode1_elm).value = '';
                    document.querySelector(zipcode2_elm).value = '';
                    document.querySelector(addr01_elm).value = '';
                    document.querySelector(addr02_elm).value = '';
                }, last_name_elm, first_name_elm, last_kana_elm, first_kana_elm, email_elm,
                phone1_elm, phone2_elm, phone3_elm, zipcode1_elm, zipcode2_elm, addr01_elm, addr02_elm);
            //nonmember_name_name
            await page.focus(last_name_elm);
            await page.keyboard.type(data.last_name);
            await page.focus(first_name_elm);
            await page.keyboard.type(data.first_name);
            //nonmember_kana_kana
            await page.focus(last_kana_elm);
            await page.keyboard.type(data.furigana_last);
            await page.focus(first_kana_elm);
            await page.keyboard.type(data.furigana_first);
            //zipcode
            await page.focus(zipcode1_elm);
            await page.keyboard.type(data.zipcode1);
            await page.focus(zipcode2_elm);
            await page.keyboard.type(data.zipcode2);
            //pref
            const pref_code = pref_code_list[data.pref] != 'undefined' ? pref_code_list[data.pref] : '';
            console.log('pref_code = ', pref_code);
            await page.focus(pref_elm);
            await page.select(pref_elm, pref_code);
            //address
            console.log('data.address01', data.address01);
            await page.focus(addr01_elm);
            await page.keyboard.type(data.address01);
            console.log('data.address02', data.address02);
            await page.focus(addr02_elm);
            await page.keyboard.type(data.address02);
            //tel
            await page.focus(phone1_elm);
            await page.keyboard.type(data.phone1);
            await page.focus(phone2_elm);
            await page.keyboard.type(data.phone2);
            await page.focus(phone3_elm);
            await page.keyboard.type(data.phone3);
            //mail
            await page.focus(email_elm);
            await page.keyboard.type(data.mail);
            //gender
            if (data.gender != '') {
                await page.select(gender_elm, data.gender);
            }
            //birthday
            if (data.year_bd != "" && data.month_bd != "" && data.day_bd != "") {
                //year bd
                const year_bd = (typeof data.year_bd != 'undefined') ? data.year_bd.toString() : '';
                await page.focus(year_elm);
                await page.select(year_elm, year_bd);
                //month bd
                const month_bd = (typeof data.month_bd != 'undefined') ? data.month_bd.toString() : '';
                await page.focus(month_elm);
                await page.select(month_elm, month_bd);
                //date bd
                const day_bd = (typeof data.day_bd != 'undefined') ? data.day_bd.toString() : '';
                await page.focus(day_elm);
                await page.select(day_elm, day_bd);
            }
            //payment menthod
            await page.click(payment_method_tbl + ' input[value="' + data.payment_method + '"]');
            await page.waitFor(1000);
            if (parseInt(data.payment_method) === credit_delivery) {
                var payment_token = data.card_token;
                const card_frm = '#credit_info > table > tbody >';
                const card_number = card_frm + ' tr:nth-child(1) > td > #card_no';
                const cc_expire_m = card_frm + ' tr:nth-child(2) > td > #card_exp_month';
                const cc_expire_y = card_frm + ' tr:nth-child(2) > td > #card_exp_year';
                const cc_owner = card_frm + ' tr:nth-child(3) > td > #card_owner';
                // remove attribute name
                await page.evaluate((card_number, cc_expire_m, cc_expire_y, cc_owner) => {
                    document.querySelector(card_number).removeAttribute('name');
                    document.querySelector(cc_expire_m).removeAttribute('name');
                    document.querySelector(cc_expire_y).removeAttribute('name');
                    document.querySelector(cc_owner).removeAttribute('name');
                }, card_number, cc_expire_m, cc_expire_y, cc_owner);
                //create input payment token
                await page.evaluate((payment_token) => {
                    const token_elm = document.createElement('input');
                    token_elm.setAttribute('type', 'text');
                    token_elm.setAttribute('name', 'webcollectToken');
                    token_elm.value = payment_token;
                    document.querySelector('.form_area > form').prepend(token_elm);
                    // document.querySelector('.form_area > form').;
                }, payment_token);
                const token_tmp = '.form_area > form > input[name="webcollectToken"]';
                const token_tmp_val = await page.$eval(token_tmp, el => el.value);
                console.log('token_tmp_val == ', token_tmp_val);
                //submit form
            }
            //term of use
            if (await page.$(term_of_use_elm) !== null) {
                const checkbox = await page.$(term_of_use_elm);
                var is_checked = await (await checkbox.getProperty('checked')).jsonValue();
                console.log("checkbox term of use------", is_checked);
                if(!is_checked) {
                    await page.click(term_of_use_elm);
                }
            } else {
                console.log('not find term_of_use element');
            }
            // await page.screenshot({path: 'pictures/_fill_form_' + Date.now() + '.png', fullPage: true});
            await page.$eval('.form_area > form', form => form.submit());
            console.time('submit_form');
            const header_confirm_page_elm = '.form_area > form > h3:nth-child(4)';
            await page.waitForSelector(header_confirm_page_elm,  {waitUntil: 'load', timeout: 10000}).then(() => {
                console.log('redirect confirm page success');
                console.log(page.url());
            }).catch(e => {
                console.log('redirect confirm page fail', e);
            });
            console.timeEnd('submit_form');
            const confirm_url = await page.url();
            console.log('confirm_url', confirm_url);
            await page.screenshot({path: 'pictures/_fill_form_' + Date.now() + '.png', fullPage: true});
            // confirm order
            if (/confirm/.test(confirm_url)) {
                const cookiesObject = await page.cookies();
                var cookie = getCookie(cookiesObject);
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_1}, {
                    $set: {
                        status: 1,
                        url: confirm_url,
                        cookie: cookie,
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
                                    param: data
                                };

                                var data_save = new puppeteerRequest(insert_data);

                                var result1 = await data_save.save();
                                data.object_id_index_2 =  result1._id;
                                /*update register user*/
                                console.log('registered user');
                                const cookiesPage = await page.cookies();
                                var cookie_new = getCookie(cookiesPage);
                                puppeteerEmailRegister.update({cpid: data.connect_page_id, uid: data.user_id, email: data.mail},
                                    {$set: {
                                        cpid: data.connect_page_id,
                                        uid: data.user_id,
                                        email: data.mail,
                                        registered_flg: 1,
                                        cookie: cookie_new,
                                        created_at: new Date(),
                                        updated_at: new Date()
                                    }
                                    },
                                    {upsert: true, multi: false}, function (err) {
                                        if (err) throw err;
                                    });
                                /*end*/
                                // button confirm click
                                await page.$eval('.form_area > form', form => form.submit());
                                console.time('click_confirm');
                                const header_thank_page_elm = '#undercolumn_shopping > h2';
                               /* await page.waitForSelector(header_thank_page_elm,  {waitUntil: 'load', timeout: 10000}).then(() => {
                                    console.log('redirect thanks page success');
                                    console.log(page.url());
                                }).catch(e => {
                                    console.log('redirect thanks page fail', e);
                                });*/
                                console.timeEnd('click_confirm');
                                const complete_url = await page.url();
                                console.log('complete_url', complete_url);
                                if (/complete/.test(complete_url)) {
                                    /*puppeteerOrderClick.findOneAndUpdate({_id: data.puppeteerOrderClickId}, {
                                        $set: {
                                            status_puppeteer: "complete",
                                            thank_url: complete_url,
                                            updated_at: new Date()
                                        }
                                    }, {upsert: false, multi: false}, function (err, result) {

                                    });*/
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
                                    // const html = await page.content();
                                    console.timeEnd("executeConfirm");
                                    await browser.close();
                                } else {
                                    await page.screenshot({path: 'pictures/_order_error_' + Date.now() + '.png', fullPage: true});
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

                                    console.log('payment error');
                                  /*  var exception = {
                                        cpid: data.connect_page_id,
                                        user_id: data.user_id,
                                        url: confirm_url,
                                        status: 3,
                                        error_message: "クレジット決済は完了していません。</br>誠に申し訳ございませんがカード情報をご確認の上、再度入力をお願いします。",
                                        index: 2,
                                        param: data
                                    };
                                    savePuppeteerException(exception);*/
                                    console.timeEnd("executeConfirm");
                                    await browser.close();
                                }
                            }
                            else{
                                //continue loop
                                cnt2++;
                                console.log("wait cnt2", cnt2);

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
                    }, 1000);
                });
            } else {

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
                        url: confirm_url,
                        error_message: "エラーが発生しました。再度ご試しください。",
                        param: data,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });

                console.log('confirm error');
                var exception = {
                    cpid: data.connect_page_id,
                    user_id: data.user_id,
                    url: confirm_url,
                    status: 3,
                    error_message: 'confirm error',
                    index: 1,
                    param: data
                };
                savePuppeteerException(exception);
                console.timeEnd("executeConfirm");
                await browser.close();
            }
        } catch (e) {
            console.log('executeConfirm exception', e);

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
                url: landing_page_url,
                status: 3,
                error_message: e,
                index: 1,
                param: data
            };
            savePuppeteerException(exception2);
            console.timeEnd("executeConfirm");
            await browser.close();
        }
    })()
}

function executeOrder(data, res) {
    console.time("executeOrder");
    var response = {};
    var landing_page_url = data.landing_page_url;
    var is_done = false;
    var cookie = data.cookie;
    var confirm_url = data.confirm_url;
    console.log("confirm_url", confirm_url);

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
        if(data.user_agent){
            await page.setUserAgent(data.user_agent);
        }
        await page.setRequestInterception(true);
        page.on('request', request => {
            var rtype = request.resourceType();
            var rurl = request.url();
            if(rurl.indexOf("app.botchan.chat") !== -1 || rurl.indexOf("botchan2") !== -1){
                request.abort();
                } else if (rtype === "xhr" || rtype === "font" || rtype === "stylesheet" || rtype === "image" || rtype === "script") {
            // } else if (rtype === "xhr" || rtype === "font" || rtype === "image" || rtype === "script") {
                // console.log('url 1===', request.url());
                request.abort();
            } else if (rtype === "document") {
                console.log('url 2===', rurl);
                if(request.url().indexOf("minorinomi") !== -1){
                    if(rurl.indexOf("https://ec.minorinomi.jp/shopping/complete.php?transactionid") !== -1){
                        response.thank_url = rurl;
                        res.status(200).json(response);
                        console.timeEnd("executeOrder");
                    }
                    request.continue();
                }else{
                    request.abort();
                }
            } else {
                // console.log('url 3===', rurl);
                request.continue();
            }
        });

        try {
            if (typeof cookie != 'undefined') {
                await page.setCookie(cookie);
                await page.goto(confirm_url, {waitUntil: 'networkidle0'});
                await page.screenshot({path: 'pictures/_confirm000_' + Date.now() + '.png', fullPage: true});
                await page.waitForSelector('.form_area > form');
                /*const quantity_elm = ".form_area > form > table:nth-child(11) > tbody > tr:nth-child(2) > td:nth-child(4) > select[name='quantity']";
                const form_customer = '.form_area > form > table:nth-child(15) > tbody >';
                const payment_method_tbl = '.form_area > form > table#payment > tbody > tr > td >';
                // const term_of_use_elm = '.form_area > form > div:nth-child(21) > input#teiki_doui';
                const term_of_use_elm = 'input#teiki_doui';
                /!*set quantity*!/
                // await page.select(quantity_elm, data.quantity);
                console.log("start fill info customer");
                const last_name_elm = form_customer + ' tr:nth-child(1) > td > input[name="order_name01"]';
                const first_name_elm = form_customer + ' tr:nth-child(1) > td > input[name="order_name02"]';
                const last_kana_elm = form_customer + ' tr:nth-child(2) > td > input[name="order_kana01"]';
                const first_kana_elm = form_customer + ' tr:nth-child(2) > td > input[name="order_kana02"]';
                const zipcode1_elm = form_customer + ' tr:nth-child(4) > td > p > input[name="order_zip01"]';
                const zipcode2_elm = form_customer + ' tr:nth-child(4) > td > p > input[name="order_zip02"]';
                const pref_elm = form_customer + ' tr:nth-child(5) > td > select[name="order_pref"]';
                const addr01_elm = form_customer + ' tr:nth-child(6) > td > p > input[name="order_addr01"]';
                const addr02_elm = form_customer + ' tr:nth-child(7) > td > p > input[name="order_addr02"]';
                const phone1_elm = form_customer + ' tr:nth-child(8) > td > p > input[name="order_tel01"]';
                const phone2_elm = form_customer + ' tr:nth-child(8) > td > p > input[name="order_tel02"]';
                const phone3_elm = form_customer + ' tr:nth-child(8) > td > p > input[name="order_tel03"]';
                const email_elm = form_customer + ' tr:nth-child(9) > td > p > input[name="order_email"]';
                const gender_elm = form_customer + ' tr:nth-child(10) > td > p > select[name="order_sex"]';
                const year_elm = form_customer + ' tr:nth-child(11) > td > select[name="year"]';
                const month_elm = form_customer + ' tr:nth-child(11) > td > select[name="month"]';
                const day_elm = form_customer + ' tr:nth-child(11) > td > select[name="day"]';

                await page.evaluate((last_name_elm, first_name_elm, last_kana_elm, first_kana_elm, email_elm,
                                     phone1_elm, phone2_elm, phone3_elm, zipcode1_elm, zipcode2_elm, addr01_elm, addr02_elm) => {
                        document.querySelector(last_name_elm).value = '';
                        document.querySelector(first_name_elm).value = '';
                        document.querySelector(last_kana_elm).value = '';
                        document.querySelector(first_kana_elm).value = '';
                        document.querySelector(email_elm).value = '';
                        document.querySelector(phone1_elm).value = '';
                        document.querySelector(phone2_elm).value = '';
                        document.querySelector(phone3_elm).value = '';
                        document.querySelector(zipcode1_elm).value = '';
                        document.querySelector(zipcode2_elm).value = '';
                        document.querySelector(addr01_elm).value = '';
                        document.querySelector(addr02_elm).value = '';
                    }, last_name_elm, first_name_elm, last_kana_elm, first_kana_elm, email_elm,
                    phone1_elm, phone2_elm, phone3_elm, zipcode1_elm, zipcode2_elm, addr01_elm, addr02_elm);
                //nonmember_name_name
                await page.focus(last_name_elm);
                await page.keyboard.type(data.last_name);
                await page.focus(first_name_elm);
                await page.keyboard.type(data.first_name);
                //nonmember_kana_kana
                await page.focus(last_kana_elm);
                await page.keyboard.type(data.furigana_last);
                await page.focus(first_kana_elm);
                await page.keyboard.type(data.furigana_first);
                //zipcode
                await page.focus(zipcode1_elm);
                await page.keyboard.type(data.zipcode1);
                await page.focus(zipcode2_elm);
                await page.keyboard.type(data.zipcode2);
                //pref
                const pref_code = pref_code_list[data.pref] != 'undefined' ? pref_code_list[data.pref] : '';
                console.log('pref_code = ', pref_code);
                await page.focus(pref_elm);
                await page.select(pref_elm, pref_code);
                //address
                console.log('data.address01', data.address01);
                await page.focus(addr01_elm);
                await page.keyboard.type(data.address01);
                console.log('data.address02', data.address02);
                await page.focus(addr02_elm);
                await page.keyboard.type(data.address02);
                //tel
                await page.focus(phone1_elm);
                await page.keyboard.type(data.phone1);
                await page.focus(phone2_elm);
                await page.keyboard.type(data.phone2);
                await page.focus(phone3_elm);
                await page.keyboard.type(data.phone3);
                //mail
                await page.focus(email_elm);
                await page.keyboard.type(data.mail);
                //gender
                if (data.gender != '') {
                    await page.select(gender_elm, data.gender);
                }
                //birthday
                if (data.year_bd != "" && data.month_bd != "" && data.day_bd != "") {
                    //year bd
                    const year_bd = (typeof data.year_bd != 'undefined') ? data.year_bd.toString() : '';
                    await page.focus(year_elm);
                    await page.select(year_elm, year_bd);
                    //month bd
                    const month_bd = (typeof data.month_bd != 'undefined') ? data.month_bd.toString() : '';
                    await page.focus(month_elm);
                    await page.select(month_elm, month_bd);
                    //date bd
                    const day_bd = (typeof data.day_bd != 'undefined') ? data.day_bd.toString() : '';
                    await page.focus(day_elm);
                    await page.select(day_elm, day_bd);
                }
                //payment menthod
                await page.click(payment_method_tbl + ' input[value="' + data.payment_method + '"]');
                await page.waitFor(1000);
                if (parseInt(data.payment_method) === credit_delivery) {
                    var payment_token = data.card_token;
                    const card_frm = '#credit_info > table > tbody >';
                    const card_number = card_frm + ' tr:nth-child(1) > td > #card_no';
                    const cc_expire_m = card_frm + ' tr:nth-child(2) > td > #card_exp_month';
                    const cc_expire_y = card_frm + ' tr:nth-child(2) > td > #card_exp_year';
                    const cc_owner = card_frm + ' tr:nth-child(3) > td > #card_owner';
                    // remove attribute name
                    await page.evaluate((card_number, cc_expire_m, cc_expire_y, cc_owner) => {
                        document.querySelector(card_number).removeAttribute('name');
                        document.querySelector(cc_expire_m).removeAttribute('name');
                        document.querySelector(cc_expire_y).removeAttribute('name');
                        document.querySelector(cc_owner).removeAttribute('name');
                    }, card_number, cc_expire_m, cc_expire_y, cc_owner);
                    //create input payment token
                    await page.evaluate((payment_token) => {
                        const token_elm = document.createElement('input');
                        token_elm.setAttribute('type', 'text');
                        token_elm.setAttribute('name', 'webcollectToken');
                        token_elm.value = payment_token;
                        document.querySelector('.form_area > form').prepend(token_elm);
                        // document.querySelector('.form_area > form').;
                    }, payment_token);
                    const token_tmp = '.form_area > form > input[name="webcollectToken"]';
                    const token_tmp_val = await page.$eval(token_tmp, el => el.value);
                    console.log('token_tmp_val == ', token_tmp_val);
                    //submit form
                }
                //term of use
                if (await page.$(term_of_use_elm) !== null) {
                    const checkbox = await page.$(term_of_use_elm);
                    var is_checked = await (await checkbox.getProperty('checked')).jsonValue();
                    console.log("checkbox term of use------", is_checked);
                    if(!is_checked) {
                        await page.click(term_of_use_elm);
                    }
                } else {
                    console.log('not find term_of_use element');
                }
                // await page.screenshot({path: 'pictures/_fill_form_' + Date.now() + '.png', fullPage: true});
                await page.$eval('.form_area > form', form => form.submit());
                console.time('submit_form');
                const header_confirm_page_elm = '.form_area > form > h3:nth-child(4)';
                await page.waitForSelector(header_confirm_page_elm,  {waitUntil: 'load', timeout: 10000}).then(() => {
                    console.log('redirect confirm page success');
                    console.log(page.url());
                }).catch(e => {
                    console.log('redirect confirm page fail', e);
                });
                console.timeEnd('submit_form');
                const confirm_url = await page.url();
                console.log('confirm_url', confirm_url);*/
                // confirm order
                // if (/confirm/.test(confirm_url)) {
                //     puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_1}, {
                //         $set: {
                //             status: 1,
                //             url: confirm_url,
                //             param: data,
                //             updated_at: new Date()
                //         }
                //     }, {upsert: false, multi: false}, function (err, result) {
                //         if (err) throw err;
                //     });
                //     var remove = await puppeteerRequest.remove({cpid: data.connect_page_id, user_id: data.user_id, index: {$gte: 2}});
                //     var insert_data = {
                //         cpid: data.connect_page_id,
                //         user_id: data.user_id,
                //         url: confirm_url,
                //         status: 2,
                //         error_message: "",
                //         index: 2,
                //         param: data
                //     };
                //     var data_save = new puppeteerRequest(insert_data);
                //
                //     var result1 = await data_save.save();
                //     data.object_id_index_2 =  result1._id;
                    // button confirm click
                    await page.$eval('.form_area > form', form => form.submit());
                    console.time('click_confirm');
                    const header_thank_page_elm = '#undercolumn_shopping > h2';
                    await page.waitForSelector(header_thank_page_elm,  {waitUntil: 'load', timeout: 10000}).then(() => {
                        console.log('redirect thanks page success');
                        console.log(page.url());
                    }).catch(e => {
                        console.log('redirect thanks page fail', e);
                    });
                    console.timeEnd('click_confirm');
                    const complete_url = await page.url();
                    console.log('complete_url', complete_url);
                    if (/complete/.test(complete_url)) {
                        // res.status(200).json(response);
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
                        // console.timeEnd("executeOrder");
                        await browser.close();
                    } else {
                        console.log('Payment error');
                        puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
                            $set: {
                                status: 3,
                                error_message: "Payment error",
                                param: data,
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {
                            if (err) throw err;
                        });
                        var exception = {
                            cpid: data.connect_page_id,
                            user_id: data.user_id,
                            url: confirm_url,
                            status: 3,
                            error_message: "Payment error",
                            index: 2,
                            param: data
                        };
                        savePuppeteerException(exception);
                        console.timeEnd("executeOrder");
                        response.error_message = "エラーが発生しました。再度ご試しください。";
                        res.status(500).json(response);
                        await browser.close();
                    }
                //}
                // else {
                //     puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_1}, {
                //         $set: {
                //             status: 3,
                //             url: confirm_url,
                //             error_message: "エラーが発生しました。再度ご試しください。",
                //             param: data,
                //             updated_at: new Date()
                //         }
                //     }, {upsert: false, multi: false}, function (err, result) {
                //         if (err) throw err;
                //     });
                //     console.log('confirm error');
                //     var exception = {
                //         cpid: data.connect_page_id,
                //         user_id: data.user_id,
                //         url: cart_url,
                //         status: 3,
                //         error_message: 'confirm error',
                //         index: 1,
                //         param: data
                //     };
                //     savePuppeteerException(exception);
                //     console.timeEnd("executeOrder");
                //     response.error_message = "エラーが発生しました。再度ご試しください。";
                //     res.status(500).json(response);
                //     await browser.close();
                // }
            }else{
                console.log("cookie not exist");
                var error_msg = "cookie not exist";
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
                    $set: {
                        status: 3,
                        error_message: error_msg,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });
                response.error_message = error_msg;
                res.status(500).json(response);
            }
        } catch (e) {
            console.log('executeOrder exception', e);
            puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
                $set: {
                    status: 3,
                    error_message: "エラーが発生しました。再度ご試しください。",
                    updated_at: new Date()
                }
            }, {upsert: false, multi: false}, function (err, result) {
                if (err) throw err;
            });
            var exception2 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                url: confirm_url,
                status: 3,
                error_message: e,
                index: 2,
                param: data
            };
            savePuppeteerException(exception2);
            console.timeEnd("executeOrder");
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
            await browser.close();
        }
    })()
}

function savePuppeteerException(data){
    var exception_data = new puppeteerException(data);
    exception_data.save(function(err) {});
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
        result['month'] = ((date.getMonth() + 1));
        result['day'] = (date.getDate());
    }
    console.log('result---birthday---', result);
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

function getCookie(arr) {
    if(arr) {
        var result = {};
        arr.forEach(function (element) {
            if(element.name == 'ECSESSID' && element.value != '') {
                result = element;
            }
        });
        return result
    }
    return false;
}
module.exports = router;