// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var model = require('../model');
const request = require('request');
const CustomKarubiP2ProductInfo = model.CustomKarubiP2ProductInfo;
const CustomKarubiP2Categories = model.CustomKarubiP2Categories;
const TOKEN_AUTHEN = "Basic bGluZWJvdDpvZmdqJGowOTJqa2hmMmUj";
const SEARCH_STORE_URL = "http://es-sg-yv71hqhnh00046w8m.public.elasticsearch.aliyuncs.com:9200/distribution_*/_search";
const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
const URL_IMG_DEFAUL = "https://botchan.blob.core.windows.net/production/uploads/5def0b6ba24a619db81457db/thumbnail/5e15551f25958.png";
const STEP = 3000;
const START = 2000;
var geolib = require('geolib');
var Parent = require('./parent.class');
function encodeBase64(value) {
    var encoded = Buffer.from(value).toString('base64');
    return encoded;
}

class karubiP2Router extends Parent {
    constructor() {
        super();
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/search_product', async (req, res, next) => {
            let list_key = ["category", "sub_category", "current_id_scenario", "connect_id_scenario_store", "connect_id_scenario_product", "product_code_and_name_id", "product_calo_id"];
            let data = this.getDataInput(list_key, req.body);
            if(data.category == "新商品"){
                data.sub_category = "ー";
            }
            console.log("API search_product ---> ", req.body);
            var current_date = moment().tz(TIMEZONE).format("YYYY-MM-DD");
            console.log('current_Date', current_date);
            var message = [];
            try {
                var product_infor = await CustomKarubiP2Categories.find({
                    "category": data.category,
                    "sub_category": data.sub_category,

                }, (err, result) => {
                    if (err) {
                        console.log('Have error when get list product', err);
                    }
                }).select("list_product");
                var list_product = product_infor ? product_infor[0] ? product_infor[0].list_product : [] : [];
                // let list_show =  await CustomKarubiP2ProductInfo.aggregate([
                //     {
                //         $project: {
                //             start_date: { $dateToString: { format: "%Y-%m-%d", date: "$start_date" } },
                //             end_date: { $dateToString: { format: "%Y-%m-%d", date: "$end_date" } },
                //         },
                //     },
                //     {
                //         $match: {
                //             "start_date": {
                //                 $lt: current_date
                //             },
                //             "end_date": {
                //                 $gte: current_date
                //             }
                //         }
                //     }
                // ], async (err, result) => {
                //     if (err) throw err
                //     console.log('result is ', result);
                // });
                console.log("list product", list_product);
                let list_show = await CustomKarubiP2ProductInfo.find({
                    "product_code": {
                        "$in": list_product
                    },
                    "start_date": {
                        $lt: current_date
                    },
                    "end_date": {
                        $gte: current_date
                    }
                }, (err, result) => {
                    if (err) {
                        console.log('Have error when get list school', err);
                    }
                }).sort({ _id: 1 });

                var message_carousel = {
                    "type": "template",
                    "altText": "This is a carousel template",
                    "template": {
                        "type": "carousel",
                        "columns": [
                        ],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                    }
                }

                list_show.forEach((element, index) => {
                    let title = element.product_name;
                    if (title.length > 40) {
                        title = title.slice(0, 35) + "..."
                    }
                    let description = element.description || "...";
                    if (description.length > 60) {
                        description = description.slice(0, 55) + "..."
                    }
                    let infor_calorie = element.infor_calorie || "...";
                    let url_img = element.image_url || URL_IMG_DEFAUL
                    let t_mesage = {
                        "thumbnailImageUrl": url_img,
                        "imageBackgroundColor": "#FFFFFF",
                        "title": title,
                        "text": description,
                        "actions": [
                            {
                                "type": "postback",
                                "label": "栄養成分表示 を見る",
                                "data": `BSCENARIO_${data.current_id_scenario}_${data.connect_id_scenario_product}_${data.product_calo_id}_${encodeBase64(infor_calorie)}`,
                                "displayText": "栄養成分表示 を見る"
                            },
                            {
                                "type": "uri",
                                "label": "もっと詳しく見る",
                                "uri": element.url || "https://www.google.com/"
                            },
                            {
                                "type": "postback",
                                "label": "近くの販売店を探す",
                                "data": `BSCENARIO_${data.current_id_scenario}_${data.connect_id_scenario_store}_${data.product_code_and_name_id}_${encodeBase64(element.product_code + "$B" + title)}`,
                                "displayText": "近くの販売店を探す"
                            }
                        ]
                    };
                    message_carousel.template.columns.push(t_mesage);
                });

                if (!message_carousel.template.columns.length) {
                    let text_show_null = {
                        "type": "text",
                        "text": `データがありません`
                    };
                    message.push(text_show_null);
                } else {
                    if (!data.continues_offset) {
                    }
                    let first_text = {
                        "type": "text",
                        "text": `現在、${message_carousel.template.columns.length}点の商品をご紹介しています`
                    };
                    message.push(first_text);
                    message.push(message_carousel);
                }

                res.json({
                    message: message
                });

            } catch (error) {
                console.log('Have error', error);
                res.status(500).json({
                    error_message: "Have error "
                })
            }
        });

        this.router.post('/infor_calorie', async (req, res, next) => {
            let list_key = ["infor_calorie"];
            let data = this.getDataInput(list_key, req.body);
            console.log("API detail_product ---> ", req.body);
            var message = [];
            try {
                let text_show = {
                    "type": "text",
                    "text": data.infor_calorie
                };
                message.push(text_show);

                res.json({
                    message: message
                });

            } catch (error) {
                console.log('Have error', error);
                res.status(500).json({
                    error_message: "Have error "
                })
            }
        });

        this.router.post('/getProductInfo', async (req, res, next) => {
            var body = req.body;
            console.log(body);
            var product_info = typeof body.product_code_and_name !== "undefined" ? body.product_code_and_name : "";
            var arr = product_info.split("$B");
            console.log(arr);
            if(arr.length == 2){
                res.json({
                    product_code: arr[0],
                    product_name: arr[1]
                });
            }else{
                res.json({
                    product_code: product_info,
                    product_name: ''
                });
            }
        });

        this.router.post('/search_store', async (req, res, next) => {
            let list_key = ["start_id_scenario", "current_id_scenario", "connect_id_scenario", "count", "product_code", "user_lat", "user_long", "resend_location_scenario_id"];
            let data = this.getDataInput(list_key, req.body);
            console.log("API search_store ---> ", req.body);

            let headers = {
                'Authorization': TOKEN_AUTHEN,
                'content-type': 'application/json'
            }

            var count = parseInt(data.count);
            let distance = (START + STEP * count) + "m";
            console.log('distance is ---> ',  distance);

            var bodyData = {
                "query": {
                    "bool": {
                        "must": [
                            {
                                "terms":
                                {
                                    "cd_art": [data.product_code]
                                }
                            },
                            {
                                "geo_distance":
                                {
                                    "distance": distance,
                                    "store_location": {
                                        "lat": data.user_lat,
                                        "lon": data.user_long
                                    }
                                }
                            }
                        ]
                    }
                },
                "_source": ["id", "cd_jan", "nm_art", "id_shp", "cd_postal", "nm_shp", "tx_address", "cd_phone", "store_location", "dt_create"],
                "sort": [
                    {
                        "_geo_distance": {
                            "store_location": {
                                "lat": data.user_lat,
                                "lon": data.user_long
                            },
                            "order": "asc",
                            "unit": "m"
                        }
                    }
                ],
                "aggs": {
                    "store_bucket": {
                        "terms": {
                            "field": "id_shp"
                        },
                        "aggs": {
                            "top_tag_hits": {
                                "top_hits": {
                                    "size": 5,
                                    "_source": ["cd_art", "dt_primary", "nu_pac"]
                                }
                            }
                        }
                    }
                }
            }
            request.post({
                url: SEARCH_STORE_URL,
                body: bodyData,
                headers: headers,
                json: true
            }, (error, response, body) => {
                if (error || body.error) {
                    var error_message = (body && body.status && body.status == 400) ? body.error.reason : "have error"
                    console.log("error", error, error_message);
                    res.status(500).json({
                        error_message: error_message
                    })
                } else {
                    this.showListStore(body, data, count, res);
                }
            });
        });

        this.router.post('/select_sub_category', async (req, res, next) => {
            let list_key = ["category", "current_id_scenario", "connect_id_scenario", "variable_id"];
            let data = this.getDataInput(list_key, req.body);
            console.log("API select_sub_category ---> ", req.body);
            try {
                var list_sub_category = await CustomKarubiP2Categories.find({
                    "category": data.category
                }, (err, result) => {
                    if (err) {
                        console.log('Have error when get list category', err);
                    }
                }).sort({_id:1});

                let message_carousel = {
                    "type": "template",
                    "altText": "This is a carousel template",
                    "template": {
                        "type": "carousel",
                        "columns": [
                        ],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                    }
                }

                list_sub_category.forEach((item, index) => {
                    let title = item.sub_category;
                    if (title.length > 40) {
                        title = title.slice(0, 35) + "..."
                    }
                    item.description = item.description || "...";
                    let url_img = item.category_img_url || URL_IMG_DEFAUL;
                    let t_mesage = {
                        "imageBackgroundColor": "#FFFFFF",
                        "title": title,
                        "text": item.description,
                        "defaultAction": {
                            "type": "postback",
                            "label": item.sub_category,
                            "displayText": title,
                            "data": `BQUICK_REPLIES_${data.current_id_scenario}_${data.connect_id_scenario}_${data.variable_id}_${encodeBase64(item.sub_category)}`
                        },
                        "actions": [
                            {
                                "type": "postback",
                                "label": item.sub_category,
                                "displayText": title,
                                "data": `BQUICK_REPLIES_${data.current_id_scenario}_${data.connect_id_scenario}_${data.variable_id}_${encodeBase64(item.sub_category)}`
                            }
                        ]
                    };
                    // if (data.category == "形状") {
                        t_mesage["thumbnailImageUrl"] = url_img;
                    // }
                    message_carousel.template.columns.push(t_mesage);
                });
                res.json({
                    message: [message_carousel]
                });
            } catch (error) {
                console.log('Have error when get list area', error);
                res.status(500).json({
                    error_message: "Have error when get list area"
                })
            }
        });

        this.router.post('/select_category', async (req, res, next) => {
            let list_key = ["current_id_scenario", "connect_id_scenario", "variable_id"];
            console.log("API select_category ---> ", req.body);
            let data = this.getDataInput(list_key, req.body);
            var result_return = {
                "type": "text",
                "text": "調べたいジャンルを選んでください",
                "quickReply": {
                    "items": []
                }
            };
            try {
                var list_item_select = await CustomKarubiP2Categories.aggregate([
                    { $sort : { created_at : -1 } },
                    { $group : {_id : "$category"  } }
                ]);
                list_item_select = list_item_select && list_item_select.length ? list_item_select.map(item =>  item._id) : [];
                // var list_item_select = [
                //     "食感", "味", "形状", "新商品", "シーン", "袋形状"
                // ];

                list_item_select.forEach(item => {
                    result_return.quickReply.items.push({
                        "type": "action",
                        "action": {
                            "type": "postback",
                            "label": item,
                            "displayText": item,
                            "data": `BQUICK_REPLIES_${data.current_id_scenario}_${data.connect_id_scenario}_${data.variable_id}_${encodeBase64(item)}`
                        }
                    });
                });
                res.json({
                    message: result_return
                });
            } catch (error) {
                console.log('Have error when get list area', error);
                res.status(500).json({
                    error_message: "Have error when get list area"
                })
            }
        });
    }

    showListStore(data, input, count, res) {
        console.log(JSON.stringify(data, null, 2));

        var message = [];
        var list_store = data && data.hits ? data.hits.hits : [];
        let message_carousel = {
            "type": "template",
            "altText": "This is a carousel template",
            "template": {
                "type": "carousel",
                "columns": [
                ],
                "imageAspectRatio": "rectangle",
                "imageSize": "cover"
            }
        }

        var list_key = {};
        var list_store_bucket = data.aggregations.store_bucket.buckets || [];
        //console.log(list_store_bucket);

        list_store.forEach((element, index) => {
            let source = element._source;
            let id_shp = source["id_shp"];
            if (!list_key[id_shp]) {
                list_key[id_shp] = 1;
                let list_bucket = list_store_bucket.filter(item => item.key == id_shp);

                let dt_primary = "";
                var date_arr = [];
                if (list_bucket && list_bucket.length) {
                    //console.log('list_bucket', list_bucket, list_bucket.length, id_shp);
                    let list_hit = list_bucket[0].top_tag_hits.hits.hits;
                    console.log(JSON.stringify(list_hit, null, 2));
                    //let dt_primary_infor = list_hit.filter(item => item._id == element._id);
                    if (list_hit && list_hit.length) {
                        console.log("list_hit.length", list_hit.length);
                        for(var row of list_hit){
                            date_arr.push(row._source.dt_primary);
                        }
                        console.log("date_arr", date_arr);
                        //dt_primary = dt_primary_infor[0]._source.dt_primary
                    }
                }
                if (date_arr.length) {
                    let date_format = this.getDate(date_arr);
                    let title = source.nm_shp;
                    if (title.length > 40) {
                        title = title.slice(0, 35) + "..."
                    }
                    let store_location_lat = source.store_location.split(",")[0];
                    let store_location_long = source.store_location.split(",")[1];
                    let distance = geolib.getDistance(
                        { latitude: input.user_lat, longitude: input.user_long },
                        { latitude: store_location_lat, longitude: store_location_long }
                    );

                    let text =  "\n指定地点から約" + distance + "m\n" + date_format;
                    let t_mesage = {
                        // "thumbnailImageUrl": "https://image.freepik.com/free-vector/flat-store-facade-with-awning_23-2147542588.jpg",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": title,
                        "text": text,
                        "actions": [
                            {
                                "type": "uri",
                                "label": "地図を見る",
                                "uri": `https://google.co.jp/maps?q=${source.store_location}`
                            }
                        ]
                    };
                    message_carousel.template.columns.push(t_mesage);
                };
            }
        });

        if (!message_carousel.template.columns.length) {

            if(input.resend_location_scenario_id){
                let q_1 = {
                    "type": "action",
                    "action": {
                        "type": "postback",
                        "label": "再度検索する",
                        "displayText": "再度検索する",
                        "data": `BQUICK_REPLIES_${input.current_id_scenario}_${input.resend_location_scenario_id}_-1_-1`
                    }
                };

                let q_2 = {
                    "type": "action",
                    "action": {
                        "type": "postback",
                        "label": "商品検索へ戻る",
                        "displayText": "商品検索へ戻る",
                        "data": `BQUICK_REPLIES_${input.current_id_scenario}_${input.start_id_scenario}_-1_-1`
                    }
                };

                let quickReply_show_more = {
                    "type": "text",
                    "text": "お近くには見つかりませんでした。中心地点を変更して再度検索してください。",
                    "quickReply": {
                        "items": [
                            q_1, q_2
                        ]
                    }
                };
                message.push(quickReply_show_more);
            }else{
                let text_show_1 = {
                    "type": "text",
                    "text": `該当する店舗が見つかりませんでした`
                };
                let q_1 = {
                    "type": "action",
                    "action": {
                        "type": "postback",
                        "label": "再検索する",
                        "displayText": "再検索する",
                        "data": `BQUICK_REPLIES_${input.current_id_scenario}_${input.connect_id_scenario}_-1_-1`
                    }
                };

                let q_2 = {
                    "type": "action",
                    "action": {
                        "type": "postback",
                        "label": "最初に戻る",
                        "displayText": "最初に戻る",
                        "data": `BQUICK_REPLIES_${input.current_id_scenario}_${input.start_id_scenario}_-1_-1`
                    }
                };

                let quickReply_show_more = {
                    "type": "text",
                    "text": "範囲を広げて検索しますか？",
                    "quickReply": {
                        "items": [
                            q_1, q_2
                        ]
                    }
                };
                message.push(text_show_1);
                message.push(quickReply_show_more);
            }

        } else {
            message.push({
                "type": "text",
                "text": message_carousel.template.columns.length + "店舗が見つかりました。\n\n⚠ご注意ください⚠\n当社の出荷データをもとにご案内しており、確実に店頭に並んでいることを保証するものではございません。"
            });

            message.push(message_carousel);

            var next_btn = {
                "type": "template",
                "altText": "もう一度検索しますか？",
                "template": {
                    "type": "buttons",
                    "text": "もう一度検索しますか？",
                    "actions": [
                        {
                            "type": "postback",
                            "label": "商品検索へ戻る",
                            "data": `BQUICK_REPLIES_${input.current_id_scenario}_${input.start_id_scenario}_-1_-1`
                        }
                    ]
                }
            };
            message.push(next_btn);
        }
        count = count + 1;
        res.json({
            message,
            count
        });
    }

    getDate(dt_primary_arr) {
        try {
            if (dt_primary_arr) {
                var range_day = 100000;
                var min_date = "";
                for(var date of dt_primary_arr){
                    var current_date = moment().tz(TIMEZONE);
                    var dt_primary_date = moment(date, "YYYY-MM-DD").tz(TIMEZONE);
                    var tmp = current_date.diff(dt_primary_date, 'days');
                    if(range_day > tmp){
                        range_day = tmp;
                        min_date = date;
                    }
                }
                console.log(dt_primary_arr, min_date, range_day);
                if (range_day <= 3) {
                    return "🌕3日以内に配荷";
                } else if (range_day <= 7) {
                    return "🌗1週間以内に配荷";
                } else if (range_day <= 14) {
                    return "🌘2週間以内に配荷";
                } else {
                    return "🌑2週間以上前に配荷";
                }
            } else {
                return "";
            }

        } catch (error) {
            console.log("have error when convert date, dt_rimary not true", error, dt_primary);
            return "";
        }

    }
}


module.exports = new karubiP2Router().router;