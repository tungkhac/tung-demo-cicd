// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const express = require('express');
const mode = require('../model');
const CustomTravelTour = mode.CustomTravelTour;
const CustomTravelGuide = mode.CustomTravelGuide;
const CustomTravelStatus = mode.CustomTravelStatus;
const Parent = require('./parent.class');
const LIMIT_TOUR = 10;
const LIMIT_GUIDE = 10;

class travelRouter extends Parent {
    constructor() {
        super();
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/get_tour', async (req, res, next) => {
            console.log("API get tour ---> ", req.body);
            var list_key = ["type", "name_topic_area", "offset", "current_id_scenario", "connect_id_scenario"];
            let data = this.getDataInput(list_key, req.body);
            try {
                let offset = parseInt(data.offset) ? data.offset : 0;
                let list_tour = await new Promise((resolve, reject) => {
                    CustomTravelTour.find({
                        name_topic_area: data.name_topic_area,
                        type: data.type,
                    }, {}, { skip: offset, limit: LIMIT_TOUR }, (err, list_tour) => {
                        if (err) {
                            console.log('Have error when get list tour', err);
                            reject(err)
                        } else {
                            resolve(list_tour)
                        }
                    }).sort({ tour_id: 1 });
                });

                let message = [];
                if (list_tour.length == 0) {
                    
                    let text_show_null = {
                        "type": "text",
                        "text": `該当のツアーが見つかりませんでした。`
                    };
                    message.push(text_show_null);
                } else {
                    //first show 
                    if(parseInt(offset) == 0){
                        let text_first = {
                            "type": "text",
                            "text": `ツアーがみつかりました！\nツアーを見る、をタップすると、LINEトラベル（外部サイト）にリンクします。`
                        };
                        message.push(text_first);
                    }
                    let continue_show_tour = list_tour.length == LIMIT_TOUR ? 1 : 0;
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
                    list_tour.forEach(tour => {
                        let t_mesage = {
                            "thumbnailImageUrl": tour.link_image,
                            "imageBackgroundColor": "#FFFFFF",
                            "title": tour.title,
                            "text": tour.price,
                            "defaultAction": {
                                "type": "uri",
                                "label": "ツアーを見る",
                                "uri": tour.link_tour
                            },
                            "actions": [
                                {
                                    "type": "uri",
                                    "label": "ツアーを見る",
                                    "uri": tour.link_tour
                                }
                            ]
                        };
                        message_carousel.template.columns.push(t_mesage);
                    });
                    message.push(message_carousel);
                    if (continue_show_tour) {
                        let button_connect = {
                            "type": "template",
                            "altText": "更にツアーをみますか？",
                            "template": {
                                "type": "buttons",
                                "text": "更にツアーをみますか？",
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
                    message: message,
                    count: offset + LIMIT_TOUR
                });
            } catch (error) {
                console.log('have error when get tour', error, data);
            }
        });

        this.router.post('/get_guide', async (req, res, next) => {
            // console.log("API get guide ---> ", req.body);
            var list_key = ["offset", "current_id_scenario", "connect_id_scenario", "line_id"];
            let data = this.getDataInput(list_key, req.body);
            try {
                let offset = parseInt(data.offset);
                if (data.offset == 1) {
                    let offset_info = await new Promise((resolve, reject) => {
                        CustomTravelStatus.findOne({
                            type: 'guide',
                            line_id: data.line_id
                        }, (err, offset_status) => {
                            if (err) {
                                console.log('Have error when get offset of guide', err);
                                reject(err)
                            } else {
                                resolve(offset_status)
                            }
                        });
                    })
                    if (offset_info) {
                        offset = offset_info.offset
                    }
                }
                let list_guide = await new Promise((resolve, reject) => {
                    CustomTravelGuide.find({}, {}, { skip: offset, limit: LIMIT_GUIDE }, (err, list_guide) => {
                        if (err) {
                            console.log('Have error when get list guide', err);
                            reject(err)
                        } else {
                            resolve(list_guide)
                        }
                    }).sort({ guide_id: 1 });
                });

                let continue_show_guide = list_guide.length == LIMIT_GUIDE ? 1 : 0;
                let message = [];

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

                list_guide.forEach(guide => {
                    let title = guide.title;
                    if (title.length > 40) {
                        title = title.slice(0, 35) + "..."
                    }
                    let guide_message = {
                        "thumbnailImageUrl": guide.link_image,
                        "imageBackgroundColor": "#FFFFFF",
                        "title": title,
                        "text": guide.title,
                        "defaultAction": {
                            "type": "uri",
                            "label": "記事を見る",
                            "uri": guide.link
                        },
                        "actions": [
                            {
                                "type": "uri",
                                "label": "記事を見る",
                                "uri": guide.link
                            }
                        ]
                    };
                    message_carousel.template.columns.push(guide_message);
                });

                message.push(message_carousel);
                let button_connect = {
                    "type": "template",
                    "altText": "▼▼▼▼▼▼▼▼▼▼",
                    "template": {
                        "type": "buttons",
                        "text": "▼▼▼▼▼▼▼▼▼▼",
                        "actions": [
                            {
                                "type": "uri",
                                "label": "一覧を見る",
                                "uri": "https://www.travel.co.jp/guide/archive/list/world/p64/matome/"
                            }
                        ]
                    }
                };
                if (continue_show_guide) {
                    button_connect = {
                        "type": "template",
                        "altText": "更に記事を見ますか？",
                        "template": {
                            "type": "buttons",
                            "text": "更に記事を見ますか？",
                            "actions": [
                                {
                                    "type": "postback",
                                    "label": "もっと見る",
                                    "data": `BSCENARIO_${data.current_id_scenario}_${data.connect_id_scenario}_-1_5pu044Gr6KaL44G+44GZ`,
                                    "displayText": "もっと見る"
                                },
                                {
                                    "type": "uri",
                                    "label": "一覧を見る",
                                    "uri": "https://www.travel.co.jp/guide/archive/list/world/p64/matome/"
                                }
                            ]
                        }
                    };
                }
                message.push(button_connect);

                CustomTravelStatus.updateOne({ type: 'guide', line_id: data.line_id }, {
                    $set: { offset: offset + LIMIT_GUIDE }
                }, { upsert: true }, (err, result) => {
                    if (err) {
                        console.log('Have error when update offset for guide', err);
                    } else {
                    }
                });
                res.json({
                    message: message
                });
            } catch (error) {
                console.log('have error when get guide', error, data);
            }
        });
    }
}



module.exports = new travelRouter().router;