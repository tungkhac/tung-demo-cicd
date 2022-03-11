// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var formidable = require('formidable');
const config = require('config');
const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');
const mail = 'box_api@wevnal.co.jp';
const password = 'wevnal8877';
const folder_name = '99-01.BOTCHAN';
const login_url = 'https://account.box.com/login';
const form_element = '#login-form';
const mail_element = '#login-email';
const password_element = '#password-login';
const submit_login_element = '#login-submit';
const submit_pass_element = '#login-submit-password';
const form_folder = '#app';
const folder_item = '.item-name > a';
const btn_upload = 'button.upload-button';
const item_upload = '.UploadMenuItem span';
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD");
var pushMessageToChatwork = "https://api.chatwork.com/v2/rooms/207463405/messages";

router.post('/upload', async(req, res, next) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = "uploadBox/";
    form.parse(req, function (err, body, file) {
        // console.log("body===>", body);
        if(Object.keys(file).length > 0) {
            var path = file.files.path;
            var file_name = file.files.name;
            if(file_name) {
                var newpath = form.uploadDir + file_name;
                console.log("new_path==>", newpath, current_date);
                fs.rename(path, newpath, async(err) => {
                    if (err) throw err;
                    console.log("upload file to server success", current_date);
                    await uploadToBox(file_name, res);
                });
            } else {
                res.status(500).json({'upload': 'fail=> file name not exist'});
            }
        } else {
            res.status(500).json({'upload': 'fail=> file not exist'});
        }
    });
});

async function uploadToBox(file_name, res) {
    try {
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.goto(login_url, {waitUntil: 'networkidle0'});
        await page.waitForSelector(form_element);
        // await page.screenshot({path: 'pictures/' + '_box_upload_0_' + Date.now() + '.png', fullPage: true});
        await page.focus(mail_element);
        await page.type(mail_element, mail);
        await page.click(submit_login_element);
        await page.waitForSelector(password_element);
        await page.focus(password_element);
        await page.type(password_element, password);

        // await page.screenshot({path: 'pictures/' + '_box_upload_1_' + Date.now() + '.png', fullPage: true});
        await Promise.all([
            page.click(submit_pass_element),
            page.waitForNavigation()
        ]);

        console.log('current_url==>', await page.url());
        // await page.screenshot({path: 'pictures/' + '_box_upload_2_' + Date.now() + '.png', fullPage: true});
        if(await page.$(form_folder) != null) {
            console.log("==Login success===", current_date);
            if(await page.$(folder_item) != null) {
                console.log("click folder item", current_date);
                await page.goto('https://app.box.com/folder/97524177567', {waitUntil: 'load'});
                var current_url_1 = await page.url();
                console.log("current_url_1==>", current_url_1, current_date);
                // await page.screenshot({path: 'pictures/' + '_box_upload_3_' + Date.now() + '.png', fullPage: true});
                if(current_url_1.indexOf('97524177567') != -1) {
                    await page.waitForSelector(btn_upload);
                    if(await page.$(btn_upload) != null) {
                        await page.click(btn_upload);
                        await page.waitForSelector(item_upload);
                        if(await page.$(item_upload) != null) {
                            console.log("item_upload exist", current_date);
                            await page.evaluate((item_upload) => {
                                document.querySelectorAll(item_upload)[0].click();
                            }, item_upload);
                            // await page.screenshot({path: 'pictures/' + '_box_upload_4_' + Date.now() + '.png', fullPage: true});
                            const input = await page.$('input[type="file"]');
                            console.log("file_name===>", file_name, current_date);
                            await input.uploadFile('./uploadBox/' + file_name);
                            var new_file_upload_elm = `.item-link[title="${file_name}"]`;
                            console.log('new_file_upload_elm', new_file_upload_elm, current_date);
                            console.time('upload_time');
                            await page.waitForSelector(new_file_upload_elm,  {waitUntil: 'load', timeout: 60000}).then(() => {
                                console.log('upload success', current_date);
                                pushChatwork(`Info：「${file_name}」アップロードが正常に行えました。`);
                            }).catch(e => {
                                console.log('upload fail', e, current_date);
                                pushChatwork(`Error：「${file_name}」アップロードが正常に行えませんでした。` + e);
                            });
                            console.timeEnd('upload_time');
                            // await page.waitFor(10000);
                            res.status(200).json({'upload': 'success'});
                        } else {
                            console.log("item_upload not exist", current_date);
                            res.status(500).json({'upload': 'fail'});
                        }
                    }
                } else {
                    var current_url_2 = await page.url();
                    console.log("current_url_2==>", current_url_2, current_date);
                    res.status(500).json({'upload': 'fail'});
                }
            } else {
                console.log("find folder not found", current_date);
                res.status(500).json({'upload': 'fail'});
            }
        } else {
            console.log("==Login Fail===", current_date);
            res.status(500).json({'upload': 'fail'});
        }
        await browser.close();
    } catch (e) {
        console.log("Upload exception===>", e, current_date);
        res.status(500).json({'upload': 'fail'});
    }
}

function pushChatwork(msg){
    var header_chatwork = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-ChatWorkToken': "a92f92b38d175f3cd2985829e38af252"
    };
    request.post({url: pushMessageToChatwork, form: {
        body: "[To:5090290] " +
        "\n " + msg
    },
        headers: header_chatwork,  method: 'POST'}, function (error, response, body){
        if (!error && response.statusCode == 200) {
        }else{
            console.log(body);
        }
    });
}

module.exports = router;
