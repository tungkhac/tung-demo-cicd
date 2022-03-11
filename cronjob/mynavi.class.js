// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const Parent = require('../routes/parent.class');
const model = require('../model');
const CustomMynaviCondition = model.CustomMynaviCondition;
const CustomMynaviCrawlDataHistory = model.CustomMynaviCrawlDataHistory;
const CustomMynaviPoint = model.CustomMynaviPoint;
const CustomMynaviRecommend = model.CustomMynaviRecommend;
const CustomMynaviPageNull = model.CustomMynaviPageNull;
const data_mynavi = require('../data/mynavi/mynavi').data;
const headless = true;
const fs = require('fs');
var parse = require('csv-parse');
var request = require('request');
const API_KEY = 'AIzaSyBuM5GwydDMWgeOsPKYaaPWuHTR3xxEu6o';
const SHEET_ID = '17SVH8d-KV1d2ksZkylo0EuSMFNIaP14ljvXID3BAbbE';
const { GoogleSpreadsheet } = require('google-spreadsheet');

class Mynavi extends Parent {
    constructor(list_link_page, current_index) {
        super();
        this.maxTimeFailer = 10;
        this.start_time = 0;
        this.end_time = 0;
        this.is_finish = 0;
        this.is_running = 0;
        this.list_data_save = [];
        this.list_link_page = list_link_page;
        this.list_link_done = [];
        this.numberFailer = 0;
        this.current_index = current_index;
    }

    async startCraw() {
        if (this.numberFailer == 0) {
            this.is_running = 1;
            this.browser = await this.initBrowser(headless);
            this.start_time = +new Date();
            console.log('start crawl at ', new Date().toISOString(), this.start_time, this.current_index);
        }
    }

    async finishCraw() {
        this.end_time = +new Date();
        await new Promise((resolve, reject) => {
            try {
                let data_insert = {
                    current_index: this.current_index,
                    count: this.list_data_save.length,
                    time_start: this.start_time,
                    time_end: this.end_time,
                    time: this.end_time - this.start_time,
                    status: this.is_finish ? true : false,
                    created_at: new Date()
                }
                let insert_obj = new CustomMynaviCrawlDataHistory(data_insert);
                insert_obj.save((err, result) => {
                    if (err) {
                        reject(err);
                    }
                    if (result) {
                        resolve(true)
                    }
                });
            } catch (error) {
                reject(error)
            }
        });

        console.log('crawl start at  ', this.current_index, new Date().toISOString(), this.start_time);
        console.log('crawl finish at  ', this.current_index, new Date().toISOString(), this.end_time);
        console.log('crawl in ', this.current_index, this.end_time - this.start_time, ' miniseconds');
        this.is_running = 0;
        this.start_time = 0;
        this.end_time = 0;
        this.list_data_save = [];
        this.list_link_done = [];
        this.numberFailer = 0;
        this.is_finish = 0;
        await this.browser.close();
    }

    async crawlData() {
        if (this.is_running == 0 || (this.is_running == 1 && this.numberFailer > 0)) {
            try {
                await this.startCraw();
                await this.asyncForEach(this.list_link_page, async (link_page_object, index) => {
                    if (!this.list_link_done.includes(link_page_object.producturl)) {
                        await this.getContentOfPage(link_page_object);
                    }
                });
                console.log("get data ok ready save in database ", this.current_index);
                await new Promise((resolve, reject) => {
                    try {
                        if (this.list_data_save.length) {
                            CustomMynaviCondition.remove({ type: this.current_index }, (err) => {
                                resolve(true)
                            });
                        } else {
                            resolve(true)
                        }
                    } catch (error) {
                        reject(error)
                    }
                });
                await this.asyncForEach(this.list_data_save, async (item) => {
                    await CustomMynaviCondition.updateOne({ condition: item.condition, id: item.id, current_index: this.current_index }, {
                        $set: item
                    }, { upsert: true }, (err, result) => {
                        if (err) {
                            console.log('Have error when insert data', this.current_index, item);
                        } else {
                        }
                    });
                });
                this.is_finish = 1;
                this.finishCraw();
            } catch (error) {
                this.numberFailer++;
                console.log('Number_failer ---> ', this.current_index, this.numberFailer);
                if (this.numberFailer < this.maxTimeFailer) {
                    this.crawlData()
                } else {
                    this.finishCraw();
                    console.log(' can not craw data tour', this.current_index);
                }
                console.log('have error when crawl data tour', error)
            }
        } else {
            console.log('The previous run has not finished you cannot create new ', this.current_index);
        }

    }

    async getContentOfPage(link_page_object) {
        return new Promise(async (resolve, reject) => {
            try {
                const page = await this.initPage(this.browser, ["font", "stylesheet", "script", "image"]);
                // const page = await this.initPage(this.browser, []);
                await page.goto(link_page_object.producturl, { waitUntil: 'networkidle0' });
                const list_table_2 = await page.evaluate(() => Array.from(document.querySelectorAll("#basic .table2"), element => element.textContent));
                var find_flag = 0;
                list_table_2.forEach((table_text, index) => {
                    if (table_text.includes("\n\nこだわり条件\n\n")) {
                        let text_condition_1_arr = table_text.split("こだわり条件\n\n");
                        let text_condition_1 = text_condition_1_arr.length ? text_condition_1_arr[1] : "";
                        let text_condition_2_arr = text_condition_1.split("\n\n\n");
                        let text_condition_2 = text_condition_2_arr.length ? text_condition_2_arr[0] : "";
                        let condition_arr = text_condition_2.split("\n");
                        condition_arr.forEach(condition => {
                            find_flag = 1;
                            if (condition && typeof condition === "string") {
                                let item_save = { ...link_page_object };
                                item_save.condition = condition;
                                item_save.current_index = this.current_index;
                                this.list_data_save.push(item_save);
                            }
                        })
                    }
                });
                if (!find_flag) {
                    console.log(this.current_index, ' Can not find condition of page ', link_page_object.producturl);
                }
                await page.close();
                this.list_link_done.push(link_page_object.producturl);
                // console.log('done ---> ', this.current_index, this.list_data_save.length, link_page_object.producturl);
                resolve(true);
            } catch (error) {
                reject(error)
            }

        });
    }

}

class crawMynavi {
    constructor(device) {
        this.device = device;
        this.list_obj_craw = {};
        let length_of_set = Math.ceil(data_mynavi.length / this.device);
        for (let i = 1; i <= this.device; i++) {
            let list_link_page = data_mynavi.slice((i - 1) * length_of_set, i * length_of_set);
            // this.list_obj_craw[i] = new Mynavi([list_link_page[0]], i);
            this.list_obj_craw[i] = new Mynavi(list_link_page, i);
        }

    }
    crawlData() {
        for (let i = 1; i <= this.device; i++) {
            // if (i == 3)
            this.list_obj_craw[i].crawlData();
        }
    }
}

class crawMynaviRecommend extends Parent {
    constructor() {
        super();
        this.link_file = "https://wedding.mynavi.jp/criteo/recommend.csv";
    }

    getDataRecommend() {
        const options = {
            host: 'https://wedding.mynavi.jp',
            port: 443,
            path: 'criteo/recommend.csv',
            method: 'GET',
            headers: {
                'Content-Type': 'application/CSV'
            }
        };
        request.get(this.link_file, options, async (err, res, body) => {
            if (err) {
                console.log('err', err);
            } else {
                try {
                    var list_data = body.split("\n");
                    if(list_data.length){
                        var list_id = {};
                        var list_id_null = {};
                        await CustomMynaviRecommend.remove({}, (err) => { });
                        await this.asyncForEach(list_data, async (item, index) => {
                            let list_atribute = item.split('","');
                            console.log('list_atribute lenth===============', list_atribute.length);
                            if(list_atribute && list_atribute.length == 13 && !list_atribute[0].includes('id') ){
                                list_id[list_atribute[0].replace('"','')] = 1;
                                let itemSave = new CustomMynaviRecommend({
                                    id_number: parseInt(list_atribute[0].replace("c","1000").replace('"','')),
                                    id:list_atribute[0].replace('"',''),
                                    name:list_atribute[1],
                                    producturl:list_atribute[2],
                                    bigimage:list_atribute[3],
                                    price:list_atribute[4],
                                    categoryid1:list_atribute[5],
                                    categoryid2:list_atribute[6],
                                    categoryid3:list_atribute[7],
                                    categoryid4:list_atribute[8],
                                    extrabadge:list_atribute[9],
                                    description:list_atribute[10],
                                    bigimage2: list_atribute[11].replace('"','')
                                });
                                await itemSave.save((err) => {
                                    console.log(" save " + list_atribute[0] + " ok !");
                                });
                            }
                        });
                        var list_data_point =   await CustomMynaviPoint.find().select("id");
                        list_data_point.forEach(item=>{
                            if(!list_id[item.id]){
                                list_id_null[item.id] = 1;
                            }
                        });
                        // console.log("list id null",list_id_null);
                        await CustomMynaviPageNull.remove({}, (err) => { });
                        let itemPageNull = new CustomMynaviPageNull({
                            status: true,
                            list_null: JSON.stringify({"data":Object.keys(list_id_null)})
                        });
                        await itemPageNull.save((err) => {});
                    } 
                } catch (error) {
                    console.log( "have error when get data for recommend", error);
                }
                
            }
        });
    }

    async getDataPointGoogleSheet() {
        const doc = new GoogleSpreadsheet(SHEET_ID);
        doc.useApiKey(API_KEY);
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        var all_row = await sheet.getRows();
        var list_id = {};
        var list_id_null = {};
        var list_id_recommend = await CustomMynaviRecommend.find({}).select("id");
        list_id_recommend.forEach(item=>{
            list_id[item.id] = 1;
        })
        if(all_row.length){
            await CustomMynaviPoint.remove({}, (err) => { });
            await this.asyncForEach(all_row, async (item, index) => {
                var list_atribute = item._rawData;
                if(list_atribute && list_atribute.length == 10 && !item["屋号ID"].includes('ID') ){
                    let itemSave = new CustomMynaviPoint({
                        id: item["屋号ID"],
                        name: item["屋号名"] || "",
                        pref: item["地域"] || "",
                        area: item["エリア"] || "",
                        home_style: parseInt(item["アットホーム"]),
                        original_style: parseInt(item["オリジナル"]),
                        simple_style: parseInt(item["シンプル"]),
                        format_style: parseInt(item["フォーマル"]),
                        princess_style: parseInt(item["プリンセス"]),
                        luxury_style: parseInt(item["ラグジュアリー"])
                    });
                    await itemSave.save((err) => {});
                }
                if(!list_id[item["屋号ID"]]){
                    list_id_null[item["屋号ID"]] = 1;
                }
            });
            // console.log("list id null",list_id_null);
            await CustomMynaviPageNull.remove({}, (err) => { });
            let itemPageNull = new CustomMynaviPageNull({
                status: true,
                list_null: JSON.stringify({"data":Object.keys(list_id_null)})
            });
            await itemPageNull.save((err) => {});
            console.log("save data point done");
        } 
    }

    getDataPoint(path_file) {
        var csvData = [];
        fs.createReadStream(path_file)
            .pipe(parse({ delimiter: ',' }))
            .on('data', (csvrow, index) => {
                if (csvrow.length == 10 && csvrow[0] && !csvrow[0].includes('id')) {
                    console.log(csvrow[0]);
                    csvData.push(csvrow);
                }
            })
            .on('end', async () => {
                // console.log(csvData);
                if (csvData.length) {
                    await CustomMynaviPoint.remove({}, (err) => { });
                    await this.asyncForEach(csvData, async (item, index) => {
                        let itemSave = new CustomMynaviPoint({
                            id: item[0],
                            name: item[1],
                            pref: item[2],
                            area: item[3],
                            home_style: parseInt(item[4]),
                            original_style: parseInt(item[5]),
                            simple_style: parseInt(item[6]),
                            format_style: parseInt(item[7]),
                            princess_style: parseInt(item[8]),
                            luxury_style: parseInt(item[9])
                        });
                        await itemSave.save((err) => {
                            // console.log(" save " + item[0] + " ok !");
                        });
                    });
                }
            });
    }
}

//
// var crawMynaviooo = new crawMynaviRecommend();
// crawMynaviooo.getDataRecommend();
// crawMynaviooo.getDataPointGoogleSheet();

module.exports = crawMynaviRecommend;