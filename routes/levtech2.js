// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");

var model = require('../model');
var crypto = require('crypto');
const Zipcode = model.Zipcode;
const puppeteerRequest = model.PuppeteerRequest;
const puppeteerException = model.PuppeteerException;
var path = require('path');
const url_require = require('url');

const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
const puppeteer = require('puppeteer');
const request = require('request-promise');
const fs = require('fs');
const emailValidator = require("email-validator");

const freelance_regist_url = "https://freelance.levtech.jp/chatbot/botchan/regist/";
const creator_regist_url = "https://creator.levtech.jp/chatbot/botchan/regist/";
const career_regist_url = "https://career.levtech.jp/chatbot/botchan/regist/";

const AZURE_STORAGE_UPLOAD_URL = 'https://' + config.get('azure_storage_name') + '.blob.core.windows.net/' + config.get('azure_storage_container') + "/";
const max_lenght = 32;
const max_upload_file = 5242880; // 5Mb
const arr_extence = ['xls','xlsx','doc','docx','ppt', 'pptx','numbers','pages', 'key','ods','odt', 'odp','pdf'];
const err_message = 'エラーが発生しました。再度ご試しください。';

//freelance_levtech
router.post('/freelance_levtech', function(req, res, next) {
    var body = req.body;
    var response = {};
    var arr_error = validate(body);
    console.log('arr_error', arr_error);

    if(typeof arr_error !== 'undefined' && arr_error.length > 0) {
        response.error_message = err_message;
        return res.status(500).json(response);
    } else {
        console.log('validate success');
        var user_id = body.user_id;
        var cpid = body.cpid;
        var first_name = body.first_name;
        var last_name = body.last_name;
        var furigana_first = body.furigana_first;
        var furigana_last = body.furigana_last;
        var mail = body.mail;
        var phone = body.phone;
        var birthday = splitBirthday(body.birthday);
        var upload = (typeof body.upload != "undefined" && body.upload != '') ?  body.upload : '';
        var year = birthday.year;
        var month = birthday.month;
        var day = birthday.day;
        var levtech_url = body.levtech_url;
        var sip_param = (typeof body.sip_param != "undefined" && body.sip_param != '') ? '?sip=' + body.sip_param : '?sip=';
        var strgck_param = (typeof body.strgck != "undefined" && body.strgck != '') ? '&strgck=' + body.strgck : '&strgck=';
        levtech_url = levtech_url + sip_param + strgck_param;

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
            levtech_url : levtech_url,
            user_token: token,
            phone: phone,
            birthday: birthday,
            upload: upload,
            year: year,
            month: month,
            day: day
        };

        puppeteerRequest.remove({cpid: cpid, user_id: user_id}, function(err) {
            if (err) throw err;
            var levtechData = {
                cpid: cpid,
                user_id: user_id,
                url: levtech_url,
                status: 0,
                error_message: "",
                index: 0,
                user_token: token,
                request_body: body,
                param: data
            };
            var levtech = new puppeteerRequest(levtechData);
            levtech.save(function(err, result) {
                if(err) throw  err;
                data.object_id = result._id;
                levtechHandle(data, res);
            });
        });
    }
});

function levtechHandle(data, res) {
    console.time("levtech");
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
            if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype == "script") {
                request.abort();
            } else {
                // console.log(request.url());
                request.continue();
            }
        });

        try {
            await page.goto(data.levtech_url, {waitUntil: 'networkidle0'});
            const form_element = '.EfForm > form';
            await page.waitForSelector(form_element);
            const div_element = form_element + '> div:nth-child(2)';
            const firtname_element = div_element + ' > div:nth-child(2) > #f-firstname';
            const lastname_element = div_element + ' > div:nth-child(2) > #f-lastname';
            const first_furigana_element = div_element + ' > div:nth-child(4) > #f-firstname_kana';
            const last_furigana_element = div_element + ' > div:nth-child(4) > #f-lastname_kana';
            const year_element = div_element + ' > div:nth-child(6) > #f-dateOfBirthYear';
            const month_element = div_element + ' > div:nth-child(6) > #f-dateOfBirthMonth';
            const day_element = div_element + ' > div:nth-child(6) > #f-dateOfBirthDate';
            const phone_element = div_element + ' > div:nth-child(8) > #f-phone';
            const mail_element = div_element + ' > div:nth-child(10) > #f-mailaddress';
            const upload1_element = div_element + ' > div:nth-child(12) > #f-skillsheet1';
            const upload2_element = div_element + ' > div:nth-child(12) > #f-skillsheet2';

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

            //upload file
            if(data.upload != '') {
                var arr_upload = data.upload.split(",");
                console.log('arr_upload', arr_upload);
                console.log('arr_upload.length----', arr_upload.length);
                if(arr_upload.length > 2) {
                    console.log('The maximum of files can be uploaded is 2');
                    response.error_message = '最大2ファイルをアップロードしてください。';
                    res.status(500).json(response);
                    return;
                } else {
                    if(typeof arr_upload[0] != "undefined" && arr_upload[0].trim() != '') {
                        var upload_1 = arr_upload[0];
                        var dirname_1 = splitImageUrl(upload_1);
                        const file_path_1 = AZURE_STORAGE_UPLOAD_URL + upload_1;
                        // remove if file exist before upload
                        fs.exists(dirname_1, function(exists) {
                            if(exists) {
                                fs.unlinkSync(dirname_1);
                                console.log('file 1 exits, remove file 1');
                            } else {
                                console.log('file 1 not exits');
                            }
                        });

                        console.log('upload_1=====', upload_1);
                        console.log('file_path_1', file_path_1);
                        // const file_1_data = await request(file_path_1);
                        const file_1_data = await request({
                            uri: file_path_1,
                            encoding: null
                        });
                        fs.writeFileSync(dirname_1, file_1_data);
                        const input_upload_1 = await page.$(upload1_element);
                        await input_upload_1.uploadFile(dirname_1);
                    }

                    if(typeof arr_upload[1] != "undefined" && arr_upload[1].trim() != '') {
                        var upload_2 = arr_upload[1];
                        var dirname_2 = splitImageUrl(upload_2);
                        const file_path_2 = AZURE_STORAGE_UPLOAD_URL + upload_2;
                        console.log('file_path_2', file_path_2);

                        // remove if file exist before upload
                        fs.exists(dirname_2, function(exists) {
                            if(exists) {
                                fs.unlinkSync(dirname_2);
                                console.log('file 2 exits, remove file 2');
                            } else {
                                console.log('file 2 not exits');
                            }
                        });

                        console.log('upload_2=====', upload_2);
                        console.log('file_path_2=', file_path_2);
                        const file_2_data = await request({
                            uri: file_path_2,
                            encoding: null
                        });
                        fs.writeFileSync(dirname_2, file_2_data);
                        const input_upload_2 = await page.$(upload2_element);
                        await input_upload_2.uploadFile(dirname_2);
                    }
                }
            }

            await Promise.all([
                page.click(form_element + ' > .submit > input'),
                page.waitForNavigation()
            ]);

            var new_url  = page.url();
            console.log('new_url', new_url);
            if(new_url == freelance_regist_url) {
                console.log('page redirect');
                if(await page.$('body > div > ul') !== null){
                    console.log('page url1, url2');
                    var url1_element = 'body > div > ul > li:nth-child(1) > p:nth-child(2)';
                    var url2_element = 'body > div > ul > li:nth-child(2) > p:nth-child(2)';
                    var url_1 = '', url_2 = '';
                    if(await page.$(url1_element) !== null){
                        url_1 = await page.$eval(url1_element, el => el.innerText);
                    }
                    if(await page.$(url2_element) !== null){
                        url_2 = await page.$eval(url2_element, el => el.innerText);
                    }

                    response.success = 'success';
                    response.url1 =  url_1;
                    response.url2 =  url_2;
                    console.log('response=', response);
                } else {
                    console.log('page error');
                    response.error_message = 'エラーが発生しました。再度ご試しください。';
                }

                puppeteerRequest.findOneAndUpdate({_id: data.object_id}, {
                    $set: {
                        status: 1,
                        url: new_url,
                        param: data,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });
                res.status(200).json(response);
            } else {
                console.log('freelance_levtech register fail');
                response.error_message = 'エラーが発生しました。再度ご試しください。';
                res.status(500).json(response);
            }
        } catch (e) {
            console.log("levtechHandle exception", e);
            var exception = {
                cpid: data.cpid,
                user_id: data.user_id,
                error_message: e,
                param: data
            };
            savePuppeteerException(exception);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }
        await browser.close();
        console.timeEnd("levtech");
    })()
}

//creator_levtech
router.post('/creator_levtech', function(req, res, next) {
    var body = req.body;
    var response = {};
    var arr_error = validate(body);
    console.log('arr_error', arr_error);

    if(typeof arr_error !== 'undefined' && arr_error.length > 0) {
        response.error_message = err_message;
        return res.status(500).json(response);
    } else {
        console.log('validate success');
        var user_id = body.user_id;
        var cpid = body.cpid;
        var creator_url = body.creator_url;
        var first_name = body.first_name;
        var last_name = body.last_name;
        var furigana_first = body.furigana_first;
        var furigana_last = body.furigana_last;
        var mail = body.mail;
        var phone = body.phone;
        var birthday = splitBirthday(body.birthday);
        var upload = (typeof body.upload != "undefined" && body.upload != '') ?  body.upload : '';
        var year = birthday.year;
        var month = birthday.month;
        var day = birthday.day;
        var portfolio_url = body.portfolio_url;
        var sip_param = (typeof body.sip_param != "undefined" && body.sip_param != '') ? '?sip=' + body.sip_param : '?sip=';
        var strgck_param = (typeof body.strgck != "undefined" && body.strgck != '') ? '&strgck=' + body.strgck : '&strgck=';
        creator_url = creator_url + sip_param + strgck_param;

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
            creator_url : creator_url,
            user_token: token,
            phone: phone,
            birthday: birthday,
            upload: upload,
            year: year,
            month: month,
            day: day,
            portfolio_url: portfolio_url
        };

        puppeteerRequest.remove({cpid: cpid, user_id: user_id}, function(err) {
            if (err) throw err;
            var creatorData = {
                cpid: cpid,
                user_id: user_id,
                url: creator_url,
                status: 0,
                error_message: "",
                index: 0,
                user_token: token,
                request_body: body,
                param: data
            };
            var creator = new puppeteerRequest(creatorData);
            creator.save(function(err, result) {
                if(err) throw  err;
                data.object_id = result._id;
                creatorHandle(data, res);
            });
        });
    }
});

function creatorHandle(data, res) {
    console.time("creator");
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
            if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype == "script") {
                request.abort();
            } else {
                //console.log(request.url());
                request.continue();
            }
        });

        try {
            await page.goto(data.creator_url, {waitUntil: 'networkidle0'});
            const form_element = '.EfForm > form';
            await page.waitForSelector(form_element);
            const div_element = form_element + ' > div:nth-child(2)';
            const firtname_element = div_element + ' > div:nth-child(2) > #f-firstname';
            const lastname_element = div_element + ' > div:nth-child(2) > #f-lastname';
            const first_furigana_element = div_element + ' > div:nth-child(4) > #f-firstname_kana';
            const last_furigana_element = div_element + ' > div:nth-child(4) > #f-lastname_kana';
            const year_element = div_element + ' > div:nth-child(6) > #f-dateOfBirthYear';
            const month_element = div_element + ' > div:nth-child(6) > #f-dateOfBirthMonth';
            const day_element = div_element + ' > div:nth-child(6) > #f-dateOfBirthDate';
            const phone_element = div_element + ' > div:nth-child(8) > #f-phone';
            const mail_element = div_element + ' > div:nth-child(10) > #f-mailaddress';
            const upload1_element = div_element + ' > div:nth-child(12) > #f-skillsheet1';
            const upload2_element = div_element + ' > div:nth-child(12) > #f-skillsheet2';
            const portfolio_element = div_element + ' > div:nth-child(14) > #f-portfolio_url';

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
            await page.type(portfolio_element, data.portfolio_url);

            //upload file
            if(data.upload != '') {
                var arr_upload = data.upload.split(",");
                console.log('arr_upload', arr_upload);
                console.log('arr_upload.length----', arr_upload.length);
                if(arr_upload.length > 2) {
                    console.log('The maximum of files can be uploaded is 2');
                    response.error_message = '最大2ファイルをアップロードしてください。';
                    res.status(500).json(response);
                    return;
                } else {
                    if(typeof arr_upload[0] != "undefined" && arr_upload[0].trim() != '') {
                        var upload_1 = arr_upload[0];
                        var dirname_1 = splitImageUrl(upload_1);
                        const file_path_1 = AZURE_STORAGE_UPLOAD_URL + upload_1;
                        // remove if file exist before upload
                        fs.exists(dirname_1, function(exists) {
                            if(exists) {
                                fs.unlinkSync(dirname_1);
                                console.log('file 1 exits, remove file 1');
                            } else {
                                console.log('file 1 not exits');
                            }
                        });

                        console.log('upload_1=====', upload_1);
                        console.log('file_path_1', file_path_1);
                        const file_1_data = await request({
                            uri: file_path_1,
                            encoding: null
                        });
                        fs.writeFileSync(dirname_1, file_1_data);
                        const input_upload_1 = await page.$(upload1_element);
                        await input_upload_1.uploadFile(dirname_1);
                    }

                    if(typeof arr_upload[1] != "undefined" && arr_upload[1].trim() != '') {
                        var upload_2 = arr_upload[1];
                        var dirname_2 = splitImageUrl(upload_2);
                        const file_path_2 = AZURE_STORAGE_UPLOAD_URL + upload_2;
                        console.log('file_path_2', file_path_2);
                        // remove if file exist before upload
                        fs.exists(dirname_2, function(exists) {
                            if(exists) {
                                fs.unlinkSync(dirname_2);
                                console.log('file 2 exits, remove file 2');
                            } else {
                                console.log('file 2 not exits');
                            }
                        });

                        console.log('upload_2=====', upload_2);
                        console.log('file_path_2=', file_path_2);
                        const file_2_data = await request({
                            uri: file_path_2,
                            encoding: null
                        });
                        fs.writeFileSync(dirname_2, file_2_data);
                        const input_upload_2 = await page.$(upload2_element);
                        await input_upload_2.uploadFile(dirname_2);
                    }
                }
            }

            // await page.screenshot({path: 'pictures/_levtech_1111_' + Date.now() + '.png', fullPage: true});
            await Promise.all([
                page.click(form_element + ' > .submit > input'),
                page.waitForNavigation()
            ]);

            var new_url  = page.url();
            console.log('new_url', new_url);
            if(new_url == creator_regist_url) {
                console.log('page redirect');
                // await page.screenshot({path: 'pictures/_levtech_2222_' + Date.now() + '.png', fullPage: true});
                if(await page.$('body > div') !== null){
                    var url1_element = 'body > div > p:nth-child(2)';
                    var url_1 = '';
                    if(await page.$(url1_element) !== null){
                        url_1 = await page.$eval(url1_element, el => el.innerText);
                    }
                    response.success = 'success';
                    response.url1 =  url_1;
                    console.log('response=', response);
                } else {
                    console.log('page error');
                    response.error_message = 'エラーが発生しました。再度ご試しください。';
                }

                puppeteerRequest.findOneAndUpdate({_id: data.object_id}, {
                    $set: {
                        status: 1,
                        url: new_url,
                        param: data,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });
                res.status(200).json(response);
            } else {
                console.log('creator_levtech register fail');
                response.error_message = 'エラーが発生しました。再度ご試しください。';
                res.status(500).json(response);
            }
        } catch (e) {
            console.log("levtechHandle exception", e);
            var exception = {
                cpid: data.cpid,
                user_id: data.user_id,
                error_message: e,
                param: data
            };
            savePuppeteerException(exception);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }
        await browser.close();
        console.timeEnd("creator");
    })()
}

//creator_levtech
router.post('/career_levtech', function(req, res, next) {
    var body = req.body;
    var response = {};
    var arr_error = validate(body);
    console.log('arr_error', arr_error);

    if(typeof arr_error !== 'undefined' && arr_error.length > 0) {
        response.error_message = err_message;
        return res.status(500).json(response);
    } else {
        console.log('validate success');
        var user_id = body.user_id;
        var cpid = body.cpid;
        var career_url = body.career_url;
        var first_name = body.first_name;
        var last_name = body.last_name;
        var furigana_first = body.furigana_first;
        var furigana_last = body.furigana_last;
        var mail = body.mail;
        var phone = body.phone;
        var birthday = splitBirthday2(body.birthday);
        var upload = (typeof body.upload != "undefined" && body.upload != '') ?  body.upload : '';
        var year = birthday.year;
        var month = birthday.month;
        var day = birthday.day;
        var portfolio_url = body.portfolio_url;
        var employment = body.employment;
        var hope_work1 = body.hope_work1;
        var hope_work2 = body.hope_work2;
        var current_url = body.current_url;
        var sip_param = (typeof body.sip_param != "undefined" && body.sip_param != '') ? '?sip=' + body.sip_param : '?sip=';
        var strgck_param = (typeof body.strgck != "undefined" && body.strgck != '') ? '&strgck=' + body.strgck : '&strgck=';
        career_url = career_url + sip_param + strgck_param;

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
            career_url : career_url,
            user_token: token,
            phone: phone,
            birthday: birthday,
            upload: upload,
            year: year,
            month: month,
            day: day,
            portfolio_url: portfolio_url,
            employment: employment,
            hope_work1: hope_work1,
            hope_work2: hope_work2,
            current_url: current_url,
        };

        puppeteerRequest.remove({cpid: cpid, user_id: user_id}, function(err) {
            if (err) throw err;
            var careerData = {
                cpid: cpid,
                user_id: user_id,
                url: career_url,
                status: 0,
                error_message: "",
                index: 0,
                user_token: token,
                request_body: body,
                param: data
            };
            var career = new puppeteerRequest(careerData);
            career.save(function(err, result) {
                if(err) throw  err;
                data.object_id = result._id;
                careerHandle(data, res);
            });
        });
    }
});

function careerHandle(data, res) {
    console.time("career");
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
            if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype == "script") {
                request.abort();
            } else {
                request.continue();
            }
        });

        try {
            await page.goto(data.career_url, {waitUntil: 'networkidle0'});
            const form_element = '.EfForm > form';
            await page.waitForSelector(form_element);
            const div_element = form_element + '> div';
            const employment_1_element = div_element + ' > div:nth-child(2) > #f-employment_1';
            const employment_2_element = div_element + ' > div:nth-child(2) > #f-employment_2';
            const employment_3_element = div_element + ' > div:nth-child(2) > #f-employment_3';
            const hope_work1_element = div_element + ' > div:nth-child(4) > div:nth-child(1) > #f-hope_worklocation_1';
            const hope_work2_element = div_element + ' > div:nth-child(4) > div:nth-child(2) > #f-hope_worklocation_2';
            const lastname_element = div_element + ' > div:nth-child(6) > #f-lastname';
            const firstname_element = div_element + ' > div:nth-child(6) > #f-firstname';
            const first_furigana_element = div_element + ' > div:nth-child(8) > #f-firstname_kana';
            const last_furigana_element = div_element + ' > div:nth-child(8) > #f-lastname_kana';
            const year_element = div_element + ' > div:nth-child(10) > #f-dateOfBirthYear';
            const month_element = div_element + ' > div:nth-child(10) > #f-dateOfBirthMonth';
            const day_element = div_element + ' > div:nth-child(10) > #f-dateOfBirthDate';
            const phone_element = div_element + ' > div:nth-child(12) > #f-phone';
            const mail_element = div_element + ' > div:nth-child(14) > #f-mailaddress';
            const upload1_element = div_element + ' > div:nth-child(16) > #f-skillsheet1';
            const upload2_element = div_element + ' > div:nth-child(16) > #f-skillsheet2';
            const portfolio_element = div_element + ' > div:nth-child(18) > #f-portfolio_url';

            //input form
            if(parseInt(data.employment) == 1) {
                const radio_employment_1 = await page.$(employment_1_element);
                var is_checked_1 = await (await radio_employment_1.getProperty('checked')).jsonValue();
                console.log("employment_1", is_checked_1);
                if(!is_checked_1) {
                    page.click(employment_1_element);
                }
            } else if(parseInt(data.employment) == 2) {
                const radio_employment_2 = await page.$(employment_2_element);
                var is_checked_2 = await (await radio_employment_2.getProperty('checked')).jsonValue();
                console.log("employment_2", is_checked_2);
                if(!is_checked_2) {
                    page.click(employment_2_element);
                }
            } else if(parseInt(data.employment) == 3) {
                const radio_employment_3 = await page.$(employment_3_element);
                var is_checked_3 = await (await radio_employment_3.getProperty('checked')).jsonValue();
                console.log("employment_3", is_checked_3);
                if(!is_checked_3) {
                    page.click(employment_3_element);
                }
            }

            if(typeof data.hope_work1 != "undefined" && data.hope_work1 != "") {
                await page.select(hope_work1_element, data.hope_work1.toString());
            }
            if(typeof data.hope_work2 != "undefined" && data.hope_work2 != "") {
                await page.select(hope_work2_element, data.hope_work2.toString());
            }
            await page.type(firstname_element, data.first_name);
            await page.type(lastname_element, data.last_name);
            await page.type(first_furigana_element, data.furigana_first);
            await page.type(last_furigana_element, data.furigana_last);
            await page.select(year_element, data.year.toString());
            await page.select(month_element, data.month.toString());
            await page.select(day_element, data.day.toString());
            await page.type(phone_element, data.phone);
            await page.type(mail_element, data.mail);
            await page.type(portfolio_element, data.portfolio_url);

            //upload file
            if(data.upload != '') {
                var arr_upload = data.upload.split(",");
                console.log('arr_upload', arr_upload);
                console.log('arr_upload.length----', arr_upload.length);
                if(arr_upload.length > 2) {
                    console.log('The maximum of files can be uploaded is 2');
                    response.error_message = '最大2ファイルをアップロードしてください。';
                    res.status(500).json(response);
                    return;
                } else {
                    if(typeof arr_upload[0] != "undefined" && arr_upload[0].trim() != '') {
                        var upload_1 = arr_upload[0];
                        var dirname_1 = splitImageUrl(upload_1);
                        const file_path_1 = AZURE_STORAGE_UPLOAD_URL + upload_1;
                        // remove if file exist before upload
                        fs.exists(dirname_1, function(exists) {
                            if(exists) {
                                fs.unlinkSync(dirname_1);
                                console.log('file 1 exits, remove file 1');
                            } else {
                                console.log('file 1 not exits');
                            }
                        });

                        console.log('upload_1=====', upload_1);
                        console.log('file_path_1', file_path_1);
                        // const file_1_data = await request(file_path_1);
                        const file_1_data = await request({
                            uri: file_path_1,
                            encoding: null
                        });
                        fs.writeFileSync(dirname_1, file_1_data);
                        const input_upload_1 = await page.$(upload1_element);
                        await input_upload_1.uploadFile(dirname_1);
                    }

                    if(typeof arr_upload[1] != "undefined" && arr_upload[1].trim() != '') {
                        var upload_2 = arr_upload[1];
                        var dirname_2 = splitImageUrl(upload_2);
                        const file_path_2 = AZURE_STORAGE_UPLOAD_URL + upload_2;
                        console.log('file_path_2', file_path_2);

                        // remove if file exist before upload
                        fs.exists(dirname_2, function(exists) {
                            if(exists) {
                                fs.unlinkSync(dirname_2);
                                console.log('file 2 exits, remove file 2');
                            } else {
                                console.log('file 2 not exits');
                            }
                        });

                        console.log('upload_2=====', upload_2);
                        console.log('file_path_2=', file_path_2);
                        const file_2_data = await request({
                            uri: file_path_2,
                            encoding: null
                        });
                        fs.writeFileSync(dirname_2, file_2_data);
                        const input_upload_2 = await page.$(upload2_element);
                        await input_upload_2.uploadFile(dirname_2);
                    }
                }
            }

            await Promise.all([
                page.click(form_element + ' > .submit > input'),
                page.waitForNavigation()
            ]);

            var new_url  = page.url();
            console.log('new_url', new_url);
            if(new_url == career_regist_url) {
                console.log('page redirect');
                if(await page.$('body > div > ul') !== null){
                    console.log('url exist');
                    const url1_element = 'body > div > ul > li:nth-child(1) > p:nth-child(2)';
                    const url2_element = 'body > div > ul > li:nth-child(2) > p:nth-child(2)';
                    const url3_element = 'body > div > ul > li:nth-child(3) > p:nth-child(2)';
                    var url_1 = '', url_2 = '', url_3 = '';
                    if(await page.$(url1_element) !== null){
                        url_1 = await page.$eval(url1_element, el => el.innerText);
                    }
                    if(await page.$(url2_element) !== null){
                        url_2 = await page.$eval(url2_element, el => el.innerText);
                    }
                    if(await page.$(url3_element) !== null){
                        url_3 = await page.$eval(url3_element, el => el.innerText);
                    }

                    const url_parts = url_require.parse(data.current_url);
                    var domain_url = '';
                    if(url_parts.protocol && url_parts.host){
                        domain_url =  url_parts.protocol + "//" +  url_parts.host;
                    }

                    url_1 = addDomain(url_1, domain_url);
                    url_2 = addDomain(url_2, domain_url);
                    url_3 = addDomain(url_3, domain_url);

                    // if(checkDomainExist(url_1) && checkDomainExist(url_2) && checkDomainExist(url_3)) {
                    //     const url_parts = url_require.parse(data.current_url);
                    //     var domain_url = '';
                    //     if(url_parts.protocol && url_parts.host){
                    //         domain_url =  url_parts.protocol + "//" +  url_parts.host;
                    //         url_1 = domain_url + url_1;
                    //         url_2 = domain_url + url_2;
                    //         url_3 = domain_url + url_3;
                    //     }
                    // }

                    response.url1 = url_1;
                    response.url2 = url_2;
                    response.url3 = url_3;
                    response.success = 'success';
                    console.log('response=', response);
                } else {
                    console.log('page error');
                    response.error_message = 'エラーが発生しました。再度ご試しください。';
                }

                puppeteerRequest.findOneAndUpdate({_id: data.object_id}, {
                    $set: {
                        status: 1,
                        url: new_url,
                        param: data,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });
                res.status(200).json(response);
            } else {
                console.log('creator_levtech register fail');
                response.error_message = 'エラーが発生しました。再度ご試しください。';
                res.status(500).json(response);
            }
        } catch (e) {
            console.log("levtechHandle exception", e);
            var exception = {
                cpid: data.cpid,
                user_id: data.user_id,
                error_message: e,
                param: data
            };
            savePuppeteerException(exception);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }
        await browser.close();
        console.timeEnd("career");
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


function splitImageUrl(url) {
    if(url) {
        var result  = [];
        result = url.split("/");
        return './uploads/' + result.slice(-1)[0];
    }
}

function splitImageExtence(url) {
    if(url) {
        var result  = [];
        result = url.split(".");
        return result.slice(-1)[0];
    }
}


function validate(param) {
    console.log('param-validate---', param);
    var err_message  = [];

    if(typeof param.mail != "undefined" && param.mail != '') {
        var result_check = emailValidator.validate(param.mail.trim());
        if (result_check) {
            console.log('param.mail', param.mail);
            if (param.mail.length > 128) {
                err_message.push('mail max lenght error');
            }
        } else {
            err_message.push('validate mail error');
        }
    }

    if(typeof  param.phone != "undefined" &&  param.phone != '') {
        var result_check = /^[0-9]{10,11}$/.test(param.phone);
        if (!result_check) {
            err_message.push('validate phone error');
        }
    }

    if(typeof  param.birthday != "undefined" &&  param.birthday != '') {
        var result_check = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(param.birthday);
        if (!result_check) {
            err_message.push('validate birthday error');
        }
    }

    if(typeof  param.lastname != "undefined" &&  param.lastname != '') {
        if(param.lastname.length > max_lenght) {
            err_message.push('lastname max lenght error');
        }
    }

    if(typeof  param.firstname != "undefined" &&  param.firstname != '') {
        if (param.firstname.length > max_lenght) {
            err_message.push('firstname max lenght error');
        }
    }

    if(typeof  param.furigana_last != "undefined" &&  param.furigana_last != '') {
        var result_check = /^[ぁ-ゞー]+$/u.test(param.furigana_last);
        if(result_check) {
            if(param.furigana_last.length > max_lenght) {
                err_message.push('furigana_last max lenght error');
            }
        } else {
            err_message.push('validate furigana_last error');
        }
    }

    if(typeof  param.furigana_first != "undefined" &&  param.furigana_first != '') {
        var result_check = /^[ぁ-ゞー]+$/u.test(param.furigana_first);
        if (result_check) {
            if (param.furigana_first.length > max_lenght) {
                err_message.push('furigana_first max lenght error');
            }
        } else {
            err_message.push('validate furigana_first error');
        }
    }

    if(typeof  param.upload1 != "undefined" &&  param.upload1.trim() != '') {
        var img_url_1 = AZURE_STORAGE_UPLOAD_URL + param.upload1;
        var extension = splitImageExtence(param.upload1);
        var check_extension = false;
        if(arr_extence.indexOf(extension) == -1) {
            err_message.push('file 1 extension error');
        } else {
            check_extension = true;
        }

        setTimeout(function(){
            if(check_extension) {
                request({
                    url: img_url_1,
                    method: "HEAD"
                }, function (err, headRes) {
                    if(err) throw err;
                    var size1 = headRes.headers['content-length'];
                    console.log('size1', size1);
                    if (size1 != "undefined" && size1 > max_upload_file) {
                        err_message.push('file 1 greater than max size');
                    }
                });
            }
        }, 100);
    }

    if(typeof  param.upload2 != "undefined" &&  param.upload2.trim() != '') {
        var img_url_2 = AZURE_STORAGE_UPLOAD_URL + param.upload2;
        var extension2 = splitImageExtence(param.upload2);
        var check_extension2 = false;
        if(arr_extence.indexOf(extension2) == -1) {
            err_message.push('file 2 extension error');
        } else {
            check_extension2 = true;
        }

        setTimeout(function(){
            if(check_extension2) {
                request({
                    url: img_url_2,
                    method: "HEAD"
                }, function (err, headRes) {
                    if(err) throw err;
                    var size2 = headRes.headers['content-length'];
                    if (size2 != "undefined" && size2 > max_upload_file) {
                        err_message.push('file 2 greater than max size');
                    }
                });
            }
        }, 100);

    }

    if(typeof  param.employment != "undefined" &&  param.employment != '') {
        var result_check = /^[1-3]{1}$/.test(param.employment);
        if (!result_check) {
            err_message.push('validate employment error');
        }
    }

    if(typeof  param.hope_work1 != "undefined" &&  param.hope_work1 != '') {
        var result_check = /^[1-3]{1}$/.test(param.hope_work1);
        if (!result_check) {
            err_message.push('validate hope_work1 error');
        }
    }

    if(typeof  param.hope_work2 != "undefined" &&  param.hope_work2 != '') {
        var result_check = /^[1-4]{1}$/.test(param.hope_work2);
        if (!result_check) {
            err_message.push('validate hope_work2 error');
        }
    }

    if(typeof  param.portfolio_url != "undefined" &&  param.portfolio_url != '') {
        var result_check = /^http|https$/.test(param.portfolio_url);
        if (result_check) {
            if (param.portfolio_url.length > 1000) {
                err_message.push('portfolio_url max lenght error');
            }
        }  else {
            err_message.push('validate portfolio_url error');
        }
    }

    return err_message;
}

function addDomain(url, domain_url) {
    if(url != '' && url.indexOf('http') == -1){
        url = domain_url + url;
    }
    return url;
}

module.exports = router;
