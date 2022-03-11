// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
//EFO ISC就職支援センター　カスタマイズ
var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");
var model = require('../model');
const Exception = model.Exception;
const Zipcode = model.Zipcode;
const request = require('request');

/* GET home page. */
router.post('/store', function(req, res, next) {
  var body = req.body;
  var gender =  (body.gender == "男性") ? "1" : "2";
  var member_notice =  (body.member_notice == "1") ? "1" : "0";

  var url =  (typeof body.url !== "undefined") ? body.url : "https://v4.interview-maker.com/extapi/v1/adoption";

  var request_body = {
    accesskey : body.accesskey,
    recruit_id : body.recruit_id,
    email : body.email,
    password : body.password,
    name : body.name,
    gender : gender,
    telno : body.telno,
    prefecture_cd : body.prefecture_cd,
    city_cd : body.city_cd,
    remark: body.remark,
    member_notice: member_notice,
    ad_medium_id: "201"
  };

  var address = body.address;
  var zipcode = toPostFmt(address);
  console.log("address=", address);
  console.log("zipcode=", zipcode);
  Zipcode.findOne({"zipcode" : zipcode},function(err, result) {
    if(result){
      //console.log("address=", request_body);
      //console.log("address=", address);
      //var tmp = request_body.address;
      var address2 = address.replace(/〒/g , "");
      address2 = address2.replace(new RegExp(zipcode,"g") , "");
      address2 = address2.replace(new RegExp(result.pref,"g"), "");
      address2 = address2.replace(new RegExp(result.city,"g"), "");
      if(address2.length > 0){
        request_body.address = address2;
      }

      //request_body.address = address;

      var jiscode = result.jiscode.toString();
      jiscode = ("000" + jiscode).slice(-5);
      request_body.prefecture_cd = jiscode.substr(0,2);
      request_body.city_cd = jiscode;
      request_body.zipcode = zipcode;
      //console.log(request_body);
      var headers = {
        'Content-Type': "application/json"
      };
      var options = {
        uri: url,
        headers: headers,
        method: "POST",
        json: request_body
      };
      request(options, function (error, response, body1) {
        if (!error && (response.statusCode == 201 || response.statusCode == 200)){
           console.log(body1.result);
        }else{
           saveException({messageData: options, body: body1});
        }
        res.json({});
      });
    }else{
      saveException({messageData: request_body});
      res.json({});
    }
  });
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
    sub_type: "JSC",
    push_chatwork_flg: 0,
    created_at : now,
    updated_at : now
  });
  exception.save(function(err) {
  });
}


module.exports = router;
