// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const Parent = require('../routes/parent.class');
const model = require('../model');
const EfoCv = model.EfoCv;
const ConnectPage = model.ConnectPage;
const fs = require('fs');
const config_data = [
    {
        cpid: '60a75253a24a61c3c24f4c57',
        start_hour: 7,
        end_hour: 24,
        period: 1,
        send_email: "lethanhhai2008@gmail.com",
        list_cc: ["lethanhhai2008@gmail.com"],
        cv_count: 3
    }
];
// const LIST_CC = ['le.thanh.hai@miyatsu.vn'];
const USER_NAME = "TEST SEND BOT";
const config = require('config');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
const TIMEZONE_UTC = 'GMT0';
const mailer = require('nodemailer');
const transporter = mailer.createTransport({
    host: config.get('mail_host'),
    port: 25,
    secure: false,
    tls:{
        rejectUnauthorized: false
    }
});

var ejs = require('ejs');
class checkEFOCV extends Parent {
    constructor() {
        super();
    }
    async check() {
        var current_hour = parseInt(moment.tz(TIMEZONE).subtract(0, "hours").format("HH"));
        console.log("checkcheckcheckcheck", current_hour);
        this.asyncForEach(config_data, async (data) => {
            if (this.checkStartEnd(data, current_hour)) {
                let bot_infor = await ConnectPage.findOne({ "_id": data.cpid });
                if (bot_infor) {
                    let time_start = moment.tz(TIMEZONE_UTC).subtract(data.period, "hours").format("YYYY-MM-DDTHH:mm:ss");
                    let time_start_send = moment.tz(TIMEZONE).subtract(data.period, "hours").format("YYYY/MM/DD HH:00:00");
                    let time_end = moment.tz(TIMEZONE_UTC).subtract(0, "hours").format("YYYY-MM-DDTHH:mm:ss");
                    let time_end_send = moment.tz(TIMEZONE).subtract(0, "hours").format(" HH:00:00");
                    console.log('time_start: ',time_start );
                    console.log('time_end: ',time_end );
                    await EfoCv.aggregate([
                        {
                            $match: {
                                "connect_page_id": data.cpid,
                                "cv_flg" : 1
                            }
                        },
                        {
                            $project: {
                                updated_at: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S", date: "$updated_at" } },
                            },
                        },
                        {
                            $match: {
                                "updated_at": {
                                    $gt: time_start,
                                    $lte: time_end
                                }
                            }
                        }
                    ], async (err, result) => {
                        if (err) throw err
                        console.log('result', result.length);
                        if (result.length <= data.cv_count) {
                            let subject = "【監視CV】" + bot_infor.page_name;
                            this.sendMail(data.send_email, subject, result.length, bot_infor.page_name, data.cpid, time_start_send, time_end_send, data.list_cc);
                        }
                    });
                } else {
                    console.log("can not find bot ", data.cpid);
                }
            } else {
                console.log('bot ', data.cpid, ' not in time check')
            }
        })
    }

    checkStartEnd(data, current_hour) {
        var end_hour = data.end_hour;
        var start_hour = data.start_hour;
        var period = data.period;

        console.log(current_hour, start_hour, end_hour, period, (current_hour - start_hour) % period);

        if((current_hour - start_hour) % period != 0){
            return false;
        }

        console.log(current_hour, start_hour, end_hour, period, (current_hour - start_hour) % period);

        if(end_hour >= 24 && current_hour <= start_hour){
            end_hour = end_hour - 24;
            if(current_hour <= data.start_hour && current_hour <= end_hour) {
                return true;
            } else {
                return false;
            }
        }

        if (data.start_hour <= current_hour && data.end_hour >= current_hour) {
            return true;
        } else {
            return false;
        }
    }

    sendMail(sendTo, subject, number_cv, bot_name, bot_id, time_start, time_end, cc_list = []) {
        // let transporter = mailer.createTransport({
        //     host: config.get('mailServer').host,
        //     port: config.get('mailServer').port,
        //     secure: true,
        //     auth: {
        //         user: config.get('mailServer').user,
        //         pass: config.get('mailServer').pass
        //     }
        // });

        var path_file_ejs = __dirname.replace(new RegExp("\\\\", 'g'), '/') + "/ejs/efo_check_template.ejs";
        console.log(path_file_ejs);
        path_file_ejs = path_file_ejs.replace("cronjob/ejs/efo_check_template", "ejs/efo_check_template");
        let mailOptions = {
            // from: config.get('mailServer').user,
            from: config.get('mail_from'),
            to: sendTo,
            subject: subject,
            cc: cc_list,
            html: ejs.render(fs.readFileSync(path_file_ejs, 'utf-8'), {
                number_cv: number_cv,
                time_start: time_start,
                time_end: time_end
            })
        };
        console.log(mailOptions);
        transporter.sendMail(mailOptions, (error, info) => {
            console.log(error);
            if (error) {
                console.log(`Send mail to ${sendTo} bot ${bot_name} (${bot_id}) fail`);
                return console.log(error);
            }
            console.log(`Send mail to ${sendTo} bot ${bot_name} (${bot_id}) success`);
        });
    }
}

//
// var c = new checkEFOCV();
// c.check();

module.exports = checkEFOCV;
