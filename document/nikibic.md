## **EFO カレンダー連携　東京アクネクリニック**
## 1. Api calendar
Returns json data about a calendar.

- **URL**

  /api/nikibic/calendar

- **Method:**

  `POST`

- **Data Params**
    + store_name
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "type": "009",
         "mode": "unavailable",
         "date": [
             "2020-03-14",
             ...
         ],
         "list_date_disable": []
     }`
     
## 2. Api pulldown time working
Returns json data about a time.

- **URL**

  /api/nikibic/timeList

- **Method:**

  `POST`

- **Data Params**
     + date
     + store_name

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
         "type": "006",
         "name": "pulldown_time",
         "data": [
            {
                "value": "10:00～12:00",
                "text": "10:00～12:00"
            },
            ...
         ]
     }`
