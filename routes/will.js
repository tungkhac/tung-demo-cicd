// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
var model = require('../model');
const CustomWillProductPrice = model.CustomWillProductPrice;
const Exception = model.Exception;
const commaNumber = require('comma-number');

/*GET product price*/
router.post('/getPrice', function(req, res, next){
    var body = req.body;
    var params = { ...body };
    var page_number = body.page_number;
    var booklet_number = body.booklet_number;

    params.page_number = (typeof page_number != 'undefined') ? page_number - (page_number % 4) : 0;
    params.booklet_number = (typeof booklet_number != 'undefined') ? booklet_number - (booklet_number % 50) : 0;

    var result_json = {
        type: "001",
        content: ''
    };
    var list = [];
    getPrice(params, function (data) {
        if(data){
            result_json.content = data;
            res.status(200).json(data);
        }else{
            res.status(500).json(result_json);
        }
    });
});
/*Validation input page number and booklet number*/
router.post('/validation', function(req, res, next){
    var body = req.body;
    var page_number = body.page_number;
    var booklet_number = body.booklet_number;
    var category = body.category;
    var validation_type = body.validation_type;
    var result_json = {
        "status":"valid"
    };
    var validation_page_num = true;
    var validation_booklet_num = true;
    var message_page_num = "冊子の総ページ数を以下の値以内ご入力ください。<br>:rangeページ（4ページ刻み）";
    var message_booklet_num = "冊子の部数を以下の値以内ご入力ください。<br>:range部（50部刻み）:num";
    var constant_booklet_num = "、1,500、2,000、2,500、3,000部";

    switch (category){
        case '中綴じ冊子共紙': {
            //1
            if(page_number < 8 || page_number > 128){
                validation_page_num = false;
                message_page_num = message_page_num.replace(':range', '8～128');
            }
            if(booklet_number < 50 || (booklet_number > 1000 && (booklet_number != 1500 || booklet_number != 2000 || booklet_number != 2500 || booklet_number != 3000))){
                validation_booklet_num = false;
                message_booklet_num = message_booklet_num.replace(':range', '50～1,000').replace(':num', constant_booklet_num);
            }
            break;
        }
        case '中綴じ冊子別紙': {
            //2
            if(page_number < 12 || page_number > 96){
                validation_page_num = false;
                message_page_num = message_page_num.replace(':range', '12～96');
            }
            if(booklet_number < 50 || (booklet_number > 1000 && (booklet_number != 1500 || booklet_number != 2000 || booklet_number != 2500 || booklet_number != 3000))){
                validation_booklet_num = false;
                message_booklet_num = message_booklet_num.replace(':range', '50～1,000').replace(':num', constant_booklet_num);
            }
            break;
        }
        case '無線綴じ冊子': {
            //3
            if(page_number < 36 || page_number > 508){
                validation_page_num = false;
                message_page_num = message_page_num.replace(':range', '36～508');
            }
            if(booklet_number < 50 || booklet_number > 1000){
                validation_booklet_num = false;
                message_booklet_num = message_booklet_num.replace(':range', '50～1,000').replace(':num', '');
            }
            break;
        }
        default: {

            break;
        }
    }

    if (validation_type == 'page_number'){
        if(!validation_page_num){
            result_json.status = "invalid";
            result_json.message = message_page_num;
        }
        res.json(result_json);
    }else if (validation_type == 'booklet_number'){
        if(!validation_booklet_num){
            result_json.status = "invalid";
            result_json.message = message_booklet_num;
        }
        res.json(result_json);
    }
});

function getPrice(params, callback) {
    var result = {
        price1: 0,
        price2: 0,
        option_price: 0,
        product_code: '',
        product_name: ''
    };
    var fee = 0;
    var option_price = 0;

    var format = params.format;
    var category = params.category;
    var page_number = params.page_number;
    var booklet_number = params.booklet_number;
    var cover_color_number = params.cover_color_number;
    var paper_color_number = params.paper_color_number;
    var cover_type = params.cover_type;
    var paper_type = params.paper_type;
    var cover_surface_treatment = params.cover_surface_treatment;
    var cover_paper_zenkaku = cover_type.replace('kg', "ｋｇ");
    var cover_paper_arr = [cover_type, cover_paper_zenkaku];
    var condition = {
        format: format,
        category: category,
        num_pages: page_number,
        num_copies: booklet_number,
        num_cover_color: cover_color_number,
        cover_paper:  {$in : cover_paper_arr},
        num_text_color: paper_color_number,
        body_paper: paper_type
    };
    console.log('condition', condition);
    if(format == 'A5' || format == 'B6'){
        fee = 2000;
    }else if(format == 'A4' || format == 'B5'){
        fee = 3000;
    }

    CustomWillProductPrice.findOne(condition, function(err, result0) {
        if (err) throw err;
        if(result0){
            var price1 = result0.selling_price;
            var price2 = result0.selling_price;
            switch (cover_surface_treatment){
                case '1': {
                    option_price = (booklet_number * 15) + fee;
                    price2 += option_price;

                    break;
                }
                case '2': {
                    option_price = (booklet_number * 19) + fee;
                    price2 += option_price;

                    break;
                }
                default: {

                    break;
                }
            };
            result.price1 = commaNumber(parseInt(price1 * 1.1));
            result.price2 = commaNumber(parseInt(price2 * 1.1));
            result.option_price =  commaNumber(parseInt(option_price * 1.1));
            result.product_code = result0.pcode;
            result.product_name = result0.pname;
            console.log(result);
            return callback(result);
        }else{
            console.log(params);
            return callback(result);
        }
    });
}
module.exports = router;
