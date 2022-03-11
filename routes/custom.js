// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
const config = require('config');
var router = express.Router();
const commaNumber = require('comma-number');
var model = require('../model');
const CustomBank = model.CustomBank;
const EfoMessageVariable = model.EfoMessageVariable;

//Fjnext pulldown job
router.get('/fjnext/pulldown/job', function(req, res, next){
    var item_list = ['会社員', '会社役員', '公務員', '自営業・経営者', '士師族', 'その他'];
    var result = {
        type : "006",
        default_value : ['0'],
        data: []
    };
    for(var i in item_list) {
        result.data.push({
            value: 1,
            text: item_list[i]
        });
    }
    res.json(result);
});

/*Demo format in bot_mesages:

 "data" :
 [
    {
     "type" : "010",
     "variable" : "5992abfe9a892046be0cbd0e",
     "required_flg" : 1,
     "message" : {
         "scenario_id" : "5dfdb05efdce273d537aa84f",
         "placeholder" : "placeholder text",
         "title" : "ccc"
     }
    }
 ],
 "btn_next" : "Next 222",

* */
router.post('/webchat/textarea', function (req, res, next) {
    var body = req.body;

    var scenario_id = body.scenario_id ? body.scenario_id : '';
    var variable_id = body.variable_id ? body.variable_id : '';
    var required_flg = (body.required_flg == '1') ? 1 : 0;
    var placeholder = body.placeholder ? body.placeholder : '';
    var title = body.title ? body.title : '';
    var btn_next = body.btn_next ? body.btn_next : '';

    res.json({
        type : "010",
        variable_id : variable_id,
        required_flg : required_flg,
        message : {
            scenario_id : scenario_id,
            placeholder : placeholder,
            title : title
        },
        btn_next : btn_next,
    });
});

/*Dlighted function*/
router.post('/dlighted/calculateTimes', function (req, res, next) {
    var result = {};

    var body = req.body;
    var time = body.time ? body.time : '';
    var employees_number = body.employees_number ? body.employees_number : '';

    if(time && time !== true && !isNaN(time)) {
        time = parseFloat(time);

        let baseTime = 10;
        let basePrice = 0;
        const MONTHLY_BUSINESS_DAY = 20;
        const REDUCTION_PRICE = 2000;
        const REDUCTION_TIME = 20;

        switch (employees_number) {
            case "1~10名":
                baseTime = 10;
                basePrice = 0;
                break;
            case "11~50名":
                baseTime = 15;
                basePrice = 5000;
                break;
            case "51~100名":
                baseTime = 20;
                basePrice = 10000;
                break;
            case "101名~150名":
                baseTime = 25;
                basePrice = 15000;
                break;
            case "151~200名":
                baseTime = 30;
                basePrice = 20000;
                break;
            case "201~500名":
                baseTime = 40;
                basePrice = 25000;
                break;
            case "501名以上":
                baseTime = 50;
                basePrice = 55000;
                break;
        }
        result = {
            currentReceptionTime: commaNumber(baseTime * time),
            notConcentrated: commaNumber(baseTime * REDUCTION_TIME),
            reductionTime: commaNumber(-(baseTime * time) * MONTHLY_BUSINESS_DAY),
            reductionCost: commaNumber(Math.round(Math.round(basePrice - (baseTime * time) * MONTHLY_BUSINESS_DAY / 60 * REDUCTION_PRICE) / 1000) * 1000),
        };
    }
    res.json(result);
});

router.get('/pulldown/autocomplete', function(req, res, next){
    var query = req.query,
        search_type = (query.search_type != void 0) ? query.search_type : '';

    res.json({
        type : "006",
        auto_complete_name : search_type,
        // first_option_remove_flg : 1,
        // default_value : ['3'],
        data: [],
    });
});

router.post('/pulldown/autocomplete/search', function(req, res, next){
    var allowedOrigins = [config.get('appNodeURL')];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    try {
        var success_flg = false;
        var body = req.body;
        if (body.keyword != void 0 && body.search_type != void 0) {
            success_flg = true;

            var data = {
                connect_page_id: body.connect_page_id,
                user_id: body.user_id,
                search_type: body.search_type,
                keyword: body.keyword,
            };
            g_custom_bank.getData(data, function(list_data) {
                // console.log('list_data: ', list_data);
                res.json({list: list_data});
            });
        }
    } catch (e) {
        console.log('Custom Pulldown autocomplete error: ', e);
    }

    if(!success_flg) {
        res.json({list: []});
    }
});

var g_custom_bank = {
    keyword: '',
    getData: function(data, callback) {
        if (data.search_type == 'bank') {
            g_custom_bank.getBank(data, function (data) {
                callback(data);
            });

        } else if (data.search_type.indexOf('branch') != -1) { //search_type format: branch_{bank_variable_id}
            g_custom_bank.getBranch(data, function (data) {
                callback(data);
            });
        } else {
            callback([]);
        }
    },
    getBank: function(data, callback) {
        this.keyword = data.keyword;

        var filter_option = {};
        filter_option['bank_name'] = {'$regex': '.*' + data.keyword + '*.'};
        // console.log('filter_option:', filter_option);
        CustomBank.aggregate([
            //where
            {
                $match: filter_option
            },
            {
                $group: {
                    _id: {
                        bank_code: '$bank_code',
                    },
                    bank_name: {$addToSet: '$bank_name'}, //$addToSet: distind
                }
            },
        ], (err, result) => {
            if (err) throw err;
            // console.log('--> bank_name ', result);

            if (!err && result && result.length) {
                var result2 = result.map((e) => {
                    return {
                        id: e._id['bank_code'],
                        text: e.bank_name[0]
                    }
                });
                result2 = result2.sort(g_custom_bank.compareBank);
                callback(result2);

            } else {
                callback([]);
            }
        });
    },
    getBranch: function(data, callback) {
        if(data.connect_page_id && data.user_id && data.search_type.split('_').length > 1) {
            var connect_page_id = data.connect_page_id,
                user_id = data.user_id,
                variable_id = data.search_type.split('_')[1];

            EfoMessageVariable.findOne(
                {
                    connect_page_id: connect_page_id,
                    user_id: user_id,
                    variable_id: variable_id,
                },
                function(err, variable_result) {
                    if (err) throw err;

                    if(!err && variable_result && Array.isArray(variable_result.variable_value) && variable_result.variable_value.length && variable_result.variable_value[0].value != void 0) {
                        var variable_arr = variable_result.variable_value;

                        var filter_option = {};
                        filter_option['branch_name'] = {'$regex': '.*' + data.keyword + '.*'};
                        filter_option['bank_code'] = variable_arr[0].value;
                        // console.log('filter_option:', filter_option);

                        CustomBank.find(filter_option, null, {}, function(err, result) {
                            if (err) throw err;

                            if(!err && result && result.length) {
                                callback(result.map((e) => {
                                    return {
                                        id: e.branch_code,
                                        text: e.branch_name
                                    };
                                }));

                            } else {
                                callback([]);
                            }
                        });

                    } else {
                        callback([]);
                    }
                },
            );

        } else {
            callback([]);
        }
    },
    compareBank: function (a, b) {
        if (a.text.indexOf(g_custom_bank.keyword) == -1 && b.text.indexOf(g_custom_bank.keyword) != -1) {
            return 1;
        }
        if (a.text.indexOf(g_custom_bank.keyword) != -1 && b.text.indexOf(g_custom_bank.keyword) == -1) {
            return -1;
        }

        if (a.text.indexOf(g_custom_bank.keyword) < b.text.indexOf(g_custom_bank.keyword)) {
            return -1;
        }
        if (a.text.indexOf(g_custom_bank.keyword) > b.text.indexOf(g_custom_bank.keyword)) {
            return 1;
        }
        return 0;
    }
};

module.exports = router;
