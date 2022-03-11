// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");

var model = require('../model');
var crypto = require('crypto');
const puppeteerRequest = model.PuppeteerRequest;
const puppeteerException = model.PuppeteerException;
var path = require('path');

const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
const puppeteer = require('puppeteer');
const request = require('request-promise');
const fs = require('fs');
const err_message = 'エラーが発生しました。再度ご試しください。';
const header_confirm = '下記の内容で送信します。';
const purpose_list = {
    "振袖" : "1",
    "卒業袴" : "2",
    "ママ振袖・姉振袖" : "3",
};

const store_list = {
    "札幌店" : "1",
    "盛岡店" : "2",
    "仙台店" : "3",
    "郡山店" : "4",
    "水戸店" : "5",
    "宇都宮店" : "6",
    "高崎店" : "7",
    "大宮店" : "8",
    "川越店" : "9",
    "所沢店" : "10",
    "越谷店" : "11",
    "千葉店" : "12",
    "船橋店" : "13",
    "柏店" : "14",
    "松戸店" : "15",
    "東京本館" : "16",
    "銀座店" : "17",
    "新宿店" : "18",
    "池袋店" : "19",
    "渋谷店" : "20",
    "町田店" : "21",
    "立川店" : "22",
    "八王子店" : "23",
    "横浜店" : "24",
    "みなとみらい店" : "25",
    "川崎店" : "26",
    "厚木店" : "27",
    "長野店" : "28",
    "新潟店" : "29",
    "富山店" : "30",
    "金沢店" : "31",
    "沼津店" : "32",
    "静岡店" : "33",
    "浜松店" : "34",
    "岡崎店" : "35",
    "名古屋店" : "36",
    "岐阜店" : "37",
    "四日市店" : "38",
    "京都店" : "39",
    "梅田店" : "40",
    "なんば店" : "41",
    "神戸店" : "42",
    "姫路店" : "43",
    "岡山店" : "44",
    "広島店" : "45",
    "高松店" : "46",
    "小倉店" : "48",
    "天神店" : "49",
    "久留米店" : "50",
    "熊本店" : "52",
};

const desire_time_list = {
    "１０：００":"10",
    "１１：００":"11",
    "１２：００":"12",
    "１３：００":"13",
    "１４：００":"14",
    "１５：００":"15",
    "１６：００":"16",
    "１７：００":"17",
    "１８：００":"18",
};

//kyotokimono
router.post('/kyoto', function(req, res, next) {
    var body = req.body;
    var user_id = body.user_id;
    var cpid = body.cpid;
    var first_name = body.first_name;
    var last_name = body.last_name;
    var furigana_first = body.furigana_first;
    var furigana_last = body.furigana_last;
    var mail = body.mail;
    var phone = body.phone;
    var birthday = splitBirthday2(body.birthday);
    var year = birthday.year;
    var month = birthday.month;
    var day = birthday.day;
    var purpose = purpose_list[body.purpose] != 'undefined' ? purpose_list[body.purpose] : '';
    var store = store_list[body.store] != 'undefined' ? store_list[body.store] : '';
    var url = body.url;
    var desire_date = typeof body.desire_date != "undefined"  ? body.desire_date.replace(/-/g, '/') : '';
    var desire_time = desire_time_list[body.desire_time] != 'undefined' ? desire_time_list[body.desire_time] : '';
    var user_agent = body.user_agent;
    var user_device = body.user_device;

    console.log('body', body);
    var token = crypto.randomBytes(64).toString('hex');
    var data = {
        cpid : cpid,
        user_id : user_id,
        mail: mail,
        first_name: first_name,
        last_name: last_name,
        furigana_first: furigana_first,
        furigana_last: furigana_last,
        url : url,
        user_token: token,
        phone: phone,
        birthday: birthday,
        purpose: purpose,
        store: store,
        year: year,
        month: month,
        day: day,
        desire_date: desire_date,
        desire_time: desire_time,
        user_agent: user_agent,
        user_device: user_device
    };

    puppeteerRequest.remove({cpid: cpid, user_id: user_id}, function(err) {
        if (err) throw err;
        var kyotoData = {
            cpid: cpid,
            user_id: user_id,
            url: url,
            status: 0,
            error_message: "",
            index: 0,
            user_token: token,
            request_body: body,
            param: data
        };
        var kyoto = new puppeteerRequest(kyotoData);
        kyoto.save(function(err, result) {
            if(err) throw  err;
            data.object_id = result._id;
            kiotoHandle(data, res);
        });
    });

});

function kiotoHandle(data, res) {
    console.time("kyoto");
    console.log('data-input=', data);
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

        // const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', request => {
            var rtype = request.resourceType();
            if (rtype === "font" || rtype === 'stylesheet') {
                request.abort();
            } else {
                request.continue();
            }
        });

        try {
            console.log('landing_url---', data.url);
            if(data.user_agent){
                await page.setUserAgent(data.user_agent);
            }
            await page.goto(data.url, {waitUntil: 'networkidle0'});
            res.status(200).json(response);
            var form_element = '#SignupForm';
            var firtname_element = 'input#first_name';
            var lastname_element = 'input#last_name';
            var first_furigana_element = 'input#first_furigana';
            var last_furigana_element = 'input#last_furigana';
            var phone_element = 'input#denwa';
            var mail_element = 'input#email';
            var year_element = 'select[name="birth_year"]';
            var month_element = 'select[name="birth_month"]';
            var day_element = 'select[name="birth_day"]';
            var purpose_element = 'input[name="purpose_id"][value="'+ data.purpose +'"]';
            var store_element =  '#store_select';
            var desire_date_element = 'input[name="date"]';
            var desire_time_element = 'select[name="time"]';
            var btn_submit = '#SaveAccount';
            var header_confirm_pc_element = '#taiken_subtitle03 > div.tb_form2_wrap > p';
            var header_confirm_sp_element = '#yoyaku';
            var btn_confirm = 'input[name="confirm"]';

            await page.waitForSelector(form_element);
            await page.evaluate((firtname_element, lastname_element, first_furigana_element, last_furigana_element,
                                 phone_element, mail_element) => {
                    document.querySelector(firtname_element).value = '';
                    document.querySelector(lastname_element).value = '';
                    document.querySelector(first_furigana_element).value = '';
                    document.querySelector(last_furigana_element).value = '';
                    document.querySelector(phone_element).value = '';
                    document.querySelector(mail_element).value = '';
                }, firtname_element, lastname_element, first_furigana_element, last_furigana_element,
                phone_element, mail_element );

            //input form
            await page.type(firtname_element, data.first_name);
            await page.type(lastname_element, data.last_name);
            await page.type(first_furigana_element, data.furigana_first);
            await page.type(last_furigana_element, data.furigana_last);
            await page.select(year_element, data.year.toString());
            await page.select(month_element, data.month.toString());
            await page.select(day_element, data.day.toString());
            await page.type(phone_element, data.phone);
            await page.type(mail_element, data.mail);
            if(data.purpose != '') {
                await page.click(purpose_element);
            }
            if(data.store != '') {
                await page.select(store_element, data.store.toString());
            }
            if(data.desire_date != '') {
                await page.type(desire_date_element, data.desire_date);
                await page.waitFor(1000);
            }
            if(data.desire_time != '') {
                await page.select(desire_time_element, data.desire_time.toString());
            }
            // await page.screenshot({path: 'pictures/kyotokimono_11_' + Date.now() + '.png', fullPage: true});
            console.log('start click btn_submit');
            await Promise.all([
                page.click(btn_submit),
                page.waitForNavigation()
            ]);
            console.log('end click btn_submit');
            var new_url  = await page.url();
            console.log('new_url', new_url);

            var header_confirm_element = '';
            if (await page.$(header_confirm_pc_element) !== null) {
                console.log('===header confirm PC===');
                header_confirm_element = header_confirm_pc_element;
            } else if (await page.$(header_confirm_sp_element) !== null){
                console.log('===header confirm SP===');
                header_confirm_element = header_confirm_sp_element;
            } else {
                console.log('==Not exist header_confirm_element===');
            }

            await page.waitForSelector(header_confirm_element);
            if (header_confirm_element != '') {
                // await page.screenshot({path: 'pictures/kyotokimono_22_' + Date.now() + '.png', fullPage: true});
                var confirm_url = await page.url();
                console.log('confirm_url', confirm_url);
                console.log('start click btn_confirm');
                await Promise.all([
                    page.click(btn_confirm),
                    page.waitForNavigation()
                ]);
                console.log('end click btn_confirm');
                var thank_url = await page.url();
                console.log('thank_url', thank_url);
                // await page.screenshot({path: 'pictures/kyotokimono_33_' + Date.now() + '.png', fullPage: true});
                if(thank_url.indexOf("thanks") !== -1){
                    console.log('Complete');
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id}, {
                        $set: {
                            status: 1,
                            url: thank_url,
                            param: data,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });
                } else {
                    console.log('thank page error');
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id}, {
                        $set: {
                            status: 3,
                            error_message: 'thank page error',
                            url: thank_url,
                            param: data,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });
                }
            } else {
                console.log('can not redirect to confirm page');
                puppeteerRequest.findOneAndUpdate({_id: data.object_id}, {
                    $set: {
                        status: 3,
                        error_message: 'can not redirect to confirm page',
                        url: new_url,
                        param: data,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });
            }
        } catch (e) {
            console.log("kyotokimono exception", e);
            var exception = {
                cpid: data.cpid,
                user_id: data.user_id,
                error_message: e,
                param: data
            };
            savePuppeteerException(exception);
            response.error_message = err_message;
            res.status(500).json(response);
        }
        await browser.close();
    })()
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
    console.log('result---birthday---', result);
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


function savePuppeteerException(data){
    var exception_data = new puppeteerException(data);
    exception_data.save(function(err) {});
}


module.exports = router;
