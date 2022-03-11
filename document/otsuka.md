## **EFO 大塚美容形成外科＿カウンセリング予約**
## 1. Api calendar
Returns json data about a calendar.

- **URL**

  /api/otsuka/calendar

- **Method:**

  `POST`

- **Data Params**
    + store_name
    + department
    
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

  /api/otsuka/timeList

- **Method:**

  `POST`

- **Data Params**
     + date
     + store_name
     + department

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
