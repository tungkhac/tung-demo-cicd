// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require('request');
const puppeteer = require('puppeteer');

class Parent {
    constructor() {
    }
    async asyncForEach (array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    validateInput(body, key, value_default = "") {
        let result = value_default;
        if (typeof body[key] !== "undefined") {
            result = body[key];
        } else {
            // console.log(" Don't have data input ---> " + key);
        }
        return result;
    }

    getRequest(request_body_user) {
        return new Promise((resolve, reject) => {
            request(request_body_user, (error, response, body) => {
                if (error) {
                    console.log('Have error when request get', error);
                    reject(error)
                }
                if (!error && response.statusCode == 200) {
                    resolve(body);
                }
            });
        });
    }

    postRequest(url, body, headers) {
        return new Promise(function (resolve, reject) {
            request.post({
                headers: headers,
                url: url,
                body: body
            }, function (error, response, body) {
                if (error)
                    reject(error)
                else {
                    console.log('body is', body);
                    resolve(JSON.parse(body));
                }
            });
        });
    }

    errorResolve(res, error) {
        console.log('err', error);
        res.status(500).json({
            message: "Data return not true, check data input"
        });
    }

    async initBrowser(headless) {
        const browser =
        await puppeteer.launch({
            headless: headless,

            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process'
            ]
        });
    
        return browser;
    }

    async initPage(browser, list_file_abort = [], status = true){
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        if(status){
            page.on('request', request => {
                var rtype = request.resourceType();
                var rurl = request.url();
                if (rurl.indexOf("ebis") !== -1) {
                    request.continue();
                }else if(list_file_abort.includes(rtype)){
                    request.abort();
                } else if (rtype === "document") {
                    request.continue();
                } else {
                    request.continue();
                }
            });
        }else{
            page.on('request', request => {
                request.continue();
            })
        }

        page.on('error', async () => {
            await browser.close();
        });

        return page;
    }
    async initPage(browser, list_file_abort = [], status = true){
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        if(status){
            page.on('request', request => {
                var rtype = request.resourceType();
                var rurl = request.url();
                if (rurl.indexOf("ebis") !== -1) {
                    request.continue();
                }else if(list_file_abort.includes(rtype)){
                    request.abort();
                } else if (rtype === "document") {
                    request.continue();
                } else {
                    request.continue();
                }
            });
        }else{
            page.on('request', request => {
                request.continue();
            })
        }

        page.on('error', async () => {
            await browser.close();
        });

        return page;
    }

    async typeElement(page, list_element) {
        await this.asyncForEach(list_element, async (item) => {
            if( await page.$(item.element) !== null){
                switch (item.type) {
                    case 'text':
                        if (item.value != undefined) {
                            await page.focus(item.element);
                            await page.evaluate((item) => {
                                document.querySelector(item.element).value = item.value;
                            }, item);
                            // if(item.value != ''){
                            //     await page.type(item.element, item.value);
                            // }
                        }
                        break;

                    case 'date':
                        if (item.value != undefined) {
                            if(item.value != ''){
                                await page.type(item.element, item.value);
                            }
                        }
                        break;
    
                    case 'select':
                        if (item.value && item.value != undefined && item.value != '') {
                            await page.select(item.element, item.value);
                        }
                        break;
                        
                    case 'click':
                            await page.click(item.element);
                        break;
    
                    default:
                        break;
                }
            }else{
                console.log('element' + item.element + ' type '+ item.type +' null');
            }
        });
    }

    getCookieAll(arr) {
        if (arr) {
            var result = [];
            arr.forEach(function (element) {
                result.push(element);
            });
            return result
        }
        return false;
    }

    getDataInput(list_input, body){
        var data = {};
        list_input.forEach(key =>{
            data[key] = this.validateInput(body,key);
        });
        return data;
    }

    encode(value){
        console.log("encode", value);
        var encoded = Buffer.from(value).toString('base64');
        return encoded;
    }

    decode(value){
        var b = Buffer.from(value, 'base64')
        var s = b.toString('ascii');
        return s;
    }

}

module.exports = Parent;