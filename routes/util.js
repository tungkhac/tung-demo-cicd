// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var model = require('../model');
var Exception = model.Exception;

function saveException(cpid, uid, errors, sub_type, type = "002") {
    var now = new Date();
    var exception = new Exception({
        err: errors,
        cpid: cpid,
        uid: uid,
        type: type,
        sub_type: sub_type,
        push_chatwork_flg: 0,
        created_at: now,
        updated_at: now
    });
    exception.save(function (err) {
    });
}

exports.saveException = saveException;