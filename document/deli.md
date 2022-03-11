## **駅ちか＿シナリオ作成**
## 1. Api checkbox region
Returns json data about a region.

- **URL**

  /api/deli/region

- **Method:**

  `POST`

- **Data Params**   
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "data": [
             {
                 "value": "",
                 "text": "北海道・東北"
             },
             ...
         ]
     }`
     
## 2. Api checkbox area
Returns json data about a area.

- **URL**

  /api/deli/area

- **Method:**

  `POST`

- **Data Params**   
    + current_scenario_id
    + connect_scenario_id
    + variable_id
    + pref_code    
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "data": [
             {
                 "value": "1",
                 "text": "札幌・すすきの"
             },
             ...
         ]
     }`
     
## 3. Api checkbox pref
Returns json data about a pref.

- **URL**

  /api/deli/pref

- **Method:**

  `POST`

- **Data Params**   
    + current_scenario_id
    + connect_scenario_id
    + variable_id
    + region    
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "data": [
             {
                 "value": "1",
                 "text": "北海道"
             },
             ...
         ]
     }`

## 4. Api checkbox city
Returns json data about a city.

- **URL**

  /api/deli/city

- **Method:**

  `POST`

- **Data Params**   
    + current_scenario_id
    + connect_scenario_id
    + variable_id
    + area_code  
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "data": [
             {
                 "value": "1",
                 "text": "札幌市北区"
             },
             ...
         ]
     }`
     
## 5. Api checkbox time
Returns json data about a time.

- **URL**

  /api/deli/time

- **Method:**

  `GET`

- **Data Params**      
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         data: [
             {value: "", text: "特になし"},
             {value: "0-30", text: "～30分"},                 
             {value: "30-60", text: "30分～60分"},
             {value: "60-75", text: "60分～75分"},
             {value: "75-90", text: "75分～90分"},
             {value: "90-", text: "90分～"}
         ],
         btn_next : "次へ"
     }`
     
## 6. Api checkbox price
Returns json data about a price.

- **URL**

  /api/deli/price

- **Method:**

  `GET`

- **Data Params**      
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         data: [
             {value: "0-10000", text: "10,000円以下"},
             {value: "10000-13000", text: "10,000円～13,000円"},
             {value: "13000-16000", text: "13,000円～16,000円"},
             {value: "16000-20000", text: "16,000円～20,000円"},
             {value: "20000-30000", text: "20,000円～30,000円"},
             {value: "30000-", text: "30000円以上"},
         ],
         btn_next : "次へ"
     }`
     
## 7. Api checkbox style
Returns json data about a style.

- **URL**

  /api/deli/style

- **Method:**

  `GET`

- **Data Params**      
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         data: [
             {value: "0", text: "デリヘル"},
             {value: "1", text: "ホテヘル"},
             {value: "3", text: "箱ヘルス"},
             {value: "4", text: "ピンサロ"},
             {value: "6", text: "メンズエステ"},
             {value: "5", text: "ソープ"},
 
         ],
         btn_next : "次へ"
     }`
     
## 8. Api checkbox genre
Returns json data about a genre.

- **URL**

  /api/deli/genre_id

- **Method:**

  `GET`

- **Data Params**      
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         data: [
             {value: "23", text: "AV女優在籍"},
             {value: "14", text: "巨乳・爆乳"},
             {value: "6", text: "人妻・熟女"},
             {value: "1", text: "回春性感"},
             {value: "22", text: "ギャル"},
             {value: "13", text: "素人・未経験"},
             {value: "20", text: "ロリ・妹系"},
             {value: "15", text: "ぽちゃ・デブ"},
             {value: "21", text: "OL・お姉さん"},
             {value: "7", text: "韓ﾃﾞﾘ・アジアン"},
             {value: "9", text: "金髪・ﾌﾞﾛﾝﾄﾞ"},
             {value: "17", text: "学園・教師"}
         ],
         btn_next : "次へ"
     }`
     
## 9. Api get param in current url
Returns json data about a param value.

- **URL**

  /api/deli/get_param

- **Method:**

  `GET`

- **Data Params**      
    +current_url
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         style_id: [0],
         pref_id: [123]
     }`
 
## 10. Api get address component
Returns json data about address component.

- **URL**

  /api/deli/get_local_address

- **Method:**

  `GET`

- **Data Params**      
    + lat
    + long
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         distance: 4,1,
         city_code: [1],
         pref_code: [1],
         area_code: [123]
     }`
     
## 10. Api recommend store
Returns json data about store.

- **URL**

  /api/deli/recommend_girl

- **Method:**

  `POST`

- **Data Params**      
    + pref_code
    +  area_code
    + city_code
    + style_id
    + service_time
    + price
    + genre_id
    + load_more_connect_scenario_id
    + genre_connect_scenario_id
    + user_device
    + first_text
    + reload_connect_scenario_id
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "message": [
             {
                 "type": "text",
                 "text": "このエリアに派遣できるオススメ店舗はこちらです。"
             },
             {
                 "attachment": {
                     "payload": {
                         "template_type": "generic",
                         "elements": [
                             {
                                 "title": "SAPPORO 医乳",
                                 "subtitle": "<p>札幌・すすきの / デリヘル</p><ul><li><span class=\"set_time\"></span><p>09:00-翌4:00</p></li><li><span class=\"set_price\"></span><p>60分 ￥9,000</p></li></ul>",
                                 "item_url": "https://ranking-deli.jp/1/shop/9154/",
                                 "image_url": "https://dv6drgre1bci1.cloudfront.net/files.ranking-deli.jp/01445/334916/img1s_20200127153314.jpg",
                                 "image_url_sub": [
                                     "https://dv6drgre1bci1.cloudfront.net/files.ranking-deli.jp/01445/334916/img1s_20200127153314.jpg",
                                     "https://dv6drgre1bci1.cloudfront.net/files.ranking-deli.jp/01445/334899/img1s_20200222161606.jpg",
                                     "https://dv6drgre1bci1.cloudfront.net/files.ranking-deli.jp/01445/787915/img1s_20200131195705.jpg"
                                 ],
                                 "header": {
                                     "label_left": "本日出勤",
                                     "label_right": "13人"
                                 },
                                 "buttons": [
                                     {
                                         "title": "詳細を見る",
                                         "type": "web_url",
                                         "url": "https://ranking-deli.jp/1/shop/9154/"
                                     }
                                 ]
                             }
                             ...                         
                         ],
                         "header": {
                             "label_left": "本日出勤",
                             "label_right": "11人"
                         },
                         "buttons": [
                             {
                                 "title": "詳細を見る",
                                 "type": "web_url",
                                 "url": "https://ranking-deli.jp/1/shop/22321/"
                             }
                         ]
                     }
                 ],
                 "text_short_flg": 0
             },
             "type": "template"
         }
     },
     {
         "attachment": {
             "type": "template",
             "payload": {
                 "template_type": "button",
                 "text": "▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ",
                 "buttons": [
                     {
                         "type": "postback",
                         "title": "条件を変える",
                         "payload": "BSCENARIO_-1_-1_-1_5p2h5Lu244KS5aSJ44GI44KL"
                     }
                 ]
             }
         }
     }
 ],
 "count": 5
}`

## 11. Api load more store
Returns json data about store.

- **URL**

  /api/deli/recommend_girl

- **Method:**

  `POST`

- **Data Params**      
    + load_more
    + load_more_connect_scenario_id
    + genre_connect_scenario_id
    + pref_code
    + area_code
    + city_code
    + style_id
    + service_time
    + price
    + genre_id
    + user_device
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "message": [
             {
                 "type": "text",
                 "text": "このエリアに派遣できるオススメ店舗はこちらです。"
             },
             {
                 "attachment": {
                     "payload": {
                         "template_type": "generic",
                         "elements": [
                             {
                                 "title": "SAPPORO 医乳",
                                 "subtitle": "<p>札幌・すすきの / デリヘル</p><ul><li><span class=\"set_time\"></span><p>09:00-翌4:00</p></li><li><span class=\"set_price\"></span><p>60分 ￥9,000</p></li></ul>",
                                 "item_url": "https://ranking-deli.jp/1/shop/9154/",
                                 "image_url": "https://dv6drgre1bci1.cloudfront.net/files.ranking-deli.jp/01445/334916/img1s_20200127153314.jpg",
                                 "image_url_sub": [
                                     "https://dv6drgre1bci1.cloudfront.net/files.ranking-deli.jp/01445/334916/img1s_20200127153314.jpg",
                                     "https://dv6drgre1bci1.cloudfront.net/files.ranking-deli.jp/01445/334899/img1s_20200222161606.jpg",
                                     "https://dv6drgre1bci1.cloudfront.net/files.ranking-deli.jp/01445/787915/img1s_20200131195705.jpg"
                                 ],
                                 "header": {
                                     "label_left": "本日出勤",
                                     "label_right": "13人"
                                 },
                                 "buttons": [
                                     {
                                         "title": "詳細を見る",
                                         "type": "web_url",
                                         "url": "https://ranking-deli.jp/1/shop/9154/"
                                     }
                                 ]
                             }
                             ...                         
                         ],
                         "header": {
                             "label_left": "本日出勤",
                             "label_right": "11人"
                         },
                         "buttons": [
                             {
                                 "title": "詳細を見る",
                                 "type": "web_url",
                                 "url": "https://ranking-deli.jp/1/shop/22321/"
                             }
                         ]
                     }
                 ],
                 "text_short_flg": 0
             },
             "type": "template"
         }
     },
     {
         "attachment": {
             "type": "template",
             "payload": {
                 "template_type": "button",
                 "text": "▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ",
                 "buttons": [
                     {
                         "type": "postback",
                         "title": "条件を変える",
                         "payload": "BSCENARIO_-1_-1_-1_5p2h5Lu244KS5aSJ44GI44KL"
                     }
                 ]
             }
         }
     }
 ],
 "count": 5
}`