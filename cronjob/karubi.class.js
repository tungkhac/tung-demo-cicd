// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const Parent = require('../routes/parent.class');
const model = require('../model');
const CustomKarubiP2ProductInfo = model.CustomKarubiP2ProductInfo;
const CustomKarubiP2Categories = model.CustomKarubiP2Categories;
const CustomKarubiTrackingShowProduct = model.CustomKarubiTrackingShowProduct;

const fs = require('fs');
const API_KEY = 'AIzaSyBuM5GwydDMWgeOsPKYaaPWuHTR3xxEu6o';
const SHEET_ID = '1tE8cmbrkZ4mt-w06Cu-IvnYhK78AKxtFcIIrIYUg1uo';
const INDEX_TYPE = {
    'category': 3,
    'product': 4
}

const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
const START_DATE = "2000/01/01";
const END_DATE = "2100/01/01";
const { GoogleSpreadsheet } = require('google-spreadsheet');
const ssModule = require('../modules/googleSheet');


class karubi extends Parent {
    constructor() {
        super();
        //updateReportTracking();
    }


    async updateReportTracking() {
        var start_date =  moment().tz(TIMEZONE).add(0, 'days').format("YYYY-MM-DD");
        console.log("start_date", start_date);
        var rows =  await CustomKarubiTrackingShowProduct.find({date: start_date}, (err) => { });

        if(rows.length > 0){
            ssModule.fillDataToSSNewProduct(rows);
        }
    }

    async readGoogleSheet() {
        const doc = new GoogleSpreadsheet(SHEET_ID);
        doc.useApiKey(API_KEY);
        await doc.loadInfo(); // loads document properties and worksheets
        this.getDataCategory(doc);
        this.getDataProduct(doc);
    }

    async getDataCategory(doc) {
        const sheet = doc.sheetsByIndex[INDEX_TYPE.category];
        var all_row = await sheet.getRows();
        var list_result = [];
        var current_category = "";
        all_row.forEach((item, index) => {
            var row = item._rawData;
            if (row[1] && row[4]) {
                if (row[0]) {
                    current_category = row[0];
                }
                list_result.push({
                    category: current_category,
                    sub_category: row[1],
                    description: row[2] || "...",
                    category_img_url: row[3] || "",
                    list_product: row[4].replace(/ /g,"").split(","),
                });
            }
        });

        if (list_result.length) {
            await CustomKarubiP2Categories.remove({}, (err) => { });
            await this.asyncForEach(list_result, async (item, index) => {
                let itemSave = new CustomKarubiP2Categories(item);
                await itemSave.save((err) => {
                   if(err){
                       console.log('insert data karubi category not ok',err);
                   }
                });
            });
            console.log('update data karubi category ok', new Date().toISOString())
        }
    }

    async getDataProduct(doc) {
        const list_sheet = doc.sheetsByIndex;
        const sheet = list_sheet[INDEX_TYPE.product];
        var all_row = await sheet.getRows();
        var list_result = [];

        all_row.forEach((item, index) => {
            let row = item._rawData;
            let start_date = item['発売日'] ? moment(item['発売日'], "YYYY/MM/DD").tz(TIMEZONE) : new Date(START_DATE);
            let end_date = item['終売日（公開停止日）'] ? moment(item['終売日（公開停止日）'], "YYYY/MM/DD").tz(TIMEZONE) : new Date(END_DATE);
            if (item['商品コード']) {
                let con_store_flg = item["コンビニ限定"] || "";
                con_store_flg = con_store_flg ? 1 : 0;
                list_result.push({
                    jan : item["JAN"] || "",
                    product_code : item['商品コード'],
                    product_name : item['商品名'] || "",
                    brand_name: item['ブランド名'] || "",
                    taste_name: item['味名'] || "",
                    taste_system: item['味系統'] || "",
                    word_count: item['文字数'] || "",
                    shape: item['形状'] || "",
                    start_date : start_date || null,
                    end_date : end_date || null,
                    description: row[8] || "",
                    image_url: this.getURL(item['画像URL']),
                    infor_calorie: `内容量:${row[10]}\nエネルギー:${row[11]}\nたんぱく質:${row[12]}\n脂質:${row[13]}\n炭水化物:${row[14]}\n食塩相当量:${row[15]}`,
                    url: this.getURL(item['詳細URL']),
                    con_store_flg: con_store_flg,
                    product_code_es: item['ES検索商品コード'] || "",
                });
            }
        });

        if (list_result.length) {
            await CustomKarubiP2ProductInfo.remove({}, (err) => { });
            await this.asyncForEach(list_result, async (item, index) => {
                let itemSave = new CustomKarubiP2ProductInfo(item);
                await itemSave.save((err) => {
                    if(err){
                        console.log('insert data karubi product not ok',err);
                    }
                });
            });
            console.log('update data karubi product ok', new Date().toISOString())
        }
    }

    getURL(a){
        if(a && a.includes("http")){
            return a;
        }else{
            return "";
        }
    }

    // getData(path_file) {
    //     var csvData = [];
    //     fs.createReadStream(path_file)
    //         .pipe(parse({ delimiter: ',' }))
    //         .on('data', (csvrow, index) => {
    //             if (csvrow.length == 6 && csvrow[0] && !csvrow[0].includes('JAN')) {
    //                 console.log(csvrow[0]);
    //                 csvData.push(csvrow);
    //             }
    //         })
    //         .on('end', async () => {
    //             // console.log(csvData);
    //             if (csvData.length) {
    //                 await CustomKarubiP2ProductInfo.remove({}, (err) => { });
    //                 await this.asyncForEach(csvData, async (item, index) => {
    //                     let itemSave = new CustomKarubiP2ProductInfo({
    //                         jan: item[0],
    //                         product_code: item[1],
    //                         product_name: item[2],
    //                         brand_name: item[3],
    //                         taste_name: item[4],
    //                         shape: item[5],
    //                     });
    //                     await itemSave.save((err) => {
    //                         // console.log(" save " + item[0] + " ok !");
    //                     });
    //                 });
    //             }
    //         });
    // }
}

//
//   var k = new karubi();
//   k.readGoogleSheet();

module.exports = karubi;