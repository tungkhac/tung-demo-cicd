## **Convert Data for Report**

Returns json data about a report.

- **URL**

  /convertData

- **Method:**

  `POST`

- **Data Params**

   + product_code
   + birth_day
   + name
   + furigana
   + current_url
   + address_pref
   + address_city
   + address_stress
 
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
    "product_code": 1,
    "product_quantity": 1,
    "product_name": "【毎月定期ｺｰｽ】ラクビ",
    "age": 20,
    "name": "てすと　テスト",
    "name_zenkaku": "てすと　テスト",
    "furigana": "テスト テスト",
    "furigana_hankaku": "ﾃｽﾄ ﾃｽﾄ",
    "birthday": "2000-02-03",
    "申込み媒体内容": "チャットボット_ラクビ_イングリウッド",
    "address": "",
    "order_id": 80000001
  }`

