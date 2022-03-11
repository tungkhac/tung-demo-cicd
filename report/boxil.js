// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
const config = require('config');
var request = require('request');
var fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const readline = require('readline');
var once = require('once');

class countBoxilData {
    constructor() {
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {
        this.router.get('/countBoxil', async(req, res, next) => {
            console.time("countBoxil");
            var query = req.query;
            console.log("query==", query);
            var find_text = "boxil.jp";
            if (query.text != undefined && query.text != '') {
                find_text = query.text;
            }

            const directory_path = path.join(__dirname, '../data/botchan_log/');
            try {
                if (fs.existsSync(directory_path)) {
                    console.log("directory_path", directory_path);
                    var total = 0;
                    var folders = fs.readdirSync(directory_path);
                    for (const folder of folders) {
                        var folder_name = folder;
                        var directory_folder = directory_path + folder_name;
                        var total_in_folder = await this.readAllFileInFolder(directory_folder, find_text);
                        console.log("total_in_folder===", total_in_folder);
                        total += total_in_folder;
                        console.log("Folder,total===", folder, total);
                    }

                    res.status(200).json({total: total});
                    console.timeEnd("countBoxil");
                }
            } catch (err) {
                console.error(err)
            }
        })
    }

    async readAllFileInFolder(path, find_text) {
        try {
            if (path) {
                var total_count_file_in_folder = 0;
                var files = fs.readdirSync(path);
                for (const file of files) {
                    if (file.indexOf(".gz") != -1) {
                        var file_path = path + '/' + file;
                        if(fs.existsSync(file_path)) {
                            var total_text_in_file = await this.readLines(file_path, find_text);
                            total_count_file_in_folder += total_text_in_file;
                            console.log("file_path====", file_path);
                            console.log("total_text_in_file====", total_count_file_in_folder);
                        } else {
                            console.log("file path not exist");
                        }
                    }
                }

                return total_count_file_in_folder;
            }
        } catch (e) {
            console.log("error====", e);
        }
    }

    async readLines(input_path, find_text) {
        return new Promise((resolve, reject) => {
            if (input_path != '') {
                const fileStream = fs.createReadStream(input_path).pipe(zlib.createGunzip());
                const lineReader = readline.createInterface({
                    input: fileStream,
                    crlfDelay: Infinity
                });

                var count_find_text = 0;
                lineReader.on('line', (line) => {
                    // var match_regex = new RegExp(find_text, 'g');
                    // var count_text_in_line = (line.match(match_regex) || []).length;
                    // if (count_text_in_line != null) {
                    if(line.indexOf(find_text) != -1) {
                        count_find_text += 1;
                    }
                }).on('close', () => {
                    resolve(count_find_text);
                }).on('error', err => {
                    reject(err);
                });
            }
        });
    }
}

module.exports = new countBoxilData().router;