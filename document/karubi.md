## **LINEボット　カルビー公式**
## 1. Api carousel creator
Returns json data about a creator.

- **URL**

  /api/karubi/creator

- **Method:**

  `POST`

- **Data Params**
    + creator
    + cpid
    + current_scenario_id
    + connect_scenario_id
    + detail_connect_scenario_id
    + line_id
    + no_result_scenario_id
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "message": [
             {
                 "type": "text",
                 "text": "生産者をご紹介します。"
             },
             {
                 "type": "template",
                 "altText": "カルビー",
                 "template": {
                     "type": "carousel",
                     "columns": [
                         {
                             "text": "大河　喜義",
                             "thumbnailImageUrl": "https://www.calbee.co.jp/jagaimo/binout.php?f=",
                             "title": "大河　喜義",
                             "actions": [
                                 {
                                     "type": "postback",
                                     "label": "応援する",
                                     "data": "BSCENARIO_-1_-1_-1_5b+c5o+044GZ44KL"
                                 }
                             ]
                         },
                        ...
                             "text": "「生産者の想いやこだわり」\n\r\n輪作体系を守り、堆肥、緑肥など取り入れて土つくりをしています。\n\r\n ...",
                             "thumbnailImageUrl": "https://www.calbee.co.jp/jagaimo/binout.php?f=671",
                             "title": "平和生産組合",
                             "actions": [
                                 {
                                     "type": "postback",
                                     "label": "応援する",
                                     "data": "BSCENARIO_-1_-1_-1_5b+c5o+044GZ44KL"
                                 }
                             ]
                         }
                     ]
                 }
             },
             {
                 "type": "template",
                 "altText": "更に見ますか",
                 "template": {
                     "type": "buttons",
                     "text": "更に見ますか",
                     "actions": [
                         {
                             "type": "postback",
                             "label": "更に見ます",
                             "data": "BSCENARIO_-1_-1_-1_5pu044Gr6KaL44G+44GZ",
                             "displayText": "更に見ます"
                         }
                     ]
                 }
             }
         ]
     }`
     
## 2. Api view more carousel creator
Returns json data about a creator.

- **URL**

  /api/karubi/creator

- **Method:**

  `POST`

- **Data Params**
    + load_more_flg
    + creator
    + cpid
    + current_scenario_id
    + connect_scenario_id
    + detail_connect_scenario_id
    + line_id
    + no_result_scenario_id

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
         "message": [
             {
                 "type": "text",
                 "text": "生産者をご紹介します。"
             },
             {
                 "type": "template",
                 "altText": "カルビー",
                 "template": {
                     "type": "carousel",
                     "columns": [
                         {
                             "text": "大河　喜義",
                             "thumbnailImageUrl": "https://www.calbee.co.jp/jagaimo/binout.php?f=",
                             "title": "大河　喜義",
                             "actions": [
                                 {
                                     "type": "postback",
                                     "label": "応援する",
                                     "data": "BSCENARIO_-1_-1_-1_5b+c5o+044GZ44KL"
                                 }
                             ]
                         },
                        ...
                             "text": "「生産者の想いやこだわり」\n\r\n輪作体系を守り、堆肥、緑肥など取り入れて土つくりをしています。\n\r\n ...",
                             "thumbnailImageUrl": "https://www.calbee.co.jp/jagaimo/binout.php?f=671",
                             "title": "平和生産組合",
                             "actions": [
                                 {
                                     "type": "postback",
                                     "label": "応援する",
                                     "data": "BSCENARIO_-1_-1_-1_5b+c5o+044GZ44KL"
                                 }
                             ]
                         }
                     ]
                 }
             }
         ]
     }`

## 3. Api  carousel area
Returns json data about a area.

- **URL**

  /api/karubi/area

- **Method:**

  `POST`

- **Data Params**
    + area
    + current_scenario_id
    + creator_scenario_id
    + hinshu_scenario_id
    + factory_scenario_id
    + no_result_scenario_id

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
         "message": [
             {
                 "type": "text",
                 "text": "ジャガイモの生産地はこちら！"
             },
             {
                 "type": "template",
                 "altText": "カルビー",
                 "template": {
                     "type": "carousel",
                     "columns": [
                         {
                             "text": "北海道　十勝地方",
                             "thumbnailImageUrl": "https://www.calbee.co.jp/jagaimo/common/img/data/place/0112.jpg",
                             "title": "北海道　十勝地方",
                             "actions": [
                                 {
                                     "type": "postback",
                                     "label": "品種について",
                                     "data": "BSCENARIO_-1_-1_-1_5ZOB56iu44Gr44Gk44GE44Gm"
                                 },
                                 {
                                     "type": "postback",
                                     "label": "生産者について",
                                     "data": "BSCENARIO_-1_-1_-1_55Sf55Sj6ICF44Gr44Gk44GE44Gm"
                                 },
                                 {
                                     "type": "postback",
                                     "label": "工場について",
                                     "data": "BSCENARIO_-1_-1_-1_5bel5aC044Gr44Gk44GE44Gm"
                                 }
                             ]
                         },
     					...
                             "text": "北海道　網走地方",
                             "thumbnailImageUrl": "https://www.calbee.co.jp/jagaimo/common/img/data/place/0111.jpg",
                             "title": "北海道　網走地方",
                             "actions": [
                                 {
                                     "type": "postback",
                                     "label": "品種について",
                                     "data": "BSCENARIO_-1_-1_-1_5ZOB56iu44Gr44Gk44GE44Gm"
                                 },
                                 {
                                     "type": "postback",
                                     "label": "生産者について",
                                     "data": "BSCENARIO_-1_-1_-1_55Sf55Sj6ICF44Gr44Gk44GE44Gm"
                                 },
                                 {
                                     "type": "postback",
                                     "label": "工場について",
                                     "data": "BSCENARIO_-1_-1_-1_5bel5aC044Gr44Gk44GE44Gm"
                                 }
                             ]
                         }
                     ]
                 }
             }
         ]
     }`

## 4. Api  carousel hinshu
Returns json data about a hinshu.

- **URL**

  /api/karubi/hinshu

- **Method:**

  `POST`

- **Data Params**
    + hinshu
    + current_scenario_id
    + connect_scenario_id
    + variable_id
    + date
    + factory
    + no_result_scenario_id

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
         "message": [
             {
                 "type": "text",
                 "text": "この時期に使用されていたじゃがいもの品種をお知らせします。\n工場では１日にいろいろな種類のポテトチップスを生産しており、検索結果には当日使用した全てのじゃがいもの情報が出てきます。"
             },
             {
                 "type": "template",
                 "altText": "カルビー",
                 "template": {
                     "type": "carousel",
                     "columns": [
                         {
                             "text": "熟期：中早生\n花：白色",
                             "thumbnailImageUrl": "https://www.calbee.co.jp/jagaimo/common/img/data/hinshu/hinshu_ts.gif",
                             "title": "トヨシロ",
                             "actions": [
                                 {
                                     "type": "uri",
                                     "label": "詳しく見る",
                                     "uri": "https://www.calbee.co.jp/jagaimo/index.php?next=result_kigen&YYYY_key=2019&MM_key=11&DD=20&KOJYO=NU#breed_area"
                                 }
                             ]
                         }
     					...
                     ]
                 }
             }
         ]
     }`

## 5. Api  carousel factory
Returns json data about a factory.

- **URL**

  /api/karubi/factory

- **Method:**

  `POST`

- **Data Params**
    + factory
    + current_scenario_id
    + connect_scenario_id
    + variable_id
    + date
    + no_result_scenario_id

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
         "message": [
             {
                 "type": "text",
                 "text": "生産工場はこちらです。"
             },
             {
                 "type": "template",
                 "altText": "カルビー",
                 "template": {
                     "type": "carousel",
                     "columns": [
                         {
                             "text": "栃木県宇都宮市清原工業団地18-7",
                             "thumbnailImageUrl": "https://www.calbee.co.jp/jagaimo/common/img/data/kojo/factory_NU01.jpg",
                             "title": "新宇都宮工場",
                             "actions": [
                                 {
                                     "type": "uri",
                                     "label": "詳しく見る",
                                     "uri": "https://www.calbee.co.jp/jagaimo/index.php?next=result_kigen&YYYY_key=2019&MM_key=11&DD=20&KOJYO=NU#factory_area"
                                 }
                             ]
                         }
                     ]
                 }
             }
         ]
     }`
     
## 6. Api transaction
Returns json data about a transaction.

- **URL**

  /api/karubi/transaction

- **Method:**

  `GET`

- **Data Params**
    + product_code

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
         "creator": "P1027544,P2631262,P2631152,P2626136,P1770575,P1730063,P1681618,P1650467,P1632065,P1631547,P1631448,P1621548,P1087911,P1086624,P1006006,P1005786,P5005148,P5005133",
         "hinshu": "TS,AD",
         "area": "0112,0108,0111",
         "factory": "NU",
         "date": "9L20"
     }`
## 7. Api show product
Returns json data about a product.

- **URL**

  /api/karubi/factory

- **Method:**

  `POST`

- **Data Params**
    + cpid
    + line_id
    + connect_scenario_id
    + current_scenario_id

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
         "message": [
             {
                 "type": "flex",
                 "altText": "カルビー",
                 "contents": {
                     "type": "bubble",
                     "body": {
                         "type": "box",
                         "layout": "vertical",
                         "contents": [
                             {
                                 "type": "image",
                                 "url": "https://botchan.blob.core.windows.net/production/uploads/5def0b6ba24a619db81457db/5e54687894711.jpg",
                                 "size": "full",
                                 "aspectMode": "cover",
                                 "aspectRatio": "1:1",
                                 "gravity": "center"
                             },
                             {
                                 "type": "box",
                                 "layout": "horizontal",
                                 "contents": [
                                     {
                                         "type": "box",
                                         "layout": "vertical",
                                         "contents": [
                                             {
                                                 "type": "button",
                                                 "action": {
                                                     "type": "uri",
                                                     "label": "詳細を見る",
                                                     "uri": "https://www.calbee.co.jp/products/detail/?p=20191227094153"
                                                 },
                                                 "style": "link",
                                                 "color": "#ffffff"
                                             }
                                         ],
                                         "offsetStart": "60px",
                                         "width": "130px",
                                         "cornerRadius": "xxl",
                                         "backgroundColor": "#000000cc"
                                     }
                                 ],
                                 "position": "absolute",
                                 "offsetBottom": "0px",
                                 "offsetStart": "0px",
                                 "offsetEnd": "0px",
                                 "paddingAll": "20px"
                             }
                         ],
                         "paddingAll": "0px"
                     }
                 }
             },
             {
                 "type": "text",
                 "text": "濃厚とろ～りチーズで満足感たっぷり！\n 明太子のピリ辛をマイルドなマヨの風味が包み込む、やみつき濃厚ピザポテトです♪"
             },
             {
                 "type": "flex",
                 "altText": "カルビー",
                 "contents": {
                     "type": "bubble",
                     "styles": {
                         "body": {
                             "backgroundColor": "#EEEEEE"
                         }
                     },
                     "body": {
                         "type": "box",
                         "layout": "vertical",
                         "contents": [
                             {
                                 "type": "spacer",
                                 "size": "xxl"
                             }
                         ]
                     },
                     "footer": {
                         "type": "box",
                         "layout": "horizontal",
                         "contents": [
                             {
                                 "type": "button",
                                 "style": "link",
                                 "action": {
                                     "type": "postback",
                                     "label": "他にも新商品を見る",
                                     "data": "BSCENARIO_-1_-1_他にも新商品を見る"
                                 }
                             }
                         ]
                     }
                 }
             }
         ]
     }`