// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");
var model = require('../model');
const Common = require('../modules/common');
const Zipcode = model.Zipcode;
const PulldownMaster = model.PulldownMaster;
var EfoPOrderHistory =  model.EfoPOrderHistory;
const config = require('config');
var emailValidator = require("email-validator");
var moji = require('moji');
var getAge = require('get-age');
var moment = require('moment-timezone');
moment.locale('ja');
const TIMEZONE = config.get('timezone');
const url_require = require('url');
const querystring = require('querystring');
const libphonenumber = require('libphonenumber-js');

const states = {
    北海道: 1,
    青森県: 2,
    岩手県: 3,
    宮城県: 4,
    秋田県: 5,
    山形県: 6,
    福島県: 7,
    茨城県: 8,
    栃木県: 9,
    群馬県: 10,
    埼玉県: 11,
    千葉県: 12,
    東京都: 13,
    神奈川県: 14,
    新潟県: 15,
    富山県: 16,
    石川県: 17,
    福井県: 18,
    山梨県: 19,
    長野県: 20,
    岐阜県: 21,
    静岡県: 22,
    愛知県: 23,
    三重県: 24,
    滋賀県: 25,
    京都府: 26,
    大阪府: 27,
    兵庫県: 28,
    奈良県: 29,
    和歌山県: 30,
    鳥取県: 31,
    島根県: 32,
    岡山県: 33,
    広島県: 34,
    山口県: 35,
    徳島県: 36,
    香川県: 37,
    愛媛県: 38,
    高知県: 39,
    福岡県: 40,
    佐賀県: 41,
    長崎県: 42,
    熊本県: 43,
    大分県: 44,
    宮崎県: 45,
    鹿児島県: 46,
    沖縄県: 47
};

const emailList = ['gmail.com',
    'yahoo.co.jp',
    'yahoo.com',
    'hotmail.com',
    'hotmail.co.jp',
    'icloud.com',
    'nifty.com',
    'mail.goo.ne.jp',
    'ocn.ne.jp',
    'ezweb.ne.jp',
    'ido.ne.jp',
    'biz.ezweb.ne.jp',
    'augps.ezweb.ne.jp',
    'uqmobile.jp',
    'docomo.ne.jp',
    'mopera.net',
    'dwmail.jp',
    'pdx.ne.jp',
    'wcm.ne.jp',
    'willcom.com',
    'y-mobile.ne.jp',
    'emnet.ne.jp',
    'emobile-s.ne.jp',
    'emobile.ne.jp',
    'ymobile1.ne.jp',
    'ymobile.ne.jp',
    'jp-c.ne.jp',
    'jp-d.ne.jp',
    'jp-h.ne.jp',
    'jp-k.ne.jp',
    'jp-n.ne.jp',
    'jp-q.ne.jp',
    'jp-r.ne.jp',
    'jp-s.ne.jp',
    'jp-t.ne.jp',
    'sky.tkc.ne.jp',
    'sky.tkk.ne.jp',
    'sky.tu-ka.ne.jp',
    'disney.ne.jp',
    'i.softbank.jp',
    'softbank.ne.jp',
    'vodafone.ne.jp'];

const emailList2 = ['gmail.com',
    'yahoo.co.jp',
    'yahoo.com'
   ];

router.post('/getPrefCode', function(req, res, next) {
    var body = req.body;
    var pref = body.pref;
    var response = {};
    if(states && states[pref]){
        response.pref_code = states[pref];
    }else{
        response.pref_code = -1;
    }
    console.log(response);
    res.status(200).json(response);
});

router.get('/getAddress', function(req, res, next) {
    var query = req.query;
    var address = query.address !== undefined ? query.address : '';
    Common.getAddressFromPostcode(address, function (response) {
        res.json(response);
    });
});

router.get('/getAddress3', function(req, res, next) {
    var query = req.query;
    var address = query.address !== undefined ? query.address : '';
    var zipcode = query.zipcode !== undefined ? query.zipcode : '';

    var pref = "";
    var city = "";
    var street = "";
    var other_address = "";
    var address1 = "";

    if(address && address.length > 0){
        address = address.trim();
        //zipcode = toPostFmt(address);
        zipcode = zipcode.replace(/〒/g , "");
        address1 = address1.trim();
        Zipcode.findOne({"zipcode" : zipcode},function(err, result) {
            if (result) {
                pref = result.pref;
                city = result.city;
                street =result.street;
                other_address = address.replace(/〒/g , "");
                other_address = other_address.replace(new RegExp(zipcode) , "");
                other_address = other_address.replace(new RegExp(pref), "");
                address1 = other_address;
                other_address = other_address.replace(new RegExp(city), "");
                other_address = other_address.replace(new RegExp(street), "");
                other_address = other_address.trim();
            }
            res.json({"zipcode": zipcode, "other_address": other_address, "pref": pref, "city": city, "city2": city + street, "street": street, "address2": street + other_address, "address" : address1});
        });
    }else{
        res.json({"zipcode": zipcode, "other_address": "", "pref": pref, "city": city, "city2": "", "street": street,  "address2": "", "address" : address1});
    }
});

router.get('/splitUsername', function(req, res, next) {
    var query = req.query;
    var name = query.username;
    var first_name = "";
    var last_name = "";
    var lastname_hankaku = "";
    var firstname_hankaku = "";
    if(name && name.length > 0){
        name = name.trim();
        name = name.replace(/\s\s+/g, ' ');
        var name_arr = name.split(" ");
        if(name_arr.length == 2){
            last_name = name_arr[0].trim();
            first_name = name_arr[1].trim();
            lastname_hankaku = moji(last_name).convert('ZK', 'HK').toString();
            firstname_hankaku = moji(first_name).convert('ZK', 'HK').toString();
        }
        res.json({"lastname": last_name, "firstname": first_name, "lastname_hankaku": lastname_hankaku, firstname_hankaku: firstname_hankaku});
    }else{
        res.json({"lastname": last_name, "firstname": first_name, "lastname_hankaku": lastname_hankaku, firstname_hankaku: firstname_hankaku});
    }
});

router.get('/getAge', function(req, res, next) {
    var query = req.query;
    var birthday = query.birthday;
    var age = "";

    if(birthday && birthday.length > 0){
        age = getAge(birthday);
        if(age == null || age < 0 || isNaN(age)) age = "";
        birthday = moment(birthday).format("YYYY/MM/DD");
        if(birthday == "Invalid date") birthday = "";
        res.json({"birthday": birthday, "age": age.toString()});
    }else{
        res.json({"birthday": birthday, "age": age});
    }
});

router.get('/checkEmail', function(req, res, next) {
    var query = req.query;
    var email = query.email;
    if(email && email.length > 0){
        email = email.trim();
        email = decodeURI(email);
        var result = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
        if(result){
            res.json({
                "status":"valid"
            });
        }else{
            res.json({
                "status":"invalid",
                "message":"有効なメールアドレス形式で指定してください。"
            });
        }
    }else{
        res.json({
            "status":"invalid",
            "message":"有効なメールアドレス形式で指定してください。"
        });
    }
});

router.post('/validHankaku', function(req, res, next) {
    var body = req.body;
    var text = body.text;
    var response = {};
    if(text && text.length > 0){
        var tmp = moji(text).filter('HE').toString();
        if(tmp === text){
            res.status(200).json(response);
        }else{
            response.error_message = "番地は半角英数字で入力してください。";
            res.status(500).json(response);
        }
    }else{
        response.error_message = "番地は半角英数字で入力してください。";
        res.status(500).json(response);
    }
});

router.post('/validateAddress', function(req, res, next) {
    var body = req.body;
    var text = body.text;
    var response = {};
    if(text && text.length > 0){
        var tmp = moji(text).filter('HE').toString();
        if(tmp === text && tmp.match(/^[0-9]/)){
            res.status(200).json(response);
        }else{
            response.error_message = "番地は半角英数字で入力してください。";
            res.status(500).json(response);
        }
    }else{
        response.error_message = "番地は半角英数字で入力してください。";
        res.status(500).json(response);
    }
});


router.post('/validateTelNoHyphen', function(req, res, next) {
    var body = req.body;
    var tel = body.phone_number !== undefined ? body.phone_number : '';
    if(tel && tel.match(/^[0-9]{10,11}$/)){
        res.json({
            "status":"valid"
        });
    }else{
        res.json({
            "status":"invalid",
            "message":"電話番号は半角数字（ハイフンなし）で入力してください。"
        });
    }
});


router.post('/removehyphen', function(req, res, next) {
    var body = req.body;
    var tel = body.phone_number !== undefined ? body.phone_number : '';
    if(tel && tel.length > 0){
        tel= tel.replace(/-/g, "");
    }
    res.json({
        "data": tel
    });
});

router.get('/validPhoneNumber2', function(req, res, next) {
    var query = req.query;
    var tel = query.phone_number !== undefined ? query.phone_number : '';
    var splits = tel.split('-');
    var splitLen = splits.length;
    console.log("splitLen=", splitLen);
    // 先頭が0である
    if(!tel.match(/^0.*/)){
        console.log("error1");
        res.json({
            "status":"invalid",
            "message":"有効な電話番号を入力してください。"
        });
        return;
    }

    if(splitLen == 2){
        var pos = tel.indexOf("-");
        if( (pos >= 2 && pos <= 5) || pos == 6 || pos == 7){

        }else{
            res.json({
                "status":"invalid",
                "message":"有効な電話番号を入力してください。"
            });
            return;
        }
    }
    else if(splitLen != 1 && splitLen != 3){
        res.json({
            "status":"invalid",
            "message":"有効な電話番号を入力してください。"
        });
        return;
    }

    if(splitLen === 1 && !tel.match(/^[0-9]{10,11}$/)){
        console.log("error3");
        res.json({
            "status":"invalid",
            "message":"有効な電話番号を入力してください。"
        });
        return;
    }

    var tmp = mainCheckTel(tel);

    if(tmp){
        res.json({
            "status":"valid"
        });
    }else{
        res.json({
            "status":"invalid",
            "message":"有効な電話番号を入力してください。"
        });
    }
});

router.get('/validPhoneNumber', function(req, res, next) {
    var query = req.query;
    var phone_number = query.phone_number;
    console.log("phone_number", phone_number);
    if(phone_number && phone_number.length > 0){
        phone_number = phone_number.trim();
        var tmp = mainCheckTel(phone_number);
        console.log("tmp", tmp);
        if(tmp){
            res.json({
                "status":"valid"
            });
        }else{
            res.json({
                "status":"invalid",
                "message":"有効な電話番号を入力してください。"
            });
        }

    }else{
        res.json({
            "status":"invalid",
            "message":"有効な電話番号を入力してください。"
        });
    }
});

router.get('/validPhoneNumber11', function(req, res, next) {
    var arr = ["090", "080", "070", "050"];
    var query = req.query;
    var tel = query.phone_number !== undefined ? query.phone_number : '';
    tel= tel.replace(/-/g, "");
    // 先頭が0である
    if(!tel.match(/^0.*/)){
        console.log("error1");
        res.json({
            "status":"invalid",
            "message":"有効な電話番号を入力してください。"
        });
        return;
    }
    var three_number = tel.substr(0, 3);
    console.log(three_number);
    if(arr.indexOf(three_number) !== -1 && !tel.match(/^[0-9]{11}$/)){
        res.json({
            "status":"invalid",
            "message":"有効な電話番号を入力してください。"
        });
        return;
    }else if(arr.indexOf(three_number) == -1 && !tel.match(/^[0-9]{10}$/)){
        res.json({
            "status":"invalid",
            "message":"有効な電話番号を入力してください。"
        });
        return;
    }

    var tmp = mainCheckTel(tel);

    if(tmp){
        res.json({
            "status":"valid"
        });
    }else{
        res.json({
            "status":"invalid",
            "message":"有効な電話番号を入力してください。"
        });
    }
});

// バリデーション関数
var validateTelNeo = function (value) {
    return /^[0０]/.test(value) && libphonenumber.isValidNumber(value, 'JP');
};

// 整形関数
var formatTel = function (value) {
    return new libphonenumber.AsYouType('JP').input(value);
};

var mainCheckTel = function (tel) {
    if (!validateTelNeo(tel)){
        return false;
    }
    var formattedTel = formatTel(tel);
    console.log(formattedTel);
    return true;
    // 以降 formattedTel を使って登録処理など進める
};

router.get('/getAddress2', function(req, res, next) {
    var query = req.query;
    var address = query.address !== undefined ? query.address : '';
    var pref = "";
    var city = "";
    var street = "";
    var address2 = "";
    if(address.length > 0){
        address = address.trim();
        var rex = "(...??[都道府県])((?:旭川|伊達|石狩|盛岡|奥州|田村|南相馬|那須塩原|東村山|武蔵村山|羽村|十日町|上越|富山|野々市|大町|蒲郡|四日市|姫路|大和郡山|廿日市|下松|岩国|田川|大村|宮古|富良野|別府|佐伯|黒部|小諸|塩尻|玉野|周南)市|(?:余市|高市|[^市]{2,3}?)郡(?:玉村|大町|.{1,5}?)[町村]|(?:.{1,4}市)?[^町]{1,4}?区|.{1,7}?[市町村])(.+)";
        var arr = address.match(rex);
        if(arr && arr.length > 0){
            if(arr[1]){
                pref = arr[1];
            }
            if(arr[2]){
                city = arr[2];
            }
            if(arr[3]){
                address2 = arr[3];
            }
        }
        res.json({"pref": pref, "city": city, "street": street, "address2": address2});
    }else{
        res.json({"pref": pref, "city": city, "street": street, "address2": ""});
    }
});

router.get('/getCurrentDate', function(req, res, next) {
    var query = req.query;
    var format = query.format !== format ? query.format : 'YYYY/MM/DD';
    var start_date = moment().tz(TIMEZONE).format(format);
    if(start_date == "Invalid date"){
        start_date = moment().format("YYYY/MM/DD");
    }
    res.json({"start_date": start_date});
});

router.get('/getCurrentDatetime', function(req, res, next) {
    var query = req.query;
    var format = query.format !== format ? query.format : 'YYYY/MM/DD';
    var start_date = moment().tz(TIMEZONE).format(format);
    if(start_date == "Invalid date"){
        start_date = moment().format("YYYY/MM/DD");
    }
    res.json({"data" : start_date});
});

router.get('/getYear', function(req, res, next) {
    var query = req.query;
    var date = query.date;
    var year = '';
    if (typeof date != "undefined" && date != '') {
        var now = new Date(date);
        year = now.getFullYear();
    }
    res.json({"year": year});
});

router.get('/trim', function(req, res, next) {
    var query = req.query;
    var result = {};
    if(query){
        for (var key in query) {
            if(key.indexOf("param") !== -1){
                result[key] = query[key].replace(/　/g, "");
                result[key] = result[key].replace(/ /g, "");
            }
        }
    }
    res.json(result);
});

router.get('/changeFormatDate', function(req, res, next) {
    var query = req.query;
    var date = query.date;
    var format = typeof query.format != "undefined" ? query.format : 'YYYY/MM/DD';
    var new_date = '';
    if (typeof date != "undefined" && date != '') {
        new_date = moment(date).format(format);
    }
    res.json({"date": new_date});
});

router.get('/getPrefCode', function(req, res, next) {
    var query = req.query;
    var address = query.address !== undefined ? query.address : '';
    var zipcode = "";
    var pref = "",
        pref_code = "";

    if(address && address.length > 0){
        address = address.trim();
        zipcode = toPostFmt(address);
        Zipcode.findOne({"zipcode" : zipcode},function(err, result) {
            if (result) {
                pref = result.pref;
                PulldownMaster.findOne({"active_flg" : 1, "name_ja": pref},function(err, result) {
                    if (result) {
                        pref_code = result.code;
                    }
                    res.json({"pref_code": [pref_code]});
                });
            }
        });
    }else{
        res.json({"pref_code": pref_code});
    }
});

router.get('/getListPrefCode', function(req, res, next) {
    var pref_code_list = {};
    PulldownMaster.find({active_flg: 1},function(err, result) {
        if (result) {
            result.forEach(function (row) {
                pref_code_list[row.name_ja] = row.code;
            });
        }
        res.json({"pref_code_list": pref_code_list});
    });
});

router.get('/getOrderInfo', function(req, res, next) {
    var query = req.query;
    var connect_page_id = query.connect_page_id,
        user_id = query.user_id;
    var payment_status = '',
        settlement_fee = 0,
        price_tax = 0,
        amount = 0,
        total_amount = 0,
        payment_date = '';
    var result_json = {
        payment_status : payment_status,
        settlement_fee : settlement_fee,
        price_tax : price_tax,
        amount : amount,
        total_amount : total_amount,
        payment_date : payment_date
    };

    if(connect_page_id != '' && user_id != ''){
        EfoPOrderHistory.findOne({connect_page_id: connect_page_id, user_id: user_id}, function(err, history){
            if (err) throw err;
            console.log(history);
            if(history){
                var settlement_fee = (typeof history.settlement_fee !== "undefined") ? history.settlement_fee : 0;
                var price_tax = (typeof history.price_tax !== "undefined") ? history.price_tax : 0;

                result_json['payment_status'] = (history.order_status !== '001') ? 'エラー' : '完了';
                result_json['settlement_fee'] = settlement_fee;
                result_json['price_tax'] = price_tax;
                result_json['amount'] = history.amount + settlement_fee;
                result_json['total_amount'] = history.amount + settlement_fee + price_tax;
                result_json['payment_date'] = moment(history.updated_at).format("YYYY-MM-DD HH:mm:ss");
            }
            res.json(result_json);
        });
    }else{
        res.json(result_json);
    }
});

router.post('/sendValueVariable', function(req, res, next) {
    var body = req.body;
    console.log(body);
    res.status(200).send(body.data);
});

router.get('/join', function(req, res, next) {
    var query = req.query;
    var separator = (typeof query.separator !== "undefined") ? query.separator : "";
    separator = separator.replace(/\\n/g, '\n');
    var arr = [];
    if(query){
        for (var key in query) {
            if(key.indexOf("param") !== -1){
                arr.push(query[key]);
            }
        }
    }
    res.status(200).send({"data" : arr.join(separator)});
});

router.post('/aloCheckCredit', function(req, res, next) {
    var body = req.body;
    console.log(body);
    var data = typeof body.data !== 'undefined' ?  body.data : {};
    var card_number = typeof body.card_number !== 'undefined' ?  body.card_number : "abcd";
    var response = {};
    var isDup = false;
    if(data && data.data){
        var list = data.data;
        if(list && Array.isArray(list) && list.length){
            for(var i = 0; i < list.length; i++){
                var text = list[i].text;
                if(text && text.indexOf(card_number) !== -1){
                    isDup = true;
                    break;
                }
            }
        }
    }
    if(isDup){
        response.error_message = "このクレジットカードが既に登録されています。";
        res.status(500).json(response);
    }else{
        res.status(200).json(response);
    }
});

router.post('/surusuruCheckCredit', function(req, res, next) {
    var body = req.body;
    console.log(body);
    var data = typeof body.data !== 'undefined' ?  body.data : {};
    var card_number = typeof body.card_number !== 'undefined' ?  body.card_number : "bcd";
    if(card_number.length >= 4){
        card_number = card_number.substr(1, 3);
    }
    var response = {};
    var isDup = false;
    if(data && data.data){
        var list = data.data;
        if(list && Array.isArray(list) && list.length){
            for(var i = 0; i < list.length; i++){
                var text = list[i].text;
                if(text && text.indexOf(card_number) !== -1){
                    isDup = true;
                    break;
                }
            }
        }
    }
    if(isDup){
        response.error_message = "このクレジットカードが既に登録されています。";
        res.status(500).json(response);
    }else{
        res.status(200).json(response);
    }
});

router.post('/formatDate', function(req, res, next) {
    var body = req.body;
    var date = body.date;
    var format = typeof body.format !== 'undefined' ? body.format : "YYYY-MM-DD";
    var result = moment(date).tz(TIMEZONE).format(format);
    if(result == "Invalid date"){
        res.status(200).json({date : date});
    }else{
        res.status(200).json({date : result});
    }
});

router.post('/splitDate', function(req, res, next) {
    var body = req.body;
    var date = typeof body.date !== 'undefined' ? body.date : "";
    var arr = date.split("/");
    if(arr.length != 3){
        arr = date.split("-");
    }
    if(arr.length == 3){
        res.status(200).json({
            year: arr[0],
            month: arr[1],
            day: arr[2]
        });
    }else{
        res.status(200).json({});
    }
});

router.post('/getCurrentDate', function(req, res, next) {
    var body = req.body;
    var format = typeof body.format !== 'undefined' ? body.format : "YYYY-MM-DD";
    console.log(format);
    var result = moment().tz(TIMEZONE).format(format);
    if(result == "Invalid date"){
        res.status(200).json({date : ""});
    }else{
        res.status(200).json({date : result});
    }
});


router.post('/getDeviceName', function(req, res, next) {
    var body = req.body;
    var device = typeof body.device !== 'undefined' ? body.device : "pc";
    var tablet_flg = typeof body.tablet_flg !== 'undefined' ? body.tablet_flg : "1";
    var arr = {
        "pc": "PC",
        "tablet": "タブレット",
        "mobile": "スマホ"};

    if(tablet_flg == 0){
        arr.tablet = "スマホ";
    }
    var device_name = "PC";
    if(typeof arr[device] !== "undefined"){
        device_name =  arr[device];
    }
    res.status(200).json({device_name : device_name});
});

router.post('/convertGender', function(req, res, next) {
    var body = req.body;
    console.log(body);
    var data = body.data;
    res.status(200).json({data : data});
});

router.post('/convertPulldown', function(req, res, next) {
    var body = req.body;
    console.log(body);
    var data = body.data;
    if(typeof data != 'undefined' && data != ''){
        data = data.replace(/,/g, ",\n");
    }
    res.status(200).json({data : data});
});

router.get('/getAddressFromZipcode', function (req, res, next) {
    var query = req.query;
    var zipcode = typeof query.zipcode !== 'undefined' ?  query.zipcode : "";
    zipcode = zipcode.replace(/〒/g , "");
    zipcode = zipcode.replace(/-/g , "");

    Zipcode.findOne({"zipcode" : zipcode},function(err, result) {
        var pref = "";
        var city = "";
        var addr = "";
        if (result) {
            pref = result.pref;
            city = result.city;
            addr = result.street;
            if(addr == "以下に掲載がない場合"){
                addr = "";
            }
        }
        res.status(200).json({"pref": pref, "city": city, "addr": addr, "cities": city + addr});
    });
});

router.post('/checkZipcode', function(req, res, next){
    var body = req.body;
    var zipcode = body.zipcode;
    if(zipcode){
        Zipcode.findOne({"zipcode" : zipcode},function(err, result) {
            if (result) {
                res.status(200).json({success: 1});
            }else{
                res.status(200).json({success: 0});
            }
        });
    }else{
        res.status(200).json({success: 0});
    }
});

router.post('/removeLineBreak', function(req, res, next){
    var body = req.body;
    var data = body.data;
    if(data){
        data = data.replace(/\r?\n/g, '');
    }
    res.status(200).json({"data": data});
});

router.post('/checkDuplicate', function(req, res, next){
    var body = req.body;
    var zipcode1 = typeof body.zipcode1 !== 'undefined' ?  body.zipcode1 : "";
    var zipcode2 = typeof body.zipcode2 !== 'undefined' ?  body.zipcode2 : "";
    if(zipcode1 == zipcode2){
        var response = {};
        response.error_message = "お届け先の住所は会員登録された住所と同じです。別の住所をいれてください。";
        res.status(500).json(response);
    }else{
        res.status(200).json({});
    }

});

/*EFO return pulldown format: year
* From current year to "from" param
* */
router.post('/message/pulldown/year', function(req, res, next){
    var body = req.body,
        from = (typeof body.from !== 'undefined' && !isNaN(body.from)) ?  parseInt(body.from) : 1950,
        option_default = typeof body.default !== 'undefined' ?  body.default : '',
        first_title = typeof body.first_title !== 'undefined' ?  body.first_title : '',
        last_title = typeof body.last_title !== 'undefined' ?  body.last_title : '';

    var result = {
        type : "006",
        data: []
    };
    //set default option
    if(option_default) {
        result.default_value = [option_default];
    }
    //set first, last title
    if(first_title) {
        result.first_title = first_title;
    }
    if(last_title) {
        result.last_title = last_title;
    }

    var current_time = new Date(),
        current_year = current_time.getFullYear();
    for (var i = current_year; i >= from; i--) {
        result.data.push({
            value: i,
            text: i
        });
    }

    if(!result.data.length) {
        result.error_message = "該当データーがありません";
    }
    res.status(200).json(result);
});

function toPostFmt(text){
    if(typeof text !== "undefined" && text.length >= 7){
        text = text.replace(/〒/g, "");
        text = text.substr(0,7);
        var h = text.substr(0,3);
        var m = text.substr(3);
        text = h + m;
    }
    return text;
}

function toPostFmt2(zipcode){
    if(typeof zipcode !== "undefined" && zipcode.length == 7){
        zipcode = zipcode.substr(0,3) + '-' + zipcode.substr(3,7);
    }
    return zipcode;
}


//Check email in black list
router.post('/emailBlackList', function(req, res, next){
    var body = req.body;
    console.log("body==", body);
    var email = body.email;
    if(email && email != '' && email != 'undefined') {
        var mailExtension = email.split('@')[1];
        console.log("mailExtension=>", mailExtension);
        if(emailList.indexOf(mailExtension) == -1) {
            res.status(200).json({'success': 'success'});
        } else {
            res.status(500).json({'error_message' : '半角英数で入力ください。Gmail等のフリーアドレスではなく、企業アドレスをご利用ください。'});
        }
    } else {
        res.status(500).json({'error_message' : '半角英数で入力ください。Gmail等のフリーアドレスではなく、企業アドレスをご利用ください。'});
    }
});

router.post('/emailBlackList2', function(req, res, next){
    var body = req.body;
    console.log("body==", body);
    var email = body.email;
    if(email && email != '' && email != 'undefined') {
        var mailExtension = email.split('@')[1];
        console.log("mailExtension=>", mailExtension);
        if(emailList2.indexOf(mailExtension) == -1) {
            res.status(200).json({'success': 'success'});
        } else {
            res.status(500).json({'error_message' : 'フリーメール（～@yahoo.co.jp、～@gmail.com）は使用できません。'});
        }
    } else {
        res.status(500).json({'error_message' : 'フリーメール（～@yahoo.co.jp、～@gmail.com）は使用できません。'});
    }
});

router.post('/validateCardName', function(req, res, next) {
    var body = req.body;
    var text = body.data.trim();
    var response = {};

    let ar_card_name = text.split(/\　|\s+/);
    let valid_card_name = /^[a-zA-Z\s]*$/.test(text); // /^([a-z]+[,.]?[ ]?|[a-z]+['-]?)+$/
    if (ar_card_name.length == 1) {
        res.status(500).json({
            error_message: "カード名義：姓と名の間にスペースを入力してください。"
        });
    } else if (!valid_card_name) {
        res.status(500).json({
            error_message: "アルファベッドのみ使用できます。"
        });
    } else {
        res.status(200).json(response);
    }
});

router.post('/persistent_menu', function (req, res) {
    res.status(200).json({
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "postback",
                        "title": "Talk to an agent",
                        "payload": "MENU_SCENARIO_5f8405c1ce7ce708ab7c574b"
                    },
                    {
                        "type": "web_url",
                        "title": "Shop now",
                        "url": "https://www.originalcoastclothing.com/",
                        "webview_height_ratio": "full"
                    }
                ]
            }
        ]
    });
});
router.post('/bot_message', function (req, res) {
    var body = req.body;
    var message_type = body.message_type;
    var message_sub_type = body.message_sub_type;
    var message_type_list = {
        'text': '001',
        'button': '002',
        'generic': '003',
        'media': '004',
        'quick_reply': '005',
        'checkbox': '009'
    };
    var sub_type_media = {
        'image': '001',
        'video': '002'
    };
    var sub_type_checkbox = {
        'default': '001',
        'image': '002'
    };
    var message = {};
    if(message_type == message_type_list.text){
        message = {
            "data": [
                {
                    "type": "001",
                    "message": {
                        "text": "text message"
                    }
                }
            ]
        };
    }else if(message_type == message_type_list.button){
        message = {
            "data": [
                {
                    "variable": "{variable_ID}",
                    "type": "002",
                    "message": {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "button",
                                "text": "button title",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "title": "button 1",
                                        "messenger_extensions": false,
                                        "url": "https://google.com"
                                    },
                                    {
                                        "type": "postback",
                                        "title": "button 2",
                                        "payload": "BSCENARIO_5cc17face047e1db61004f87_5c234a7009c6331e81277661_5af402ea09c633b565521e02_YnV0dG9uIDI="
                                        //ex: "BSCENARIO_5cc17face047e1db61004f87_5c234a7009c6331e81277661_5af402ea09c633b565521e02_YnV0dG9uIDI="
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        };
    }else if(message_type == message_type_list.generic){
        message = {
            "data" : [
                {
                    "type" : "003",
                    "message" : {
                        "attachment" : {
                            "type" : "template",
                            "payload" : {
                                "template_type" : "generic",
                                "elements" : [
                                    {
                                        "title" : "carousel 1",
                                        "subtitle" : "carousel 1 subtitle",
                                        "item_url" : "",
                                        "image_url" : "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fpluginfile.php%2F589%2Fcourse%2Fsection%2F384%2Fdemo-sign-d-letter-blocks-forming-isolated-white-background-36021240.jpg&imgrefurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fcourse%2Fview.php%3Fid%3D52&tbnid=HDT-Um5guxo2HM&vet=12ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ..i&docid=MaxNa8yVXADtUM&w=342&h=160&q=demo%20image&ved=2ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ",
                                        "buttons" : [
                                            {
                                                "title" : "carousel 1 btn",
                                                "type" : "web_url",
                                                "url" : "https://google.com"
                                            },
                                            {
                                                "title" : "carousel 2 btn",
                                                "type" : "postback",
                                                "payload" : "BSCENARIO_5cc17face047e1db61004f87_5c234a7009c6331e81277661_carousel 2 btn"
                                                //ex: "BSCENARIO_5cc17face047e1db61004f87_5c234a7009c6331e81277661_carousel 2 btn"
                                            }
                                        ]
                                    },
                                    {
                                        "title" : "carousel 2",
                                        "subtitle" : "carousel 2 subtitle",
                                        "item_url" : "",
                                        "image_url" : "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fpluginfile.php%2F589%2Fcourse%2Fsection%2F384%2Fdemo-sign-d-letter-blocks-forming-isolated-white-background-36021240.jpg&imgrefurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fcourse%2Fview.php%3Fid%3D52&tbnid=HDT-Um5guxo2HM&vet=12ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ..i&docid=MaxNa8yVXADtUM&w=342&h=160&q=demo%20image&ved=2ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ",
                                        "buttons" : [
                                            {
                                                "title" : "carousel 3 btn",
                                                "type" : "web_url",
                                                "url" : "https://google.com"
                                            },
                                            {
                                                "title" : "carousel 4 btn",
                                                "type" : "postback",
                                                "payload" : "BSCENARIO_5cc17face047e1db61004f87_5bd6e64409c63364f819ea5b_carousel 4 btn"
                                                //{button_title}: remove all "_" characters
                                                //ex: "BSCENARIO_5cc17face047e1db61004f87_5bd6e64409c63364f819ea5b_carousel 4 btn"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        };
    }else if(message_type == message_type_list.media){
        if(message_sub_type == sub_type_media.image){
            message = {
                "data": [
                    {
                        "type": "004",
                        "message": {
                            "attachment": {
                                "type": "image",
                                "payload": {
                                    "url": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fpluginfile.php%2F589%2Fcourse%2Fsection%2F384%2Fdemo-sign-d-letter-blocks-forming-isolated-white-background-36021240.jpg&imgrefurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fcourse%2Fview.php%3Fid%3D52&tbnid=HDT-Um5guxo2HM&vet=12ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ..i&docid=MaxNa8yVXADtUM&w=342&h=160&q=demo%20image&ved=2ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ",
                                    "url_image": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fpluginfile.php%2F589%2Fcourse%2Fsection%2F384%2Fdemo-sign-d-letter-blocks-forming-isolated-white-background-36021240.jpg&imgrefurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fcourse%2Fview.php%3Fid%3D52&tbnid=HDT-Um5guxo2HM&vet=12ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ..i&docid=MaxNa8yVXADtUM&w=342&h=160&q=demo%20image&ved=2ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ"
                                }
                            }
                        }
                    }
                ]
            };
        }else if(message_sub_type == sub_type_media.video){
            message = {
                "data": [
                    {
                        "type": "004",
                        "message": {
                            "attachment": {
                                "type": "video",
                                "payload": {
                                    "url": "https://youtu.be/5c9uOPjGBWM",
                                    "url_image": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fpluginfile.php%2F589%2Fcourse%2Fsection%2F384%2Fdemo-sign-d-letter-blocks-forming-isolated-white-background-36021240.jpg&imgrefurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fcourse%2Fview.php%3Fid%3D52&tbnid=HDT-Um5guxo2HM&vet=12ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ..i&docid=MaxNa8yVXADtUM&w=342&h=160&q=demo%20image&ved=2ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ"
                                }
                            }
                        }
                    }
                ]
            };
        }
    }else if(message_type == message_type_list.quick_reply){
        message = {
            "data" : [
                {
                    "variable" : "{variable_ID}",
                    "required_flg" : 0,
                    "keyword_matching_flg" : 0,
                    "type" : "005",
                    "message" : {
                        "text" : "quickreply label",
                        "quick_replies" : [
                            {
                                "content_type" : "text",
                                "title" : "quick reply 1",
                                "payload" : "BQUICK_REPLIES_5cc17face047e1db61004f87_59ce091909c63378fa1c31c2_5af402ee09c6330f0602855a_MDAx_0"
                                //ex: "BQUICK_REPLIES_5cc17face047e1db61004f87_59ce091909c63378fa1c31c2_5af402ee09c6330f0602855a_MDAx_0"
                            },
                            {
                                "content_type" : "text",
                                "title" : "quick reply 2",
                                "payload" :  "BQUICK_REPLIES_5cc17face047e1db61004f87_-1_5af402ee09c6330f0602855a_MDAy_0"
                                //ex: "BQUICK_REPLIES_5cc17face047e1db61004f87_-1_5af402ee09c6330f0602855a_MDAy_0"
                            }
                        ],
                        "horizontal_scroll_flg" : 0
                    }
                }
            ]
        };
    }else if(message_type == message_type_list.checkbox){
        if(message_sub_type == sub_type_checkbox.default){
            message = {
                "data" : [
                    {
                        "variable" : "5cc17face047e1db61004f87",
                        "required_flg" : 1,
                        "type" : "009",
                        "message" : {
                            "type" : "009",
                            "title_flg" : "002",
                            "title" : "checkbox title",
                            "template_type" : "001",
                            "scenario_id" : "5cc17face047e1db61004f87",
                            "list" : [
                                {
                                    "value" : "001",
                                    "text" : "option 1"
                                },
                                {
                                    "value" : "002",
                                    "text" : "option 2"
                                },
                                {
                                    "value" : "003",
                                    "text" : "option 3"
                                }
                            ],
                            "option_select_min" : "1",
                            "option_select_max" : "3"
                        }
                    }
                ]
            };
        }else if(message_sub_type == sub_type_checkbox.image){
            message = {
                "data" : [
                    {
                        "variable" : "5cc17face047e1db61004f87",
                        "required_flg" : 0,
                        "type" : "009",
                        "message" : {
                            "type" : "009",
                            "title_flg" : "002",
                            "title" : "checkbox image title",
                            "template_type" : "002",
                            "scenario_id" : "5cc17face047e1db61004f87",
                            "list" : [
                                [
                                    {
                                        "image_url" : "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fpluginfile.php%2F589%2Fcourse%2Fsection%2F384%2Fdemo-sign-d-letter-blocks-forming-isolated-white-background-36021240.jpg&imgrefurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fcourse%2Fview.php%3Fid%3D52&tbnid=HDT-Um5guxo2HM&vet=12ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ..i&docid=MaxNa8yVXADtUM&w=342&h=160&q=demo%20image&ved=2ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ",
                                        "value" : "001",
                                        "text" : "option 1"
                                    }
                                ],
                                [
                                    {
                                        "image_url" : "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fpluginfile.php%2F589%2Fcourse%2Fsection%2F384%2Fdemo-sign-d-letter-blocks-forming-isolated-white-background-36021240.jpg&imgrefurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fcourse%2Fview.php%3Fid%3D52&tbnid=HDT-Um5guxo2HM&vet=12ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ..i&docid=MaxNa8yVXADtUM&w=342&h=160&q=demo%20image&ved=2ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ",
                                        "value" : "002",
                                        "text" : "option 2"
                                    }
                                ],
                                [
                                    {
                                        "image_url" : "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fpluginfile.php%2F589%2Fcourse%2Fsection%2F384%2Fdemo-sign-d-letter-blocks-forming-isolated-white-background-36021240.jpg&imgrefurl=https%3A%2F%2Fmoodle.usth.edu.vn%2Fcourse%2Fview.php%3Fid%3D52&tbnid=HDT-Um5guxo2HM&vet=12ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ..i&docid=MaxNa8yVXADtUM&w=342&h=160&q=demo%20image&ved=2ahUKEwiPyKWp7L7wAhUZA6YKHUCxDQEQMygEegUIARDbAQ",
                                        "value" : "003",
                                        "text" : "option 3"
                                    }
                                ]
                            ]
                        }
                    }
                ]
            }
        }
    }
    res.status(200).json(message);
});

router.post('/getParamFromUrl', function(req, res, next) {
    var body = req.body;
    var current_url = body.current_url;
    var response = {};
    if (current_url != void 0) {
        const url_parts = url_require.parse(current_url);
        if(url_parts.query){
            response = querystring.parse(url_parts.query);
        }
    }
    console.log(response);
    res.status(200).json(response);
});

module.exports = router;
