// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var model = require('../model');

var Parent = require('./parent.class');
function encodeBase64(value) {
    var encoded = Buffer.from(value).toString('base64');
    return encoded;
}


class callbeeRouter extends Parent {
    constructor() {
        super();
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
    }
}


module.exports = new callbeeRouter().router;