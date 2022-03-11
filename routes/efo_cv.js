// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
const config = require('config');
var request = require('request');
var router = express.Router();
var model = require('../model');
const EfoMessageVariable = model.EfoMessageVariable;
const Variable = model.Variable;

const variable_cv_info = ["serial", "cv_count"];

/*GET product price*/
router.post('/cv_count', function(req, res, next){
    var request_body = req.body;
    var connect_page_id = request_body.cpid;
    var user_id = request_body.user_id;
    var response = {};
    var index1 = 0;
    var fun1;
    getVariableId(connect_page_id, index1, variable_cv_info, fun1 = function(next, variable_id, variable_name) {
        if (next) {
            /*store variable value*/
            getEfoMessageVariable(connect_page_id, user_id, variable_id, variable_name, function (is_success, variable_result) {
                if(is_success){
                    response[variable_name] = variable_result;
                    /*callback*/
                    getVariableId(connect_page_id, ++index1, variable_cv_info, fun1);
                }else{
                    res.status(500).json({error_message: "エラーが発生しました。"});
                }
            });
        }else{
            res.status(200).json(response);
        }
    });
});

function getVariableId(connect_page_id, index, arr, callback){
    if(arr[index]){
        var variable_name = arr[index];
        var now = new Date();
        Variable.findOneAndUpdate({connect_page_id: connect_page_id, variable_name: variable_name},
            {
                $setOnInsert: {created_at: now, updated_at: now}
            },
            {upsert: true, multi: false, new: true}, function (err, result) {
                if (err) throw err;
                return callback(true, result._id, variable_name);
            });
    }else{
        return callback(false);
    }
}

function getEfoMessageVariable(connect_page_id, user_id, variable_id, variable_name, callback){
    EfoMessageVariable.findOne({connect_page_id: connect_page_id, variable_id: variable_id} , {}, {sort: {created_at: -1}}, function (err, result) {
        if (err) throw err;
        var variable_value = '';
        if(result) {
            var value = result.variable_value;
            if(variable_name == 'serial'){
                variable_value = (parseInt(value) < 999) ? ("00" + (parseInt(value) + 1)).slice (-3) : (parseInt(value) + 1).toString();
            }else if(variable_name == 'cv_count'){
                variable_value = parseInt(value) + 1;
            }
        }else{
            if(variable_name == 'serial'){
                variable_value = '001';
            }else if(variable_name == 'cv_count'){
                variable_value = 1;
            }
        }
        console.log('variable value = ', user_id, variable_value);
        if(variable_value != ''){
            return callback(true, variable_value);
        }else{
            return callback(false);
        }
    });
}

module.exports = router;

