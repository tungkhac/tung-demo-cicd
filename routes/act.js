var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
const Zipcode = model.Zipcode;
const config = require('config');
var moment = require('moment-timezone');
const request = require('request');
var urlencode = require('urlencode');

/* GET home page. */
router.get('/getStudentList', function(req, res, next){
    var country = req.query.country;
    var birthday = req.query.birthday;
    var type = "001";
    if(req.query.type){
        type = "002";
    }
    var date = "2013-01-01";
    var student_token = "23gPEIiVAkdh48Ovf4zx12kuchKeDmsnTN1GjNGZ";
    var query = '日付_1 >= "' + date +  '" and 文字列__1行__1 = "' + country + '" and 日付 = "' + birthday + '" and ドロップダウン in ("在籍中(3号)", "在籍中", "在籍(自宅待機中)", "在籍(アクト本部預り)") order by 日付_1 asc limit 500';
    query = urlencode(query);

    var field = "&fields=" + urlencode('$id,数値_1,日付,文字列__1行__1,文字列__1行__0,文字列__1行__8,ルックアップ,日付_1,文字列__1行__3,ドロップダウン');

    headers = {
        'X-Cybozu-API-Token' : student_token
    };

    console.log("https://act.cybozu.com/k/v1/records.json?app=30&query=" + query);
    var request_body = {
        uri: "https://act.cybozu.com/k/v1/records.json?app=30&query=" + query + field,
        headers: headers,
        method: "GET",
        json: true
    };
    request(request_body, function (error, response, body) {
        console.log("error=", error);
        console.log("response.statusCode=", response.statusCode);
        if (!error && response.statusCode == 200){
            if(body.records.length == 0){
                if(type == "001"){
                    res.json({"count" : 0});
                }else{
                    res.json({"error_message":"該当する実習生はありません。国籍・生年月日を再度ご確認ください。","data":[]});
                }

            }else if(body.records.length == 1){
                var result = body.records[0];
                res.json({"count" : 1, "student_name" : result["文字列__1行__0"].value, "student_id": result["$id"].value,  "company_name":  result["ルックアップ"].value });
            }else{
                if(type == "001"){
                    res.json({"count" : 2});
                }else{
                    var records = body.records;
                    var data = [];
                    records.forEach(function (element) {
                        data.push({"value": element["$id"].value, "text": element["文字列__1行__0"].value});
                    });
                    res.json({"data":data});
                }
            }
        }else {
            if(type == "001"){
                res.json({"count" : 0});
            }else{
                res.json({"error_message":"該当する実習生はありません。国籍・生年月日を再度ご確認ください。","data":[]});
            }
        }
    });

});

router.get('/getCompanyName', function(req, res, next){
    var student_id = req.query.student_id;
    var student_token = "23gPEIiVAkdh48Ovf4zx12kuchKeDmsnTN1GjNGZ";
    headers = {
        'X-Cybozu-API-Token' : student_token
    };
    var request_body = {
        uri: "https://act.cybozu.com/k/v1/record.json?app=30&id=" + student_id,
        headers: headers,
        method: "GET",
        json: true
    };
    request(request_body, function (error, response, body) {
        if (!error && response.statusCode == 200){
          if(body.record){
              res.json({"company_name": body.record["ルックアップ"].value});
          }else{
              res.json({});
          }
        }else {
            res.json({});
        }
    });

});

module.exports = router;
