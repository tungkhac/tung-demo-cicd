// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
'use strict';

var model = require('../model');
var i18n = require("i18n");
const config = require('config');
const CryptoJS = require("crypto-js");
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const passphrase = '123';
const password_api = config.get('password_api');

function encrypt(key, plain_text){
    var iv = key.substr(0, 32);
    key = CryptoJS.enc.Hex.parse(key);
    iv = CryptoJS.enc.Hex.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(plain_text, key, {iv: iv});
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

function decrypt(key, ciphertext){
    var iv = key.substr(0, 32);
    key = CryptoJS.enc.Hex.parse(key);
    iv = CryptoJS.enc.Hex.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv});
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function createKey(){
    var key = CryptoJS.lib.WordArray.random(32);
    return CryptoJS.enc.Hex.stringify(key);
}

// var key_encrypt = createKey();
// console.log('key', key_encrypt);
// console.log('asdfasdfasdf', convertJSONEncrypt({abc: "test"}, key_encrypt));
// var encrypted = convertJSONEncrypt({abc: "test"}, key_encrypt);
// console.log('asdfasdfasdf', decryptConvertJSON(encrypted, key_encrypt));

// console.log('asdfasdfddddd', encrypt('d32e11b41166839d1b2c95b2a42bdd5c2c665526177a5f3eebb5a9a1e8a72028',"hailt"));
// console.log('asdfasdf', decrypt('d32e11b41166839d1b2c95b2a42bdd5c2c665526177a5f3eebb5a9a1e8a72028',"pi78EnpD1KLJ024Y7hAcog=="));
// console.log('asdfasdf test', convertJSONEncrypt({abc: "test"}, 'd32e11b41166839d1b2c95b2a42bdd5c2c665526177a5f3eebb5a9a1e8a72028'));

// function decryptKeyConvertJSON(ciphertext, key) {
//     try {
//         var decrypted = decrypt(key, ciphertext);
//         return JSON.parse(decrypted);
//     } catch (err) {
//         return {};
//     }
// }

function decryptConvertJSON(ciphertext, key) {
    try {
        var decrypted = decrypt(key, ciphertext);
        return JSON.parse(decrypted);
    } catch (err) {
        return {};
    }
}

function convertJSONEncrypt(cipher, key) {
    try {
        var cipher_plain_text = JSON.stringify(cipher);
        return encrypt(key, cipher_plain_text);
    } catch (err) {
        return '';
    }
}

function decryptSalesForce(encText){
    const decodeText = Buffer.from(encText, 'base64');
    const salt = decodeText.slice(0,16);
    const ct = decodeText.slice(16).toString('binary');
    const rounds = 3;
    const data00 = Buffer.concat([Buffer.from(password_api),salt]);

    var hash = [];
    hash[0] = crypto.createHash("sha256").update(data00).digest("binary");
    var result = hash[0];
    for (var i = 1; i < rounds; i++) {
        var tmp = Buffer.concat([Buffer.from(hash[i - 1],"binary"),data00]);
        hash[i] = crypto.createHash("sha256").update(tmp).digest("binary");
        result += hash[i];
    }

    const base = Buffer.from(result, "binary");
    const key = base.slice(0,32);
    const iv = base.slice(32,48);

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    var content = decipher.update(ct, "binary", "utf8");
    content += decipher.final("utf8");

    return content;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.decryptConvertJSON = decryptConvertJSON;
exports.convertJSONEncrypt = convertJSONEncrypt;
exports.decryptSalesForce = decryptSalesForce;