// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();
var data = require('../data/escrit.json');
const currencyFormatter = require('currency-formatter');

router.post('/getTotal', function (req, res, next) {
    var area = req.body.area;
    var style_value = req.body.style;
    var type_value = req.body.type;
    var total = getTotal(area, style_value, type_value);
    res.json({
        total: total.value,
        message: total.message
    });
});

var getTotal = (area, style_value, type_value) => {
    var total = 0;
    var message = [];
    if (data.style[area] === undefined) {
        message.push("Area not true");
    } else {
        if (data.style[area][style_value] === undefined) {
            message.push("Style value not true");
        } else {
            total += data.style[area][style_value];
        }
    }

    if (data.type[area] === undefined) {
        message.push("Area not true");
    } else {
        if (data.type[area][type_value] === undefined) {
            message.push("Type value not true");
        } else {
            total += data.type[area][type_value];
        }
    }

    return {
        message: message.join(" \n "),
        value: currencyFormatter.format(total, { code: 'JPY' })
    }
}

module.exports = router;
