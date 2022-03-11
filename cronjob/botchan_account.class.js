// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const model = require('../model');
const fs = require('fs');
var express = require('express');
const config = require('config');
var request = require('request');
var moment = require('moment-timezone');
const TIMEZONE = config.get('timezone');
const excel = require('node-excel-export');
const Users = model.Users;
const Master = model.Master;
const authority = {
    '001': 'admin',
    '002': 'agency',
    '003': 'client',
    '100': 'sale',
    '111': 'admin_bot',
    '112': 'sub_admin',
    '113': 'online_signup'
};

const sns_type = {
    '001': 'facebook',
    '002': 'line',
    '003': 'slack',
    '004': 'zalo',
    '005': 'web_embed',
    '006': 'web_embed_efo',
    '007': 'chatwork',
    '008': 'twitter',
};


const group_name = {
    '000' : 'unspecified',
    '001' : 'demo_create',
    '002' : 'developer',
};


class botchanAccount {
    constructor() {
    }

    async export() {
        var userData = await this.getUserData();
        console.log("userData", userData.length);
        await this.exportExcel(userData);
    }

    async exportExcel(dataset) {
        const styles = {
            headerYellow: {
                fill: {
                    fgColor: {
                        rgb: 'F2F411'
                    }
                },
                font: {
                    color: {
                        rgb: '000000'
                    },
                    sz: 14,
                    bold: false
                }
            }
        };

        // const heading = [
        //     [
        //         {value: 'id', style: styles.headerYellow},
        //         {value: 'email', style: styles.headerYellow},
        //         {value: '名前', style: styles.headerYellow},
        //         {value: 'グループ名', style: styles.headerYellow},
        //         {value: '企業名', style: styles.headerYellow},
        //         {value: '企業名', style: styles.headerYellow},
        //         {value: '権限請求タイプ', style: styles.headerYellow},
        //         {value: 'マージン', style: styles.headerYellow},
        //         {value: '利用可能ボット種', style: styles.headerYellow},
        //         {value: 'ユーザ数の上限', style: styles.headerYellow},
        //         {value: 'ボット数の上限', style: styles.headerYellow},
        //         {value: '作成者', style: styles.headerYellow},
        //         {value: 'ホワイトリストドメイン', style: styles.headerYellow}]
        // ];


        const specification = {
            'id': {
                displayName: 'id',
                headerStyle: styles.headerYellow,
                width: 120
            },
            'email': {
                displayName: 'email',
                headerStyle: styles.headerYellow,
                width: 120
            },
            '名前': {
                displayName: '名前',
                headerStyle: styles.headerYellow,
                width: 120
            },
            'グループ名': {
                displayName: 'グループ名',
                headerStyle: styles.headerYellow,
                width: 120
            },
            '企業名': {
                displayName: '企業名',
                headerStyle: styles.headerYellow,
                width: 120
            },//
            '権限': {
                displayName: '権限',
                headerStyle: styles.headerYellow,
                width: 120
            },
            '請求タイプ': {
                displayName: '請求タイプ',
                headerStyle: styles.headerYellow,
                width: 120
            },
            'マージン': {
                displayName: 'マージン',
                headerStyle: styles.headerYellow,
                width: 120
            },
            '利用可能ボット種': {
                displayName: '利用可能ボット種',
                headerStyle: styles.headerYellow,
                width: 120
            },
            'ユーザ数の上限': {
                displayName: 'ユーザ数の上限',
                headerStyle: styles.headerYellow,
                width: 120
            },
            'ボット数の上限': {
                displayName: 'ボット数の上限',
                headerStyle: styles.headerYellow,
                width: 120
            },
            '作成者': {
                displayName: '作成者',
                headerStyle: styles.headerYellow,
                width: 120
            },
            'ホワイトリストドメイン': {
                displayName: 'ホワイトリストドメイン',
                headerStyle: styles.headerYellow,
                width: 120
            }
        };


        // const dataset = [
        //     {
        //         'id': '1', 'email': 'vinh test', '名前': 'some note', 'グループ名': 'not shown', '企業名': '',
        //         '権限請求タイプ': '', 'マージン': '', '利用可能ボット種': '', 'ユーザ数の上限': '', 'ボット数の上限': '',
        //         '作成者': '', 'ホワイトリストドメイン': ''
        //     },
        //     {
        //         'id': '2', 'email': 'vinh test 2', '名前': 'some note', 'グループ名': 'not shown', '企業名': '2',
        //         '権限請求タイプ': '3', 'マージン': '4', '利用可能ボット種': '5', 'ユーザ数の上限': '6', 'ボット数の上限': '7',
        //         '作成者': '8', 'ホワイトリストドメイン': 'aaaa'
        //     }
        // ];


        const report = excel.buildExport(
            [
                {
                    name: 'Report',
                    // heading: heading,
                    specification: specification,
                    data: dataset
                }
            ]
        );

        fs.writeFile('./botchan_export/botchan_count.xlsx', report, (err) => {
            if (err) throw err;
            console.log('Done...');
        });

        return;
    }

    async getGroupName(group_name){
        return new Promise((resolve, reject) => {
            var data = {};
            Master.find({group: group_name, "active_flg": 1}, (err, result) => {
                if (err) throw err;
                if (result) {
                    result.forEach((row) => {
                        // console.log("code==", row.code);
                        // console.log("row.name_ja==", row.name_ja);
                        if(row.code) {
                            data[row.code] =  row.name_ja;
                        }
                    });
                    resolve(data);
                } else {
                    resolve(data);
                }
            })
        });
    }

    async getUserData(){
        return new Promise((resolve, reject) => {
            Users.find({deleted_at : null}, async(err, result) => {
                if (err) throw err;
                var data = [];
                if (result) {
                    console.log("result lenght==", result.length);
                     for (let i in  result) {
                            var row = result[i];
                            var user = {
                                'id': '',
                                'email': '',
                                '名前': '',
                                'グループ名': '',
                                '企業名': '',
                                '権限': '',
                                '請求タイプ': '',
                                'マージン': '',
                                '利用可能ボット種': '',
                                'ユーザ数の上限': '',
                                'ボット数の上限': '',
                                '作成者': '',
                                'ホワイトリストドメイン': ''
                            };

                            let user_create = '';
                            if(row.created_id != void(0)) {
                                let user_info =  await this.getUserCreate(row.created_id);
                                console.log("user_info==", user_info);
                                if(user_info) {
                                    user_create = user_info.name;
                                }
                            }

                            console.log("user_create==", user_create);

                            var sns_type_txt = '';
                            if(row.sns_type_list != void(0) && row.sns_type_list != '') {
                                let sns_type_list = row.sns_type_list;
                                for(let i in sns_type_list) {
                                     let sns_type_value = sns_type_list[i];
                                     sns_type_txt += sns_type[sns_type_value] + ',';
                                }
                            }

                            var auth = 'client';
                            if(row.authority != void(0) && row.authority != '') {
                                auth = authority[row.authority];
                            }

                            var user_group = '';
                            if(row.user_group_id != void(0) && row.user_group_id != '') {
                                console.log("user_group_id", row.user_group_id );
                                user_group = group_name[row.user_group_id];
                            }

                            var company_name = (row.company_name != void(0) && row.company_name != '') ?  row.company_name : '';
                            var plan = (row.plan != void(0) && row.plan != '') ?  row.plan : '';
                            var margin = (row.margin != void(0) && row.margin != '') ?  row.margin : '';
                            var max_user_number = (row.max_user_number != void(0) && row.max_user_number != '') ?  row.max_user_number : '';
                            var max_bot_number = (row.max_bot_number != void(0) && row.max_bot_number != '') ?  row.max_bot_number : '';
                            var white_list_domain = (row.white_list_domain != void(0) && row.white_list_domain.length > 0) ?  row.white_list_domain.join(',') : '';

                            console.log("plan====", plan);
                            console.log("max_user_number====", max_user_number);
                            console.log("max_bot_number====", max_bot_number);
                            user.id = row._id;
                            user.email = row.email;
                            user.名前 = row.name;
                            user.グループ名 = user_group;
                            user.企業名 = company_name;
                            user.権限 = auth;
                            user.請求タイプ = plan;
                            user.マージン = margin;
                            user.利用可能ボット種 = sns_type_txt;
                            user.ユーザ数の上限 =  max_user_number;
                            user.ボット数の上限 = max_bot_number;
                            user.作成者 = user_create;
                            user.ホワイトリストドメイン = white_list_domain;

                            // console.log("i====", i)
                            data.push(user);
                        }

                        resolve(data);
                } else {
                    resolve(data);
                }
            })
        });
    }

    async getUserCreate(user_id) {
        return new Promise((resolve, reject) => {
            Users.findOne({_id: user_id, deleted_at : null}, (err, result) => {
                // console.log(result);
                if (result) {
                    resolve(result);
                } else {
                    resolve(false);
                }
            });
        })
    }

}
 
module.exports = new botchanAccount().export();