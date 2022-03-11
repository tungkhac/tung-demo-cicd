// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
const config = require('config');
var request = require('request');
var fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const readline = require('readline');
var moment = require('moment');
var once = require('once');

class countBoxilData2 {
    constructor() {
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.post('/countBoxil2', async(req, res, next) => {
            console.time("countBoxil2");
            var body = req.body;
            console.log("body==", body);
            var start_date = body.start_date;
            var end_date = body.end_date;
            var find_text = body.find_text;

            const directory_path = path.join(__dirname, '../data/botchan_log2');
            try {
                if (fs.existsSync(directory_path)) {
                    console.log("directory_path", directory_path);
                    var total = await this.readAllFileInFolder(directory_path, start_date, end_date, find_text);
                    console.log("total==", total);
                    res.status(200).json({total: total});
                    console.timeEnd("countBoxil2");
                }
            } catch (err) {
                console.error(err)
            }
        })
    }

    async readAllFileInFolder(path, start_date, end_date, find_text) {
        try {
            if (path) {
                var count_text_in_folder = 0;
                var files = fs.readdirSync(path);
                var file_end_date = new Date(end_date);
                file_end_date.setDate(file_end_date.getDate() + 1);
                file_end_date = this.formatDate(file_end_date);
                console.log("file_end_date", file_end_date);

                start_date = new Date(start_date);
                end_date = new Date(end_date);
                file_end_date = new Date(file_end_date);

                for (const file of files) {
                    if (file.indexOf(".gz") != -1) {
                        var regex_file = /\d.*\d/gm;
                        var file_date = file.match(regex_file);
                        file_date = this.formatDateFile(file_date[0]);
                        file_date = new Date(file_date);
                        // console.log("file_date", file_date);
                        // console.log("start_date", start_date);
                        // console.log("end_date", end_date);

                        if(file_date >= start_date && file_date <= file_end_date) {
                            console.log("file_date", file_date);
                            var file_path = path + '/' + file;
                            console.log("file_path===", file_path);
                            if(fs.existsSync(file_path)) {
                                var count_text_in_file = await this.readLines(file_path, start_date, end_date, find_text);
                                count_text_in_folder += count_text_in_file;
                                console.log("count_text_in_file==", count_text_in_file);
                            } else {
                                console.log("file path not exist");
                            }
                        } else {
                            console.log("===break===");
                            continue;
                        }
                    }
                }
                console.log("count_text_in_folder==", count_text_in_folder);
                return count_text_in_folder;
            }
        } catch (e) {
            console.log("error====", e);
        }
    }

    async readLines(input_path, start_date, end_date, find_text) {
        return new Promise((resolve, reject) => {
            if (input_path != '') {
                const fileStream = fs.createReadStream(input_path).pipe(zlib.createGunzip());
                const lineReader = readline.createInterface({
                    input: fileStream,
                    crlfDelay: Infinity
                });

                var count_text = 0;
                lineReader.on('line', (line) => {
                    // var match_regex = new RegExp(find_text, 'g');
                    // var count_text_in_line = (line.match(match_regex) || []).length;
                    // if (count_text_in_line != null) {
                    var match_regex = /\[(.*)\]/gm;
                    var match_value = match_regex.exec(line);
                    var line_date = match_value[1].split(':')[0];
                    line_date = this.formatDate(line_date);
                    line_date = new Date(line_date);
                    // console.log("start_date", start_date);
                    // console.log("end_date", end_date);

                    if(line_date >= start_date && line_date <= end_date) {
                        console.log("line_date", line_date);
                        if(line.indexOf(find_text) !== -1) {
                            count_text += 1;
                        }
                    }

                    if(line_date > end_date) {
                        lineReader.close();
                    }
                }).on('close', () => {
                    console.log("==close_1==");
                    resolve(count_text);
                }).on('error', err => {
                    reject(err);
                });
            }
        });
    }

    formatDate(dateObj){
        if (dateObj) {
            var date = new Date(dateObj);
            var year = date.getFullYear();
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);

            return year + '/' + month + '/' + day;
        }
    }

    formatDateFile(str_date){
        if (str_date) {
            var year = str_date.substring(0, 4);
            var month = str_date.substring(4, 6);
            var day = str_date.substring(6, 8);

            return year + '/' + month + '/' + day;
        }
    }
}

module.exports = new countBoxilData2().router;