// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var express = require('express');
var router = express.Router();
var model = require('../model');
const ApiOkurahome = model.ApiOkurahomeSchema;

const  testData = [
    "《公式》オークラホーム折立｜宮城県仙台市青葉区折立 | 株式会社大倉の分譲住宅",
    "《公式》オークラホーム名取愛島台｜宮城県名取市愛島台 | 株式会社大倉の分譲住宅",
    "《公式》オークラホームさいたま八王子｜埼玉県さいたま市 | 株式会社大倉の分譲住宅",
    "《公式》オークラホーム六町｜東京都足立区 | 株式会社大倉の分譲住宅",
    "《公式》オークラホーム習志野藤崎｜千葉県佐倉市 | 株式会社大倉の分譲住宅",
    "《公式》オークラホームユーカリが丘｜千葉県佐倉市 | 株式会社大倉の分譲住宅",
    "《公式》オークラホーム七里東宮下｜埼玉県さいたま市 | 株式会社大倉の分譲住宅",
    "《公式》オークラホーム浦和美園｜埼玉県さいたま市岩槻区尾ヶ崎新田 | 株式会社大倉の分譲住宅",
    "《公式》オークラホーム西大宮高木 ラ・プリエール｜埼玉県さいたま市西区高木 | 株式会社大倉の分譲住宅",
    "【公式】オークラホーム　鶴瀬 ～希望の街～ | 株式会社大倉の新築分譲住宅",
    "《公式》オークラホーム北上尾｜埼玉県上尾市 | 株式会社大倉の分譲住宅",
    "《公式》オークラホームひばりヶ丘｜埼玉県新座市 | 株式会社大倉の新築一戸建て・分譲住宅",
    "公式｜OKURA HOME TAKETOYO4 | オークラホーム 武豊4 株式会社大倉の新築分譲住宅",
    "公式｜OKURA HOME Gardens UZURA2 | オークラホームガーデンズ　鶉Ⅱ 株式会社大倉の新築分譲住宅",
    "公式｜OKURA HOME AISAI2 | オークラホーム 愛西2 株式会社大倉の新築分譲住宅",
    "公式｜OKURA HOME HASHIMAMASAKICHOⅣ | オークラホーム 羽島福寿町Ⅳ 株式会社大倉の新築分譲住宅",
    "公式｜OKURA HOME Gardens OGAKIGAMA | オークラホームガーデンズ 大垣河間 株式会社大倉の新築分譲住宅",
    "公式｜OKURA HOME KONAN2 | オークラホーム 江南2 株式会社大倉の新築分譲住宅",
    "公式｜OKURA HOME Gardens OKUCHO2 | オークラホームガーデンズ 奥町2 株式会社大倉の新築分譲住宅",
    "公式｜OKURA HOME HANDA5 | オークラホーム 半田5 株式会社大倉の新築分譲住宅",
    "公式｜OKURA HOME NORITAKE6| オークラホーム 則武6 株式会社大倉の新築分譲住宅",
    "オークラホーム 宇治木幡Ⅱ",
    "オークラホーム吹田山田西",
    "オークラホーム 山科椥辻",
    "オークラホーム六地蔵",
    "オークラホーム 西向日",
    "オークラホーム 山科勧修寺",
    "オークラホーム宇多野",
    "オークラホーム 醍醐寺",
    "オークラホーム 宇治三室戸",
    "オークラホーム 醍醐古道",
    "オークラホーム 高槻奧天神",
    "オークラホーム甲陽園 閑静な文教地区 甲陽園アドレス、誕生。",
    "オークラホーム 池田旭丘",
    "オークラホーム 田口II",
    "オークラホーム 池田渋谷 自由設計の家",
    "オークラホーム吹田藤が丘",
    "ガーデンタウンさつき台 | 和歌山県橋本市の新築一戸建て分譲住宅｜御幸辻駅から徒歩6分の自然豊かな街",
    "三田ガーデンタウンつつじヶ丘",
    "【兵庫県三木市】みなぎ台の注文住宅用分譲地 | 子育て家族にオススメ",
    "オークラホーム泉田｜オークラホーム岡山支店",
    "オークラホーム雄町Ⅲ｜オークラホーム岡山支店",
    "オークラホーム大島｜オークラホーム岡山支店",
    "オークラホーム西大寺中野Ⅱ｜オークラホーム岡山支店",
    "オークラホーム藤崎Ⅱ｜オークラホーム岡山支店",
    "オークラホーム瀬戸町瀬戸III｜オークラホーム岡山支店",
    "オークラホーム浜ノ茶屋｜オークラホーム岡山支店"
];

/*GET calendar*/
router.post('/getBukken', function(req, res, next){
    var body = req.body;
    var bukken_name = getBukkenname(body.title);
    res.json({bukken_name : bukken_name});
});

router.get('/getBukkenTest', function(req, res, next){

    //res.json({"ss" : "sdasds'"});

    //res.status(200).("sss");

    var result = [];
    for(var i = 0; i < testData.length; i++){
        //console.log(testData[i]);
        result.push(getBukkenname(testData[i]));
        result.push(testData[i]);
        result.push("<br /><br />");
    }
    res.status(200).send(result.join("<br />"));
});

router.post('/getBukkenName', function(req, res, next){
    var body = req.body;
    var current_url_title = body.current_url_title;
    var bukken_name = '';
    ApiOkurahome.findOne({title: current_url_title}, function(err, result) {
        if (err) throw err;
        if(result){
            bukken_name = result.bukken_name;
        }
        res.json({bukken_name : bukken_name});
    });
});

function getBukkenname(title){
    var result = "";

    //title = title.replace(" | ", "|");
    //title = title.replace("| ");
    title = title.replace(/｜/g, "|");


    if(title.indexOf("《公式》") > -1){
        title = title.replace("《公式》", "");
        var arr = title.split("|");
        if(arr.length > 0){
            result = arr[0].trim();
            if(result.indexOf("オークラホーム西大宮高木") > -1){
                result = "オークラホーム西大宮高木";
            }else if(result.indexOf("オークラホーム浦和美園") > -1){
                result = "オークラホーム浦和美園　6";
            }
        }
    }else if(title.indexOf("【公式】") > -1){
        title = title.replace("【公式】", "");
        var arr2 = title.split("|");
        if(arr2.length > 0){
            result = arr2[0];
        }
    }else if(title.indexOf("公式|") > -1){
        title = title.replace("公式|", "");
        //title = title.replace(/|/, "|");

        title = title.trim();
        //console.log(title);
        var arr3 = title.split("|");
        //console.log(arr3);
        //return "";
        if(arr3.length > 0){
            result = arr3[1].trim();
            result = result.replace("　", " ");
            result = result.replace(" ", "");
            //result = result.replace("　", "");

            var tmp_arr3 = result.split(" ");
            //console.log(tmp_arr3);
            if(tmp_arr3.length > 0){
                result = tmp_arr3[0];
                result = result.replace(/[0-9I-XⅡⅢⅣ]/gi, "");
            }

        }
    }else{
        title = title.trim();
        //console.log(title);
        var arr4 = title.split("|");
        //if(title.indexOf("ガーデンタウンさつき台") > -1){
        //    console.log(arr4);
        //    return "";
        //}
        if(arr4.length > 1){
            result = arr4[0];
            result = result.replace(/[0-9I-XⅡⅢⅣ]/gi, "");
        }else{
            result = arr4[0];
            if(result.indexOf("みなぎ台の注文住宅用") > -1){
                result = "吉川ニュータウン美奈木台";
            }else if(result.indexOf("オークラホーム甲陽園") > -1){
                result = "オークラホーム甲陽園　10";
            }else{
                result = result.replace("　", " ");
                result = result.replace(" ", "");
                var arr5 = result.split(" ");
                result = arr5[0];
            }
            result = result.replace(/[Ⅱ]/gi, "");
        }
    }
    return result.trim();
}

module.exports = router;
