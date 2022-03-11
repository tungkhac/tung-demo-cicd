// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const Parent = require('../routes/parent.class');
const { CustomLeverageSchool: LeverageSchool } = require('../model');
const moment = require('moment');
const FORMAT = 'YYYYMMDD_HHMMSS';

//const csv = require('csv');
const path = require('path');

const API_KEY = 'AIzaSyAR9GK8i_UVmEpW2XoICFUt1jA9FlIPZ1A';

const COLS = {
    URL: 'url',
    TO: 'to',
    CC: 'cc',
    BCC: 'bcc',
    NAME: 'name',
    COUPON: 'coupon',
    COL_A: 'column_a',
    COL_B: 'column_b',
    COL_C: 'column_c',
}

const STRING_PROPERTIES = [COLS.URL, COLS.NAME, COLS.COUPON, COLS.COL_A, COLS.COL_B, COLS.COL_C];

const TASKS = {
    TrainerAgency: {
        DOCUMENT_ID: '1zICayPGxD76LWzksLRbv27y_-MmNFszrEdWB39fQVxM',
        SHEET_INDEX: 0,
        COL_INDEX: {
            [COLS.URL]: 1,
            [COLS.NAME]: 2,
            [COLS.TO]: 3,
            [COLS.CC]: 4,
            [COLS.BCC]: 5,
            [COLS.COL_A]: 6,
            [COLS.COL_B]: 7,
            [COLS.COL_C]: 8,
        },
        TEST_CSV: path.resolve('../leverage-school.csv'),
    },
    DietConcierge: {
        DOCUMENT_ID: '1JWVwifD_cafpiQASmYmYN1eqHSl6hpBPwHcRxvXbxSQ',
        SHEET_INDEX: 0,
        COL_INDEX: {
            [COLS.URL]: 1,
            [COLS.TO]: [3, 4, 5],
            [COLS.NAME]: 2,
            [COLS.COUPON]: 6,
            [COLS.COL_A]: 7,
            [COLS.COL_B]: 8,
        },
        TEST_CSV: path.resolve('../diet_concierge.csv')
    }
}

const isDebug = false;

const { GoogleSpreadsheet } = require('google-spreadsheet');

const log = text => {
    console.log(`========== ${moment().format(FORMAT)} ${text} ==========`);
}

class LeverageCron extends Parent {
    constructor() {
        super();
        this.runTask = this.runTask.bind(this);
    }

    async run() {
        await Promise.all(Object.keys(TASKS).map(this.runTask));
    }

    async runTask(taskName) {
        log(`LEVERAGE CRON INVOKED : ${taskName}`);
        const timerKey = `${moment().format(FORMAT)}_${taskName}`;
        console.time(timerKey);
        const task = TASKS[taskName];

        let document = null;
        if (!isDebug) document = await this.fetchDocument(task);

        const schoolDatas = await this.extractSchoolDatas(task, document);

        log(`Extracted ${schoolDatas.length} ${taskName} datas`);

        await this.upsertDocuments(taskName, schoolDatas);
        await this.deleteDocumentsIfNeeded(taskName, schoolDatas)
            .then(() => log(`LEVERAGE CRON SUCCEEDED : ${taskName}`))
            .then(() => console.timeEnd(timerKey))
            .catch(err => {
                console.log(err);
                log(`LEVERAGE CRON FAILURE : ${taskName}`);
            });
    }

    async fetchDocument(task) {
        const document = new GoogleSpreadsheet(task.DOCUMENT_ID);
        document.useApiKey(API_KEY);
        await document.loadInfo();
        return document;
    }

    async fetchTestData(task) {
        return await new Promise(resolve => {
            const parser = csv.parse((error, data) => resolve(data));
            require('fs').createReadStream(task.TEST_CSV).pipe(parser);
        });
    }

    async extractSchoolDatas(task, document) {
        let rows = null;
        if (isDebug) {
            rows = await this.fetchTestData(task);
        } else {
            const sheet = document.sheetsByIndex[task.SHEET_INDEX];
            rows = await sheet.getRows().then(rowsObj => rowsObj.map(row => row._rawData));
        }
        return rows.map(row => this._convertRow(task, row)).filter(row => row.url !== 'URL');
    }

    _convertRow(task, row) {
        return Object.entries(task.COL_INDEX).reduce((rowObject, [COL_KEY, idx]) => {
            if(STRING_PROPERTIES.includes(COL_KEY)) {
                if (COL_KEY === COLS.URL && row[idx].endsWith('/')) row[idx] = row[idx].slice(0, -1);
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

    _checkSameDocument(taskName, current, registered) {
        const task = TASKS[taskName];
        const colsResult = Object.keys(task.COL_INDEX).map(key => {
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

            return arrayResult.every(result => result === true);
        });
        return colsResult.every(result => result === true);
    }

    async upsertDocuments(taskName, schoolDatas) {
        return Promise.all(
            schoolDatas.map(async school => {
                const { url } = school;
                const query = { url };
                school.task_name = taskName;
                const registered = await LeverageSchool.findOne(query);
                if (registered) {
                    const isSame = this._checkSameDocument(taskName, school, registered);
                    if (isSame) return null;
                    school.updated_at = new Date();
                } else {
                    school.created_at = new Date();
                    school.updated_at = new Date();
                }

                return LeverageSchool.findOneAndUpdate(query, school, { upsert: true });
            })
        );
    }

    async deleteDocumentsIfNeeded(taskName, schoolDatas) {
        const documents = await LeverageSchool.find({ task_name: taskName });
        return Promise.all(
            documents.filter(document => {
                const existSchool = schoolDatas.filter(newData => newData.url === document.url);
                return existSchool.length === 0;
            }).map(document => document.remove())
        );
    }
}

if(!module.parent) {
    (new LeverageCron()).run().then(() => {
        console.log('finished!');
        process.exit(0);
    });
}

module.exports = LeverageCron;
