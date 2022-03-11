// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by nguyen.khac.tung on 4/12/2019.
 */

var express = require('express');
var router = express.Router();
var common = require('../modules/common');
var model = require('../model');
const SpreadsheetEdsps = model.SpreadsheetEdsps;

router.post('/getPrice', function(req, res, next) {
    var body = req.body,
        maker_param = body.maker,
        car_param = body.car,
        rank_param = body.rank,
        distance_param = body.distance,
        cpid = body.cpid;

    var response_data = {
        price1: 0,
        price2: 0,
    };
    var rank_not_distance = ['6等級（初めて加入する）'];
    var filter_data = {};

    if(maker_param != void 0) {
        filter_data.maker = maker_param;
    }
    if(car_param != void 0) {
        filter_data.car = car_param;
    }
    if(rank_param != void 0) {
        filter_data.rank = rank_param;
    }
    if(distance_param != void 0 && rank_not_distance.indexOf(rank_param) == '-1') {
        filter_data.distance = distance_param;
    }

    console.log('Edsps Filter: ', filter_data);
    if(Object.keys(filter_data).length) {
        try {
            SpreadsheetEdsps.findOne(filter_data, function(err, result) {
                console.log('Edsps item result: ', result);
                if(err) {
                    console.log('Edsps get item error: ', err);
                }
                if(!err && result) {
                    response_data.price1 = result.price;
                    response_data.price2 = result.price_premium;
                }
                res.json(response_data);
            });
        } catch(e) {
            common.saveException(cpid, "GMO Point", {
                requestData: {
                    category: category_param,
                    project_type: project_type_param,
                    point_space: point_space_param
                },
                name: e.name,
                message: e.message
            });
            response_data.error_message = 'おすすめが見つかりませんでした。';
            res.json(response_data);
        }
    } else {
        res.json(response_data);
    }
});

module.exports = router;
