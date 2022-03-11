## **EFO パルプランニング**
## 1. Api radio license type
Returns json data about a license type.

- **URL**

  /api/pal/radioLicenseType

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "type": "004",
         "name": "radio_license_type",
         "data": [
             {
                 "value": "普通車AT",
                 "text": "普通車AT"
             },
             {
                 "value": "普通車MT",
                 "text": "普通車MT"
             },
             {
                 "value": "その他",
                 "text": "その他"
             }
         ]
     }`

## 2. Api radio school type
Returns json data about a school type.

- **URL**

  /api/pal/radioSchoolType

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "type": "004",
         "name": "radio_school_type",
         "data": [
             {
                 "value": "合宿",
                 "text": "合宿"
             },
             {
                 "value": "通学",
                 "text": "通学"
             }
         ]
     }`

## 3. Api pulldown area
Returns json data about a area.

- **URL**

  /api/pal/pulldownArea

- **Method:**

  `GET`

- **Data Params**
    + current_url_title
    + school_type
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    ` {
          "type": "006",
          "data": [
              {
                  "value": "北海道",
                  "text": "北海道",
                  "parent_option": [
                      {
                          "name": "radio_school_type",
                          "value": "合宿"
                      }
                  ]
              }
              ...
          ],
          "default_value": [
              ""
          ],
          "name": "pulldown_area",
          "parent_name": [
              "radio_school_type"
          ]
      }`

## 4. Api pulldown school
Returns json data about a school.

- **URL**

  /api/pal/pulldownSchool

- **Method:**

  `GET`

- **Data Params**
    + current_url_title
    + school_type
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "type": "006",
         "data": [
             {
                 "value": "中央バス自動車学校",
                 "text": "中央バス自動車学校（北海道）",
                 "parent_option": [
                     {
                         "name": "pulldown_area",
                         "value": "北海道"
                     },
                     {
                         "name": "radio_school_type",
                         "value": "合宿"
                     }
                 ]
             }
             ...
         ],
         "default_value": [
             null
         ],
         "name": "pulldown_school",
         "parent_name": [
             "pulldown_area",
             "radio_school_type"
         ]
     }`

## 5. Api pulldown start month of school
Returns json data about a start month.

- **URL**

  /api/pal/pulldownSchoolStartMonth

- **Method:**

  `GET`

- **Data Params**
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "type": "006",
         "name": "pulldown_school_start_month",
         "parent_name": [
             "pulldown_school",
             "radio_license_type"
         ],
         "data": [
             {
                 "value": "03",
                 "text": "03",
                 "parent_option": [
                     {
                         "name": "pulldown_school",
                         "value": "千葉マリーナ・ドライビングスクール（五井自動車教習所）"
                     },
                     {
                         "name": "radio_license_type",
                         "value": "普通車AT"
                     }
                 ]
             }
             ...
         ]
     }`
     
 ## 6. Api calendar start time of school
 Returns json data about a start time.
 
 - **URL**
 
   /api/pal/calendarSchoolStartTime
 
 - **Method:**
 
   `GET`
 
 - **Data Params**     
     
 - **Success Response:**
 
   - **Code:** 200
     **Content:** 
     
     `{
          "parent_name": [
              "pulldown_school",
              "radio_license_type"
          ],
          "input_follow_month": "pulldown_school_start_month",
          "option_date": [
              {
                  "mode": "available",
                  "date": [
                        "2020-06-29",
                        "2020-06-30"
                        ...
                  ],
                  "parent_option": [
                      {
                          "name": "pulldown_school",
                          "value": "田上自動車学校"
                      },
                      {
                          "name": "radio_license_type",
                          "value": "普通車MT"
                      }
                  ]
              },
              ...
          ]
      }`

## 7. Api pulldown room type
 Returns json data about a room type.
 
 - **URL**
 
   /api/pal/pulldownRoomType
 
 - **Method:**
 
   `GET`
 
 - **Data Params**     
     
 - **Success Response:**
 
   - **Code:** 200
     **Content:** 
     
     `{
          "type": "006",
          "parent_name": [
              "pulldown_school"
          ],
          "data": [
              {
                  "value": "ツインA",
                  "text": "ツインA",
                  "parent_option": [
                      {
                          "name": "pulldown_school",
                          "value": "マジオドライバーズスクール藤枝校"
                      }
                  ]
              },
              ...
          ]
      }`
      
## 8. Api get price
 Returns json data about a price.
 
 - **URL**
 
   /api/pal/getPrice
 
 - **Method:**
 
   `GET`
 
 - **Data Params**
     + school_name
     + room_name
     + start_time
     + license_type
     
 - **Success Response:**
 
   - **Code:** 200
     **Content:** 
     
     `{
          "end_time": "2020-06-29",
          "price_total": "1000"
      }`
      
## 9. Api custom description push salesforce
 Returns text description.
 
 - **URL**
 
   /api/pal/descriptionSalesforce
 
 - **Method:**
 
   `GET`
 
 - **Data Params**
     + commitment
     + number_people
     + request
     + question
     + room_type
     
 - **Success Response:**
 
   - **Code:** 200
     **Content:** 
     
     `{
          "description": "こだわり：; 人数：; 問合せ内容：; 質問：; 部屋タイプ："
      }`