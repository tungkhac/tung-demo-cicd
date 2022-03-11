// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by nguyen.khac.tung on 4/9/2019.
 */

const config = require('config');
const model = require('../model');

const exceptionModel = model.Exception;
const urlShortenModel = model.UrlShorten;
const Zipcode = model.Zipcode;
const UserCryptKey = model.UserCryptKey;
const ConnectPage = model.ConnectPage;
const PCodSetting = model.PCodSetting;
const EfoCv = model.EfoCv;
const UserProfile = model.UserProfile;

const shortid = require("shortid");
const validUrl = require("valid-url");
const url1 = require('url');
const moji = require('moji');
const crypto = require('crypto');
const cryptor = require('../routes/crypto');
const shortBaseUrl = config.get('shortBaseUrl');
const Util = require('../util');


function saveException(cpid, sub_type, err, type = '002') {
    var now = new Date();
    var exception = new exceptionModel({
        err: err,
        cpid: cpid,
        type: type,
        sub_type: sub_type,
        push_chatwork_flg: 0,
        created_at: now,
        updated_at: now
    });
    exception.save(function (err) {
    });
}

function getShortUrl(cpid, originalUrl, callback) {
    if (validUrl.isUri(originalUrl)) {
        urlShortenModel.findOne({cpid: cpid, originalUrl: originalUrl}, function (err, result) {
            if (result) {
                return callback(result.shortUrl);
            } else {
                var urlCode = shortid.generate();
                var shortUrl = shortBaseUrl + "/" + urlCode;

                var url_parts = url1.parse(originalUrl);
                var url_path = "";
                if (url_parts.protocol && url_parts.host) {
                    url_path = url_parts.protocol + "//" + url_parts.host + url_parts.pathname;
                }
                var item = new urlShortenModel({
                    cpid: cpid,
                    originalUrl: originalUrl,
                    path: url_path,
                    shortUrl: shortUrl,
                    urlCode: urlCode,
                    updated_at: new Date()
                });
                item.save(function (err) {
                    return callback(item.shortUrl);
                });
            }
        });
    } else {
        return callback(originalUrl);
    }
}

function getAddressFromPostcode(address, callback) {
    var zipcode = "";
    var pref = "";
    var city = "";
    var street = "";
    var other_address = "";
    var address1 = "";
    var zipcode2 = "";

    if (address && address.length > 0) {
        address = address.trim();
        zipcode = toPostFmt(address);
        zipcode2 = toPostFmt2(zipcode);
        address1 = address.replace(new RegExp(zipcode, "g"), "");
        address1 = address1.replace(/〒/g, "");
        address1 = address1.trim();
        Zipcode.findOne({"zipcode": zipcode}, function (err, result) {
            if (result) {
                pref = result.pref;
                city = result.city;
                street = result.street;
                other_address = address.replace(/〒/g, "");
                other_address = other_address.replace(new RegExp(zipcode, "g"), "");
                other_address = other_address.replace(new RegExp(pref, "g"), "");
                other_address = other_address.replace(new RegExp(city, "g"), "");
                other_address = other_address.replace(new RegExp(street, "g"), "");
                other_address = other_address.trim();
            }
            callback({
                "zipcode": zipcode,
                "zipcode2": zipcode2,
                "other_address": other_address,
                "pref": pref,
                "city": city,
                "city2": city + street,
                "street": street,
                "address2": street + other_address,
                "address": address1
            });
        });
    } else {
        callback({
            "zipcode": zipcode,
            "zipcode2": zipcode2,
            "other_address": "",
            "pref": pref,
            "city": city,
            "city2": "",
            "street": street,
            "address2": "",
            "address": address1
        });
    }
}

/**
 * Return an Object sorted by it's Key
 */
function sortObjectByKey(obj){
    var keys = [];
    var sorted_obj = {};

    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            keys.push(key);
        }
    }

    // sort keys
    keys.sort();

    // create new array based on Sorted Keys
    if (keys.length) {
        keys.forEach(function (key1) {
            sorted_obj[key1] = obj[key1]
        });
    }

    return sorted_obj;
};

function generateChecksumAftee(data, secret_key) {
    // console.log('==================data', data, Object.keys(data).length);
    // 店舗秘密鍵（サンプルとしてATONE_SHOP_SECRET_KEYとする）は先頭に持ってくる
    var checksum = '';
    if (data !== void 0 && Object.keys(data).length) {
        checksum = secret_key + ',';
        for (var key1 in data) {
            if (data[key1] != void 0 && typeof data[key1] === 'object') {
                //要素が配列（連想配列含む）だった場合 ->配送先、購⼊者
                var value1 = data[key1];
                for (var key2 in value1) {
                    if (value1[key2] != void 0 && typeof value1[key2] === 'object') {
                        //要素がアイテムだった場合はさらにループ
                        var value2 = value1[key2];
                        for (var key in value2) {
                            checksum += value2[key];
                        }
                    } else {
                        checksum += value1[key2];
                    }
                }
            } else {
                checksum += data[key1];
            }
        }
        console.log('========================checksum', checksum);
        //⽂字列をsha256でハッシュ化した後、Base64でエンコード
        const hash = crypto.createHash('sha256');
        hash.update(checksum, 'uft8');
        checksum = hash.digest('base64');
    }

    return checksum;
}

function toPostFmt(text) {
    if (typeof text !== "undefined" && text.length >= 7) {
        text = text.replace(/〒/g, "");
        text = text.substr(0, 7);
        var h = text.substr(0, 3);
        var m = text.substr(3);
        text = h + m;
    }
    return text;
}

function toPostFmt2(zipcode) {
    if (typeof zipcode !== "undefined" && zipcode.length == 7) {
        zipcode = zipcode.substr(0, 3) + '-' + zipcode.substr(3, 7);
    }
    return zipcode;
}

function convertKanjiJapan(str = '') {
    var result = '';
    try {
        if (str) {
            str = str.replace(/[A-Za-z0-9-]/g, function(s) {
                return String.fromCharCode(s.charCodeAt(0) + 65248);
            });
            result = str.replace(/ /g, "　");
        }
    } catch (e) {
        console.log('convertKanjiJapan', e);
    }

    return result;
}

function convertTextKana(str = '') {
    var result = '';
    try {
        if (str) {
            str = moji(str).convert('ZK', 'HK').toString();
            result = str.replace(/ /g, " ");
            result = result.replace(/　/g, " ");
        }
    } catch (e) {
        console.log('convertTextKana', e);
    }

    return result;
}

function getConnectPageInfo(connect_page_id, user_id, callback){
    findCryptKeyOfUser(connect_page_id, user_id, function (result_check, encrypt_key) {
        console.log('getConnectPageInfo');
        var data = {};
        ConnectPage.findOne({_id: connect_page_id, deleted_at: null}, function (err, result) {
            if (!err && result) {
                EfoCv.findOne({connect_page_id: connect_page_id, user_id: user_id}, function(errCv, resultPosition) {
                    if (!errCv){
                        if(resultPosition){
                            data.log_order_id = resultPosition._id;
                            data.device = resultPosition.device;
                        }
                        data.connect_id = result.connect_id;
                        data.encrypt_flg = result.encrypt_flg;
                        data.encrypt_key = encrypt_key;
                        return callback(true, data);
                    }
                });
            }else{
                return callback(false);
            }
        });
    });
}

function findCryptKeyOfUser(connect_page_id, user_id, callback) {
    var encrypt_key = '';

    if(connect_page_id != void 0 && user_id != void 0) {
        UserCryptKey.findOne({connect_page_id: connect_page_id, user_id: user_id}, function (err, result) {
            if (err) throw err;
            if(result && result.salt != void 0){
                encrypt_key = result.salt;
                return callback(true, encrypt_key);
            } else {
                return callback(true, encrypt_key);
            }
        })
    }else{
        return callback(true, encrypt_key);
    }
}

function getCodSettingInfo(cpid, provider_code, callback) {
    if (provider_code && cpid) {
        PCodSetting.findOne({cpid: cpid, provider: provider_code}, function (err, res) {
            if(res) {
                return callback(true, res);
            }else{
                return callback(false);
            }
        });
    } else {
        return callback(false);
    }
}

function convertVariableValue(params, row) {
	var value = row.variable_value;
	if (params && params.encrypt_flg) {
		value = cryptor.decryptConvertJSON(value, params.encrypt_key);
	}
	var tmp_value_arr = [];
	var tmp_value = value;

	if (Array.isArray(value)) {
		value.forEach(function(element) {
			if (element.value !== undefined) {
				tmp_value_arr.push(element.value);
			} else if (element.text) {
				tmp_value_arr.push(element.text);
			} else {
				tmp_value_arr.push(element);
			}
		});
		tmp_value = tmp_value_arr.join(',');
	}
	return tmp_value;
}

const increaseCvForUserProfile = async (connect_page_id, user_id) => {
    if (!user_id || !connect_page_id) {
        return;
    }
    const now = new Date();
    await UserProfile.findOneAndUpdate({ connect_page_id, user_id }, {
        $inc: { cv_count: 1 },
        $push: { cv_date: now },
        $set: { last_cv_date: now },
    });
}

exports.saveException = saveException;
exports.getShortUrl = getShortUrl;
exports.getAddressFromPostcode = getAddressFromPostcode;
exports.convertKanjiJapan = convertKanjiJapan;
exports.convertTextKana = convertTextKana;
exports.generateChecksumAftee = generateChecksumAftee;
exports.sortObjectByKey = sortObjectByKey;
exports.getConnectPageInfo = getConnectPageInfo;
exports.convertVariableValue = convertVariableValue;
exports.getCodSettingInfo = getCodSettingInfo;
exports.increaseCvForUserProfile = increaseCvForUserProfile;
