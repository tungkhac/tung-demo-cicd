// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const { whitelist } = require("../../config/whitelist.json");
const URL = require("url");

const isInWhiteList = (uri) => {
  try {
    const url = URL.parse(uri);
    return whitelist.includes(url.host);
  } catch (error) {}
  /* istanbul ignore next */
  return false;
};

const updateInWhitelistRequestParams = (params) => {
  if (!params || !isInWhiteList(params.uri)) return;
  if (!params.agentOptions) {
    params.agentOptions = { rejectUnauthorized: false };
  } else {
    params.agentOptions.rejectUnauthorized = false;
  }
};

module.exports = { isInWhiteList, updateInWhitelistRequestParams };
