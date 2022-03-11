## **EFO 予約カレンダー・スプレッドシート連携開発　大塚形成外科・アクネスタジオ（永沼）**
## 1. Api pulldown time
Returns json data about a time.

- **URL**

  /api/acne/timeList

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
         "data": [
             {
                 "value": "10:00",
                 "text": "10:00"
             },
             ...
         ]
     }`