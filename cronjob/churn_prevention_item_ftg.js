// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const moment = require("moment");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const Parent = require("../routes/parent.class");
const { ChurnPreventionItemFTG: FTGItems } = require("../model");
const creds = require('../key/wevnal_service_account.json');
const FORMAT = "YYYYMMDD_HHmmss";
const log = (text) => {
  console.log(`========== ${moment().format(FORMAT)} ${text} ==========`);
};

const CRON_NAME = 'ChurnPreventionItemFTG';

const DOCUMENT_ID = "1JkqP-03-rYAJ-Kfmwb5stGGhpf3dil-rB6A16zQ2vuQ";
console.log('DOCUMENT_ID:', DOCUMENT_ID);

const SHEETS = {
  ITEMS: 0,
};

class Cron extends Parent {
  constructor() {
    super();
    this._runTask = this._runTask.bind(this);
  }

  /**
   * cron から呼び出す
   */
  async run() {
    await this._runTask();
  }

  async _runTask() {
    const document = await this.fetchDocument();

    const datas = await this.extractDatas(document);
    const records = await this.convertToRecords(datas);

    await this.upsertDocuments(records);
    log(`${CRON_NAME}  ${records.length} records upserted.`);
    await this.deleteDocumentsIfNeeded(records);
  }

  async fetchDocument() {
    const document = new GoogleSpreadsheet(DOCUMENT_ID);
    await document.useServiceAccountAuth(creds);
    await document.loadInfo();
    return document;
  }

  async fetchTestData(task) {
    return await new Promise((resolve) => {
      const parser = csv.parse((error, data) => resolve(data));
      require("fs").createReadStream(task.TEST_CSV).pipe(parser);
    });
  }

  async getSheetDatas(document, index) {
    return await document.sheetsByIndex[index]
      .getRows()
      .then((rows) => rows.map(({ _rawData }) => _rawData));
  }

  async extractDatas(document) {
    const item_datas = await this.extractItemDatas(document);
    return {
      item_datas,
    };
  }

  async convertToRecords(datas) {
    const { item_datas } = datas;
    return await this.convertToChurnPreventionFTGItems(item_datas);
  }

  /**
   * スプレッドシートから商品情報データを抽出する
   * @param {*} document
   * @returns
   */
  async extractItemDatas(document) {
    const rows = await this.getSheetDatas(document, SHEETS.ITEMS);
    const orders = rows.map(columns => {
      return {
        item_id: columns[0],
        course_name: columns[1],
        item_name: columns[2],
        comment: columns[3],
        available_flg: columns[4],
        count_promised_receiving: columns[5]
      };
    });
    return orders;
  }

  /**
   * 商品情報データを生成する
   * @param {*} item_datas
   * @returns
   */
  async convertToChurnPreventionFTGItems(item_datas) {
    return item_datas.map((item) => {
      const { ...item_data } = item;
      const o = {
        ...item_data,
      };
      return o;
    });
  }

  /**
   * レコードを追加、もしくは更新する
   * @param {*} datas
   * @returns
   */
  async upsertDocuments(records) {
    return Promise.all(
      records.map(async (record) => {
        const { item_id } = record;
        const query = { item_id };
        return FTGItems.findOneAndUpdate(query, record, { upsert: true });
      })
    );
  }

  /**
   * 削除されたレコードがあれば削除する
   * @param {*} record
   */
  async deleteDocumentsIfNeeded(newRecords) {
    const existsRecords = await FTGItems.find();
    const removeRecords = existsRecords.filter(
      (record) =>
        newRecords.find(({ item_id }) => item_id === record.item_id) ===
        undefined
    );
    await Promise.all(removeRecords.map((record) => record.remove())).then(() =>
      log(`${CRON_NAME} ${removeRecords.length} records removed`)
    );
  }
}

if (!module.parent) {
  new Cron().run().then(() => {
    console.log("finished!");
    process.exit(0);
  });
}

module.exports = Cron;
