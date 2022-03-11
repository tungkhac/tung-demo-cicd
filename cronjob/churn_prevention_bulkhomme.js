// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const moment = require("moment");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const Parent = require("../routes/parent.class");
const { ChurnPreventionBulkhomme: BulkhommeOrders } = require("../model");
const creds = require('../key/wevnal_service_account.json');
const FORMAT = "YYYYMMDD_HHmmss";
const log = (text) => {
  console.log(`========== ${moment().format(FORMAT)} ${text} ==========`);
};

const CRON_NAME = 'ChurnPreventionBulkhomme';

const DOCUMENT_ID = "1emjmoSRIXu-seeJIgL2wB_FKLO1aMe6XEsSURM1OBhE";
console.log('DOCUMENT_ID:', DOCUMENT_ID);

const SHEETS = {
  ORDERS: 0,
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
    const order_datas = await this.extractOrderDatas(document);
    return {
      order_datas,
    };
  }

  async convertToRecords(datas) {
    const { order_datas } = datas;
    return await this.convertToChurnPreventionBulkhommeOrders(order_datas);
  }

  /**
   * スプレッドシートからオーダーデータを抽出する
   * @param {*} document 
   * @returns 
   */
  async extractOrderDatas(document) {
    const rows = await this.getSheetDatas(document, SHEETS.ORDERS);
    const orders = rows.map(columns => {
      return {
        order_id: columns[0],
        customer_id: columns[1],
        number_of_cycle: columns[2],
        status: columns[3],
        order_created_at: columns[4],
        order_canceled_at: columns[5],
        payment_type: columns[6],
        product_code: columns[7],
        product_name: columns[8],
        product_category: columns[9],
      };
    });
    return orders;
  }

  /**
   * オーダデータから、builhomme オーダーデータを生成する
   * @param {*} order_datas 
   * @returns 
   */
  async convertToChurnPreventionBulkhommeOrders(order_datas) {
    return order_datas.map((order) => {
      const { product_code, product_name, product_category, ...order_data } = order;
      const o = {
        ...order_data,
        product: {
          id: product_code,
          name: product_name,
          category: product_category,
        }
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
        const { order_id } = record;
        const query = { order_id };
        return BulkhommeOrders.findOneAndUpdate(query, record, { upsert: true });
      })
    );
  }

  /**
   * 削除されたレコードがあれば削除する
   * @param {*} record 
   */
  async deleteDocumentsIfNeeded(newRecords) {
    const existsRecords = await BulkhommeOrders.find();
    const removeRecords = existsRecords.filter(
      (record) =>
        newRecords.find(({ order_id }) => order_id === record.order_id) ===
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
