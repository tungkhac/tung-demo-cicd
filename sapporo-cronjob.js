// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var cron = require("node-cron");

const sapporo = require("./cronjob/sapporo");
cron.schedule(
  "0 0 9 * * *",
  async () => {
    console.log(`[${new Date()}]>>SAPPORO CRONJOB<<`);
    sapporo.run();
  },
  {
    scheduled: true,
    timezone: "Asia/Tokyo",
  }
);
