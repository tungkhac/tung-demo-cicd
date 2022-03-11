// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
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
router.post('/convertData', function(req, res, next){
    var body = req.body;
    var username = body.username;
    var username_kana = body.username_kana;
    var username_aite = body.username_aite;
    var username_kana_aite = body.username_kana_aite;

    var address = body.address;

    var lastName = "";
    var firstName = "";
    var lastName_kana = "";
    var firstName_kana = "";
    var lastName_aite = "";
    var firstName_aite = "";
    var lastName_kana_aite = "";
    var firstName_kana_aite = "";

    if(username && username_kana){
        username = username.trim();
        username = username.replace(/\s\s+/g, ' ');
        username_kana = username_kana.trim();
        username_kana = username_kana.replace(/\s\s+/g, ' ');

        var name_arr = username.split(" ");
        var name_kana_arr = username_kana.split(" ");
        if(name_arr.length == 2){
            lastName = name_arr[0];
            firstName = name_arr[1];
        }
        if(name_kana_arr.length == 2){
            lastName_kana = name_kana_arr[0];
            firstName_kana = name_kana_arr[1];
        }
    }

    if(username_aite && username_kana_aite){

        username_aite = username_aite.trim();
        username_aite = username_aite.replace(/\s\s+/g, ' ');
        username_kana_aite = username_kana_aite.trim();
        username_kana_aite = username_kana_aite.replace(/\s\s+/g, ' ');


        var name_arr1 = username_aite.split(" ");
        var name_kana_arr1 = username_kana_aite.split(" ");
        if(name_arr1.length == 2){
            lastName_aite = name_arr1[0];
            firstName_aite = name_arr1[1];
        }
        if(name_kana_arr1.length == 2){
            lastName_kana_aite = name_kana_arr1[0];
            firstName_kana_aite = name_kana_arr1[1];
        }
    }

    var zipcode = "";
    var pref = "";
    var city = "";
    var other_address = "";
    if(address && address.length > 0){
        zipcode = toPostFmt(address);
        //var tmp_zipcode = zipcode.replace(/-/g , "");
        Zipcode.findOne({"zipcode" : zipcode},function(err, result) {
            if (result) {
                pref = result.pref;
                city = result.city + result.street;
                other_address = address.replace(/〒/g , "");
                other_address = other_address.replace(new RegExp(zipcode,"g") , "");
                other_address = other_address.replace(new RegExp(pref,"g"), "");
                other_address = other_address.replace(new RegExp(city,"g"), "");
            }
            res.json({"lastName" : lastName, "firstName" : firstName, "lastName_kana" : lastName_kana, "firstName_kana" : firstName_kana,
                "lastName_aite" : lastName_aite, "firstName_aite" : firstName_aite, "lastName_kana_aite" : lastName_kana_aite, "firstName_kana_aite" : firstName_kana_aite,

                "zipcode": zipcode, "pref" : pref, "city" : city, "other_address" : other_address

            });
        });
    }else{
        res.json({"lastName" : lastName, "firstName" : firstName, "lastName_kana" : lastName_kana, "firstName_kana" : firstName_kana,
            "lastName_aite" : lastName_aite, "firstName_aite" : firstName_aite, "lastName_kana_aite" : lastName_kana_aite, "firstName_kana_aite" : firstName_kana_aite,
            "zipcode": zipcode, "pref" : pref, "city" : city, "other_address" : other_address
        });
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

module.exports = router;
