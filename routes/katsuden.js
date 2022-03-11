// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
const Zipcode = model.Zipcode;
const Exception = model.Exception;
const config = require('config');
var moment = require('moment-timezone');
var katsuzenZipcode = require('../data/katsudenZipcodeEmail.json');
/* GET home page. */
router.get('/getEmailFromZipcode', function(req, res, next){
    const zipcode = getValidZipcode(req.query.zipcode);
    console.log(zipcode);
    var result_json = {to_email: "", cc_email: ""};

    if(zipcode){
        Zipcode.findOne({zipcode : zipcode},function(err, result) {
            if(result){
                //console.log("result=", result);
                var db_city = result.city;
                var db_pref = result.pref;
                var has_result = false;
                var result_item = null;
                for(var i in katsuzenZipcode){
                    var item = katsuzenZipcode[i];

                    if(item.pref){
                        for(var j in item.pref){
                            var pref = item.pref[j];
                            if(db_pref == pref.name){
                                //console.log("pref=", pref);
                                var zipcode_arr = pref.zipcode;
                                //console.log(zipcode_arr);
                                if(zipcode_arr && zipcode_arr.indexOf(zipcode) > -1){
                                    has_result = true;
                                }
                                else if(pref.city){
                                    for(var y in pref.city){
                                        var city = pref.city[y];
                                        if(db_city.indexOf(city.name) === 0){
                                            has_result = true;
                                        }
                                    }
                                }else{
                                    has_result = true;
                                }
                            }
                        }
                        if(has_result){
                            result_item = item;
                            break;
                        }
                    }else{
                        result_item = item;
                        break;
                    }
                }
                result_json["to_email"] = item.to_email;
                //var result_json = {to_email: item.to_email};
                if(item.cc_email){
                    //result_json["cc_email"] = item.cc_email;
                    result_json["cc_email"] = item.cc_email;
                }
                res.json(result_json);

            }else{
                res.json(result_json);
            }

        });
    }else{
        res.json(result_json);
    }

});

router.post('/insertDigima', function(req, res, next){
    var body = req.body;
    //body = {
    //    _api_key: 'YmUuLeEJJ2YY2I8iS9HpoQZBIrC2s0rhDBCFd3RN1MRCr3krNEePcEquw3xJHbWZ',
    //    _website_code: '1q5wkpy5Px9KeZDw',
    //    company_name: 'てすと',
    //    username: 'てすと てすとめい',
    //    username_kana: 'テスト テストメイ',
    //    work_telephone: '0942156488',
    //    address: '〒1840011 東京都小金井市東町２－３４－５第2恵壮',
    //    _group_name: '資料請求',
    //    contact_field_3: '片持ち階段『2017新製品』カタログ',
    //    contact_field_4: 'テスト',
    //    _page_url: 'http://embot.local.vn/demo/5bf3690a9a8920064b222f43',
    //    _page_title: 'EFO DEMO BOTCHAN',
    //    email: 'test@gmail.com',
    //    _validate_only: 1
    //};
    //console.log(body);

    var username = body.username;
    var username_kana = body.username_kana;
    var isOk = false;
    if(username && username_kana){
        username = username.trim();
        username = username.replace(/\s\s+/g, ' ');

        username_kana = username_kana.trim();
        username_kana = username_kana.replace(/\s\s+/g, ' ');

        var name_arr = username.split(" ");
        var name_kana_arr = username_kana.split(" ");
        if(name_arr.length == 2 && name_kana_arr.length == 2){
            isOk = true;
        }
    }

    headers = {
        'Api-Key' : body._api_key
    };

    var address = body.address;
    if(address && address.length > 0 && isOk){
        var options = {
            uri: " https://dgmapi.com/1/webform/contacts",
            headers: headers,
            method: "POST",
            form: {
                "_website_code": body._website_code,
                "_page_url": body._page_url,
                "_page_title": body._page_title,
                "_group_name": body._group_name,
                "_manager_email": "",
                "email": body.email,
                "contact_field_3": body.contact_field_3,
                "contact_field_4": body.contact_field_4,
                "contact_field_13": body.contact_field_13,
                "contact_field_14": body.contact_field_14,
                "company_name": body.company_name,
                "work_telephone": body.work_telephone,
                "last_name": name_arr[0],
                "first_name": name_arr[1],
                "last_name_kana": name_kana_arr[0],
                "first_name_kana": name_kana_arr[1]
            },
            json: true
        };
        var zipcode = toPostFmt(address);
        Zipcode.findOne({"zipcode" : zipcode},function(err, result) {
            if (result) {
                var pref = result.pref;
                var city = result.city;
                var city1 = address.replace(/〒/g , "");
                city1 = city1.replace(new RegExp(zipcode,"g") , "");
                city1 = city1.replace(new RegExp(pref,"g"), "");
                //city1 = city1.replace(new RegExp(city,"g"), "");
                options.form["work_postal_code"] = zipcode;
                options.form["work_region"] = pref;
                options.form["work_city"] = "";
                options.form["work_address"] = city1.trim();
                //console.log(options);
                request(options, function (error, response, body1) {
                    if (!error && response.statusCode == 200){
                        console.log(body1.success);
                        if(body1.success){

                        }else{
                            saveException({messageData: options, body: body1});
                        }
                    }else{
                        saveException({messageData: options, body: body1});
                    }
                    //console.log("error=", error);
                    //console.log("body=", body);
                    //console.log("response.statusCode=", response.statusCode);
                    res.json({});
                });
            }
        });
    }else{
        saveException({messageData: null, body: body});
        res.json({});
    }
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

function saveException(err){
    var now = new Date();
    var exception = new Exception({
        err: err,
        type: "002",
        sub_type: "Katsuden",
        push_chatwork_flg: 0,
        created_at : now,
        updated_at : now
    });
    exception.save(function(err) {
    });
}

function getValidZipcode(zipcode){
    if(typeof zipcode !== "undefined" && zipcode.length >= 7){
        zipcode = zipcode.replace( /〒/g , "");
        zipcode = zipcode.substr(0,7);
    }
    return zipcode;
}
module.exports = router;
