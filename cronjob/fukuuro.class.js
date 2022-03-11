// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const moment = require("moment");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const Parent = require("../routes/parent.class");
const { CustomFukuuroBank: Bank } = require("../model");
const FORMAT = "YYYYMMDD_HHmmss";
const log = (text) => {
  console.log(`========== ${moment().format(FORMAT)} ${text} ==========`);
};

const API_KEY = "AIzaSyAR9GK8i_UVmEpW2XoICFUt1jA9FlIPZ1A";
const DOCUMENT_ID = "1zEfr0L7ibvK9o7C18CVEUYxfGsXhu06ldzzu1hcfPZE";

const SHEETS = {
  BANK: 0,
  BRANCH: 1,
};

class FukuuroCron extends Parent {
  constructor() {
    super();
    this.runTask = this.runTask.bind(this);
  }

  async run() {
    await this.runTask();
  }

  async runTask() {
    const document = await this.fetchDocument();

    const bank_datas = await this.extractBankDatas(document);
    const branch_datas = await this.extractBranchDatas(document);
    const banks = await this.generateFukuuroBanks(bank_datas, branch_datas);

    await this.upsertDocuments(banks);
    log(`FUKUURO  ${banks.length} records upserted.`);
    await this.deleteDocumentsIfNeeded(banks);
  }

  async fetchDocument() {
    const document = new GoogleSpreadsheet(DOCUMENT_ID);
    document.useApiKey(API_KEY);
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

  /**
   * スプレッドシートから銀行データを抽出する
   * @param {*} document 
   * @returns 
   */
  async extractBankDatas(document) {
    const rows = await this.getSheetDatas(document, SHEETS.BANK);
    const banks = rows.map(([bank_code, bank_name, bank_name_kana]) => ({
      bank_code,
      bank_name,
      bank_name_kana,
    }));
    return banks;
  }

  /**
   * スプレッドシートから支店データを抽出する
   * @param {*} document 
   * @returns 
   */
  async extractBranchDatas(document) {
    const rows = await this.getSheetDatas(document, SHEETS.BRANCH);
    const branches = rows.map(
      ([branch_code, bank_code, branch_name, branch_name_kana]) => ({
        branch_code,
        bank_code,
        branch_name,
        branch_name_kana,
      })
    );

    return branches;
  }

  /**
   * 銀行データと支店データから、支店データを含む銀行データを生成する
   * @param {*} bank_datas 
   * @param {*} branch_datas 
   * @returns 
   */
  async generateFukuuroBanks(bank_datas, branch_datas) {
    return bank_datas.map((bank) => {
      const { bank_code } = bank;
      const branches = branch_datas.filter(
        (branch) => branch.bank_code === bank_code
      );
      bank.branches = branches;
      return bank;
    });
  }

  /**
   * レコードを追加、もしくは更新する
   * @param {*} bank_datas 
   * @returns 
   */
  async upsertDocuments(bank_datas) {
    return Promise.all(
      bank_datas.map(async (bank) => {
        const { bank_code } = bank;
        const query = { bank_code };
        return Bank.findOneAndUpdate(query, bank, { upsert: true });
      })
    );
  }

  /**
   * 削除されたレコードがあれば削除する
   * @param {*} bank_datas 
   */
  async deleteDocumentsIfNeeded(bank_datas) {
    const banks = await Bank.find();
    const removeBanks = banks.filter(
      (bank) =>
        bank_datas.find(({ bank_code }) => bank_code === bank.bank_code) ===
        undefined
    );
    await Promise.all(removeBanks.map((bank) => bank.remove())).then(() =>
      log(`FUKUURO ${removeBanks.length} records removed`)
    );
  }
}

if (!module.parent) {
  new FukuuroCron().run().then(() => {
    console.log("finished!");
    process.exit(0);
  });
}

module.exports = FukuuroCron;
