// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const { sendApprovalEmails, sendApprovalMessages } = require("../cronjob/sapporo");

const run = async () => {
  await sendApprovalEmails();
  await sendApprovalMessages();
  process.exit();
};

run();
