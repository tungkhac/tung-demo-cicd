// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();

//Fjnext pulldown job
router.post('/getBukkenName', function(req, res, next){
    var body = req.body;
    console.log("getBukkenName=", body);
    var title =  typeof body.title !== "undefined" ? body.title : "";
    title = title.replace(/｜/g, "|");
    if(title.indexOf("【公式】") !== -1) {
        title = title.replace("【公式】", "");
    }
    var arr = title.split("|");
    title = arr[0];
    console.log("marimo", title);
    res.json({
        current_bukken_name: title
    });
});

module.exports = router;
