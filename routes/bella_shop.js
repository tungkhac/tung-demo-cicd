// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by nguyen.khac.tung on 10/7/2020.
 */


var express = require('express');
var router = express.Router();
var common = require('../modules/common');
var model = require('../model');
const ZipcodeChinas = model.ZipcodeChinas;

/*return select format message*/
router.post('/getPref', function(req, res, next) {
    var body = req.body;
    var cpid =  body.cpid;

    var response_data = {
        type: '005',
        data: [],
        error_message: 'おすすめが見つかりませんでした。'
    };

    try {
        ZipcodeChinas.distinct('pref', function(err, result) {
            // console.log('Zipcode China Pref: ', (result ? result.length : result));
            if(result && result.length){
                response_data.data = result.reduce(function (result_array, pref) {
                    result_array.push({
                        value: pref,
                        text: pref
                    });
                    return result_array;
                }, []);

                if(response_data.data.length) {
                    response_data.error_message = '';
                }
                res.json(response_data);
            } else {
                res.json(response_data);
            }
        });

    } catch(e) {
        common.saveException(cpid, "Zipcode China get Pref", {
            name: e.name,
            message: e.message
        });
        res.json(response_data);
    }
});

router.post('/getCity', function(req, res, next) {
    var body = req.body;
    var cpid =  body.cpid;
    var pref_param = body.pref;

    var response_data = {
        type: '005',
        data: [],
        error_message: 'おすすめが見つかりませんでした。'
    };

    if(pref_param != void 0) {
        var filter_option = {
            pref: pref_param
        };
        // console.log('Zipcode China get city filter: ', filter_option);

        try {
            ZipcodeChinas.find(filter_option, function(err, result) {
                // console.log('Zipcode China get city Total: ', result.length);
                if(result && result.length){
                    result.forEach(function (e) {
                        response_data.data.push({
                            value: e.city,
                            text: e.city
                        });
                    });
                }
                res.json(response_data);
            });

        } catch(e) {
            common.saveException(cpid, "Zipcode China get city", {
                requestData: {
                    pref: pref_param
                },
                name: e.name,
                message: e.message
            });
            res.json(response_data);
        }
    } else {
        res.json(response_data);
    }
});

router.post('/getPostal', function(req, res, next) {
    var body = req.body;
    var cpid =  body.cpid;
    var pref_param = body.pref;
    var city_param = body.city;

    var response_data = {
       postal: ''
    };

    if(pref_param != void 0 && city_param != void 0) {
        var filter_option = {
            pref: pref_param,
            city: city_param
        };
        // console.log('Zipcode China get postal code filter: ', filter_option);
        try {
            ZipcodeChinas.findOne(filter_option, function(err, result) {
                // console.log('Zipcode China get postal code result: ', result);
                if(result){
                    response_data.postal = result.postal;
                }
                res.json(response_data);
            });

        } catch(e) {
            common.saveException(cpid, 'Zipcode China get postal code', {
                requestData: {
                    pref: pref_param,
                    city: city_param
                },
                name: e.name,
                message: e.message
            });
            res.json(response_data);
        }
    } else {
        res.json(response_data);
    }
});


module.exports = router;
