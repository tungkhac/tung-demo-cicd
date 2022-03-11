// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by nguyen.khac.tung on 20/9/2019.
 */

/**Point Town:
 * ----FLOW:
 * Step 1: select search_type
 * Step 2:
 *    If search_type == (earn_point|| normal) -> Step 3
 *    Else search_type == free -> Step 5 (select Point Town with project_type = free)
 *
 * Step 3: Show checkbox select category
 *    3.1. If count(project_type) == 1 -> Step 5 (select Point Town with that category)
 *       Step 1: API getProjectTypeTotal set total project type belong with categories selected to variable CMS
 *       Step 2: Set filter for project type API: filter project_type_total != 0 in scenario
 *
 * Step 4: Show checbox select project_type
 * Step 5: Show Point Town item in carousel list
 * Step 6: Show Point Town item detail with link to Point Town page
 * */

var express = require('express');
var router = express.Router();
var common = require('../modules/common');
var model = require('../model');
const PointTown = model.PointTown;
const GmoPoint = model.GmoPoint;
const _rankPointInc = {
    show: 1,
    detail_view: 2,
    client_redirect: 3
};


/*Start V2*/
//Search category: empty, ad_id
router.post('/v2/carouselList', function(req, res, next) {
    var body = req.body,
        cpid =  body.cpid,
        ad_id =  body.adId;

    ad_id = ad_id.trim();

    var response_data = {
        type : '012',
        data: []
    };

    console.log('PointTown V2 Filter init adId: ', ad_id);
    if(ad_id != void 0) {
        var error_message = 'おすすめが見つかりませんでした。';
        try {
            PointTown.findOne({category: '', adId: ad_id}, function(err, pointtown_item) {
                if(err) {
                    console.log('PointTown V2 get item list: ', err);
                }
                if(!err && pointtown_item) {
                    var break_line = '</br>';
                    var title = '';
                    var sub_title = '';
                    var image_url = '';
                    var points = pointtown_item.points;
                    if (points && !isNaN(points)) {
                        points = parseFloat(points);
                    }

                    //get gmo item to get point from gmo collection
                    getGmoItem(ad_id, function(gmo_item) {
                        //get point
                        if(gmo_item && gmo_item.points != void 0) {
                            points = gmo_item.points * 14;
                        }
                        points = points.toLocaleString();

                        if(pointtown_item.image != void 0) {
                            image_url = pointtown_item.image.split(' ');
                            image_url = image_url.filter(function (x, i, self) {
                                if(x.indexOf('src') != '-1') {
                                    return x;
                                }
                                return '';
                            });
                            image_url = (image_url.length) ? image_url[0].replace('src=', '').replace(/\'/g, '') : '';
                        }
                        if(pointtown_item.title != void 0 && pointtown_item.title != '') {
                            title = pointtown_item.title.trim();
                            title = title.replace(/\\r\\n/g, break_line).replace(/\\n/g, break_line).replace(/\\r/g, break_line);
                            title = title.replace(/\r\n/g, break_line).replace(/\n/g, break_line).replace(/\r/g, break_line);
                            title += break_line;
                        }
                        if(pointtown_item.introduction != void 0 && pointtown_item.introduction != '') {
                            sub_title = pointtown_item.introduction.trim();
                            sub_title = sub_title.replace(/\\r\\n/g, break_line).replace(/\\n/g, break_line).replace(/\\r/g, break_line);
                            sub_title = sub_title.replace(/\r\n/g, break_line).replace(/\n/g, break_line).replace(/\r/g, break_line);
                        }

                        response_data.data.push({
                            title : '獲得ポイント：' + points + ' pt' + break_line + 'サービス名：' + title,
                            subtitle : sub_title,
                            item_url : '',
                            image_url : image_url,
                            button : {
                                title : "詳しく見る",
                                type : "postback",
                                payload : 'CAROUSEL_POINTTOWN_' + pointtown_item._id
                            }
                        });

                        if(!response_data.data.length) {
                            response_data.error_message = error_message;
                        }
                        res.json(response_data);
                    });

                } else {
                    response_data.error_message = error_message;
                    res.json(response_data);
                }
            });

        } catch(e) {
            common.saveException(cpid, "PointTown V2", {
                requestData: {
                    category: '',
                    adId: ad_id,
                },
                name: e.name,
                message: e.message
            });
            response_data.error_message = error_message;
            res.json(response_data);
        }
    } else {
        res.json(response_data);
    }
});

router.post('/v2/item', function(req, res, next) {
    var body = req.body;
    var item_id = body.item_id;
    var cpid =  body.cpid;
    var u1 = (body.u1 ? body.u1 : "");

    var response_data = {
        message_type : "002",
        type : '111',
        conversation_not_end_flg : 1
    };
    var break_line = '</br>';

    if(item_id != void 0) {
        try {
            PointTown.findOne({_id: item_id}, function(err, result) {
                if(err) throw err;
                if(result){
                    response_data.data = {
                        message: [
                            {
                                type : '111',
                                list: [

                                ]
                            }
                        ]
                    };
                    if(result.conversion != void 0 && result.conversion != '') {
                        var conversion = break_line + result.conversion.trim();
                        conversion = conversion.replace(/\\r\\n/g, break_line).replace(/\\n/g, break_line).replace(/\\r/g, break_line);
                        conversion = conversion.replace(/\r\n/g, break_line).replace(/\n/g, break_line).replace(/\r/g, break_line);

                        response_data.data.message[0].list.push({
                            title : '■獲得条件：' + conversion,
                            type : 'label',
                        });
                    }
                    if(result.reject != void 0 && result.reject != '') {
                        var reject = break_line + result.reject.trim();
                        reject = reject.replace(/\\r\\n/g, break_line).replace(/\\n/g, break_line).replace(/\\r/g, break_line);
                        reject = reject.replace(/\r\n/g, break_line).replace(/\n/g, break_line).replace(/\r/g, break_line);

                        response_data.data.message[0].list.push({
                            title : '■注意事項：' + reject,
                            type : 'label',
                        });
                    }
                    var link_page = result.url;
                    link_page = link_page.replace('u1=', 'u1=' + encodeURI(u1));

                    common.getShortUrl(cpid, link_page, function (shortUrl) {
                        response_data.data.message[0].list.push({
                            title : 'ポイントを貯める（クリックすると外部サービスに移動します）',
                            type : 'link',
                            url : shortUrl
                        });
                        // console.log('PointTown V2 item: ', response_data);
                        res.json(response_data);
                    });
                } else {
                    response_data.error_message = 'おすすめが見つかりませんでした。';
                    res.json(response_data);
                }
            });

        } catch(e) {
            common.saveException(cpid, "PointTown V2 Point Item", {
                requestData: {
                    item_id: item_id
                },
                name: e.name,
                message: e.message
            });
            response_data.error_message = 'おすすめが見つかりませんでした。';
            res.json(response_data);
        }
    } else {
        res.json(response_data);
    }
});

function getGmoItem(ad_id, callback) {
    try {
        //items not get in gmo colection
        var gmo_not_ids = ['7876' ,'7250'];
        if(gmo_not_ids.indexOf(ad_id) > -1) {
            return callback(null);
        } else {
            GmoPoint.findOne({adId: ad_id}, function(err, gmo_item) {
                if(err) {
                    console.log('PointTown V2 get item from Gmo collection error: ', err);
                }
                return callback(gmo_item);
            });
        }
    } catch(e) {
        common.saveException(null, "PointTown V2 get item from Gmo collection error", {
            requestData: {
                category: '',
                adId: ad_id,
            },
            name: e.name,
            message: e.message
        });
        return callback(null);
    }
}
/*End V2*/

/*Start V1*/
router.post('/getCategory', function(req, res, next) {
    var body = req.body;
    var cpid =  body.cpid;

    var response_data = {
        type: '005',
        data: [],
        error_message: 'おすすめが見つかりませんでした。'
    };

    try {
        PointTown.distinct('category', function(err, result) {
            console.log('PointTown Category: ', (result ? result.length : result));
            if(result && result.length){
                response_data.data = result.reduce(function (result_array, category_name) {
                    result_array.push({
                        value: category_name,
                        text: category_name
                    });
                    return result_array;
                }, []);

                if(response_data.data.length) {
                    response_data.error_message = '';
                }
                res.json(response_data);
            } else {
                res.json(response_data);
            }
        });

    } catch(e) {
        common.saveException(cpid, "PointTown get project type", {
            name: e.name,
            message: e.message
        });
        res.json(response_data);
    }
});

router.post('/getProjectTypeTotal', function(req, res, next) {
    var body = req.body;
    var category_param = body.category;
    var cpid =  body.cpid;

    var response_data = {
        project_type_total: 0,
    };

    if(category_param != void 0) {
        var filter_option = {
            category: category_param.split(',')
        };
        console.log('PointTown Get Total Project type: ', filter_option);

        try {
            PointTown.distinct('project_type', filter_option, function(err, result) {
                // console.log('PointTown Project type Total: ', result.length);
                if(result && result.length){
                    response_data.project_type_total = result.length;
                }
                res.json(response_data);
            });

        } catch(e) {
            common.saveException(cpid, "PointTown get Total project type", {
                requestData: {
                    category: category_param
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

router.post('/getProjectType', function(req, res, next) {
    var body = req.body;
    var category_param = body.category;
    var cpid =  body.cpid;

    var response_data = {
        type: '005',
        answer_disable_flg: 1, //not select answer option when show
        data: [],
        error_message: 'おすすめが見つかりませんでした。'
    };

    if(category_param != void 0) {
        var filter_option = {
            category: category_param.split(',')
        };
        console.log('PointTown Point Get Project type: ', filter_option);

        try {
            PointTown.distinct('project_type', filter_option, function(err, result) {
                console.log('PointTown Project type result: ', (result ? result.length : result));
                if(result && result.length){
                    var option_other_label = 'その他';
                    var option_other_flg = false;

                    response_data.data = result.reduce(function (result_array, project_type) {
                        if(project_type != option_other_label) {
                            result_array.push({
                                value: project_type,
                                text: project_type
                            });
                        } else {
                            option_other_flg = true;
                        }
                        return result_array;
                    }, []);

                    //add other option to last
                    if(option_other_flg) {
                        response_data.data.push({
                            value: option_other_label,
                            text: option_other_label
                        });
                    }

                    if(response_data.data.length) {
                        response_data.error_message = '';
                    }
                    res.json(response_data);
                } else {
                    res.json(response_data);
                }
            });

        } catch(e) {
            common.saveException(cpid, "PointTown get project type", {
                requestData: {
                    category: category_param
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

router.post('/carouselList', function(req, res, next) {
    var body = req.body,
        search_type_param =  body.search_type,
        category_param = body.category,
        project_type_param = body.project_type,
        point_space_param = body.get_point,
        cpid =  body.cpid,
        rank_point_flg =  body.rank_point_flg;

    var search_type_option = {
        earn_point: 'earn_point',
        free: 'free',
        normal: 'normal',
    };
    var response_data = {
        type : '012',
        data: []
    };
    var filter_data = {

    };

    if(search_type_param == search_type_option.free) {
        filter_data =  {
            filter: {
                project_type: '無料会員登録',//free
            },
        };
    } else {
        if(category_param != void 0) {
            filter_data = {
                filter: {
                    category: category_param.split(','),
                },
            };
            //get project_type
            if(project_type_param != void 0 && project_type_param.length > 0) {
                //Find substring in string
                // project_type_param = project_type_param.split(',').join('|');
                // filter_data.filter.project_type = new RegExp(project_type_param);

                //Find by string
                filter_data.filter.project_type = project_type_param.split(',');
            }
        }
    }
    console.log('PointTown Point Filter init: ', filter_data);
    if(Object.keys(filter_data).length) {
        //get split point range
        if(point_space_param != void 0) {
            if(!isNaN(point_space_param)) {
                point_space_param = parseFloat(point_space_param);

                if(point_space_param <= 49) {
                    point_space_param = [1, 50];

                } else if(point_space_param <= 99) {
                    point_space_param = [50, 100];

                } else if(point_space_param <= 199) {
                    point_space_param = [100, 200];

                } else if(point_space_param <= 299) {
                    point_space_param = [200, 300];

                } else if(point_space_param >= 300) {
                    point_space_param = [300];
                }
            }

            if(point_space_param.length >= 2) {
                filter_data.filter.points =  {
                    $gte: point_space_param[0],
                    $lt: point_space_param[1]
                }
            } else {
                filter_data.filter.points = {
                    $gte: point_space_param[0]
                }
            }
        }

        try {
            console.log('rank_point_flg: ', rank_point_flg);
            if(rank_point_flg != void 0 && rank_point_flg == 1) {
                filter_data.sort = {sort: {rank_point: -1}};
            }

            //Step 1: get by rank point
            getItemList(filter_data, function (item_list, id_list) {
                if(item_list && item_list.length) {
                    //Step 2: get ranrom + not dublicate in id_list
                    filter_data.filter._id = {
                        $nin: id_list
                    };
                    getItemRandomList(filter_data, function (item_list2, id_list2) {
                        //increase rank point for item showed
                        item_list = item_list.concat(item_list2);
                        id_list = id_list.concat(id_list2);
                        rankPointIncrease(cpid, id_list, _rankPointInc.show);


                        response_data.data = item_list;
                        res.json(response_data);
                    });
                } else {
                    response_data.error_message = 'おすすめが見つかりませんでした。';
                    res.json(response_data);
                }
            });

        } catch(e) {
            common.saveException(cpid, "PointTown Point", {
                requestData: {
                    category: category_param,
                    project_type: project_type_param,
                    point_space: point_space_param
                },
                name: e.name,
                message: e.message
            });
            response_data.error_message = 'おすすめが見つかりませんでした。';
            res.json(response_data);
        }
    } else {
        res.json(response_data);
    }
});

router.post('/item', function(req, res, next) {
    var body = req.body;
    var item_id = body.item_id;
    var cpid =  body.cpid;
    var u1 = (body.u1 ? body.u1 : "");
    var rank_point_flg =  body.rank_point_flg;

    var response_data = {
        message_type : "002",
        type : '111',
        conversation_not_end_flg : 1
    };
    var break_line = '</br>';

    if(item_id != void 0) {
        try {
            PointTown.findOne({_id: item_id}, function(err, result) {
                if(err) throw err;
                if(result){
                    //increase rank point for item click to get detail
                    rankPointIncrease(cpid, [item_id], _rankPointInc.detail_view);

                    response_data.data = {
                        message: [
                            {
                                type : '111',
                                list: [

                                ]
                            }
                        ]
                    };
                    if(result.conversion != void 0 && result.conversion != '') {
                        var conversion = break_line + result.conversion.trim().replace(/\r\n/g, break_line).replace(/\n/g, break_line).replace(/\r/g, break_line);
                        response_data.data.message[0].list.push({
                            title : '獲得条件：' + conversion,
                            type : 'label',
                        });
                    }
                    if(result.reject != void 0 && result.reject != '') {
                        var reject = break_line + result.reject.trim().replace(/\r\n/g, break_line).replace(/\n/g, break_line).replace(/\r/g, break_line);
                        response_data.data.message[0].list.push({
                            title : '注意事項（次の場合はポイントを付与しない場合があります）：' + reject,
                            type : 'label',
                        });
                    }
                    var link_page = result.url;
                    link_page = link_page.replace('u1=', 'u1=' + encodeURI(u1));

                    common.getShortUrl(cpid, link_page, function (shortUrl) {
                        //add param to increase rank_point when click to redirect to client site
                        if(rank_point_flg != void 0 && rank_point_flg == 1) {
                            var path_char = '?';
                            if(shortUrl.indexOf('?') != '-1') {
                                path_char = '&';
                            }
                            shortUrl += path_char + 'bcpointtown=' + item_id;
                        }

                        response_data.data.message[0].list.push({
                            title : 'ポイントを貯める（クリックすると外部サービスに移動します）',
                            type : 'link',
                            url : shortUrl
                        });
                        // console.log('PointTown item: ', response_data);
                        res.json(response_data);
                    });
                } else {
                    response_data.error_message = 'おすすめが見つかりませんでした。';
                    res.json(response_data);
                }
            });

        } catch(e) {
            common.saveException(cpid, "PointTown Point Item", {
                requestData: {
                    item_id: item_id
                },
                name: e.name,
                message: e.message
            });
            response_data.error_message = 'おすすめが見つかりませんでした。';
            res.json(response_data);
        }
    } else {
        res.json(response_data);
    }
});

//return item list
function getItemList(options, callback) {
    var sort_data = (options.sort != void 0) ? options.sort : {};
    PointTown.find(options.filter, null, sort_data, function(err, result) {
        console.log('PointTown item result: ', (result ? result.length : result));

        if(err) {
            console.log('PointTown get item list: ', err);
        }
        if(!err && result && result.length){
            getItemData(result, function (items, ids) {
                return callback(items, ids);
            });

        } else {
            return callback([], []);
        }
    }).limit(5);
}

//return item random list
function getItemRandomList(options, callback) {
    PointTown.findRandom(options.filter, {}, {limit: 5}, function(err, result) {
        console.log('PointTown random item result: ', (result ? result.length : result));
        if(err) {
            console.log('PointTown get random item list: ', err);
        }

        if(!err && result && result.length){
            getItemData(result, function (items, ids) {
                return callback(items, ids);
            });

        } else {
            return callback([], []);
        }
    });
}

function getItemData(data_list, callback) {
    var id_list = [];
    var item_list = [];
    if(data_list && data_list.length){
        data_list.forEach(function (point_item, point_index) {
            var break_line = '</br>';
            var title = '';
            var sub_title = '';
            var image_url = '';
            if(point_item.image != void 0) {
                image_url = point_item.image.split(' ');
                image_url = image_url.filter(function (x, i, self) {
                    if(x.indexOf('src') != '-1') {
                        return x;
                    }
                    return '';
                });
                image_url = (image_url.length) ? image_url[0].replace('src=', '').replace(/\'/g, '') : '';
            }
            if(point_item.title != void 0 && point_item.title != '') {
                title = point_item.title.trim().replace(/\r\n/g, break_line).replace(/\n/g, break_line).replace(/\r/g, break_line);
                title += break_line;
            }
            if(point_item.introduction != void 0 && point_item.introduction != '') {
                sub_title = point_item.introduction.trim().replace(/\r\n/g, break_line).replace(/\n/g, break_line).replace(/\r/g, break_line);
            }

            item_list.push({
                title : '獲得ポイント：' + point_item.points + 'pt' + title,
                subtitle : sub_title,
                item_url : '',
                image_url : image_url,
                button : {
                    title : "詳しく見る",
                    type : "postback",
                    payload : 'CAROUSEL_POINTTOWN_' + point_item._id
                }
            });

            id_list.push(point_item._id);
            console.log('Rank: ', point_item.rank_point, '. ID: ', point_item._id);
        });
        return callback(item_list, id_list);
    } else {
        return callback(item_list, id_list);
    }
}

//increate point_inc for items
function rankPointIncrease(cpid, item_list, point_inc) {
    if(Array.isArray(item_list) && item_list.length && point_inc != void 0 && !isNaN(point_inc)) {
        point_inc = parseFloat(point_inc);
        try {
            var filter_option = {
                _id: {
                    $in: item_list
                }
            };
            // console.log('Rank filter_option: ', filter_option);
            if(point_inc > 0) {
                PointTown.update(filter_option, { $inc: {rank_point: point_inc} }, { upsert: false, multi: true }, function(err) {
                    if (err) {
                        console.log('PointTown Rank point increase:', err);
                    } else {
                        console.log('PointTown Rank point increase success');
                    }
                });
            }
        } catch(e) {
            console.log('Rank increase catch: ', e);
            common.saveException(cpid, "PointTown rank point increase", {
                requestData: {
                    item_list: item_list,
                    point_inc: point_inc,
                },
                name: e.name,
                message: e.message
            });
        }
    }
}
/*End V1*/

module.exports = router;
