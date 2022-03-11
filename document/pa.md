## **EFO カスタマイズ パートナーエージェント　高野**
## 1. Api pulldown area
Returns json data about a area.

- **URL**

  /api/p-a/areaList

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "type": "006",
         "name": "pulldown_area",
         "data": [
             {
                 "value": "北海道エリア",
                 "text": "北海道エリア"
             },
             ...
         ]
     }`

## 2. Api pulldown store
Returns json data about a store.

- **URL**

  /api/p-a/storeList

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "type": "006",
         "data": [
             {
                 "value": "札幌店",
                 "text": "札幌店",
                 "parent_option": [
                     {
                         "name": "pulldown_area",
                         "value": "北海道エリア"
                     }
                 ]
             },
             ...
         ]
     }`

## 3. Api pulldown time
Returns json data about a time.

- **URL**

  /api/p-a/timeList

- **Method:**

  `GET`

- **Data Params**
    + date    
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "type": "006",
         "name": "pulldown_time",
         "parent_name": [
             "pulldown_store"
         ],
         "data": [
             {
                 "value": "11:00",
                 "text": "11:00",
                 "parent_option": [
                     {
                         "name": "pulldown_store",
                         "value": "札幌店"
                     }
                 ]
             },
              ...
          ]
      }`
      
## 3. Api report
Returns json data about a report.

- **URL**

  /api/p-a/partnerRequest

- **Method:**

  `POST`

- **Data Params**
    + store_name
    + date_1
    + time_1
    + date_2
    + time_2
    + date_3
    + time_3
    + comment   
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
        comment: "■来店希望店舗：...   ■来店予約日時：【第一希望】...　【第二希望】...　【第三希望】...　■お客様コメント：...
    }`