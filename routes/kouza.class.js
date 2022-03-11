// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
const common = require("./../modules/common");

const config = require('config');
var moment = require('moment-timezone');
moment.locale("ja");
const TIMEZONE = config.get('timezone');

class kouzaRouter {
    constructor() {
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/getVariable', async (req, res, next) => {
            console.log('api set variable kouza',req.body );
            var input = req.body.kouza || "";
            if (input) {
                var data = {
                    "ネイル": "12010",
                    "ブライダル": "12030",
                    "フラワー": "11010",
                    "カラー": "10505",
                    "メイク／ヘアメイク": "12005",
                    "インテリア": "11505",
                    "フード／食育": "13005",
                    "薬膳": "13020",
                    "リフレクソロジー／リラクゼーション": "14005",
                    "イラスト・キャラクターデザイン": "19090",
                    "マンガ家養成": "59015",
                    "ヨガ（新宿校のみ）": "55505",
                    "声優（新宿校のみ）": "50510",
                    "和食（新宿校のみ）": "15005",
                    "AI入門": "34070",
                    "はじめての Python": "34080",
                    "プログラミング": "34050",
                    "Webデザイン": "31510",
                    "DTP／グラフィックデザイン": "31005",
                    "CAD": "30505",
                    "パソコン": "32005",
                    "医療": "53520",
                    "心理／カウンセラー": "59010",
                    "チャイルドマインダー": "53535",
                    "保育士／チャイルドケアカレッジ": "53550",
                    "日本語教師": "25005",
                    "留学（欧米・フィリピン）": "54005",
                    "通関士／貿易実務": "26505",
                    "キャリアコンサルタント": "59035",
                    "リンパドレナージュ": "T0417",
                    "クリスタルデコレーション": "T0413",
                    "メンタルケアカウンセラー": "59010T",
                    "トリミング": "T0101",
                    "ドッグトレーナー": "T0106",
                    "動物介護士": "T0112",
                    "動画クリエイター": "34025"
                };
                var kouza = data[input] || "";
                if(kouza){
                    res.status(200).json({
                        kouza: kouza
                    });
                }else{
                    console.log('kouza invalid input');
                    res.status(500).json({
                        error_message: "invalid input "
                    })
                }
            } else {
                console.log('kouza invalid input');
                res.status(500).json({
                    error_message: "invalid input "
                })
            }
        });

        this.router.post('/getDate', async (req, res, next) => {
            console.log('api set variable getDate',req.body);
            var body = req.body;
            var date1 = typeof body.date1 !== "undefined" ? body.date1.trim() : "";
            var date2 = typeof body.date2 !== "undefined" ? body.date2.trim() : "";
            var date3 = typeof body.date3 !== "undefined" ? body.date3.trim() : "";

            var hour1 = typeof body.hour1 !== "undefined" ? body.hour1.trim() : "";
            var hour2 = typeof body.hour2 !== "undefined" ? body.hour2.trim() : "";
            var hour3 = typeof body.hour3 !== "undefined" ? body.hour3.trim() : "";

            var arr = [];
            var datetime1 = this.getDate(date1, hour1);
            var datetime2 = this.getDate(date2, hour2);
            var datetime3 = this.getDate(date3, hour3);

            if(datetime1 !== ""){
                arr.push(datetime1);
            }
            if(datetime2 !== ""){
                arr.push(datetime2);
            }
            if(datetime3 !== ""){
                arr.push(datetime3);
            }
            console.log(arr.join(","));

            res.status(200).json({
                date: arr.join(",")
            })
        });
    }

    getDate(date, hour){
        if(date !== ""){
            var format = "YYYY年MM月DD日(ddd)HH:mm";
            var tmp_date;
            if(hour == ""){
                format =  "YYYY年MM月DD日(ddd)";
                tmp_date = moment(date);
            }else{
                tmp_date = moment(date  + " " + hour + ":00");
            }
            tmp_date = tmp_date.format(format);
            if(tmp_date != "Invalid date"){
                return tmp_date;
            }else return "";
        }else{
            return "";
        }
    };
}

module.exports = new kouzaRouter().router;
