// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var model = require('../model');
const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
const CustomMynaviFavorites = model.CustomMynaviFavorites;
const CustomMynaviStatus = model.CustomMynaviStatus;
const CustomMynaviRecommend = model.CustomMynaviRecommend;
const CustomMynaviPoint = model.CustomMynaviPoint;
const CustomMynaviPageNull = model.CustomMynaviPageNull;
const CustomMynaviReport = model.CustomMynaviReport;
const LIMIT_FAVORITES = 10;
const LIMIT_PAGE = 10;
var Parent = require('./parent.class');
// const list_page_null = [31, 224, 2007, 2502, 2675, 3045, 3082, 3083, 3085, 3086, 3087, 3088, 3089, 3090, 3091, 3092, 3093, 3094, 3095, 3113, 3114, 3116, 3117];
// const list_page_null = [261,2104,207,2344,217,3,461,2601,2112,1906,1908,2113,109,2214,2336,2365,2420,2472,2514,2999,1748,3002,3016,2735,26,2767,2892,2907];

function encodeBase64(value) {
    var encoded = Buffer.from(value).toString('base64');
    return encoded;
}

class mynaviRouter extends Parent {
    constructor() {
        super();
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/select_area', async (req, res, next) => {
            let list_key = ["area_type", "current_id_scenario", "connect_id_scenario", "variable_id"];
            let data = this.getDataInput(list_key, req.body);
            var result_return = {
                "type": "text",
                "text": "結婚式をあげたい都道府県を教えてください😉",
                "quickReply": {
                    "items": []
                }
            };
            try {
                var list_item_select = [];
                switch (data.area_type) {
                    case "関東甲信越":
                        list_item_select = [
                            "東京都", "神奈川県", "千葉県", "埼玉県", "茨城県", "栃木県", "群馬県", "山梨県", "長野県"
                        ]
                        break;

                    case "関西":
                        list_item_select = [
                            "大阪府", "京都府", "兵庫県", "奈良県", "滋賀県"
                        ];
                        break;

                    case "東海":
                        list_item_select = [
                            "静岡県", "愛知県", "三重県", "岐阜県"
                        ];
                        break;

                    case "東北":
                        list_item_select = [
                            "宮城県", "福島県"
                        ];
                        break;

                    case "九州・沖縄":
                        list_item_select = [
                            "福岡県", "熊本県", "沖縄県"
                        ]
                        break;

                    case "北海道":
                        list_item_select = [
                            "北海道"
                        ]
                        break;

                    default:
                        break;
                }

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

        this.router.post('/show_carousel', async (req, res, next) => {
            let list_key = ["user_name", "area", "type", "continues_offset", "line_id", 'current_id_scenario', 'connect_id_scenario', 'connect_id_scenario_0','connect_id_scenario_contact' , 'favorites_id_scenario', "variable_id", "cpid", "param_recommend", "param_salon"];
            let data = this.getDataInput(list_key, req.body);
            console.log("API show_carousel ---> ", req.body);
            var message = [];
            var sort = this.getSort(data.type);
            try {
                
                var offset = 0;
                if (data.continues_offset) {
                    let infor_offset = await CustomMynaviStatus.findOne({ "line_id": data.line_id, type: 'page', cpid: data.cpid });
                    offset = infor_offset ? infor_offset.count : 0;
                }
                let page_null_info = await CustomMynaviPageNull.findOne({"status": true});
                var list_page_null = [];
                if(page_null_info){
                    list_page_null = JSON.parse(page_null_info.list_null).data;
                }

                let list_show = await CustomMynaviPoint.find({
                    "pref": data.area,
                    "id": {
                        "$nin": list_page_null
                    }
                }, {}, { skip: offset, limit: LIMIT_PAGE+1 }, (err, list_school) => {
                    if (err) {
                        console.log('Have error when get list school', err);
                    }
                }).sort(sort);

                let message_carousel = {
                    "type": "template",
                    "altText": "this is a carousel template",
                    "template": {
                        "type": "carousel",
                        "columns": [
                        ],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                    }
                }

                var list_page = await this.getInforPage(list_show, 'id');
                list_show.forEach((item,index) => {
                    if(index < LIMIT_PAGE){
                        var element = list_page.find(page => page.id == item.id);
                        if (element ) {
                            let name = element.name;
                            if (name.length > 40) {
                                name = name.slice(0, 35) + "..."
                            }
                            let t_mesage = {
                                "thumbnailImageUrl": element.bigimage,
                                "imageBackgroundColor": "#FFFFFF",
                                "title": name,
                                "text": element.description,
                                "defaultAction": {
                                    "type": "uri",
                                    "label": "ツアーを見る",
                                    "uri": element.producturl+data.param_recommend
                                },
                                "actions": [
                                    {
                                        "type": "postback",
                                        "label": "クリップする",
                                        "data": `BSCENARIO_${data.current_id_scenario}_${data.favorites_id_scenario}_${data.variable_id}_${encodeBase64(element.id)}`,
                                        "displayText": "クリップする"
                                    },
                                    {
                                        "type": "uri",
                                        "label": "詳しく見る",
                                        "uri": element.producturl+data.param_recommend
                                    },
                                    {
                                        "type": "uri",
                                        "label": "サロンで相談する",
                                        "uri": "https://wedding.mynavi.jp/contents/salon/"+data.param_salon
                                    },
    
                                ]
                            };
                            message_carousel.template.columns.push(t_mesage);
                            /*save log recommend*/
                            this.saveLogRecommend(element.id, element.name, data.area);
                        }
                    }
                });
                if (!message_carousel.template.columns.length) {
                    let text_show_null = {
                        "type": "text",
                        "text": `${data.user_name}さんにぴったりな式場が見つかりませんでした。`
                    };
                    message.push(text_show_null);
                   
                } else {
                    if(!data.continues_offset){
                        let first_text = {
                            "type": "text",
                            "text": `回答ありがとうございます！\n${data.user_name}さんにぴったりな式場をピックアップしました。`
                        };
                        message.push(first_text);
                    }
                   
                    message.push(message_carousel);

                    let continue_show = list_show.length > LIMIT_PAGE ? 1 : 0; 
                    let button_go_to = {
                        "type": "template",
                        "altText": "気になる式場は見つかりましたか？",
                        "template": {
                            "type": "buttons",
                            "text": "気になる式場は見つかりましたか？",
                            "actions": [
                                {
                                    "type": "postback",
                                    "label": "もう一度探す",
                                    "data": `BSCENARIO_${data.current_id_scenario}_${data.connect_id_scenario_0}_-1_5pu044Gr6KaL44G+44GZ`,
                                    "displayText": "もう一度探す"
                                }
                            ]
                        }
                    };
                    if (continue_show) {
                        var offset_save = offset + LIMIT_PAGE;

                        CustomMynaviStatus.updateOne({ type: 'page', line_id: data.line_id, cpid: data.cpid }, {
                            $set: { count: offset_save }
                        }, { upsert: true }, (err, result) => {
                            if (err) {
                                console.log('Have error when update offset for page', err);
                            } else {
                            }
                        });

                        button_go_to.template.actions.push(
                            {
                                "type": "postback",
                                "label": "式場をもっと見る",
                                "data": `BSCENARIO_${data.current_id_scenario}_${data.connect_id_scenario}_-1_5pu044Gr6KaL44G+44GZ`,
                                "displayText": "式場をもっと見る"
                            }
                        )
                        message.push(button_go_to);
                    }else{
                        message.push(button_go_to);
                        message.push({
                            "type" : "text",
                            "text" : "ウエディングタイプはわかったけど、費用やアクセスなど条件に合う結婚式場が見つからない！😣\n\nというあなたは、式場探しのプロに相談してみよう！"
                        });
                        message.push({
                            "type" : "template",
                            "altText" : "式場探しのプロに相談する",
                            "template" : {
                                "type" : "buttons",
                                "text" : "式場探しのプロに相談する",
                                "actions" : [ 
                                    {
                                        "type" : "uri",
                                        "label" : "サロンで相談する",
                                        "uri" : "https://wedding.mynavi.jp/contents/salon/?utm_source=mynavi&utm_medium=line_chatbot&utm_campaign=contents&openExternalBrowser=1"
                                    }
                                ]
                            }
                        })
                        // button_go_to.template.actions.push(
                        //     {
                        //         "type": "postback",
                        //         "label": "レコメンド後サロン相談",
                        //         "data": `BSCENARIO_${data.current_id_scenario}_${data.connect_id_scenario_contact}_-1_5pu044Gr6KaL44G+44GZ`,
                        //         "displayText": "レコメンド後サロン相談"
                        //     }
                        // )
                    }
                    
                }
                res.json({
                    message: message
                });

            } catch (error) {
                console.log('Have error when get rank', error);
                res.status(500).json({
                    error_message: "Have error when get rank"
                })
            }
        });

        this.router.post('/add_favorite', async (req, res, next) => {
            // console.log("API add favorite ---> ", moment(new Date()).tz(TIMEZONE).format('MM DD HH:mm'), req.body);
            let list_key = ["line_id", "carousel_info", "cpid"];
            let data = this.getDataInput(list_key, req.body);
            try {
                CustomMynaviFavorites.update({ line_id: data.line_id, id_page: data.carousel_info, cpid: data.cpid }, {
                    $set: {
                        line_id: data.line_id,
                        id_page: data.carousel_info,
                        cpid: data.cpid,
                        status: true,
                    }
                }, { upsert: true }, (err, result) => {
                    if (err) {
                        res.status(500).json({
                            error_message: "Have error when add favorite"
                        })
                    } else {
                        res.status(200).json({
                            message: "Add favorite success"
                        })
                    }
                });
            } catch (error) {
                console.log('Have error when add favorite', error, data);
                res.status(500).json({
                    error_message: "Have error when add favorite"
                })
            }
        });

        this.router.post('/remove_favorite', async (req, res, next) => {
            // console.log("API remove favorites ---> ", moment(new Date()).tz(TIMEZONE).format('MM DD HH:mm'), req.body);
            let list_key = ["line_id", "carousel_info", "cpid"];
            let data = this.getDataInput(list_key, req.body);
            try {
                CustomMynaviFavorites.update({ line_id: data.line_id, id_page: data.carousel_info, cpid: data.cpid }, {
                    $set: {
                        status: false
                    }
                }, { upsert: true }, (err, result) => {
                    if (err) {
                        res.status(500).json({
                            error_message: "Have error when remove favorite"
                        })
                    } else {
                        res.status(200).json({
                            message: "remove favorite success"
                        })
                    }
                });
            } catch (error) {
                console.log('Have error when remove favorite', error, data);
                res.status(500).json({
                    error_message: "Have error when remove favorite"
                })
            }
        });

        this.router.post('/show_favorites', async (req, res, next) => {
            // console.log("API show favorites ---> ", moment(new Date()).tz(TIMEZONE).format('MM DD HH:mm'), req.body);
            let list_key = ["continues_offset", "line_id", 'current_id_scenario', 'connect_id_scenario', 'remove_favorite_screnario_id', 'variable_id', 'cpid', "param_recommend", "param_salon"];
            let data = this.getDataInput(list_key, req.body);
            var message = [];
            try {
                var offset = 0;
                if (data.continues_offset) {
                    let infor_offset = await CustomMynaviStatus.findOne({ "line_id": data.line_id, type: 'favorites', cpid: data.cpid });
                    offset = infor_offset ? infor_offset.count : 0;
                }
                let list_favorites = await CustomMynaviFavorites.find({ line_id: data.line_id, status: true, cpid: data.cpid }, {}, { skip: offset, limit: LIMIT_FAVORITES+1 });

                let message_carousel = {
                    "type": "template",
                    "altText": "this is a carousel template",
                    "template": {
                        "type": "carousel",
                        "columns": [
                        ],
                        "imageAspectRatio": "rectangle",
                        "imageSize": "cover"
                    }
                }
                var list_page = await this.getInforPage(list_favorites, 'id_page');
                list_favorites.forEach((item, index) => {
                    if(index < LIMIT_FAVORITES){
                        var element = list_page.find(page => page.id == item.id_page);
                        if (element) {
                            let name = element.name;
                            if (name.length > 40) {
                                name = name.slice(0, 35) + "..."
                            }
                            let t_mesage = {
                                "thumbnailImageUrl": element.bigimage,
                                "imageBackgroundColor": "#FFFFFF",
                                "title": name,
                                "text": element.description,
                                "defaultAction": {
                                    "type": "uri",
                                    "label": "ツアーを見る",
                                    "uri": element.producturl+data.param_recommend
                                },
                                "actions": [
                                    {
                                        "type": "postback",
                                        "label": "クリップから外す",
                                        "data": `BSCENARIO_${data.current_id_scenario}_${data.remove_favorite_screnario_id}_${data.variable_id}_${encodeBase64(element.id)}`,
                                        "displayText": "クリップから外す"
                                    },
                                    {
                                        "type": "uri",
                                        "label": "詳しく見る",
                                        "uri": element.producturl+data.param_recommend
                                    },
                                    {
                                        "type": "uri",
                                        "label": "サロンで相談する",
                                        "uri": "https://wedding.mynavi.jp/contents/salon/"+data.param_salon
                                    }
                                ]
                            };
                            message_carousel.template.columns.push(t_mesage);
                        }
                    }
                });
                if (!message_carousel.template.columns.length) {
                    let text_show_null = {
                        "type": "text",
                        "text": `クリップした式場はまだありません`
                    };
                    message.push(text_show_null);
                } else {
                    if(!data.continues_offset){
                        let text_show = {
                            "type": "text",
                            "text": `クリップしている式場はこちらです！`
                        };
                        message.push(text_show);
                    }
                    message.push(message_carousel);
                    let continue_show = list_favorites.length > LIMIT_FAVORITES ? 1 : 0;
                    if (continue_show) {
                        CustomMynaviStatus.updateOne({ type: 'favorites', line_id: data.line_id, cpid: data.cpid }, {
                            $set: { count: offset + LIMIT_FAVORITES }
                        }, { upsert: true }, (err, result) => {
                            if (err) {
                                console.log('Have error when update offset for page favorites', err);
                            } else {
                            }
                        });
                        let button_connect = {
                            "type": "template",
                            "altText": "更に式場を見ますか？",
                            "template": {
                                "type": "buttons",
                                "text": "更に式場を見ますか？",
                                "actions": [
                                    {
                                        "type": "postback",
                                        "label": "更に見る",
                                        "data": `BSCENARIO_${data.current_id_scenario}_${data.connect_id_scenario}_-1_5pu044Gr6KaL44G+44GZ`,
                                        "displayText": "更に見る"
                                    }
                                ]
                            }
                        };
                        message.push(button_connect);
                    }
                }
                res.json({
                    message: message
                });
            } catch (error) {
                console.log('Have error when add favorite', error, data);
                res.status(500).json({
                    error_message: "Have error when add favorite"
                })
            }
        });
    }

    async getInforPage(list_show, type) {
        let list_id = [];
        list_show.forEach(item => {
            list_id.push(item[type]);
        });
        let list_page = await CustomMynaviRecommend.find({
            "id": {
                "$in": list_id
            }
        });
        var data_return = list_page || [];
        return data_return
    }

    getSort(type) {
        let result = {};
        switch (type) {
            case "アットホーム":
                result = { home_style: -1 };
                break;

            case "オリジナル":
                result = { original_style: -1 };
                break;

            case "シンプル":
                result = { simple_style: -1 };
                break;

            case "フォーマル":
                result = { format_style: -1 };
                break;

            case "プリンセス":
                result = { princess_style: -1 };
                break;

            case "ラグジュアリー":
                result = { luxury_style: -1 };
                break;

            default:
                break;
        }
        result._id = 1;

        return result;
    }

    saveLogRecommend(store_id, store_name, area){
        var now = new Date();
        var ym = moment(now).tz(TIMEZONE).format('YYYY-MM');
        CustomMynaviReport.update({store_id: store_id, ym: ym},
            {$inc: {count: 1},
            $set: {
                store_name : store_name,
                area : area,
                updated_at : now
            },
            $setOnInsert: {created_at: now}
        },
        {upsert: true, multi: false}, function (err) {
        });
    }
}


module.exports = new mynaviRouter().router;