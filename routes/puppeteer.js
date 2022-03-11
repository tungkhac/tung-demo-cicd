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
const url_require = require('url');
const querystring = require('querystring');
const login_type_member = '1';
const login_type_register = '2';
const login_type_guest = '3';
const get_list_payment_card_value = '4';
const product_id_487 = '487';
const product_id_489 = '489';
const mail_service = '1';
const home_delivery = '2';
const cash_delivery = '1';
const credit_delivery = '2';
const quantity_default = 1;
const header_login_success = "マイページ/ご注文履歴";
const header_thank_page = "ご注文完了";
const error_message_empty = "Input data is empty.";
const option_value_1 = '1';
const option_value_3 = '3';
const header_change_profile = 'マイページ/会員情報編集';
const variable_card_info = ["card_count", "card_list"];
const register_info = ["register_email", "register_flg"];
const variable_login_info = ["login_flg"];
const variable_user_profile = ["first_name", "last_name", "furigana_first", "furigana_last", "zipcode", "address_郵便番号1", "address_郵便番号2", "address", "address_都道府県", "address_市区町村", "address_番地", "address_建物名", "phone_number", "zipcode1", "zipcode2", "birth_day", "gender"];
const pref_code_list = {
    "北海道":"01",
    "青森県":"02",
    "岩手県":"03",
    "宮城県":"04",
    "秋田県":"05",
    "山形県":"06",
    "福島県":"07",
    "茨城県":"08",
    "栃木県":"09",
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

router.post('/surusuru_landing', function(req, res, next) {
    console.log("time");
    console.log("=====call api surusuru_landing======");
    var body = req.body;
    var user_id = body.user_id;
    var product_id = body.product_id;
    var quantity = (typeof  body.quantity != "undefined") ? body.quantity : quantity_default;
    var connect_page_id = body.cpid;
    var landing_page_url = body.landing_page_url;
    var response = {};

    console.log('=====start send data to request=====');
    console.log("body", body);
    if (typeof user_id == "undefined" || user_id == '' || typeof product_id == "undefined" ||
        product_id == '' || typeof connect_page_id == "undefined" || connect_page_id == '' ||
        typeof landing_page_url == "undefined" || landing_page_url == ''
    ) {
        response.error_message = error_message_empty;
        return res.status(400).json(response);
    }

    var token = crypto.randomBytes(64).toString('hex');
    var data = {
        user_id: user_id,
        connect_page_id: connect_page_id,
        product_id: product_id,
        quantity: quantity,
        landing_page_url: landing_page_url,
        user_token: token
    };

    puppeteerRequest.remove({cpid: connect_page_id, user_id: user_id}, function(err) {
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

        var cart_data = {
            cpid: connect_page_id,
            user_id: user_id,
            user_token: token,
            url: "",
            status: 0,
            error_message: "",
            index: 2,
            request_body: body,
            param: data
        };

        var landing_save = new puppeteerRequest(landing_data);
        landing_save.save(function(err, result1) {
            data.object_id_index_1 =  result1._id;
            var cart_save = new puppeteerRequest(cart_data);
            cart_save.save(function(err, result2) {
                data.object_id_index_2 =  result2._id;

                var form_selector = '';
                if(product_id == product_id_489) {
                    form_selector = '#wrapper > div:nth-child(28) > form';
                } else if(product_id == product_id_487){
                    form_selector = '#wrapper > div:nth-child(30) > form';
                }

                if(form_selector != '') {
                    puppeteerLandingPage(body, data, form_selector, res);
                    response.login_flg = '0';
                    res.status(200).json(response);
                } else {
                    response.error_message = "form not exist";
                    res.status(500).json(response);
                }
            });
        });
    });
    console.timeEnd("time");
});

router.post('/surusuru_login', function(req, res, next) {
    console.time("login");
    console.log("=========call api surusuru_login==========");
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
    var data = {connect_page_id : connect_page_id, user_id : user_id, mail: mail, password : password, login_type: login_type};
    var login_data = {
        cpid: connect_page_id,
        user_id: user_id,
        url: "",
        status: 0,
        error_message: "",
        index: 3,
        login_type: login_type,
        request_body: body,
        param: {
            mail: mail,
            password : password,
        }
    };

    puppeteerRequest.remove({cpid : connect_page_id, user_id: user_id, index: {$gte: 3}},function(err) {
        if(err) throw err;
        var puppeteer_data = new puppeteerRequest(login_data);
        puppeteer_data.save(function(err, result){
            if(err) throw err;
            data.object_id_index_3 = result._id;
            checkPreviousStep(body, data, res);
        });
    });
    console.timeEnd("login");
});

router.post('/surusuru_guest', function(req, res, next) {
    console.time("time_guest");
    console.log("=========call api surusuru_guest==========");
    var body = req.body;
    console.log("body=", body);
    var first_name = body.first_name;
    var last_name = body.last_name;
    var furigana_first = body.furigana_first;
    var furigana_last = body.furigana_last;
    var zipcode = splitZipcode(body.zipcode);
    var pref = body.pref;
    var address01 = body.address01;
    var address02 = body.address02;
    var phone = splitPhoneNumber(body.phone);
    var mail = body.mail;
    var zipcode1 = zipcode.zipcode1;
    var zipcode2 = zipcode.zipcode2;
    var phone1 = phone.phone1;
    var phone2 = phone.phone2;
    var phone3 = phone.phone3;
    var user_id = body.user_id;
    var connect_page_id = body.cpid;
    var login_type = body.login_type;
    var response = {};

    if (typeof first_name == "undefined" || first_name == '' ||
        typeof last_name == "undefined" || last_name == '' ||
        typeof furigana_first == "undefined" || furigana_first == '' ||
        typeof furigana_last == "undefined" || furigana_last == '' ||
        typeof zipcode == "undefined" || zipcode == '' ||
        typeof pref == "undefined" || pref == '' ||
        typeof address01 == "undefined" || address01 == '' ||
        typeof phone == "undefined" || phone == '' ||
        typeof mail == "undefined" || mail == '' ||
        typeof user_id == "undefined" || user_id == '' ||
        typeof connect_page_id == "undefined" || connect_page_id == ''
    ) {
        response.error_message  = error_message_empty;
        return res.status(400).json(response);
    }

    var data = {
        first_name: first_name,
        last_name: last_name,
        furigana_first: furigana_first,
        furigana_last: furigana_last,
        zipcode1: zipcode1,
        zipcode2: zipcode2,
        pref: pref,
        address01: address01,
        address02: address02,
        mail: mail,
        phone1: phone1,
        phone2: phone2,
        phone3: phone3,
        user_id: user_id,
        connect_page_id: connect_page_id,
        login_type: login_type
    };

    puppeteerRequest.remove({cpid : connect_page_id, user_id: user_id, index: {$gte: 3}},function(err) {
        if (err) throw err;
        var nomember_data = {
            cpid: connect_page_id,
            user_id: user_id,
            url: "",
            status: 0,
            error_message: "",
            index: 3,
            request_body: body,
            param: data
        };
        var puppeteer_data = new puppeteerRequest(nomember_data);
        puppeteer_data.save(function(err, result){
            if(err) throw err;
            data.object_id_index_3 =  result._id;
            checkPreviousStep(body, data, res);
        });

    });

    console.timeEnd("time_guest");
});

router.post('/surusuru_register', function(req, res, next) {
    console.time("time_shopping");
    console.log("=========call api surusuru_register==========");
    var body = req.body;
    //console.log("body", body);
    var first_name = body.first_name;
    var last_name = body.last_name;
    var furigana_first = body.furigana_first;
    var furigana_last = body.furigana_last;
    var zipcode = splitZipcode(body.zipcode);
    var pref = body.pref;
    var address01 = body.address01;
    var address02 = body.address02;
    var phone = splitPhoneNumber(body.phone);
    var mail = body.mail;
    var zipcode1 = zipcode.zipcode1;
    var zipcode2 = zipcode.zipcode2;
    var phone1 = phone.phone1;
    var phone2 = phone.phone2;
    var phone3 = phone.phone3;
    var user_id = body.user_id;
    var connect_page_id = body.cpid;
    var fax = splitFaxNumber(body.fax);
    var password = body.password;
    var birth_day = splitBirthday(body.birth_day);
    var gender = body.gender;
    var magazine = body.magazine;
    var fax1 = fax.fax1;
    var fax2 = fax.fax2;
    var fax3 = fax.fax3;
    var year = birth_day.year;
    var month = birth_day.month;
    var day = birth_day.day;
    var login_type = body.login_type;
    var response = {};

    var data = {
        first_name: first_name,
        last_name: last_name,
        furigana_first: furigana_first,
        furigana_last: furigana_last,
        zipcode1: zipcode1,
        zipcode2: zipcode2,
        pref: pref,
        address01: address01,
        address02: address02,
        mail: mail,
        password: password,
        phone1: phone1,
        phone2: phone2,
        phone3: phone3,
        user_id: user_id,
        connect_page_id: connect_page_id,
        fax1: fax1,
        fax2: fax2,
        fax3: fax3,
        year: year,
        month: month,
        day: day,
        gender: gender,
        magazine: magazine,
        login_type: login_type
    };

    console.log("---------data-------", data);
    //if (first_name == '' || last_name == '' || furigana_first == '' || furigana_last == ''
    //    || zipcode == '' || pref == '' || address01 == '' || phone == '' || mail == ''
    //    || user_id == '' || connect_page_id == ''|| password == '' || gender == ''
    //) {
    //    response.error_message  = error_message_empty;
    //    return res.status(400).json(response);
    //}

    var register_data = {
        cpid: connect_page_id,
        user_id: user_id,
        url: "",
        status: 0,
        error_message: "",
        index: 3,
        request_body: body,
        param: data
    };

    puppeteerRequest.remove({cpid : connect_page_id, user_id: user_id, index: {$gte: 3}},function(err) {
        if(err) throw err;
        var puppeteer_data = new puppeteerRequest(register_data);
        puppeteer_data.save(function(err, result){
            if(err) throw err;
            data.object_id_index_3 = result._id;
            checkPreviousStep(body, data, res);
        });
    });

    //res.status(200).json(response);
    console.timeEnd("time_shopping");
});

router.post('/surusuru_shopping', function(req, res, next) {
    console.time("shopping");
    console.log("=========call api surusuru_shopping==========");
    var body = req.body;
    console.log(body);
    var payment_flg = (typeof body.payment_flg !== "undefined") ? parseInt(body.payment_flg) : 0;
    var connect_page_id = body.cpid;
    var user_id = body.user_id;
    var login_type = body.login_type;
    var shipping_method = body.shipping_method;
    var payment_method = body.payment_method;
    var delivery_date = body.shopping_date;
    var card_token = body.card_token;
    if(typeof delivery_date !== "undefined"){
        delivery_date = delivery_date.replace(/-/g, '/');
    }
    var delivery_time = '';
    if(shipping_method == home_delivery) delivery_time = body.shopping_time;
    var response = {};

    if (typeof connect_page_id == "undefined" || connect_page_id == '' ||
        typeof user_id == "undefined" || user_id == '') {
        response.error_message = error_message_empty;
        return res.status(400).json(response);
    }

    var data = {
        connect_page_id : connect_page_id,
        user_id : user_id,
        login_type : login_type,
        shipping_method : shipping_method,
        payment_method : payment_method,
        card_token : card_token,
        delivery_date : delivery_date,
        delivery_time : delivery_time,
        payment_flg: payment_flg
    };

    var shopping_data = {
        cpid: connect_page_id,
        user_id: user_id,
        url: "",
        status: 0,
        error_message: "",
        index: 4,
        request_body: body,
        param: data
    };

    puppeteerRequest.remove({cpid : connect_page_id, user_id: user_id, index: {$gte: 4}},function(err) {
        if(err) throw err;
        var puppeteer_data = new puppeteerRequest(shopping_data);
        puppeteer_data.save(function(err, result){
            if(err) throw err;
            data.object_id_index_4 = result._id;
            checkPreviousShopping(body, data, res);
        });
    });
    console.timeEnd("shopping");
});

router.post('/surusuru_payment', function(req, res, next) {
    console.log("=========call api surusuru_payment==========");
    var body = req.body;
    var user_id = body.user_id;
    var card_token = body.card_token;
    var connect_page_id = body.cpid;
    var response = {};
    if (user_id == '' || card_token == '' || connect_page_id == '') {
        response.error_message  = error_message_empty;
        return res.status(400).json(response);
    }

    var data = {user_id: user_id, connect_page_id: connect_page_id, card_token: card_token};
    var puppeteer_payment = {
        cpid: connect_page_id,
        user_id: user_id,
        url: "",
        status: 0,
        error_message: "",
        index: 5,
        request_body: body,
        param: {
            card_token: card_token,
        }
    };

    puppeteerRequest.remove({cpid : connect_page_id, user_id: user_id, index: 5},function(err) {
        if(err) throw err;
        var puppeteer_data = new puppeteerRequest(puppeteer_payment);
        puppeteer_data.save(function(err, result){
            if(err) throw err;
            console.log("payment create");
            data.object_id_index_5 = result._id;
            payment(body, data, res);
        });

    });
});
/*update quyetnd*/
router.post('/surusuru_order', function(req, res, next) {
    console.time("time_order");
    console.log("=========call api surusuru_order==========");
    var body = req.body;
    //console.log("body", body);
    var first_name = body.first_name;
    var last_name = body.last_name;
    var furigana_first = body.furigana_first;
    var furigana_last = body.furigana_last;
    // var zipcode = splitZipcode(body.zipcode);
    var pref = body.pref;
    var address01 = body.address01;
    var address02 = body.address02;
    var address03 = (typeof body.address03 != 'undefined') ? body.address03 : '';
    var phone = splitPhoneNumber(body.phone);
    var mail = body.mail;
    var zipcode1 = body.zipcode1;
    var zipcode2 = body.zipcode2;
    var phone1 = phone.phone1;
    var phone2 = phone.phone2;
    var phone3 = phone.phone3;
    var user_id = body.user_id;
    var connect_page_id = body.cpid;
    var fax = splitFaxNumber(body.fax);
    var password = body.password;
    var birth_day = splitBirthday(body.birth_day);
    var gender = body.gender;
    var magazine = body.magazine;
    var fax1 = fax.fax1;
    var fax2 = fax.fax2;
    var fax3 = fax.fax3;
    var year = birth_day.year;
    var month = birth_day.month;
    var day = birth_day.day;
    var login_type = body.login_type;
    var card_token = body.card_token;
    var shipping_method = body.shipping_method;
    var payment_method = body.payment_method;
    var delivery_date = body.shopping_date;
    var card_select = body.card_select;
    var card_name = body.card_name;
    var response = {};

    if(typeof delivery_date !== "undefined"){
        delivery_date = delivery_date.replace(/-/g, '/');
    }
    var delivery_time = '';
    if(shipping_method == home_delivery) delivery_time = body.shopping_time;

    var data = {
        first_name: first_name,
        last_name: last_name,
        furigana_first: furigana_first,
        furigana_last: furigana_last,
        zipcode1: zipcode1,
        zipcode2: zipcode2,
        pref: pref,
        address01: address01,
        address02: address02 + address03,
        mail: mail,
        password: password,
        phone1: phone1,
        phone2: phone2,
        phone3: phone3,
        user_id: user_id,
        connect_page_id: connect_page_id,
        fax1: fax1,
        fax2: fax2,
        fax3: fax3,
        year: year,
        month: month,
        day: day,
        gender: gender,
        magazine: magazine,
        login_type: login_type,
        card_token: card_token,
        shipping_method: shipping_method,
        payment_method: payment_method,
        delivery_date: delivery_date,
        delivery_time : delivery_time,
        card_select : card_select,
        card_name : card_name,
        order_quantity: body.order_quantity,
        order_sub_total: body.order_sub_total,
        current_url: body.current_url,
        register_flg: (typeof body.register_flg != 'undefined' && body.register_flg) ? true : false,
        register_email: (typeof body.register_email != 'undefined') ? body.register_email : ''
    };

    console.log("---------data-------", data);
    //if (first_name == '' || last_name == '' || furigana_first == '' || furigana_last == ''
    //    || zipcode == '' || pref == '' || address01 == '' || phone == '' || mail == ''
    //    || user_id == '' || connect_page_id == ''|| password == '' || gender == ''
    //) {
    //    response.error_message  = error_message_empty;
    //    return res.status(400).json(response);
    //}

    var register_data = {
        cpid: connect_page_id,
        user_id: user_id,
        url: "",
        status: 0,
        error_message: "",
        index: 3,
        request_body: body,
        param: data
    };
    var condition = {cpid : connect_page_id, user_id: user_id, index: {$gte: 3}};
    if(login_type === login_type_member){
        condition = {cpid : connect_page_id, user_id: user_id, index: {$gt: 3}};
    }
    console.log('condition===', condition);
    puppeteerRequest.remove(condition,function(err) {
        if(err) throw err;
        if(login_type === login_type_member){
            data.order_type_login = 1;
            puppeteerRequest.findOne({cpid: connect_page_id, user_id: user_id, index: 3, status: 1}, function (err, result) {
                data.object_id_index_3 = result._id;
                checkPreviousStep(body, data, res);
            });
        }else{
            var puppeteer_data = new puppeteerRequest(register_data);
            puppeteer_data.save(function(err, result){
                if(err) throw err;
                data.object_id_index_3 = result._id;
                checkPreviousStep(body, data, res);
            });
        }
    });
    console.timeEnd("time_order");
});

router.post('/getPrice', function(req, res, next) {
    console.log("start getPrice");
    var body = req.body;
    console.log(body);
    var product_price = body.product_unit_price;
    var product_unit_price = 990;

    var response = {};
    response.product_unit_price = product_unit_price;
    response.order_quantity = product_price / product_unit_price;

    console.log(response);
    res.status(200).json(response);

});

function surusuruShopping(request_body, data, res){
    var shopping_data = {
        cpid: data.connect_page_id,
        user_id: data.user_id,
        url: "",
        status: 0,
        error_message: "",
        index: 4,
        request_body: request_body,
        param: data
    };

    puppeteerRequest.remove({cpid : data.connect_page_id, user_id: data.user_id, index: {$gte: 4}},function(err) {
        if(err) throw err;
        var puppeteer_data = new puppeteerRequest(shopping_data);
        puppeteer_data.save(function(err, result){
            if(err) throw err;
            data.object_id_index_4 = result._id;
            checkPreviousShopping(request_body, data, res);
        });
    });
}

function executeOrder(params, res){
    var data = {user_id: params.user_id,
        connect_page_id: params.connect_page_id,
        card_token: params.card_token,
        card_select: params.card_select,
        current_url: params.current_url
    };
    data = params;
    var puppeteer_payment = {
        cpid: params.connect_page_id,
        user_id: params.user_id,
        url: "",
        status: 0,
        error_message: "",
        index: 5,
        request_body: params,
        param: {
            card_token: params.card_token
        }
    };

    puppeteerRequest.remove({cpid : params.connect_page_id, user_id: params.user_id, index: 5},function(err) {
        if(err) throw err;
        var puppeteer_data = new puppeteerRequest(puppeteer_payment);
        puppeteer_data.save(function(err, result){
            if(err) throw err;
            console.log("payment create");
            data.object_id_index_5 = result._id;
            payment(params, data, res);
        });

    });
}

function puppeteerShopping(body, cookie, data, res) {
    console.log("start puppeteerShopping function=", data);
    var response = {};
    var login_type = data.login_type;
    // var payment_flg = parseInt(data.payment_flg);
    var g_customer_point_use = '';
    var g_customer_point_add = '';

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
    if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image') {
        request.abort();
    } else {
        //console.log(rtype);
        if(rtype == "script"){
            if(request.url().indexOf("surusuru") !== -1){
                // console.log(request.url());
                request.continue();
            }else{
                request.abort();
            }
        }
        else if(rtype == "document"){
            if(request.url().indexOf("surusuru") !== -1){
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
        if (typeof cookie != 'undefined' && cookie.name == 'eccube' && cookie.value != '') {
            const shopping_url = "https://www.surusuru.jp/shopping";
            //const page = await browser.newPage();
            cookie.url = shopping_url;
            await page.setCookie(cookie);
            await page.goto(shopping_url, {waitUntil: 'networkidle0'});
            //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_start_shopping_' + Date.now() + '.png', fullPage: true});
            //get user infomation
            /*const customer_name01_element = "#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-name01";
            const customer_name02_element = "#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-name02";
            const customer_name01 = await page.$eval(customer_name01_element, el => el.innerText );
            const customer_name02 = await page.$eval(customer_name02_element, el => el.innerText );
            const user_name = customer_name01 + customer_name02;
            console.log("user_name", user_name);
            const zip01 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-zip01', el => el.innerText );
            const zip02 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-zip02', el => el.innerText );
            const pref = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-pref', el => el.innerText );
            const addr01 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-addr01', el => el.innerText );
            const addr02 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-addr02', el => el.innerText );
            const user_address = "〒" + zip01 + "-" + zip02 + pref + addr01 + addr02;
            console.log("user_address", user_address);
            const tel01 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-tel01', el => el.innerText );
            const tel02 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-tel02', el => el.innerText );
            const tel03 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-tel03', el => el.innerText );
            const user_tel = tel01 + "-" + tel02 + "-" + tel03;
            console.log("user_tel", user_tel);*/
            const delivery_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_confirm_box--0 > #shipping_delivery_block > #shopping_confirm_box__shipping_delivery--0 > #shopping_shippings_0_delivery';
            const delivery_date_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_confirm_box--0 > #shipping_delivery_block > #shopping_confirm_box__shipping_delivery_date_time--0 > #shopping_shippings_0_shippingDeliveryDate';
            const delivery_time_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_confirm_box--0 > #shipping_delivery_block > #shopping_confirm_box__shipping_delivery_date_time--0 > #shopping_shippings_0_deliveryTime';
            if(data.shipping_method == mail_service) {
                console.log("start method mail service");
                const option_1_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_confirm_box--0 > #shipping_delivery_block > #shopping_confirm_box__shipping_delivery--0 > #shopping_shippings_0_delivery > option[value="'+ option_value_1 +'"]';
                await page.waitForSelector(option_1_element);
                const shipping_method_option_1 = await page.$(option_1_element);
                var shipping_method_option_1_selected = await (await shipping_method_option_1.getProperty('selected')).jsonValue();
                console.log("====shipping_method_option_1_selected====", shipping_method_option_1_selected);
                if(shipping_method_option_1_selected != true) {
                    await Promise.all([
                        page.select(delivery_element, option_value_1),
                        page.waitForNavigation()
                    ]);
                }
                if(data.delivery_date != '') {
                    await page.select(delivery_date_element, data.delivery_date);
                }
            } else {
                console.log("method home delivery");
                const option_3_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_confirm_box--0 > #shipping_delivery_block > #shopping_confirm_box__shipping_delivery--0 > #shopping_shippings_0_delivery > option[value="'+ option_value_3 +'"]';
                await page.waitForSelector(option_3_element);
                const shipping_method_option_3 = await page.$(option_3_element);
                var shipping_method_option_3_selected = await (await shipping_method_option_3.getProperty('selected')).jsonValue();
                console.log("====shipping_method_option_3_selected====", shipping_method_option_3_selected);
                if(shipping_method_option_3_selected != true) {
                    await Promise.all([
                        page.select(delivery_element, option_value_3),
                        page.waitForNavigation()
                    ]);
                }

                if(data.delivery_date != '') {
                    await page.select(delivery_date_element, data.delivery_date);
                }
                if(data.delivery_time != '') {
                    await page.select(delivery_time_element, data.delivery_time);
                }
                console.log("end select date time");
                if(data.payment_method == cash_delivery) {
                    console.log("start click pyament home");
                    console.log("check click  cash_delivery", data.payment_method);
                    const radio_element1 = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_payment_block > #payment_list > #payment_list__body > #payment_list__list > li:nth-child(2) > div.radio > label > #shopping_payment_4';
                    await page.waitForSelector(radio_element1);
                    const radio_credit_card1 = await page.$(radio_element1);
                    var radio_is_checked1 = await (await radio_credit_card1.getProperty('checked')).jsonValue();
                    console.log("radio_is_checked1 代金=", radio_is_checked1);
                    if(!radio_is_checked1) {
                        console.log("start click  cash_delivery", data.payment_method);
                        await Promise.all([
                            page.click(radio_element1),
                            page.waitForNavigation()
                        ]);
                    }else{
                        console.log("noneed click 代金 cash_delivery", data.payment_method);
                    }
                } else {
                    console.log('=============click credit card==========');
                    const radio_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_payment_block > #payment_list > #payment_list__body > #payment_list__list > li:nth-child(3) > div.radio > label > #shopping_payment_35';
                    await page.waitForSelector(radio_element);
                    const radio_credit_card = await page.$(radio_element);
                    var radio_is_checked = await (await radio_credit_card.getProperty('checked')).jsonValue();
                    if(!radio_is_checked) {
                        console.log("click radio payment method credit_card");
                        await Promise.all([
                            page.click(radio_element),
                            page.waitForNavigation()
                        ]);
                        //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_shopping_222_' + Date.now() + '.png', fullPage: true});
                    } else {
                        console.log("no need click radio payment");
                    }
                }
            }
            //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_shopping_' + Date.now() + '.png', fullPage: true});
            const subtotal = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__subtotal > dd.text-primary', el => el.innerText );
            const charge_price = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__quantity_price > dd > #charge_price', el => el.innerText );
            const shipping_price = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__shipping_price > dd', el => el.innerText );

            var param_update1 = {
                subtotal: subtotal,
                shipping_price: shipping_price,
                charge_price: charge_price,
                total: '',
                // user_name: user_name,
                // user_address: user_address,
                // user_tel: user_tel
            };

            if(login_type != login_type_guest) {
                const customer_point_use = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__result > #summary_box__customer_point_use > dd.text-primary', el => el.innerText );
                const customer_point_add = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__result > #summary_box__customer_point_add > dd', el => el.innerText );
                param_update1.customer_point_use = customer_point_use;
                param_update1.customer_point_add = customer_point_add;
            }
            const total = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__result > #summary_box__total_amount > strong.text-primary > #text_total', el => el.innerText );
            param_update1.total = total;

            // if(payment_flg){
                console.log("start click submit");
                await Promise.all([
                    page.click('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__result > #summary_box__confirm_button > #order-button'),
                    page.waitForNavigation()
                ]);
                const continue_url = await page.evaluate('location.href');
                console.log('data.payment_method====', data.payment_method);
                console.log('credit_delivery====', credit_delivery);
                console.log('continue_url=====', continue_url);
                if(data.payment_method == credit_delivery) {
                    const payment_url = "https://www.surusuru.jp/shopping/gmo_payment";
                    if(continue_url == payment_url){
                        puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_4}, {
                            $set: {
                                status: 1,
                                url: payment_url,
                                param: param_update1,
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {
                            if (err) throw err;
                        });
                        //new
                        await browser.close();
                        executeOrder(data, res);
                        return;
                    }else{
                        console.log("shopping error");
                        var error_message = "エラーが発生しました。再度ご試しください。";
                        puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_4, status: 2}, {
                            $set: {
                                status: 3,
                                error_message: error_message,
                                url: shopping_url,
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {
                            if (err) throw err;
                        });
                        response.error_message = error_message;
                        res.status(500).json(response);
                    }
                }
            /*}else{
                console.log("not payment payment_flg=", payment_flg);
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_4, status: 2}, {
                    $set: {
                        status: 1,
                        param: param_update1,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });

                const cookiesObject = await page.cookies();
                var cookie_new = getCookie(cookiesObject);

                puppeteerRequest.findOne({cpid: data.connect_page_id, user_id: data.user_id, index: 2, status: 1}, function (err, result) {
                    var tmp_param = result.param;
                    tmp_param.cookie = cookie_new;
                    result.param = tmp_param;
                    result.updated_at = new Date();
                    result.save(function (err) {});
                });

                response.subtotal = subtotal;
                response.charge_price = charge_price;
                response.shipping_price = shipping_price;
                response.customer_point_use = g_customer_point_use;
                response.customer_point_add = g_customer_point_add;
                response.total = total;
                response.user_name = user_name;
                response.user_address = user_address;
                response.user_tel = user_tel;
                console.log("bild confirm",response);
                res.status(200).json(response);
                return;
            }*/

            const new_shopping_url = await page.evaluate('location.href');
            const thank_url = "https://www.surusuru.jp/shopping/complete";
            console.log("check new_shopping_url", new_shopping_url);
            if(new_shopping_url == thank_url) {
                console.log('start get ebis variable');
                const ebis = await page.evaluate(() => {
                    return window.ebis;
                });
                if(typeof ebis != 'undefined' && typeof ebis[0] != 'undefined'){
                    const ebis_value = ebis[0];
                    // const pref = splitOther5(ebis_value.other5).pref;
                    const pref = data.pref;

                    const qu_p1 = data.order_sub_total;
                    const qu_p2 = ebis_value.other1;
                    const qu_p3 = data.order_quantity;
                    const qu_p4 = getParam('p', data.current_url);
                    // const qu_p5 = splitOther5(ebis_value.other5).sex;
                    const qu_p5 = data.gender;
                    const qu_p6 = (typeof pref_code_list[pref] != 'undefined') ? pref_code_list[pref] : '';
                    const qu_order_type = (ebis_value.other4 == '定期') ? '1' : '2';
                    const qu_order_id = ebis_value.member_name;

                    const url = new_shopping_url + '?qualva_cv=bo&qu_order_id=' + qu_order_id + '&qu_order_type=' + qu_order_type + '&qu_p1=' + qu_p1 + '&qu_p2=' + qu_p2 + '&qu_p3=' + qu_p3 + '&qu_p4=' + qu_p4 + '&qu_p5=' + qu_p5 + '&qu_p6=' + qu_p6;
                    response.thank_url = url;
                    console.log('url===', url);
                    /*request({
                        uri: url,
                        method: 'GET'
                    },function (error, response, body) {
                        console.log('request error', error);
                        // console.log('request body', body);
                    });*/
                }
                console.log('end get ebis variable');
                console.log("shopping complete");
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_4, status: 2}, {
                    $set: {
                        status: 1,
                        url: thank_url,
                        param: param_update1,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });

                /*response.subtotal = subtotal;
                response.charge_price = charge_price;
                response.shipping_price = shipping_price;
                response.customer_point_use = g_customer_point_use;
                response.customer_point_add = g_customer_point_add;
                response.total = total;
                response.user_name = user_name;
                response.user_address = user_address;
                response.user_tel = user_tel;*/
                res.status(200).json(response);
            } else {
                console.log("shopping error");
                var error_message = "エラーが発生しました。再度ご試しください。";
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_4, status: 2}, {
                    $set: {
                        status: 3,
                        error_message: error_message,
                        url: shopping_url,
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });
                response.error_message = error_message;
                res.status(500).json(response);
            }

        } else {
            console.log("cookie not exist");
            var error_msg = "cookie not exist";
            puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_4, status: 2}, {
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
        console.log("puppeteerShopping exception", e);
        var exception_index_4 = {
            cpid: data.connect_page_id,
            user_id: data.user_id,
            status: 3,
            error_message: e,
            index: 4,
            request_body: body,
            param: data
        };
        savePuppeteerException(exception_index_4);
        response.error_message = "エラーが発生しました。再度ご試しください。";
        res.status(500).json(response);
    }

    await browser.close();
})()
}
/*end update*/
function puppeteerLandingPage(body, data, form_selector, res) {
    var response = {};
    var landing_page_url = data.landing_page_url;
    var product_id = data.product_id;
    var quantity = typeof data.quantity != 'undefined' ? data.quantity.toString() : "1";
    console.log("call puppeteerLandingPage");
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
                    if(request.url().indexOf("surusuru") !== -1){
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
            // const lp_url = "https://www.surusuru.jp/lpn/bo01/";
            console.log(landing_page_url);
            //const page = await browser.newPage();
            await page.goto(landing_page_url, {waitUntil: 'networkidle0'});
            await page.waitForSelector('body > #wrap > #wrapper > .ofa_area > form');
            console.log("start click submit");
            if(product_id == product_id_489 && parseInt(quantity) > quantity_default) {
                console.log("quantity 489=", quantity);
                const input_quantity = form_selector + ' > input[name="quantity"]';
                await page.evaluate((input_quantity, quantity) => {
                    document.querySelector(input_quantity).value = quantity
                }, input_quantity, quantity);

                const tmp_quantity = await page.$eval(input_quantity, el => el.value);
                console.log("tmp_quantity 489====", tmp_quantity);
            }
            if(product_id == product_id_487 && parseInt(quantity) > quantity_default) {
                console.log("quantity=", quantity);
                await page.select('#wrapper > div:nth-child(30) > form > select.select_no', quantity);
            }
            await page.$eval(form_selector, form => form.submit());
            const header_element = '#contents > div.inner.wrap > #main_middle > h1.page-heading';
            // await page.waitForSelector(cart_header_element);
            await page.waitForSelector(header_element).then(() => {
                console.log('redirect cart page success');
                console.log(page.url());
            }).catch(e => {
                console.log('redirect cart page fail', e);
            });
            //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_cart_' + Date.now() + '.png', fullPage: true});
            console.log("end  click submit");
            const cart_url = await page.evaluate('location.href');
            console.log("cart_url", cart_url);
            console.log("start insert index 1 done ");
            puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_1}, {
                $set: {
                    status: 1,
                    url: landing_page_url,
                    updated_at: new Date()
                }
            }, {upsert: false}, function (err, result) {
                if (err) throw err;
                console.log("end insert index 1 done ");
                if (result) {
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
                        $set: {
                            status: 2,
                            updated_at: new Date()
                        }
                    }, {upsert: false}, function (err, result) {
                        if (err) throw err;
                    });
                }
            });

            //cart page
            const main_url = "https://www.surusuru.jp";
            await page.waitForSelector('#form_cart > div.total_box > #total_box__user_action_menu > #total_box__next_button > a');
            const product_img_class = "#form_cart > #cart_item_list > #cart_item_list__body > #cart_item_list__item > div.table > #cart_item_list__product_image > a > img";
            const product_name_class = "#form_cart > #cart_item_list > #cart_item_list__body > #cart_item_list__item > div.table > dl.item_detail > #cart_item_list__product_detail > a";
            const product_price_item_class = "#form_cart > #cart_item_list > #cart_item_list__body > #cart_item_list__item > div.table > dl.item_detail > #cart_item_list__item_price";
            const price_class = "#form_cart > #cart_item_list > #cart_item_list__body > #cart_item_list__item > #cart_item_list__subtotal";
            const quantity_class = "#form_cart > #cart_item_list > #cart_item_list__body > #cart_item_list__item > #cart_item_list__quantity";

            const product_img = await page.evaluate((product_img_class) => {
                return document.querySelector(product_img_class).getAttribute('src');
            }, product_img_class);

            const product_name = await page.$eval(product_name_class, el => el.innerText );
            const str_product_price_item = await page.$eval(product_price_item_class, el => el.innerText );
            const product_price_item = str_product_price_item.split('：')[1];
            const price_total_value = await page.$eval(price_class, el => el.innerText );
            const quantity_value = await page.$eval(quantity_class, el => el.innerText );

            // await Promise.all([
            //     page.click('#form_cart > div.total_box > #total_box__user_action_menu > #total_box__next_button > a'),
            //     page.waitForNavigation(),
            // ]);
            await page.click('#form_cart > div.total_box > #total_box__user_action_menu > #total_box__next_button > a');
            const login_page_element = '#contents > div.inner > #main_middle > #login_wrap > form';
            await page.waitForSelector(login_page_element).then(() => {
                console.log('redirect login page success');
                console.log(page.url());
            }).catch(e => {
                console.log('redirect login page fail', e);
            });
            //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_login_' + Date.now() + '.png', fullPage: true});

            // set cookies
            const cookiesObject = await page.cookies();
            var cookie = getCookie(cookiesObject);
            var param_update = {
                product_id: data.product_id,
                cookie: cookie,
                product_name: product_name,
                product_img: main_url + product_img,
                quantity: quantity_value.trim(),
                price_item: product_price_item,
                price_total: price_total_value,
            };
            console.log("start insert index 2");
            puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2, status: 2}, {
                $set: {
                    status: 1,
                    url: cart_url,
                    param: param_update,
                    updated_at: new Date()
                }
            }, {upsert: false, multi: false}, function (err, result) {
                if (err) throw err;
                console.log("end insert index 2");
            });
        } catch (e) {
            console.log('puppeteerLandingPage exception', e);
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

function puppeteerShoppingNomember(body, cookie, data, res) {
    console.log("start puppeteerShoppingNomember", data);
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
            var rtype = request.resourceType();
            if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype == "script") {
                request.abort();
            } else {
                console.log(rtype);
                if(rtype == "document"){
                    if(request.url().indexOf("surusuru") !== -1){
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
                //const page = await browser.newPage();
                const shopping_nonmember_url = 'https://www.surusuru.jp/shopping/nonmember';
                cookie.url = shopping_nonmember_url;
                await page.setCookie(cookie);
                await page.goto(shopping_nonmember_url, {waitUntil: 'load'});
                //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_profile_111111_' + Date.now() + '.png', fullPage: true});
                //nonmember_name_name
                await page.focus('form > #detail_box__body > #detail_box__name > dd.input_name > #nonmember_name_name01');
                await page.keyboard.type(data.last_name);
                await page.focus('form > #detail_box__body > #detail_box__name > dd.input_name > #nonmember_name_name02');
                await page.keyboard.type(data.first_name);

                //nonmember_kana_kana
                await page.focus('form > #detail_box__body > #detail_box__kana > dd.input_name > #nonmember_kana_kana01');
                await page.keyboard.type(data.furigana_last);
                await page.focus('form > #detail_box__body > #detail_box__kana > dd.input_name > #nonmember_kana_kana02');
                await page.keyboard.type(data.furigana_first);

                //zip
                await page.focus('form > #detail_box__body > #detail_box__address > dd > #detail_box__zip > #zip01');
                await page.keyboard.type(data.zipcode1);
                await page.focus('form > #detail_box__body > #detail_box__address > dd > #detail_box__zip > #zip02');
                await page.keyboard.type(data.zipcode2);

                //pref
                await page.focus('form > #detail_box__body > #detail_box__address > dd > div:nth-child(2) > div.input_zip > #pref');
                const selector_option = "form > #detail_box__body > #detail_box__address > dd > div:nth-child(2) > div.input_zip > #pref > option";
                const selector_id = "form > #detail_box__body > #detail_box__address > dd > div:nth-child(2) > div.input_zip > #pref";
                const options = await page.$$(selector_option);
                for (const option of options) {
                    const item_text = await page.evaluate(el => el.innerText, option);
                    const item_val = await page.evaluate(el => el.value, option);
                    if (data.pref == item_text) {
                        await page.select(selector_id, item_val);
                    }
                }

                //address
                await page.focus('form > #detail_box__body > #detail_box__address > dd > div:nth-child(2) > div:nth-child(2) > #addr01');
                await page.keyboard.type(data.address01);
                await page.focus('form > #detail_box__body > #detail_box__address > dd > div:nth-child(2) > div:nth-child(3) > #addr02');
                await page.keyboard.type(data.address02);

                //tel
                await page.focus('form > #detail_box__body > #detail_box__tel > dd > div.input_tel > #nonmember_tel_tel01');
                await page.keyboard.type(data.phone1);
                await page.focus('form > #detail_box__body > #detail_box__tel > dd > div.input_tel > #nonmember_tel_tel02');
                await page.keyboard.type(data.phone2);
                await page.focus('form > #detail_box__body > #detail_box__tel > dd > div.input_tel > #nonmember_tel_tel03');
                await page.keyboard.type(data.phone3);

                //email
                await page.focus('form > #detail_box__body > #detail_box__email > dd > div:nth-child(1) > #nonmember_email_first');
                await page.keyboard.type(data.mail);
                await page.focus('form > #detail_box__body > #detail_box__email > dd > div:nth-child(2) > #nonmember_email_second');
                await page.keyboard.type(data.mail);
                //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_profile_' + Date.now() + '.png', fullPage: true});

                await Promise.all([
                    page.click('form > #detail_box__footer > #detail_box__button_menu >#detail_box__next_button > button'),
                    page.waitForNavigation()
                ]);
                const shopping_confirm_url = await page.evaluate('location.href');
                if(shopping_confirm_url != shopping_nonmember_url) {
                    console.log("input guest success");
                    //update puppeteer data
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_3, status: 2}, {
                        $set: {
                            status: 1,
                            url: shopping_confirm_url,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });
                    //new
                    await browser.close();
                    surusuruShopping(body, data, res);
                    return;
                    // res.status(200).json(response);
                } else {
                    console.log("error validate form");
                    var error_message = "error validate form";
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_3, status: 2}, {
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
                console.log("shopping_confirm_url", shopping_confirm_url);
            } else {
                console.log("Session expired.");
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_3, status: 2}, {
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
            console.log('puppeteerShoppingNomember exception', e);
            var exception_index_3 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                status: 3,
                error_message: e,
                index: 3,
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

function puppeteerRegister(body, cookie, data, res) {
    console.log("start puppeteerRegister", data);
    var response = {};
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
                    if(request.url().indexOf("surusuru") !== -1){
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
                if(data.mail == data.register_email && data.register_flg){
                    await browser.close();
                    surusuruShopping(body, data, res);
                    return;
                }
                //const page = await browser.newPage();
                const entry_url = 'https://www.surusuru.jp/entry';
                cookie.url = entry_url;
                await page.setCookie(cookie);
                await page.goto(entry_url, {waitUntil: 'load'});
                await page.waitForSelector('#contents > div.wrap > #main_middle > .page-heading');
                const page_header = await page.$eval('#contents > div.wrap > #main_middle > .page-heading', el => el.innerText);
                //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_regiter_111_' + Date.now() + '.png', fullPage: true});
                //nonmember_name_name
                await page.focus('form > #top_box__body_inner > #top_box__name > dd.input_name > #entry_name_name01');
                await page.keyboard.type(data.last_name);
                await page.focus('form > #top_box__body_inner > #top_box__name > dd.input_name > #entry_name_name02');
                await page.keyboard.type(data.first_name);

                //nonmember_kana_kana
                await page.focus('form > #top_box__body_inner > #top_box__kana > dd.input_name > #entry_kana_kana01');
                await page.keyboard.type(data.furigana_last);
                await page.focus('form > #top_box__body_inner > #top_box__kana > dd.input_name > #entry_kana_kana02');
                await page.keyboard.type(data.furigana_first);

                //zip
                await page.focus('form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__zip > #zip01');
                await page.keyboard.type(data.zipcode1);
                await page.focus('form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__zip > #zip02');
                await page.keyboard.type(data.zipcode2);

                //pef
                await page.focus('form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__address > div.input_zip > #pref');
                const pef_option = "form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__address > div.input_zip > #pref > option";
                const pef_id = "form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__address > div.input_zip > #pref";
                const pefs = await page.$$(pef_option);
                for (const pef of pefs) {
                    const pef_text = await page.evaluate(el => el.innerText, pef);
                    const pef_val = await page.evaluate(el => el.value, pef);
                    if (data.pref == pef_text) {
                        await page.select(pef_id, pef_val);
                    }
                }

                //address
                await page.focus('form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__address > div:nth-child(2) > #addr01');
                await page.keyboard.type(data.address01);
                await page.focus('form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__address > div:nth-child(3) > #addr02');
                await page.keyboard.type(data.address02);

                //tel
                await page.focus('form > #top_box__body_inner > #top_box__tel > dd > div.input_tel > #entry_tel_tel01');
                await page.keyboard.type(data.phone1);
                await page.focus('form > #top_box__body_inner > #top_box__tel > dd > div.input_tel > #entry_tel_tel02');
                await page.keyboard.type(data.phone2);
                await page.focus('form > #top_box__body_inner > #top_box__tel > dd > div.input_tel > #entry_tel_tel03');
                await page.keyboard.type(data.phone3);

                //fax
                await page.focus('form > #top_box__body_inner > #top_box__fax > dd > div.input_tel > #entry_fax_fax01');
                await page.keyboard.type(data.fax1);
                await page.focus('form > #top_box__body_inner > #top_box__fax > dd > div.input_tel > #entry_fax_fax02');
                await page.keyboard.type(data.fax2);
                await page.focus('form > #top_box__body_inner > #top_box__fax > dd > div.input_tel > #entry_fax_fax03');
                await page.keyboard.type(data.fax3);

                //email
                await page.focus('form > #top_box__body_inner > #top_box__email > dd > div:nth-child(1) > #entry_email_first');
                await page.keyboard.type(data.mail);
                await page.focus('form > #top_box__body_inner > #top_box__email > dd > div:nth-child(2) > #entry_email_second');
                await page.keyboard.type(data.mail);

               //password
                await page.focus('form > #top_box__body_inner > #top_box__password > dd > div:nth-child(1) > #entry_password_first');
                await page.keyboard.type(data.password);
                await page.focus('form > #top_box__body_inner > #top_box__password > dd > div:nth-child(2) > #entry_password_second');
                await page.keyboard.type(data.password);

                //Year
                const year_id = "form > #top_box__birth > #detail_box__birth > dd > div.form-inline > #entry_incomplete_birth_incomplete_birth_year";
                await page.focus(year_id);
                await page.select(year_id, data.year.toString());

                //Month
                const month_id = "form > #top_box__birth > #detail_box__birth > dd > div.form-inline > #entry_incomplete_birth_incomplete_birth_month";
                await page.focus(month_id);
                await page.select(month_id, data.month.toString());

                //Day
                const day_id = "form > #top_box__birth > #detail_box__birth > dd > div.form-inline > #entry_incomplete_birth_incomplete_birth_day";
                await page.focus(day_id);
                await page.select(day_id, data.day.toString());

                if(data.gender == 1) {
                    await page.click('form > #top_box__birth > dl:nth-child(2) > dd > div.form-inline > #entry_sex > .radio > label > #entry_sex_1');
                } else {
                    await page.click('form > #top_box__birth > dl:nth-child(2) > dd > div.form-inline > #entry_sex > .radio > label > #entry_sex_2');
                }

                if(data.magazine == 1) {
                    await page.click('form > #top_box__birth > dl:nth-child(3) > dd > div.form-inline > #entry_mailmagazine_flg > .radio > label > #entry_mailmagazine_flg_0');
                } else {
                    await page.click('form > #top_box__birth > dl:nth-child(3) > dd > div.form-inline > #entry_mailmagazine_flg > .radio > label > #entry_mailmagazine_flg_1');
                }
                console.log("start click");
                await Promise.all([
                    page.click('form > #top_box__footer > #top_box__button_menu > p > button'),
                    page.waitForNavigation()
                ]);
                console.log("end click");
                //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_regiter_' + Date.now() + '.png', fullPage: true});
                await page.waitForSelector('#contents > div.wrap > #main_middle > .page-heading');
                var new_page_header = await page.$eval('#contents > div.wrap > #main_middle > .page-heading', el => el.innerText );
                if(page_header != new_page_header) {
                    console.log("click register confirm");
                    await Promise.all([
                        page.click('form > #confirm_box__footer > #confirm_box__button_menu > #confirm_box__insert_button > button'),
                        page.waitForNavigation()
                    ]);
                    console.log("end click register confirm");
                    const shopping_url = await page.evaluate('location.href');
                    if(shopping_url != entry_url) {
                        const cookiesObject = await page.cookies();
                        var new_cookie = getCookie(cookiesObject);

                        console.log("register success");
                        puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_3, status: 2}, {
                            $set: {
                                status: 1,
                                url: shopping_url,
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {
                            if (err) throw err;
                            /*update cookie*/
                            puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_2}, {
                                $set: {
                                    "param.cookie": new_cookie,
                                    updated_at: new Date()
                                }
                            }, {upsert: false}, function (err, result) {
                                if (err) throw err;
                            });
                            variable_value_arr.push(data.mail);
                            variable_value_arr.push('1');
                            /*return flash register success*/
                            for(var k = 0; k < variable_value_arr.length; k++){
                                updateMessageVariable(data.connect_page_id, data.user_id, register_info[k], variable_value_arr[k]);
                            }
                        });
                        //new
                        await browser.close();
                        surusuruShopping(body, data, res);
                        return;
                        // res.status(200).json(response);
                    }
                } else {
                    const password_err_elm = 'form > #top_box__body_inner > #top_box__password > dd > div > .errormsg';
                    // const err = '同じメールアドレスを入力してください。';
                    var err = 'エラーが発生しました。';
                    if (await page.$(password_err_elm) !== null){
                        err = await page.$eval(password_err_elm, el => el.innerText );
                    }
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_3, status: 2}, {
                        $set: {
                            status: 3,
                            url: entry_url,
                            error_message :err,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });

                    response.error_message = err;
                    res.status(500).json(response);
                }

            } else {
                console.log("Session expired.");
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_3, status: 2}, {
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
            console.log('puppeteerRegister exception', e);
            var exception_index_3 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                status: 3,
                error_message: e,
                index: 3,
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

function checkPreviousStep(body, data, res) {
    console.log('checkPreviousStep', data);
    var login_type = data.login_type;
    var intervalObject = setInterval(function () {
        puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 2, status: 1},function(err, result2) {
            if (result2) {
                clearInterval(intervalObject);
                var cookie = result2.param.cookie;
                data.object_id_index_2 =  result2._id;
                puppeteerRequest.findOne({_id: data.object_id_index_3},function(err, result3) {
                    if (result3) {
                        console.log('result3=======before', result3);
                        if(result3.status != 1){
                            console.log('update status index 3');
                            result3.status = 2;
                        }
                        result3.updated_at = new Date();
                        result3.save(function(err){
                            switch(login_type) {
                                case login_type_member :
                                    console.log('result3=======after', result3);
                                    if(typeof data.order_type_login != 'undefined' && data.order_type_login == 1){
                                        console.log('handle shopping type login');
                                        surusuruShopping(body, data, res);
                                    }else{
                                        console.log('handle login');
                                        puppeteerLogin(body, cookie, data, res);
                                    }
                                    break;
                                case login_type_register :
                                    puppeteerRegister(body, cookie, data, res);
                                    break;
                                case login_type_guest :
                                    puppeteerShoppingNomember(body, cookie, data, res);
                                    break;
                            }
                        });
                    }
                })
            }
        });
    }, 2000);
}

function payment(body, data, res) {
    console.log("start payment step");
    /*puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 2, status: 1},function(err, result2) {
        if (result2) {
            var cookie = result2.param.cookie;
            puppeteerRequest.findOne({_id: data.object_id_index_5, status: 0},function(err, result5) {
                if (result5) {
                    console.log("payment step 5");
                    result5.status = 2;
                    result5.updated_at = new Date();
                    result5.save(function(err){
                        puppeteerPayment(body, cookie, data, res);
                    });
                } else {
                    var response = {};
                    response.error_message =  "※ 決済でエラーが発生しました.";
                    res.status(500).json(response);
                }
            });
        }else{
            var response = {};
            response.error_message =  "※ 決済でエラーが発生しました.";
            res.status(500).json(response);
        }
    });*/

    var intervalObject = setInterval(function () {
       puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 1, status: 1},function(err, result1) {
           if (result1) {
               console.log("payment step 1");
               puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 2, status: 1},function(err, result2) {
                   if (result2) {
                       console.log("payment step 2");
                       var cookie = result2.param.cookie;
                       puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 3, status: 1},function(err, result3) {
                           if (result3) {
                               console.log("payment step 3");
                               puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 4, status: 1},function(err, result4) {
                                   if (result4) {
                                       console.log("payment step 4");
                                       puppeteerRequest.findOne({_id: data.object_id_index_5, status: 0},function(err, result5) {
                                           if (result5) {
                                               console.log("payment step 5");
                                               result5.status = 2;
                                               result5.updated_at = new Date();
                                               result5.save(function(err){
                                                   clearInterval(intervalObject);
                                                   puppeteerPayment(body, cookie, data, res);
                                               });
                                           } else {
                                               console.log("result5 not exist");
                                               clearInterval(intervalObject);
                                           }
                                       })
                                   }
                               })
                           }
                       })
                   }
               });
           }
       });
    }, 2000);
}

function puppeteerPayment(body, cookie, data, res) {
    console.time("time_payment");
    console.log("call puppeteerPayment");
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
            if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || request.url().indexOf("p01.mul-pay.jp/ext/js/token.js") != -1) {
                request.abort();
            } else {
                //console.log(rtype);
                if(rtype == "script"){
                    if(request.url().indexOf("surusuru") !== -1){
                        console.log(request.url());
                        request.continue();
                    }else{
                        request.abort();
                    }
                }
                else if(rtype == "document"){
                    if(request.url().indexOf("surusuru") !== -1){
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
            if (typeof cookie != 'undefined' && cookie.name == 'eccube' && cookie.value != '') {
                //const page = await browser.newPage();
                const gmo_payment_url = 'https://www.surusuru.jp/shopping/gmo_payment';
                cookie.url = gmo_payment_url;
                await page.setCookie(cookie);
                await page.goto(gmo_payment_url, {waitUntil: 'load'});
                //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_payment_' + Date.now() + '.png', fullPage: true});
                // console.log('data.card_select=====', data.card_select);
                if(body.login_type == login_type_member && typeof data.card_select != "undefined" && data.card_select != "new"){
                    console.log('start select card');
                    const list_card = 'div.gmo-container > div.gmo-payment-inner:nth-child(2) > form#formRegist >';
                    await page.click(list_card + ' div:nth-child(4) > table > tbody > tr > td > input[value="'+data.card_select+'"]');
                    console.log('end select card');
                    // await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_payment_card_select_type' + Date.now() + '.png', fullPage: true});
                    console.log("start click payment - type select");
                    //ignore payment
                    // await page.pdf({path: 'screen_short/payment_select_card'+ Date.now() +'.pdf', format: 'A4', printBackground: true});
                    // response.error_message = 'TEST FILL DATA';
                    // return res.status(500).json(response);
                    //end
                    await Promise.all([
                        page.click(list_card + ' div:nth-child(5) > div:nth-child(2) > p > button#btnNext2'),
                        page.waitForNavigation()
                    ]);
                    console.log("end click payment - type select");
                }else{
                    if (typeof data.card_token != "undefined" && data.card_token != "") {
                        console.log("start click payment - type new card");
                        var card_token = data.card_token;
                        console.log('card_token', card_token);
                       /* await page.evaluate(() => {
                            window.efo_execute_purchase = function (token) {
                                console.log('start efo_execute_purchase');
                                document.getElementById("gmo_payment_card_no").value = '';
                                document.getElementById("gmo_payment_expire_year").value = '';
                                document.getElementById("gmo_payment_expire_month").value = '';
                                var securityCode = document.getElementById("gmo_payment_security_code");
                                if (securityCode != null) {
                                    document.getElementById("gmo_payment_security_code").value = '';
                                }
                                document.getElementById("token").value = token;
                                document.getElementById("method").value = '';
                                document.getElementById("card_name1").value = '';
                                document.getElementById("card_name2").value = '';
                                document.getElementById("register_card").value = '0';
                                var greg_card = document.getElementById("gmo_payment_register_card");
                                if (greg_card != null && greg_card.checked) {
                                    document.getElementById("register_card").value = '1';
                                }
                                var elements = document.getElementsByName("register_card");
                                if (elements.length > 1) {
                                    document.getElementById("register_card").value = '1';
                                }
                                console.log('end efo_execute_purchase');
                                document.getElementById("mode").value = 'next';
                                document.getElementById("purchaseForm").submit();
                            };
                        });
                        await page.evaluate((card_token) => {
                            console.log('call efo_execute_purchase', card_token);
                            efo_execute_purchase(card_token);
                        }, card_token);*/
                        // await page.waitFor(3500);
                        var register_card_flg = '1';
                        if(data.login_type == login_type_guest){
                            register_card_flg = '0';
                        }
                        const card_name = splitName(data.card_name);
                        const token_elm = '#purchaseForm > p > #token';
                        await page.evaluate((token_elm, card_token) => {
                            document.querySelector(token_elm).value = card_token
                        }, token_elm, card_token);

                        await page.evaluate((register_card_flg) => {
                            // document.querySelector('#purchaseForm > p > #register_card').value = '1'
                            document.querySelector('#purchaseForm > p > #register_card').value = register_card_flg
                        }, register_card_flg);
                        await page.evaluate(() => {
                            document.querySelector('#purchaseForm > p > #mode').value = 'next'
                        });
                        await page.evaluate(() => {
                            document.querySelector('#purchaseForm > p > #method').value = '1-0'
                        });
                        await page.evaluate((card_name) => {
                            document.querySelector('#purchaseForm > p > #card_name1').value = card_name.last_name
                        }, card_name);
                        await page.evaluate((card_name) => {
                            document.querySelector('#purchaseForm > p > #card_name2').value = card_name.first_name
                        }, card_name);

                        const tmp_token = await page.$eval(token_elm, el => el.value );
                        console.log("tmp_token", tmp_token);

                        // await page.waitFor(2000);
                        await page.$eval('#purchaseForm', form => form.submit());
                        // await page.waitForNavigation();
                        const header_thanks_page_elm = "#contents > div.wrap > #main_middle > h1.page-heading";
                        // await page.waitForSelector(header_thanks_page_elm);
                        await page.waitForSelector(header_thanks_page_elm,  {waitUntil: 'load', timeout: 10000}).then(() => {
                            console.log('redirect thanks page success');
                            console.log(page.url());
                        }).catch(e => {
                            console.log('redirect thanks page fail', e);
                        });
                        // const current_page_header = await page.$eval(header_thanks_page_elm, el => el.innerText );

                        //ignore payment
                        // await page.pdf({path: 'screen_short/payment_fill_token'+ Date.now() +'.pdf', format: 'A4', printBackground: true});
                        // response.error_message = 'TEST FILL DATA';
                        // return res.status(500).json(response);
                        //end
                        console.log("end click payment - type new card");
                    }
                }
                const thank_url = await page.evaluate('location.href');
                // await page.pdf({path: 'screen_short/payment_fill_token'+ Date.now() +'.pdf', format: 'A4', printBackground: true});
                console.log("thank_url", thank_url);
                if (gmo_payment_url != thank_url) {
                    // const html = await page.content();
                    // console.log(html);
                    console.log('start get ebis variable');
                    const ebis = await page.evaluate(() => {
                        return window.ebis;
                    });
                    console.log('ebis===', ebis);
                    if(typeof ebis != 'undefined' && typeof ebis[0] != 'undefined'){
                        const ebis_value = ebis[0];
                        // const pref = splitOther5(ebis_value.other5).pref;
                        const pref = data.pref;

                        const qu_p1 = data.order_sub_total;
                        const qu_p2 = ebis_value.other1;
                        const qu_p3 = data.order_quantity;
                        const qu_p4 = getParam('p', data.current_url);
                        // const qu_p5 = splitOther5(ebis_value.other5).sex;
                        const qu_p5 = data.gender;
                        const qu_p6 = (typeof pref_code_list[pref] != 'undefined') ? pref_code_list[pref] : '';
                        const qu_order_type = (ebis_value.other4 == '定期') ? '1' : '2';
                        const qu_order_id = ebis_value.member_name;

                        const url = thank_url + '?qualva_cv=bo&qu_order_id=' + qu_order_id + '&qu_order_type=' + qu_order_type + '&qu_p1=' + qu_p1 + '&qu_p2=' + qu_p2 + '&qu_p3=' + qu_p3 + '&qu_p4=' + qu_p4 + '&qu_p5=' + qu_p5 + '&qu_p6=' + qu_p6;
                        response.thank_url = url;
                        console.log('url===', url);
                    }
                    console.log('end get ebis variable');
                    console.log("payment success");
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_5, status: 2}, {
                        $set: {
                            status: 1,
                            url: thank_url,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });
                    response.order_status = 1;
                    res.status(200).json(response);
                } else {
                    console.log("payment error");
                    var error_message = "※ 決済でエラーが発生しました. </br> このカードでは取引をする事が出来ません。 (G97-42G970000)";
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_5, status: 2}, {
                        $set: {
                            status: 3,
                            url: gmo_payment_url,
                            error_message: error_message,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });
                    response.error_message =  error_message;
                    res.status(500).json(response);
                }
                /*if (typeof data.card_token != "undefined" && data.card_token != "") {
                    var card_token = data.card_token;
                    await page.evaluate(() => {
                        window.efo_execute_purchase = function (token) {
                            // alert("gmo_payment_method");
                            // alert(document.getElementById("gmo_payment_method").value);
                            document.getElementById("gmo_payment_card_no").value = '';
                            document.getElementById("gmo_payment_expire_year").value = '';
                            document.getElementById("gmo_payment_expire_month").value = '';
                            var securityCode = document.getElementById("gmo_payment_security_code");
                            if (securityCode != null) {
                                document.getElementById("gmo_payment_security_code").value = '';
                            }
                            document.getElementById("token").value = token;
                            document.getElementById("method").value = '';
                            document.getElementById("card_name1").value = '';
                            document.getElementById("card_name2").value = '';
                            document.getElementById("register_card").value = '0';
                            var greg_card = document.getElementById("gmo_payment_register_card");
                            if (greg_card != null && greg_card.checked) {
                                document.getElementById("register_card").value = '1';
                            }
                            var elements = document.getElementsByName("register_card");
                            if (elements.length > 1) {
                                document.getElementById("register_card").value = '1';
                            }
                            document.getElementById("mode").value = 'next';
                            document.getElementById("purchaseForm").submit();
                        };
                    });
                    // await page.on('dialog', async dialog => {
                    //     console.log(dialog.message());
                    // });

                    await page.evaluate((card_token) => {
                        efo_execute_purchase(card_token)
                    }, card_token);
                    await page.waitForNavigation();
                    //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_thank_' + Date.now() + '.png', fullPage: true});
                    const thank_url = await page.evaluate('location.href');
                    console.log("thank_url", thank_url);
                    if (gmo_payment_url != thank_url) {
                        console.log("payment success");
                        puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_5, status: 2}, {
                            $set: {
                                status: 1,
                                url: thank_url,
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {
                            if (err) throw err;
                        });
                        response.order_status = 1;
                        res.status(200).json(response);
                    } else {
                        console.log("payment error");
                        var error_message = "※ 決済でエラーが発生しました. </br> このカードでは取引をする事が出来ません。 (G97-42G970000)";
                        puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_5, status: 2}, {
                            $set: {
                                status: 3,
                                url: gmo_payment_url,
                                error_message: error_message,
                                updated_at: new Date()
                            }
                        }, {upsert: false, multi: false}, function (err, result) {
                            if (err) throw err;
                        });
                        response.error_message =  error_message;
                        res.status(500).json(response);
                    }
                }*/
            } else {
                console.log("cookie expire");
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_5, status: 2}, {
                    $set: {
                        status: 3,
                        error_message: "Cookie expire",
                        updated_at: new Date()
                    }
                }, {upsert: false, multi: false}, function (err, result) {
                    if (err) throw err;
                });
                response.error_message = "Session expire";
                res.status(500).json(response);
            }
        } catch (e) {
            console.log('puppeteerPayment exception', e);
            var exception_index_5 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                status: 3,
                error_message: e,
                index: 5,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception_index_5);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }
        await browser.close();
    })();
    console.timeEnd("time_payment");
}

function puppeteerLogin(body, cookie, data, res) {
    console.log("start run puppeteerLogin", data);
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
                    if(request.url().indexOf("surusuru") !== -1){
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
                const url_login = "https://www.surusuru.jp/mypage";
                //const page = await browser.newPage();
                cookie.url = url_login;
                await page.setCookie(cookie);
                await page.goto(url_login, {waitUntil: 'networkidle0'});
                //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_login_111_' + Date.now() + '.png', fullPage: true});
                const header_element = "#contents > div.wrap > #main_middle > h1.page-heading";
                await page.waitForSelector(header_element);
                const curren_login_header = await page.$eval(header_element, el => el.innerText );
                console.log("curren_login_header", curren_login_header);
                if(curren_login_header == header_login_success) {
                    console.log("===logged===");
                    puppeteerRequest.findOneAndUpdate({_id:data.object_id_index_3}, {
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
                    const email_element = 'form > #login_box > #mypage_login_wrap > #mypage_login_box > #mypage_login_box__body > #mypage_login_box__login_email > #login_email';
                    const password_element = 'form > #login_box > #mypage_login_wrap > #mypage_login_box > #mypage_login_box__body > #mypage_login_box__login_pass > #login_pass';
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
                    await Promise.all([
                        page.click('form > #login_box > #mypage_login_wrap > #mypage_login_box > #mypage_login_box__body > #mypage_login__login_button > p > button'),
                        page.waitForNavigation()
                    ]);
                    //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_login_' + Date.now() + '.png', fullPage: true});
                    const new_login_header = await page.$eval(header_element, el => el.innerText );
                    console.log("new_login_header", new_login_header);
                    if (new_login_header == header_login_success) {
                        const cookiesObject = await page.cookies();
                        var cookie_new = getCookie(cookiesObject);
                        var param_update = {};
                        puppeteerRequest.findOne({cpid: data.connect_page_id, user_id: data.user_id, index: 2, status: 1}, function (err, result) {
                            param_update.quantity = result.param.quantity;
                            param_update.price_total = result.param.price_total;
                            param_update.cookie = cookie_new;
                            result.param = param_update;
                            result.error_message = "";
                            result.updated_at = new Date();
                            result.save(function (err) {
                                puppeteerRequest.findOneAndUpdate({_id:data.object_id_index_3}, {
                                    $set: {
                                        status: 1,
                                        updated_at: new Date()
                                    }
                                }, {upsert: false}, function (err, result) {
                                    if (err) throw err;
                                });
                            });
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
                        var error_message = "ログインできませんでした。</br>入力内容に誤りがないかご確認ください。";
                        puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_3, status: 2}, {
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
            } else {
                console.log("cookie not exist");
                var error_message = "cookie not exist";
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_3, status: 2}, {
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
            console.log("puppeteerLogin exception", e);
            var exception_index_3 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                status: 3,
                error_message: e,
                index: 3,
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

function puppeteerShoppingBak(body, cookie, data, res) {
    console.log("start puppeteerShopping function=", data);
    var response = {};
    var login_type = data.login_type;
    var payment_flg = parseInt(data.payment_flg);
    var g_customer_point_use = '';
    var g_customer_point_add = '';

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
            if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image') {
                request.abort();
            } else {
                //console.log(rtype);
                if(rtype == "script"){
                    if(request.url().indexOf("surusuru") !== -1){
                        console.log(request.url());
                        request.continue();
                    }else{
                        request.abort();
                    }
                }
                else if(rtype == "document"){
                    if(request.url().indexOf("surusuru") !== -1){
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
            if (typeof cookie != 'undefined' && cookie.name == 'eccube' && cookie.value != '') {
                const shopping_url = "https://www.surusuru.jp/shopping";
                //const page = await browser.newPage();
                cookie.url = shopping_url;
                await page.setCookie(cookie);
                await page.goto(shopping_url, {waitUntil: 'networkidle0'});
                //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_start_shopping_' + Date.now() + '.png', fullPage: true});
                //get user infomation
                const customer_name01_element = "#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-name01";
                const customer_name02_element = "#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-name02";
                const customer_name01 = await page.$eval(customer_name01_element, el => el.innerText );
                const customer_name02 = await page.$eval(customer_name02_element, el => el.innerText );
                const user_name = customer_name01 + customer_name02;
                console.log("user_name", user_name);
                const zip01 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-zip01', el => el.innerText );
                const zip02 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-zip02', el => el.innerText );
                const pref = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-pref', el => el.innerText );
                const addr01 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-addr01', el => el.innerText );
                const addr02 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-addr02', el => el.innerText );
                const user_address = "〒" + zip01 + "-" + zip02 + pref + addr01 + addr02;
                console.log("user_address", user_address);
                const tel01 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-tel01', el => el.innerText );
                const tel02 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-tel02', el => el.innerText );
                const tel03 = await page.$eval('#shopping-form > #shopping_confirm > #confirm_main > #customer_detail_box > #customer_detail_box__customer_address > .customer-tel03', el => el.innerText );
                const user_tel = tel01 + "-" + tel02 + "-" + tel03;
                console.log("user_tel", user_tel);
                const delivery_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_confirm_box--0 > #shipping_delivery_block > #shopping_confirm_box__shipping_delivery--0 > #shopping_shippings_0_delivery';
                const delivery_date_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_confirm_box--0 > #shipping_delivery_block > #shopping_confirm_box__shipping_delivery_date_time--0 > #shopping_shippings_0_shippingDeliveryDate';
                const delivery_time_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_confirm_box--0 > #shipping_delivery_block > #shopping_confirm_box__shipping_delivery_date_time--0 > #shopping_shippings_0_deliveryTime';
                if(data.shipping_method == mail_service) {
                    console.log("start method mail service");
                    const option_1_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_confirm_box--0 > #shipping_delivery_block > #shopping_confirm_box__shipping_delivery--0 > #shopping_shippings_0_delivery > option[value="'+ option_value_1 +'"]';
                    await page.waitForSelector(option_1_element);
                    const shipping_method_option_1 = await page.$(option_1_element);
                    var shipping_method_option_1_selected = await (await shipping_method_option_1.getProperty('selected')).jsonValue();
                    console.log("====shipping_method_option_1_selected====", shipping_method_option_1_selected);
                    if(shipping_method_option_1_selected != true) {
                        await Promise.all([
                            page.select(delivery_element, option_value_1),
                            page.waitForNavigation()
                        ]);
                    }
                    if(data.delivery_date != '') {
                        await page.select(delivery_date_element, data.delivery_date);
                    }
                } else {
                    console.log("method home delivery");
                    const option_3_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_confirm_box--0 > #shipping_delivery_block > #shopping_confirm_box__shipping_delivery--0 > #shopping_shippings_0_delivery > option[value="'+ option_value_3 +'"]';
                    await page.waitForSelector(option_3_element);
                    const shipping_method_option_3 = await page.$(option_3_element);
                    var shipping_method_option_3_selected = await (await shipping_method_option_3.getProperty('selected')).jsonValue();
                    console.log("====shipping_method_option_3_selected====", shipping_method_option_3_selected);
                    if(shipping_method_option_3_selected != true) {
                        await Promise.all([
                            page.select(delivery_element, option_value_3),
                            page.waitForNavigation()
                        ]);
                    }

                    if(data.delivery_date != '') {
                        await page.select(delivery_date_element, data.delivery_date);
                    }
                    if(data.delivery_time != '') {
                        await page.select(delivery_time_element, data.delivery_time);
                    }
                    console.log("end select date time");
                    if(data.payment_method == cash_delivery) {
                        console.log("start click pyament home");
                        if(!payment_flg){
                            console.log("payment");
                            console.log("check click  cash_delivery", data.payment_method);
                            const radio_element1 = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_payment_block > #payment_list > #payment_list__body > #payment_list__list > li:nth-child(2) > div.radio > label > #shopping_payment_4';
                            await page.waitForSelector(radio_element1);
                            const radio_credit_card1 = await page.$(radio_element1);
                            var radio_is_checked1 = await (await radio_credit_card1.getProperty('checked')).jsonValue();
                            console.log("radio_is_checked1 代金=", radio_is_checked1);
                            if(!radio_is_checked1) {
                                console.log("start click  cash_delivery", data.payment_method);
                                await Promise.all([
                                    page.click(radio_element1),
                                    page.waitForNavigation()
                                ]);
                            }else{
                                console.log("noneed click 代金 cash_delivery", data.payment_method);
                            }
                            //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_shopping_111_' + Date.now() + '.png', fullPage: true});
                        }
                    } else {
                        console.log('=============click credit card==========');
                        if(!payment_flg) {
                            const radio_element = '#shopping-form > #shopping_confirm > #confirm_main > #shipping_payment_block > #payment_list > #payment_list__body > #payment_list__list > li:nth-child(3) > div.radio > label > #shopping_payment_35';
                            await page.waitForSelector(radio_element);
                            const radio_credit_card = await page.$(radio_element);
                            var radio_is_checked = await (await radio_credit_card.getProperty('checked')).jsonValue();
                            if(!radio_is_checked) {
                                console.log("click radio payment method credit_card");
                                await Promise.all([
                                    page.click(radio_element),
                                    page.waitForNavigation()
                                ]);
                                //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_shopping_222_' + Date.now() + '.png', fullPage: true});
                            } else {
                                console.log("no need click radio payment");
                            }
                        }
                    }
                }
                //await page.screenshot({path: 'pictures/' + data.connect_page_id + '_' + data.user_id + '_shopping_' + Date.now() + '.png', fullPage: true});
                const subtotal = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__subtotal > dd.text-primary', el => el.innerText );
                const charge_price = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__quantity_price > dd > #charge_price', el => el.innerText );
                const shipping_price = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__shipping_price > dd', el => el.innerText );

                var param_update1 = {
                    subtotal: subtotal,
                    shipping_price: shipping_price,
                    charge_price: charge_price,
                    total: '',
                    user_name: user_name,
                    user_address: user_address,
                    user_tel: user_tel
                };

                if(login_type != login_type_guest) {
                    const customer_point_use = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__result > #summary_box__customer_point_use > dd.text-primary', el => el.innerText );
                    const customer_point_add = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__result > #summary_box__customer_point_add > dd', el => el.innerText );
                    param_update1.customer_point_use = customer_point_use;
                    param_update1.customer_point_add = customer_point_add;
                }
                const total = await page.$eval('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__result > #summary_box__total_amount > strong.text-primary > #text_total', el => el.innerText );
                param_update1.total = total;

                if(payment_flg){
                    console.log("start click submit");
                    await Promise.all([
                        page.click('#shopping-form > #shopping_confirm > #aside_column > #confirm_side > #summary_box__total_box > #summary_box__result > #summary_box__confirm_button > #order-button'),
                        page.waitForNavigation()
                    ]);
                }else{
                    console.log("not payment payment_flg=", payment_flg);
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_4, status: 2}, {
                        $set: {
                            status: 1,
                            param: param_update1,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });

                    const cookiesObject = await page.cookies();
                    var cookie_new = getCookie(cookiesObject);

                    puppeteerRequest.findOne({cpid: data.connect_page_id, user_id: data.user_id, index: 2, status: 1}, function (err, result) {
                        var tmp_param = result.param;
                        tmp_param.cookie = cookie_new;
                        result.param = tmp_param;
                        result.updated_at = new Date();
                        result.save(function (err) {});
                    });

                    response.subtotal = subtotal;
                    response.charge_price = charge_price;
                    response.shipping_price = shipping_price;
                    response.customer_point_use = g_customer_point_use;
                    response.customer_point_add = g_customer_point_add;
                    response.total = total;
                    response.user_name = user_name;
                    response.user_address = user_address;
                    response.user_tel = user_tel;
                    console.log("bild confirm",response);
                    res.status(200).json(response);
                    return;
                }

                const new_shopping_url = await page.evaluate('location.href');
                const payment_url = "https://www.surusuru.jp/shopping/gmo_payment";
                const thank_url = "https://www.surusuru.jp/shopping/complete";
                console.log("check new_shopping_url", new_shopping_url);
                if(new_shopping_url == thank_url) {
                    console.log("shopping complete");
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_4, status: 2}, {
                        $set: {
                            status: 1,
                            url: thank_url,
                            param: param_update1,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });

                    response.subtotal = subtotal;
                    response.charge_price = charge_price;
                    response.shipping_price = shipping_price;
                    response.customer_point_use = g_customer_point_use;
                    response.customer_point_add = g_customer_point_add;
                    response.total = total;
                    response.user_name = user_name;
                    response.user_address = user_address;
                    response.user_tel = user_tel;
                    res.status(200).json(response);
                } else if(new_shopping_url == payment_url) {
                    console.log("start payment");
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_4, status: 2}, {
                        $set: {
                            status: 1,
                            url: payment_url,
                            param: param_update1,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });

                    response.subtotal = subtotal;
                    response.charge_price = charge_price;
                    response.shipping_price = shipping_price;
                    response.customer_point_use = g_customer_point_use;
                    response.customer_point_add = g_customer_point_add;
                    response.total = total;
                    response.user_name = user_name;
                    response.user_address = user_address;
                    response.user_tel = user_tel;
                    res.status(200).json(response);
                }else {
                    console.log("shopping error");
                    var error_message = "エラーが発生しました。再度ご試しください。";
                    puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_4, status: 2}, {
                        $set: {
                            status: 3,
                            error_message: error_message,
                            url: shopping_url,
                            updated_at: new Date()
                        }
                    }, {upsert: false, multi: false}, function (err, result) {
                        if (err) throw err;
                    });
                    response.error_message = error_message;
                    res.status(500).json(response);
                }

            } else {
                console.log("cookie not exist");
                var error_msg = "cookie not exist";
                puppeteerRequest.findOneAndUpdate({_id: data.object_id_index_4, status: 2}, {
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
            console.log("puppeteerShopping exception");
            var exception_index_4 = {
                cpid: data.connect_page_id,
                user_id: data.user_id,
                status: 3,
                error_message: e,
                index: 4,
                request_body: body,
                param: data
            };
            savePuppeteerException(exception_index_4);
            response.error_message = "エラーが発生しました。再度ご試しください。";
            res.status(500).json(response);
        }

        await browser.close();
    })()
}

function checkPreviousShopping(body, data, res) {
    var intervalObject = setInterval(function () {
        puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 2, status: 1},function(err, result2) {
            if (result2) {
                var cookie = result2.param.cookie;
                puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 3, status: 1},function(err, result3) {
                    console.log('checkPreviousShopping=======result3', result3);
                    if (result3) {
                        puppeteerRequest.findOne({_id: data.object_id_index_4, status: 0},function(err, result4) {
                            if (result4) {
                                result4.status = 2;
                                result4.updated_at = new Date();
                                result4.save(function(err){
                                    clearInterval(intervalObject);
                                    console.log('checkPreviousShopping');
                                    puppeteerShopping(body, cookie, data, res);
                                });
                            }
                        })
                    }
                })
            }
        });
    }, 2000);
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
            if (rtype === "xhr" || rtype === "font" || rtype === 'stylesheet' || rtype === 'image' || rtype == "script") {
                request.abort();
            } else {
                console.log(rtype);
                if(rtype == "document"){
                    if(request.url().indexOf("surusuru") !== -1){
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
            await page.waitForSelector('#contents > div.wrap > #main_middle > .page-heading');
            const nonmember_name_1 = 'form > #top_box__body_inner > #top_box__name > dd.input_name > #entry_name_name01';
            const nonmember_name_2 = 'form > #top_box__body_inner > #top_box__name > dd.input_name > #entry_name_name02';
            const entry_kana_kana01 = 'form > #top_box__body_inner > #top_box__kana > dd.input_name > #entry_kana_kana01';
            const entry_kana_kana02 = 'form > #top_box__body_inner > #top_box__kana > dd.input_name > #entry_kana_kana02';
            const zip01 = 'form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__zip > #zip01';
            const zip02 = 'form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__zip > #zip02';
            const pref = 'form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__address > div.input_zip > #pref';
            const addr01 = 'form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__address > div:nth-child(2) > #addr01';
            const addr02 = 'form > #top_box__body_inner > #top_box__address_detail > dd > #top_box__address > div:nth-child(3) > #addr02';
            const entry_tel_tel01 = 'form > #top_box__body_inner > #top_box__tel > dd > div.input_tel > #entry_tel_tel01';
            const entry_tel_tel02 = 'form > #top_box__body_inner > #top_box__tel > dd > div.input_tel > #entry_tel_tel02';
            const entry_tel_tel03 = 'form > #top_box__body_inner > #top_box__tel > dd > div.input_tel > #entry_tel_tel03';
            const entry_password_first = 'form > #top_box__body_inner > #top_box__password > dd > div:nth-child(1) > #entry_password_first';
            const entry_password_second = 'form > #top_box__body_inner > #top_box__password > dd > div:nth-child(2) > #entry_password_second';
            const entry_email_first = 'form > #top_box__body_inner > #top_box__email > dd > div:nth-child(1) > #entry_email_first';
            const entry_email_second = 'form > #top_box__body_inner > #top_box__email > dd > div:nth-child(2) > #entry_email_second';

            await page.evaluate((nonmember_name_1, nonmember_name_2, entry_kana_kana01, entry_kana_kana02, zip01, zip02, pref, addr01,
                                 addr02, entry_tel_tel01, entry_tel_tel02, entry_tel_tel03, entry_password_first, entry_password_second) => {
                document.querySelector(nonmember_name_1).removeAttribute('required');
                document.querySelector(nonmember_name_2).removeAttribute('required');
                document.querySelector(entry_kana_kana01).removeAttribute('required');
                document.querySelector(entry_kana_kana02).removeAttribute('required');
                document.querySelector(zip01).removeAttribute('required');
                document.querySelector(zip02).removeAttribute('required');
                document.querySelector(pref).removeAttribute('required');
                document.querySelector(addr01).removeAttribute('required');
                document.querySelector(addr02).removeAttribute('required');
                document.querySelector(entry_tel_tel01).removeAttribute('required');
                document.querySelector(entry_tel_tel02).removeAttribute('required');
                document.querySelector(entry_tel_tel03).removeAttribute('required');
                document.querySelector(entry_password_first).removeAttribute('required');
                document.querySelector(entry_password_second).removeAttribute('required');
            }, nonmember_name_1, nonmember_name_2, entry_kana_kana01, entry_kana_kana02, zip01, zip02, pref, addr01,
                addr02, entry_tel_tel01, entry_tel_tel02, entry_tel_tel03, entry_password_first, entry_password_second);

            //input mail
            await page.click(entry_email_first);
            await page.focus(entry_email_first);
            await page.evaluate((entry_email_first) => {
                document.querySelector(entry_email_first).value = ''
            }, entry_email_first);
            await page.keyboard.type(mail);

            await page.click(entry_email_second);
            await page.focus(entry_email_second);
            await page.evaluate((entry_email_second) => {
                document.querySelector(entry_email_second).value = ''
            }, entry_email_second);
            await page.keyboard.type(mail);

            // check validate
            const error_element = 'form > #top_box__body_inner > #top_box__email > dd > div:nth-child(2) > p.errormsg.text-danger';
            await Promise.all([
                page.click('form > #top_box__footer > #top_box__button_menu > p > button'),
                page.waitForNavigation()
            ]);
            console.log('ssss');
            if(await page.$(error_element) !== null){
                response.error_message = '既に登録されているメールアドレスです。';
                res.status(500).json(response);
            }else{
                console.log('success');
                res.status(200).json({});
            }
            // await page.click('form > #top_box__footer > #top_box__button_menu > p > button');
            // await page.waitForSelector(error_element).then(() => {
            //     response.error_message = '既に登録されているメールアドレスです。';
            //     res.status(500).json(response);
            // }).catch(e => {
            //     response.message = 'success';
            //     res.status(200).json(response);
            // });
        } catch (e) {
            console.log('ssss23333');
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
    var url_card = body.url_card;

    var data = {
        connect_page_id: connect_page_id,
        user_id: user_id,
        url_card: url_card
    };
    console.log('body', body);
    var response = {};

    var intervalObject = setInterval(function () {
        puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 2, status: 1},function(err, result2) {
            if (result2) {
                var cookie = result2.param.cookie;
                data.object_id = result2._id;
                puppeteerRequest.findOne({cpid : data.connect_page_id, user_id: data.user_id, index: 3, status: 1},function(err, result3) {
                    if (result3) {
                        clearInterval(intervalObject);
                        getListPaymentCard(body, cookie, data, res);
                    }
                })
            }
        });
    }, 500);
});

function getListPaymentCard(body, cookie, data, res) {
    console.log("start get_list_payment_card");
    var response = {"count" : 0, "data": []};
    res.status(200).json(response);

    response = {};
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
                if(request.url().indexOf("surusuru") !== -1){
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
            console.log('url_card', data.url_card);
            cookie.url = data.url_card;
            await page.setCookie(cookie);
            await page.goto(data.url_card, {waitUntil: 'load'});
            // await page.screenshot({path: 'pictures/login111' + Date.now() + '.png', fullPage: true});
            const header_element = '#contents > div.inner.wrap > #main_middle > .heading01';
            var continue_flg = false;
            await page.waitForSelector(header_element).then(() => {
                continue_flg = true;
            }).catch(e => {
                console.log('getListPaymentCard exception', e);
                //response.error_message = "session expire";
                //res.status(500).json(response);
            });
            if(continue_flg) {
                // await page.screenshot({path: 'pictures/login222' + Date.now() + '.png', fullPage: true});
                const exist_payment_card_element = '#main_middle > div.container-fluid > div:nth-child(1) > div.col-md-10 > p';
                if (await page.$(exist_payment_card_element) !== null) {
                    response.count = '0';
                    console.log("response=", response);
                    variable_value_arr.push('0');
                    variable_value_arr.push([]);
                    //res.status(200).json(response);
                } else {
                    const table_element =  '#main_middle > div.container-fluid > div:nth-child(1) > div.col-md-10 > #form2 > table:nth-child(4)';
                    const tbody_element = table_element + ' > tbody';
                    const tr_element = tbody_element + ' > tr';

                    var result_json = {
                        type: "006",
                        name: 'pulldown_time',
                        data: []
                    };
                    var list = [];

                    const tr_s = await page.$$(tr_element);
                    for (let i = 1; i <= tr_s.length; i++) {
                        const tr = tbody_element + ' > tr:nth-child('+ i +')';
                        const td_2 =  tr + ' > td:nth-child(2)';
                        const td_3 =  tr + ' > td:nth-child(3) > a';
                        const td_4 =  tr + ' > td:nth-child(4)';
                        const td_5 =  tr + ' > td:nth-child(5)';
                        const value_2_element = await page.$(td_2);
                        const value_2 = await (await value_2_element.getProperty('textContent')).jsonValue();
                        const value_3_element = await page.$(td_3);
                        const value_3 = await (await value_3_element.getProperty('textContent')).jsonValue();
                        const value_4_element = await page.$(td_4);
                        const value_4 = await (await value_4_element.getProperty('textContent')).jsonValue();
                        const value_5_element = await page.$(td_5);
                        const value_5 = await (await value_5_element.getProperty('textContent')).jsonValue();

                        list.push({
                            value: value_2.trim(),
                            text: value_3.trim() + '(' + value_4.trim() + ')',
                            user_name: value_5.trim()
                        });
                    }
                    variable_value_arr.push(list.length + "");
                    response.count = list.length;
                    list.push({
                        value: "new",
                        text: '新しく登録する'
                    });
                    result_json['data'] = list;

                    variable_value_arr.push(result_json);

                    // for(var k = 0; k < variable_value_arr.length; k++){
                    //     updateMessageVariable(data.connect_page_id, data.user_id, variable_card_info[k], variable_value_arr[k]);
                    // }

                    //result_json['data'] = list;
                    //response.data = result_json;
                    //console.log("response", response);
                    //res.status(200).json(response);
                }
                //store variable value
                for(var k = 0; k < variable_value_arr.length; k++){
                    updateMessageVariable(data.connect_page_id, data.user_id, variable_card_info[k], variable_value_arr[k]);
                }
            }
        } else {
            console.log("cookie not exist");
            //var error_message = "cookie not exist";
            //response.error_message = error_message;
            //res.status(500).json(response);
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
        //res.status(500).json(response);
    }
    await browser.close();
})()
}

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
        puppeteerRequest.findOne({cpid : connect_page_id, user_id: user_id, index: 2, status: 1},function(err, result2) {
            if (result2) {
                data.cookie = result2.param.cookie;
                data.object_id = result2._id;
                console.log('data', data);
                puppeteerRequest.findOne({cpid : connect_page_id, user_id: user_id, index: 3, status: 1},function(err, result3) {
                    if (result3) {
                        clearInterval(intervalObject);
                        getUserProfile(body, data, res);
                    }
                })
            }
        });
    }, 2000);
    console.timeEnd("get_user_info");
});

function getUserProfile(body, data, res) {
    var response = {"data": []};
    res.status(200).json(response);

    response = {};
    var variable_value_arr = [];
    var cookie = data.cookie;
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
                    if(request.url().indexOf("surusuru") !== -1){
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
                cookie.url = data.url;
                await page.setCookie(cookie);
                await page.goto(data.url, {waitUntil: 'load'});
                const header_element = '#contents > div.wrap > #main_middle > .page-heading';
                await page.waitForSelector(header_element);
                await page.waitForSelector(header_element).then(() => {
                    console.log('success');
                }).catch(e => {
                    console.log('error', e);
                    res.status(500).json(response);
                });

                //get info
                // await page.screenshot({path: 'pictures/' + Date.now() + '.png', fullPage: true});
                const detail_box__body_inner = '#contents > div.inner.wrap > #main_middle > #detail_wrap > #detail_box > #detail_box__body > form  > #detail_box__body_inner';
                const detail_box__birth = '#contents > div.inner.wrap > #main_middle > #detail_wrap > #detail_box > #detail_box__body > form > div.dl_table.not_required > #detail_box__birth';
                const detail_box__sex = '#contents > div.inner.wrap > #main_middle > #detail_wrap > #detail_box > #detail_box__body > form > div.dl_table.not_required > #detail_box__sex';
                const nonmember_name_1 = detail_box__body_inner + ' > #detail_box__name > dd.input_name > #entry_name_name01';
                const nonmember_name_2 = detail_box__body_inner + ' > #detail_box__name > dd.input_name > #entry_name_name02';
                const entry_kana_kana01 = detail_box__body_inner + ' > #detail_box__kana > dd.input_name > #entry_kana_kana01';
                const entry_kana_kana02 = detail_box__body_inner + ' > #detail_box__kana > dd.input_name > #entry_kana_kana02';
                const zip01 = detail_box__body_inner + ' > #detail_box__address_detail > dd > #detail_box__zip > #zip01';
                const zip02 = detail_box__body_inner + ' > #detail_box__address_detail > dd > #detail_box__zip > #zip02';
                const pref = detail_box__body_inner + ' > #detail_box__address_detail > dd > #detail_box__address > div.input_zip > #pref';
                const addr01 = detail_box__body_inner + ' > #detail_box__address_detail > dd > #detail_box__address > div:nth-child(2) > #addr01';
                const addr02 = detail_box__body_inner + ' > #detail_box__address_detail > dd > #detail_box__address > div:nth-child(3) > #addr02';
                const entry_tel_tel01 = detail_box__body_inner + ' > #detail_box__tel > dd >  div.input_tel > #entry_tel_tel01';
                const entry_tel_tel02 = detail_box__body_inner + ' > #detail_box__tel > dd >  div.input_tel > #entry_tel_tel02';
                const entry_tel_tel03 = detail_box__body_inner + ' > #detail_box__tel > dd >  div.input_tel > #entry_tel_tel03';
                const entry_birthday_year = detail_box__birth + ' > dd > div > #entry_incomplete_birth_incomplete_birth_year';
                const entry_birthday_month = detail_box__birth + ' > dd > div > #entry_incomplete_birth_incomplete_birth_month';
                const entry_birthday_day = detail_box__birth + ' > dd > div > #entry_incomplete_birth_incomplete_birth_day';
                const entry_gender = detail_box__sex + ' > dd > div > #entry_sex > div:nth-child(1) > label > #entry_sex_1';

                var last_name_value = await page.$eval(nonmember_name_1, el => el.value );
                var first_name_value = await page.$eval(nonmember_name_2, el => el.value );
                var last_kana_value = await page.$eval(entry_kana_kana01, el => el.value );
                var first_kana_value = await page.$eval(entry_kana_kana02, el => el.value );
                var zip01_value = await page.$eval(zip01, el => el.value );
                var zip02_value = await page.$eval(zip02, el => el.value );
                var pref_value = await page.$eval(pref, el => el.value);
                const selected_item = pref + ' > option[value="'+ pref_value +'"]';
                var pref_text = await page.$eval(selected_item, el => el.innerText);

                var addr01_value = await page.$eval(addr01, el => el.value );
                var addr02_value = await page.$eval(addr02, el => el.value );
                var tel01_value = await page.$eval(entry_tel_tel01, el => el.value );
                var tel02_value = await page.$eval(entry_tel_tel02, el => el.value );
                var tel03_value = await page.$eval(entry_tel_tel03, el => el.value );

                var zipcode = zip01_value + zip02_value;
                var pref_concat = pref_text + addr01_value + addr02_value;
                var tel = tel01_value + '-' + tel02_value + '-' + tel03_value;

                var birthday_year_value = await page.$eval(entry_birthday_year, el => el.value );
                var birthday_month_value = await page.$eval(entry_birthday_month, el => el.value );
                var birthday_day_value = await page.$eval(entry_birthday_day, el => el.value );
                if(parseInt(birthday_month_value) < 10) {
                    birthday_month_value = '0' + birthday_month_value;
                }
                if(parseInt(birthday_day_value) < 10) {
                    birthday_day_value = '0' + birthday_day_value;
                }
                var birth_day = birthday_year_value + '-' + birthday_month_value + '-' + birthday_day_value;

                const radio_gender = await page.$(entry_gender);
                var radio_is_checked = await (await radio_gender.getProperty('checked')).jsonValue();
                var gender = [{"value" : "2", "text" : "女性"}];
                if(radio_is_checked) {
                    gender = [{
                        "value" : "1",
                        "text" : "男性"
                    }];
                }

                variable_value_arr.push(first_name_value, last_name_value, first_kana_value, last_kana_value, zipcode, zip01_value, zip02_value, pref_concat, pref_text, addr01_value, addr02_value, "", tel, zip01_value, zip02_value, birth_day, gender);
                console.log(variable_value_arr);
                for(var i = 0; i < variable_value_arr.length; i++){
                    updateMessageVariable(data.connect_page_id, data.user_id, variable_user_profile[i], variable_value_arr[i]);
                }

                // console.log('==response==', response);
                // res.status(200).json(response);
            } else {
                console.log("cookie not exist");
                // response.error_message = "cookie not exist";
                // res.status(500).json(response);
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

function savePuppeteer(data){
    var puppeteer_data = new puppeteerRequest(data);
    puppeteer_data.save(function(err) {});
}

function getCookie(arr) {
    if(arr) {
        var result = {};
        arr.forEach(function (element) {
            if(element.name == 'eccube' && element.value != '') {
                result.name = 'eccube';
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

function splitFaxNumber(fax_number){
    var result = {
        fax1: '',
        fax2: '',
        fax3: '',
    };
    if (typeof fax_number != "undefined" && fax_number != '') {
        var fax_arr = fax_number.split("-");
        if(fax_arr.length == 3){
            result['fax1'] = fax_arr[0];
            result['fax2'] = fax_arr[1];
            result['fax3'] = fax_arr[2];
        }
    }
    return result;
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

function splitOther5(str){
    var result = {
        sex: '',
        pref: ''
    };
    if (typeof str != "undefined" && str != '') {
        str = str.split('|');
        result['sex'] = (str[0] == '男性') ? '1' : '2';
        result['pref'] = str[1];
    }
    return result;
}

function splitName(name){
    var result = {
        first_name: '',
        last_name: '',
    };
    if (typeof name != "undefined" && name) {
        name = name.trim();
        name = name.replace(/\s\s+/g, ' ');
        var name_arr = name.split(" ");
        if(name_arr.length == 2){
            result['last_name'] = name_arr[0].trim();
            result.first_name = name_arr[1].trim();
        }
    }
    return result;
}

function updateMessageVariable(connect_page_id, user_id, variable_name, variable_value){
    Variable.findOne({connect_page_id: connect_page_id, variable_name: variable_name}, function (err, result) {
        if (err) throw err;
        // console.log(result);
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

// getParam('p', 'https://admin.botchan.chat/demo/5c81e9e6a24a61078e72ba4d?p=quyetnd');
router.post('/getShippingFree', function(req, res, next) {
    var body = req.body;
    var shipping_method = body.shipping_method;
    if(shipping_method == "2"){
        res.status(200).json({"shipping_fee" : "540"});
    }else{
        res.status(200).json({"shipping_fee" : "0"});
    }
});


//お届け時間
router.post('/getShoppingTimeLabel', function(req, res, next) {
    var body = req.body;
    console.log("getShoppingTimeLabel", body);
    var shopping_time = typeof body.shopping_time !== "undefined" ? body.shopping_time.toString() : "";
    var label_arr = {
            "2": "午前",
            "3": "14時～16時",
            "4": "16時～18時",
            "5": "18時～20時",
            "6": "19時～21時"
        };
    if(typeof label_arr[shopping_time] !== "undefined"){
        res.status(200).json({"shopping_time_label" : label_arr[shopping_time] });
    }else{
        res.status(200).json({"shopping_time_label" : "指定なし" });
    }
});

module.exports = router;
