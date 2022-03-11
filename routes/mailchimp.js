// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var router = express.Router();
var request = require('request');
var emailValidator = require("email-validator");


// Saving our new user to Audience mailchimp
router.post('/signup', function (req, res) {
  let audienceId = typeof req.body.audienceId !== "undefined" ? req.body.audienceId.trim() : "";
  let email = typeof req.body.email !== "undefined" ? req.body.email.trim() : "";
  let fname = typeof req.body.fname !== "undefined" ? req.body.fname.trim() : "";
  let lname = typeof req.body.lname !== "undefined" ? req.body.lname.trim() : "";
  let apiKey = typeof req.body.apiKey !== "undefined" ? req.body.apiKey.trim() : "";

  var responseError = {};
  var isError = false;
  if (audienceId.length < 1 || email.length < 1 || apiKey < 1 || apiKey.indexOf('-') < 0) {
    isError = true;
  }

  if (!emailValidator.validate(email)) {
    isError = true;
  }

  if (isError) {
    var error_message = "エラーが発生しました。再度ご試しください。";
    responseError.error_message = error_message;
    res.status(500).json(responseError);
    return;
  }

  let auth = 'Basic ' + Buffer.from('anystring' + ':' + apiKey).toString('base64');
  let uri = 'https://' + apiKey.split('-')[1] + '.api.mailchimp.com/3.0/lists/' + audienceId + '/members/';
  try {
    request({
      uri: uri,
      method: 'POST',
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json;charset=utf-8"
      },
      body: {
        "email_address": email,
        "status": 'subscribed',
        "merge_fields": {
          "FNAME": fname,
          "LNAME": lname,
        }
      },
      json: true
    }, function (error, response, body) {
      if (error === null) {
        if (response.statusCode == 200) {
          res.status(200).send(response);
        } else {
          responseError.error_message = body.title;
          res.status(500).json(responseError);
        }

      } else {
        var error_message = "エラーが発生しました。再度ご試しください。";
        responseError.error_message = error_message;
        res.status(500).json(responseError);
      }
    });
  }
  catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;