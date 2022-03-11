// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
exports.data = {
    list_link_area: [
        { 
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/04FRA/45or/471/" ,
            value: 'area_1',
            status : 1,
            name: 'フランクフルト'
        },
        { 
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/04MUC/45or/471/" ,
            value: 'area_2',
            status : 1,
            name: 'ミュンヘン'
        },
        { 
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/04BER/45or/471/" ,
            value: 'area_3',
            status : 1,
            name: 'フランクフルト'
        },
        { 
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/04DUS/45or/471/" ,
            value: 'area_4',
            status : 1,
            name: 'デュッセルドルフ'
        },
        { 
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/04CGN/45or/471/" ,
            value: 'area_5',
            status : 1,
            name: 'ケルン'
        },
        { 
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/04HAM/45or/471/" ,
            value: 'area_6',
            status : 1,
            name: 'ハンブルク'
        },
        { 
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/04HAM/45or/471/" ,
            value: 'area_7',
            status : 1,
            name: 'ローテンブルク'
        },
        { 
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/04STR/45or/471/" ,
            value: 'area_8',
            status : 1,
            name: 'シュトゥットガルト'
        },
        { 
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/04DRS/45or/471/" ,
            value: 'area_9',
            status : 1,
            name: 'ドレスデン'
        },
        { 
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/04E85/45or/471/" ,
            value: 'area_10',
            status : 1,
            name: 'フュッセン'
        }
    ],
    list_link_topic: [
        {
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/20Y/211-1/41%83%8D%83%7D%83%93%83e%83B%83b%83N%8AX%93%B9%81%40/44AND/471/",
            value:"topic_1",
            status:1,
            name:"ロマンティック街道",
        },
        {
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/41%96%BC%95%A8%97%BF%97%9D/45or/471/",
            value:"topic_2",
            status:1,
            name:"伝統料理",
        },
        {
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/41%83%89%83C%83%93%90%EC%81%40%83%89%83C%83%93%89%CD/44or/45or/471/",
            value:"topic_3",
            status:1,
            name:"ライン川",
        },
        {
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/20Y/211-1/41%83%7D%83C%83Z%83%93/44AND/471/",
            value:"topic_4",
            status:1,
            name:"マイセン",
        },
        {
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/18150000/45or/461/471/",
            value:"topic_5",
            status:1,
            name:"激安ツアー",
        },
        {
            link:"https://www.travel.co.jp/src/it/02EUROPE/03DE/32-1079/45or/",
            value:"topic_6",
            status:1,
            name:"添乗員同行",
        }
    ],
    link_guide: "https://www.travel.co.jp/guide/archive/list/world/p64/",
    element:{
        tour:{
            page_info : ".pager_link"
        },
        page_detail_tour:{
            title:".resultlist .cv .cv_head .cv_dep_ttl",
            tour_link:".resultlist .cv .cv_head .cv_ttl_txt a",
            price_note:".resultlist .cv .cv_price .cv_price_note",
            price:".resultlist .cv .cv_price .cv_price_range",
            link_image:'#pntDtl > img',
        },
        guide:{
            page_info : ".article_footer .pager_link"
        },
        page_detail_guide:{
            matome_title:"#matome_area .title_mod",
            matome_link:"#matome_area .entry_list .entry_item a:first-child",
            matome_image:"#matome_area .entry_list .entry_item a:first-child  img.lazyloaded",
            article_title:"#article_area  .title_mod",
            article_link:"#article_area .entry_list .entry_item > a:nth-child(1)",
            article_image:"#article_area .entry_list .entry_item a:first-child  img.lazyloaded"
        },
    },

}