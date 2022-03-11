# guideline kateikyoushi
## Note
-  Using 3rd party API
 const base_url_info = "https://stgkatekyo.kuraveil.jp/api/v1/line/getClients";
const base_url_register = "https://stgkatekyo.kuraveil.jp/api/v1/line/postConversion";

## 1 API inquiry
- **Description**

- **URL**

  http://api.botchan.chat/api/kateikyoushi/get_type

- **Method:**

  `POST`

- **Data Params**
  + answer01
  + answer02　
  + answer03
  + zipcode
  + school
  + style
  + liff_url


- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    ```
   [
        {
            "type": "image",
            "originalContentUrl": url_image,
            "previewImageUrl": url_image
        },
        {
            "type": "text",
            "text": "お子様にピッタリの家庭教師センターはこちら！",
            "quickReply": {
                "items": [
                    {
                        "type": "action",
                        "action": {
                            "type": "postback",
                            "label": "見る",
                            "displayText": "見る",
                            "data": "BQUICK_REPLIES_" + current_scenario + "_" + connect_scenario_watch + "_-1_6KaL44KL_0"
                        }
                    }
                ]
            }
        }
    ]

    ```

## 2 API register
- **Description**

- **URL**

  http://api.botchan.chat/api/kateikyoushi/register

- **Method:**

  `POST`

- **Data Params**
  + "line_user_id"
  + "client_ids"
  + "slname"
  + "sfname"
  + "slkana"
  + "sfkana"
  + "zip"
  + "prefecture"
  + "addr1"
  + "addr2"
  + "addr3"
  + "tel"
  + "email"
  + "grade"
  + "postedStyle"
  + "optin"
  + "memo"
  ```
   {
                "line_user_id": line_user_id,
                "client_ids": client_id_list,
                "slname": slname,
                "sfname": sfname,
                "slkana": slkana,
                "sfkana": sfkana,
                "zip": zipcode,
                "prefecture": prefecture,
                "addr1": addr1,
                "addr2": addr2,
                "addr3": addr3,
                "tel": tel,
                "email": email,
                "grade": grade,
                "postedStyle": style,
                "optin": optin,
                "memo": memo
              }
  ```


- **Success Response:**
    **Code:** 
    + 200

    **Content:** 
    ```
   {
        success: 1
    }
    ```
    
    
## 3 API get_data_pulldown
- **Description**

- **URL**

   http://api.botchan.chat/api/kateikyoushi/get_data_pulldown

- **Method:**

  `POST`

- **Data Params**
    + school
    
  ```
    {
       "school":"小学生",
    }
  ```


- **Success Response:**
    **Code:** 
    + 200

    **Content:** 
    ```
   {
        data:  [
            { value: "11", text: "小1" },
            { value: "12", text: "小2" },
            { value: "13", text: "小3" },
            { value: "14", text: "小4" },
            { value: "15", text: "小5" },
            { value: "16", text: "小6" }
        ]
    }
    ```

    
## 4 API get_answear
- **Description**
 show list answear

- **URL**

   http://api.botchan.chat/api/kateikyoushi/get_answear

- **Method:**

  `POST`

- **Data Params**
  + user_id
  ```
    {
        "user_id": "5d1de122a24a61078f025568"
    }
  ```


- **Success Response:**
    **Code:** 
    + 200

    **Content:** 
    ```
   {
        template_type: "002",
        data: []
    }
    ```
    

