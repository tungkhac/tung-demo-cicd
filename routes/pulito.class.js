// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var model = require('../model');
var EfoCv =  model.EfoCv;
var moment = require('moment-timezone');
const config = require('config');
const TIMEZONE = config.get('timezone');

var validateInput = (body, key, value_default = "") => {
    let result = value_default;
    if (typeof body[key] !== "undefined") {
        result = body[key];
    } else {
        console.log(" Don't have data input ---> " + key);
    }
    return result;
}

var getAppNumber = (connect_page_id) => {
    return new Promise(function (resolve, reject) {
        let result = EfoCv.find({connect_page_id: connect_page_id, cv_flg: 1}).count(function (err, count){
            resolve(count);
        });
    });

}

var getDate = () => {
    let d = new Date();
    let currentMonth = d.getMonth() + 1;
    let Month = currentMonth > 10 ? currentMonth : '0' + (currentMonth);
    let Year = d.getFullYear();
    let date = d.getDate();
    if(date.toString().length == 1){
        date = `0${date}`;
    }
    return `${Year}${Month}${date}`;
}

class pulitoRouter {
    constructor() {
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/show_info', async (req, res, next) => {
            var body = req.body;
            var current_date = moment().tz(TIMEZONE).format("YYYYMMDD");
            let store = validateInput(body, "store");
            let app_number = await getAppNumber(validateInput(req.body, "connect_page_id"));
            let app_number_output = app_number;
            switch (app_number.toString().length) {
                case 1:
                    app_number_output = "00"+app_number.toString();
                    break;
                case 2:
                    app_number_output = "0"+app_number.toString();
                    break;
                default:
                    break;
            }
            let order_id = `CB${current_date}${app_number_output}`;
            var adebis_url = "https://ac.ebis.ne.jp/rec.php?ebisV=6.0&argument=pZ2GtnGp&ebisPageID=complete&ebisOther1={{ebisOther1}}&ebisOther2={{ebisOther2}}"
                + "&ebisOther3={{ebisOther3}}&ebisOther4={{ebisOther4}}&ebisOther5=&ebisMember=&ebisAmount=&ebisAccessTypes=pv&referrer={{referrer}}"
                + "&pagetitle={{pagetitle}}&pageurl={{pageurl}}&ebisUA={{ebisUA}}&ebisRand={{ebisRand}}.0";

            let other1 = order_id;
            let other2 = (typeof body.other2 !== 'undefined') ? body.other2 : "";
            let other3 = (typeof body.other3 !== 'undefined') ? body.other3 : "";
            let other4 = (typeof body.other4 !== 'undefined') ? body.other4 : "";
            let pagetitle = (typeof body.pagetitle !== 'undefined') ? body.pagetitle : "";
            let user_agent = (typeof body.user_agent !== 'undefined') ? body.user_agent : "";

            let now = new Date();
            let ebisRand = now.getTime();

            let ref = "https://www.pulito.co.jp/promo/lpmanager/receiver.cgi";
            let pageurl = "https://www.pulito.co.jp/reserve/thanks.php?store=";

            adebis_url = adebis_url.replace("{{ebisOther1}}", other1);
            adebis_url = adebis_url.replace("{{ebisOther2}}", other2);
            adebis_url = adebis_url.replace("{{ebisOther3}}", other3);
            adebis_url = adebis_url.replace("{{ebisOther4}}", other4);
            adebis_url = adebis_url.replace("{{pagetitle}}",  encodeURI(pagetitle));
            adebis_url = adebis_url.replace("{{ebisRand}}", ebisRand);
            adebis_url = adebis_url.replace("{{ebisUA}}", encodeURI(user_agent));
            adebis_url = adebis_url.replace("{{referrer}}", encodeURI(ref));
            adebis_url = adebis_url.replace("{{pageurl}}", encodeURI(pageurl));

            res.json({
                order_id: order_id,
                adebis_url: adebis_url
            });
        });

        this.router.post('/getAdebisUrl', async (req, res, next) => {
            var body = req.body;
            console.log(body);
            var adebis_url = "https://ac.ebis.ne.jp/rec.php?ebisV=6.0&argument=pZ2GtnGp&ebisPageID=complete&ebisOther1={{ebisOther1}}&ebisOther2={{ebisOther2}}"
                + "&ebisOther3={{ebisOther3}}&ebisOther4={{ebisOther4}}&ebisOther5=&ebisMember=&ebisAmount=&ebisAccessTypes=pv&referrer={{referrer}}"
                + "&pagetitle={{pagetitle}}&pageurl={{pageurl}}&ebisUA={{ebisUA}}&ebisRand={{ebisRand}}.0";

            let other1 = (typeof body.other1 !== 'undefined') ? body.other1 : "";
            let other2 = (typeof body.other2 !== 'undefined') ? body.other2 : "";
            let other3 = (typeof body.other3 !== 'undefined') ? body.other3 : "";
            let other4 = (typeof body.other4 !== 'undefined') ? body.other4 : "";
            let pagetitle = (typeof body.pagetitle !== 'undefined') ? body.pagetitle : "";
            let user_agent = (typeof body.user_agent !== 'undefined') ? body.user_agent : "";

            let now = new Date();
            let ebisRand = now.getTime();

            let ref = "https://www.pulito.co.jp/promo/lpmanager/receiver.cgi";
            let pageurl = "https://www.pulito.co.jp/reserve/thanks.php?store=";

            adebis_url = adebis_url.replace("{{ebisOther1}}", other1);
            adebis_url = adebis_url.replace("{{ebisOther2}}", other2);
            adebis_url = adebis_url.replace("{{ebisOther3}}", other3);
            adebis_url = adebis_url.replace("{{ebisOther4}}", other4);
            adebis_url = adebis_url.replace("{{pagetitle}}",  encodeURI(pagetitle));
            adebis_url = adebis_url.replace("{{ebisRand}}", ebisRand);
            adebis_url = adebis_url.replace("{{ebisUA}}", encodeURI(user_agent));
            adebis_url = adebis_url.replace("{{referrer}}", encodeURI(ref));
            adebis_url = adebis_url.replace("{{pageurl}}", encodeURI(pageurl));

            console.log(adebis_url);

            res.json({
                adebis_url: adebis_url
            });
        });
    }
}

module.exports = new pulitoRouter().router;
