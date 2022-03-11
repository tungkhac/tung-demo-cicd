// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var request = require('request');
var querystring = require('querystring');
var base_url = 'http://www.able.co.jp/api/bkn/api/2.0/';
const url_require = require('url');

var list_param_key = {
    "inquiry": {
        "list_add": [
            "bkKey"
        ]
    },
    "rentproperty": {
        "list_add": [
            "bkKey"
        ]
    },
    "visit-reserve": {
        "list_add": [
            "bkKey"
        ]
    },
    "holiday": {
        "list_add": [
            "shopCd"
        ]
    }
}

var validateInput = (body, key, value_default = "") => {
    let result = value_default;
    if (typeof body[key] !== "undefined") {
        result = body[key];
    } else {
        console.log(" Don't have data input ---> " + key);
    }
    return result;
}

var getParam = (type, req) => {
    let result = {};
    if (list_param_key[type].list_add.length) {
        if (req.body["currentUrl"]) {
            var listKey = getKey(req.body["currentUrl"]);
            list_param_key[type].list_add.map(key => {
                result[key] = listKey[key];
            });
        }
    }
    switch (type) {
        case "inquiry":
            let inquiryContent1 = validateInput(req.body, "inquiryContent1");
            let inquiryContent1_format = "";
            switch (inquiryContent1) {
                case "物件情報":
                    inquiryContent1_format = "もっと物件の情報が欲しい";
                    break;

                case "初期費用":
                    inquiryContent1_format = "初期費用の概算が知りたい";
                    break;

                case "物件紹介":
                    inquiryContent1_format = "似た物件を紹介してほしい";
                    break;

                case "周辺環境":
                    inquiryContent1_format = "周辺環境が知りたい";
                    break;

                default:
                    break;
            }

            result.inquiryContents = inquiryContent1_format + '「' + validateInput(req.body, "inquiryContent2")+'」';
            result.inquirySource = "001";
            result.siteType = req.body.userDevice == "mobile" ? "2" : "1";
            result.name = validateInput(req.body, "name");
            result.mail = validateInput(req.body, "mail");
            break;

        case "rentproperty":
            result.specifiedShop = true;
            break;

        case "visit-reserve":
            result.visitDay = formatDay(validateInput(req.body, "visitDay"));
            result.visitTime = validateInput(req.body, "visitTimeHour") + validateInput(req.body, "visitTimeMinus");
            result.inquirySource = "001";
            result.siteType = req.body.userDevice == "mobile" ? "2" : "1";
            result.name = validateInput(req.body, "name");
            result.mail = validateInput(req.body, "mail");
            result.rent = validateInput(req.body, "rent");
            result.hopeComment = validateInput(req.body, "hopeComment");
            break;

        case "holiday":
            let monthInfo = generateMonthHoliday();
            result.startMonth = monthInfo.startMonth;
            result.endMonth = monthInfo.endMonth;
            break;

        default:
            break;
    }
    return result;
}

var postRequest = (url, param) => {
    let formData = querystring.stringify(param);
    return new Promise(function (resolve, reject) {
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: url,
            body: formData
        }, function (error, response, body) {
            if (error)
                reject(error)
            else {
                resolve(JSON.parse(body));
            }
        });
    });
}

var formatDay = (input) => {
    let listDate = input.split("-");
    if (listDate.length == 3) {
        return `${listDate[2]}${listDate[1]}${listDate[0]}`;
    } else {
        return input;
    }
}

var formatClosingDay = (input) => {
    let listResult = input.split("T");
    if (listResult.length == 2) {
        return listResult[0];
    } else {
        return input;
    }
}

var generateMonthHoliday = () => {
    let d = new Date();
    let currentMonth = d.getMonth() + 1;
    let startMonth = currentMonth > 10 ? currentMonth : '0' + (currentMonth);
    let startYear = d.getFullYear();
    let endMonth = (currentMonth)+3;
    let endYear = startYear;
    switch (currentMonth) {
        case 10:
        case 11:
        case 12:
            endMonth = (currentMonth+3)%12;
            endYear = startYear + 1;
            break;
    
        default:
            break;
    }
    endMonth = endMonth > 10 ? endMonth : '0' + endMonth;
    return {
        startMonth: `${startYear}${startMonth}`,
        endMonth: `${endYear}${endMonth}`,
    }
}

var chintaiGetCode = (url) => {
    url = decodeURI(url);
    var val1 = url.match(/bk-{1}[0-9a-zA-Z]+/g);
    var val2 = url.match(/w-{1}[0-9a-zA-Z]+/g);
    var val3 = url.match(/Detail.do\?bk={1}[0-9a-zA-Z]+/g);
    if (val1 !== null) {
        return val1[0].replace("bk-", "");
    } else if (val2 !== null) {
        return val2[0].replace("w-", "");
    } else if (val3 !== null) {
        return val3[0].replace("Detail.do\?bk=", "");
    }
    return "";
}

var chintaiGetCodeSP = (url) => {
    var shop_id = "";
    var bukken_id = "";
    var room_id = "";

    if (url != void 0) {
        var url_parts = url_require.parse(url);
        if(url_parts && url_parts.query){
            var arr = url_parts.query.split("&");
            if(arr.length > 0){
                for(var i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf("shop_id") !== -1) {
                        shop_id = arr[i].split("=")[1];
                    } else if (arr[i].indexOf("bukken_id") !== -1) {
                        bukken_id = arr[i].split("=")[1];
                    } else if (arr[i].indexOf("room_id") !== -1) {
                        room_id = arr[i].split("=")[1];
                    }
                }
            }
        }
    }
    var bk = shop_id + "|" + bukken_id + "|" + room_id;
    return {
        "bkKey" : bk,
        "shopCd" : shop_id
    }
};


var errorResolve = (res, error) => {
    console.log('err', error);
    res.status(500).json({
        message: "Data return not true, check data input"
    });
}

var getKey = (url) => {
    let info = chintaiGetCodeSP(url);
    if(info.shopCd && info.shopCd.length > 0){
        return info;
    }

    let chintaiCode = chintaiGetCode(url);
    let shopCd = "";
    let bkKey = "";
    if (chintaiCode && chintaiCode.length == 18) {
        shopCd = chintaiCode.slice(0, 9);
        let bkCd = chintaiCode.slice(9, 15);
        let roomNo = chintaiCode.slice(15, 18);
        bkKey = `${shopCd}|${bkCd}|${roomNo}`;
    }
    return {
        shopCd: shopCd,
        bkKey: bkKey
    }
}

class chintaiRouter {
    constructor() {
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/inquiry', async (req, res, next) => {
            let url = base_url + 'update/rentproperties/inquiry';
            let param = getParam("inquiry", req);
            postRequest(url, param)
                .then(body => {
                    let uuid = "";
                    let wrongAccountFlg = "";
                    let transactionId = "";
                    let shopCd = "";
                    let bkCd = "";
                    let roomNo = "";
                    let printing = "";
                    let message = [];
                    if (typeof req.body.currentUrl === 'undefined') {
                        message.push("dont have variable currentUrl");
                    }
                    if (body) {
                        uuid = (typeof body.uuid !== 'undefined') ? body.uuid : "";
                        wrongAccountFlg = (typeof body.wrongAccountFlg !== 'undefined') ? body.wrongAccountFlg : "";
                        transactionId = (typeof body.transactionId !== 'undefined') ? body.transactionId : "";
                        if (body.rentpropertyPrintingInfo && Array.isArray(body.rentpropertyPrintingInfo) && body.rentpropertyPrintingInfo.length > 0) {
                            let rentpropertyPrintingInfo = body.rentpropertyPrintingInfo[0];
                            shopCd = (typeof rentpropertyPrintingInfo.shopCd !== 'undefined') ? rentpropertyPrintingInfo.shopCd : "";
                            bkCd = (typeof rentpropertyPrintingInfo.bkCd !== 'undefined') ? rentpropertyPrintingInfo.bkCd : "";
                            roomNo = (typeof rentpropertyPrintingInfo.roomNo !== 'undefined') ? rentpropertyPrintingInfo.roomNo : "";
                            printing = (typeof rentpropertyPrintingInfo.printing !== 'undefined') ? rentpropertyPrintingInfo.printing : "";
                        } else {
                            message.push("api return rentpropertyPrintingInfo null");
                        }
                    } else {
                        message.push("api return body null");
                    }
                    res.json({
                        uuid: uuid,
                        wrongAccountFlg: wrongAccountFlg,
                        transactionId: transactionId,
                        shopCd: shopCd,
                        bkCd: bkCd,
                        roomNo: roomNo,
                        printing: printing,
                        message_error: message.join(" \n ")
                    });
                })
                .catch(error => {
                    errorResolve(res, error);
                })
        });

        this.router.post('/rentproperty', (req, res, next) => {
            let url = base_url + 'rentproperty';
            let param = getParam("rentproperty", req);
            postRequest(url, param)
                .then(body => {
                    let agencyShopCd = "";
                    let agencyBkCd = "";
                    let agencyRoomNo = "";
                    let agencyImgCnt = "";
                    let agencyImgCategoryCnt = "";
                    let agencyUketsukeCd = "";
                    let shopName = "";
                    let init_price = "0円";
                    let printing = "";
                    let message = [];
                    if (typeof req.body.currentUrl === 'undefined') {
                        message.push("Dont have variable currentUrl");
                    }
                    if (body && Array.isArray(body) && body.length > 0) {
                        let row = body[0];
                        printing = (typeof row.printing !== 'undefined') ? row.printing : "";
                        if (row.rentPropertyCommentInfo && Array.isArray(row.rentPropertyCommentInfo) && row.rentPropertyCommentInfo.length > 0) {
                            let rentPropertyCommentInfo = row.rentPropertyCommentInfo.find(item => item.commentKbn === "01");
                            console.log("rentPropertyCommentInfo", rentPropertyCommentInfo);
                            //rentPropertyCommentInfo = "初期費用概算：120000円。インターネット接続料無料。敷金・礼金なし。ペット応相談。システムキッチン。";
                            if (rentPropertyCommentInfo && rentPropertyCommentInfo.commentText && rentPropertyCommentInfo.commentText.indexOf("初期費用概算") !== -1) {
                                console.log("rentPropertyCommentInfo.commentText", rentPropertyCommentInfo.commentText);
                                var arr = rentPropertyCommentInfo.commentText.split("。");
                                for(var k = 0; k < arr.length ; k++){
                                    if(arr[k].indexOf("初期費用概算") !== -1){
                                        arr[k] = arr[k].replace("初期費用概算：", "");
                                        arr[k] = arr[k].replace("初期費用概算", "");
                                        init_price = arr[k];
                                        break;
                                    }
                                }
                                console.log("init_price", init_price);
                                //init_price = rentPropertyCommentInfo.hiyoKin + rentPropertyCommentInfo.hiyoTan;
                            } else {
                                message.push(" Cant find rentPropertyHiyoInfo with hiyoname is  初期費用概算")
                            }
                        }

                        console.log("init_price=", init_price);
                        //
                        //if (row.rentPropertyHiyoInfo && Array.isArray(row.rentPropertyHiyoInfo) && row.rentPropertyHiyoInfo.length > 0) {
                        //    let rentPropertyHiyoInfo = row.rentPropertyHiyoInfo.find(item => item.hiyoname === "初期費用概算");
                        //    if (rentPropertyHiyoInfo) {
                        //        init_price = rentPropertyHiyoInfo.hiyoKin + rentPropertyHiyoInfo.hiyoTan;
                        //    } else {
                        //        message.push(" Cant find rentPropertyHiyoInfo with hiyoname is  初期費用概算")
                        //    }
                        //}
                        if (row.agencyShopInfo && Array.isArray(row.agencyShopInfo) && row.agencyShopInfo.length > 0) {
                            let agencyShopInfo = row.agencyShopInfo[0];
                            agencyShopCd = (typeof agencyShopInfo.agencyShopCd !== 'undefined') ? agencyShopInfo.agencyShopCd : "";
                            shopName = (typeof agencyShopInfo.shopName !== 'undefined') ? agencyShopInfo.shopName : "";
                            agencyBkCd = (typeof agencyShopInfo.agencyBkCd !== 'undefined') ? agencyShopInfo.agencyBkCd : "";
                            agencyRoomNo = (typeof agencyShopInfo.agencyRoomNo !== 'undefined') ? agencyShopInfo.agencyRoomNo : "";
                            agencyImgCnt = (typeof agencyShopInfo.agencyImgCnt !== 'undefined') ? agencyShopInfo.agencyImgCnt : "";
                            agencyImgCategoryCnt = (typeof agencyShopInfo.agencyImgCategoryCnt !== 'undefined') ? agencyShopInfo.agencyImgCategoryCnt : "";
                            agencyUketsukeCd = (typeof agencyShopInfo.agencyUketsukeCd !== 'undefined') ? agencyShopInfo.agencyUketsukeCd : "";
                        } else {
                            message.push("api return agencyShopInfo null");
                        }
                    } else {
                        message.push("api return body null");
                    }
                    res.json({
                        shopName: shopName,
                        init_price: init_price,
                        printing: printing,
                        agencyShopCd: agencyShopCd,
                        agencyBkCd: agencyBkCd,
                        agencyRoomNo: agencyRoomNo,
                        agencyImgCnt: agencyImgCnt,
                        agencyImgCategoryCnt: agencyImgCategoryCnt,
                        agencyUketsukeCd: agencyUketsukeCd,
                        message_error: message.join(" \n ")
                    });
                })
                .catch(error => {
                    errorResolve(res, error);
                })
        });

        this.router.post('/visit-reserve', (req, res, next) => {
            let url = base_url + 'update/rentproperties/visit-reserve';
            let param = getParam("visit-reserve", req);

            postRequest(url, param)
                .then(body => {
                    let uuid = "";
                    let wrongAccountFlg = "";
                    let transactionId = "";
                    let shopCd = "";
                    let bkCd = "";
                    let roomNo = "";
                    let printing = "";
                    let message = [];
                    if (typeof req.body.currentUrl === 'undefined') {
                        message.push("dont have variable currentUrl");
                    }
                    if (body) {
                        uuid = (typeof body.uuid !== 'undefined') ? body.uuid : "";
                        wrongAccountFlg = (typeof body.wrongAccountFlg !== 'undefined') ? body.wrongAccountFlg : "";
                        transactionId = (typeof body.transactionId !== 'undefined') ? body.transactionId : "";
                        if (body.rentpropertyPrintingInfo && Array.isArray(body.rentpropertyPrintingInfo) && body.rentpropertyPrintingInfo.length > 0) {
                            let rentpropertyPrintingInfo = body.rentpropertyPrintingInfo[0];
                            shopCd = (typeof rentpropertyPrintingInfo.shopCd !== 'undefined') ? rentpropertyPrintingInfo.shopCd : "";
                            bkCd = (typeof rentpropertyPrintingInfo.bkCd !== 'undefined') ? rentpropertyPrintingInfo.bkCd : "";
                            roomNo = (typeof rentpropertyPrintingInfo.roomNo !== 'undefined') ? rentpropertyPrintingInfo.roomNo : "";
                            printing = (typeof rentpropertyPrintingInfo.printing !== 'undefined') ? rentpropertyPrintingInfo.printing : "";
                        } else {
                            message.push("api return rentpropertyPrintingInfo null");
                        }
                    } else {
                        message.push("api return body null");
                    }
                    res.json({
                        uuid: uuid,
                        wrongAccountFlg: wrongAccountFlg,
                        transactionId: transactionId,
                        shopCd: shopCd,
                        bkCd: bkCd,
                        roomNo: roomNo,
                        printing: printing,
                        message_error: message.join(" \n ")
                    });
                })
                .catch(error => {
                    errorResolve(res, error);
                })
        });

        this.router.post('/holiday', (req, res, next) => {
            let url = base_url + 'shop/holiday';
            let param = getParam("holiday", req);
            postRequest(url, param)
                .then(body => {
                    var message = [];
                    if (typeof req.body.currentUrl === 'undefined') {
                        message.push("dont have variable currentUrl");
                    }
                    let dataRes = {
                        "mode": "unavailable",
                        "date": [],
                        "message_error": message.join(" \n ")
                    }
                    if (body && Array.isArray(body) && body.length > 0) {
                        dataRes = {
                            "mode": "unavailable",
                            "date": body.filter((item) => { return item.closingDay }).map(d => {
                                return formatClosingDay(d.closingDay);
                            }),
                            "message_error": message.join(" \n ")
                        }
                    } else {
                        message.push("api return body null");
                        dataRes.message_error = message.join(" \n ");
                    }
                    res.json(dataRes);
                })
                .catch(error => {
                    errorResolve(res, error);
                })
        });

    }
}

module.exports = new chintaiRouter().router;
