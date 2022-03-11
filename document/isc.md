# guideline isc.js
## 1 API store
- **Description**
  + Post CV data to "Interview Maker" using Using 3rd party API    "https://v4.interview-maker.com/extapi/v1/adoption"
- **URL**

  http://api.botchan.chat/api/isc/store

- **Method:**

  `POST`

- **Data Params**
    + accesskey
    + url
    + recruit_id
    + email
    + password
    + name
    + gender
    + telno
    + prefecture_cd
    + city_cd
    + remark

   ```
   {
        "title":"オークラホーム泉田｜オークラホーム岡山支店"
    }
   ```


- **Success Response:**
    **Code:** 
     + return json format {}
    **Content:** 
    ```
   {}

    ```
- **Error Response:**
    + SaveException  in database
    
    **Content:** 
    + return json format {}
    ```
     {}

    ```



    
