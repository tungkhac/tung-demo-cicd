var express = require('express');
var router = express.Router();

const _brand_list = {
    canifa: 'Canifa 7',
    giditex: 'Giditex',
    vinatex: 'Vinatex',
    hanosimex: 'Hanosimex',
    viettien: 'Việt Tiến',
    songhong: 'Sông Hồng',
    may_10: 'May 10',
    det_10: 'Dệt 10/10',
    nhabe: 'Nhà Bè - NBC'
};

router.get('/brand', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.status(200).json({
        success: true,
        data: _brand_list,
    });
});


module.exports = router;
