// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MerchantConfig_1 = require("./MerchantConfig");
class HttpClient {
    constructor(config) {
        this._config = config;
    }
    execute(uri, json) {
        const request = require("request");
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': MerchantConfig_1.MerchantConfig.userAgent
        };
        let options = {
            url: uri,
            method: 'POST',
            headers: headers,
            body: encodeURIComponent(json),
            timeout: this._config.timeout * 1000,
        };
        return new Promise((resolve, reject) => {
            request.post(uri, options, (error, response) => {
                if (error != null) {
                    reject(error);
                }
                else {
                    let statusCode = response.statusCode;
                    if (statusCode == null) {
                        reject(response);
                    }
                    if (!error && statusCode == 200) {
                        resolve(response);
                    }
                    else {
                        reject(response);
                    }
                }
            });
        });
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=HttpClient.js.map