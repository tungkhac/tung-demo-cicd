// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const Parent = require('../routes/parent.class');
const { CustomTryPlus: TryPlus } = require('../model');
const moment = require('moment');
const FORMAT = 'YYYYMMDD_HHMMSS';

const API_KEY = 'AIzaSyAR9GK8i_UVmEpW2XoICFUt1jA9FlIPZ1A';

const COLS = {
    PREF: 'pref',
    SCHOOL: 'school',
    TO_1: 'to_1',
    TO_2: 'to_2',
}

const STRING_PROPERTIES = [COLS.PREF, COLS.SCHOOL, COLS.TO_1, COLS.TO_2];

const TASKS = {
    DOCUMENT_ID: '1axjSBGvKA2zLJjXVPtJCHHn-3u_7TUDcV0TL8eueJXs',
    SHEET_INDEX: 0,
    COL_INDEX: {
        [COLS.PREF]: 0,
        [COLS.SCHOOL]: 1,
        [COLS.TO_1]: 2,
        [COLS.TO_2]: 3,
    }
}

let update_cnt = 0;
let delete_cnt = 0;

const { GoogleSpreadsheet } = require('google-spreadsheet');

const log = text => {
    console.log(`========== ${moment().format(FORMAT)} ${text} ==========`);
}

class TryPlusCron extends Parent {
    constructor() {
        super();
        this.runTask = this.runTask();
    }

    async run() {
        await this.runTask;
    }

    async runTask() {
        log(`TRYPLUS CRON INVOKED`);
        const timerKey = `${moment().format(FORMAT)}`;
        console.time(timerKey);
        const task = TASKS;

        let document = await this.fetchDocument(task);

        const schoolDatas = await this.extractSchoolDatas(task, document);

        log(`Extracted ${schoolDatas.length} datas`);

        await this.upsertDocuments(schoolDatas);
        log(`UPDATE CNT is ${update_cnt}`);
        await this.deleteDocumentsIfNeeded(schoolDatas)
            .then(() => log(`DELETE CNT is ${delete_cnt}`))
            .then(() => log(`TRYPLUS CRON SUCCEEDED`))
            .then(() => console.timeEnd(timerKey))
            .catch(err => {
                console.log(err);
                log(`TRYPLUS CRON FAILURE`);
            });
    }

    async fetchDocument(task) {
        const document = new GoogleSpreadsheet(task.DOCUMENT_ID);
        document.useApiKey(API_KEY);
        await document.loadInfo();
        return document;
    }

    async extractSchoolDatas(task, document) {
        let rows = null;
        const sheet = document.sheetsByIndex[task.SHEET_INDEX];
        rows = await sheet.getRows().then(rowsObj => rowsObj.map(row => row._rawData));
        return rows.map(row => this._convertRow(task, row));
    }

    _convertRow(task, row) {
        return Object.entries(task.COL_INDEX).reduce((rowObject, [COL_KEY, idx]) => {
            if(STRING_PROPERTIES.includes(COL_KEY)) {
                rowObject[COL_KEY] = row[idx] || '';
                return rowObject;
            }

            if (!Array.isArray(idx)) idx = [idx];

            const mailAddresses = [];
            idx.forEach(index => {
                if (row[index] == undefined) row[index] = '';
                const addresses = row[index].split(',').map(addr => {
                    const matched = addr.match(/<(.*?)>/);
                    if (!matched) return addr;
                    return matched[1];
                }).filter(address => address);
                mailAddresses.push(...addresses);
            });

            rowObject[COL_KEY] = mailAddresses;
            return rowObject;
        }, {});
    }

    _checkSameDocument(current, registered) {
        const colsResult = Object.keys(TASKS.COL_INDEX).map(key => {
            if (STRING_PROPERTIES.includes(key)) {
                return current[key] === registered[key];
            }

            if (!current[key] || !registered[key]) return false;

            if (current[key].length !== registered[key].length) {
                return false;
            }

            const arrayResult = current[key].map((value, idx) => {
                return value === registered[key][idx]
            });
            console.log(arrayResult);
            return arrayResult.every(result => result === true);
        });
        return colsResult.every(result => result === true);
    }

    async upsertDocuments(schoolDatas) {
        return Promise.all(
            schoolDatas.map(async school_data => {
                const { pref, school } = school_data;
                const query = { pref, school };
                const registered = await TryPlus.findOne(query);
                if (registered) {
                    const isSame = this._checkSameDocument(school_data, registered);
                    if (isSame) return null;
                    update_cnt++;
                    school_data.updated_at = new Date();
                } else {
                    school_data.created_at = new Date();
                    school_data.updated_at = new Date();
                }
                return TryPlus.findOneAndUpdate(query, school_data, { upsert: true });
            })
        );
    }

    async deleteDocumentsIfNeeded(schoolDatas) {
        const documents = await TryPlus.find();
        return Promise.all(
            documents.filter(document => {
                const existSchool = schoolDatas.filter(newData => (newData.pref === document.pref && newData.school === document.school));
                return existSchool.length === 0;
            }).map(document => {
                delete_cnt++;
                return document.remove();
            })
        );
    }
}

if(!module.parent) {
    (new TryPlusCron()).run().then(() => {
        console.log('finished!');
        process.exit(0);
    });
}

module.exports = TryPlusCron;
