// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();

const mongoose = require("mongoose");
var model = require('../model');
const Exception = model.Exception;
const GmoPoint = model.GmoPoint;
var UrlShorten = model.UrlShorten;
const shortid = require("shortid");
const validUrl = require("valid-url");
const url1  = require('url');
const config = require('config');
const shortBaseUrl = config.get('shortBaseUrl');

router.post('/getCategory', function(req, res, next) {
    var body = req.body;
    var cpid =  body.cpid;

    var response_data = {
        type: '005',
        data: [],
        error_message: 'おすすめが見つかりませんでした。'
    };

    try {
        GmoPoint.distinct('category', function(err, result) {
            console.log('GMO Category: ', (result ? result.length : result));
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
        saveException(cpid, "GMO get project type", {
            name: e.name,
            message: e.message
        });
        res.json(response_data);
    }
});

router.post('/getProjectType', function(req, res, next) {
    var body = req.body;
    var category_param = body.category;
    var cpid =  body.cpid;

    var response_data = {
        type: '005',
        data: [],
        error_message: 'おすすめが見つかりませんでした。'
    };

    if(category_param != void 0) {
        var filter_option = {
            category: category_param.split(',')
        };
        console.log('GMO Point Get Project type: ', filter_option);

        try {
            GmoPoint.distinct('project_type', filter_option, function(err, result) {
                console.log('GMO Project type result: ', (result ? result.length : result));
                if(result && result.length){
                    response_data.data = result.reduce(function (result_array, project_type) {
                        result_array.push({
                            value: project_type,
                            text: project_type
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
            saveException(cpid, "GMO get project type", {
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
    var body = req.body;
    console.log(body);
    var category_param = body.category;
    var project_type_param = body.project_type;
    var point_space_param = body.get_point;
    var cpid =  body.cpid;

    var response_data = {
        type : '012',
        data: []
    };

    if(category_param != void 0) {
        var filter_option = {
            category: category_param.split(','),
        };
        //get project_type
        if(project_type_param !== void 0 && project_type_param.length > 0) {
            //Find substring in string
            // project_type_param = project_type_param.split(',').join('|');
            // filter_option.project_type = new RegExp(project_type_param);

            //Find by string
            filter_option.project_type = project_type_param.split(',');
        }
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
                filter_option.points =  {
                    $gte: point_space_param[0],
                    $lt: point_space_param[1]
                }
            } else {
                filter_option.points = {
                    $gte: point_space_param[0]
                }
            }
        }
         console.log('GMO Point Filter: ', filter_option);

        try {
            GmoPoint.find(filter_option, function(err, result) {
                // console.log('GMO Point result: ', result);
                if(result && result.length){
                    var break_line = '</br>';
                    result.forEach(function (point_item, point_index) {
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

                        response_data.data.push({
                            title : '獲得ポイント：' + point_item.points + 'pt' + title,
                            subtitle : sub_title,
                            item_url : '',
                            image_url : image_url,
                            button : {
                                title : "詳しく見る",
                                type : "postback",
                                payload : 'CAROUSEL_GMO_' + point_item._id
                            }
                        });
                    });
                    res.json(response_data);
                } else {
                    response_data.error_message = 'おすすめが見つかりませんでした。';
                    res.json(response_data);
                }
            }).limit(10);

        } catch(e) {
            saveException(cpid, "GMO Point", {
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

    var response_data = {
        message_type : "002",
        type : '111',
        conversation_not_end_flg : 1
    };
    var break_line = '</br>';

    if(item_id != void 0) {
        try {
            GmoPoint.findOne({_id: item_id}, function(err, result) {
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

                    getUrl2(cpid, link_page, function (shortUrl) {
                        response_data.data.message[0].list.push({
                            title : 'ポイントを貯める（クリックすると外部サービスに移動します）',
                            type : 'link',
                            url : shortUrl
                        });
                        // console.log('GMO item: ', response_data);
                        res.json(response_data);
                    });
                } else {
                    response_data.error_message = 'おすすめが見つかりませんでした。';
                    res.json(response_data);
                }
            });

        } catch(e) {
            saveException(cpid, "GMO Point Item", {
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

function getUrl(index, keys, cpid, callback){
    if(keys[index]){
        var originalUrl = keys[index];
        if (validUrl.isUri(originalUrl)) {
            UrlShorten.findOne({cpid: cpid, originalUrl: originalUrl}, function (err, result) {
                if (result) {
                    return callback(true, result.shortUrl);
                }else{
                    var urlCode = shortid.generate();
                    var shortUrl = shortBaseUrl + "/" + urlCode;

                    var url_parts = url1.parse(originalUrl);
                    var url_path = "";
                    if(url_parts.protocol && url_parts.host){
                        url_path =  url_parts.protocol + "//" +  url_parts.host + url_parts.pathname;
                    }
                    var item = new UrlShorten({
                        cpid: cpid,
                        originalUrl: originalUrl,
                        path: url_path,
                        shortUrl: shortUrl,
                        urlCode: urlCode,
                        updated_at: new Date()
                    });
                    item.save(function(err){
                        return callback(true, item.shortUrl);
                    });
                }
            });
        }else{
            return callback(true, originalUrl);
        }
    }else{
        return callback(false);
    }
}

function getUrl2(cpid, originalUrl, callback){
    if (validUrl.isUri(originalUrl)) {
        UrlShorten.findOne({cpid: cpid, originalUrl: originalUrl}, function (err, result) {
            if (result) {
                return callback(result.shortUrl);
            }else{
                var urlCode = shortid.generate();
                var shortUrl = shortBaseUrl + "/" + urlCode;

                var url_parts = url1.parse(originalUrl);
                var url_path = "";
                if(url_parts.protocol && url_parts.host){
                    url_path =  url_parts.protocol + "//" +  url_parts.host + url_parts.pathname;
                }
                var item = new UrlShorten({
                    cpid: cpid,
                    originalUrl: originalUrl,
                    path: url_path,
                    shortUrl: shortUrl,
                    urlCode: urlCode,
                    updated_at: new Date()
                });
                item.save(function(err){
                    return callback(item.shortUrl);
                });
            }
        });
    }else{
        return callback(originalUrl);
    }
}

function saveException(cpid, sub_type, err){
    var now = new Date();
    var exception = new Exception({
        err: err,
        cpid: cpid,
        type: "002",
        sub_type: sub_type,
        push_chatwork_flg: 0,
        created_at : now,
        updated_at : now
    });
    exception.save(function(err) {
    });
}


module.exports = router;
