// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();

var model = require('../model');
const Exception = model.Exception;
const EfoPOrderHistory = model.EfoPOrderHistory;
const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');

router.get('/detail', function(req, res, next) {
    var query = req.query;
    var cpid =  query.cpid;
    var uid =  query.uid;
    var response_data = {
        'gmo_status' : '',
        'cv_date' : '',
        'order_date' : '',
        "order_id" : ""
    };
    // console.log('Efo get p order history: ', cpid, uid);
    if(cpid != void 0 && cpid != '' && uid != void 0 && uid != '') {
        try {
            EfoPOrderHistory.find({'connect_page_id': cpid, 'user_id': uid}, function(err, result) {
                // console.log('Efo p order history result: ', result);
                if(result && result.length) {
                    var data_forward = 'null',
                        data_approve = 'null';

                    for (let i=0; i<result.length; i++) {
                        var item = result[i];
                        response_data.order_id = item.order_id;
                        if(item.data != void 0 && typeof item.data == 'object' && Object.keys(item.data).length) {
                            var item_data = item.data;

                            if(item_data.Forward != void 0) {
                                data_forward = item_data.Forward;
                            }
                            if(item_data.Approve != void 0) {
                                data_approve = item_data.Approve;
                            }
                            response_data.cv_date = moment(item.created_at).tz(TIMEZONE).format("YYYY-MM-DD");
                            response_data.order_date = moment(item.created_at).tz(TIMEZONE).format("YYYY-MM-DD HH:mm:ss");
                            break;
                        }
                    }

                    if(data_forward != 'null' || data_approve != 'null') {
                        response_data.gmo_status = 's:7:"Forward";s:7:"' + data_forward + '";s:7:"Approve";s:7:"' + data_approve + '";';
                    }

                    res.json(response_data);
                } else {
                    res.json(response_data);
                }
            });

        } catch(e) {
            saveException(cpid, "Efo order history", {
                requestData: {
                    uid: uid
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

function saveException(cpid, sub_type, err){
    var now = new Date();
    var exception = new Exception({
        err: err,
        cpid: cpid,
        type: "002",
        sub_type: sub_type,
        push_chatwork_flg: 0,
        created_at : now,
        updated_at : now
    });
    exception.save(function(err) {
    });
}


module.exports = router;
