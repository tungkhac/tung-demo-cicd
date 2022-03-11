// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require("express");
var router = express.Router();
var model = require("../model");
const mongoose = require("mongoose");
const config = require("config");
const cryptor = require("./crypto");
const TIMEZONE = config.get("timezone");

var Connect = model.Connect;
var ConnectPage = model.ConnectPage;
var EfoPOrderSetting = model.EfoPOrderSetting;
var PaymentGateway = model.PaymentGateway;
var EfoCv = model.EfoCv;
var EfoMessageVariable = model.EfoMessageVariable;
var UserCryptKey = model.UserCryptKey;
var Variable = model.Variable;

const
  PAYMENT_PAIDY_TYPE = "018",
  TYPE_EFO_PAYMENT_METHOD_SETTING_YES = "002";

const default_paidy_gateway = {
    mode : "test",
    paidy_pub_key: 'pk_test_ulcbm3vcqqojs6qbn08ujp10ic',
    paidy_secret_key: 'sk_test_fkav8imi6pdj6sanp62q4ukm5l'
};

var default_error_message =
  "カードに誤りがあります。再度確認して入力して下さい。";

router.post("/payment-create", function (req, res, next) {
  var body = req.body;
  var connect_page_id = body.cpid,
    user_id = body.uid,
    customer_name = body.name || "",
    email = body.email || "",
    tel_num = body.tel_num || "";

  var name_kana = body.name_kana || "",
    product_code = body.product_code || "",
    product_name = body.product_name || "",
    building = body.building || "",
    street = body.street || "",
    city = body.city || "",
    state = body.state || "",
    zipcode = body.zipcode || ""

  var response = {};
  var params = {};

  getConnectPageInfo(connect_page_id, user_id, function (check, connect_page) {
    if (check) {
      params.connect_page_id = connect_page_id;
      params.connect_id = connect_page.connect_id;
      params.encrypt_flg = connect_page.encrypt_flg;
      params.encrypt_key = connect_page.encrypt_key;
      params.connect_id = connect_page.connect_id;
      params.log_order_id = connect_page.log_order_id;
      params.device = connect_page.device;
      params.user_id = user_id;

      params.customer_name = customer_name;
      params.email = email;
      params.tel_num = tel_num;

      params.name_kana = name_kana;
      params.product_code = product_code;
      params.product_name = product_name;
      params.building = building;
      params.street = street;
      params.city = city;
      params.state = state;
      params.zipcode = zipcode;

      getPaymentGatewayInfo(params, function (error, gateway) {
        if (error) {
          response.error_message = "Error occurred.";
          return res.status(400).json(response);
        }
        params.paidy_pub_key = gateway.paidy_pub_key;
        params.paidy_secret_key = gateway.paidy_secret_key
        params.mode = gateway.mode;
        getVariablesOrderCOD(params, function (price) {
          console.log("=====inputexecTranPaidy", params, price);
          execTranPaidy(params, price, function (result) {
            if (result) {
              response = {
                paidy_pub_key: params["paidy_pub_key"],
                paidy_secret_key: params["paidy_secret_key"],
                paidy_order_data: result,
                success: true,
              };
              res.status(200).json(response);
            } else {
              if (result.error) {
                response.error_message = result.error;
              } else {
                response.error_message = default_error_message;
              }
              console.log("response", response);
              return res.status(400).json(response);
            }
          });
        });
      });
    } else {
      response.error_message = "Error occurred.";
      return res.status(400).json(response);
    }
  });
});

function getVariablesOrderCOD(params, callback) {
  var variable_arr = [];
  const check_update_variable = [
    "product_name",
    "transaction_options",
    "product_unit_price",
    "order_quantity",
    "order_sub_total",
    "order_settlement_fee",
    "order_shipping_fee",
    "order_tax",
    "order_total",
  ];
  var index1 = 0;
  var fun1;
  getVariableValueByName2(
    params,
    index1,
    check_update_variable,
    (fun1 = function (next, variable_name, value, variable_id) {
      if (next) {
        if (variable_name) {
          if (variable_name == "product_unit_price" && parseInt(value) == 0) {
            return callback([]);
          }

          variable_arr[variable_name] = {
            value: value,
            variable_id: variable_id,
          };
        }
        getVariableValueByName2(params, ++index1, check_update_variable, fun1);
      } else {
        // Call api
        callback(variable_arr);
      }
    })
  );
}

function getVariableValueByName2(params, index, arr, callback) {
  if (arr[index]) {
    var variable_name = arr[index];
    Variable.findOne(
      { connect_page_id: params.connect_page_id, variable_name: variable_name },
      function (err, result) {
        if (err) throw err;
        if (result) {
          EfoMessageVariable.findOne(
            {
              connect_page_id: params.connect_page_id,
              user_id: params.user_id,
              variable_id: result._id,
            },
            function (err, row) {
              if (err) throw err;
              var tmp_value = 0;
              if (row) {
                tmp_value = convertVariableValue(params, row);
              }
              return callback(true, variable_name, tmp_value, result._id);
            }
          );
        } else {
          return callback(true);
        }
      }
    );
  } else {
    return callback(false);
  }
}

function convertVariableValue(params, row) {
  var value = row.variable_value;
  if (params.encrypt_flg) {
    value = cryptor.decryptConvertJSON(value, params.encrypt_key);
  }
  var tmp_value_arr = [];
  var tmp_value = value;

  if (Array.isArray(value)) {
    value.forEach(function (element) {
      if (element.value !== undefined) {
        tmp_value_arr.push(element.value);
      } else if (element.text) {
        tmp_value_arr.push(element.text);
      } else {
        tmp_value_arr.push(element);
      }
    });
    tmp_value = tmp_value_arr.join(",");
  }
  return tmp_value;
}

function getPaymentSettingInfo(params, callback) {
  var data_setting = [];
  EfoPOrderSetting.findOne({ cpid: params.connect_page_id }, function (
    err,
    res
  ) {
    if (res) {
      data_setting.push({
        tax_type: res.tax_type,
        rounding: res.rounding,
        tax: res.tax,
        settlement_fee_type: res.settlement_fee_type,
        settlement_fee: res.settlement_fee,
        variable_settlement: res.variable_settlement,
        shipping_fee_type: res.shipping_fee_type,
        shipping_fee: res.shipping_fee,
        variable_address: res.variable_address,
        payment_gateway_setting: res.payment_gateway_setting,
        variable_payment_method: res.variable_payment_method,
        gateway_setting: res.gateway_setting,
      });
    }
    return callback(data_setting);
  });
}

function getConnectPageInfo(connect_page_id, user_id, callback) {
  findCryptKeyOfUser(connect_page_id, user_id, function (
    result_check,
    encrypt_key
  ) {
    console.log("getConnectPageInfo");
    var data = {};
    ConnectPage.findOne({ _id: connect_page_id, deleted_at: null }, function (
      err,
      result
    ) {
      if (!err && result) {
        EfoCv.findOne(
          { connect_page_id: connect_page_id, user_id: user_id },
          function (errCv, resultPosition) {
            if (!errCv) {
              if (resultPosition) {
                data.log_order_id = resultPosition._id;
                data.device = resultPosition.device;
              }
              data.connect_id = result.connect_id;
              data.encrypt_flg = result.encrypt_flg;
              data.encrypt_key = encrypt_key;
              return callback(true, data);
            }
          }
        );
      } else {
        return callback(false);
      }
    });
  });
}

function getPaymentGatewayInfo(params, callback) {
  Connect.findOne({ _id: params.connect_id }, function (err, res) {
    if (res) {
      PaymentGateway.find(
        {
          user_id: res.user_id,
          provider: PAYMENT_PAIDY_TYPE,
        },
        function (e, data_gateways) {
          if (data_gateways !== void 0 && data_gateways.length) {
            var select_gateway = null;
            data_gateways.forEach(function (gateway) {
              if (gateway.default_flg == 1) {
                select_gateway = gateway;
              }
            });
            if (select_gateway === null) {
              select_gateway = data_gateways[0];
            }

            getPaymentSettingInfo(params, function (data_setting) {
              if (data_setting.length && data_setting[0] != void 0) {
                data_setting = data_setting[0];

                if (
                  data_setting.payment_gateway_setting ==
                  TYPE_EFO_PAYMENT_METHOD_SETTING_YES
                ) {
                  var variable_payment_method =
                    data_setting.variable_payment_method;
                  var gateway_setting = data_setting.gateway_setting;

                  if (
                    typeof variable_payment_method !== "undefined" &&
                    mongoose.Types.ObjectId.isValid(variable_payment_method) &&
                    typeof gateway_setting !== "undefined"
                  ) {
                    params.variable_id = variable_payment_method;
                    getOneVariableValue(params, function (variable_result) {
                      var variable_value = null;
                      if (
                        variable_result[variable_payment_method] != void 0 &&
                        variable_result[variable_payment_method].value != void 0
                      ) {
                        variable_value =
                          variable_result[variable_payment_method].value;
                      } else if (
                        variable_result[variable_payment_method] != void 0 &&
                        variable_result[variable_payment_method] != void 0
                      ) {
                        variable_value =
                          variable_result[variable_payment_method];
                      }

                      if (variable_value) {
                        if (gateway_setting[variable_value] !== void 0) {
                          data_gateways.forEach(function (gateway) {
                            if (
                              gateway._id == gateway_setting[variable_value]
                            ) {
                              select_gateway = gateway;
                            }
                          });
                        }
                      }
                      console.log("select_gateway", select_gateway);

                      return callback(false, select_gateway);
                    });
                  }
                } else {
                  return callback(false, select_gateway);
                }
              } else {
                return callback(false, select_gateway);
              }
            });
          } else {
            return callback(false, default_paidy_gateway);
          }
        }
      );
    } else {
      return callback(true);
    }
  });
}

function decryptConvertJSON(ciphertext, key) {
  try {
    var decrypted = decrypt(key, ciphertext);
    return JSON.parse(decrypted);
  } catch (err) {
    return {};
  }
}

function execTranPaidy(params, price, callback) {
  var result = {};
  result["buyer"] = {
    email: params.email,
    name1: params.customer_name,
    name2: params.name_kana,
    phone: params.tel_num
  }

  result["order"] = {
    items: [{
      id: params.product_code,
      quantity: parseInt(price["order_quantity"].value),
      title: params.product_name,
      unit_price: parseInt(price["product_unit_price"].value)
    }],
    shipping: parseInt(price["order_shipping_fee"].value),
    tax: parseInt(price["order_tax"].value)
  }

  result["shipping_address"] = {
    line1: params.building,
    line2: params.street,
    city: params.city,
    state: params.state,
    zip: params.zipcode
  }

  result["amount"] = parseInt(price["order_quantity"].value * price["product_unit_price"].value) + parseInt(price["order_shipping_fee"].value) + parseInt(price["order_tax"].value);
  return callback(result);
}

function getVariableValue(params, callback) {
  var variable_result = [];
  EfoMessageVariable.find(
    { connect_page_id: params.connect_page_id, user_id: params.user_id },
    function (err, result) {
      if (err) throw err;
      if (result && result.length > 0) {
        for (var i = 0, size = result.length; i < size; i++) {
          var row = result[i];
          var value = row.variable_value;
          if (params.encrypt_flg) {
            value = decryptConvertJSON(value, params.encrypt_key);
          }
          if (value instanceof Array) {
            value = arrayUnique(value);
          }
          variable_result[row.variable_id] = value;
        }
      }
      return callback(variable_result);
    }
  );
}

function getOneVariableValue(params, callback) {
  var variable_result = {};
  EfoMessageVariable.findOne(
    {
      connect_page_id: params.connect_page_id,
      user_id: params.user_id,
      variable_id: params.variable_id,
    },
    function (err, result) {
      if (err) throw err;
      if (result) {
        variable_result[params.variable_id] = convertVariableValue(
          params,
          result
        );
      }
      return callback(variable_result);
    }
  );
}

function arrayUnique(arr) {
  if (arr.length > 0) {
    arr = arr.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });
  }
  return arr;
}

function findCryptKeyOfUser(connect_page_id, user_id, callback) {
  var encrypt_key = "";

  if (connect_page_id != void 0 && user_id != void 0) {
    UserCryptKey.findOne(
      { connect_page_id: connect_page_id, user_id: user_id },
      function (err, result) {
        if (err) throw err;
        if (result && result.salt != void 0) {
          encrypt_key = result.salt;
          return callback(true, encrypt_key);
        } else {
          return callback(true, encrypt_key);
        }
      }
    );
  } else {
    return callback(true, encrypt_key);
  }
}

module.exports = router;
