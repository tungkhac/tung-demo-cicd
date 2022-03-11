// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
var urlencode = require('urlencode');
var model = require('../model');
var Exception = model.Exception;
var moment = require('moment');
var geolib = require('geolib');

var mojimaModule = model.Nojima;

const TYPE_FACEBOOK = "001",
    TYPE_LINE = "002",
    DEFAULT_BTN_TITLE = "店舗詳細ページ",
    DEFAULT_MESSAGE_NO_SHOP = "もうしわけありません。ご希望の近隣には店舗がございません。",
    NUMBER_RECORD = "件見つかりました！",
    DEFAULT_BTN_MAP = "Mapで表示",
    DEVICE_PC = "pc";

function nojimaGetShop(carousel, req_param, callback) {
    var distances = [];
    var load_more_shop = [];
    var carousel_elm = [];
    var count_shop = 0;
    var query_sql = {};

    //if(req_param.city_name !== undefined && req_param.city_name != "" && req_param.city_name.length > 0){
    //    query_sql = {city: req_param.city_name};
    //
    //    //mojimaModule.find({city: req_param.city_name}, function(err, results) {
    //    //    if (err) throw err;
    //    //    if(results && results.length > 0){
    //    //        results.forEach(function (row) {
    //    //            console.log(row);
    //    //            shopOfCity(distances, req_param.lat, req_param.lng, req_param.load_more, row, function (result) {});
    //    //        });
    //    //    }
    //    //});
    //}
    mojimaModule.find(query_sql, function(err, results) {
        if (err) throw err;
        if(results && results.length > 0){
            results.forEach(function (row) {
                distanceShop(distances, req_param.lat, req_param.lng, row, function (result) {});
                if(req_param.load_more !== undefined){
                    loadMoreShop(load_more_shop, req_param.lat, req_param.lng, req_param.load_more, row, function (result) {});
                }
            });
            // console.log('after: ', distances);
            if(req_param.load_more !== undefined){
                load_more_shop = load_more_shop.concat(distances);
                distances = removeDuplicatesLoadMore(distances, load_more_shop);
            }
            if(distances.length > 0){
                distances = removeDuplicates(distances);
                distances.sort(function(a, b){
                   return a.distance - b.distance;
                });
                distances.forEach(function (shop, index) {
                    if(index >= 10) return false;
                    count_shop++;
                    /*return format carousel element*/
                    createCarouselFormat(carousel_elm, req_param, shop, function (res) {});
                });
            }else{
                //message no shop
                if(req_param.sns_type == TYPE_FACEBOOK){
                    carousel.push({
                        message:{
                            text: req_param.no_shop_message !== undefined ? req_param.no_shop_message : DEFAULT_MESSAGE_NO_SHOP
                        },
                        count: count_shop
                    });
                }else if(req_param.sns_type == TYPE_LINE){
                    carousel.push({
                        message:{
                            type: "text",
                            text: req_param.no_shop_message !== undefined ? req_param.no_shop_message : DEFAULT_MESSAGE_NO_SHOP
                        },
                        count: count_shop
                    });
                }
            }
        }
        /*return format carousel*/
        if(carousel_elm.length){
            if(req_param.sns_type == TYPE_FACEBOOK){
                carousel.push({
                    message:{
                        attachment: {
                            payload: {
                                template_type: "generic",
                                elements: carousel_elm
                            },
                            type: "template"
                        }
                    },
                    message1:{
                        text: count_shop + NUMBER_RECORD
                    },
                    count: count_shop
                });
            }else if(req_param.sns_type == TYPE_LINE){
                carousel.push({
                    message:{
                        type: "template",
                        altText: "carousel",
                        template: {
                            type: "carousel",
                            columns: carousel_elm,
                            imageAspectRatio: "square",
                            imageSize: "contain"
                        }
                    },
                    message1:{
                        type: "text",
                        text: count_shop + NUMBER_RECORD
                    },
                    count: count_shop
                });
            }
        }
        return callback(carousel);
    });
}

function removeDuplicates(arr) {
    var newArr = [];
    var unique = {};
    arr.forEach(function(item) {
        if (!unique[item.shop_id]) {
            newArr.push(item);
            unique[item.shop_id] = item;
        }
    });
    return newArr;
}

function removeDuplicatesLoadMore(first_load, load_more){
    var newArr = [],
        push_flg = true;
    if(first_load.length == 0){
        newArr = load_more;
    }else if(first_load.length > 0 && load_more.length > 0){
        load_more.forEach(function(item) {
            push_flg = true;
            first_load.forEach(function(item_first) {
                if(item.shop_id == item_first.shop_id) return push_flg = false;
            });
            if(push_flg){
                newArr.push(item);
            }
        });
    }
    return newArr;
}

function distanceShop(distances, param_lat, param_lng, shop, callback) {
    //console.log("distanceShopdistanceShop");

    var lat = shop.lat,
        lng = shop.long,
        init_radius = 10;
    //console.log(lat, lng, param_lat, param_lng);

    var distance_between_shop = geolib.getDistance(
        {latitude: lat, longitude: lng},
        {latitude: param_lat, longitude: param_lng}
    );
    distance_between_shop = geolib.convertUnit('km', distance_between_shop);
    if(distance_between_shop < init_radius){
        distances.push({
            shop_id: shop.id,
            shop_url: shop.url,
            shop_address: shop.address,
            shop_image: shop.image1,
            shop_name: shop.shop_name,
            shop_tel: shop.shop_tel,
            distance: distance_between_shop
        });
    }
    return callback(distances);
}

function loadMoreShop(load_more_shop, param_lat, param_lng, load_more, shop, callback) {
    var lat = shop.lat,
        lng = shop.long,
        init_radius = 10;
        load_more = init_radius + (load_more != '' ? parseInt(load_more) : 10);
    var distance_between_shop = geolib.getDistance(
        {latitude: lat, longitude: lng},
        {latitude: param_lat, longitude: param_lng}
    );
    distance_between_shop = geolib.convertUnit('km', distance_between_shop);
    if(init_radius < distance_between_shop && distance_between_shop < load_more){
        load_more_shop.push({
            shop_id: shop.id,
            shop_url: shop.url,
            shop_address: shop.address,
            shop_image: shop.image1,
            shop_name: shop.shop_name,
            shop_tel: shop.shop_tel,
            distance: distance_between_shop
        });
    }
    return callback(load_more_shop);
}

function shopOfCity(distances, param_lat, param_lng, load_more, shop, callback) {
    var lat = shop.lat,
        lng = shop.long;
    var distance_between_shop = geolib.getDistance(
        {latitude: lat, longitude: lng},
        {latitude: param_lat, longitude: param_lng}
    );
    distance_between_shop = geolib.convertUnit('km', distance_between_shop);
    // if(load_more === undefined){
        distances.push({
            shop_id: shop.id,
            shop_url: shop.url,
            shop_address: shop.address,
            shop_image: shop.image1,
            shop_name: shop.shop_name,
            shop_tel: shop.shop_tel,
            // distance: distance_between_shop
        });
    // }
    return callback(distances);
}

function createCarouselFormat(carousel_elm, req_param, shop, callback) {
    var buttons = [];
    if(req_param.sns_type == TYPE_FACEBOOK){
        if(req_param.device !== undefined && req_param.device !== DEVICE_PC){
            buttons = [
                {
                    url: shop.shop_url,
                    title: req_param.detail_btn_title !== undefined ? req_param.detail_btn_title : DEFAULT_BTN_TITLE,
                    type: "web_url"
                },
                {
                    url: "https://www.google.com/maps/search/?api=1&query="+ urlencode(shop.shop_address),
                    title: req_param.detail_btn_map !== undefined ? req_param.detail_btn_map : DEFAULT_BTN_MAP,
                    type: "web_url"
                }
            ];
        }else{
            buttons = [
                {
                    url: shop.shop_url,
                    title: req_param.detail_btn_title !== undefined ? req_param.detail_btn_title : DEFAULT_BTN_TITLE,
                    type: "web_url"
                }
            ];
        }

        carousel_elm.push({
            title: shop.shop_name + " | " + "<a href='tel:"+shop.shop_tel+ "' target='_parent'>" + shop.shop_tel +"</a>",
            subtitle: shop.shop_address,
            image_url: shop.shop_image,
            buttons: buttons,
            default_action: {
                url: shop.shop_url,
                type: "web_url"
            }
        });
    }else if(req_param.sns_type == TYPE_LINE){
        buttons = [
            {
                type: "uri",
                label: req_param.detail_btn_title !== undefined ? req_param.detail_btn_title : DEFAULT_BTN_TITLE,
                uri: shop.shop_url
            }
        ];
        var image_url = shop.shop_image;
        image_url = image_url.replace("http://", "https://", 'mg');
        carousel_elm.push({
            thumbnailImageUrl: image_url,
            title: shop.shop_name,
            text: shop.shop_address,
            actions: buttons,
            defaultAction: {
                type: "uri",
                label: req_param.detail_btn_title !== undefined ? req_param.detail_btn_title : DEFAULT_BTN_TITLE,
                uri: shop.shop_url
            }
        });
    }
    return callback(carousel_elm);
}

exports.nojimaGetShop = nojimaGetShop;