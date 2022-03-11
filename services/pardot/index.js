// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require("request");
const express = require("express");
const router = express.Router();
const utils = require("../../util");
const {
  updateInWhitelistRequestParams,
} = require("../../modules/request/auth");

const SUB_TYPE = "Pardot";

router.post("/", (req, res, next) => {
  console.log("Pardot::body=", req.body);
  const { cpid, uid, endpoint_url, ...form_data } = req.body;
  console.log("Pardot::form_data=", form_data);
  if (endpoint_url !== void 0 && endpoint_url.length && cpid && uid) {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const options = {
      uri: endpoint_url,
      headers,
      method: "POST",
      form: form_data,
    };

    updateInWhitelistRequestParams(options);
    request(options, (error, response, body) => {
      const errors = {
        msg: body,
        params: options,
      };

      if (!error && response.statusCode === 200) {
        if (response.body !== void 0) {
          console.log("Pardot::response.body", response.body);
        } else {
          utils.saveException(cpid, uid, errors, SUB_TYPE);
        }
      } else {
        utils.saveException(cpid, uid, errors, SUB_TYPE);
      }
      res.json({});
    });
  } else {
    res.json({});
  }
});

module.exports = router;
