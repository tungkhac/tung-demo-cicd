// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();
var model = require('../model');
const Exception = model.Exception;
const EfoCv = model.EfoCv;

router.post('/getEmail', function(req, res, next) {
    var body = req.body;
    var connect_page_id = body.connect_page_id;
    var response = {mail: 'king-koenji@tas-net.jp'};
    EfoCv.find({connect_page_id: connect_page_id, cv_flg: 1}).count(function (err, count){
        var mode = count % 5;
        var mail = '';
        switch (mode) {
            case 0:
                mail = 'king-koenji@tas-net.jp';
                break;
            case 1:
                mail = 'King-okubo@shopping2.gmobb.jp';
                break;
            case 2:
                mail = 'king-asagaya@tas-net.jp';
                break;
            case 3:
                mail = 'soshigaya@atgo.co';
                break;
            case 4:
                mail = 'suzukato2012@gmail.com';
                break;
        }
        response.mail = mail;
        res.json(response);
    });
});

module.exports = router;
