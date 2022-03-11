// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var Parent = require('./parent.class');
const aut_token = "Basic QVBJX0NBTEw6cVFrNiBoZnFGIE52ZlIgZ094dSBpd2pBIHVSNzU=";
const postman_token = "95f178d2-49cb-bfaf-1744-853709fbaed8";
var querystring = require('querystring');
class aiScholarRouter extends Parent {
    constructor() {
        super();
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/create_account', async (req, res, next) => {
            var body = req.body;
            let email = this.validateInput(body, 'email');
            let password = this.validateInput(body, 'password');
            let bodyData = {
                "user_email": email,
                "user_pass": password
            };
            bodyData = querystring.stringify(bodyData);
            let headers = {
                'authorization': aut_token,
                'cache-control': 'no-cache',
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
                'postman-token': postman_token
            };
            let url = 'https://ai-scholar.tech/wp-json/add-users/v1/add-subscriber';
            this.postRequest(url, bodyData, headers)
                .then(body => {
                    let message = "";
                    if (body) {
                        message = (typeof body.message !== 'undefined') ? body.message : "";
                    }
                    res.json(
                        {
                            message: message
                        }
                    )
                })
                .catch(error => {
                    this.errorResolve(res, error);
                })

        });
    }
}

module.exports = new aiScholarRouter().router;
