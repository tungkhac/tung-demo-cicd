# guideline karubi_2
## Note
-  Using 3rd party API to search store
http://es-sg-yv71hqhnh00046w8m.public.elasticsearch.aliyuncs.com:9200/distribution_*/_search
- Data preparation will automatically cronjob every day in the file cronjob.js to store category information and product information.

## 1 API select_category
- **Description**
  Show list category for user select
- **URL**

  http://api.botchan.chat/api/karubi_p2/select_category

- **Method:**

  `POST`

- **Data Params**
   {}


- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    BQUICK REPLIES message bot
    ```
      {
                    "type": "text",
                    "text": "調べたいジャンルを選んでください",
                    "quickReply": {
                        "items": []
                    }
                };  }
        ]

    ```

## 2 API select_sub_category
- **Description**
  Show list sub category for user select
- **URL**

  http://api.botchan.chat/api/karubi_p2/select_sub_category

- **Method:**

  `POST`

- **Data Params**
  + category
  ```
   {"category":"食感"}
  '''

- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    carousel message bot
    ```
     {
        "type": "template",
        "altText": "This is a carousel template",
        "template": {
            "type": "carousel",
            "columns": [
            ],
            "imageAspectRatio": "rectangle",
            "imageSize": "cover"
        }
    }

    ```
    
    
## 3 API search_product
- **Description**
  Show list product by categroty and sub category
- **URL**

  http://api.botchan.chat/api/karubi_p2/search_product

- **Method:**

  `POST`

- **Data Params**
    +  category
    +  sub_category
    +  current_id_scenario
    +  connect_id_scenario_store
    +  connect_id_scenario_product
    +  product_code_id
    +  product_calo_id
  ```
   {"category":"食感"}
  '''

- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    carousel message bot
    ```
    {
        "type": "template",
        "altText": "This is a carousel template",
        "template": {
            "type": "carousel",
            "columns": [
            ],
            "imageAspectRatio": "rectangle",
            "imageSize": "cover"
        }
    }

    ```

    
## 4 API infor_calorie
- **Description**
  Show list infor colorie by infor_calorie
- **URL**

  http://api.botchan.chat/api/karubi_p2/infor_calorie

- **Method:**

  `POST`

- **Data Params**
  + infor_calorie
  ```
   {"category":"食感"}
  '''

- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    carousel message bot
    ```
     {
        "type": "text",
        "text": data.infor_calorie
    }

    ```
    
## 5 API search_store
- **Description**
  Using 3rd party API to search store  by product_code , user_lat , user_long
http://es-sg-yv71hqhnh00046w8m.public.elasticsearch.aliyuncs.com:9200/distribution_*/_search
- **URL**

  http://api.botchan.chat/api/karubi_p2/search_store

- **Method:**

  `POST`

- **Data Params**
  + product_code
  + user_lat
  + user_long
  ```
   {
      "product_code": 19956,
      "user_lat": 35.667817971137296,
      "user_long": 139.60117030888796
    }
  '''

- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    carousel message bot
    ```
     {
            "type": "template",
            "altText": "This is a carousel template",
            "template": {
                "type": "carousel",
                "columns": [
                ],
                "imageAspectRatio": "rectangle",
                "imageSize": "cover"
            }
        }

    ```

