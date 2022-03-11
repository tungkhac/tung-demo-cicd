# guideline mynavi
## Note

- Data preparation will automatically cronjob every day in the file cronjob.js to store recommend information and point information.

## 1 API select_area
- **Description**
  Show list area for user select by area_type
- **URL**

  http://api.botchan.chat/api/mynavi/select_area

- **Method:**

  `POST`

- **Data Params**
    + area_type
    + current_id_scenario
    + connect_id_scenario
    + variable_id 
    
   ```
   {
   "area_type":"関東甲信越"
   }
   ```
   


- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    BQUICK REPLIES message bot
    ```
       {
                "type": "text",
                "text": "結婚式をあげたい都道府県を教えてください😉",
                "quickReply": {
                    "items": []
                }
            };

    ```

## 2 API show_carousel
- **Description**
  Show list remcommend by area, sort by type
- **URL**

  http://api.botchan.chat/api/mynavi/show_carousel

- **Method:**

  `POST`

- **Data Params**
    + user_name
    + area
    + type
    + continues_offset
    + line_id
    + current_id_scenario
    + connect_id_scenario
    + connect_id_scenario_0
    + connect_id_scenario_contact
    + favorites_id_scenario
    + variable_id
    + cpid
    + param_recommend
    + param_salon
  ```

  ```

- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    carousel message bot
    ```
    {
        "type": "template",
        "altText": "this is a carousel template",
        "template": {
            "type": "carousel",
            "columns": [
            ],
            "imageAspectRatio": "rectangle",
            "imageSize": "cover"
        }
    }

    ```
    
    
## 3 API add_favorite
- **Description**
  add favorite by line_id and carousel_info ---> save in database
- **URL**

  http://api.botchan.chat/api/mynavi/add_favorite

- **Method:**

  `POST`

- **Data Params**
    +  line_id
    +  carousel_info
    +  cpid
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
        message: "add favorite success"
    }

    ```

    
## 4 API remove_favorite
- **Description**
  remove select favorite by line_id and carousel_info 
- **URL**

  http://api.botchan.chat/api/mynavi/remove_favorite

- **Method:**

  `POST`

- **Data Params**
    +  line_id
    +  carousel_info
    +  cpid
  ```
   
  ```

- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    carousel message bot
    ```
     {
        message: "remove favorite success"
    }

    ```
    
## 5 API show_favorites
- **Description**
  SHow list favorite by line_id

- **URL**

  http://api.botchan.chat/api/mynavi/show_favorites

- **Method:**

  `POST`

- **Data Params**
    + continues_offset
    + line_id
    + current_id_scenario
    + connect_id_scenario
    + remove_favorite_screnario_id
    + variable_id
    + cpid
    + param_recommend
    + param_salon
  ```
  
  ```

- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    carousel message bot
    ```
     {
        "type": "template",
        "altText": "this is a carousel template",
        "template": {
            "type": "carousel",
            "columns": [
            ],
            "imageAspectRatio": "rectangle",
            "imageSize": "cover"
        }
    }

    ```

