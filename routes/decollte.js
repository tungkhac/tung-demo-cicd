// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
const Exception = model.Exception;
const config = require('config');
var moment = require('moment-timezone');
const commaNumber = require('comma-number');

const ceremony = {
    type_1: "001",
    type_2: "002"
};
const clothing = {
    type_1: "001",
    type_2: "002",
    type_3: "003"
};
const upsell = {
    type_1: "001",
    type_2: "002",
    type_3: "003",
    type_4: "004"
};
const photographing = {
    type_1: "001",
    type_2: "002"
};

router.post('/getPrice', function (req, res, next) {
    var body = req.body;
    var ceremony_content = body.ceremony_content;
    var number_people = body.number_people;
    var clothing_type = body.clothing_type;
    var upsell_params = body.upsell;
    var photographing_params = body.photographing;
    var price1 = 0;
    var price2 = 0;
    var price3 = 0;
    var price4 = 0;

    if (ceremony_content == ceremony.type_1) {
        price2 = 198000;
        switch (clothing_type) {
            case clothing.type_1 :
            case clothing.type_2 :
                price2 += 48800;
                break;
            case clothing.type_3 :
                price2 += 98800;
                break;
            default:
                price2 += 0;
                break;
        }
    }

    if (ceremony_content == ceremony.type_2) {
        price1 = 198000;
        if(number_people > 6){
            price1 = price1 + 12000 * (number_people - 6);
        }
    }

    switch (upsell_params) {
        case upsell.type_1:
            price3 = 0;
            break;
        case upsell.type_2 :
            price3 = 50000;
            break;
        case upsell.type_3 :
            price3 = 100000;
            break;
        case upsell.type_4 :
            price3 = 200000;
            break;
        default:
            price3 = 0;
            break;
    }

    if (photographing_params == photographing.type_1) {
        price4 = 75600;
    } else if (photographing_params == photographing.type_2) {
        price4 = 0;
    }
    price1 = parseInt(price1 * 1.1);
    price2 = parseInt(price2 * 1.1);
    price3 = parseInt(price3 * 1.1);
    price4 = parseInt(price4 * 1.1);

    var total_price = parseInt(price1 + price2 + price3 + price4);
    
    res.json({price1: commaNumber(price1), price2: commaNumber(price2), price3: commaNumber(price3), price4: commaNumber(price4), total_price: commaNumber(total_price)});

});

module.exports = router;
