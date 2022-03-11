// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
let express = require('express');
let router = express.Router();
const utils = require('../util');
const { updateInWhitelistRequestParams } = require('../modules/request/auth');

const SUB_TYPE = 'Pardot';
/* POST page. */
router.post('/', (req, res, next) => {
    let body = req.body;
    console.log("body=", body);
    const {cpid, uid, endpoint_url, ...form_data} = body;
    console.log("form_data=", form_data);
    if (endpoint_url !== void 0 && endpoint_url.length && cpid && uid) {
        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        let options = {
            uri: endpoint_url,
            headers: headers,
            method: "POST",
            form: form_data
        };

        updateInWhitelistRequestParams(options);
        request(options, (error, response, body1) => {
            let errors = {
                msg : body1,
                params : options
            };

            if (!error && response.statusCode === 200) {
                if (response.body !== void 0) {
                    console.log(response.body);
                } else {
                    utils.saveException(cpid, uid, errors, SUB_TYPE);
                }
            } else {
                utils.saveException(cpid, uid, errors, SUB_TYPE);
            }
            //console.log("error=", error);
            //console.log("body=", body);
            //console.log("response.statusCode=", response.statusCode);
            res.json({});
        });
    } else {
        res.json({});
    }
});

module.exports = router;
