// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by nguyen.khac.tung on 14/10/2019.
 */
const request = require('request');
const express = require('express');
const router = express.Router();

const UtilityModule = require('../modules/util');
const model = require('../model');
const common = require('../modules/common');
const ConnectPage = model.ConnectPage;
const SUB_TYPE = 'Zoho Api';
const g_zoho_info = {
    api_url: 'https://www.zohoapis.com/crm/v2',
    api_sandbox_url: 'https://sandbox.zohoapis.com/crm/v2',
};
const g_zoho_get_fields = ['id'];

router.post('/getFieldIdByName', function(req, res, next){
    console.log('---Zoho: Start get field ID by name');
    try {
        var body = req.body;
        var result = {};

        //get module fields for search
        var field_list = [];
        var field_prex = 'field_';
        for(var field in body) {
            if(field.indexOf(field_prex) == 0) {
                field_list.push({
                  name: field.replace(field_prex, ''),
                  value: body[field].toString().trim()
                })
            }
        }

        var data = {
            connect_page_id: typeof body.cid !== 'undefined' ?  body.cid : '',
            user_id:  typeof body.uid !== 'undefined' ?  body.uid : '',
            zoho_module_code: typeof body.zoho_module_code !== 'undefined' ?  body.zoho_module_code.trim() : '',
            zoho_sandbox: typeof body.zoho_sandbox !== 'undefined' ?  body.zoho_sandbox : '1',
            field_list: field_list,
        };

        console.log('data ', data);
        if(data.connect_page_id && data.zoho_module_code) {
            ConnectPage.findOne({_id: data.connect_page_id}, function(err, connect_page) {
                if (err) throw err;
                if(connect_page && typeof connect_page.auth == 'object') {
                    data.auth = connect_page.auth;

                    getZohoAccessToken(data, function (zoho_access_token) {
                        if(zoho_access_token){
                            data.zoho_access_token = zoho_access_token;
                            executeRequest(data, function(record_data) {
                                console.log('record_data: ', record_data);
                                res.status(200).json(record_data);
                            });
                        }
                    });

                } else {
                    data.msg = 'Zoho: Connect page collection not exist Zoho auth: auth.zoho';
                    data.zoho_auth = connect_page ? connect_page.auth : '';
                    UtilityModule.saveException(data.connect_page_id, data.user_id, data, SUB_TYPE);
                    res.status(200).json(result);
                }
            });

        } else {
            data.msg = 'Zoho: get field ID by name: missing params';
            UtilityModule.saveException(data.connect_page_id, data.user_id, {
                msg: data,
            }, SUB_TYPE);
            res.status(200).json(result);
        }
    } catch(e) {
        UtilityModule.saveException(data.connect_page_id, data.user_id, {
            msg: e,
        }, SUB_TYPE);
    }
});


function executeRequest(data, callback){
    try {
        var result = {};
        var zoho_module_code = data.zoho_module_code;
        var headers = {
            'Authorization': 'Zoho-oauthtoken ' + data.zoho_access_token
        };

        var url = g_zoho_info.api_url;
        if (data.zoho_sandbox == '1') {
            url = g_zoho_info.api_sandbox_url;
        }
        url += ('/' + zoho_module_code);
        url += '/search';

        //add field to url
        if(Array.isArray(data.field_list) && data.field_list.length) {
            url += '?criteria=(';
            for (var i=0; i<data.field_list.length; i++) {
                var field_item = data.field_list[i];
                url += '(' + field_item.name + ':equals:' + encodeURIComponent(field_item.value) + ')';
            }
            url += ')';
        }
        console.log('Zoho url: ', url);
        var options = {
            uri: url,
            headers: headers,
            method: "GET",
        };

        request(options, function (error, response, body) {
            if (error) {
                UtilityModule.saveException(data.connect_page_id, data.user_id, {error : error, params : options }, SUB_TYPE);
            }
            if(typeof body == 'string' && body != '') {
                body = JSON.parse(body);
            }
            if (typeof body == 'object' && Array.isArray(body.data) && body.data.length) {
                console.log('Zoho: Record total: ', body.data.length);

                var record_first = body.data[0];
                //get specific fields
                for(var i in g_zoho_get_fields) {
                    var field_code = g_zoho_get_fields[i];
                    if(typeof record_first[field_code] != 'undefined') {
                        result[field_code] = record_first[field_code];
                    }
                }
                return callback(result);
            } else {
                UtilityModule.saveException(data.connect_page_id, data.user_id, {
                    msg: 'Zoho: Record response format error',
                    options: options,
                    body: body,
                }, SUB_TYPE);
                return callback(result);
            }
        });

    } catch(e) {
        UtilityModule.saveException(data.connect_page_id, data.user_id, {
            msg: e,
        }, SUB_TYPE);
        return callback(result);
    }
}

function getZohoAccessToken(data, callback){
    try {
        var zoho_auth = null;
        if(typeof data.auth == 'object') {
            if (data.zoho_sandbox == '1') {
                zoho_auth = data.auth.zoho_sandbox;
            } else {
                zoho_auth = data.auth.zoho;
            }
        }

        console.log('Zoho: get Access Token:', {
            zoho_auth: zoho_auth,
            zoho_sandbox: data.zoho_sandbox,
        });
        if(zoho_auth) {
            var zoho_client_id = zoho_auth.client_id;
            var zoho_client_secret = zoho_auth.client_secret;
            var zoho_refresh_token = zoho_auth.refresh_token;

            var refresh_url = 'https://accounts.zoho.com/oauth/v2/token?refresh_token=' + zoho_refresh_token + '&client_id=' + zoho_client_id + '&client_secret=' + zoho_client_secret + '&grant_type=refresh_token';
            var options = {
                uri: refresh_url,
                method: "POST"
            };

            request(options, function (error, response, body1) {
                if (!error){
                    body1 = JSON.parse(body1);
                    console.log(body1);
                    if(body1 && body1.access_token) {
                        return callback(body1.access_token);

                    } else {
                        UtilityModule.saveException(data.connect_page_id, data.user_id, {
                            msg: 'Zoho: not have token in response data',
                            params: options,
                            body: body1,
                        }, SUB_TYPE);
                        return callback(false);
                    }
                }else{
                    UtilityModule.saveException(data.connect_page_id, data.user_id, {error : error, params : options }, SUB_TYPE);
                    return callback(false);
                }
            });
        } else {
            UtilityModule.saveException(data.connect_page_id, data.user_id, {
                msg: 'Zoho: Connect page collection not exist Zoho auth: auth.zoho',
                zoho_sandbox: data.zoho_sandbox
            }, SUB_TYPE);
        }

    } catch(e) {
        UtilityModule.saveException(data.connect_page_id, data.user_id, {
            msg: e,
            zoho_sandbox: data.zoho_sandbox
        }, SUB_TYPE);
    }
}

module.exports = router;